# Kranthi Kumar Katta — AI-Powered Portfolio

> Premium AI-powered personal platform with conversational AI, real-time messaging, knowledge base, and admin dashboard.

**Live site:** [kranthikumarkatta.in](https://www.kranthikumarkatta.in)

## Tech Stack

- **Framework:** Next.js14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + custom design tokens (glassmorphism, gradients, dark/light themes)
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Testing:** Playwright (E2E)
- **AI Docs:** Context7 MCP (live framework documentation)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

## Project Structure

```
├── app/
│   ├── layout.tsx          # Root layout (metadata, fonts, theme provider)
│   ├── page.tsx            # Home page (section composition)
│   └── globals.css         # Design tokens, animations, utilities
├── components/
│   ├── ui/                 # Reusable UI kit (Button, Card, Badge)
│   ├── hero.tsx            # Hero section
│   ├── about.tsx           # About section
│   ├── skills.tsx          # Skills section
│   ├── projects.tsx        # Projects section
│   ├── experience.tsx      # Experience timeline
│   ├── contact.tsx         # Contact section
│   ├── navbar.tsx          # Glass-morphism sticky nav
│   ├── footer.tsx          # Footer
│   ├── theme-provider.tsx  # Dark/light theme
│   ├── type-animation.tsx  # Rotating subtitle
│   └── particles-background.tsx  # Desktop particle canvas
├── data/
│   └── resume.ts           # Typed content data
├── lib/
│   └── utils.ts            # cn() utility
├── public/                 # Static assets
├── tailwind.config.ts      # Extended theme + animations
├── next.config.js          # Image remote patterns
└── tsconfig.json           # TypeScript config
```

## Roadmap

See [PROJECT_PROGRESS.md](./PROJECT_PROGRESS.md) for the full phased roadmap and current status.

## License

Private — © Kranthi Kumar Katta
