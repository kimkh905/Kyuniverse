import { StyleSheet, Text, View } from 'react-native';
import PrimaryButton from '../components/PrimaryButton';
import ScreenContainer from '../components/ScreenContainer';
import { useFlashcards } from '../context/FlashcardContext';

export default function ProgressScreen() {
  const { flashcards, knownCardIds, quizResults, resetProgress } = useFlashcards();

  const knownCount = knownCardIds.length;
  const correctCount = quizResults.filter(Boolean).length;
  const accuracy = quizResults.length ? Math.round((correctCount / quizResults.length) * 100) : 0;

  return (
    <ScreenContainer>
      <Text style={styles.title}>Your Progress</Text>

      <View style={styles.grid}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{knownCount}</Text>
          <Text style={styles.statLabel}>Known cards</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{flashcards.length}</Text>
          <Text style={styles.statLabel}>Total cards</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{correctCount}</Text>
          <Text style={styles.statLabel}>Correct answers</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{accuracy}%</Text>
          <Text style={styles.statLabel}>Quiz accuracy</Text>
        </View>
      </View>

      <PrimaryButton title="Reset Progress" variant="secondary" onPress={resetProgress} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 20,
  },
  grid: {
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 20,
  },
  statValue: {
    fontSize: 30,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 6,
  },
  statLabel: {
    fontSize: 14,
    color: '#64748b',
  },
});
