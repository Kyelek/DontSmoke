import {
  MESSAGE_ROTATION_MS,
  MESSAGE_TIERS,
  WELCOME_TIER,
  type MessageTier,
} from '../content/messages';

export interface CurrentMessage {
  tier: MessageTier;
  text: string;
  /** Clave estable mientras el mensaje no cambie; útil para animar la transición. */
  key: string;
}

export function tierFor(elapsedMs: number | null): MessageTier {
  if (elapsedMs == null) return WELCOME_TIER;
  let current = MESSAGE_TIERS[0];
  for (const tier of MESSAGE_TIERS) {
    if (elapsedMs >= tier.from) current = tier;
  }
  return current;
}

/**
 * Elige el mensaje según el tiempo sin fumar. Dentro de un tramo rota cada
 * MESSAGE_ROTATION_MS; `seed` (p. ej. el timestamp del último cigarro) hace
 * que cada nuevo registro arranque con un consejo distinto.
 */
export function currentMessage(elapsedMs: number | null, seed = 0): CurrentMessage {
  const tier = tierFor(elapsedMs);
  const step = Math.floor((elapsedMs ?? 0) / MESSAGE_ROTATION_MS);
  const index = (step + Math.floor(seed / 1000)) % tier.messages.length;
  return { tier, text: tier.messages[index], key: `${tier.id}:${index}` };
}
