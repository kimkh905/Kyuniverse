import { StyleSheet, View } from 'react-native';
import colors from '../theme/colors';
import tokens from '../theme/tokens';

export default function ProgressBar({ progress = 0, tone = 'blue', height = 10 }) {
  const width = `${Math.max(0, Math.min(progress, 100))}%`;

  return (
    <View style={[styles.track, { height }]}>
      <View
        style={[
          styles.fill,
          tone === 'green' ? styles.green : tone === 'yellow' ? styles.yellow : styles.blue,
          { width },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    borderRadius: tokens.radius.pill,
    backgroundColor: '#E5EAF5',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: tokens.radius.pill,
  },
  blue: {
    backgroundColor: colors.primary,
  },
  green: {
    backgroundColor: colors.mintDark,
  },
  yellow: {
    backgroundColor: colors.secondary,
  },
});
