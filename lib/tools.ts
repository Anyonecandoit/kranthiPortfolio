/**
 * AI Tools catalog (~48 tools). Each tool is driven by an LLM via a
 * systemPrompt + user-input fields. The /tools page, the tools API, and the
 * global smart search all read from this single registry.
 * The icon is a lucide icon *name* (UI maps names -> components).
 */

export type ToolCategory =
  | "AI Assistants"
  | "Developer"
  | "Content"
  | "Productivity"
  | "Writing"
  | "Image & Media";

export interface ToolField {
  name: string;
  label: string;
  type?: "text" | "textarea" | "number" | "select";
  options?: string[];
  placeholder?: string;
  required?: boolean;
  rows?: number;
  help?: string;
}

export interface ToolDefinition {
  id: string;
  name: string;
  description: string;
  category: ToolCategory;
  icon: string;
  gradient: string;
  systemPrompt: string;
  fields: ToolField[];
}

interface ToolSeed {
  id: string;
  name: string;
  description: string;
  category: ToolCategory;
  icon: string;
  gradient: string;
  p: string; // systemPrompt
  f: ToolField[];
}

const T = (s: ToolSeed): ToolDefinition => ({
  id: s.id,
  name: s.name,
  description: s.description,
  category: s.category,
  icon: s.icon,
  gradient: s.gradient,
  systemPrompt: s.p,
  fields: s.f,
});

export const TOOLS: ToolDefinition[] = [
  /* ---------------- AI Assistants ---------------- */
  T({
    id: "resume-writer", name: "Resume Writer", category: "AI Assistants", icon: "FileText", gradient: "from-violet-600 to-purple-600",
    description: "Turn your raw experience into a polished, ATS-friendly resume section.",
    p: "Rewrite the user's experience summary into a clean, achievement-oriented resume bullet list with strong action verbs and quantified impact. Keep it ATS-friendly (no tables, standard headings).",
    f: [
      { name: "role", label: "Job title", placeholder: "Senior SDET", required: true },
      { name: "experience", label: "Your experience (raw notes)", type: "textarea", placeholder: "Paste bullets or a paragraph about what you did…", required: true },
      { name: "style", label: "Tone", type: "select", options: ["Professional", "Concise", "Confident"], placeholder: "Professional" },
    ],
  }),
  T({
    id: "interview-coach", name: "Interview Coach", category: "AI Assistants", icon: "UserCheck", gradient: "from-sky-600 to-blue-600",
    description: "Mock interview questions tailored to a role, with model answers.",
    p: "Act as an interview coach. Generate a realistic mock interview: 5 questions for the given role and seniority. After the user answers each, give a brief score and feedback, then continue. At the end offer a summary.",
    f: [
      { name: "role", label: "Role you're interviewing for", placeholder: "SDET / QA Lead", required: true },
      { name: "seniority", label: "Seniority", type: "select", options: ["Junior", "Mid", "Senior", "Lead"], placeholder: "Senior" },
      { name: "focus", label: "Focus area", type: "select", options: ["General", "Automation", "API Testing", "System Design", "Behavioral"], placeholder: "General" },
    ],
  }),
  T({
    id: "career-advice", name: "Career Advisor", category: "AI Assistants", icon: "Compass", gradient: "from-emerald-600 to-teal-600",
    description: "Personalized career guidance and next-step planning.",
    p: "Act as a career advisor. Understand the user's current role, skills, and goal; then give concrete, prioritized next steps (skills to learn, projects to build, roles to target) with reasoning.",
    f: [
      { name: "currentRole", label: "Current role", placeholder: "QA Engineer", required: true },
      { name: "goal", label: "Career goal", placeholder: "Become an SDET lead in 18 months", required: true },
      { name: "timeframe", label: "Timeframe", type: "select", options: ["3 months", "6 months", "1 year", "2 years"], placeholder: "1 year" },
    ],
  }),
  T({
    id: "cover-letter", name: "Cover Letter Writer", category: "AI Assistants", icon: "Mail", gradient: "from-indigo-600 to-violet-600",
    description: "Draft a personalized cover letter from your profile and the role.",
    p: "Write a concise, confident cover letter (3-4 short paragraphs) for the role described. Reference the user's background and achievements naturally; no clichés; end with a clear next step.",
    f: [
      { name: "role", label: "Role / company", placeholder: "Senior SDET at a fintech", required: true },
      { name: "background", label: "Your background", type: "textarea", placeholder: "Briefly describe your relevant experience…", required: true },
      { name: "hook", label: "Why you're excited (optional)", type: "textarea", placeholder: "e.g. You built the same kind of framework they're hiring for" },
    ],
  }),
  T({
    id: "job-simulator", name: "Job Simulation", category: "AI Assistants", icon: "Laptop", gradient: "from-cyan-600 to-teal-600",
    description: "Practice real work tasks for a target role (task-based simulation).",
    p: "Create a short, realistic work task for the given role (e.g. write a test plan, debug a snippet, design a schema). Give the task, then provide feedback on the user's response and a suggested solution.",
    f: [
      { name: "role", label: "Role to simulate", placeholder: "SDET / Backend Engineer", required: true },
      { name: "taskType", label: "Task type", type: "select", options: ["Test planning", "Code review", "Bug hunt", "System design", "Writing"], placeholder: "Test planning" },
    ],
  }),
  T({
    id: "meeting-assistant", name: "Meeting Prep Assistant", category: "AI Assistants", icon: "CalendarDays", gradient: "from-amber-600 to-orange-600",
    description: "Agendas, talking points, and follow-up plans for important meetings.",
    p: "Act as a meeting prep assistant. Produce a focused agenda with 4-6 talking points, likely questions to prepare for, and a follow-up action list.",
    f: [
      { name: "meetingType", label: "Meeting type", placeholder: "1:1 with manager / client kickoff", required: true },
      { name: "context", label: "Context / goals", type: "textarea", placeholder: "What do you want to achieve?" },
    ],
  }),
  T({
    id: "feedback-copilot", name: "Feedback Copilot", category: "AI Assistants", icon: "MessageSquareHeart", gradient: "from-rose-600 to-pink-600",
    description: "Turn rough feedback into clear, constructive, professional notes.",
    p: "Rewrite the user's draft feedback to be specific, constructive, and professional — SBI format (Situation, Behavior, Impact) where suitable. Preserve intent; remove harsh or vague language.",
    f: [
      { name: "draft", label: "Your draft feedback", type: "textarea", placeholder: "Paste your rough notes…", required: true },
      { name: "recipient", label: "Recipient", type: "select", options: ["Peer", "Direct report", "Manager", "Vendor"], placeholder: "Peer" },
    ],
  }),
  T({
    id: "study-planner", name: "Study Planner", category: "AI Assistants", icon: "GraduationCap", gradient: "from-fuchsia-600 to-pink-600",
    description: "A week-by-week learning plan for any certification or skill.",
    p: "Design a realistic week-by-week study plan to reach the stated goal. Include weekly topics, practice tasks, milestones, and a final assessment plan. Match effort to the available hours per week.",
    f: [
      { name: "goal", label: "What you want to learn", placeholder: "ISTQB Advanced Test Automation Engineer", required: true },
      { name: "hoursPerWeek", label: "Hours per week", type: "number", placeholder: "6" },
      { name: "weeks", label: "Weeks available", type: "number", placeholder: "8" },
    ],
  }),

  /* ---------------- Developer ---------------- */
  T({
    id: "code-reviewer", name: "AI Code Reviewer", category: "Developer", icon: "Code2", gradient: "from-emerald-600 to-green-600",
    description: "Review code for bugs, security, and best practices.",
    p: "Act as a senior code reviewer. Review the provided code for correctness, security issues, performance, and readability. List concrete issues with line-level suggestions and a priority. Be concise.",
    f: [
      { name: "code", label: "Paste code", type: "textarea", placeholder: "Paste the code to review…", required: true },
      { name: "language", label: "Language", placeholder: "Java / Python / TypeScript" },
    ],
  }),
  T({
    id: "debugger", name: "Debug Assistant", category: "Developer", icon: "Bug", gradient: "from-rose-600 to-red-600",
    description: "Diagnose errors and explain the root cause.",
    p: "Act as a debugging expert. Given the error, code snippet, and context, identify the most likely root cause, explain it simply, and give the exact fix plus how to avoid it in the future.",
    f: [
      { name: "error", label: "Error message", type: "textarea", placeholder: "Paste the error / stack trace…", required: true },
      { name: "code", label: "Related code", type: "textarea", placeholder: "Optional code snippet" },
    ],
  }),
  T({
    id: "test-generator", name: "Test Case Generator", category: "Developer", icon: "FlaskConical", gradient: "from-sky-600 to-cyan-600",
    description: "Generate thorough test cases from a feature description.",
    p: "Generate a comprehensive test suite: functional, boundary, negative, and edge-case scenarios for the described feature. Format as a prioritized list with test ID, steps, and expected result.",
    f: [
      { name: "feature", label: "Feature / requirement", type: "textarea", placeholder: "Describe the feature to test…", required: true },
      { name: "type", label: "Test type", type: "select", options: ["Manual", "API", "E2E", "Regression"], placeholder: "Manual" },
    ],
  }),
  T({
    id: "test-data", name: "Test Data Generator", category: "Developer", icon: "Database", gradient: "from-purple-600 to-violet-600",
    description: "Generate realistic sample data for any schema.",
    p: "Generate realistic sample data for the described schema/fields. Return it as a JSON array with varied, realistic values including edge cases (empty, max length, boundary values).",
    f: [
      { name: "schema", label: "Fields / schema", type: "textarea", placeholder: "e.g. user: id, name, email, age, country", required: true },
      { name: "rows", label: "Number of records", type: "number", placeholder: "10" },
    ],
  }),
  T({
    id: "regex-builder", name: "Regex Builder", category: "Developer", icon: "Braces", gradient: "from-amber-600 to-yellow-600",
    description: "Build and explain regex patterns in plain language.",
    p: "Given the requirement in plain English, provide a working regex, a breakdown of each part, test strings that match, and strings that should not match. Use the most readable form.",
    f: [
      { name: "requirement", label: "What should it match?", type: "textarea", placeholder: "e.g. email addresses with .com or .in domains", required: true },
      { name: "language", label: "Language/flavor", placeholder: "Java / Python / JavaScript" },
    ],
  }),
  T({
    id: "sql-helper", name: "SQL Assistant", category: "Developer", icon: "Table2", gradient: "from-indigo-600 to-blue-600",
    description: "Write and optimize SQL from natural language.",
    p: "Translate the user's natural-language request into correct, efficient SQL. Show the query, explain the logic, and note any indexes or optimizations that would help.",
    f: [
      { name: "request", label: "What do you need the query to do?", type: "textarea", placeholder: "e.g. top 5 customers by revenue last quarter", required: true },
      { name: "dialect", label: "Dialect", type: "select", options: ["PostgreSQL", "MySQL", "SQL Server", "SQLite", "Oracle"], placeholder: "PostgreSQL" },
      { name: "tables", label: "Your tables (optional)", type: "textarea", placeholder: "users(id, name), orders(user_id, amount, created_at)" },
    ],
  }),
  T({
    id: "api-spec", name: "API Design Assistant", category: "Developer", icon: "Network", gradient: "from-teal-600 to-emerald-600",
    description: "Design clean REST/GraphQL endpoints and payloads.",
    p: "Design a clean API for the described feature: REST endpoints (method, path, request/response JSON), error handling, auth notes, and pagination. Point out edge cases.",
    f: [
      { name: "feature", label: "What should the API do?", type: "textarea", placeholder: "Describe the resource and operations…", required: true },
      { name: "style", label: "Style", type: "select", options: ["REST", "GraphQL"], placeholder: "REST" },
    ],
  }),
  T({
    id: "architecture-advice", name: "Architecture Advisor", category: "Developer", icon: "Boxes", gradient: "from-slate-600 to-gray-600",
    description: "Get a pragmatic system architecture for your idea.",
    p: "Act as a software architect. Propose a pragmatic architecture for the described system: components, data model, tech stack, key trade-offs, and the most likely bottlenecks. Keep it proportionate to scale.",
    f: [
      { name: "system", label: "Describe your system", type: "textarea", placeholder: "What are you building, for whom, at what scale?", required: true },
      { name: "constraints", label: "Constraints (budget, team, stack)", type: "textarea" },
    ],
  }),
  T({
    id: "git-helper", name: "Git Assistant", category: "Developer", icon: "GitBranch", gradient: "from-gray-600 to-slate-600",
    description: "Translate intent into the right git commands.",
    p: "Given a git situation in plain language, give the exact commands needed, explain what each does, and flag any destructive commands with warnings.",
    f: [
      { name: "situation", label: "What are you trying to do?", type: "textarea", placeholder: "e.g. undo my last commit but keep the changes", required: true },
    ],
  }),
  T({
    id: "deploy-assistant", name: "CI/CD Assistant", category: "Developer", icon: "Rocket", gradient: "from-cyan-600 to-sky-600",
    description: "Design CI/CD pipelines and deployment configs.",
    p: "Provide a CI/CD pipeline design (stages, jobs, caches) for the described stack and tool (GitHub Actions, Jenkins, etc.). Include config snippets and best practices like secrets handling and caching.",
    f: [
      { name: "stack", label: "Project stack", placeholder: "Java Maven + Playwright", required: true },
      { name: "tool", label: "CI tool", type: "select", options: ["GitHub Actions", "Jenkins", "GitLab CI", "CircleCI"], placeholder: "GitHub Actions" },
    ],
  }),
  T({
    id: "xpath-builder", name: "XPath & Selector Builder", category: "Developer", icon: "Locate", gradient: "from-orange-600 to-amber-600",
    description: "Write robust XPath/CSS selectors for automation.",
    p: "Given the HTML snippet and the element to target, provide the most robust XPath and CSS selector, explain why they are stable, and list what to do if the page structure changes.",
    f: [
      { name: "html", label: "HTML snippet", type: "textarea", placeholder: "Paste the relevant HTML…", required: true },
      { name: "target", label: "Element you need", placeholder: "e.g. the submit button inside the form", required: true },
    ],
  }),
  T({
    id: "code-converter", name: "Code Converter", category: "Developer", icon: "Repeat", gradient: "from-blue-600 to-indigo-600",
    description: "Translate code between languages with best practices.",
    p: "Convert the provided code to the target language, preserving behavior and following idiomatic conventions. Show the converted code and a short note on any differences or pitfalls.",
    f: [
      { name: "code", label: "Source code", type: "textarea", placeholder: "Paste code…", required: true },
      { name: "from", label: "From", placeholder: "Java", required: true },
      { name: "to", label: "To", placeholder: "Python", required: true },
    ],
  }),
  T({
    id: "pom-builder", name: "Framework Scaffolder", category: "Developer", icon: "LayoutTemplate", gradient: "from-violet-600 to-fuchsia-600",
    description: "Scaffold a test-automation framework structure.",
    p: "Produce a recommended folder structure and key file stubs for the described test-automation framework (Selenium/Playwright/Cypress + language). Include a base test class, config, and a sample test with comments.",
    f: [
      { name: "tool", label: "Framework", type: "select", options: ["Selenium + Java", "Playwright + Java", "Playwright + TS", "Cypress + JS", "REST Assured + Java"], placeholder: "Selenium + Java" },
      { name: "extra", label: "Extra requirements", type: "textarea", placeholder: "e.g. Docker, parallel execution, reporting" },
    ],
  }),

  /* ---------------- Content ---------------- */
  T({
    id: "blog-writer", name: "Blog Post Writer", category: "Content", icon: "PenLine", gradient: "from-purple-600 to-indigo-600",
    description: "Draft a well-structured blog post from a topic and outline.",
    p: "Write a complete blog post with an engaging headline, intro, scannable sections (H2/H3), actionable examples, and a conclusion with a CTA. Match the requested tone and target word count.",
    f: [
      { name: "topic", label: "Topic", placeholder: "Building a Selenium framework from scratch", required: true },
      { name: "audience", label: "Audience", placeholder: "Mid-level QA engineers" },
      { name: "tone", label: "Tone", type: "select", options: ["Professional", "Conversational", "Technical", "Inspirational"], placeholder: "Technical" },
      { name: "words", label: "Target length (words)", type: "number", placeholder: "1000" },
    ],
  }),
  T({
    id: "title-generator", name: "Title & Hook Generator", category: "Content", icon: "Heading1", gradient: "from-pink-600 to-rose-600",
    description: "10 catchy titles and hooks for any piece.",
    p: "Generate 10 strong title options and 3 opening hooks for the described content. Vary the angles (curiosity, how-to, listicle, contrarian) and label each angle.",
    f: [
      { name: "topic", label: "Content topic", placeholder: "The content you're writing about", required: true },
      { name: "format", label: "Format", type: "select", options: ["Blog post", "Video", "Newsletter", "LinkedIn post", "Webinar"], placeholder: "Blog post" },
    ],
  }),
  T({
    id: "linkedin-writer", name: "LinkedIn Post Writer", category: "Content", icon: "Linkedin", gradient: "from-blue-600 to-sky-600",
    description: "Engaging LinkedIn posts from a rough idea.",
    p: "Write a compelling LinkedIn post: a hook line, a short story or insight, and a question to drive comments. 3 variants at different lengths. Avoid hashtag spam (max 3).",
    f: [
      { name: "idea", label: "Your idea / story", type: "textarea", placeholder: "What happened / what insight?", required: true },
      { name: "style", label: "Style", type: "select", options: ["Story", "Insight", "How-to", "Opinion"], placeholder: "Story" },
    ],
  }),
  T({
    id: "seo-tools", name: "SEO Copywriter", category: "Content", icon: "Search", gradient: "from-emerald-600 to-teal-600",
    description: "SEO-optimized copy and meta descriptions.",
    p: "Optimize the provided text for the target keyword: improve title, meta description (under 160 chars), headings, and readability. Keep it natural — no keyword stuffing.",
    f: [
      { name: "text", label: "Your draft", type: "textarea", placeholder: "Paste the content to optimize…", required: true },
      { name: "keyword", label: "Target keyword", placeholder: "e.g. test automation framework", required: true },
    ],
  }),
  T({
    id: "newsletter", name: "Newsletter Writer", category: "Content", icon: "Send", gradient: "from-cyan-600 to-teal-600",
    description: "A ready-to-send newsletter from your updates.",
    p: "Turn the provided updates into a friendly newsletter: subject line, 2-3 short sections, and a CTA. 150-250 words.",
    f: [
      { name: "updates", label: "Your updates / content", type: "textarea", placeholder: "What happened this week?", required: true },
      { name: "title", label: "Newsletter name (optional)", placeholder: "Kranthi's Dev Notes" },
    ],
  }),
  T({
    id: "case-study", name: "Case Study Writer", category: "Content", icon: "FolderOpen", gradient: "from-indigo-600 to-violet-600",
    description: "Structure a persuasive case study.",
    p: "Draft a persuasive case study: context/challenge, approach, results (with before/after), and a customer-style quote. Ask for the key facts you need if they're missing.",
    f: [
      { name: "challenge", label: "The problem", type: "textarea", placeholder: "What was the situation?", required: true },
      { name: "solution", label: "What was done", type: "textarea", placeholder: "Approach and tools", required: true },
      { name: "results", label: "Results/metrics", type: "textarea", placeholder: "e.g. 60% less manual effort" },
    ],
  }),
  T({
    id: "speech-writer", name: "Speech Writer", category: "Content", icon: "Mic2", gradient: "from-rose-600 to-red-600",
    description: "Write a speech or talk from key points.",
    p: "Write a natural speech from the key points: a strong opening, clear structure, rhetorical devices, and a memorable close. Approximate spoken word count (130 words/min).",
    f: [
      { name: "occasion", label: "Occasion", placeholder: "Tech conference talk, 20 min", required: true },
      { name: "points", label: "Key points", type: "textarea", placeholder: "What do you want to say?", required: true },
      { name: "minutes", label: "Target length (minutes)", type: "number", placeholder: "10" },
    ],
  }),
  T({
    id: "video-script", name: "Video Script Writer", category: "Content", icon: "Video", gradient: "from-fuchsia-600 to-pink-600",
    description: "Scripts for YouTube/shorts with hooks and b-roll cues.",
    p: "Write a video script: a 5-second hook, spoken narration, on-screen text suggestions, and b-roll/visual cues in brackets. Match the requested format (short/long) and tone.",
    f: [
      { name: "topic", label: "Video topic", placeholder: "The topic of the video", required: true },
      { name: "format", label: "Format", type: "select", options: ["YouTube long-form", "Shorts/Reels", "Tutorial", "Explainer"], placeholder: "YouTube long-form" },
      { name: "length", label: "Target length (seconds/min)", placeholder: "8 min" },
    ],
  }),
  T({
    id: "press-release", name: "Press Release Writer", category: "Content", icon: "Newspaper", gradient: "from-amber-600 to-orange-600",
    description: "A newsworthy press release from the facts.",
    p: "Write a press release in standard inverted-pyramid format: headline, dateline, lead paragraph with the who/what/when/where/why, 2-3 supporting paragraphs, a quote, boilerplate, and media contact.",
    f: [
      { name: "announcement", label: "What are you announcing?", type: "textarea", placeholder: "Facts, context, significance…", required: true },
      { name: "quote", label: "A quote to include (optional)", type: "textarea" },
    ],
  }),

  /* ---------------- Productivity ---------------- */
  T({
    id: "email-writer", name: "Email Writer", category: "Productivity", icon: "Mail", gradient: "from-violet-600 to-purple-600",
    description: "Clear, professional emails from a bullet list.",
    p: "Write a clear, appropriately-toned email from the user's points. Include a good subject line, a courteous opening, structured body, and a clear ask or next step.",
    f: [
      { name: "recipient", label: "Recipient", placeholder: "Client / manager / recruiter", required: true },
      { name: "points", label: "What to say", type: "textarea", placeholder: "Bullet the key points…", required: true },
      { name: "tone", label: "Tone", type: "select", options: ["Professional", "Friendly", "Persuasive", "Direct"], placeholder: "Professional" },
    ],
  }),
  T({
    id: "summarizer", name: "Text Summarizer", category: "Productivity", icon: "AlignLeft", gradient: "from-teal-600 to-emerald-600",
    description: "Condense long text into key takeaways.",
    p: "Summarize the provided text into: a one-line TL;DR, 3-5 key points, and any action items or decisions. Preserve numbers and names.",
    f: [
      { name: "text", label: "Text to summarize", type: "textarea", placeholder: "Paste the content…", required: true },
      { name: "style", label: "Style", type: "select", options: ["TL;DR + bullets", "Executive brief", "Bullet list"], placeholder: "TL;DR + bullets" },
    ],
  }),
  T({
    id: "meeting-notes", name: "Meeting Notes → Actions", category: "Productivity", icon: "ClipboardList", gradient: "from-cyan-600 to-blue-600",
    description: "Turn messy notes into actions and decisions.",
    p: "Convert the meeting notes into: decisions made, owners with next steps and due dates (infer if missing), open questions, and a short summary. Use a clean structure.",
    f: [
      { name: "notes", label: "Your notes", type: "textarea", placeholder: "Paste raw meeting notes…", required: true },
    ],
  }),
  T({
    id: "agenda-maker", name: "Agenda Maker", category: "Productivity", icon: "ListOrdered", gradient: "from-emerald-600 to-green-600",
    description: "Well-sequenced agendas for any meeting.",
    p: "Create a time-boxed meeting agenda: goal, 4-6 items with time allocations, who leads each, and what 'done' looks like. Keep total time within the stated duration.",
    f: [
      { name: "topic", label: "Meeting purpose", placeholder: "Sprint planning / client demo", required: true },
      { name: "duration", label: "Duration (minutes)", type: "number", placeholder: "30" },
      { name: "attendees", label: "Attendees (optional)", placeholder: "QA team, PM" },
    ],
  }),
  T({
    id: "todo-prioritizer", name: "Task Prioritizer", category: "Productivity", icon: "CheckSquare", gradient: "from-amber-600 to-yellow-600",
    description: "Rank a messy to-do list by impact vs effort.",
    p: "Prioritize the user's tasks using an impact-vs-effort lens. Group them into Do Now / Schedule / Delegate / Drop, and explain the reasoning for the top three.",
    f: [
      { name: "tasks", label: "Your tasks", type: "textarea", placeholder: "One per line…", required: true },
      { name: "context", label: "Context/deadlines (optional)", type: "textarea" },
    ],
  }),
  T({
    id: "planner", name: "Daily Planner", category: "Productivity", icon: "Sun", gradient: "from-orange-600 to-amber-600",
    description: "A realistic, time-blocked day plan.",
    p: "Build a realistic daily plan from the user's tasks: time-block the day with deep-work chunks, breaks, and buffer time. Flag over-commitment if there are too many tasks.",
    f: [
      { name: "tasks", label: "Tasks for today", type: "textarea", placeholder: "List tasks…", required: true },
      { name: "startHour", label: "Day starts at", type: "number", placeholder: "9" },
      { name: "endHour", label: "Day ends at", type: "number", placeholder: "18" },
    ],
  }),
  T({
    id: "risk-analyzer", name: "Risk Analyzer", category: "Productivity", icon: "ShieldAlert", gradient: "from-red-600 to-rose-600",
    description: "Identify risks and mitigations for a plan.",
    p: "Analyze the described plan/project for risks. For each risk: likelihood, impact, and a concrete mitigation. Order by severity.",
    f: [
      { name: "plan", label: "The plan / project", type: "textarea", placeholder: "Describe what could go wrong and why…", required: true },
    ],
  }),
  T({
    id: "decision-maker", name: "Decision Assistant", category: "Productivity", icon: "Scale", gradient: "from-slate-600 to-gray-600",
    description: "Structured pros/cons and a recommendation.",
    p: "Structure the user's decision: list options, criteria with weights, score each option, and give a clear recommendation with caveats. Ask for missing critical information.",
    f: [
      { name: "decision", label: "What decision?", placeholder: "Which framework to adopt?", required: true },
      { name: "options", label: "Options", type: "textarea", placeholder: "Option A, B, C…", required: true },
      { name: "constraints", label: "Constraints/priorities", type: "textarea" },
    ],
  }),
  T({
    id: "swot", name: "SWOT Analyzer", category: "Productivity", icon: "Grid", gradient: "from-indigo-600 to-violet-600",
    description: "A sharp SWOT analysis for a product, team, or self.",
    p: "Produce a concise SWOT (Strengths, Weaknesses, Opportunities, Threats) for the described subject, then a one-paragraph strategic takeaway.",
    f: [
      { name: "subject", label: "What to analyze", placeholder: "Our test automation initiative", required: true },
      { name: "context", label: "Context (optional)", type: "textarea" },
    ],
  }),

  /* ---------------- Writing ---------------- */
  T({
    id: "grammar-fix", name: "Grammar & Style Fixer", category: "Writing", icon: "SpellCheck", gradient: "from-emerald-600 to-teal-600",
    description: "Correct grammar and tighten style.",
    p: "Fix grammar, spelling, and punctuation; tighten wordy sentences; improve flow. Return the corrected text, then a brief list of the main changes.",
    f: [
      { name: "text", label: "Your text", type: "textarea", placeholder: "Paste text to fix…", required: true },
      { name: "tone", label: "Target tone", type: "select", options: ["Neutral", "Professional", "Casual"], placeholder: "Neutral" },
    ],
  }),
  T({
    id: "rewriter", name: "Text Rewriter", category: "Writing", icon: "RefreshCw", gradient: "from-blue-600 to-indigo-600",
    description: "Rewrite for tone, clarity, or length.",
    p: "Rewrite the provided text to the requested style and length, preserving all meaning and facts. Provide the rewritten version only.",
    f: [
      { name: "text", label: "Your text", type: "textarea", placeholder: "Paste text to rewrite…", required: true },
      { name: "style", label: "Style", type: "select", options: ["More formal", "More casual", "Simpler", "More persuasive", "Shorter"], placeholder: "Simpler" },
    ],
  }),
  T({
    id: "paraphraser", name: "Paraphraser", category: "Writing", icon: "FileSymlink", gradient: "from-cyan-600 to-sky-600",
    description: "Rephrase without changing meaning.",
    p: "Provide 3 distinct paraphrases of the text with different sentence structures, keeping meaning and tone intact. Add a short note on the differences.",
    f: [
      { name: "text", label: "Your text", type: "textarea", placeholder: "Paste text to paraphrase…", required: true },
    ],
  }),
  T({
    id: "tone-changer", name: "Tone Changer", category: "Writing", icon: "Palette", gradient: "from-pink-600 to-rose-600",
    description: "Shift any text into a different tone.",
    p: "Rewrite the text in the requested tone while keeping the meaning, key facts, and length roughly the same.",
    f: [
      { name: "text", label: "Your text", type: "textarea", placeholder: "Paste text…", required: true },
      { name: "tone", label: "New tone", type: "select", options: ["Friendly", "Authoritative", "Empathetic", "Playful", "Urgent"], placeholder: "Friendly" },
    ],
  }),
  T({
    id: "headline", name: "Headline Analyzer", category: "Writing", icon: "Target", gradient: "from-amber-600 to-orange-600",
    description: "Score your headline and improve it.",
    p: "Score the headline out of 10 on clarity, curiosity, and length. Explain the score and give 5 improved alternatives.",
    f: [
      { name: "headline", label: "Your headline", placeholder: "Paste your headline…", required: true },
      { name: "context", label: "Where it appears", type: "select", options: ["Blog", "Email", "Social", "Ad"], placeholder: "Blog" },
    ],
  }),
  T({
    id: "elevator-pitch", name: "Elevator Pitch Builder", category: "Writing", icon: "Zap", gradient: "from-violet-600 to-purple-600",
    description: "A crisp 30-second pitch for you or your product.",
    p: "Write a 30-second elevator pitch: hook, problem, your role/solution, proof point, and an ask. Provide a 10-second version too.",
    f: [
      { name: "who", label: "Who/what are you pitching?", placeholder: "Me as an SDET / my SaaS", required: true },
      { name: "audience", label: "Audience", placeholder: "Hiring manager / investor", required: true },
      { name: "hook", label: "Unique angle (optional)", type: "textarea" },
    ],
  }),
  T({
    id: "bio-writer", name: "Bio Writer", category: "Writing", icon: "User", gradient: "from-emerald-600 to-green-600",
    description: "Professional bios for any platform.",
    p: "Write 3 professional bios (short, medium, long) for the specified platform/audience. Highlight the user's specialization, key achievement, and value.",
    f: [
      { name: "about", label: "About you", type: "textarea", placeholder: "Role, experience, achievements…", required: true },
      { name: "platform", label: "Platform", type: "select", options: ["LinkedIn", "Twitter/X", "GitHub", "Website", "Conference"], placeholder: "LinkedIn" },
    ],
  }),
  T({
    id: "story-craft", name: "Story Craft", category: "Writing", icon: "Feather", gradient: "from-rose-600 to-pink-600",
    description: "Turn an anecdote into a compelling narrative.",
    p: "Turn the user's anecdote into a compelling short narrative: a vivid opening, tension, a turning point, and a takeaway. Preserve the facts.",
    f: [
      { name: "anecdote", label: "What happened", type: "textarea", placeholder: "Tell the story in your own words…", required: true },
      { name: "point", label: "The takeaway you want", placeholder: "e.g. persistence pays off" },
    ],
  }),
  T({
    id: "message-reply", name: "Smart Reply", category: "Writing", icon: "Reply", gradient: "from-sky-600 to-blue-600",
    description: "Draft replies to difficult or long messages.",
    p: "Draft a reply to the incoming message with the requested tone. Acknowledge the sender's points, address each, and end with the next step.",
    f: [
      { name: "incoming", label: "The message you received", type: "textarea", placeholder: "Paste the message…", required: true },
      { name: "tone", label: "Tone", type: "select", options: ["Polite", "Firm but fair", "Supportive", "Neutral"], placeholder: "Polite" },
    ],
  }),

  /* ---------------- Image & Media ---------------- */
  T({
    id: "image-alt", name: "Image Alt Text Writer", category: "Image & Media", icon: "Image", gradient: "from-teal-600 to-cyan-600",
    description: "Accessible alt text for any image.",
    p: "Describe the image (or the described scene) in concise, SEO- and accessibility-friendly alt text: one short sentence, plus a longer 2-sentence version.",
    f: [
      { name: "imageDescription", label: "Describe the image", type: "textarea", placeholder: "What's in the image?", required: true },
      { name: "context", label: "Context (optional)", placeholder: "e.g. blog hero image" },
    ],
  }),
  T({
    id: "image-prompt", name: "Image Prompt Generator", category: "Image & Media", icon: "Wand2", gradient: "from-fuchsia-600 to-purple-600",
    description: "Detailed prompts for AI image generators.",
    p: "Write a detailed AI image-generation prompt: subject, style, lighting, composition, mood, and negative prompt. Give 3 variations.",
    f: [
      { name: "idea", label: "What do you want the image to be?", type: "textarea", placeholder: "Describe the scene/subject…", required: true },
      { name: "style", label: "Style", type: "select", options: ["Photorealistic", "Illustration", "3D render", "Anime", "Minimalist"], placeholder: "Photorealistic" },
    ],
  }),
  T({
    id: "audio-notes", name: "Podcast Episode Planner", category: "Image & Media", icon: "Podcast", gradient: "from-orange-600 to-amber-600",
    description: "Plan a podcast episode with segments and questions.",
    p: "Plan a podcast episode: hook, 4-6 segments, interview questions, a listener takeaway, and a CTA. Time-box each segment.",
    f: [
      { name: "topic", label: "Episode topic", placeholder: "The episode's theme", required: true },
      { name: "guest", label: "Guest (optional)", placeholder: "e.g. a Senior SDET" },
      { name: "length", label: "Length (minutes)", type: "number", placeholder: "40" },
    ],
  }),
  T({
    id: "caption", name: "Image/Reel Caption Writer", category: "Image & Media", icon: "Captions", gradient: "from-cyan-600 to-teal-600",
    description: "Short, punchy captions with hashtags.",
    p: "Write 3 engaging captions for the post (short, medium, with a question), each with 3-5 relevant hashtags.",
    f: [
      { name: "content", label: "What's the post about?", type: "textarea", placeholder: "Describe the image/video…", required: true },
      { name: "audience", label: "Audience", placeholder: "Tech recruiters / engineers" },
    ],
  }),
  T({
    id: "logo-ideas", name: "Logo Idea Generator", category: "Image & Media", icon: "PenTool", gradient: "from-indigo-600 to-violet-600",
    description: "Concept directions for a logo or brand mark.",
    p: "Describe 4 distinct logo concept directions (symbol, typography, color palette, and where it would be used). Make each direction concrete enough to brief a designer.",
    f: [
      { name: "brand", label: "Brand / product name", placeholder: "e.g. Kranthi's QA Studio", required: true },
      { name: "vibe", label: "Desired vibe", placeholder: "Modern, trustworthy, fun…" },
    ],
  }),
  T({
    id: "thumbnail", name: "YouTube Thumbnail Ideas", category: "Image & Media", icon: "MonitorPlay", gradient: "from-red-600 to-rose-600",
    description: "High-CTR thumbnail concepts.",
    p: "Generate 5 thumbnail concepts: focal element, headline text, composition, and color contrast notes for maximum CTR.",
    f: [
      { name: "video", label: "Video title/topic", placeholder: "The video's title", required: true },
      { name: "style", label: "Channel style", placeholder: "Talking head, screencast, …" },
    ],
  }),
  T({
    id: "slides-outline", name: "Presentation Outliner", category: "Image & Media", icon: "Presentation", gradient: "from-emerald-600 to-teal-600",
    description: "A structured slide deck outline.",
    p: "Produce a slide-by-slide outline: slide title, one-line content, and visual suggestion for each slide. Include an opening hook and a closing CTA.",
    f: [
      { name: "topic", label: "Presentation topic", placeholder: "The talk's subject", required: true },
      { name: "slides", label: "Number of slides", type: "number", placeholder: "12" },
      { name: "audience", label: "Audience", placeholder: "Stakeholders / team / conference" },
    ],
  }),
  T({
    id: "voiceover", name: "Voiceover Script", category: "Image & Media", icon: "AudioLines", gradient: "from-purple-600 to-fuchsia-600",
    description: "Natural narration script for any video.",
    p: "Write a natural voiceover script for the described video. Use short sentences, conversational pacing, and pause cues. Note the approximate duration.",
    f: [
      { name: "topic", label: "Video content", type: "textarea", placeholder: "What happens in the video?", required: true },
      { name: "minutes", label: "Target duration (minutes)", type: "number", placeholder: "3" },
    ],
  }),
];

export const TOOL_CATEGORIES: ToolCategory[] = [
  "AI Assistants",
  "Developer",
  "Content",
  "Productivity",
  "Writing",
  "Image & Media",
];

export function getTool(id: string): ToolDefinition | undefined {
  return TOOLS.find((t) => t.id === id);
}
