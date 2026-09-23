/** Epoch en milisegundos (Date.now()). Independiente de zona horaria. */
export type Timestamp = number;

/** Un cigarro registrado por el usuario. */
export interface CigaretteEntry {
  id: string;
  /** Momento en que se fumó el cigarro. */
  smokedAt: Timestamp;
  /** Momento en que se creó el registro (puede diferir si se registra a posteriori). */
  createdAt: Timestamp;
  note?: string;
}

/** Preferencias del usuario. Todos los campos son opcionales hasta el onboarding. */
export interface UserSettings {
  /** Fecha desde la que el usuario decidió dejarlo o reducir. */
  quitStartedAt: Timestamp | null;
  /** Límite diario objetivo (null = sin límite). */
  dailyLimit: number | null;
  cigarettesPerPack: number;
  pricePerPack: number | null;
  currency: string;
}

/** Documento raíz persistido. `version` permite migraciones futuras. */
export interface PersistedData {
  version: number;
  entries: CigaretteEntry[];
  settings: UserSettings;
}
