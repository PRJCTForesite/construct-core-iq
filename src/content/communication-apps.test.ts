import { test } from 'node:test';
import assert from 'node:assert/strict';
import { COMMUNICATION_APPS, communicationDraftLink } from './communication-apps';

test('Gmail, Outlook, SMS and WhatsApp are immediately available choices', () => {
  for (const id of ['gmail', 'outlook', 'sms', 'whatsapp']) assert.equal(COMMUNICATION_APPS.find(app => app.id === id)?.common, true);
});
test('Personal email drafts preserve the recipient and encoded content', () => {
  const gmail = new URL(communicationDraftLink('gmail', 'client@example.com', 'Site & safety', 'Review #1') ?? '');
  assert.equal(gmail.origin, 'https://mail.google.com');
  assert.equal(gmail.searchParams.get('to'), 'client@example.com');
  assert.equal(gmail.searchParams.get('su'), 'Site & safety');
  assert.equal(gmail.searchParams.get('body'), 'Review #1');
  const outlook = new URL(communicationDraftLink('outlook', 'client@example.com', 'Update', 'Ready') ?? '');
  assert.equal(outlook.origin, 'https://outlook.office.com');
  assert.equal(outlook.searchParams.get('to'), 'client@example.com');
});
test('Phone drafts require an international number and preserve message text', () => {
  assert.equal(communicationDraftLink('sms', '+61 437 722 552', '', 'Site ready'), 'sms:+61437722552?body=Site%20ready');
  assert.equal(communicationDraftLink('whatsapp', '+61 437 722 552', '', 'Site ready'), 'https://wa.me/61437722552?text=Site%20ready');
  assert.equal(communicationDraftLink('whatsapp', 'not-a-number', '', ''), null);
});
test('Setup-only apps cannot pretend to open or send a personal message', () => {
  assert.equal(communicationDraftLink('slack', 'demo-user', '', 'Hello'), null);
  assert.equal(communicationDraftLink('teams', 'demo-user', '', 'Hello'), null);
  assert.equal(communicationDraftLink('gmail', 'javascript:alert(1)', '', ''), null);
});