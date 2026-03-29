import { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import PrimaryButton from '../components/PrimaryButton';
import ScreenContainer from '../components/ScreenContainer';
import { useFlashcards } from '../context/FlashcardContext';

const ANSWER_OPTIONS = [
  'Hello',
  'Thank you',
  'Love',
  'School',
  'Friend',
  'Water',
];

export default function QuizScreen() {
  const { flashcards, saveQuizResult } = useFlashcards();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [feedback, setFeedback] = useState('');

  const currentCard = flashcards[currentIndex];
  const isFinished = currentIndex >= flashcards.length;

  const options = useMemo(() => {
    if (!currentCard) {
      return [];
    }

    const filtered = ANSWER_OPTIONS.filter((option) => option !== currentCard.english).slice(0, 2);
    return [currentCard.english, ...filtered].sort();
  }, [currentCard]);

  const handleAnswer = (selectedAnswer) => {
    const isCorrect = selectedAnswer === currentCard.english;
    saveQuizResult(isCorrect);
    setFeedback(isCorrect ? 'Correct' : `Not quite. Answer: ${currentCard.english}`);

    setTimeout(() => {
      setFeedback('');
      setCurrentIndex((current) => current + 1);
    }, 700);
  };

  if (isFinished) {
    return (
      <ScreenContainer>
        <View style={styles.centered}>
          <Text style={styles.title}>Quiz complete</Text>
          <Text style={styles.subtitle}>You have gone through all local flashcards.</Text>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <Text style={styles.title}>What does this mean?</Text>
      <View style={styles.promptCard}>
        <Text style={styles.promptText}>{currentCard.korean}</Text>
      </View>

      <View style={styles.options}>
        {options.map((option) => (
          <PrimaryButton key={option} title={option} variant="secondary" onPress={() => handleAnswer(option)} />
        ))}
      </View>

      {feedback ? <Text style={styles.feedback}>{feedback}</Text> : null}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#475569',
    textAlign: 'center',
  },
  promptCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    marginBottom: 24,
  },
  promptText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1e293b',
  },
  options: {
    marginBottom: 20,
  },
  feedback: {
    fontSize: 16,
    color: '#2563eb',
    textAlign: 'center',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
