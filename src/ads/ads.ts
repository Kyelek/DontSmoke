import { adsSupported } from './config';

type AdsModule = typeof import('react-native-google-mobile-ads');

let cached: AdsModule | null | undefined;

/**
 * Carga la librería de anuncios solo cuando el binario incluye el módulo
 * nativo. Importarla en Expo Go lanzaría un error al arrancar.
 */
export function getAdsModule(): AdsModule | null {
  if (cached !== undefined) return cached;
  if (!adsSupported) return (cached = null);
  try {
    cached = require('react-native-google-mobile-ads') as AdsModule;
  } catch (error) {
    console.warn('[ads] SDK de anuncios no disponible', error);
    cached = null;
  }
  return cached;
}

let initPromise: Promise<boolean> | null = null;

/**
 * Pide el consentimiento (formulario UMP de Google, obligatorio en la UE)
 * e inicializa el SDK. Devuelve si se pueden solicitar anuncios.
 */
export function initAds(): Promise<boolean> {
  if (initPromise) return initPromise;

  initPromise = (async () => {
    const ads = getAdsModule();
    if (!ads) return false;
    try {
      const consent = await ads.AdsConsent.gatherConsent();
      if (!consent.canRequestAds) return false;
      await ads.default().initialize();
      return true;
    } catch (error) {
      console.warn('[ads] No se pudo inicializar', error);
      // Si falla la consulta de consentimiento, se intenta con el estado previo.
      const info = await ads.AdsConsent.getConsentInfo().catch(() => null);
      if (!info?.canRequestAds) return false;
      await ads.default().initialize().catch(() => undefined);
      return true;
    }
  })();

  return initPromise;
}
