/**
 * Pure team-access helpers. Secrets are always passed in by server functions;
 * nothing here reads environment variables, so it is safe to bundle anywhere.
 */
export const TEAM_ACCESS_STORAGE_KEY = 'foresite.team-access.v1';
export const TEAM_ACCOUNT_EMAIL = 'developer@example.test';
export const TEAM_TOKEN_MAX_AGE_MS = 1000 * 60 * 60 * 24 * 180;

const encoder = new TextEncoder();

async function digest(value: string) {
  return new Uint8Array(await crypto.subtle.digest('SHA-256', encoder.encode(value)));
}

function sameBytes(a: Uint8Array, b: Uint8Array) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= (a[i] ?? 0) ^ (b[i] ?? 0);
  return diff === 0;
}

/** Timing-safe comparison: both sides are hashed to equal-length digests first. */
export async function passcodeMatches(input: string, expected: string) {
  if (!input || !expected) return false;
  const [a, b] = await Promise.all([digest(input), digest(expected)]);
  return sameBytes(a, b);
}

function toBase64Url(bytes: Uint8Array) {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function signature(keyMaterial: string, issuedAt: number) {
  const key = await crypto.subtle.importKey('raw', encoder.encode(keyMaterial), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return toBase64Url(new Uint8Array(await crypto.subtle.sign('HMAC', key, encoder.encode(`foresite-team:v1:${issuedAt}`))));
}

export async function signTeamToken(keyMaterial: string, issuedAt: number) {
  return `${issuedAt}.${await signature(keyMaterial, issuedAt)}`;
}

export async function verifyTeamToken(token: unknown, keyMaterial: string, now: number) {
  if (typeof token !== 'string' || token.length > 200 || !keyMaterial) return false;
  const [issued, provided] = token.split('.');
  const issuedAt = Number(issued);
  if (!provided || !Number.isSafeInteger(issuedAt) || issuedAt > now + 60_000 || now - issuedAt > TEAM_TOKEN_MAX_AGE_MS) return false;
  const expected = await signature(keyMaterial, issuedAt);
  return sameBytes(encoder.encode(provided), encoder.encode(expected));
}
