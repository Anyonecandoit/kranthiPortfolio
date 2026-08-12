import { NextRequest } from "next/server";
import { completeOpenRouter } from "@/lib/openrouter";
import { resumeToMarkdown, resumeData } from "@/data/resume";
import { extractTextFromPdf } from "@/lib/pdf";
import type { MatchResult } from "@/lib/api-types";

export type { MatchResult };

function overallFor(score: number): MatchResult["overall"] {
  if (score >= 85) return "Excellent";
  if (score >= 70) return "Strong";
  if (score >= 50) return "Moderate";
  return "Weak";
}

const clamp = (n: number, min = 0, max = 100) => Math.min(max, Math.max(min, Math.round(n)));

const json = (body: unknown, status: number) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

/* ------------------------------------------------------------------ */
/* LLM scoring                                                          */
/* ------------------------------------------------------------------ */

const SCORER_SYSTEM =
  "You are a precise recruiting analyst. You score job descriptions against a candidate's resume and report structured JSON. Never invent skills, experience, or facts about the candidate.";

function buildScoringPrompt(jd: string, resumeText: string): string {
  return `Score this JOB DESCRIPTION against the CANDIDATE RESUME.

CANDIDATE RESUME (single source of truth):
${resumeText}

JOB DESCRIPTION:
${jd}

Return ONLY valid JSON — no markdown fences, no commentary, no trailing text — with EXACTLY this shape:
{
  "matchScore": <integer 0-100>,
  "matchedSkills": ["<resume skill that fits the JD>", ...],
  "missingSkills": ["<JD skill the candidate lacks>", ...],
  "relevantExperience": ["<1-3 short bullets tying the JD to the candidate's actual experience>", ...],
  "relevantProjects": ["<1-3 project titles + why relevant>", ...],
  "recommendation": "<2-3 sentence recommendation to the recruiter>",
  "interviewQuestions": ["<5 probing interview questions>", ...]
}

Rules:
- Base everything strictly on the resume. If the resume does not support a claim, omit it.
- matchedSkills = the candidate's skills that the JD requires or clearly implies.
- missingSkills = skills the JD requires that the candidate does not have.
- Score objectively: 100 = near-perfect fit, 0 = no overlap.`;
}

function parseMatchJson(content: string): Omit<MatchResult, "source"> | null {
  const cleaned = content.replace(/```(?:json)?/gi, "").trim();
  const candidates = [cleaned];
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start >= 0 && end > start) candidates.push(cleaned.slice(start, end + 1));

  for (const c of candidates) {
    try {
      const obj = JSON.parse(c) as Record<string, unknown>;
      if (typeof obj.matchScore !== "number") continue;
      const strArr = (v: unknown, limit: number) =>
        Array.isArray(v) ? v.map(String).slice(0, limit) : [];
      return {
        matchScore: clamp(obj.matchScore),
        overall: overallFor(obj.matchScore),
        matchedSkills: strArr(obj.matchedSkills, 40),
        missingSkills: strArr(obj.missingSkills, 40),
        relevantExperience: strArr(obj.relevantExperience, 6),
        relevantProjects: strArr(obj.relevantProjects, 6),
        recommendation: typeof obj.recommendation === "string" ? obj.recommendation : "",
        interviewQuestions: strArr(obj.interviewQuestions, 8),
      };
    } catch {
      /* try next candidate */
    }
  }
  return null;
}

async function llmScore(jd: string): Promise<Omit<MatchResult, "source"> | null> {
  const content = await completeOpenRouter(
    [{ role: "user", content: buildScoringPrompt(jd, resumeToMarkdown()) }],
    { systemPrompt: SCORER_SYSTEM, temperature: 0.2, maxTokens: 2048 }
  );
  return parseMatchJson(content);
}

/* ------------------------------------------------------------------ */
/* Heuristic fallback (no LLM / no API key / parse failure)             */
/* ------------------------------------------------------------------ */

const JD_SKILL_VOCAB = [
  "selenium", "playwright", "cypress", "appium", "webdriverio", "java", "python",
  "javascript", "typescript", "node.js", "sql", "postgresql", "mysql", "mongodb",
  "rest", "soap", "graphql", "api", "postman", "rest assured", "junit", "testng",
  "cucumber", "jmeter", "k6", "grafana", "docker", "kubernetes", "jenkins", "git",
  "github actions", "ci/cd", "maven", "gradle", "linux", "aws", "azure", "gcp",
  "test automation", "automation framework", "performance testing", "load testing",
  "api testing", "regression testing", "agile", "scrum", "jira", "manual testing",
  "test planning", "test strategy", "page object model", "data-driven", "bdd",
];

function heuristicScore(jd: string): Omit<MatchResult, "source"> {
  const jdLower = jd.toLowerCase();
  const resumeSkills = resumeData.skills.map((s) => s.name.toLowerCase());

  const inJd = (term: string) => jdLower.includes(term);
  const matchedSkills = resumeData.skills
    .filter((s) => inJd(s.name.toLowerCase()))
    .map((s) => s.name);

  const missingSkills = JD_SKILL_VOCAB.filter(
    (term) => inJd(term) && !resumeSkills.some((rs) => term.includes(rs) || rs.includes(term))
  );

  const total = matchedSkills.length + missingSkills.length;
  const matchScore = total === 0 ? 50 : clamp((matchedSkills.length / total) * 100);

  // Relevance: experience/project whose text shares a JD vocab term.
  const jdHas = (text: string) => JD_SKILL_VOCAB.some((t) => text.toLowerCase().includes(t));

  const relevantExperience = resumeData.experience
    .filter((exp) => exp.description?.some(jdHas))
    .slice(0, 3)
    .map((exp) => `${exp.role} @ ${exp.company} (${exp.period})`);

  const relevantProjects = resumeData.projects
    .filter((p) =>
      jdHas(Array.isArray(p.description) ? p.description.join(" ") : String(p.description ?? ""))
    )
    .slice(0, 3)
    .map((p) => p.title);

  const recommendation =
    matchScore >= 70
      ? "Kranthi is a strong match for this role. His resume shows directly relevant automation and testing experience."
      : matchScore >= 45
        ? "Kranthi has meaningful overlap with this role, with a few gaps worth probing in an interview."
        : "This role has limited overlap with Kranthi's profile. The gaps below should be weighed before proceeding.";

  const interviewQuestions = [
    "Walk me through the automation framework you built at PayU — what were the hardest parts?",
    "How would you design a Playwright framework for this project from scratch?",
    ...missingSkills.slice(0, 3).map((s) => `What experience do you have with ${s}?`),
  ].slice(0, 5);

  return {
    matchScore,
    overall: overallFor(matchScore),
    matchedSkills,
    missingSkills,
    relevantExperience,
    relevantProjects,
    recommendation,
    interviewQuestions,
  };
}

/* ------------------------------------------------------------------ */
/* Route                                                                */
/* ------------------------------------------------------------------ */

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const file = form.get("file");
    const jdText = (form.get("jdText") as string | null) ?? "";

    let text = jdText.trim();
    if (!text && file instanceof File) {
      const buf = Buffer.from(await file.arrayBuffer());
      text = (await extractTextFromPdf(buf)).trim();
    }
    if (!text) {
      return json({ error: "Paste a job description or upload a PDF to get a match score." }, 400);
    }
    text = text.slice(0, 20000);

    let result: Omit<MatchResult, "source"> | null = null;
    try {
      result = await llmScore(text);
    } catch (err) {
      console.warn("[recruiter] LLM scoring unavailable, using heuristic:", err);
    }

    if (!result) {
      result = heuristicScore(text);
      return json({ ...result, source: "heuristic" } satisfies MatchResult, 200);
    }
    return json({ ...result, source: "llm" } satisfies MatchResult, 200);
  } catch (err) {
    console.error("Recruiter API error:", err);
    return json({ error: "Something went wrong while scoring the job description." }, 500);
  }
}
