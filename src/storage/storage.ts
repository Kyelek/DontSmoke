import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Envoltorio JSON sobre AsyncStorage. Los datos quedan en disco, por lo que
 * sobreviven al cierre de la app; los contadores se calculan a partir de
 * timestamps, así que "siguen corriendo" aunque la app no esté abierta.
 */
export async function readJSON<T>(key: string, fallback: T): Promise<T> {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw == null ? fallback : (JSON.parse(raw) as T);
  } catch (error) {
    console.warn(`[storage] No se pudo leer "${key}"`, error);
    return fallback;
  }
}

export async function writeJSON<T>(key: string, value: T): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

export async function removeKeys(keys: string[]): Promise<void> {
  await AsyncStorage.multiRemove(keys);
}

/**
 * Serializa las operaciones de lectura-modificación-escritura para que dos
 * pulsaciones rápidas no se pisen entre sí.
 */
let queue: Promise<unknown> = Promise.resolve();

export function enqueue<T>(task: () => Promise<T>): Promise<T> {
  const run = queue.then(task, task);
  queue = run.catch(() => undefined);
  return run;
}
