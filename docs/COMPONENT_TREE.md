# Component Tree

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
