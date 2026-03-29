import { StyleSheet, Text, View } from 'react-native';
import PrimaryButton from '../components/PrimaryButton';
import ScreenContainer from '../components/ScreenContainer';
import { useFlashcards } from '../context/FlashcardContext';
import colors from '../theme/colors';

export default function ProgressScreen() {
  const { flashcards, knownCardIds, quizResults, resetProgress, selectedLevel, levelKnownCount } =
    useFlashcards();

  const knownCount = selectedLevel === 'All' ? knownCardIds.length : levelKnownCount;
  const correctCount = quizResults.filter(Boolean).length;
  const accuracy = quizResults.length ? Math.round((correctCount / quizResults.length) * 100) : 0;

  return (
    <ScreenContainer>
      <Text style={styles.title}>Your Progress</Text>
      <Text style={styles.subtitle}>Current level: {selectedLevel}</Text>
      <View style={styles.cheerCard}>
        <Text style={styles.cheerTitle}>You are building this little by little</Text>
        <Text style={styles.cheerText}>Even a few cards a day adds up faster than it feels.</Text>
      </View>

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
    color: colors.text,
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 15,
    color: colors.textSoft,
    marginBottom: 16,
  },
  grid: {
    gap: 12,
    marginBottom: 20,
  },
  cheerCard: {
    backgroundColor: colors.secondary,
    borderRadius: 22,
    padding: 18,
    marginBottom: 16,
  },
  cheerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.secondaryDark,
    marginBottom: 6,
  },
  cheerText: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.secondaryDark,
  },
  statCard: {
    backgroundColor: colors.card,
    borderRadius: 22,
    padding: 20,
    borderWidth: 2,
    borderColor: colors.backgroundAccent,
  },
  statValue: {
    fontSize: 30,
    fontWeight: '700',
    color: colors.primaryDark,
    marginBottom: 6,
  },
  statLabel: {
    fontSize: 14,
    color: colors.textSoft,
  },
});
