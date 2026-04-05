import { useEffect, useMemo, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import PrimaryButton from '../components/PrimaryButton';
import ScreenContainer from '../components/ScreenContainer';
import { useFlashcards } from '../context/FlashcardContext';
import colors from '../theme/colors';
import { getExampleSentence } from '../utils/examples';
import { speakText } from '../utils/pronunciation';

function getDayOfYear() {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 0);
  const diff = now - startOfYear;
  const oneDay = 1000 * 60 * 60 * 24;

  return Math.floor(diff / oneDay);
}

export default function HomeScreen({ navigation }) {
  const {
    flashcards,
    allFlashcards,
    levels,
    selectedLevel,
    changeLevel,
    partsOfSpeech,
    selectedPartOfSpeech,
    changePartOfSpeech,
    studyModes,
    selectedStudyMode,
    changeStudyMode,
    searchQuery,
    changeSearchQuery,
    clearSearchQuery,
    mistakeCount,
    lastStudyScreen,
    rememberStudyScreen,
    quizDifficulties,
    selectedQuizDifficulty,
    changeQuizDifficulty,
    quizScopes,
    selectedQuizScope,
    changeQuizScope,
    knownCardIds,
    favoriteCount,
    quizResults,
    dailyGoal,
    todayProgress,
    streakCount,
    showOnboardingTip,
    dismissOnboardingTip,
    showOnboardingAgain,
    selectedGoalTarget,
    goalProgressCount,
    remainingGoalCount,
    isGoalComplete,
  } = useFlashcards();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(18)).current;
  const correctCount = quizResults.filter(Boolean).length;
  const dailyWord = useMemo(() => {
    if (!allFlashcards.length) {
      return null;
    }

    const dailyIndex = getDayOfYear() % allFlashcards.length;
    return allFlashcards[dailyIndex];
  }, [allFlashcards]);
  const dailyWordExample = dailyWord ? getExampleSentence(dailyWord) : null;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 450,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 450,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  const handleOpenReviewFlashcards = () => {
    changeStudyMode('Needs Review');
    rememberStudyScreen('Flashcards');
    navigation.navigate('Flashcards');
  };

  const handleOpenReviewQuiz = () => {
    changeStudyMode('Needs Review');
    rememberStudyScreen('Quiz');
    navigation.navigate('Quiz');
  };

  const handleContinueLearning = () => {
    rememberStudyScreen(lastStudyScreen);
    navigation.navigate(lastStudyScreen);
  };

  const handleOpenFlashcards = () => {
    rememberStudyScreen('Flashcards');
    navigation.navigate('Flashcards');
  };

  const handleOpenQuiz = () => {
    rememberStudyScreen('Quiz');
    navigation.navigate('Quiz');
  };

  return (
    <ScreenContainer>
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <View style={styles.hero}>
          <View style={styles.heroBadge}>
            <Text style={styles.heroBadgeText}>Fun practice mode</Text>
          </View>
          <Text style={styles.title}>Learn Korean and English with a smile</Text>
          <Text style={styles.subtitle}>
            Flip through playful flashcards, try a low-pressure quiz, and celebrate your progress.
          </Text>
        </View>

        {showOnboardingTip ? (
          <View style={styles.onboardingCard}>
            <Text style={styles.onboardingTitle}>Quick tour</Text>
            <Text style={styles.onboardingText}>
              Start with the daily word, use Needs Review when quiz misses pile up, set your goal in Goals,
              and turn on reminders when you want a gentle push.
            </Text>
            <View style={styles.onboardingActions}>
              <Pressable
                style={({ pressed }) => [styles.onboardingPrimaryButton, pressed && styles.levelChipPressed]}
                onPress={() => navigation.navigate('Goals')}
              >
                <Text style={styles.onboardingPrimaryLabel}>Open Goals</Text>
              </Pressable>
              <Pressable
                style={({ pressed }) => [styles.onboardingSecondaryButton, pressed && styles.levelChipPressed]}
                onPress={dismissOnboardingTip}
              >
                <Text style={styles.onboardingSecondaryLabel}>Got it</Text>
              </Pressable>
            </View>
          </View>
        ) : (
          <Pressable
            style={({ pressed }) => [styles.onboardingMiniLink, pressed && styles.levelChipPressed]}
            onPress={showOnboardingAgain}
          >
            <Text style={styles.onboardingMiniLinkLabel}>Show quick tour again</Text>
          </Pressable>
        )}

        <View style={styles.searchCard}>
          <Text style={styles.searchTitle}>Find the right study set</Text>
          <View style={styles.searchInputWrap}>
            <TextInput
              value={searchQuery}
              onChangeText={changeSearchQuery}
              placeholder="Search by Korean, English, level, or word type"
              placeholderTextColor={colors.textSoft}
              style={styles.searchInput}
              maxLength={80}
            />
            {searchQuery ? (
              <Pressable
                onPress={clearSearchQuery}
                style={({ pressed }) => [styles.searchClearButton, pressed && styles.levelChipPressed]}
              >
                <Text style={styles.searchClearLabel}>Clear</Text>
              </Pressable>
            ) : null}
          </View>
          <Text style={styles.searchMeta}>
            {flashcards.length} cards match your current filters.
          </Text>
        </View>

        <Pressable
          style={({ pressed }) => [styles.continueCard, pressed && styles.levelChipPressed]}
          onPress={handleContinueLearning}
        >
          <Text style={styles.continueEyebrow}>Continue learning</Text>
          <Text style={styles.continueTitle}>
            Jump back into {lastStudyScreen === 'Quiz' ? 'quiz mode' : 'flashcards'}
          </Text>
          <Text style={styles.continueText}>
            Pick up where your last study session left off and keep the momentum going.
          </Text>
        </Pressable>

        <View style={styles.heroPanel}>
          <View style={[styles.statBubble, styles.statBubbleWarm]}>
            <Text style={styles.statValue}>{flashcards.length}</Text>
            <Text style={styles.statLabel}>Cards ready</Text>
          </View>
          <View style={[styles.statBubble, styles.statBubbleMint]}>
            <Text style={styles.statValue}>{knownCardIds.length}</Text>
            <Text style={styles.statLabel}>Cards learned</Text>
          </View>
          <View style={[styles.statBubble, styles.statBubbleLavender]}>
            <Text style={styles.statValue}>{correctCount}</Text>
            <Text style={styles.statLabel}>Quiz wins</Text>
          </View>
        </View>

        {dailyWord ? (
          <View style={styles.dailyWordCard}>
            <View style={styles.dailyWordHeader}>
              <View>
                <Text style={styles.dailyWordEyebrow}>Word of the day</Text>
                <Text style={styles.dailyWordType}>
                  {dailyWord.level} - {dailyWord.partOfSpeech}
                </Text>
              </View>
              <Pressable
                onPress={() => speakText(dailyWord.korean, 'ko-KR')}
                style={({ pressed }) => [styles.dailyWordAudioButton, pressed && styles.levelChipPressed]}
              >
                <Text style={styles.dailyWordAudioLabel}>Hear Korean</Text>
              </Pressable>
            </View>

            <Text style={styles.dailyWordKorean}>{dailyWord.korean}</Text>
            <Text style={styles.dailyWordEnglish}>{dailyWord.english}</Text>
            <Text style={styles.dailyWordText}>
              A tiny win for today: hear it, say it once, and try spotting it again later.
            </Text>
            <View style={styles.exampleCard}>
              <Text style={styles.exampleTitle}>Example sentence</Text>
              <Text style={styles.exampleSentence}>{dailyWordExample.sentence}</Text>
              <Text style={styles.exampleHint}>{dailyWordExample.hint}</Text>
            </View>

            <View style={styles.dailyWordActions}>
              <Pressable
                onPress={() => speakText(dailyWord.english, 'en-US')}
                style={({ pressed }) => [styles.dailyWordSecondaryButton, pressed && styles.levelChipPressed]}
              >
                <Text style={styles.dailyWordSecondaryLabel}>Hear English</Text>
              </Pressable>
              <Pressable
                onPress={() => navigation.navigate('Flashcards')}
                style={({ pressed }) => [styles.dailyWordPrimaryButton, pressed && styles.levelChipPressed]}
              >
                <Text style={styles.dailyWordPrimaryLabel}>Practice More</Text>
              </Pressable>
            </View>
          </View>
        ) : null}

        <View style={styles.favoriteCard}>
          <Text style={styles.favoriteCardTitle}>Saved for later review</Text>
          <Text style={styles.favoriteCardValue}>{favoriteCount}</Text>
          <Text style={styles.favoriteCardText}>
            Bookmark tricky words in flashcards, then switch on favorites-only review.
          </Text>
        </View>

        <View style={styles.goalRow}>
          <View style={[styles.goalCard, styles.goalCardPeach]}>
            <Text style={styles.goalValue}>
              {todayProgress}/{dailyGoal}
            </Text>
            <Text style={styles.goalLabel}>Today's goal</Text>
          </View>
          <View style={[styles.goalCard, styles.goalCardYellow]}>
            <Text style={styles.goalValue}>{streakCount}</Text>
            <Text style={styles.goalLabel}>Day streak</Text>
          </View>
        </View>

        <View style={styles.reviewCard}>
          <Text style={styles.reviewEyebrow}>Needs review</Text>
          <Text style={styles.reviewValue}>{mistakeCount}</Text>
          <Text style={styles.reviewText}>
            {mistakeCount
              ? 'These words tripped you up recently. A quick review round will help them stick.'
              : 'You are all caught up right now. Keep going and new review words will appear here.'}
          </Text>
          <View style={styles.reviewActions}>
            <Pressable
              style={({ pressed }) => [styles.reviewButtonSecondary, pressed && styles.levelChipPressed]}
              onPress={handleOpenReviewFlashcards}
            >
              <Text style={styles.reviewButtonSecondaryLabel}>Review Cards</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [styles.reviewButtonPrimary, pressed && styles.levelChipPressed]}
              onPress={handleOpenReviewQuiz}
            >
              <Text style={styles.reviewButtonPrimaryLabel}>Review Quiz</Text>
            </Pressable>
          </View>
        </View>

        <Pressable
          style={({ pressed }) => [styles.goalFocusCard, pressed && styles.levelChipPressed]}
          onPress={() => navigation.navigate('Goals')}
        >
          <Text style={styles.goalFocusEyebrow}>Goal focus</Text>
          <Text style={styles.goalFocusTitle}>{selectedGoalTarget}-word milestone</Text>
          <Text style={styles.goalFocusText}>
            {isGoalComplete
              ? 'You hit this one already. Tap here and level up your target.'
              : `${goalProgressCount} memorized so far, ${remainingGoalCount} left to reach your goal.`}
          </Text>
        </Pressable>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>Current level</Text>
          <Text style={styles.cardValue}>{selectedLevel}</Text>
          <Text style={styles.cardHint}>
            {selectedPartOfSpeech === 'All'
              ? 'All word types are active right now.'
              : `${selectedPartOfSpeech}s are active right now.`}
          </Text>
        </View>

        <View style={styles.levelSection}>
          <Text style={styles.levelTitle}>Study focus</Text>
          <View style={styles.levelList}>
            {studyModes.map((studyMode) => (
              <Pressable
                key={studyMode}
                onPress={() => changeStudyMode(studyMode)}
                style={({ pressed }) => [
                  styles.levelChip,
                  selectedStudyMode === studyMode && styles.levelChipActive,
                  pressed && styles.levelChipPressed,
                ]}
              >
                <Text
                  style={[
                    styles.levelChipLabel,
                    selectedStudyMode === studyMode && styles.levelChipLabelActive,
                  ]}
                >
                  {studyMode}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.levelSection}>
          <Text style={styles.levelTitle}>Choose a level</Text>
          <View style={styles.levelList}>
            {levels.map((level) => (
              <Pressable
                key={level}
                onPress={() => changeLevel(level)}
                style={({ pressed }) => [
                  styles.levelChip,
                  selectedLevel === level && styles.levelChipActive,
                  pressed && styles.levelChipPressed,
                ]}
              >
                <Text
                  style={[
                    styles.levelChipLabel,
                    selectedLevel === level && styles.levelChipLabelActive,
                  ]}
                >
                  {level}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.levelSection}>
          <Text style={styles.levelTitle}>Word type</Text>
          <View style={styles.levelList}>
            {partsOfSpeech.map((partOfSpeech) => (
              <Pressable
                key={partOfSpeech}
                onPress={() => changePartOfSpeech(partOfSpeech)}
                style={({ pressed }) => [
                  styles.levelChip,
                  selectedPartOfSpeech === partOfSpeech && styles.levelChipActive,
                  pressed && styles.levelChipPressed,
                ]}
              >
                <Text
                  style={[
                    styles.levelChipLabel,
                    selectedPartOfSpeech === partOfSpeech && styles.levelChipLabelActive,
                  ]}
                >
                  {partOfSpeech}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.levelSection}>
          <Text style={styles.levelTitle}>Quiz difficulty</Text>
          <View style={styles.levelList}>
            {quizDifficulties.map((difficulty) => (
              <Pressable
                key={difficulty}
                onPress={() => changeQuizDifficulty(difficulty)}
                style={({ pressed }) => [
                  styles.levelChip,
                  selectedQuizDifficulty === difficulty && styles.levelChipActive,
                  pressed && styles.levelChipPressed,
                ]}
              >
                <Text
                  style={[
                    styles.levelChipLabel,
                    selectedQuizDifficulty === difficulty && styles.levelChipLabelActive,
                  ]}
                >
                  {difficulty}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.levelSection}>
          <Text style={styles.levelTitle}>Quiz source</Text>
          <View style={styles.levelList}>
            {quizScopes.map((scope) => (
              <Pressable
                key={scope}
                onPress={() => changeQuizScope(scope)}
                style={({ pressed }) => [
                  styles.levelChip,
                  selectedQuizScope === scope && styles.levelChipActive,
                  pressed && styles.levelChipPressed,
                ]}
              >
                <Text
                  style={[
                    styles.levelChipLabel,
                    selectedQuizScope === scope && styles.levelChipLabelActive,
                  ]}
                >
                  {scope}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.gameBoard}>
          <Pressable
            style={[styles.featureCard, styles.featurePrimary]}
            onPress={handleOpenFlashcards}
          >
            <Text style={styles.featureEyebrow}>Warm-up</Text>
            <Text style={styles.featureTitle}>Start Flashcards</Text>
            <Text style={styles.featureText}>
              Flip through{' '}
              {selectedPartOfSpeech === 'All'
                ? 'daily-use words'
                : `${selectedPartOfSpeech.toLowerCase()}s`}{' '}
              at your own pace.
            </Text>
          </Pressable>
          <Pressable
            style={[styles.featureCard, styles.featureSecondary]}
            onPress={handleOpenQuiz}
          >
            <Text style={styles.featureEyebrow}>Challenge</Text>
            <Text style={styles.featureTitle}>Take Quiz</Text>
            <Text style={styles.featureText}>
              {selectedQuizScope === 'Word Type Only'
                ? `Quiz across all levels for ${selectedPartOfSpeech === 'All' ? 'all word types' : selectedPartOfSpeech.toLowerCase() + 's'}.`
                : `Quiz your current filters on ${selectedQuizDifficulty.toLowerCase()} mode.`}
            </Text>
          </Pressable>
        </View>

        <View style={styles.actions}>
          <PrimaryButton
            title="View Progress"
            variant="secondary"
            onPress={() => navigation.navigate('Progress')}
          />
        </View>
      </Animated.View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  hero: {
    marginTop: 10,
    marginBottom: 22,
  },
  heroBadge: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    backgroundColor: colors.secondary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 14,
  },
  heroBadgeText: {
    color: colors.secondaryDark,
    fontSize: 13,
    fontWeight: '700',
  },
  title: {
    fontSize: 30,
    lineHeight: 38,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.textSoft,
  },
  heroPanel: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 22,
  },
  continueCard: {
    backgroundColor: '#efe6ff',
    borderRadius: 22,
    padding: 18,
    marginBottom: 22,
  },
  continueEyebrow: {
    fontSize: 13,
    fontWeight: '700',
    color: '#5e47a5',
    marginBottom: 6,
  },
  continueTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 6,
  },
  continueText: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSoft,
  },
  onboardingCard: {
    backgroundColor: '#fff1dc',
    borderRadius: 22,
    padding: 18,
    marginBottom: 22,
    borderWidth: 2,
    borderColor: colors.backgroundAccent,
  },
  onboardingTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 8,
  },
  onboardingText: {
    fontSize: 14,
    lineHeight: 21,
    color: colors.textSoft,
  },
  onboardingActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
  onboardingPrimaryButton: {
    flex: 1,
    borderRadius: 18,
    backgroundColor: colors.primary,
    paddingVertical: 12,
    alignItems: 'center',
  },
  onboardingPrimaryLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.white,
  },
  onboardingSecondaryButton: {
    flex: 1,
    borderRadius: 18,
    backgroundColor: colors.white,
    paddingVertical: 12,
    alignItems: 'center',
  },
  onboardingSecondaryLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  onboardingMiniLink: {
    alignSelf: 'flex-start',
    marginBottom: 18,
    borderRadius: 999,
    backgroundColor: colors.cardAlt,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  onboardingMiniLinkLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
  },
  searchCard: {
    backgroundColor: colors.cardAlt,
    borderRadius: 22,
    padding: 18,
    marginBottom: 22,
  },
  searchTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 10,
  },
  searchInputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  searchInput: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.backgroundAccent,
  },
  searchClearButton: {
    borderRadius: 999,
    backgroundColor: colors.lavender,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  searchClearLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
  },
  searchMeta: {
    fontSize: 13,
    color: colors.textSoft,
    marginTop: 10,
  },
  dailyWordCard: {
    backgroundColor: '#fff4d8',
    borderRadius: 24,
    padding: 20,
    marginBottom: 22,
    borderWidth: 2,
    borderColor: '#ffe1a3',
  },
  dailyWordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 14,
  },
  dailyWordEyebrow: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.secondaryDark,
    marginBottom: 4,
  },
  dailyWordType: {
    fontSize: 13,
    color: colors.textSoft,
  },
  dailyWordAudioButton: {
    borderRadius: 999,
    backgroundColor: colors.white,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  dailyWordAudioLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
  },
  dailyWordKorean: {
    fontSize: 34,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 6,
  },
  dailyWordEnglish: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primaryDark,
    marginBottom: 10,
  },
  dailyWordText: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSoft,
  },
  exampleCard: {
    marginTop: 14,
    borderRadius: 18,
    backgroundColor: colors.white,
    padding: 14,
  },
  exampleTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primaryDark,
    marginBottom: 6,
  },
  exampleSentence: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.text,
    marginBottom: 6,
  },
  exampleHint: {
    fontSize: 13,
    lineHeight: 18,
    color: colors.textSoft,
  },
  dailyWordActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
  dailyWordSecondaryButton: {
    flex: 1,
    borderRadius: 18,
    backgroundColor: colors.card,
    paddingVertical: 12,
    alignItems: 'center',
  },
  dailyWordSecondaryLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  dailyWordPrimaryButton: {
    flex: 1,
    borderRadius: 18,
    backgroundColor: colors.primary,
    paddingVertical: 12,
    alignItems: 'center',
  },
  dailyWordPrimaryLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.white,
  },
  statBubble: {
    flex: 1,
    borderRadius: 22,
    paddingVertical: 18,
    paddingHorizontal: 14,
  },
  statBubbleWarm: {
    backgroundColor: colors.cardAlt,
  },
  statBubbleMint: {
    backgroundColor: '#daf5e7',
  },
  statBubbleLavender: {
    backgroundColor: '#eee6ff',
  },
  statValue: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: colors.textSoft,
    lineHeight: 18,
  },
  goalRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 22,
  },
  favoriteCard: {
    backgroundColor: '#ffe9f2',
    borderRadius: 22,
    padding: 18,
    marginBottom: 22,
  },
  favoriteCardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  favoriteCardValue: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.primaryDark,
    marginBottom: 6,
  },
  favoriteCardText: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSoft,
  },
  reviewCard: {
    backgroundColor: '#e8f4ff',
    borderRadius: 22,
    padding: 18,
    marginBottom: 22,
  },
  reviewEyebrow: {
    fontSize: 13,
    fontWeight: '700',
    color: '#215a92',
    marginBottom: 6,
  },
  reviewValue: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 6,
  },
  reviewText: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSoft,
  },
  reviewActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
  reviewButtonPrimary: {
    flex: 1,
    borderRadius: 18,
    backgroundColor: colors.primary,
    paddingVertical: 12,
    alignItems: 'center',
  },
  reviewButtonPrimaryLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.white,
  },
  reviewButtonSecondary: {
    flex: 1,
    borderRadius: 18,
    backgroundColor: colors.white,
    paddingVertical: 12,
    alignItems: 'center',
  },
  reviewButtonSecondaryLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  goalFocusCard: {
    backgroundColor: '#e7f7f0',
    borderRadius: 22,
    padding: 18,
    marginBottom: 22,
  },
  goalFocusEyebrow: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.mintDark,
    marginBottom: 6,
  },
  goalFocusTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 6,
  },
  goalFocusText: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSoft,
  },
  goalCard: {
    flex: 1,
    borderRadius: 22,
    padding: 18,
  },
  goalCardPeach: {
    backgroundColor: '#ffe0d1',
  },
  goalCardYellow: {
    backgroundColor: '#fff0b8',
  },
  goalValue: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 4,
  },
  goalLabel: {
    fontSize: 13,
    color: colors.textSoft,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 24,
    padding: 24,
    marginBottom: 22,
    borderWidth: 2,
    borderColor: colors.backgroundAccent,
  },
  cardLabel: {
    fontSize: 14,
    color: colors.textSoft,
    marginBottom: 8,
  },
  cardValue: {
    fontSize: 40,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  cardHint: {
    fontSize: 14,
    color: colors.textSoft,
    marginTop: 8,
  },
  levelSection: {
    marginBottom: 18,
  },
  levelTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  levelList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  levelChip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: colors.lavender,
  },
  levelChipActive: {
    backgroundColor: colors.secondary,
  },
  levelChipLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  levelChipLabelActive: {
    color: colors.secondaryDark,
  },
  levelChipPressed: {
    opacity: 0.85,
  },
  gameBoard: {
    gap: 12,
    marginBottom: 16,
  },
  featureCard: {
    borderRadius: 24,
    padding: 22,
  },
  featurePrimary: {
    backgroundColor: colors.primary,
  },
  featureSecondary: {
    backgroundColor: colors.mint,
  },
  featureEyebrow: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.white,
    marginBottom: 8,
  },
  featureTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.white,
    marginBottom: 8,
  },
  featureText: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.white,
    opacity: 0.92,
  },
  actions: {
    marginTop: 'auto',
  },
});
