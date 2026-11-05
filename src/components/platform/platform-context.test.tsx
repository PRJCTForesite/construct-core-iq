import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderToString } from 'react-dom/server';
import { PlatformProvider, usePlatform } from './PlatformProvider';
import { PlatformContext } from './platform-context';
import { useContext } from 'react';

function Consumer() {
  const store = usePlatform();
  const shared = useContext(PlatformContext);
  assert.equal(store, shared);
  return <span>{store.role}:{store.records.length}</span>;
}

test('provider and controls use the same stable context identity', () => {
  const html = renderToString(<PlatformProvider><Consumer /></PlatformProvider>);
  assert.match(html, /Owner/);
  assert.doesNotMatch(html, /PlatformProvider missing/);
});