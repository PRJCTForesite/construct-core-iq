export const WIDGET_IDS = ['health', 'alerts', 'invoices', 'projects-count', 'defects-count', 'cashflow-count', 'priorities', 'upcoming', 'projects', 'insights', 'quick-actions', 'cashflow', 'project-health'] as const;
export type WidgetId = typeof WIDGET_IDS[number];
export type WidgetSize = 'small' | 'medium' | 'large';
export type WidgetColour = 'default' | 'navy' | 'slate' | 'azure' | 'orange';
export type WidgetOptions = { size?: WidgetSize; colour?: WidgetColour };
export type DashboardLayout = { order: WidgetId[]; hidden: WidgetId[]; options: Partial<Record<WidgetId, WidgetOptions>> };
export function defaultLayout(): DashboardLayout { return { order: [...WIDGET_IDS], hidden: [], options: {} }; }
export function normaliseLayout(value: unknown): DashboardLayout {
  if (!value || typeof value !== 'object') return defaultLayout();
  const data = value as { order?: unknown; hidden?: unknown; options?: unknown };
  const valid = (items: unknown): WidgetId[] => Array.isArray(items) ? [...new Set(items.filter((id): id is WidgetId => WIDGET_IDS.includes(id)))] : [];
  const order = valid(data.order);
  const options: DashboardLayout['options'] = {};
  if (data.options && typeof data.options === 'object') {
    for (const id of WIDGET_IDS) {
      const value = (data.options as Record<string, unknown>)[id];
      if (!value || typeof value !== 'object') continue;
      const option = value as WidgetOptions;
      options[id] = {};
      if (option.size && ['small','medium','large'].includes(option.size)) options[id].size = option.size;
      if (option.colour && ['default','navy','slate','azure','orange'].includes(option.colour)) options[id].colour = option.colour;
    }
  }
  return { order: [...order, ...WIDGET_IDS.filter(id => !order.includes(id))], hidden: valid(data.hidden), options };
}
export function moveWidget(layout: DashboardLayout, from: WidgetId, to: WidgetId): DashboardLayout {
  const order = [...layout.order];
  const start = order.indexOf(from), end = order.indexOf(to);
  if (start < 0 || end < 0) return layout;
  order.splice(start, 1); order.splice(end, 0, from);
  return { ...layout, order };
}
export function preferenceKey(accountId: string, setting: string) { return `foresite.preferences.v1:${encodeURIComponent(accountId)}:${setting}`; }