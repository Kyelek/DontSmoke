import Constants, { ExecutionEnvironment } from 'expo-constants';

/**
 * IDs reales de AdMob. Mientras sean null se usan los IDs de prueba de
 * Google, que muestran anuncios de ejemplo y no generan ingresos.
 *
 * Antes de publicar: sustituye este valor por el ID del bloque de anuncios
 * (formato ca-app-pub-XXXXXXXXXXXXXXXX/NNNNNNNNNN) y el `androidAppId` del
 * plugin en app.json por el ID de la app (formato ...~NNNNNNNNNN).
 */
export const ADMOB_BANNER_UNIT_ID_ANDROID: string | null = null;

/** Expo Go no incluye el SDK nativo de anuncios. */
export const adsSupported = Constants.executionEnvironment !== ExecutionEnvironment.StoreClient;

/** En desarrollo siempre se usan anuncios de prueba (Google lo exige). */
export const USE_TEST_ADS = __DEV__ || ADMOB_BANNER_UNIT_ID_ANDROID == null;
