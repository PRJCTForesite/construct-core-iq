# Frontend service boundary

Projects and Tasks can load from and save to the FastAPI service (see
`liveRecordService.ts`, `src/lib/api/`). The address comes only from
`VITE_API_URL`; serializers follow the validated SQLAlchemy fields with
`project_id`/`task_id` as identifiers. Live rows replace only Project/Task
samples; every other module stays on mock data. No other URL, endpoint,
payload, credential or auth route is assumed. Existing forms and portals
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

## Pending account and integration adapters

`access-contracts.ts` contains browser-safe frontend operations, not proposed
FastAPI payloads. `createAccessServices(authentication, integrations)` accepts
reviewed adapters; `accessService` explicitly uses the demo adapter today.
The shared sign-in form calls its asynchronous email/password operation with
loading and error handling. Microsoft and Google OAuth are defined but disabled.
The existing synchronous session facade remains demo-only for legacy guards and
beta onboarding; migrate those callers together when verified auth is supplied.

Verified adapters must map confirmed account memberships to the six account
roles, manage JWT retrieval/expiry/refresh/sign-out, and perform provider consent
through the reviewed FastAPI service. The frontend does not decode JWT claims
to grant roles or persist passwords, access tokens or provider credentials.
Integration operations require a verified session and a selected membership;
this UI check never replaces backend role/organisation enforcement. PostgreSQL
storage, callback URLs, OAuth scopes, HTTP endpoints and token persistence remain
the external backend's responsibility and are intentionally unspecified here.
No connected records, live sync or successful consent are fabricated.