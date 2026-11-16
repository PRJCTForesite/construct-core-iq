import { createFileRoute } from '@tanstack/react-router';
import { UsersCentre } from '@/components/users/UsersCentre';
export const Route = createFileRoute('/app/users')({
  head: () => ({ meta: [
    { title: 'Users Management Centre — Foresite' },
    { name: 'description', content: 'Manage Foresite user profiles, organisation roles, project assignments and shared permission templates.' },
    { property: 'og:title', content: 'Users Management Centre — Foresite' },
    { property: 'og:description', content: 'A shared register for people, roles and project membership in Foresite.' },
    { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary_large_image' }, { name: 'robots', content: 'noindex' },
  ] }), component: UsersCentre,
});