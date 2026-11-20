import { describe, it, expect } from 'vitest';
import { appsForCategory, APP_CATEGORIES, visibleCategoryApps } from './connected-apps';

describe('contextual connected apps', () => {
  it('communications shows communication providers, not financial or document providers', () => {
    const ids = appsForCategory('Communications').map(app => app.id);
    expect(ids).toEqual(expect.arrayContaining(['google_mail', 'microsoft_outlook', 'microsoft_teams', 'slack', 'whatsapp', 'sms']));
    expect(ids).not.toContain('xero');
  });
  it('financials shows accounting and payment providers only', () => {
    const ids = appsForCategory('Financials').map(app => app.id);
    expect(ids).toEqual(expect.arrayContaining(['xero', 'myob', 'quickbooks', 'stripe', 'payapps', 'myob_accountright']));
    expect(ids).not.toContain('google_mail');
  });
  it('documents includes document services only', () => {
    expect(appsForCategory('Documents').map(app => app.id)).toEqual(['microsoft_sharepoint', 'microsoft_onedrive', 'google_drive', 'dropbox', 'box', 'egnyte', 'icloud_drive', 'amazon_s3', 'azure_blob_storage']);
  });
  it('settings includes every category', () => {
    expect(APP_CATEGORIES).toHaveLength(16);
    expect(appsForCategory('All')).toHaveLength(134);
    expect(new Set(appsForCategory('All').map(app => app.category)).size).toBe(16);
  });
  it('search remains confined to the selected category', () => {
    expect(appsForCategory('Documents', 'xero')).toEqual([]);
    expect(appsForCategory('All', 'xero').map(app => app.id)).toEqual(['xero', 'xero_payroll']);
  });
});

it('each category starts with five apps in supplied priority order and See More reveals the rest', () => {
  expect(visibleCategoryApps('Finance & Accounting').apps.map(app => app.name)).toEqual(['Xero', 'MYOB AccountRight', 'MYOB Business', 'QuickBooks Online', 'Reckon']);
  for (const category of APP_CATEGORIES) {
    const initial = visibleCategoryApps(category);
    expect(initial.apps).toHaveLength(Math.min(initial.total, 5));
    expect(visibleCategoryApps(category, '', true).apps).toHaveLength(initial.total);
  }
});
it('search finds apps beyond the collapsed five and shared tools appear in both categories', () => {
  expect(visibleCategoryApps('Finance & Accounting', 'NetSuite').apps.map(app => app.name)).toEqual(['NetSuite']);
  expect(appsForCategory('Estimating & Takeoff').map(app => app.id)).toContain('buildxact');
  expect(appsForCategory('Tendering & Procurement').map(app => app.id)).toContain('estimateone');
});