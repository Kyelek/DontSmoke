import { memo, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '../theme';
import { getAdsModule, initAds } from './ads';
import { ADMOB_BANNER_UNIT_ID_ANDROID, USE_TEST_ADS } from './config';

/**
 * Banner adaptativo anclado al pie de la pantalla. El SDK solo le da tamaño
 * cuando hay un anuncio cargado, así que no deja un hueco vacío. No se
 * renderiza en Expo Go.
 */
function AdBanner() {
  const insets = useSafeAreaInsets();
  const [ready, setReady] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    initAds().then((ok) => active && setReady(ok));
    return () => {
      active = false;
    };
  }, []);

  const ads = getAdsModule();
  if (!ads || !ready) return null;

  const { BannerAd, BannerAdSize, TestIds } = ads;
  const unitId = USE_TEST_ADS ? TestIds.ADAPTIVE_BANNER : ADMOB_BANNER_UNIT_ID_ANDROID!;

  return (
    <View
      style={[
        styles.container,
        loaded && [styles.loaded, { paddingBottom: insets.bottom }],
      ]}
    >
      <BannerAd
        unitId={unitId}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        onAdLoaded={() => setLoaded(true)}
        onAdFailedToLoad={() => setLoaded(false)}
      />
    </View>
  );
}

// El HomeScreen se re-renderiza cada segundo por el contador; el banner no
// depende de nada de eso, así que se memoriza para no re-renderizarlo.
export default memo(AdBanner);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loaded: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
});
