export const COMMUNICATION_APPS = [
  { id: 'internal', name: 'Foresite Messages', type: 'Internal', common: true, mode: 'record' },
  { id: 'gmail', name: 'Gmail', type: 'Email', common: true, mode: 'email', connector: 'google_mail' },
  { id: 'outlook', name: 'Outlook', type: 'Email', common: true, mode: 'email', connector: 'microsoft_outlook' },
  { id: 'sms', name: 'SMS / Text Messages', type: 'Messaging', common: true, mode: 'sms' },
  { id: 'whatsapp', name: 'WhatsApp', type: 'Messaging', common: true, mode: 'whatsapp' },
  { id: 'teams', name: 'Microsoft Teams', type: 'Messaging', common: false, mode: 'setup', connector: 'microsoft_teams' },
  { id: 'slack', name: 'Slack', type: 'Messaging', common: false, mode: 'setup', connector: 'slack' },
  { id: 'email', name: 'Other Email App', type: 'Email', common: false, mode: 'email' },
  { id: 'call', name: 'Phone Call', type: 'Call', common: false, mode: 'call' },
] as const;
export type CommunicationApp = typeof COMMUNICATION_APPS[number];

/** Open the user's own app with a draft; never send or imply inbox syncing. */
export function communicationDraftLink(id: string, recipient: string, subject: string, body: string): string | null {
  const address = recipient.trim();
  const encode = encodeURIComponent;
  if (['gmail', 'outlook', 'email'].includes(id)) {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address)) return null;
    if (id === 'gmail') return `https://mail.google.com/mail/?view=cm&fs=1&to=${encode(address)}&su=${encode(subject)}&body=${encode(body)}`;
    if (id === 'outlook') return `https://outlook.office.com/mail/deeplink/compose?to=${encode(address)}&subject=${encode(subject)}&body=${encode(body)}`;
    return `mailto:${encode(address)}?subject=${encode(subject)}&body=${encode(body)}`;
  }
  if (['sms', 'whatsapp', 'call'].includes(id)) {
    const phone = address.replace(/[\s()-]/g, '');
    if (!/^\+[1-9]\d{7,14}$/.test(phone)) return null;
    if (id === 'whatsapp') return `https://wa.me/${phone.slice(1)}?text=${encode(body)}`;
    if (id === 'call') return `tel:${phone}`;
    return `sms:${phone}?body=${encode(body)}`;
  }
  return null;
}