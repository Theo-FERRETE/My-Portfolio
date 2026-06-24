export type Theme = 'obsidian' | 'nebula' | 'emerald' | 'crimson' | 'amber' | 'sapphire' | 'rose';

export const THEMES: { value: Theme; label: string; swatch: string }[] = [
  { value: 'obsidian', label: 'Obsidian', swatch: '#6ee7ff' },
  { value: 'nebula', label: 'Nebula', swatch: '#c084fc' },
  { value: 'emerald', label: 'Emerald', swatch: '#34d399' },
  { value: 'crimson', label: 'Crimson', swatch: '#f87171' },
  { value: 'amber', label: 'Amber', swatch: '#fbbf24' },
  { value: 'sapphire', label: 'Sapphire', swatch: '#60a5fa' },
  { value: 'rose', label: 'Rose', swatch: '#f472b6' },
];

export const VALID_THEMES = THEMES.map((t) => t.value);

export function isTheme(value: unknown): value is Theme {
  return typeof value === 'string' && (VALID_THEMES as string[]).includes(value);
}
