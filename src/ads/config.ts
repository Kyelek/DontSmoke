import Constants, { ExecutionEnvironment } from 'expo-constants';

/**
 * ID del bloque de anuncios (banner) de AdMob. El ID de la app va en el
 * plugin `react-native-google-mobile-ads` de app.json.
 */
export const ADMOB_BANNER_UNIT_ID_ANDROID: string | null = 'ca-app-pub-4212330586183500/1642588373';

/** Expo Go no incluye el SDK nativo de anuncios. */
export const adsSupported = Constants.executionEnvironment !== ExecutionEnvironment.StoreClient;

/**
 * Anuncios de prueba en desarrollo y en las builds de prueba (perfil
 * `preview` de eas.json, que define EXPO_PUBLIC_ADS_TEST=1). Ver o pulsar
 * anuncios reales de tu propia app puede suponer la suspensión de la cuenta
 * de AdMob; solo la build `production` usa el ID real.
 */
export const USE_TEST_ADS =
  __DEV__ || process.env.EXPO_PUBLIC_ADS_TEST === '1' || ADMOB_BANNER_UNIT_ID_ANDROID == null;
