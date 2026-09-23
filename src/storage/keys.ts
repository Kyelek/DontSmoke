const PREFIX = '@nosmoking';

export const STORAGE_KEYS = {
  entries: `${PREFIX}/entries`,
  settings: `${PREFIX}/settings`,
  schemaVersion: `${PREFIX}/schemaVersion`,
} as const;

export const CURRENT_SCHEMA_VERSION = 1;
