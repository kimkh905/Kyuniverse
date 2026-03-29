import { StyleSheet, Text, View } from 'react-native';
import PrimaryButton from '../components/PrimaryButton';
import ScreenContainer from '../components/ScreenContainer';
import { useFlashcards } from '../context/FlashcardContext';

export default function HomeScreen({ navigation }) {
  const { flashcards } = useFlashcards();

  return (
    <ScreenContainer>
      <View style={styles.hero}>
        <Text style={styles.title}>Learn Korean and English one card at a time</Text>
        <Text style={styles.subtitle}>
          Review simple local flashcards, take a quick quiz, and track your progress.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>Cards available</Text>
        <Text style={styles.cardValue}>{flashcards.length}</Text>
      </View>

      <View style={styles.actions}>
        <PrimaryButton title="Start Flashcards" onPress={() => navigation.navigate('Flashcards')} />
        <PrimaryButton title="Take Quiz" variant="secondary" onPress={() => navigation.navigate('Quiz')} />
        <PrimaryButton title="View Progress" variant="secondary" onPress={() => navigation.navigate('Progress')} />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  hero: {
    marginTop: 24,
    marginBottom: 28,
  },
  title: {
    fontSize: 30,
    lineHeight: 38,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    color: '#475569',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    marginBottom: 28,
  },
  cardLabel: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 8,
  },
  cardValue: {
    fontSize: 36,
    fontWeight: '700',
    color: '#111827',
  },
  actions: {
    marginTop: 'auto',
  },
});
