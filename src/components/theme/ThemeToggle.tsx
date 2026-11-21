import { useEffect, useState } from 'react';
import { Monitor, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { applyTheme, readThemePreference, resolveTheme, THEME_EVENT, THEME_KEY, type ThemePreference } from '@/lib/theme';
import { cn } from '@/lib/utils';

const LABELS: Record<ThemePreference, { label: string; Icon: typeof Sun }> = {
  light: { label: 'Light', Icon: Sun },
  dark: { label: 'Dark', Icon: Moon },
  system: { label: 'Use system setting', Icon: Monitor },
};

export function ThemeToggle({ className }: { className?: string }) {
  const [preference, setPreference] = useState<ThemePreference | null>(null);

  useEffect(() => {
    const read = () => { try { setPreference(readThemePreference(window.localStorage.getItem(THEME_KEY))); } catch { setPreference('system'); } };
    read();
    window.addEventListener(THEME_EVENT, read);
    window.addEventListener('storage', read);
    return () => { window.removeEventListener(THEME_EVENT, read); window.removeEventListener('storage', read); };
  }, []);

  useEffect(() => {
    if (!preference) return;
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const apply = () => applyTheme(resolveTheme(preference, media.matches));
    apply();
    if (preference !== 'system') return;
    media.addEventListener('change', apply);
    return () => media.removeEventListener('change', apply);
  }, [preference]);

  function choose(value: string) {
    const next = readThemePreference(value);
    try { window.localStorage.setItem(THEME_KEY, next); } catch { /* storage unavailable: still apply for this visit */ }
    setPreference(next);
    window.dispatchEvent(new Event(THEME_EVENT));
  }

  return <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="outline" size="icon" className={cn('shrink-0', className)} aria-label="Change appearance" title="Light, dark or system appearance">
        <Sun className="dark:hidden" /><Moon className="hidden dark:block" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" className="w-52">
      <DropdownMenuLabel>Appearance</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuRadioGroup value={preference ?? 'system'} onValueChange={choose}>
        {(Object.keys(LABELS) as ThemePreference[]).map(value => { const { label, Icon } = LABELS[value]; return <DropdownMenuRadioItem key={value} value={value}><Icon className="text-muted-foreground" />{label}</DropdownMenuRadioItem>; })}
      </DropdownMenuRadioGroup>
    </DropdownMenuContent>
  </DropdownMenu>;
}
