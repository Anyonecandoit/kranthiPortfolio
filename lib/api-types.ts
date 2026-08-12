/**
 * Shared API response types.
 *
 * These types are consumed by client pages AND defined by server API routes.
 * They live here (instead of inside app/api/...) so client pages can import
 * them even when the mobile app is built as a static export — the API route
 * files are temporarily moved aside during that build (scripts/build-mobile.sh).
 */

export interface MatchResult {
  matchScore: number;
  overall: "Excellent" | "Strong" | "Moderate" | "Weak";
  matchedSkills: string[];
  missingSkills: string[];
  relevantExperience: string[];
  relevantProjects: string[];
  recommendation: string;
  interviewQuestions: string[];
  source: "llm" | "heuristic";
}

export interface EstimateResult {
  summary: string;
  scope: string[];
  techStack: string[];
  personWeeks: number;
  costRange: [number, number];
  timelineMonths: number;
  milestones: { phase: string; weeks: number; detail: string }[];
  risks: string[];
  nextSteps: string[];
  source: "llm" | "heuristic";
}
