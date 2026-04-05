import { Pressable, StyleSheet, Text, View } from 'react-native';
import PrimaryButton from '../components/PrimaryButton';
import ScreenContainer from '../components/ScreenContainer';
import { useFlashcards } from '../context/FlashcardContext';
import colors from '../theme/colors';

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
    <ScreenContainer>
      <View style={styles.hero}>
        <Text style={styles.title}>Your Progress</Text>
        <Text style={styles.subtitle}>A quick look at what is sticking and what wants one more pass.</Text>
      </View>

      <View style={styles.filterStrip}>
        <Text style={styles.filterLabel}>Level: {selectedLevel}</Text>
        <Text style={styles.filterLabel}>Word type: {selectedPartOfSpeech}</Text>
        <Text style={styles.filterLabel}>Focus: {selectedStudyMode}</Text>
        {searchQuery ? <Text style={styles.filterLabel}>Search: "{searchQuery}"</Text> : null}
      </View>

      <View style={styles.summaryHero}>
        <View style={styles.summaryHeroWarm}>
          <Text style={styles.summaryHeroEyebrow}>Today</Text>
          <Text style={styles.summaryHeroValue}>
            {todayProgress}/{dailyGoal}
          </Text>
          <Text style={styles.summaryHeroText}>Daily study goal</Text>
        </View>
        <View style={styles.summaryHeroMint}>
          <Text style={styles.summaryHeroEyebrow}>Streak</Text>
          <Text style={styles.summaryHeroValue}>{streakCount}</Text>
          <Text style={styles.summaryHeroText}>Days in a row</Text>
        </View>
        <View style={styles.summaryHeroLavender}>
          <Text style={styles.summaryHeroEyebrow}>Accuracy</Text>
          <Text style={styles.summaryHeroValue}>{accuracy}%</Text>
          <Text style={styles.summaryHeroText}>Quiz score</Text>
        </View>
      </View>

      <View style={styles.cheerCard}>
        <Text style={styles.cheerTitle}>Friendly check-in</Text>
        <Text style={styles.cheerText}>{encouragement}</Text>
      </View>

      <View style={styles.progressFeatureCard}>
        <View style={styles.featureHeader}>
          <Text style={styles.featureTitle}>Daily goal</Text>
          <Text style={styles.featureValue}>
            {todayProgress}/{dailyGoal}
          </Text>
        </View>
        <Text style={styles.featureText}>
          {isDailyGoalComplete
            ? 'You finished today’s goal. If you keep going, it is just extra credit now.'
            : `${dailyGoal - dailyGoalProgress} more actions will finish today’s goal.`}
        </Text>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFillWarm, { width: `${dailyGoalPercent}%` }]} />
        </View>
      </View>

      <Pressable
        style={({ pressed }) => [styles.progressFeatureCard, styles.featureCardMint, pressed && styles.pressed]}
        onPress={() => navigation.navigate('Goals')}
      >
        <View style={styles.featureHeader}>
          <Text style={styles.featureTitle}>Word milestone</Text>
          <Text style={styles.featureValue}>
            {goalProgressCount}/{selectedGoalTarget}
          </Text>
        </View>
        <Text style={styles.featureText}>
          {isGoalComplete
            ? 'You reached this milestone. Tap here when you are ready for a bigger one.'
            : `${remainingGoalCount} more memorized words to reach your current target.`}
        </Text>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFillMint, { width: `${wordGoalPercent}%` }]} />
        </View>
      </Pressable>

      <View style={styles.badgeSection}>
        <Text style={styles.sectionTitle}>Momentum badges</Text>
        <View style={styles.badgeRow}>
          <View style={[styles.badgeCard, styles.badgeCardGold]}>
            <Text style={styles.badgeValue}>{knownCount}</Text>
            <Text style={styles.badgeLabel}>Learned</Text>
          </View>
          <View style={[styles.badgeCard, styles.badgeCardBlue]}>
            <Text style={styles.badgeValue}>{mistakeCount}</Text>
            <Text style={styles.badgeLabel}>Review</Text>
          </View>
          <View style={[styles.badgeCard, styles.badgeCardPink]}>
            <Text style={styles.badgeValue}>
              {selectedLevel === 'All' && selectedPartOfSpeech === 'All'
                ? favoriteCardIds.length
                : favoriteCount}
            </Text>
            <Text style={styles.badgeLabel}>Saved</Text>
          </View>
        </View>
      </View>

      <View style={styles.gridSection}>
        <Text style={styles.sectionTitle}>Study snapshot</Text>
        <View style={styles.grid}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{flashcards.length}</Text>
            <Text style={styles.statLabel}>Cards in current view</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{correctCount}</Text>
            <Text style={styles.statLabel}>Correct quiz answers</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{streakCount}</Text>
            <Text style={styles.statLabel}>Current streak</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{accuracy}%</Text>
            <Text style={styles.statLabel}>Overall quiz accuracy</Text>
          </View>
        </View>
      </View>

      <View style={styles.actions}>
        <PrimaryButton title="Privacy & Data" variant="secondary" onPress={() => navigation.navigate('Privacy')} />
        <PrimaryButton title="Reset Progress" variant="secondary" onPress={resetProgress} />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  hero: {
    marginTop: 6,
    marginBottom: 18,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.textSoft,
  },
  filterStrip: {
    backgroundColor: colors.cardAlt,
    borderRadius: 20,
    padding: 16,
    marginBottom: 18,
    gap: 6,
  },
  filterLabel: {
    fontSize: 13,
    color: colors.textSoft,
  },
  summaryHero: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 18,
  },
  summaryHeroWarm: {
    flex: 1,
    borderRadius: 22,
    padding: 16,
    backgroundColor: '#ffe4d6',
  },
  summaryHeroMint: {
    flex: 1,
    borderRadius: 22,
    padding: 16,
    backgroundColor: '#daf5e7',
  },
  summaryHeroLavender: {
    flex: 1,
    borderRadius: 22,
    padding: 16,
    backgroundColor: '#efe6ff',
  },
  summaryHeroEyebrow: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSoft,
    marginBottom: 8,
  },
  summaryHeroValue: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 4,
  },
  summaryHeroText: {
    fontSize: 13,
    color: colors.textSoft,
    lineHeight: 18,
  },
  cheerCard: {
    backgroundColor: colors.secondary,
    borderRadius: 22,
    padding: 18,
    marginBottom: 18,
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
  progressFeatureCard: {
    backgroundColor: colors.card,
    borderRadius: 24,
    padding: 18,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: colors.backgroundAccent,
  },
  featureCardMint: {
    backgroundColor: '#eefaf4',
  },
  featureHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.text,
  },
  featureValue: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.primaryDark,
  },
  featureText: {
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
  progressFillWarm: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 999,
  },
  progressFillMint: {
    height: '100%',
    backgroundColor: colors.mintDark,
    borderRadius: 999,
  },
  badgeSection: {
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 12,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 10,
  },
  badgeCard: {
    flex: 1,
    borderRadius: 22,
    paddingVertical: 18,
    paddingHorizontal: 14,
    alignItems: 'center',
  },
  badgeCardGold: {
    backgroundColor: '#fff0b8',
  },
  badgeCardBlue: {
    backgroundColor: '#e8f4ff',
  },
  badgeCardPink: {
    backgroundColor: '#ffe9f2',
  },
  badgeValue: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 4,
  },
  badgeLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textSoft,
  },
  gridSection: {
    marginBottom: 18,
  },
  grid: {
    gap: 12,
  },
  statCard: {
    backgroundColor: colors.card,
    borderRadius: 22,
    padding: 18,
    borderWidth: 2,
    borderColor: colors.backgroundAccent,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.primaryDark,
    marginBottom: 6,
  },
  statLabel: {
    fontSize: 14,
    color: colors.textSoft,
  },
  actions: {
    marginTop: 6,
  },
  pressed: {
    opacity: 0.85,
  },
});
