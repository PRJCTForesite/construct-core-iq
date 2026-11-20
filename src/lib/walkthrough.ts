import { preferenceKey } from './workspace-preferences';
export function walkthroughKey(account: string, scope: string) { return preferenceKey(account, `program-walkthrough:${scope}`); }
export function unseenSteps<T extends { id: string }>(steps: T[], seen: string[]) { return steps.filter(step => !seen.includes(step.id)); }
export function recordShown(seen: string[], id: string) { return [...new Set([...seen, id])]; }
export function replayForScope(scope: string, replay?: { scope: string; token: string }) { return replay?.scope === scope ? replay.token : undefined; }
export function walkthroughSteps<T extends { id: string }>(steps: T[], seen: string[], replay?: string, consumedReplay?: string) {
  return replay && replay !== consumedReplay ? steps : unseenSteps(steps, seen);
}
export function pageWalkthroughSteps<T extends { id: string }>(steps: T[], seen: string[], replay?: string, consumedReplay?: string) {
  if (replay && replay !== consumedReplay) return steps;
  return seen.includes('__finished__') || (steps.length > 0 && steps.every(step => seen.includes(step.id))) ? [] : steps;
}