import { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import PrimaryButton from '../components/PrimaryButton';
import ScreenContainer from '../components/ScreenContainer';
import { useFlashcards } from '../context/FlashcardContext';
import colors from '../theme/colors';
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

export default function QuizScreen() {
  const { flashcards, saveQuizResult } = useFlashcards();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [sessionResults, setSessionResults] = useState([]);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const liftAnim = useRef(new Animated.Value(12)).current;

  const currentCard = flashcards[currentIndex];
  const isFinished = currentIndex >= flashcards.length;

  const options = useMemo(() => {
    if (!currentCard) {
      return [];
    }

    const incorrectAnswers = shuffleItems(
      flashcards
        .filter((card) => card.id !== currentCard.id)
        .map((card) => card.english)
    ).slice(0, 3);

    return shuffleItems([currentCard.english, ...incorrectAnswers]);
  }, [currentCard, flashcards]);

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
    saveQuizResult(isCorrect);
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

  const sessionCorrectCount = sessionResults.filter(Boolean).length;
  const sessionAccuracy = sessionResults.length
    ? Math.round((sessionCorrectCount / sessionResults.length) * 100)
    : 0;

  if (isFinished) {
    return (
      <ScreenContainer>
        <View style={styles.centered}>
          <Text style={styles.title}>Quiz complete</Text>
          <Text style={styles.summaryValue}>
            {sessionCorrectCount} / {flashcards.length}
          </Text>
          <Text style={styles.subtitle}>Great effort this round</Text>
          <Text style={styles.summaryLabel}>Accuracy: {sessionAccuracy}%</Text>
          <Text style={styles.summaryNote}>
            Every answer helps you remember the next one faster.
          </Text>
          <View style={styles.summaryActions}>
            <PrimaryButton title="Try Another Round" onPress={handleRestartQuiz} />
          </View>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <Text style={styles.progress}>
        Question {currentIndex + 1} / {flashcards.length}
      </Text>
      <Text style={styles.title}>Pick the best match</Text>
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ translateY: liftAnim }],
        }}
      >
        <View style={styles.promptCard}>
          <Text style={styles.promptText}>{currentCard.korean}</Text>
          <View style={styles.promptActions}>
            <PrimaryButton title="Hear Korean" variant="secondary" onPress={handleSpeakKorean} />
          </View>
        </View>
      </Animated.View>

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
        <View>
          <Text style={styles.feedback}>{feedback}</Text>
          <View style={styles.feedbackAction}>
            <PrimaryButton title="Hear Answer" variant="secondary" onPress={handleSpeakEnglish} />
          </View>
        </View>
      ) : null}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 20,
  },
  progress: {
    fontSize: 14,
    color: colors.textSoft,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSoft,
    textAlign: 'center',
  },
  summaryValue: {
    fontSize: 40,
    fontWeight: '700',
    color: colors.primaryDark,
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 16,
    color: colors.primaryDark,
    marginTop: 12,
  },
  summaryNote: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.textSoft,
    textAlign: 'center',
    marginTop: 10,
  },
  summaryActions: {
    width: '100%',
    marginTop: 24,
  },
  promptCard: {
    backgroundColor: colors.card,
    borderRadius: 24,
    padding: 30,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 2,
    borderColor: colors.backgroundAccent,
  },
  promptText: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text,
  },
  promptActions: {
    width: '100%',
    marginTop: 18,
  },
  options: {
    marginBottom: 20,
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
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
});
