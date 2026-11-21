/** Browser-safe theme preference helpers shared by the toggle and the pre-paint script. */
export const THEME_KEY = 'foresite.theme';
export const THEME_EVENT = 'foresite-theme-change';
export const THEME_OPTIONS = ['light', 'dark', 'system'] as const;
export type ThemePreference = typeof THEME_OPTIONS[number];
export type ResolvedTheme = 'light' | 'dark';

export function readThemePreference(value: unknown): ThemePreference {
  return typeof value === 'string' && (THEME_OPTIONS as readonly string[]).includes(value) ? value as ThemePreference : 'system';
}

export function resolveTheme(preference: ThemePreference, systemPrefersDark: boolean): ResolvedTheme {
  if (preference === 'system') return systemPrefersDark ? 'dark' : 'light';
  return preference;
}

export function applyTheme(theme: ResolvedTheme) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  root.classList.toggle('dark', theme === 'dark');
  root.style.colorScheme = theme;
}

/** Runs before first paint so a saved dark preference never flashes light. */
export const THEME_INIT_SCRIPT = `(function(){try{var p=localStorage.getItem('${THEME_KEY}');var d=p==='dark'||(p!=='light'&&window.matchMedia('(prefers-color-scheme: dark)').matches);var r=document.documentElement;r.classList.toggle('dark',d);r.style.colorScheme=d?'dark':'light';}catch(e){}})();`;
