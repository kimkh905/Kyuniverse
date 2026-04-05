import { StyleSheet, Text, View } from 'react-native';
import PrimaryButton from '../components/PrimaryButton';
import ScreenContainer from '../components/ScreenContainer';
import { useFlashcards } from '../context/FlashcardContext';
import colors from '../theme/colors';

export default function PrivacyScreen() {
  const { resetProgress, reminderEnabled } = useFlashcards();

  return (
    <ScreenContainer>
      <Text style={styles.title}>Privacy & Data</Text>
      <Text style={styles.subtitle}>
        This app is designed to keep learning data simple, local, and under the user’s control.
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>What stays on device</Text>
        <Text style={styles.cardText}>
          Flashcard progress, quiz results, goals, review history, bookmarks, and onboarding preferences are
          stored locally on this device.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>What this app does not collect</Text>
        <Text style={styles.cardText}>
          No name, email, phone number, location, or account data is required. There is no backend for study
          data and no third-party advertising or tracking SDK in this project.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Notifications</Text>
        <Text style={styles.cardText}>
          Reminders are optional. Notification permission is only used if the user turns reminders on.
          Current reminder state: {reminderEnabled ? 'enabled' : 'disabled'}.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>User control</Text>
        <Text style={styles.cardText}>
          Users can turn reminders off at any time and can clear all local learning data from this app.
        </Text>
      </View>

      <PrimaryButton title="Delete All Local Learning Data" variant="secondary" onPress={resetProgress} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.textSoft,
    marginBottom: 18,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 22,
    padding: 18,
    marginBottom: 14,
    borderWidth: 2,
    borderColor: colors.backgroundAccent,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  cardText: {
    fontSize: 14,
    lineHeight: 21,
    color: colors.textSoft,
  },
});
