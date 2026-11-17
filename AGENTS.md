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
- Keep Users and Permissions Centre demo records and audit state in a shared app-level UsersProvider with stable context identity in a non-component module; both screens must read back the same session edits without implying real access enforcement.
- Place Administration and Permissions Centre at named child routes of the existing app layout; this preserves all existing public and app URLs.
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
