import { Pressable, StyleSheet, Text } from 'react-native';

import { colors, radius, spacing, typography } from '../theme';

interface Props {
  label: string;
  value: number;
  onPress?: () => void;
}

export default function StatCard({ label, value, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityLabel={`${label}: ${value}`}
      style={({ pressed }) => [styles.card, pressed && onPress && styles.pressed]}
    >
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    gap: spacing.xs,
  },
  pressed: {
    backgroundColor: colors.surfaceElevated,
  },
  value: {
    ...typography.title,
    color: colors.textPrimary,
    fontVariant: ['tabular-nums'],
  },
  label: {
    ...typography.label,
    color: colors.textSecondary,
  },
});
