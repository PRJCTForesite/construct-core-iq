import { createFileRoute, redirect } from '@tanstack/react-router';

// Preserve existing bookmarks while keeping a single people-and-access centre.
export const Route = createFileRoute('/app/administration/permissions')({
  beforeLoad: () => { throw redirect({ to: '/app/users', replace: true }); },
  head: () => ({ meta: [
    { title: 'User Access Redirect — Foresite' },
    { name: 'description', content: 'User and permission management is now combined in the Foresite Users centre.' },
    { property: 'og:title', content: 'User Access Redirect — Foresite' },
    { property: 'og:description', content: 'Open the combined Foresite Users centre for profiles, roles and access.' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'robots', content: 'noindex' },
  ] }),
});
