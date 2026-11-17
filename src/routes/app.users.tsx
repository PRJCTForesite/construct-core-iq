import { createFileRoute } from '@tanstack/react-router';
import { UsersCentre } from '@/components/users/UsersCentre';
export const Route = createFileRoute('/app/users')({
  validateSearch: (search: Record<string, unknown>): { invite?: 'Client' | 'Trade' | undefined } => ({ invite: search['invite'] === 'Client' || search['invite'] === 'Trade' ? search['invite'] : undefined }),
  head: () => ({ meta: [
    { title: 'Users & Permissions — Foresite' },
    { name: 'description', content: 'Manage Foresite user profiles, organisation roles, project assignments and shared permission templates.' },
    { property: 'og:title', content: 'Users & Permissions — Foresite' },
    { property: 'og:description', content: 'Manage people, role templates, security reviews, project access and permission history in one Foresite centre.' },
    { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary_large_image' }, { name: 'robots', content: 'noindex' },
  ] }), component: UsersCentre,
});