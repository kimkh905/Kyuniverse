import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import PrimaryButton from '../components/PrimaryButton';
import ScreenContainer from '../components/ScreenContainer';
import { useFlashcards } from '../context/FlashcardContext';

export default function FlashcardScreen() {
  const { flashcards, markCardKnown } = useFlashcards();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showEnglish, setShowEnglish] = useState(false);

  const currentCard = flashcards[currentIndex];
  const isLastCard = currentIndex === flashcards.length - 1;

  const progressLabel = useMemo(
    () => `${currentIndex + 1} / ${flashcards.length}`,
    [currentIndex, flashcards.length]
  );

  const handleNext = () => {
    setShowEnglish(false);
    setCurrentIndex((current) => (current + 1) % flashcards.length);
  };

  const handleMarkKnown = () => {
    markCardKnown(currentCard.id);
    handleNext();
  };

  return (
    <ScreenContainer scroll={false}>
      <Text style={styles.progress}>{progressLabel}</Text>

      <Pressable style={styles.card} onPress={() => setShowEnglish((current) => !current)}>
        <Text style={styles.direction}>{showEnglish ? 'English' : 'Korean'}</Text>
        <Text style={styles.word}>{showEnglish ? currentCard.english : currentCard.korean}</Text>
        <Text style={styles.hint}>Tap the card to flip</Text>
      </Pressable>

      <View style={styles.actions}>
        <PrimaryButton title="I Know This" onPress={handleMarkKnown} />
        <PrimaryButton
          title={isLastCard ? 'Start Again' : 'Next Card'}
          variant="secondary"
          onPress={handleNext}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  progress: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 16,
  },
  card: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  direction: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 12,
  },
  word: {
    fontSize: 34,
    fontWeight: '700',
    color: '#0f172a',
    textAlign: 'center',
    marginBottom: 12,
  },
  hint: {
    fontSize: 14,
    color: '#94a3b8',
  },
  actions: {
    marginTop: 'auto',
  },
});
