import * as Haptics from 'expo-haptics';
import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import CigaretteButton from '../components/CigaretteButton';
import ElapsedTimer from '../components/ElapsedTimer';
import HistorySheet from '../components/HistorySheet';
import MessageCard from '../components/MessageCard';
import StatCard from '../components/StatCard';
import { useCigaretteLog } from '../hooks/useCigaretteLog';
import { useNow } from '../hooks/useNow';
import { colors, radius, spacing, typography } from '../theme';
import { currentMessage } from '../utils/motivation';
import { countToday, elapsedSince } from '../utils/time';

export default function HomeScreen() {
  const { entries, lastEntry, loading, logCigarette, deleteEntry, resetAll } = useCigaretteLog();
  const now = useNow();
  const [historyOpen, setHistoryOpen] = useState(false);
  const [puffKey, setPuffKey] = useState(0);

  if (loading) {
    return (
      <View style={[styles.safe, styles.center]}>
        <ActivityIndicator color={colors.accent} />
      </View>
    );
  }

  const elapsed = lastEntry ? elapsedSince(lastEntry.smokedAt, now) : null;
  const message = currentMessage(elapsed, lastEntry?.smokedAt);

  const handleLog = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => undefined);
    setPuffKey((k) => k + 1);
    logCigarette();
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.brand}>No Smoking</Text>
          <Pressable
            onPress={() => setHistoryOpen(true)}
            accessibilityRole="button"
            accessibilityLabel="Abrir historial"
            hitSlop={8}
            style={({ pressed }) => [styles.historyButton, pressed && styles.historyButtonPressed]}
          >
            <Text style={styles.historyButtonText}>Historial</Text>
          </Pressable>
        </View>

        <View style={styles.hero}>
          <CigaretteButton onPress={handleLog} puffKey={puffKey} />
          <Text style={styles.hint}>Toca el cigarro cada vez que fumes</Text>
        </View>

        <ElapsedTimer elapsedMs={elapsed} />

        <MessageCard
          title={message.tier.title}
          text={message.text}
          tone={message.tier.tone}
          messageKey={message.key}
        />

        <View style={styles.stats}>
          <StatCard label="Hoy" value={countToday(entries, now)} onPress={() => setHistoryOpen(true)} />
          <StatCard label="Total" value={entries.length} onPress={() => setHistoryOpen(true)} />
        </View>
      </ScrollView>

      <HistorySheet
        visible={historyOpen}
        entries={entries}
        onClose={() => setHistoryOpen(false)}
        onDelete={deleteEntry}
        onResetAll={() => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => undefined);
          resetAll();
          setHistoryOpen(false);
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    gap: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing.sm,
  },
  brand: {
    ...typography.label,
    color: colors.textMuted,
  },
  historyButton: {
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  historyButtonPressed: {
    backgroundColor: colors.surfaceElevated,
  },
  historyButtonText: {
    ...typography.caption,
    fontSize: 13,
    color: colors.textSecondary,
  },
  hero: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
  },
  hint: {
    ...typography.caption,
    color: colors.textMuted,
  },
  stats: {
    flexDirection: 'row',
    gap: spacing.md,
  },
});
