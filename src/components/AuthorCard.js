import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Avatar from './Avatar';
import InfoCard from './InfoCard';
import colors from '../theme/colors';
import tokens from '../theme/tokens';

export default function AuthorCard({ name, email, onMessagePress }) {
  return (
    <InfoCard title="Author">
      <View style={styles.row}>
        <Avatar label={name.charAt(0)} size={48} tone="beige" />
        <View style={styles.meta}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.email}>{email}</Text>
        </View>
        <Pressable style={({ pressed }) => [styles.button, pressed && styles.pressed]} onPress={onMessagePress}>
          <Ionicons name="chatbubble-ellipses" size={18} color={colors.white} />
        </Pressable>
      </View>
    </InfoCard>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  meta: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 2,
  },
  email: {
    fontSize: 13,
    color: colors.textSoft,
  },
  button: {
    width: 46,
    height: 46,
    borderRadius: 999,
    backgroundColor: colors.secondaryDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.86,
  },
});
