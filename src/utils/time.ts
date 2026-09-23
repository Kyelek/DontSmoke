import type { CigaretteEntry, Timestamp } from '../types';

export function startOfDay(ts: Timestamp): Timestamp {
  const d = new Date(ts);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

export function countToday(entries: CigaretteEntry[], now: Timestamp = Date.now()): number {
  const from = startOfDay(now);
  return entries.filter((e) => e.smokedAt >= from && e.smokedAt <= now).length;
}

/** Formatea una duración como "2d 3h 14m", "3h 05m" o "12m 40s". */
export function formatElapsed(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const pad = (n: number) => n.toString().padStart(2, '0');

  if (days > 0) return `${days}d ${hours}h ${pad(minutes)}m`;
  if (hours > 0) return `${hours}h ${pad(minutes)}m`;
  return `${minutes}m ${pad(seconds)}s`;
}
