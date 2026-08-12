import { NextRequest } from "next/server";
import { completeOpenRouter } from "@/lib/openrouter";
import type { EstimateResult } from "@/lib/api-types";

export type { EstimateResult };

const json = (body: unknown, status: number) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

interface EstimateInput {
  projectType?: string;
  description?: string;
  features?: string;
  timeline?: string;
  budget?: string;
}

const ESTIMATE_SYSTEM =
  "You are a seasoned software project estimator. Produce realistic, defensible estimates for small to mid-size web, automation, and AI projects. Be conservative with scope, explicit about assumptions.";

function buildPrompt(input: EstimateInput): string {
  const { projectType, description, features, timeline, budget } = input;
  return `Produce a project estimate from the details below.

PROJECT TYPE: ${projectType || "Not specified"}
DESCRIPTION: ${description || "Not specified"}
FEATURES: ${features || "Not specified"}
TIMELINE EXPECTATION: ${timeline || "Not specified"}
BUDGET: ${budget || "Not specified"}

Return ONLY valid JSON — no markdown fences, no commentary — with EXACTLY this shape:
{
  "summary": "<2-3 sentence project summary and approach>",
  "scope": ["<5-8 scoped deliverables>", ...],
  "techStack": ["<3-6 recommended technologies>", ...],
  "personWeeks": <number>,
  "costRange": [<min USD>, <max USD>],
  "timelineMonths": <number>,
  "milestones": [{"phase": "<phase name>", "weeks": <number>, "detail": "<short>"}, ...],
  "risks": ["<3-5 key risks>", ...],
  "nextSteps": ["<3-5 recommended next steps>", ...]
}

Rules:
- Assume a small team of 1-2 engineers.
- personWeeks should be internally consistent with milestones and timeline.
- Cost assumes a blended rate of ~$35-65/hour for a small project team.
- Keep numbers round and realistic for the described scope.`;
}

function parseEstimate(content: string): Omit<EstimateResult, "source"> | null {
  const cleaned = content.replace(/```(?:json)?/gi, "").trim();
  const candidates = [cleaned];
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start >= 0 && end > start) candidates.push(cleaned.slice(start, end + 1));
  for (const c of candidates) {
    try {
      const obj = JSON.parse(c) as Record<string, unknown>;
      if (typeof obj.personWeeks !== "number") continue;
      const strArr = (v: unknown) => (Array.isArray(v) ? v.map(String).slice(0, 12) : []);
      const cost: [number, number] = Array.isArray(obj.costRange) && obj.costRange.length === 2
        ? [Number(obj.costRange[0]), Number(obj.costRange[1])]
        : [Math.round((obj.personWeeks as number) * 60), Math.round((obj.personWeeks as number) * 110)];
      const milestones = Array.isArray(obj.milestones)
        ? obj.milestones.slice(0, 8).map((m) => {
            const mm = m as Record<string, unknown>;
            return { phase: String(mm.phase ?? "Phase"), weeks: Number(mm.weeks) || 1, detail: String(mm.detail ?? "") };
          })
        : [];
      return {
        summary: typeof obj.summary === "string" ? obj.summary : "",
        scope: strArr(obj.scope),
        techStack: strArr(obj.techStack),
        personWeeks: Math.round(Number(obj.personWeeks)) || 4,
        costRange: cost,
        timelineMonths: Number(obj.timelineMonths) || 1,
        milestones,
        risks: strArr(obj.risks),
        nextSteps: strArr(obj.nextSteps),
      };
    } catch {
      /* try next */
    }
  }
  return null;
}

async function llmEstimate(input: EstimateInput): Promise<Omit<EstimateResult, "source"> | null> {
  const content = await completeOpenRouter(
    [{ role: "user", content: buildPrompt(input) }],
    { systemPrompt: ESTIMATE_SYSTEM, temperature: 0.3, maxTokens: 2048 }
  );
  return parseEstimate(content);
}

function heuristicEstimate(input: EstimateInput): Omit<EstimateResult, "source"> {
  const type = (input.projectType ?? "").toLowerCase();
  const desc = (input.description ?? "").toLowerCase();
  const features = (input.features ?? "").toLowerCase();
  const text = `${type} ${desc} ${features}`;

  let baseWeeks = 8;
  if (text.includes("ai") || text.includes("llm") || text.includes("ml")) baseWeeks = 12;
  else if (text.includes("mobile")) baseWeeks = 10;
  else if (text.includes("saas") || text.includes("multi-tenant")) baseWeeks = 14;
  else if (text.includes("ecommerce") || text.includes("pay")) baseWeeks = 12;
  else if (text.includes("automation") || text.includes("test framework")) baseWeeks = 6;
  else if (text.includes("api") || text.includes("integration")) baseWeeks = 5;
  else if (text.includes("landing") || text.includes("portfolio")) baseWeeks = 3;

  const featureCount = features.split(/[\n,;]/).filter((f) => f.trim().length > 2).length;
  const personWeeks = Math.max(2, baseWeeks + featureCount * 0.5);
  const costRange: [number, number] = [
    Math.round(personWeeks * 40 * 40),
    Math.round(personWeeks * 65 * 40),
  ];
  const timelineMonths = Math.max(1, Math.ceil(personWeeks / (2 * 4.3)));

  const milestones = [
    { phase: "Discovery & planning", weeks: Math.max(1, Math.round(personWeeks * 0.15)), detail: "Requirements, architecture, design, project plan" },
    { phase: "Core build", weeks: Math.max(2, Math.round(personWeeks * 0.55)), detail: "Main features, integrations, and iterations" },
    { phase: "QA & hardening", weeks: Math.max(1, Math.round(personWeeks * 0.2)), detail: "Testing, fixes, performance, security pass" },
    { phase: "Launch & handover", weeks: Math.max(1, Math.round(personWeeks * 0.1)), detail: "Deployment, docs, and handover" },
  ];

  return {
    summary: `A ${input.projectType || "custom"} project. Rough estimate based on scope and stated features — refine with a detailed discovery call.`,
    scope: [
      "Requirements workshop & PRD",
      "Design system & UI implementation",
      "Core business logic and integrations",
      "API layer and data model",
      "Automated tests & QA",
      "Deployment, monitoring & documentation",
    ],
    techStack:
      type.includes("automation") || text.includes("test")
        ? ["Playwright / Selenium", "Java or TypeScript", "TestNG / Pytest", "GitHub Actions CI", "Docker"]
        : ["React / Next.js", "Node.js or Python", "PostgreSQL", "Supabase", "Vercel / Docker"],
    personWeeks: Math.round(personWeeks),
    costRange,
    timelineMonths,
    milestones,
    risks: [
      "Scope creep — features list is open-ended",
      "Third-party integrations can add 1-2 weeks",
      "User feedback may require rework after first review",
      "Availability of specialist skills (e.g. AI) affects timeline",
    ],
    nextSteps: [
      "Schedule a free discovery call to lock requirements",
      "I'll share a detailed proposal with fixed milestones",
      "Agree on milestones, payments, and a test/review process",
    ],
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    const input: EstimateInput = {
      projectType: typeof body?.projectType === "string" ? body.projectType : "",
      description: typeof body?.description === "string" ? body.description : "",
      features: typeof body?.features === "string" ? body.features : "",
      timeline: typeof body?.timeline === "string" ? body.timeline : "",
      budget: typeof body?.budget === "string" ? body.budget : "",
    };
    if (!input.description?.trim() && !input.projectType?.trim()) {
      return json({ error: "Describe the project to get an estimate." }, 400);
    }

    let result: Omit<EstimateResult, "source"> | null = null;
    try {
      result = await llmEstimate(input);
    } catch (err) {
      console.warn("[estimate] LLM unavailable, using heuristic:", err);
    }
    const source: EstimateResult["source"] = result ? "llm" : "heuristic";
    if (!result) result = heuristicEstimate(input);

    return json({ ...result, source } satisfies EstimateResult, 200);
  } catch (err) {
    console.error("Estimate API error:", err);
    return json({ error: "Something went wrong generating the estimate." }, 500);
  }
}
