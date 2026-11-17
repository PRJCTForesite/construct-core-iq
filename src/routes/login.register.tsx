import { createFileRoute } from '@tanstack/react-router';
import { Onboarding } from '@/components/access/Onboarding';
import type { OnboardingKind } from '@/content/onboarding';
export const Route = createFileRoute('/login/register')({
  validateSearch: (search: Record<string, unknown>): { kind?: OnboardingKind | undefined; code?: string | undefined; organisation?: string | undefined; email?: string | undefined } => ({
    kind: ['subscriber', 'independent-trade', 'client-invite', 'trade-invite'].includes(String(search['kind'])) ? search['kind'] as OnboardingKind : undefined,
    code: typeof search['code'] === 'string' ? search['code'].slice(0, 100) : undefined,
    organisation: typeof search['organisation'] === 'string' ? search['organisation'].slice(0, 150) : undefined,
    email: typeof search['email'] === 'string' ? search['email'].slice(0, 255) : undefined,
  }),
  head: () => ({ meta: [{ title: 'Create Account & Onboarding — Foresite' }, { name: 'description', content: 'Set up your Foresite account, choose a software plan and preview organisation onboarding, client and trade invitations.' }, { property: 'og:title', content: 'Foresite Account Onboarding' }, { property: 'og:description', content: 'Construction business onboarding, invited client and trade journeys and beta workspace access.' }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary_large_image' }, { name: 'robots', content: 'noindex' }] }),
  component: RegisterPage,
});
function RegisterPage() {
  const search = Route.useSearch();
  return <Onboarding key={`${search.kind ?? 'subscriber'}:${search.code ?? ''}`} kind={search.kind ?? 'subscriber'} code={search.code} organisation={search.organisation} invitedEmail={search.email} />;
}
