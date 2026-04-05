import { Pressable, StyleSheet, Text, View } from 'react-native';
import AppShell from '../components/AppShell';
import BottomNav from '../components/BottomNav';
import InfoCard from '../components/InfoCard';
import PrimaryButton from '../components/PrimaryButton';
import ProgressBar from '../components/ProgressBar';
import StatCard from '../components/StatCard';
import { useFlashcards } from '../context/FlashcardContext';
import colors from '../theme/colors';
import tokens from '../theme/tokens';

function getEncouragement({ isDailyGoalComplete, isGoalComplete, streakCount, mistakeCount }) {
  if (isGoalComplete) {
    return 'You reached your word milestone. That deserves a little celebration.';
  }

  if (isDailyGoalComplete) {
    return 'Today is already a win. A tiny review round now would be a bonus.';
  }

  if (streakCount >= 3) {
    return `You are on a ${streakCount}-day rhythm. Keep it easy and keep it alive.`;
  }

  if (mistakeCount > 0) {
    return 'A few words are waiting for a comeback. Review mode is your fastest win.';
  }

  return 'You are building momentum. A few minutes today is more than enough.';
}

export default function ProgressScreen({ navigation }) {
  const {
    flashcards,
    knownCardIds,
    quizResults,
    resetProgress,
    selectedLevel,
    selectedPartOfSpeech,
    selectedStudyMode,
    searchQuery,
    levelKnownCount,
    favoriteCardIds,
    favoriteCount,
    mistakeCount,
    selectedGoalTarget,
    goalProgressCount,
    remainingGoalCount,
    isGoalComplete,
    dailyGoal,
    todayProgress,
    dailyGoalProgress,
    streakCount,
    isDailyGoalComplete,
  } = useFlashcards();

  const knownCount =
    selectedLevel === 'All' && selectedPartOfSpeech === 'All' ? knownCardIds.length : levelKnownCount;
  const correctCount = quizResults.filter(Boolean).length;
  const accuracy = quizResults.length ? Math.round((correctCount / quizResults.length) * 100) : 0;
  const dailyGoalPercent = Math.min((dailyGoalProgress / dailyGoal) * 100, 100);
  const wordGoalPercent = Math.min((goalProgressCount / selectedGoalTarget) * 100, 100);
  const encouragement = getEncouragement({
    isDailyGoalComplete,
    isGoalComplete,
    streakCount,
    mistakeCount,
  });

  return (
    <AppShell
      scroll
      contentContainerStyle={styles.content}
      bottomNav={
        <BottomNav
          navigation={navigation}
          currentRoute="Progress"
          onCenterPress={() => navigation.navigate('Flashcards')}
        />
      }
    >
      <View style={styles.hero}>
        <Text style={styles.title}>Your Progress</Text>
        <Text style={styles.subtitle}>A quick look at what is sticking and what wants one more pass.</Text>
      </View>

      <InfoCard style={styles.filterStrip}>
        <Text style={styles.filterLabel}>Level: {selectedLevel}</Text>
        <Text style={styles.filterLabel}>Word type: {selectedPartOfSpeech}</Text>
        <Text style={styles.filterLabel}>Focus: {selectedStudyMode}</Text>
        {searchQuery ? <Text style={styles.filterLabel}>Search: "{searchQuery}"</Text> : null}
      </InfoCard>

      <View style={styles.summaryHero}>
        <StatCard value={`${todayProgress}/${dailyGoal}`} label="Daily study goal" tone="beige" />
        <StatCard value={streakCount} label="Days in a row" tone="lavender" />
        <StatCard value={`${accuracy}%`} label="Quiz score" tone="lavender" />
      </View>

      <InfoCard style={styles.cheerCard}>
        <Text style={styles.cheerTitle}>Friendly check-in</Text>
        <Text style={styles.cheerText}>{encouragement}</Text>
      </InfoCard>

      <InfoCard title="Daily goal">
        <Text style={styles.featureText}>
          {isDailyGoalComplete
            ? "You finished today's goal. If you keep going, it is just extra credit now."
            : `${dailyGoal - dailyGoalProgress} more actions will finish today's goal.`}
        </Text>
        <ProgressBar progress={dailyGoalPercent} tone="blue" height={12} />
      </InfoCard>

      <Pressable style={({ pressed }) => [styles.infoPressable, pressed && styles.pressed]} onPress={() => navigation.navigate('Goals')}>
        <InfoCard title="Word milestone">
          <Text style={styles.featureValue}>
            {goalProgressCount}/{selectedGoalTarget}
          </Text>
          <Text style={styles.featureText}>
            {isGoalComplete
              ? 'You reached this milestone. Tap here when you are ready for a bigger one.'
              : `${remainingGoalCount} more memorized words to reach your current target.`}
          </Text>
          <ProgressBar progress={wordGoalPercent} tone="green" height={12} />
        </InfoCard>
      </Pressable>

      <Text style={styles.sectionTitle}>Momentum badges</Text>
      <View style={styles.badgeRow}>
        <StatCard value={knownCount} label="Learned" tone="beige" />
        <StatCard value={mistakeCount} label="Review" tone="lavender" />
        <StatCard
          value={selectedLevel === 'All' && selectedPartOfSpeech === 'All' ? favoriteCardIds.length : favoriteCount}
          label="Saved"
          tone="lavender"
        />
      </View>

      <Text style={styles.sectionTitle}>Study snapshot</Text>
      <View style={styles.snapshotGrid}>
        <InfoCard title="Cards in current view">{String(flashcards.length)}</InfoCard>
        <InfoCard title="Correct quiz answers">{String(correctCount)}</InfoCard>
        <InfoCard title="Current streak">{String(streakCount)}</InfoCard>
        <InfoCard title="Overall quiz accuracy">{`${accuracy}%`}</InfoCard>
      </View>

      <View style={styles.actions}>
        <PrimaryButton title="Privacy & Data" variant="secondary" onPress={() => navigation.navigate('Privacy')} />
        <PrimaryButton title="Reset Progress" variant="secondary" onPress={resetProgress} />
      </View>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 28,
  },
  hero: {
    marginTop: 6,
    marginBottom: 18,
  },
  title: {
    fontSize: tokens.type.screenTitle,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: tokens.type.body,
    lineHeight: 22,
    color: colors.textSoft,
  },
  filterStrip: {
    marginBottom: tokens.spacing.md,
  },
  filterLabel: {
    fontSize: tokens.type.caption,
    color: colors.textSoft,
    marginBottom: 4,
  },
  summaryHero: {
    flexDirection: 'row',
    gap: tokens.spacing.sm,
    marginBottom: tokens.spacing.md,
  },
  cheerCard: {
    marginBottom: tokens.spacing.md,
    backgroundColor: colors.secondary,
  },
  cheerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.secondaryDark,
    marginBottom: 6,
  },
  cheerText: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.secondaryDark,
  },
  featureValue: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.primaryDark,
    marginBottom: 8,
  },
  featureText: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSoft,
    marginBottom: 12,
  },
  infoPressable: {
    marginTop: tokens.spacing.md,
  },
  pressed: {
    opacity: 0.9,
  },
  sectionTitle: {
    fontSize: tokens.type.sectionTitle,
    fontWeight: '700',
    color: colors.text,
    marginTop: tokens.spacing.lg,
    marginBottom: tokens.spacing.md,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: tokens.spacing.sm,
  },
  snapshotGrid: {
    gap: tokens.spacing.md,
  },
  actions: {
    marginTop: tokens.spacing.lg,
  },
});
