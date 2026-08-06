/**
 * Shared suggestion-chip data and follow-up logic for both
 * the floating chat widget and the full /chat page.
 */

export interface SuggestionChip {
  /** Emoji prefix shown in the chip */
  icon: string;
  /** The full message text sent when the chip is clicked */
  text: string;
  /** Short display label (used in sidebar / follow-up chips) */
  label: string;
}

export const SUGGESTION_CHIPS: SuggestionChip[] = [
  { icon: "📁", text: "What projects has Kranthi built?", label: "Projects" },
  { icon: "💼", text: "Tell me about his work experience", label: "Experience" },
  { icon: "🧪", text: "What testing tools does he use?", label: "Testing Tools" },
  { icon: "🤖", text: "Explain his AI experience", label: "AI Experience" },
  { icon: "⚙️", text: "What are his strongest technical skills?", label: "Skills" },
  { icon: "🏆", text: "What certifications does he have?", label: "Certifications" },
  { icon: "📞", text: "How can I contact him?", label: "Contact" },
  { icon: "🎓", text: "Tell me about his education", label: "Education" },
  { icon: "🚀", text: "Why should I hire Kranthi?", label: "Why Hire" },
  { icon: "⭐", text: "Summarize his profile", label: "Summary" },
];

/** Default follow-up labels (when no assistant message to derive context from). */
export const DEFAULT_FOLLOW_UP = SUGGESTION_CHIPS.map((c) => c.label);

/**
 * Derive contextual follow-up chip labels from the last assistant response.
 * Pure function — no side effects.
 */
export function getFollowUpChips(lastResponse: string): string[] {
  const lower = lastResponse.toLowerCase();
  if (lower.includes("project") || lower.includes("built"))
    return ["Architecture", "Tech Stack", "GitHub", "Challenges", "Automation", "Outcomes"];
  if (lower.includes("experience") || lower.includes("worked"))
    return ["Current Role", "Previous Companies", "Achievements", "Technologies", "Timeline"];
  if (lower.includes("skill") || lower.includes("tool") || lower.includes("testing"))
    return ["Selenium", "Playwright", "API Testing", "Performance", "CI/CD", "Languages"];
  if (lower.includes("contact") || lower.includes("email") || lower.includes("hire"))
    return ["Resume", "Email", "LinkedIn", "Availability", "Consulting", "Collaboration"];
  if (lower.includes("certif"))
    return ["AWS", "ISTQB", "Oracle", "Azure", "Education", "Experience"];
  if (lower.includes("ai") || lower.includes("machine"))
    return ["Test Generation", "Self-Healing", "Reporting", "Prioritization", "Vision"];
  return DEFAULT_FOLLOW_UP;
}
