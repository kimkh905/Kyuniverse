import { Pressable, StyleSheet, Text, View } from 'react-native';
import Avatar from './Avatar';
import colors from '../theme/colors';
import tokens from '../theme/tokens';

export default function ClassCard({ category, title, authorName, authorSubtitle, onPress }) {
  return (
    <Pressable
      style={({ pressed, hovered }) => [styles.card, hovered && styles.hovered, pressed && styles.pressed]}
      onPress={onPress}
    >
      <Text style={styles.category}>{category}</Text>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.authorRow}>
        <Avatar label={authorName.charAt(0)} size={40} />
        <View style={styles.authorMeta}>
          <Text style={styles.authorName}>{authorName}</Text>
          <Text style={styles.authorSubtitle}>{authorSubtitle}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: tokens.radius.card,
    backgroundColor: colors.white,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.backgroundAccent,
    ...tokens.shadow.card,
  },
  category: {
    fontSize: tokens.type.caption,
    fontWeight: '800',
    color: colors.primary,
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 16,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  authorMeta: {
    flex: 1,
  },
  authorName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 2,
  },
  authorSubtitle: {
    fontSize: 13,
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
