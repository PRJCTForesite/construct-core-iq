import { expect, it } from 'vitest';
import { recordShown, unseenSteps, walkthroughKey } from './walkthrough';
it('never automatically repeats a shown step', () => {
  const seen = recordShown([], 'title');
  expect(unseenSteps([{id:'title'}, {id:'project'}], seen)).toEqual([{id:'project'}]);
  expect(recordShown(seen, 'title')).toEqual(['title']);
});
it('keeps walkthrough progress separate between accounts and forms', () => {
  expect(walkthroughKey('a','Task')).not.toBe(walkthroughKey('b','Task'));
  expect(walkthroughKey('a','Task')).not.toBe(walkthroughKey('a','Project'));
});