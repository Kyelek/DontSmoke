/**
 * Tema oscuro de bajo contraste: fondos grafito, texto marfil suave y un
 * único acento verde salvia. Evita blancos puros y colores saturados para
 * reducir la fatiga visual.
 */
export const colors = {
  background: '#121417',
  surface: '#1B1E23',
  surfaceElevated: '#23272E',
  border: '#2E333B',

  textPrimary: '#E8E6E1',
  textSecondary: '#9BA1A9',
  textMuted: '#6B727C',

  accent: '#8FB9A8',
  accentMuted: '#3E5A50',
  onAccent: '#0F1A16',

  warning: '#D9B97A',
  danger: '#D98C8C',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const radius = {
  sm: 8,
  md: 14,
  lg: 22,
  pill: 999,
} as const;

export const typography = {
  display: { fontSize: 44, fontWeight: '300', letterSpacing: -0.5 },
  title: { fontSize: 22, fontWeight: '600' },
  body: { fontSize: 16, fontWeight: '400' },
  label: { fontSize: 13, fontWeight: '500', letterSpacing: 0.8, textTransform: 'uppercase' },
  caption: { fontSize: 12, fontWeight: '400' },
} as const;

export const theme = { colors, spacing, radius, typography } as const;
export type Theme = typeof theme;
