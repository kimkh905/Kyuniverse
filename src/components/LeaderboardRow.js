import { StyleSheet, Text, View } from 'react-native';
import Avatar from './Avatar';
import colors from '../theme/colors';
import tokens from '../theme/tokens';

export default function LeaderboardRow({ name, timeframe, score }) {
  return (
    <View style={styles.row}>
      <Avatar label={name.charAt(0)} size={42} tone="lavender" />
      <View style={styles.meta}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.timeframe}>{timeframe}</Text>
      </View>
      <Text style={styles.score}>{score}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.backgroundAccent,
  },
  meta: {
    flex: 1,
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 2,
  },
  timeframe: {
    fontSize: 13,
    color: colors.textSoft,
  },
  score: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
  },
});
