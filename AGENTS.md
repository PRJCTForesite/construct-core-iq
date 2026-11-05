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
- Keep Permissions Centre demo data and permission helpers in a dedicated content module, with state owned by its page; this isolates demonstration changes from real access enforcement.
- Place Administration and Permissions Centre at named child routes of the existing app layout; this preserves all existing public and app URLs.
- Keep expansion sample records in the shared platform content module and session edits in PlatformProvider; this lets prototype modules share changes without implying durable storage or enforced access.
- Use project-ID page URLs for assistant conversations and browser-only history isolated by that ID; this preserves project-specific history while keeping the prototype independent of a live AI service.
- Keep unified access screens beneath the /login layout with scoped theme tokens; informational experience selections never mutate demo permissions and existing app URLs remain unchanged.
