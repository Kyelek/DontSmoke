import type { CigaretteEntry, Timestamp } from '../types';

export const SECOND = 1000;
export const MINUTE = 60 * SECOND;
export const HOUR = 60 * MINUTE;
export const DAY = 24 * HOUR;

const WEEKDAYS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
const MONTHS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

const pad = (n: number) => n.toString().padStart(2, '0');

export function startOfDay(ts: Timestamp): Timestamp {
  const d = new Date(ts);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

export function countToday(entries: CigaretteEntry[], now: Timestamp = Date.now()): number {
  const from = startOfDay(now);
  return entries.filter((e) => e.smokedAt >= from && e.smokedAt <= now).length;
}

/**
 * Tiempo transcurrido desde `since`. Se calcula siempre contra el reloj del
 * sistema, así que es correcto aunque la app se haya cerrado o el móvil
 * reiniciado. Se limita a 0 por si el usuario retrasa el reloj.
 */
export function elapsedSince(since: Timestamp, now: Timestamp = Date.now()): number {
  return Math.max(0, now - since);
}

/** Descompone una duración en horas (sin límite), minutos y segundos. */
export function splitDuration(ms: number) {
  const totalSeconds = Math.max(0, Math.floor(ms / SECOND));
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor(totalSeconds / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

/** "08:05:03" */
export function formatClock(ts: Timestamp): string {
  const d = new Date(ts);
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

/** "Hoy", "Ayer" o "lunes, 21 sep". */
export function formatDayLabel(dayStart: Timestamp, now: Timestamp = Date.now()): string {
  const today = startOfDay(now);
  if (dayStart === today) return 'Hoy';
  if (dayStart === startOfDay(today - 1)) return 'Ayer';
  const d = new Date(dayStart);
  const label = `${WEEKDAYS[d.getDay()]}, ${d.getDate()} ${MONTHS[d.getMonth()]}`;
  return d.getFullYear() === new Date(now).getFullYear() ? label : `${label} ${d.getFullYear()}`;
}

/** Agrupa las entradas (ya ordenadas de más reciente a más antigua) por día. */
export function groupByDay(entries: CigaretteEntry[]) {
  const groups: { dayStart: Timestamp; data: CigaretteEntry[] }[] = [];
  for (const entry of entries) {
    const dayStart = startOfDay(entry.smokedAt);
    const last = groups[groups.length - 1];
    if (last && last.dayStart === dayStart) last.data.push(entry);
    else groups.push({ dayStart, data: [entry] });
  }
  return groups;
}
