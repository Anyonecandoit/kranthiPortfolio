import { resumeData } from "@/data/resume";
import { ALL_AGENTS } from "@/lib/agents";
import { TOOLS } from "@/lib/tools";

/**
 * Client-side smart search index. Searches pages, AI agents, the resume
 * (projects, skills, experience, certifications, education), and the AI tools
 * catalog. Ranked by prefix > substring > keyword match, grouped in the UI.
 */

export type SearchGroup =
  | "Pages"
  | "Agents"
  | "Projects"
  | "Skills"
  | "Experience"
  | "Tools"
  | "Certifications"
  | "Education";

export interface SearchResult {
  id: string;
  title: string;
  subtitle?: string;
  group: SearchGroup;
  href: string;
  keywords: string;
  score: number;
}

interface IndexItem {
  title: string;
  subtitle?: string;
  group: SearchGroup;
  href: string;
  keywords: string;
}

function buildIndex(): IndexItem[] {
  const items: IndexItem[] = [];

  // Pages
  const pages: Array<[string, string, string]> = [
    ["Home", "#home", "intro hero about"],
    ["About", "#about", "profile summary about"],
    ["Skills", "#skills", "technologies stack skills"],
    ["Projects", "#projects", "work portfolio projects"],
    ["Experience", "#experience", "jobs career experience"],
    ["Contact", "#contact", "email reach contact"],
    ["AI Chat", "/chat", "chat assistant agents ask"],
    ["Recruiter Mode", "/recruiter", "recruiter jd job description matcher hiring match score"],
    ["Project Estimator", "/estimator", "estimate quote proposal cost timeline project client"],
    ["AI Tools", "/tools", "ai tools library utilities generators"],
    ["AI Notes", "/notes", "ai notes notepad writing notes"],
    ["Dashboard", "/dashboard", "account profile dashboard"],
    ["Admin Panel", "/admin", "admin analytics knowledge base contact requests"],
  ];
  pages.forEach(([title, href, keywords]) =>
    items.push({ title, group: "Pages", href, keywords })
  );

  // AI Agents
  ALL_AGENTS.forEach((a) =>
    items.push({
      title: a.name,
      subtitle: a.tagline,
      group: "Agents",
      href: "/chat",
      keywords: `${a.description} ${a.suggestions.join(" ")} ${a.id}`,
    })
  );

  // Projects
  resumeData.projects.forEach((p) =>
    items.push({
      title: p.title,
      group: "Projects",
      href: "#projects",
      keywords: String(p.description ?? ""),
    })
  );

  // Skills
  resumeData.skills.forEach((s) =>
    items.push({
      title: s.name,
      subtitle: s.category,
      group: "Skills",
      href: "#skills",
      keywords: `${s.name} ${s.category}`,
    })
  );

  // Experience
  resumeData.experience.forEach((exp) =>
    items.push({
      title: `${exp.role} @ ${exp.company}`,
      subtitle: exp.period,
      group: "Experience",
      href: "#experience",
      keywords: `${exp.role} ${exp.company} ${exp.period} ${(exp.description ?? []).join(" ")}`,
    })
  );

  // Certifications
  resumeData.certifications.forEach((c) =>
    items.push({
      title: c.title,
      subtitle: `${c.issuer} · ${c.date}`,
      group: "Certifications",
      href: "#skills",
      keywords: `${c.title} ${c.issuer} ${c.date}`,
    })
  );

  // Education
  resumeData.education.forEach((e) =>
    items.push({
      title: e.degree,
      subtitle: `${e.institution} · ${e.period}`,
      group: "Education",
      href: "#about",
      keywords: `${e.degree} ${e.institution} ${e.period} ${(e.description ?? []).join(" ")}`,
    })
  );

  // AI Tools
  TOOLS.forEach((t) =>
    items.push({
      title: t.name,
      subtitle: t.category,
      group: "Tools",
      href: `/tools#${t.id}`,
      keywords: `${t.description} ${t.category} ${t.id}`,
    })
  );

  return items;
}

let cachedIndex: IndexItem[] | null = null;
function getIndex(): IndexItem[] {
  if (!cachedIndex) cachedIndex = buildIndex();
  return cachedIndex;
}

export function searchSite(query: string, max = 40): SearchResult[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];

  const scored: SearchResult[] = [];
  for (const item of getIndex()) {
    const titleLower = item.title.toLowerCase();
    const kw = item.keywords.toLowerCase();
    let score = -1;
    if (titleLower.startsWith(q)) score = 100;
    else if (titleLower.includes(q)) score = 75;
    else if (kw.includes(q)) score = 45;

    if (score > 0) {
      scored.push({
        id: `${item.group}-${item.title}-${Math.random().toString(36).slice(2, 8)}`,
        title: item.title,
        subtitle: item.subtitle,
        group: item.group,
        href: item.href,
        keywords: item.keywords,
        score,
      });
    }
  }

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, max);
}
