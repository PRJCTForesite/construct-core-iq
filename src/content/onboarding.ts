export type OnboardingKind = 'subscriber' | 'independent-trade' | 'client-invite' | 'trade-invite';
export const TRIAL_DAYS = 30;
export const RESEND_SECONDS = 30;
export const EMAIL_PREVIEW_CODE = '842631';
export const SMS_PREVIEW_CODE = '347289';
export const INDUSTRIES = ['Residential Builder', 'Commercial Builder', 'Civil Contractor', 'Trade Contractor', 'Project Management Consultant'];
export const ONBOARDING_PREVIEW_KEY = 'foresite.onboarding-preview';
export const BETA_PREVIEW_KEY = 'foresite.beta-preview';
export function isInvited(kind: OnboardingKind) { return kind === 'client-invite' || kind === 'trade-invite'; }
export function onboardingSteps(kind: OnboardingKind) {
  return isInvited(kind) ? ['Create Password', 'Verify Email', 'Welcome'] : ['Create Account', 'Verify Email', 'Verify Mobile', 'Choose Plan', 'Payment Details', 'Organisation Setup', 'Welcome'];
}
export function passwordIssue(password: string, confirmation: string) {
  if (password.length < 12) return 'Use at least 12 characters.';
  if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password) || !/[^A-Za-z0-9\s]/.test(password)) return 'Include uppercase, lowercase, a number and a special character.';
  if (password !== confirmation) return 'Passwords must match.';
  return null;
}
export function verificationIssue(value: string, expected: string) {
  return /^\d{6}$/.test(value) && value === expected ? null : 'Enter the six-digit preview code shown below.';
}
export function accountIssue(fields: { first: string; last: string; company: string; email: string; mobile: string; password: string; confirm: string; code: string }, kind: OnboardingKind) {
  if (!fields.first.trim() || !fields.last.trim()) return 'Enter your first and last name.';
  if (!isInvited(kind) && !fields.company.trim()) return 'Enter your company name.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.trim())) return 'Enter a valid email address.';
  if (!isInvited(kind) && !/^\+?[\d\s()-]{8,20}$/.test(fields.mobile)) return 'Enter a valid mobile number.';
  if (isInvited(kind) && !fields.code.trim()) return 'An invitation code is required for this preview.';
  return passwordIssue(fields.password, fields.confirm);
}
export const DEMO_FORM = { first: 'Lochy', last: 'Davies', company: 'Foresite Construction', email: 'demo@foresite.com.au', mobile: '0437 722 552', password: 'ForesiteDemo2026!', confirm: 'ForesiteDemo2026!', code: '', abn: '33 114 184 026', address: '8 Webber Parade, Keilor VIC 3036', contact: 'Lochy Davies', industry: 'Residential Builder', employees: '5', licence: 'DEMO-LICENCE-001', whiteCard: 'DEMO-WC-001', category: 'Electrical', regions: 'Melbourne West', liability: 'Demo compliance preview' };
export type OnboardingPreview = { company: string; first: string; last: string; email: string; plan: string; kind: OnboardingKind };
export function readOnboardingPreview(): OnboardingPreview | null {
  if (typeof window === 'undefined') return null;
  try {
    const value = JSON.parse(window.sessionStorage.getItem(ONBOARDING_PREVIEW_KEY) ?? 'null');
    if (!value || typeof value.company !== 'string' || typeof value.email !== 'string' || typeof value.first !== 'string' || typeof value.last !== 'string' || typeof value.plan !== 'string' || !['subscriber','independent-trade','client-invite','trade-invite'].includes(value.kind)) return null;
    return value;
  } catch { return null; }
}
