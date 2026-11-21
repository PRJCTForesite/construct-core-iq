import { createServerFn } from '@tanstack/react-start';
import { passcodeMatches, signTeamToken, verifyTeamToken } from './team-access';

/** Public endpoints by nature: each verifies the passcode or a signed device token itself. */
export const unlockTeamAccess = createServerFn({ method: 'POST' })
  .inputValidator((input: { passcode: string }) => {
    const passcode = typeof input?.passcode === 'string' ? input.passcode.slice(0, 200) : '';
    return { passcode };
  })
  .handler(async ({ data }) => {
    const passcode = process.env['BETA_TEAM_PASSCODE'];
    const secret = process.env['BETA_TEAM_SESSION_SECRET'];
    if (!passcode || !secret) return { ok: false as const, reason: 'unavailable' as const };
    if (!(await passcodeMatches(data.passcode, passcode))) {
      await new Promise(resolve => setTimeout(resolve, 900));
      return { ok: false as const, reason: 'incorrect' as const };
    }
    return { ok: true as const, token: await signTeamToken(`${secret}:${passcode}`, Date.now()) };
  });

export const checkTeamAccess = createServerFn({ method: 'POST' })
  .inputValidator((input: { token: string }) => ({ token: typeof input?.token === 'string' ? input.token.slice(0, 200) : '' }))
  .handler(async ({ data }) => {
    const passcode = process.env['BETA_TEAM_PASSCODE'];
    const secret = process.env['BETA_TEAM_SESSION_SECRET'];
    if (!passcode || !secret || !data.token) return { trusted: false };
    return { trusted: await verifyTeamToken(data.token, `${secret}:${passcode}`, Date.now()) };
  });
