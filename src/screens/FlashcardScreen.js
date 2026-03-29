import { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import PrimaryButton from '../components/PrimaryButton';
import ScreenContainer from '../components/ScreenContainer';
import { useFlashcards } from '../context/FlashcardContext';
import colors from '../theme/colors';
import { speakText } from '../utils/pronunciation';

function createDefaultOrder(length) {
  return Array.from({ length }, (_, index) => index);
}

function createShuffledOrder(length, pinnedIndex) {
  const remainingIndexes = createDefaultOrder(length).filter((index) => index !== pinnedIndex);

  for (let index = remainingIndexes.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [remainingIndexes[index], remainingIndexes[swapIndex]] = [
      remainingIndexes[swapIndex],
      remainingIndexes[index],
    ];
  }

  return [pinnedIndex, ...remainingIndexes];
}

export default function FlashcardScreen() {
  const { flashcards, markCardKnown } = useFlashcards();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showEnglish, setShowEnglish] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [cardOrder, setCardOrder] = useState(() => createDefaultOrder(flashcards.length));
  const scaleAnim = useRef(new Animated.Value(0.96)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const activeCardIndex = cardOrder[currentIndex];
  const currentCard = flashcards[activeCardIndex];
  const isLastCard = currentIndex === cardOrder.length - 1;

  const progressLabel = useMemo(
    () => `${currentIndex + 1} / ${cardOrder.length}`,
    [cardOrder.length, currentIndex]
  );

  useEffect(() => {
    fadeAnim.setValue(0);
    scaleAnim.setValue(0.96);

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, [currentIndex, showEnglish, fadeAnim, scaleAnim]);

  const handleNext = () => {
    setShowEnglish(false);
    setCurrentIndex((current) => (current + 1) % cardOrder.length);
  };

  const handlePrevious = () => {
    setShowEnglish(false);
    setCurrentIndex((current) => (current - 1 + cardOrder.length) % cardOrder.length);
  };

  const handleMarkKnown = () => {
    markCardKnown(currentCard.id);
    handleNext();
  };

  const toggleShuffle = () => {
    setShowEnglish(false);

    if (isShuffled) {
      setCardOrder(createDefaultOrder(flashcards.length));
      setCurrentIndex(activeCardIndex);
      setIsShuffled(false);
      return;
    }

    setCardOrder(createShuffledOrder(flashcards.length, activeCardIndex));
    setCurrentIndex(0);
    setIsShuffled(true);
  };

  const handleSpeakCurrent = () => {
    if (showEnglish) {
      speakText(currentCard.english, 'en-US');
      return;
    }

    speakText(currentCard.korean, 'ko-KR');
  };

  return (
    <ScreenContainer scroll={false}>
      <View style={styles.headerRow}>
        <Text style={styles.progress}>{progressLabel}</Text>
        <Pressable
          onPress={toggleShuffle}
          style={({ pressed }) => [
            styles.shuffleButton,
            isShuffled && styles.shuffleButtonActive,
            pressed && styles.controlPressed,
          ]}
        >
          <Text style={[styles.shuffleLabel, isShuffled && styles.shuffleLabelActive]}>
            {isShuffled ? 'Shuffle On' : 'Shuffle'}
          </Text>
        </Pressable>
      </View>

      <Animated.View style={{ flex: 1, opacity: fadeAnim, transform: [{ scale: scaleAnim }] }}>
        <Pressable style={styles.card} onPress={() => setShowEnglish((current) => !current)}>
          <Text style={styles.direction}>{showEnglish ? 'English' : 'Korean'}</Text>
          <Text style={styles.word}>{showEnglish ? currentCard.english : currentCard.korean}</Text>
          <Text style={styles.hint}>Tap to flip and keep going</Text>
          <Pressable onPress={handleSpeakCurrent} style={styles.speakButton}>
            <Text style={styles.speakLabel}>Hear it</Text>
          </Pressable>
        </Pressable>
      </Animated.View>

      <View style={styles.navigationRow}>
        <Pressable
          onPress={handlePrevious}
          style={({ pressed }) => [styles.navButton, pressed && styles.controlPressed]}
        >
          <Text style={styles.navLabel}>Previous</Text>
        </Pressable>
        <Pressable
          onPress={handleNext}
          style={({ pressed }) => [styles.navButton, pressed && styles.controlPressed]}
        >
          <Text style={styles.navLabel}>{isLastCard ? 'Start Again' : 'Next'}</Text>
        </Pressable>
      </View>

      <View style={styles.actions}>
        <PrimaryButton title="I Know This" onPress={handleMarkKnown} />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  progress: {
    fontSize: 14,
    color: colors.textSoft,
  },
  shuffleButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: colors.lavender,
  },
  shuffleButtonActive: {
    backgroundColor: colors.secondary,
  },
  shuffleLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
  },
  shuffleLabelActive: {
    color: colors.secondaryDark,
  },
  card: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 28,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: colors.backgroundAccent,
  },
  direction: {
    fontSize: 16,
    color: colors.textSoft,
    marginBottom: 12,
  },
  word: {
    fontSize: 34,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 12,
  },
  hint: {
    fontSize: 14,
    color: colors.primaryDark,
    textAlign: 'center',
  },
  speakButton: {
    marginTop: 16,
    borderRadius: 999,
    backgroundColor: colors.secondary,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  speakLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.secondaryDark,
  },
  navigationRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  navButton: {
    flex: 1,
    borderRadius: 18,
    backgroundColor: colors.cardAlt,
    paddingVertical: 14,
    alignItems: 'center',
  },
  navLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  actions: {
    marginTop: 'auto',
  },
  controlPressed: {
    opacity: 0.85,
  },
});
