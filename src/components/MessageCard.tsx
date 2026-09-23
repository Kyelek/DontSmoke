import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';

import type { MessageTone } from '../content/messages';
import { colors, radius, spacing, typography } from '../theme';

interface Props {
  title: string;
  text: string;
  tone: MessageTone;
  /** Cambia cuando el mensaje cambia, para animar la transición. */
  messageKey: string;
}

const TONE_COLOR: Record<MessageTone, string> = {
  welcome: colors.textSecondary,
  support: colors.support,
  motivation: colors.accent,
};

export default function MessageCard({ title, text, tone, messageKey }: Props) {
  const fade = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    fade.setValue(0);
    Animated.timing(fade, { toValue: 1, duration: 450, useNativeDriver: true }).start();
  }, [messageKey, fade]);

  const accent = TONE_COLOR[tone];

  return (
    <Animated.View
      accessibilityLiveRegion="polite"
      style={[
        styles.card,
        { borderLeftColor: accent, opacity: fade },
        { transform: [{ translateY: fade.interpolate({ inputRange: [0, 1], outputRange: [6, 0] }) }] },
      ]}
    >
      <Text style={[styles.title, { color: accent }]}>{title}</Text>
      <Text style={styles.text}>{text}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderLeftWidth: 3,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md + 2,
    gap: spacing.xs + 2,
    minHeight: 104,
  },
  title: {
    ...typography.body,
    fontWeight: '600',
  },
  text: {
    ...typography.body,
    fontSize: 15,
    lineHeight: 22,
    color: colors.textPrimary,
    opacity: 0.85,
  },
});
