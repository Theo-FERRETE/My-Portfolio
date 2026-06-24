export type AdminTheme = 'slate-console' | 'carbon-fiber' | 'graphite-soft';

export const ADMIN_THEMES: { value: AdminTheme; label: string; swatch: string }[] = [
  { value: 'slate-console', label: 'Slate Console', swatch: '#38bdf8' },
  { value: 'carbon-fiber', label: 'Carbon Fiber', swatch: '#4ade80' },
  { value: 'graphite-soft', label: 'Graphite Soft', swatch: '#818cf8' },
];

export const VALID_ADMIN_THEMES = ADMIN_THEMES.map((t) => t.value);

export function isAdminTheme(value: unknown): value is AdminTheme {
  return typeof value === 'string' && (VALID_ADMIN_THEMES as string[]).includes(value);
}
