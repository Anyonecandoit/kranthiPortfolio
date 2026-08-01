# Responsive Strategy

## Breakpoints (Tailwind defaults)
- **sm** – `640px` and up
- **md** – `768px` and up
- **lg** – `1024px` and up
- **xl** – `1280px` and up
- **2xl** – `1536px` and up (optional for very large screens)

## Layout Adjustments per Breakpoint
| Breakpoint | Layout Adjustments |
|------------|-------------------|
| **≥1280 px** (xl) | 4‑column project grid, wide hero text, extra whitespace.
| **1024 px–1279 px** (lg) | 3‑column grid, header stays horizontal.
| **768 px–1023 px** (md) | 2‑column grid, header collapses to hamburger, hero text centred.
| **<768 px** (sm) | Single‑column layout, vertical stacking, full‑width buttons, collapsible timeline (accordion).
| **Portrait mobile** | Touch‑friendly hit‑areas (min‑height 44 px), slightly larger font sizes, fluid images.

## Implementation Details
- Use Tailwind’s responsive utilities (`sm:`, `md:`, `lg:`, `xl:`) on every component.
- Hero section: flex column centred with `h-screen` on desktop; on mobile, reduce vertical padding (`py-12`).
- Navigation: hide the full nav on `md` and below, show a hamburger button (`Button` component) that toggles a slide‑in side menu.
- Grid components (`ProjectGrid`, `SkillCategoryGrid`): `grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4`.
- Timeline (`ExperiencePage`): on `md` and above show a vertical line with cards alternating sides; on `sm` collapse to an accordion list.
- Modals: Full‑screen centered on `sm`, fixed‑size with max‑width on `md+`.
- Forms: Stack inputs vertically on `sm`; align label‑input pairs horizontally on `md+` (using `flex` utilities).
- Images: Use `next/image` with `layout="responsive"` and `objectFit="cover"`; define explicit width/height to prevent CLS.
- Animations: Guarded by `@media (prefers-reduced-motion: reduce)` – disable scroll‑reveal and heavy transitions.

## Testing Matrix
| Device / Viewport | Verify | Notes |
|-------------------|--------|-------|
| iPhone SE (375 × 667) | Mobile stack, hamburger menu, touch targets. |
| Galaxy S9 (360 × 740) | Same as above, dark mode toggle. |
| iPad (768 × 1024) | Tablet layout, two‑column grid, nav visible. |
| Desktop 1366 × 768 | Standard layout, 3‑column grid, hover effects. |
| Desktop 1920 × 1080 | Extra‑large grid, spacing, high‑resolution images. |

All breakpoints should be tested in Chrome DevTools device emulation and on real devices where possible.

---

*Following these guidelines will keep the portfolio looking great and functional across the full range of modern devices.*
