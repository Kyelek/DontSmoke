import { memo, useEffect, useRef } from 'react';
import { Animated, Easing, Pressable, StyleSheet, View } from 'react-native';

import { colors } from '../theme';

interface Props {
  onPress: () => void;
  /** Cambia con cada registro para disparar la animación de humo. */
  puffKey: number;
}

const WIDTH = 260;
const HEIGHT = 30;
const FILTER_WIDTH = 72;
const TIP_WIDTH = 16;

/** Cigarro dibujado con Views: filtro, papel, ceniza y brasa encendida. */
function CigaretteButton({ onPress, puffKey }: Props) {
  const scale = useRef(new Animated.Value(1)).current;
  const glow = useRef(new Animated.Value(0)).current;
  const puff = useRef(new Animated.Value(0)).current;

  // Brasa que "respira" suavemente.
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(glow, { toValue: 1, duration: 1600, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(glow, { toValue: 0, duration: 1600, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [glow]);

  // Bocanada de humo tras cada registro.
  useEffect(() => {
    if (!puffKey) return;
    puff.setValue(0);
    Animated.timing(puff, {
      toValue: 1,
      duration: 1400,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  }, [puffKey, puff]);

  const pressTo = (toValue: number) =>
    Animated.spring(scale, { toValue, useNativeDriver: true, speed: 40, bounciness: 8 }).start();

  const emberOpacity = glow.interpolate({ inputRange: [0, 1], outputRange: [0.55, 1] });
  const haloOpacity = glow.interpolate({ inputRange: [0, 1], outputRange: [0.06, 0.2] });

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Registrar un cigarro"
      accessibilityHint="Guarda la hora actual y reinicia el contador"
      onPress={onPress}
      onPressIn={() => pressTo(0.94)}
      onPressOut={() => pressTo(1)}
      hitSlop={24}
      style={styles.pressable}
    >
      <Animated.View style={[styles.wrapper, { transform: [{ scale }, { rotate: '-8deg' }] }]}>
        <Animated.View style={[styles.emberHalo, { opacity: haloOpacity }]} />
        <Smoke progress={puff} />
        <View style={styles.cigarette}>
          <View style={styles.filter}>
            <View style={styles.filterBand} />
          </View>
          <View style={styles.paper} />
          <View style={styles.ash} />
          <View style={styles.tip}>
            <Animated.View style={[styles.ember, { opacity: emberOpacity }]} />
          </View>
        </View>
      </Animated.View>
    </Pressable>
  );
}

export default memo(CigaretteButton);

const PUFFS = [
  { x: 0, size: 18, delay: 0 },
  { x: -10, size: 24, delay: 0.15 },
  { x: 8, size: 30, delay: 0.3 },
];

function Smoke({ progress }: { progress: Animated.Value }) {
  return (
    <View pointerEvents="none" style={styles.smokeOrigin}>
      {PUFFS.map((p, i) => {
        const local = progress.interpolate({
          inputRange: [p.delay, 1],
          outputRange: [0, 1],
          extrapolate: 'clamp',
        });
        return (
          <Animated.View
            key={i}
            style={[
              styles.puff,
              {
                width: p.size,
                height: p.size,
                borderRadius: p.size / 2,
                opacity: local.interpolate({ inputRange: [0, 0.15, 1], outputRange: [0, 0.35, 0] }),
                transform: [
                  { translateX: local.interpolate({ inputRange: [0, 1], outputRange: [0, p.x] }) },
                  { translateY: local.interpolate({ inputRange: [0, 1], outputRange: [0, -70] }) },
                  { scale: local.interpolate({ inputRange: [0, 1], outputRange: [0.4, 1.4] }) },
                ],
              },
            ]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  pressable: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  wrapper: {
    width: WIDTH,
    height: HEIGHT,
  },
  cigarette: {
    flexDirection: 'row',
    width: WIDTH,
    height: HEIGHT,
    borderRadius: 6,
    overflow: 'hidden',
    backgroundColor: colors.paper,
  },
  filter: {
    width: FILTER_WIDTH,
    backgroundColor: colors.filter,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  filterBand: {
    width: 3,
    height: '100%',
    backgroundColor: colors.filterBand,
  },
  paper: {
    flex: 1,
    backgroundColor: colors.paper,
  },
  ash: {
    width: 10,
    backgroundColor: colors.ash,
  },
  tip: {
    width: TIP_WIDTH,
    backgroundColor: colors.ashDark,
    justifyContent: 'center',
  },
  ember: {
    ...StyleSheet.absoluteFill,
    backgroundColor: colors.ember,
    borderTopRightRadius: 6,
    borderBottomRightRadius: 6,
  },
  emberHalo: {
    position: 'absolute',
    right: -14,
    top: HEIGHT / 2 - 22,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.ember,
  },
  smokeOrigin: {
    position: 'absolute',
    right: TIP_WIDTH / 2 - 9,
    top: -4,
    width: 18,
    alignItems: 'center',
  },
  puff: {
    position: 'absolute',
    backgroundColor: colors.smoke,
  },
});
