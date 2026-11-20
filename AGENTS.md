<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Application architecture
- Keep permission constants and types in a dependency-free module consumed by demo permission services and record seeds; this prevents SSR import cycles without changing permission rules.
- Keep onboarding validation and sample fixtures browser-safe and separate from views; store no passwords or payment credentials, and keep beta bypass and invitations explicitly mock-only until verified backend contracts exist.
- Load optional onboarding samples through a guarded provider action before any real record exists; initialise a fresh per-app mock store with sample IDs so real exports and module-by-module sample replacement remain correct.
- Keep software plans and optional service prices in one public pricing module shared by marketing and subscription previews; previews must never activate billing or change permissions.
- Keep the combined Users centre backed by the shared app-level UsersProvider with stable context identity; profiles, access panels and audit history must read the same session edits without implying real enforcement.
- Keep Administration under the existing app layout and redirect the legacy permissions URL to Users; this preserves bookmarks without duplicating people management.
- Keep expansion sample records in the shared platform content module and session edits in PlatformProvider; this lets prototype modules share changes without implying durable storage or enforced access.
- Keep the platform context identity in a non-component module; hot updates must not disconnect mounted providers from shared controls.
- Use project-ID page URLs for assistant conversations and browser-only history isolated by that ID; this preserves project-specific history while keeping the prototype independent of a live AI service.
- Keep unified access screens beneath the /login layout with scoped theme tokens; informational experience selections never mutate demo permissions and existing app URLs remain unchanged.

- Keep Client Portal templates and project-specific session state in PortalProvider beneath the existing app layout; use dedicated client-safe projections and explicit document sharing so portal widgets never read internal financial or note fields.
- Share document layout controls and health indicators across portals; keep client detail projections free of internal notes and trade defect actions limited to readiness or inspection.
- Derive session project progress from task weights when tasks change; task weight edits update the shared state immediately while keeping details open.
- Keep records behind per-app mock service instances and sign-in behind authService; module adapters share the record store and export real records separately — preserves session workflows without guessed transport contracts or sample submission.
- Keep role-based simulation in permissionsService and account memberships as organisation-scoped role arrays — allows future multi-workspace integration without implying enforced security.
- Keep homepage operational previews in isolated presentational components with explicitly labelled illustrative records; marketing changes must not mutate application state or imply live customer usage.
- Keep stakeholder showcase content keyed by view and section in a public-only content module, with one atomic selection state; tab changes must immediately select distinct content without touching private app records.
- Keep communication app choices and safe draft links in a browser-safe catalogue; personal inbox integration stays setup-needed until verified auth and server-side per-user credential storage exist, preventing shared-account exposure.
- Use the shared transparent logo assets across public and application surfaces and derive the favicon from the same mark; this keeps exterior backgrounds consistent without CSS masking.
- Maintain the router-derived sitemap through required staticData.sitemap decisions, excluding private subtrees and omitting unauthoritative lastmod dates; this keeps public discovery aligned with routes.
- Keep beta application validation and contact constants in a browser-safe shared module; submission must report success only after the chosen delivery service accepts it, preventing silently lost leads.
- Keep dashboard layouts and guide completion in versioned account-scoped browser preferences, separate from mock business records; no backend contracts exist for durable user settings yet.
- Use full-widget dnd-kit drag surfaces in dashboard edit mode with mouse, delayed touch and keyboard sensors; inert content prevents accidental record actions while arranging widgets.
- Pack dashboard widgets with measured CSS grid row spans and dense placement; persist validated size and brand-tone presets with existing account layouts, keeping widget content scrollable at compact sizes.
- Anchor program walkthroughs to rendered page actions and record inputs, with account-scoped shown-step preferences and explicit Yes/No replay; mount form tips inside their dialog to preserve focus and scrolling without changing record state.
