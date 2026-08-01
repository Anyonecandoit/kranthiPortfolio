# Implementation Plan

## Phased Implementation Plan

| Phase | Scope | Deliverables | Approx. Effort |
|-------|-------|--------------|----------------|
| **Phase 0 – Discovery & Setup** | Clone repo, install deps, verify build, add Tailwind custom config, set up Git branch (`feature/portfolio-redesign`). | Working dev environment, updated `tailwind.config.js`. | 0.5 day |
| **Phase 1 – Core Layout & Navigation** | Refine `RootLayout`, Header, Footer, global styles, dark‑mode toggle (optional). | Updated `layout.tsx`, `Header.tsx` (responsive menu), `Footer.tsx`. | 1 day |
| **Phase 2 – Content Pages (Static)** | Build static pages: Home (replace placeholder), About, Experience, Skills. Add placeholder data (from résumé). | `app/home/page.tsx`, `about/page.tsx`, `experience/page.tsx`, `skills/page.tsx`. | 2 days |
| **Phase 3 – Portfolio Grid & Modal** | Create `PortfolioPage`, `ProjectCard`, `Modal` component, routing for slugs. Add sample project data (JSON). | `portfolio/page.tsx`, `components/Modal.tsx`, mock `projects.json`. | 1.5 days |
| **Phase 4 – Contact Form & API** | Build `ContactPage` with form validation, toast feedback, and `/api/contact` handler (uses a simple webhook or email service). | `contact/page.tsx`, `api/contact.ts`, toast component. | 1 day |
| **Phase 5 – Animations & Polish** | Add `framer-motion` animations, scroll‑reveal, skill‑bars, micro‑interactions, respect reduced‑motion. | Updated components with motion wrappers. | 1 day |
| **Phase 6 – Accessibility & SEO** | Implement ARIA, focus‑traps, meta tags, JSON‑LD, OG/Twitter cards, sitemap. | Updated `metadata`, `Head` components, `next-sitemap`. | 0.5 day |
| **Phase 7 – Performance Optimisation** | Audit with Lighthouse, lazy‑load images, code‑split heavy components, tweak Tailwind purge. | Optimised bundle, updated `next.config.js`. | 0.5 day |
| **Phase 8 – Final QA & Documentation** | Test on desktop & mobile, run a11y audit (axe), verify SEO tags, update README. | Test checklist, updated docs. |
| **Phase 9 – Release** | Create PR, address any review comments, merge to `main`. | PR opened, CI passes. |

*Total estimated effort:* **~8 working days** (including buffer).