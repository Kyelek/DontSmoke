import { StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '../theme';
import { splitDuration } from '../utils/time';

interface Props {
  /** Milisegundos desde el último cigarro, o null si no hay registros. */
  elapsedMs: number | null;
}

const pad = (n: number) => n.toString().padStart(2, '0');

export default function ElapsedTimer({ elapsedMs }: Props) {
  const { days, hours, minutes, seconds } = splitDuration(elapsedMs ?? 0);
  const empty = elapsedMs == null;

  return (
    <View
      style={styles.container}
      accessible
      accessibilityLabel={
        empty
          ? 'Sin registros todavía'
          : `Sin fumar: ${hours} horas, ${minutes} minutos y ${seconds} segundos`
      }
    >
      <Text style={styles.label}>Tiempo sin fumar</Text>
      <View style={styles.row}>
        <Segment value={empty ? '--' : pad(hours)} unit="horas" />
        <Text style={styles.colon}>:</Text>
        <Segment value={empty ? '--' : pad(minutes)} unit="min" />
        <Text style={styles.colon}>:</Text>
        <Segment value={empty ? '--' : pad(seconds)} unit="seg" />
      </View>
      {days > 0 && (
        <Text style={styles.days}>
          {days === 1 ? 'Más de 1 día' : `Más de ${days} días`}
        </Text>
      )}
    </View>
  );
}

function Segment({ value, unit }: { value: string; unit: string }) {
  return (
    <View style={styles.segment}>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.unit}>{unit}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  label: {
    ...typography.label,
    color: colors.textSecondary,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  segment: {
    alignItems: 'center',
    minWidth: 76,
  },
  value: {
    ...typography.display,
    color: colors.textPrimary,
    fontVariant: ['tabular-nums'],
  },
  unit: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: -2,
  },
  colon: {
    ...typography.display,
    color: colors.textMuted,
    marginHorizontal: 2,
  },
  days: {
    ...typography.caption,
    color: colors.accent,
  },
});
