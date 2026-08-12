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

## Mobile App (Android & iOS)

The site is also packaged as a native app with Capacitor — same codebase, one
static export bundled inside both platform shells. Build steps, live-reload
workflow, signing, store publishing, and limitations:
[MOBILE_APP.md](./MOBILE_APP.md).

```bash
npm run build:app          # static export + sync into android/ & ios/
npm run cap:open:android   # run on a device/emulator via Android Studio
npm run cap:open:ios       # run via Xcode
```

## Analytics

Real-time visitor analytics (Live / Total / Today) with a floating widget and
admin dashboard counters. Setup, schema, security rules, deployment, and
testing: [ANALYTICS_SETUP.md](./ANALYTICS_SETUP.md).

## License

Private — © Kranthi Kumar Katta
