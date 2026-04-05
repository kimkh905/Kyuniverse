import { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import AppShell from '../components/AppShell';
import GradientHeader from '../components/GradientHeader';
import InfoCard from '../components/InfoCard';
import PrimaryButton from '../components/PrimaryButton';
import TopIconButton from '../components/TopIconButton';
import { useFlashcards } from '../context/FlashcardContext';
import colors from '../theme/colors';
import tokens from '../theme/tokens';
import { getExampleSentence } from '../utils/examples';
import { speakText } from '../utils/pronunciation';

function shuffleItems(items) {
  const shuffledItems = [...items];

  for (let index = shuffledItems.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffledItems[index], shuffledItems[swapIndex]] = [
      shuffledItems[swapIndex],
      shuffledItems[index],
    ];
  }

  return shuffledItems;
}

export default function QuizScreen({ navigation }) {
  const {
    quizFlashcards,
    saveQuizResult,
    mistakeCount,
    changeLevel,
    changePartOfSpeech,
    changeStudyMode,
    clearSearchQuery,
    rememberStudyScreen,
    selectedQuizDifficulty,
    selectedPartOfSpeech,
    selectedQuizScope,
    selectedStudyMode,
  } = useFlashcards();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [sessionResults, setSessionResults] = useState([]);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const liftAnim = useRef(new Animated.Value(12)).current;

  const currentCard = quizFlashcards[currentIndex];
  const isFinished = currentIndex >= quizFlashcards.length;
  const example = currentCard ? getExampleSentence(currentCard) : null;
  const optionCount = useMemo(() => {
    if (selectedQuizDifficulty === 'Hard') {
      return 6;
    }

    if (selectedQuizDifficulty === 'Medium') {
      return 4;
    }

    return 3;
  }, [selectedQuizDifficulty]);

  const options = useMemo(() => {
    if (!currentCard) {
      return [];
    }

    const incorrectAnswers = shuffleItems(
      quizFlashcards
        .filter((card) => card.id !== currentCard.id)
        .map((card) => card.english)
    ).slice(0, Math.max(optionCount - 1, 1));

    return shuffleItems([currentCard.english, ...incorrectAnswers]);
  }, [currentCard, quizFlashcards, optionCount]);

  useEffect(() => {
    setCurrentIndex(0);
    setFeedback('');
    setSessionResults([]);
  }, [quizFlashcards, selectedQuizDifficulty, selectedQuizScope]);

  useEffect(() => {
    rememberStudyScreen('Quiz');
  }, [rememberStudyScreen]);

  useEffect(() => {
    fadeAnim.setValue(0);
    liftAnim.setValue(12);

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 240,
        useNativeDriver: true,
      }),
      Animated.timing(liftAnim, {
        toValue: 0,
        duration: 240,
        useNativeDriver: true,
      }),
    ]).start();
  }, [currentIndex, fadeAnim, liftAnim]);

  useEffect(() => {
    if (!feedback) {
      return undefined;
    }

    const timeoutId = setTimeout(() => {
      setFeedback('');
      setCurrentIndex((current) => current + 1);
    }, 700);

    return () => clearTimeout(timeoutId);
  }, [feedback]);

  const handleAnswer = (selectedAnswer) => {
    const isCorrect = selectedAnswer === currentCard.english;
    saveQuizResult(currentCard.id, isCorrect);
    setSessionResults((currentResults) => [...currentResults, isCorrect]);
    setFeedback(
      isCorrect
        ? 'Nice job! You got it.'
        : `Almost there. The answer is "${currentCard.english}" and you're still learning.`
    );
  };

  const handleRestartQuiz = () => {
    setCurrentIndex(0);
    setFeedback('');
    setSessionResults([]);
  };

  const handleSpeakKorean = () => {
    speakText(currentCard.korean, 'ko-KR');
  };

  const handleSpeakEnglish = () => {
    speakText(currentCard.english, 'en-US');
  };

  const handleShowAllCards = () => {
    clearSearchQuery();
    changeStudyMode('All Cards');
    changeLevel('All');
    changePartOfSpeech('All');
  };

  const sessionCorrectCount = sessionResults.filter(Boolean).length;
  const sessionAccuracy = sessionResults.length
    ? Math.round((sessionCorrectCount / sessionResults.length) * 100)
    : 0;

  if (!quizFlashcards.length) {
    return (
      <AppShell>
        <InfoCard title="No quiz cards yet">
          Try a different level or word type from the home screen.
        </InfoCard>
        <View style={styles.summaryActions}>
          <PrimaryButton title="Show All Cards" onPress={handleShowAllCards} />
          <PrimaryButton title="Back Home" variant="secondary" onPress={() => navigation.navigate('Home')} />
        </View>
      </AppShell>
    );
  }

  if (isFinished) {
    return (
      <AppShell>
        <InfoCard title="Quiz complete">
          <Text style={styles.summaryValue}>
            {sessionCorrectCount} / {quizFlashcards.length}
          </Text>
          <Text style={styles.summaryLabel}>Accuracy: {sessionAccuracy}%</Text>
          <Text style={styles.summaryLabel}>Cards waiting for review: {mistakeCount}</Text>
          <Text style={styles.summaryNote}>Every answer helps you remember the next one faster.</Text>
        </InfoCard>
        <View style={styles.summaryActions}>
          <PrimaryButton title="Try Another Round" onPress={handleRestartQuiz} />
        </View>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <GradientHeader
        title="Quiz"
        left={<TopIconButton icon="chevron-back" label="Back" variant="ghost" onPress={() => navigation.goBack()} />}
        right={<TopIconButton icon="volume-high-outline" label="Audio" variant="ghost" onPress={handleSpeakKorean} />}
        minHeight={260}
      >
        <View style={styles.badgeRow}>
          <Text style={styles.difficultyBadge}>{selectedQuizDifficulty}</Text>
          <Text style={styles.scopeBadge}>{selectedQuizScope}</Text>
          <Text style={styles.scopeBadge}>{selectedStudyMode}</Text>
          <Text style={styles.scopeBadge}>
            {selectedPartOfSpeech === 'All' ? currentCard.partOfSpeech : selectedPartOfSpeech}
          </Text>
        </View>
        <Animated.View
          style={[
            styles.promptShell,
            {
              opacity: fadeAnim,
              transform: [{ translateY: liftAnim }],
            },
          ]}
        >
          <Text style={styles.progress}>
            Question {currentIndex + 1} / {quizFlashcards.length}
          </Text>
          <Text style={styles.promptText}>{currentCard.korean}</Text>
        </Animated.View>
      </GradientHeader>

      <View style={styles.options}>
        {options.map((option) => (
          <PrimaryButton
            key={option}
            title={option}
            variant="secondary"
            onPress={() => handleAnswer(option)}
          />
        ))}
      </View>

      {feedback ? (
        <InfoCard>
          <Text style={styles.feedback}>{feedback}</Text>
          {example ? (
            <View style={styles.exampleCard}>
              <Text style={styles.exampleTitle}>Example sentence</Text>
              <Text style={styles.exampleSentence}>{example.sentence}</Text>
              <Text style={styles.exampleHint}>{example.hint}</Text>
            </View>
          ) : null}
          <View style={styles.feedbackAction}>
            <PrimaryButton title="Hear Answer" variant="secondary" onPress={handleSpeakEnglish} />
          </View>
        </InfoCard>
      ) : null}
    </AppShell>
  );
}

const styles = StyleSheet.create({
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 14,
  },
  difficultyBadge: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.secondaryDark,
    backgroundColor: colors.secondary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  scopeBadge: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.white,
    backgroundColor: 'rgba(255,255,255,0.18)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  promptShell: {
    backgroundColor: colors.white,
    borderRadius: tokens.radius.panelMd,
    padding: tokens.spacing.lg,
    marginTop: tokens.spacing.md,
    ...tokens.shadow.card,
  },
  progress: {
    fontSize: tokens.type.caption,
    color: colors.textSoft,
    marginBottom: 8,
  },
  promptText: {
    fontSize: 34,
    lineHeight: 42,
    fontWeight: '800',
    color: colors.text,
  },
  options: {
    marginTop: tokens.spacing.lg,
  },
  feedback: {
    fontSize: 16,
    color: colors.mintDark,
    textAlign: 'center',
    lineHeight: 24,
    backgroundColor: colors.mint,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  feedbackAction: {
    marginTop: 10,
  },
  exampleCard: {
    marginTop: 10,
    backgroundColor: colors.cardAlt,
    borderRadius: 18,
    padding: 14,
  },
  exampleTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primaryDark,
    marginBottom: 6,
    textAlign: 'center',
  },
  exampleSentence: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 6,
  },
  exampleHint: {
    fontSize: 13,
    lineHeight: 18,
    color: colors.textSoft,
    textAlign: 'center',
  },
  summaryValue: {
    fontSize: 40,
    fontWeight: '700',
    color: colors.primaryDark,
    marginBottom: 8,
    textAlign: 'center',
  },
  summaryLabel: {
    fontSize: 16,
    color: colors.primaryDark,
    marginTop: 12,
    textAlign: 'center',
  },
  summaryNote: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.textSoft,
    textAlign: 'center',
    marginTop: 10,
  },
  summaryActions: {
    marginTop: 24,
  },
});
