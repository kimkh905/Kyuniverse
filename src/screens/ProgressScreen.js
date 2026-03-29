import { StyleSheet, Text, View } from 'react-native';
import PrimaryButton from '../components/PrimaryButton';
import ScreenContainer from '../components/ScreenContainer';
import { useFlashcards } from '../context/FlashcardContext';
import colors from '../theme/colors';

export default function ProgressScreen() {
  const {
    flashcards,
    knownCardIds,
    quizResults,
    resetProgress,
    selectedLevel,
    levelKnownCount,
    dailyGoal,
    todayProgress,
    dailyGoalProgress,
    streakCount,
    isDailyGoalComplete,
  } = useFlashcards();

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

      <View style={styles.goalPanel}>
        <View style={styles.goalStatCard}>
          <Text style={styles.goalStatValue}>
            {todayProgress}/{dailyGoal}
          </Text>
          <Text style={styles.goalStatLabel}>Today&apos;s study goal</Text>
        </View>
        <View style={styles.goalStatCard}>
          <Text style={styles.goalStatValue}>{streakCount}</Text>
          <Text style={styles.goalStatLabel}>Current streak</Text>
        </View>
      </View>

      <View style={styles.goalProgressCard}>
        <Text style={styles.goalProgressTitle}>
          {isDailyGoalComplete ? 'Daily goal complete' : 'Daily goal in progress'}
        </Text>
        <Text style={styles.goalProgressText}>
          {isDailyGoalComplete
            ? 'You hit your goal today. Keep the streak going tomorrow.'
            : `${dailyGoal - dailyGoalProgress} more actions to finish today’s goal.`}
        </Text>
        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              { width: `${(dailyGoalProgress / dailyGoal) * 100}%` },
            ]}
          />
        </View>
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
  goalPanel: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  goalStatCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 22,
    padding: 18,
    borderWidth: 2,
    borderColor: colors.backgroundAccent,
  },
  goalStatValue: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.primaryDark,
    marginBottom: 6,
  },
  goalStatLabel: {
    fontSize: 13,
    color: colors.textSoft,
  },
  goalProgressCard: {
    backgroundColor: '#ffe0d1',
    borderRadius: 22,
    padding: 18,
    marginBottom: 16,
  },
  goalProgressTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 6,
  },
  goalProgressText: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSoft,
    marginBottom: 12,
  },
  progressTrack: {
    height: 12,
    borderRadius: 999,
    backgroundColor: colors.white,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 999,
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
