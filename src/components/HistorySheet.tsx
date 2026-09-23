import { memo, useMemo } from 'react';
import { Alert, Modal, Pressable, SectionList, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, radius, spacing, typography } from '../theme';
import type { CigaretteEntry } from '../types';
import { formatClock, formatDayLabel, groupByDay } from '../utils/time';

interface Props {
  visible: boolean;
  entries: CigaretteEntry[];
  onClose: () => void;
  onDelete: (id: string) => void;
  onResetAll: () => void;
}

function HistorySheet({ visible, entries, onClose, onDelete, onResetAll }: Props) {
  const insets = useSafeAreaInsets();

  const sections = useMemo(() => {
    const now = Date.now();
    return groupByDay(entries).map((g) => ({
      key: String(g.dayStart),
      title: formatDayLabel(g.dayStart, now),
      data: g.data,
    }));
  }, [entries]);

  const confirmDelete = (entry: CigaretteEntry) =>
    Alert.alert('Eliminar registro', `¿Borrar el cigarro de las ${formatClock(entry.smokedAt)}?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: () => onDelete(entry.id) },
    ]);

  const confirmReset = () =>
    Alert.alert(
      'Reiniciar todo',
      `Se borrarán los ${entries.length} registros y todos los contadores volverán a cero. Esta acción no se puede deshacer.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Borrar todo', style: 'destructive', onPress: onResetAll },
      ],
    );

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessibilityLabel="Cerrar historial" />
        <View style={[styles.sheet, { paddingBottom: insets.bottom + spacing.md }]}>
          <View style={styles.handle} />
          <View style={styles.header}>
            <Text style={styles.title}>Historial</Text>
            <Pressable onPress={onClose} hitSlop={12} accessibilityRole="button">
              <Text style={styles.close}>Cerrar</Text>
            </Pressable>
          </View>

          <SectionList
            sections={sections}
            keyExtractor={(item) => item.id}
            stickySectionHeadersEnabled={false}
            contentContainerStyle={styles.list}
            ListEmptyComponent={
              <Text style={styles.empty}>Todavía no hay cigarros registrados.</Text>
            }
            ListFooterComponent={
              entries.length > 0 ? (
                <View style={styles.footer}>
                  <Text style={styles.hint}>Mantén pulsado un registro para eliminarlo.</Text>
                  <Pressable
                    onPress={confirmReset}
                    accessibilityRole="button"
                    accessibilityLabel="Reiniciar todo"
                    accessibilityHint="Borra todos los registros y pone los contadores a cero"
                    style={({ pressed }) => [styles.resetButton, pressed && styles.resetButtonPressed]}
                  >
                    <Text style={styles.resetText}>Reiniciar todo</Text>
                  </Pressable>
                </View>
              ) : null
            }
            renderSectionHeader={({ section }) => (
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>{section.title}</Text>
                <Text style={styles.sectionCount}>
                  {section.data.length} {section.data.length === 1 ? 'cigarro' : 'cigarros'}
                </Text>
              </View>
            )}
            renderItem={({ item, index, section }) => (
              <Pressable
                onLongPress={() => confirmDelete(item)}
                accessibilityHint="Mantén pulsado para eliminar"
                style={({ pressed }) => [
                  styles.row,
                  index === section.data.length - 1 && styles.rowLast,
                  pressed && styles.rowPressed,
                ]}
              >
                <View style={styles.dot} />
                <Text style={styles.time}>{formatClock(item.smokedAt)}</Text>
              </Pressable>
            )}
          />
        </View>
      </View>
    </Modal>
  );
}

export default memo(HistorySheet);

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  sheet: {
    maxHeight: '80%',
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    paddingHorizontal: spacing.lg,
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    marginTop: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
  },
  title: {
    ...typography.title,
    color: colors.textPrimary,
  },
  close: {
    ...typography.body,
    color: colors.accent,
  },
  list: {
    paddingBottom: spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    ...typography.label,
    color: colors.textSecondary,
  },
  sectionCount: {
    ...typography.caption,
    color: colors.textMuted,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md - 2,
    paddingHorizontal: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  rowLast: {
    borderBottomWidth: 0,
  },
  rowPressed: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: radius.sm,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.ember,
    opacity: 0.8,
  },
  time: {
    ...typography.body,
    color: colors.textPrimary,
    fontVariant: ['tabular-nums'],
  },
  empty: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
    paddingVertical: spacing.xl,
  },
  footer: {
    marginTop: spacing.lg,
    gap: spacing.lg,
    alignItems: 'center',
  },
  hint: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: 'center',
  },
  resetButton: {
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.danger,
  },
  resetButtonPressed: {
    backgroundColor: colors.surfaceElevated,
  },
  resetText: {
    ...typography.caption,
    fontSize: 13,
    fontWeight: '600',
    color: colors.danger,
  },
});
