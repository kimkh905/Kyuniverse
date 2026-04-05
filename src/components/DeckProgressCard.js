import { Pressable, StyleSheet, Text, View } from 'react-native';
import ProgressBar from './ProgressBar';
import colors from '../theme/colors';
import tokens from '../theme/tokens';

export default function DeckProgressCard({ name, learned, total, onPress }) {
  const progress = total ? (learned / total) * 100 : 0;

  return (
    <Pressable
      style={({ pressed, hovered }) => [styles.card, hovered && styles.hovered, pressed && styles.pressed]}
      onPress={onPress}
    >
      <View style={styles.top}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.count}>
          {learned}/{total}
        </Text>
      </View>
      <ProgressBar progress={Math.max(progress, learned ? 12 : 0)} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: tokens.radius.card,
    padding: 18,
    ...tokens.shadow.card,
  },
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  count: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textSoft,
  },
  pressed: {
    transform: [{ scale: 0.985 }],
  },
  hovered: {
    transform: [{ translateY: -2 }],
    shadowRadius: 36,
    elevation: 5,
  },
});
