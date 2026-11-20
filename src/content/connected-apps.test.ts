import { describe, it, expect } from 'vitest';
import { appsForCategory } from './connected-apps';

describe('contextual connected apps', () => {
  it('communications shows communication providers, not financial or document providers', () => {
    expect(appsForCategory('Communications').map(app => app.id)).toEqual(['google_mail', 'microsoft_outlook', 'microsoft_teams', 'slack', 'whatsapp', 'sms']);
  });
  it('financials shows accounting and payment providers only', () => {
    expect(appsForCategory('Financials').map(app => app.id)).toEqual(['xero', 'myob', 'quickbooks', 'stripe']);
  });
  it('documents includes document services only', () => {
    expect(appsForCategory('Documents').map(app => app.id)).toEqual(['google_drive', 'microsoft_onedrive', 'microsoft_sharepoint', 'dropbox']);
  });
  it('settings includes every category', () => {
    expect(appsForCategory('All')).toHaveLength(14);
    expect(new Set(appsForCategory('All').map(app => app.category)).size).toBe(3);
  });
  it('search remains confined to the selected category', () => {
    expect(appsForCategory('Documents', 'xero')).toEqual([]);
    expect(appsForCategory('All', 'xero').map(app => app.id)).toEqual(['xero']);
  });
});