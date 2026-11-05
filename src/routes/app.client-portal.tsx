import { createFileRoute } from '@tanstack/react-router';
import { ClientPortal } from '@/components/client-portal/ClientPortal';
export const Route = createFileRoute('/app/client-portal')({
  head: () => ({ meta: [
    { title: 'Client Portal — Foresite' },
    { name: 'description', content: 'Your project approvals, structured builder updates, progress, shared photos and documents in Foresite.' },
    { property: 'og:title', content: 'Client Portal — Foresite' },
    { property: 'og:description', content: 'Client project transparency, approvals and configurable dashboards.' },
    { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary_large_image' }, { name: 'robots', content: 'noindex' },
  ] }), component: ClientPortal,
});
