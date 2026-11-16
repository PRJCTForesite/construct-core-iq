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
- Keep Users and Permissions Centre demo records and audit state in a shared app-level UsersProvider with stable context identity in a non-component module; both screens must read back the same session edits without implying real access enforcement.
- Place Administration and Permissions Centre at named child routes of the existing app layout; this preserves all existing public and app URLs.
- Keep expansion sample records in the shared platform content module and session edits in PlatformProvider; this lets prototype modules share changes without implying durable storage or enforced access.
- Keep the platform context identity in a non-component module; hot updates must not disconnect mounted providers from shared controls.
- Use project-ID page URLs for assistant conversations and browser-only history isolated by that ID; this preserves project-specific history while keeping the prototype independent of a live AI service.
- Keep unified access screens beneath the /login layout with scoped theme tokens; informational experience selections never mutate demo permissions and existing app URLs remain unchanged.

- Keep Client Portal templates and project-specific session state in PortalProvider beneath the existing app layout; use dedicated client-safe projections and explicit document sharing so portal widgets never read internal financial or note fields.
- Share document layout controls and health indicators across portals; keep client detail projections free of internal notes and trade defect actions limited to readiness or inspection.
- Derive session project progress from task weights when tasks change; task weight edits update the shared state immediately while keeping details open.
