import { Text, StyleSheet } from 'react-native';
import ActionButton from './ActionButton';
import colors from '../theme/colors';
import tokens from '../theme/tokens';

export default function GoogleLoginButton() {
  return (
    <>
      <ActionButton title="Continue with Google" variant="secondary" disabled />
      <Text style={styles.hint}>
        Google sign-in is disabled in the web preview so the interface can render safely.
      </Text>
    </>
  );
}

const styles = StyleSheet.create({
  hint: {
    marginTop: 10,
    fontSize: tokens.type.caption,
    color: colors.textSoft,
    textAlign: 'center',
  },
});
