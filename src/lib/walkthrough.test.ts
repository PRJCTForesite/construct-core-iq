import { expect, it } from 'vitest';
import { recordShown, replayForScope, unseenSteps, walkthroughKey, walkthroughSteps } from './walkthrough';
it('never automatically repeats a shown step', () => {
  const seen = recordShown([], 'title');
  expect(unseenSteps([{id:'title'}, {id:'project'}], seen)).toEqual([{id:'project'}]);
  expect(recordShown(seen, 'title')).toEqual(['title']);
});
it('keeps walkthrough progress separate between accounts and forms', () => {
  expect(walkthroughKey('a','Task')).not.toBe(walkthroughKey('b','Task'));
  expect(walkthroughKey('a','Task')).not.toBe(walkthroughKey('a','Project'));
});
it('does not carry a dashboard help replay into My Workspace', () => {
  const replay = { scope: '/app', token: 'manual-help' };
  expect(replayForScope('/app', replay)).toBe('manual-help');
  expect(replayForScope('/app/workspace', replay)).toBeUndefined();
});
it('keeps shown dashboard steps excluded after visiting another tab', () => {
  const shown = recordShown([], 'section:Business Health Score');
  expect(walkthroughKey('a', 'page:/app')).not.toBe(walkthroughKey('a', 'page:/app/workspace'));
  expect(unseenSteps([{ id: 'section:Business Health Score' }], shown)).toEqual([]);
});
it('consumes form help once even when conditional document fields change', () => {
  const fields = [{id:'title'}, {id:'share-with-client'}];
  expect(walkthroughSteps(fields, ['title'], 'help-1')).toEqual(fields);
  expect(walkthroughSteps([...fields, {id:'client-document-category'}], ['title', 'share-with-client'], 'help-1', 'help-1')).toEqual([{id:'client-document-category'}]);
});
it('allows a new explicit field help request to replay shown fields', () => {
  expect(walkthroughSteps([{id:'title'}], ['title'], 'help-2', 'help-1')).toEqual([{id:'title'}]);
});