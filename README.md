# Component Cost Calculator

> **Should your team build, borrow, or buy?**
>
> A research-backed cost calculator for the design system decision every front-end team fights over — now with the accessibility debt most analyses ignore.

## Live Demo

[tomdeluca-component-cost.netlify.app](#) _(update after deploy)_

## What It Does

Enter seven project variables — team size, hourly rate, component count, browser targets, WCAG compliance level, QA headcount, and timeline. The calculator produces a side-by-side first-year cost estimate across three paths:

| Path                   | What it models                                                   |
| ---------------------- | ---------------------------------------------------------------- |
| **Build from Scratch** | Full custom implementation: design, code, docs, tests            |
| **Open-Source**        | Radix UI / shadcn/ui primitives with your own styling layer      |
| **Commercial Library** | Licensed library (MUI Pro, Telerik, Syncfusion) + vendor support |

Each estimate breaks down dev hours, QA hours, accessibility remediation, cross-browser testing, annual maintenance, and licensing. Results update live as you type.

### Key Feature: Accessibility Debt Visibility

Most build-vs-buy analyses treat all three paths as equally accessible. They are not. Open-source libraries like Radix UI ship with correct ARIA roles and keyboard interactions built in — reducing remediation to a styling concern. Building from scratch at WCAG AA can add 30% to your total development hours. The calculator surfaces this cost line-by-line so it can actually enter the conversation.

### Export

The **Download Audit Card** button generates a PDF summary — light-mode, clean layout, suitable for dropping into a Confluence doc or a Slack message to leadership. The shareable URL encodes all inputs so any estimate can be shared and reproduced exactly.

## Tech Stack

- **[Next.js 15](https://nextjs.org/)** App Router, React 19
- **TypeScript** — strict mode, zero `any`
- **CSS Modules** + CSS custom properties — no CSS-in-JS, no Tailwind
- **[Lucide React](https://lucide.dev/)** — icon set
- **[html2canvas](https://html2canvas.hertzen.com/) + [jsPDF](https://parall.ax/products/jspdf)** — client-side PDF export (no server, no cost)
- Fonts: [Inter](https://fonts.google.com/specimen/Inter) (body) + [Outfit](https://fonts.google.com/specimen/Outfit) (headings) via `next/font`

## Calculation Methodology

All estimates are derived from published research — every constant in the codebase is named and cited. The in-app **"How I calculated this"** section documents the complete formula breakdown.

**Primary sources:**

- [Deque Systems — The Business Case for Digital Accessibility (2023)](https://www.deque.com/blog/the-business-case-for-digital-accessibility/)
- [Nielsen Norman Group — Design Systems ROI (2022)](https://www.nngroup.com/articles/design-systems-roi/)
- [WebAIM Million Report (2024)](https://webaim.org/projects/million/)
- [Smashing Magazine — Design Systems Handbook (2021)](https://www.designbetter.co/design-systems-handbook)

## Accessibility

This project eats its own cooking:

- WCAG 2.1 AA target throughout
- Skip navigation link
- All interactive elements keyboard navigable; no focus traps
- `focus-visible` outlines on every control (2px, 3px offset)
- ARIA labels on icon-only buttons
- Screen reader live region announces PDF export completion
- Native `<details>`/`<summary>` for the methodology section — zero JS, automatic open/closed announcement
- Color contrast ≥ 4.5:1 for all text (body text exceeds 9:1 on dark backgrounds)

## Local Development

```bash
npm install
npm run dev
# → http://localhost:3000
```

```bash
npm run build   # Production build
npm run lint    # ESLint
```

## Deploying to Netlify

The `netlify.toml` at the repo root configures the build command and the Next.js plugin. No environment variables are required — all calculations run client-side.

```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

## Portfolio Context

- **Design system architecture** — understanding the full build/buy trade-off space
- **Accessibility-first development** — the calculator's core differentiator is surfacing a11y debt cost
- **Business-aware engineering** — translating technical decisions into dollar estimates non-engineers can act on
- **Clean TypeScript** — business logic in pure, testable functions entirely decoupled from React
- **Tool UX** — shareable URL state, PDF export, live calculation, keyboard accessibility
