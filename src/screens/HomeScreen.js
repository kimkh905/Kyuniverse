import { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import PrimaryButton from '../components/PrimaryButton';
import ScreenContainer from '../components/ScreenContainer';
import { useFlashcards } from '../context/FlashcardContext';
import colors from '../theme/colors';

export default function HomeScreen({ navigation }) {
  const {
    flashcards,
    levels,
    selectedLevel,
    changeLevel,
    partsOfSpeech,
    selectedPartOfSpeech,
    changePartOfSpeech,
    quizDifficulties,
    selectedQuizDifficulty,
    changeQuizDifficulty,
    quizScopes,
    selectedQuizScope,
    changeQuizScope,
    knownCardIds,
    quizResults,
    dailyGoal,
    todayProgress,
    streakCount,
  } = useFlashcards();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(18)).current;
  const correctCount = quizResults.filter(Boolean).length;

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
            onPress={() => navigation.navigate('Flashcards')}
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
            onPress={() => navigation.navigate('Quiz')}
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
