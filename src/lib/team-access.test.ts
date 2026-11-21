import { expect, it } from 'vitest';
import { passcodeMatches, signTeamToken, verifyTeamToken, TEAM_TOKEN_MAX_AGE_MS } from './team-access';

const KEY = 'test-signing-key:test-passcode';
const NOW = 1_800_000_000_000;

it('accepts only the exact team passcode', async () => {
  expect(await passcodeMatches('Correct-Code-1', 'Correct-Code-1')).toBe(true);
  expect(await passcodeMatches('correct-code-1', 'Correct-Code-1')).toBe(false);
  expect(await passcodeMatches('', 'Correct-Code-1')).toBe(false);
});

it('trusts a device token signed with the current team key', async () => {
  const token = await signTeamToken(KEY, NOW);
  expect(await verifyTeamToken(token, KEY, NOW + 1000)).toBe(true);
});

it('rejects tokens after the passcode or signing key changes', async () => {
  const token = await signTeamToken(KEY, NOW);
  expect(await verifyTeamToken(token, 'test-signing-key:new-passcode', NOW)).toBe(false);
});

it('rejects tampered and expired device tokens', async () => {
  const token = await signTeamToken(KEY, NOW);
  expect(await verifyTeamToken(token.replace(/.$/, c => c === 'A' ? 'B' : 'A'), KEY, NOW)).toBe(false);
  expect(await verifyTeamToken(token, KEY, NOW + TEAM_TOKEN_MAX_AGE_MS + 1)).toBe(false);
  expect(await verifyTeamToken('not-a-token', KEY, NOW)).toBe(false);
});
