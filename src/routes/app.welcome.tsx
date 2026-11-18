import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { Building2, UserPlus, HardHat, ArrowRight, WandSparkles, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePlatform } from '@/components/platform/PlatformProvider';
import { useUsers } from '@/components/users/UsersProvider';
import { readOnboardingPreview } from '@/content/onboarding';
import { onboardingDemoRecords, onboardingDemoUsers } from '@/content/onboarding-demo';
import { toast } from 'sonner';
export const Route = createFileRoute('/app/welcome')({
  staticData: { sitemap: false },
  head: () => ({ meta: [{ title: 'Welcome & Workspace Setup — Foresite' }, { name: 'description', content: 'Start your first Foresite project, invite clients and trades or generate optional sample workspace records.' }, { property: 'og:title', content: 'Welcome to your Foresite Workspace' }, { property: 'og:description', content: 'Your first project, client and trade invitations and optional sample workspace setup.' }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary_large_image' }, { name: 'robots', content: 'noindex' }] }),
  component: WelcomePage,
});
function WelcomePage() {
  const store = usePlatform(); const users = useUsers(); const navigate = useNavigate();
  const [preview, setPreview] = useState<ReturnType<typeof readOnboardingPreview>>(null);
  const [generated, setGenerated] = useState(false);
  useEffect(() => { setPreview(readOnboardingPreview()); }, []);
  function generate() {
    if (store.records.some(record => !store.isSample(record.id))) { toast.error('Demo generation is unavailable once you have real records. Your data is unchanged.'); return; }
    store.loadSamples(onboardingDemoRecords()); users.setUsers(onboardingDemoUsers()); setGenerated(true);
    toast.success('Sample workspace generated for this session. No real records submitted.');
  }
  return <div className="py-5"><p className="text-sm font-medium text-azure">{preview?.company ?? 'Your workspace'}</p><h1 className="mt-3 text-3xl font-semibold">Welcome To Foresite</h1><p className="mt-4 text-muted-foreground">{preview?.first ? `${preview.first}, your` : 'Your'} workspace preview is ready.</p><p className="mt-3 text-xs text-muted-foreground">Beta demonstration · no live account, subscription or organisation has been created.</p>
    <div className="mt-8 grid gap-5 md:grid-cols-3">{[{ label: 'Create First Project', Icon: Building2, action: () => { store.create('Project'); void navigate({ to: '/app/projects' }); } }, { label: 'Invite Client', Icon: UserPlus, action: () => void navigate({ to: '/app/users', search: { invite: 'Client' } }) }, { label: 'Invite Trade', Icon: HardHat, action: () => void navigate({ to: '/app/users', search: { invite: 'Trade' } }) }].map(({ label, Icon, action }) => <article key={label} className="rounded-lg border border-border bg-card p-6"><Icon className="size-6 text-azure" /><h2 className="mt-5 text-lg font-semibold">{label}</h2><Button variant="outline" className="mt-5" onClick={action}>{label}<ArrowRight /></Button></article>)}</div>
    <section className="mt-10 border-y border-border py-7"><h2 className="text-xl font-semibold">Optional Sample Workspace</h2><p className="mt-3 text-sm text-muted-foreground">Foresite Construction · 5 users · 3 projects · 15 tasks · 8 documents · 4 defects</p><p className="mt-2 text-sm text-muted-foreground">8 Webber Parade, Keilor · John Smith · ABC Electrical · 62% progress · 3 open defects</p><p className="mt-3 text-xs text-muted-foreground">Sample records only. Your first real record replaces samples in that module; samples are never included in real-data exports.</p><Button className="mt-5" variant="outline" disabled={generated || store.records.some(record => !store.isSample(record.id))} onClick={generate}>{generated ? <Check /> : <WandSparkles />}{generated ? 'Demo Data Generated' : 'Generate Demo Data'}</Button></section>
    <Button className="mt-7 bg-azure text-azure-foreground hover:bg-azure/90" onClick={() => void navigate({ to: '/app' })}>Continue To Dashboard <ArrowRight /></Button>
  </div>;
}
