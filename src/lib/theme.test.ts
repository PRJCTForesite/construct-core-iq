import { expect, it } from 'vitest';
import { readThemePreference, resolveTheme } from './theme';

it('uses the device setting when no choice is saved', () => {
  expect(readThemePreference(null)).toBe('system');
  expect(readThemePreference('purple')).toBe('system');
});

it('follows the device setting in system mode', () => {
  expect(resolveTheme('system', true)).toBe('dark');
  expect(resolveTheme('system', false)).toBe('light');
});

it('keeps an explicit light or dark choice regardless of the device', () => {
  expect(resolveTheme('light', true)).toBe('light');
  expect(resolveTheme('dark', false)).toBe('dark');
});
