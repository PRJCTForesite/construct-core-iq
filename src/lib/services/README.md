# Frontend service boundary

All services currently use mock data. No URL, HTTP endpoint, request payload,
credentials, or live backend contract is assumed. Existing forms and portals
retain their session-only behaviour. Refreshing restores sample records.

- `contracts.ts` describes frontend domain interfaces, not transport schemas.
- `mockRecordService.ts` owns one app's session records, sample removal and task progress.
- Project, task, document and defect services share that record adapter; other
  registers use the generic module adapter. Reads return copies.
- `userService.ts` backs the shared Users/Permissions directory. Audit remains in UsersProvider.
- `authService.ts` backs demo sign-in/logout/current account. Its memberships hold
  organisation IDs, project IDs and independent role arrays; no workspace switch
  or permission grant is implied by these example memberships.
- `permissionsService.ts` centralises role-based UI simulation. Portal-safe
  projections remain mandatory. None of these helpers enforce backend security.

Once FastAPI specifications are confirmed, implement transport adapters separately
and map confirmed response models to these frontend models. Introduce asynchronous
loading/error handling when connecting those adapters; current synchronous reads
and writes are intentionally for in-memory mocks only. Do not add guessed paths.
Real authentication, organisation scoping and authorisation must be validated by
the backend. Export only `getRealRecords()` when migrating session records.