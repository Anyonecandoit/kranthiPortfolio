# Product Requirements Document (PRD)

## 1️⃣ Project Overview
| Goal | Description |
|------|-------------|
| **Primary** | Present Kranthi Kumar Katta’s professional story, skills, experiences, and contact information in a clean, interactive, and memorable way. |
| **Secondary** | Demonstrate modern front‑end engineering (Next 13+ with App Router, TypeScript, Tailwind CSS, optimal SEO, accessibility, and performance). |
| **Constraints** | - Use the existing Next.js/Tailwind setup <br> - Do **not** copy code or text from the inspiration sites – only draw visual/interaction inspiration. <br> - All new UI must be original. |
| **Target audience** | Recruiters, hiring managers, peers, potential collaborators, and anyone searching “Kranthi Kumar Katta” online. |

---

## 2️⃣ Information Architecture
```
/
├─ / (Home)                         – Hero + brief intro + CTA
├─ /about                           – Full professional summary, timeline, skills
├─ /experience                      – Card list of jobs / projects (chronological)
├─ /skills                          – Visual skill matrix / badge system
├─ /portfolio (or /projects)        – Showcase of key work with filters
├─ /contact                         – Form + social links + downloadable PDF
└─ /api/*                           – Server‑less contact endpoint (Next.js API route)
```
**Key Content Blocks**
| Page | Sections | Highlights |
|------|----------|------------|
| **Home** | Hero (name + tagline), short “About” teaser, primary CTAs (Download résumé, View Projects), animated background / subtle micro‑animations. | |
| **About** | Two‑column layout: left – portrait image; right – professional summary (from résumé), quick facts (experience years, location, certifications). |
| **Experience** | Timeline component with each job as a **Card** (role, company, dates, bullet achievements). Use progressive disclosure (click to expand for full description). |
| **Skills** | Grouped by categories (Languages, Automation, CI/CD, Cloud, Databases). Each skill shows an icon + proficiency bar (animated on scroll). |
| **Portfolio** | Grid of project cards (image, title, short description, tech tags). Clicking opens a modal or dedicated page with deeper details, screenshots, and links to repo/demos. |
| **Contact** | Simple contact form (name, email, message) → POST to `/api/contact`. Also list social icons (GitHub, LinkedIn, Twitter). Include a “Download résumé (PDF)” button. |

---

## 3️⃣ UX Flow
1. **Landing** – User lands on `/`. Scroll triggers fade‑in of hero, then secondary sections. 
2. **Navigation** – Persistent header with smooth scroll / link navigation. Mobile menu collapses into a hamburger (`Button` component). 
3. **Explore** – Clicking any top‑nav link routes to the appropriate page via Next.js client‑side routing (no full page reload). 
4. **Project Details** – From `/portfolio`, clicking a project opens a **modal overlay** (via a `Dialog` component) with rich media; URL updates (`/portfolio/[slug]`) so the modal can be directly linked. 
5. **Contact** – Submitting the form shows an animated success toast → sends email using a server‑less function (or third‑party service). 
6. **Download résumé** – Direct download of the PDF stored in `public/`. 

All interactions are keyboard‑focusable and have ARIA roles for screen readers. 

---

## 4️⃣ Component Tree (React / Next)
```
RootLayout
 └─ Header
      ├─ NavLink (Home, About, Experience, Skills, Projects, Contact)
      └─ Button (Mobile menu)
 └─ Footer
 └─ Main (children)

Pages
 ├─ HomePage
 │    ├─ HeroSection
 │    │    ├─ Heading, Subheading, CTAButtons
 │    │    └─ AnimatedBackground (CSS keyframes)
 │    ├─ AboutPreviewCard
 │    └─ ProjectsPreviewCarousel
 ├─ AboutPage
 │    ├─ ProfileCard (Image + QuickFacts)
 │    └─ SummaryText (from résumé)
 ├─ ExperiencePage
 │    └─ Timeline
 │         └─ ExperienceCard (expandable)
 ├─ SkillsPage
 │    └─ SkillCategoryGrid
 │         └─ SkillBadge (icon + bar)
 ├─ PortfolioPage
 │    └─ ProjectGrid
 │         └─ ProjectCard (onClick → Modal)
 ├─ ContactPage
 │    ├─ ContactForm
 │    └─ SocialLinks (Icon components)
 └─ api/contact.ts (handler)

Shared UI Components
 ├─ Button (variant primary/secondary)
 ├─ Card (generic container)
 ├─ Modal / Dialog
 ├─ Toast (for notifications)
 ├─ LoadingSpinner
 └─ Icon (wrapper for next/image)
```

---

## 5️⃣ Folder Structure (new/updated)
```
/app
 ├─ components/
 │   ├─ Button.tsx
 │   ├─ Card.tsx
 │   ├─ Footer.tsx
 │   ├─ Header.tsx
 │   ├─ Icon.tsx
 │   ├─ Modal.tsx          // new
 │   ├─ Toast.tsx          // new
 │   └─ LoadingSpinner.tsx // new
 ├─ layout.tsx
 ├─ page.tsx               // Home
 ├─ about/
 │   └─ page.tsx
 ├─ experience/
 │   └─ page.tsx
 ├─ skills/
 │   └─ page.tsx
 ├─ portfolio/
 │   ├─ page.tsx
 │   └─ [slug]/
 │        └─ page.tsx       // optional deep page or modal data fetch
 └─ contact/
     └─ page.tsx
/api
 └─ contact.ts              // email handler (e.g., using nodemailer or a webhook)
public/
 ├─ resume.pdf              // Kranthi’s résumé (already present)
 └─ images/                 // hero, project screenshots, portrait
styles/
 └─ globals.css (existing) – will import Tailwind utilities and custom CSS variables
config/
 └─ urls.ts (existing) – may add external link constants
```
> **Files that will need modification / addition** (for the PR) 
> - `app/layout.tsx` – import new global CSS variables (fonts, colors). 
> - `app/components/*` – add `Modal`, `Toast`, `LoadingSpinner`. 
> - New pages (`about/page.tsx`, `experience/page.tsx`, `skills/page.tsx`, `portfolio/page.tsx`, `contact/page.tsx`). 
> - `public/` – add portrait image, project screenshots, hero background. 
> - `app/globals.css` – add custom CSS for animations, focus outlines, dark‑mode colors. 
> - `tailwind.config.js` – add custom palette, enable JIT mode, configure `darkMode: 'class'`. 
> - `next.config.js` – enable `next/image` remote domains (if needed). 
> - `package.json` – add any required dependencies (`react-icons`, `framer-motion`, `emailjs` or `nodemailer`). 
> - `README.md` (optional) – update project description with new pages & usage instructions.

---

## 6️⃣ Animations & Interactions
| Interaction | Implementation |
|------------|----------------|
| **Hero fade‑in** | CSS `@keyframes fadeIn` (0 % opacity → 100 %). |
| **Scroll reveal** | `framer‑motion` `whileInView` for sections (slide‑up + fade). |
| **Skill bar fill** | CSS variable animation triggered when component enters viewport. |
| **Project card hover** | Subtle scale (`transform: scale(1.03)`) + shadow transition. |
| **Mobile menu** | Slide‑in from left using `transform` + `transition`. |
| **Modal opening** | `opacity` and `scale` transition (`framer‑motion`). |
| **Toast** | Fade‑out after 3 seconds; ARIA live region for screen readers. |

All animations are kept < 200 ms to stay snappy and respect reduced‑motion user preferences (`@media (prefers-reduced-motion: reduce)` disables them). 

---

## 7️⃣ Responsive Strategy
| Breakpoint | Layout Adjustments |
|------------|-------------------|
| **≥1280 px** (xl) | 4‑column project grid, wide hero text, extra whitespace. |
| **1024 px–1279 px** (lg) | 3‑column grid, header stays horizontal. |
| **768 px–1023 px** (md) | 2‑column grid, header collapses to hamburger, hero text center‑aligned. |
| **<768 px** (sm) | Single‑column layout, vertical stacking, full‑width buttons, collapsible timeline (accordion). |
| **Portrait mobile** | Touch‑friendly hit‑areas (min‑height 44 px), font sizes slightly larger, images fluid. |

Tailwind’s built‑in breakpoint utilities (`sm:`, `md:`, `lg:`, `xl:`) will be used throughout. 

---

## 8️⃣ Visual Design
### 8.1 Color Palette
| Role | Light | Dark |
|------|--------|------|
| **Primary** | `#0A84FF` (iOS blue) | `#0A84FF` |
| **Accent** | `#FF9500` (orange) | `#FF9F0A` |
| **Background** | `#F7F9FC` (very light gray) | `#111111` |
| **Surface** | `#FFFFFF` | `#1E1E1E` |
| **Text‑Primary** | `#111111` | `#EBEBEB` |
| **Text‑Secondary** | `#5F5F5F` | `#A0A0A0` |
| **Border / Divider** | `#E2E8F0` | `#2D2D2D` |

These colors combine the clean blues from **DiogoTC**, the muted neutrals from **Notlan585**, and the orange accent from **Gulshan‑SDET**. 

### 8.2 Typography
| Element | Font | Size (mobile → desktop) | Weight |
|---------|------|--------------------------|--------|
| **Headings** | `Inter` (via `next/font/google`) | 2.5rem → 3.5rem | 600 |
| **Sub‑headings** | `Inter` | 1.75rem → 2.25rem | 500 |
| **Body** | `Inter` | 1rem → 1.125rem | 400 |
| **Code snippets / badges** | `Fira Code` (fallback `monospace`) | 0.875rem | 400 |
| **Monospace for skill bars** | `Fira Code` | — | — |

Typography is defined in `globals.css` using CSS variables for easy theming. 

---

## 9️⃣ Accessibility (a11y)
* **WCAG 2.1 AA** compliance. 
* Semantic HTML (`<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`). 
* All interactive elements receive `focus-visible` outlines (`outline: 2px solid #0A84FF`). 
* `aria-label`s on icon‑only links (GitHub, LinkedIn). 
* `role="dialog"` for modal with `aria-modal="true"` and focus‑trap. 
* Keyboard navigation: Tab order logical, `Esc` closes modal/toast. 
* Color contrast meets 4.5:1 (text) and 3:1 (large text). 
* Respect `prefers-reduced-motion`. 
* Provide alt text for all images (including decorative icons). 

---

## 🔟 SEO
| Element | Strategy |
|--------|----------|
| **Meta tags** | Dynamic `title` & `description` per page (via `export const metadata`). Use résumé keywords (e.g., “SDET”, “Automation Engineer”, “FinTech QA”). |
| **Open Graph** | `og:image` → hero image, `og:title`, `og:description`, `og:url`. |
| **Twitter Card** | Summary large image card. |
| **JSON‑LD** | Structured data (`Person` schema) with name, jobTitle, url, sameAs (social links). |
| **Canonical URLs** | Ensure each page has `<link rel="canonical">`. |
| **Sitemap** | `next-sitemap` plugin (dev only). |

---

## 1️⃣1️⃣ Performance
| Metric | Target | Implementation |
|--------|--------|----------------|
| **First Contentful Paint (FCP)** | < 800 ms | Critical CSS inlined, server‑side rendering of initial HTML. |
| **Largest Contentful Paint (LCP)** | < 1 s | Optimized hero image (WebP, width 800 px). |
| **Cumulative Layout Shift (CLS)** | < 0.1 | Reserve image dimensions, avoid layout‑shifting animations. |
| **Total Blocking Time (TBT)** | < 150 ms | Code‑splitting via dynamic imports for heavy components (`Modal`, `Toast`). |
| **Overall bundle size** | < 300 KB (gzip) | Tailwind JIT, purge unused classes, keep dependencies minimal. |
| **Cache strategy** | 1 year for static assets, Stale‑while‑revalidate for JSON data. | Use Next.js `Cache-Control` headers. |

---

## 1️⃣2️⃣ Required Files (to be created or updated)
| Path | Reason |
|------|--------|
| `app/layout.tsx` | Add global font variables, maybe import dark‑mode CSS variables. |
| `app/components/Modal.tsx` | Reusable dialog for project details. |
| `app/components/Toast.tsx` | Notification system for contact form success/failure. |
| `app/components/LoadingSpinner.tsx` | UI feedback while fetching data. |
| `app/about/page.tsx` | New “About” page. |
| `app/experience/page.tsx` | Timeline page. |
| `app/skills/page.tsx` | Skills grid. |
| `app/portfolio/page.tsx` | Project showcase grid. |
| `app/contact/page.tsx` | Contact form & social links. |
| `app/api/contact.ts` | Serverless email handler (or webhook). |
| `public/images/` | Add portrait, project screenshots, hero background. |
| `styles/globals.css` | Extend Tailwind config, define custom colors, animation keyframes, focus outlines. |
| `tailwind.config.js` | Add custom palette, enable JIT mode, configure `darkMode: 'class'`. |
| `next.config.js` (optional) | Add remote image domains if using external screenshots. |
| `package.json` (dev dependencies) | Add `framer-motion`, `react-icons`, `emailjs-com` (or `nodemailer`). |
| `README.md` (optional) | Update project description with new pages & usage instructions. |

---

## 1️⃣3️⃣ Phased Implementation Plan
| Phase | Scope | Deliverables | Approx. Effort |
|-------|-------|--------------|----------------|
| **Phase 0 – Discovery & Setup** | Clone repo, install deps, verify build, add Tailwind custom config, set up Git branch (`feature/portfolio-redesign`). | Working dev environment, updated `tailwind.config.js`. | 0.5 day |
| **Phase 1 – Core Layout & Navigation** | Refine `RootLayout`, Header, Footer, global styles, dark‑mode toggle (optional). | Updated `layout.tsx`, `Header.tsx` (responsive menu), `Footer.tsx`. | 1 day |
| **Phase 2 – Content Pages (Static)** | Build static pages: Home (replace placeholder), About, Experience, Skills. Add placeholder data (from résumé). | `app/home/page.tsx`, `about/page.tsx`, `experience/page.tsx`, `skills/page.tsx`. | 2 days |
| **Phase 3 – Portfolio Grid & Modal** | Create `PortfolioPage`, `ProjectCard`, `Modal` component, routing for slugs. Add sample project data (JSON). | `portfolio/page.tsx`, `components/Modal.tsx`, mock `projects.json`. | 1.5 days |
| **Phase 4 – Contact Form & API** | Build `ContactPage` with form validation, toast feedback, and `/api/contact` handler (uses a simple webhook or email service). | `contact/page.tsx`, `api/contact.ts`, toast component. | 1 day |
| **Phase 5 – Animations & Polish** | Add `framer-motion` animations, scroll‑reveal, skill‑bars, micro‑interactions, respect reduced‑motion. | Updated components with motion wrappers. |
| **Phase 6 – Accessibility & SEO** | Implement ARIA, focus‑traps, meta tags, JSON‑LD, OG/Twitter cards, sitemap. | Updated `metadata`, `Head` components, `next-sitemap`. |
| **Phase 7 – Performance Optimisation** | Audit with Lighthouse, lazy‑load images, code‑split heavy components, tweak Tailwind purge. | Optimised bundle, updated `next.config.js`. |
| **Phase 8 – Final QA & Documentation** | Test on desktop & mobile, run a11y audit (axe), verify SEO tags, update README. | Test checklist, updated docs. |
| **Phase 9 – Release** | Create PR, address any review comments, merge to `main`. | PR opened, CI passes. |

*Total estimated effort:* **~8 working days** (including buffer). 

---

## 1️⃣4️⃣ Risks & Mitigations
| Risk | Impact | Mitigation |
|------|--------|------------|
| **Design similarity** – accidentally copying visual elements from inspiration sites. | Legal/ethical risk. | All UI built from scratch; use inspiration only for layout concepts, not exact assets. |
| **Resume PDF size** – heavy file causing slow download. | Performance. | Optimize PDF (compress) before placing in `public/`. |
| **Email deliverability** – contact form email may be flagged as spam. | User frustration. | Use a reputable transactional email service (SendGrid, Mailgun) or a simple mailto link as fallback. |
| **Accessibility gaps** – missing ARIA for custom components. | WCAG compliance failure. | Run automated a11y tests (`npm run audit:a11y`) and manual keyboard testing. |
| **Responsive bugs** – layout break at obscure viewport widths. | Poor UX on some devices. | Test with Chrome devtools device mode across a range of breakpoints. |
| **Performance regressions** – added libraries increase bundle. | Slow LCP. | Keep dependencies minimal, tree‑shake, use dynamic imports for heavy UI (modal). |

---

## 1️⃣5️⃣ Acceptance Criteria
1. **Functional** – All navigation links work, project modal opens/closes, contact form sends a message and shows a toast. 
2. **Responsive** – Layout passes visual checks at the breakpoints listed in Section 7. 
3. **Accessibility** – WCAG 2.1 AA passes (axe core score ≥ 90). 
4. **SEO** – Meta tags, OG tags, JSON‑LD present; Lighthouse SEO score ≥ 90. 
5. **Performance** – Lighthouse (Desktop) scores: ≥ 90 % for Performance, Best Practices, and Accessibility. 
6. **Design** – Visual style aligns with the *spirit* of the three inspiration sites but uses original assets and colors. 

---

## 1️⃣6️⃣ Next Steps
*Please review the PRD above.*
- If any section needs refinement (different color palette, additional pages, or removal of a feature), let me know. 
- Once approved, I’ll begin the phased implementation, starting with **Phase 0** (environment setup) and open a feature branch for the work. 

---

**Awaiting your go‑ahead or any requested adjustments.**
