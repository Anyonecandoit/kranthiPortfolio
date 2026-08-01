# UI Guidelines

## Visual Design
- **Color palette** (light & dark) – Primary `#0A84FF`, Accent `#FF9500`, Background `#F7F9FC` / `#111111`, Surface `#FFFFFF` / `#1E1E1E`, Text‑Primary `#111111` / `#EBEBEB`, Text‑Secondary `#5F5F5F` / `#A0A0A0`, Border `#E2E8F0` / `#2D2D2D`.
- **Typography** – `Inter` for headings/body, `Fira Code` for code snippets. Use CSS variables for font sizes and weights (see `globals.css`).
- **Iconography** – Use `react-icons` (or SVGs) with a consistent stroke weight; colour inherits `currentColor` so it adapts to light/dark mode.
- **Spacing** – Follow a 4px baseline grid; Tailwind spacing utilities (`space-x-4`, `p-6`, etc.) map directly.
- **Dark Mode** – Enabled via `class` strategy (`dark` class on `<html>`). All components must adapt automatically using Tailwind's `dark:` variants.

## Layout & Grid
- Use Tailwind's responsive grid utilities (`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`).
- Keep content centered with `container mx-auto` and generous side padding (`px-4` on mobile, `px-8` on larger screens).
- Hero section uses a flex column centred vertically (`items-center justify-center h-screen`).
- Card components have a consistent box‑shadow (`shadow-md`), rounded corners (`rounded-lg`), and a subtle hover lift (`transform hover:-translate-y-1`).

## Interaction Patterns
- **Buttons** – Primary (blue) for main actions, secondary (gray) for secondary actions. Use the existing `Button` component with `variant` prop.
- **Links** – Underline on hover, transition colour smoothly (`transition-colors`).
- **Modals** – Centered overlay, dark backdrop with opacity `0.5`. Focus is trapped inside; pressing `Esc` closes.
- **Toasts** – Appear at top‑right, auto‑dismiss after 3 seconds, ARIA live region with `role="status"`.
- **Forms** – Inline validation (required fields, email format). Show error messages in red text below the field.
- **Hover & Focus** – All interactive elements must have a visible focus outline (`outline-2 outline-[#0A84FF]`). Hover effects must be subtle and complete within 150 ms.
- **Reduced Motion** – Respect `prefers-reduced-motion` – disable scroll‑reveal and heavy animations if the user prefers reduced motion.

## Accessibility Checklist
- Semantic HTML: `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`.
- All images have descriptive `alt` attributes; decorative icons use `aria-hidden="true"`.
- Form fields have associated `<label>` elements (or `aria-label`).
- Keyboard navigation order logical; `Tab` moves through interactive elements, `Enter` activates.
- Contrast ratios meet WCAG AA (≥ 4.5:1 for normal text).
- Ensure language attribute (`lang="en"`) on `<html>`.
- Use `role="dialog"` and `aria-modal="true"` for modals; return focus to the triggering element on close.
- Provide skip‑to‑content link at the top of the page.

## SEO Guidelines
- Each page exports a `metadata` object with a unique `title` and `description`.
- Add Open Graph tags (`og:title`, `og:description`, `og:image`, `og:url`).
- Include a Twitter Card (`summary_large_image`).
- Add structured data (`Person` schema) with name, job title, URL, and `sameAs` links.
- Use `next/head` to inject canonical link tags.
- Optimize images with `next/image` (automatic sizing, lazy‑loading, WebP). 
- Pre‑connect to Google Fonts (`<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin>`).
- Generate a sitemap during build (`next-sitemap`).

## Performance Guidelines
- Keep the JavaScript bundle < 300 KB gzipped (Tailwind JIT + purge). 
- Lazy‑load non‑critical images (`loading="lazy"`) and components (`dynamic()` import for Modal, Toast). 
- Use `next/script` with `strategy="lazyOnload"` for third‑party scripts.
- Set `Cache-Control` headers for static assets (1 year, immutable). 
- Use `prefetch` and `preload` for above‑the‑fold resources.
- Avoid large layout shifts – reserve image dimensions, use `aspect‑ratio` utilities.

## Code Conventions
- All components are **function components** with TypeScript typings (`React.FC<Props>`).
- Keep component files under `app/components/` with a single default export.
- Export reusable utility types (e.g., `ButtonProps`) from the component file.
- Use `className` prop to extend styling; avoid inline styles except for dynamic values.
- Follow the existing file naming convention (PascalCase for components, kebab‑case for folders/pages). 
- Keep logic minimal inside UI components – use hooks (`useState`, `useEffect`) for interactivity.
- Ensure every new component is covered by a simple unit test (if the repo has a testing setup). 

---

*All guidelines are meant to keep the portfolio cohesive, performant, and accessible while staying true to the inspiration sites' spirit.*
