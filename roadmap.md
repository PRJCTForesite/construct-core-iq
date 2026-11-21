# MVP expansion
- [x] Shared mock records, permission-aware views and global controls
- [x] Tasks, calendar, clients, trades and documents
- [x] Reports, AI Insights and project conversation history
- [x] Settings and client portal preview
- [x] Dashboard, workspace and project detail expansion
- [x] Verify task creation, calendar, document versions, three report exports, isolated project histories, archive and role restrictions

# Unified portal access — Stage 1
- [x] Upgrade login with informational Owner, Client and Trade access cards
- [x] Add controlled registration and future workspace/role experience previews
- [x] Verify shared sign-in, organisation code requirement and mobile layout

# Client Portal V1 — Stage 2
- [x] Client-safe records, template/widget framework and permission helpers
- [x] Dashboard, approvals, updates, weighted progress and project health
- [x] Photos, shared documents, financial summary, defects, contacts, messages and notifications
- [x] Subscriber template/settings controls and existing access integration
- [x] Verify client flows, subscriber settings, privacy rules and mobile layout

- [x] Stage 3 Trade Portal V1 (prototype, session-only)

# Users Management Centre V1
- [x] Shared user register, role templates and audit state with Permissions Centre
- [x] Users dashboard, filters, profile drawer, permissions and project assignment
- [x] Organisation structure, activity, workspace and invitation previews
- [x] Verify shared edits, role rules and desktop/mobile workflows

# Frontend usability and workflow rollup
- [x] Task status filters, full-card details, quick actions and live weighted progress
- [x] Shared document preview/list views and prominent health indicators
- [x] Defect details, photo thumbnails and permission-aware quick actions
- [x] Client and Trade portal card, document and mobile alignment
- [x] Verify session workflows and regression rules across all portals

# Functional frontend pass
- [x] Module-by-module sample removal on first real record, with sample notices
- [x] Mock-only connection boundary for future FastAPI/PostgreSQL service (real records only)
- [x] Live Variations/claims and RFI/site instruction registers; New Invoice and Compose open forms
- [ ] Connect FastAPI service and real authentication — deferred until confirmed backend contracts are supplied

# Mock service integration preparation
- [x] Remove assumed endpoints and introduce replaceable record and module service interfaces
- [x] Add mock authentication and multi-organisation memberships; centralise demo permission checks
- [x] Preserve existing session workflows and sample removal; verify services and browser flows (59 tests; sign-in, defect save/read-back, portal previews, sign-out)

# Homepage market alignment
- [x] Outcome-led hero and operational workspace preview
- [x] Five value cards, clearly labelled sample figures and builder problem-to-solution section
- [x] Supporting Construction Intelligence positioning; verify homepage and CTA destinations on desktop/mobile

# Pricing and professional services
- [x] Update shared plans, homepage summary and subscription tab
- [x] Build pricing comparison, onboarding and optional advisory services with consultation links
- [x] Verify all prices and desktop/mobile navigation

# Subscriber onboarding
- [x] Account, verification previews, plans, payment preview and organisation setup
- [x] Invited client/trade journeys, independent trade fields and beta shortcut
- [x] Welcome actions, optional sample generator and regression/browser checks

# Combined Users centre
- [x] Bring role templates, security reviews and permission history into Users
- [x] Remove Permissions navigation and redirect existing links to Users
- [x] Verify combined session edits, history and desktop/mobile views

# Add Communication rework
- [x] Clarify whose messaging and email accounts should be linked
- [x] Rework communication entry with common apps and searchable See More
- [ ] Connect personal Gmail, Outlook, Teams and Slack accounts — blocked by verified authentication and secure per-user storage pending the user's backend contracts
- [x] Verify communication record save/readback and app draft links

# Launch video and brand cleanup
- [x] Create a 20-second branded motion-graphics launch video with music (X reference unavailable; frame-based review)
- [x] Rename Book Demo buttons to Book
- [x] Remove exterior logo backgrounds and verify across website and app

# Google Search Console setup
- [x] Check Google connection and verified property access
- [x] Complete site verification and submit the published sitemap, with approval before any required publish

# Website final beta and contact pass
- [x] Update public contacts, beta intake and public CTA destinations
- [x] Apply supplied homepage, features, pricing, founder and industry copy corrections
- [x] Update FormSubmit and public contacts to confirmed admin@foresiteos.com.au and repeat the application check (nine tests pass; website submission returns activation-required)
- [x] Confirm FormSubmit inbox delivery — user confirmed the test application arrived in admin@foresiteos.com.au; form now submits from the visitor's browser — blocked until user clicks Activate Form in admin@foresiteos.com.au and confirms a subsequent test arrives; publish updated recipient before live use
- [x] Verify supplied SORCI 2025 PDF and replace interim source links (21.5% Australian respondents on p. 57; 87.4% Australian fixed-price contracts on p. 9; source links verified in the website)
- [x] Verify validation, desktop/mobile pages and public metadata

# SEO finding reconciliation
- [x] List stored failures and check scanner freshness
- [x] Verify heading order, actual website contact submission and published sitemap/robots
- [x] Record verified stale failures as fixed pending the next SEO scan; no site code changes required
- [x] Sweep public pages, alternate views, shared navigation, contact modes and private sitemap exclusions; correct pricing/directory heading gaps and feature/mobile demo request links
- [x] Verify all seven public heading sequences, services pricing, expanded trade profile and mobile demo navigation; 40 relevant tests pass

# Brand descriptor
- [x] Use "Combined Construction Systems" as the supporting brand statement across public pages, access screens, metadata and structured data; logo artwork unchanged

# Dashboard customisation and tab guides
- [x] Add movable, hideable dashboard widgets with account-specific browser preferences
- [x] Add short first-visit guides with skip and reopen controls for every application tab
- [x] Verify dashboard saving, mobile movement and guide dismissal/reopening
- [ ] Beta production access, record retention, invitations and uploads — blocked by confirmed backend contracts

# Program walkthrough
- [x] Anchor page prompts to actions and widgets
- [x] Add brief record-form field prompts and field help buttons
- [x] Ask Yes/No before replay; remember shown steps per account in this browser
- [x] Verify task creation, replay, dismissal and mobile positioning

# Widget sizing and appearance
- [x] Compact mixed-size widgets without empty row space
- [x] Preset sizes, brand colour menu, hide and reset options
- [x] Verify saved appearance, compact placement and desktop/mobile dragging

# Walkthrough and drag regressions
- [x] Isolate page walkthrough targets and explicit replay requests across tab changes
- [x] Keep all widget dimensions and neighbouring slots stable during drag
- [x] Verify navigation, help replay, mixed-size dragging and saved layout (desktop/mobile, touch and keyboard; eight regression tests)

# App-wide walkthrough sweep
- [x] Check shared page guides, record-form guides, field help and all widget movement paths
- [x] Prevent consumed help requests replaying after conditional form fields change
- [x] Verify all 18 guided tabs, conditional document fields, task field help and original desktop/mobile dragging; preserve existing records and permissions

# Interrupted tab walkthroughs
- [x] Cancel on navigation and start destination guide when its content mounts
- [x] Restart interrupted page guides; suppress only skipped or completed guides
- [x] Verify tab switching, return, completion, skip and help replay; all 18 tab guides and conditional field regression checks pass

# Specific field help
- [x] Retain field question marks and replace their replay prompts with item-only explanations and extra context
- [x] Verify field switching, dismissal and conditional fields on desktop/mobile; retain separate page guides (ten regression tests and browser checks pass)

# Personal connected apps
- [x] Expand supplied catalogue to 134 apps across 16 categories, with provider icons, dropdown filters and five-app previews with See More; preserve setup-only connections (14 tests and desktop/mobile browser checks pass; unavailable BidContender logo uses initials)
- [x] Prepare asynchronous email/password, future Microsoft/Google OAuth, JWT session and scoped connection adapter interfaces without assumed endpoints or storage schemas
- [x] Verify adapter delegation and blocked unverified connections; retain demo sign-in and check Xero setup on desktop/mobile (18 tests and browser checks pass)
- [x] Add category-specific Communications, Financials and Documents directories and complete Settings catalogue
- [ ] Real personal connections — blocked by supplied external FastAPI sign-in/storage contracts and Google/Microsoft developer clients (external backend retained)
- [ ] Xero per-customer connections — custom consent approved; blocked by external sign-in/storage contracts and Xero developer registration
- [x] Verify category filtering, setup states and desktop/mobile screens (five tests and browser checks pass)
- [ ] Verify live personal consent and account readback — blocked by external authentication/storage contracts and configured provider clients

# Appearance, phone dashboard and private beta access
- [x] Add Light / Dark / System appearance switch across website, sign-in and app (saved per device, applied before the page paints)
- [x] Shrink every dashboard tile size on phones (two-column small tiles, shorter medium/large caps, condensed detail) while keeping desktop sizes
- [x] Remove sideways page scrolling: tables, calendar, permissions, plans and tabs switch to stacked cards on narrow screens (25 pages at 390/768px, earlier at 360/1024px)
- [x] One-click beta entry visible only on devices unlocked with the private team passcode (server-checked signed device token, 180-day expiry)
- [x] Verify phone dragging/saving, theme persistence and system preference, team access unlock/forgery rejection (tests and browser checks pass)

# Menu, corners and tile sizes
- [x] Remove the appearance switch from the phone menus so it no longer overlaps the close button; keep it in every page header
- [x] Soften the corners of the slide-out menus, menu links and top headers on phone and tablet
- [x] Give every dashboard tile its own small (short figures, fits without cropping), medium and large (extra detail) view; checked on phone and desktop
