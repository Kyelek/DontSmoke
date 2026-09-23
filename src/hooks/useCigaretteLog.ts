import { useCallback, useEffect, useState } from 'react';
import { AppState } from 'react-native';

import * as repo from '../storage/cigaretteRepository';
import type { CigaretteEntry, UserSettings } from '../types';

export function useCigaretteLog() {
  const [entries, setEntries] = useState<CigaretteEntry[]>([]);
  const [settings, setSettings] = useState<UserSettings>(repo.DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    const data = await repo.loadAll();
    setEntries(data.entries);
    setSettings(data.settings);
    setLoading(false);
  }, []);

  useEffect(() => {
    reload();
    // Al volver a primer plano se recarga desde disco.
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') reload();
    });
    return () => sub.remove();
  }, [reload]);

  const logCigarette = useCallback(async (smokedAt?: number, note?: string) => {
    await repo.addEntry(smokedAt, note);
    setEntries(await repo.getEntries());
  }, []);

  const deleteEntry = useCallback(async (id: string) => {
    await repo.removeEntry(id);
    setEntries(await repo.getEntries());
  }, []);

  const saveSettings = useCallback(async (patch: Partial<UserSettings>) => {
    setSettings(await repo.updateSettings(patch));
  }, []);

  return {
    entries,
    settings,
    loading,
    lastEntry: entries[0] ?? null,
    logCigarette,
    deleteEntry,
    saveSettings,
    reload,
  };
}
