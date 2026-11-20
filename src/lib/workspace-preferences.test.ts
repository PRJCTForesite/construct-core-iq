import { describe, expect, it } from 'vitest';
import { defaultLayout, moveWidget, normaliseLayout, preferenceKey, WIDGET_IDS } from './workspace-preferences';
describe('dashboard preferences', () => {
  it('moves widgets without losing visibility choices', () => {
    const layout = { ...defaultLayout(), hidden: ['alerts'] as const };
    const moved = moveWidget({ ...layout, hidden: [...layout.hidden] }, 'alerts', 'health');
    expect(moved.order.slice(0, 2)).toEqual(['alerts', 'health']);
    expect(moved.hidden).toEqual(['alerts']);
  });
  it('restores missing widgets and rejects unknown and duplicate saved IDs', () => {
    const restored = normaliseLayout({ order: ['alerts', 'alerts', 'invalid'], hidden: ['health', 'invalid'] });
    expect(restored.order[0]).toBe('alerts');
    expect(restored.order).toHaveLength(WIDGET_IDS.length);
    expect(restored.hidden).toEqual(['health']);
  });
  it('isolates preferences between signed-in accounts', () => {
    expect(preferenceKey('owner-a', 'dashboard')).not.toBe(preferenceKey('owner-b', 'dashboard'));
  });
});