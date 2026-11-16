import { test } from 'node:test';
import assert from 'node:assert/strict';
import { useContext } from 'react';
import { renderToString } from 'react-dom/server';
import { UsersContext } from './users-context';
import { UsersProvider } from './UsersProvider';
test('Users and Permissions consumers share the app-level directory context', () => {
  function Consumer() {
    const store = useContext(UsersContext);
    return <span>{store?.users[0]?.name ?? 'Missing directory'}:{store?.users.length ?? 0}</span>;
  }
  const html = renderToString(<UsersProvider><Consumer /><Consumer /></UsersProvider>);
  assert.equal(html.split('Lachlan Davies').length - 1, 2);
  assert.equal(html.includes('Missing directory'), false);
});