# Foresite — Public Marketing Website (Phase 1)

Build the complete public-facing Foresite website: an enterprise-grade construction OS marketing site positioned as "The Construction Operating System". Auth portal and application shell come in later phases.

## Design system

Locked from the brief — no exploration needed.

- Deep Navy `#0F172A` (primary surfaces, footer, dark bands)
- Slate `#334155` (secondary text, borders)
- Azure Blue `#2563EB` (primary accent, CTAs, links)
- Construction Orange `#F97316` (secondary accent — used sparingly: metrics, highlights, health indicators)
- Backgrounds: `#FFFFFF` and `#F8FAFC`

Register all of these as semantic tokens in `src/styles.css` (oklch), never hardcoded in components. Typography: Inter-adjacent enterprise sans loaded via `<link>` in `__root.tsx`. Tight radii (6–8px), restrained shadows, thin slate borders, generous whitespace, precise data-dense layouts. Reference register: Microsoft 365 / Azure Portal / Linear / Notion. No gradients-on-white startup look, no playful illustration.

## Pages

| Route | Content |
| --- | --- |
| `/` | Hero (headline, subheading, Book a Demo / Get Started / Login), generated dashboard mockup image showing Projects, Tasks, Defects, Financial Health, Project Health Score; 6 feature cards (Projects, Tasks, Defects, Documents, Financials, AI Assistant); industries strip; closing CTA band |
| `/features` | Eight alternating sections — Projects, Tasks, Defects, Communications, Documents, Financials, Project Health, AI Assistant — each with visual, description, benefit list, CTA |
| `/industries` | Residential, Commercial, Civil, Government Projects, Maintenance Contracts |
| `/pricing` | Starter / Professional / Growing / Enterprise three-tier table with Start Trial + Book Demo, feature comparison, FAQ |
| `/about` | Mission, Vision, Why Foresite Exists, Roadmap timeline |
| `/contact` | Name, Company, Email, Phone, Message form with validation + Contact Sales / Book Demo; submits to a toast (no backend yet) |
| `/download` | Windows and Mac download cards; Android and iPhone cards with QR code placeholders and store badges |

Shared chrome: sticky header with Foresite wordmark, nav (Features, Industries, Pricing, About, Contact, Download), Login + Book a Demo buttons, mobile sheet menu. Multi-column footer with product/company/legal links.

## Later phases (not in this build)

Portal login/register (UI only, redirecting into the app) and the application shell — dashboard widgets, sidebar navigation, Projects, Project Detail tabs, Tasks, and future-module placeholders. Mock data will be introduced then, shaped to match your FastAPI contracts so swapping in real endpoints is a data-layer change only.

## Technical notes

- Stack is TanStack Start + React + TypeScript + Tailwind v4 (this project's fixed stack — equivalent to the Next.js/TS/Tailwind request; file-based routes under `src/routes/`).
- One route file per page, each with its own `head()` — unique title, description, og:title, og:description, canonical. Home replaces the placeholder `src/routes/index.tsx`.
- No business logic in the frontend. Page content lives in typed content modules (`src/content/*.ts`) so copy and future API data are separable from presentation.
- Reusable presentation components: `Section`, `FeatureCard`, `PricingTier`, `CTABand`, `Header`, `Footer`.
- Hero dashboard mockup and section visuals generated as images into `src/assets/`.
- Fully responsive: desktop, tablet, mobile.
- Branding string is exactly `Foresite` everywhere.
