import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useCigaretteLog } from '../hooks/useCigaretteLog';
import { useNow } from '../hooks/useNow';
import { colors, radius, spacing, typography } from '../theme';
import { countToday, formatElapsed } from '../utils/time';

export default function HomeScreen() {
  const { entries, lastEntry, loading, logCigarette } = useCigaretteLog();
  const now = useNow();

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator color={colors.accent} />
      </View>
    );
  }

  const today = countToday(entries, now);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.label}>Sin fumar</Text>
        <Text style={styles.display}>
          {lastEntry ? formatElapsed(now - lastEntry.smokedAt) : '—'}
        </Text>
        {!lastEntry && <Text style={styles.caption}>Aún no hay registros</Text>}
      </View>

      <View style={styles.statsRow}>
        <Stat label="Hoy" value={today} />
        <Stat label="Total" value={entries.length} />
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Registrar un cigarro"
        onPress={() => logCigarette()}
        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
      >
        <Text style={styles.buttonText}>Registrar cigarro</Text>
      </Pressable>
    </SafeAreaView>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  hero: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  label: {
    ...typography.label,
    color: colors.textSecondary,
  },
  display: {
    ...typography.display,
    color: colors.textPrimary,
    fontVariant: ['tabular-nums'],
  },
  caption: {
    ...typography.caption,
    color: colors.textMuted,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: radius.md,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    gap: spacing.xs,
  },
  statValue: {
    ...typography.title,
    color: colors.textPrimary,
  },
  button: {
    backgroundColor: colors.accent,
    borderRadius: radius.pill,
    paddingVertical: spacing.md + 2,
    alignItems: 'center',
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonText: {
    ...typography.body,
    fontWeight: '600',
    color: colors.onAccent,
  },
});
