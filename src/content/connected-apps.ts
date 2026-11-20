export const APP_CATEGORIES = ['Communications', 'Financials', 'Documents'] as const;
export type AppCategory = typeof APP_CATEGORIES[number];
export type ConnectedApp = {
  id: string;
  name: string;
  category: AppCategory;
  summary: string;
  data: string;
  personalConnector: boolean;
  setupUrl: string;
};

// Availability is capability, not a claim of configured consent or connected accounts.
export const CONNECTED_APPS: ConnectedApp[] = [
  { id: 'google_mail', name: 'Gmail', category: 'Communications', summary: 'Email conversations and mailbox history.', data: 'Read-only messages, threads and labels.', personalConnector: true, setupUrl: 'https://console.cloud.google.com/apis/credentials' },
  { id: 'microsoft_outlook', name: 'Microsoft Outlook', category: 'Communications', summary: 'Microsoft email and calendar history.', data: 'Read-only mail and calendar events.', personalConnector: true, setupUrl: 'https://entra.microsoft.com/' },
  { id: 'microsoft_teams', name: 'Microsoft Teams', category: 'Communications', summary: 'Project conversations and team updates.', data: 'Selected channels and messages, subject to organisation consent.', personalConnector: true, setupUrl: 'https://entra.microsoft.com/' },
  { id: 'slack', name: 'Slack', category: 'Communications', summary: 'Workspace conversations and project channels.', data: 'Selected channels and conversation history.', personalConnector: true, setupUrl: 'https://api.slack.com/apps' },
  { id: 'whatsapp', name: 'WhatsApp Business', category: 'Communications', summary: 'Business messaging account activity.', data: 'Business messaging only; personal WhatsApp history is not offered here.', personalConnector: false, setupUrl: 'https://developers.facebook.com/docs/whatsapp/' },
  { id: 'sms', name: 'SMS / Twilio', category: 'Communications', summary: 'Business text messages and delivery records.', data: 'Business SMS records, not your phone’s personal text-message history.', personalConnector: false, setupUrl: 'https://www.twilio.com/docs' },
  { id: 'xero', name: 'Xero', category: 'Financials', summary: 'Invoices, bills and accounting overview.', data: 'Read-only accounting records from your authorised Xero organisation.', personalConnector: false, setupUrl: 'https://developer.xero.com/' },
  { id: 'myob', name: 'MYOB Business', category: 'Financials', summary: 'Australian accounting and business records.', data: 'Accounting records; provider access and permissions must be confirmed.', personalConnector: false, setupUrl: 'https://developer.myob.com/' },
  { id: 'quickbooks', name: 'QuickBooks Online', category: 'Financials', summary: 'Invoices, expenses and supplier records.', data: 'Read-only accounting overview from the authorised company.', personalConnector: false, setupUrl: 'https://developer.intuit.com/' },
  { id: 'stripe', name: 'Stripe', category: 'Financials', summary: 'Payment activity and transaction overview.', data: 'Payment records only; no payment collection is activated.', personalConnector: false, setupUrl: 'https://docs.stripe.com/connect' },
  { id: 'google_drive', name: 'Google Drive', category: 'Documents', summary: 'Drawings, files and shared folders.', data: 'Read-only file metadata and explicitly authorised files.', personalConnector: true, setupUrl: 'https://console.cloud.google.com/apis/credentials' },
  { id: 'microsoft_onedrive', name: 'Microsoft OneDrive', category: 'Documents', summary: 'Personal and business document libraries.', data: 'Read-only authorised files and folders.', personalConnector: true, setupUrl: 'https://entra.microsoft.com/' },
  { id: 'microsoft_sharepoint', name: 'Microsoft SharePoint', category: 'Documents', summary: 'Team document libraries and project files.', data: 'Read-only authorised sites and document libraries.', personalConnector: true, setupUrl: 'https://entra.microsoft.com/' },
  { id: 'dropbox', name: 'Dropbox', category: 'Documents', summary: 'Plans, consultant files and shared folders.', data: 'Read-only file listings; provider consent setup is still required.', personalConnector: false, setupUrl: 'https://www.dropbox.com/developers' },
];

export function appsForCategory(category: AppCategory | 'All', query = '') {
  const search = query.trim().toLowerCase();
  return CONNECTED_APPS.filter(app => (category === 'All' || app.category === category) && `${app.name} ${app.summary}`.toLowerCase().includes(search));
}