export const WIDGET_IDS = ['health', 'alerts', 'invoices', 'projects-count', 'defects-count', 'cashflow-count', 'priorities', 'upcoming', 'projects', 'insights', 'quick-actions', 'cashflow', 'project-health'] as const;
export type WidgetId = typeof WIDGET_IDS[number];
export type DashboardLayout = { order: WidgetId[]; hidden: WidgetId[] };
export function defaultLayout(): DashboardLayout { return { order: [...WIDGET_IDS], hidden: [] }; }
export function normaliseLayout(value: unknown): DashboardLayout {
  if (!value || typeof value !== 'object') return defaultLayout();
  const data = value as { order?: unknown; hidden?: unknown };
  const valid = (items: unknown): WidgetId[] => Array.isArray(items) ? [...new Set(items.filter((id): id is WidgetId => WIDGET_IDS.includes(id)))] : [];
  const order = valid(data.order);
  return { order: [...order, ...WIDGET_IDS.filter(id => !order.includes(id))], hidden: valid(data.hidden) };
}
export function moveWidget(layout: DashboardLayout, from: WidgetId, to: WidgetId): DashboardLayout {
  const order = [...layout.order];
  const start = order.indexOf(from), end = order.indexOf(to);
  if (start < 0 || end < 0) return layout;
  order.splice(start, 1); order.splice(end, 0, from);
  return { ...layout, order };
}
export function preferenceKey(accountId: string, setting: string) { return `foresite.preferences.v1:${encodeURIComponent(accountId)}:${setting}`; }