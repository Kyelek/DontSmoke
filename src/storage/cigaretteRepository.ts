import type { CigaretteEntry, PersistedData, Timestamp, UserSettings } from '../types';
import { createId } from '../utils/id';
import { CURRENT_SCHEMA_VERSION, STORAGE_KEYS } from './keys';
import { enqueue, readJSON, removeKeys, writeJSON } from './storage';

export const DEFAULT_SETTINGS: UserSettings = {
  quitStartedAt: null,
  dailyLimit: null,
  cigarettesPerPack: 20,
  pricePerPack: null,
  currency: 'EUR',
};

const byNewestFirst = (a: CigaretteEntry, b: CigaretteEntry) => b.smokedAt - a.smokedAt;

export async function getEntries(): Promise<CigaretteEntry[]> {
  const entries = await readJSON<CigaretteEntry[]>(STORAGE_KEYS.entries, []);
  return entries.sort(byNewestFirst);
}

export function addEntry(smokedAt: Timestamp = Date.now(), note?: string): Promise<CigaretteEntry> {
  return enqueue(async () => {
    const entry: CigaretteEntry = {
      id: createId(),
      smokedAt,
      createdAt: Date.now(),
      ...(note ? { note } : {}),
    };
    const entries = await getEntries();
    await writeJSON(STORAGE_KEYS.entries, [entry, ...entries].sort(byNewestFirst));
    return entry;
  });
}

export function removeEntry(id: string): Promise<void> {
  return enqueue(async () => {
    const entries = await getEntries();
    await writeJSON(
      STORAGE_KEYS.entries,
      entries.filter((e) => e.id !== id),
    );
  });
}

export async function getSettings(): Promise<UserSettings> {
  const stored = await readJSON<Partial<UserSettings>>(STORAGE_KEYS.settings, {});
  return { ...DEFAULT_SETTINGS, ...stored };
}

export function updateSettings(patch: Partial<UserSettings>): Promise<UserSettings> {
  return enqueue(async () => {
    const next = { ...(await getSettings()), ...patch };
    await writeJSON(STORAGE_KEYS.settings, next);
    return next;
  });
}

export async function loadAll(): Promise<PersistedData> {
  const [entries, settings] = await Promise.all([getEntries(), getSettings()]);
  await writeJSON(STORAGE_KEYS.schemaVersion, CURRENT_SCHEMA_VERSION);
  return { version: CURRENT_SCHEMA_VERSION, entries, settings };
}

export function clearAll(): Promise<void> {
  return enqueue(() => removeKeys(Object.values(STORAGE_KEYS)));
}
