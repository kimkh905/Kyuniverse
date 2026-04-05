import { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import AppShell from '../components/AppShell';
import Flashcard from '../components/Flashcard';
import GradientHeader from '../components/GradientHeader';
import TopIconButton from '../components/TopIconButton';
import { useFlashcards } from '../context/FlashcardContext';
import colors from '../theme/colors';
import tokens from '../theme/tokens';
import { speakText } from '../utils/pronunciation';

export default function FlashcardScreen({ navigation }) {
  const { flashcards, selectedLevel, markCardKnown, rememberStudyScreen } = useFlashcards();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const riseAnim = useRef(new Animated.Value(16)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const cardScale = useRef(new Animated.Value(1)).current;

  const currentCard = flashcards[currentIndex];

  useEffect(() => {
    rememberStudyScreen('Flashcards');
  }, [rememberStudyScreen]);

  useEffect(() => {
    fadeAnim.setValue(0);
    riseAnim.setValue(16);

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(riseAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.spring(cardScale, {
        toValue: showAnswer ? 1.02 : 1,
        useNativeDriver: true,
        friction: 8,
      }),
    ]).start();
  }, [cardScale, currentIndex, showAnswer, fadeAnim, riseAnim]);

  const handleReveal = () => {
    if (!showAnswer) {
      setShowAnswer(true);
      return;
    }

    markCardKnown(currentCard.id);
    setShowAnswer(false);
    setCurrentIndex((value) => (value + 1) % flashcards.length);
  };

  if (!flashcards.length) {
    return (
      <AppShell>
        <View style={styles.emptyScreen}>
          <Text style={styles.emptyTitle}>This deck has no cards yet</Text>
          <Pressable style={styles.emptyButton} onPress={() => navigation.goBack()}>
            <Text style={styles.emptyButtonLabel}>Back to Deck</Text>
          </Pressable>
        </View>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <View style={styles.screen}>
        <GradientHeader
          title={selectedLevel === 'All' ? 'Flashcards' : selectedLevel}
          left={<TopIconButton icon="chevron-back" label="Back" variant="ghost" onPress={() => navigation.goBack()} />}
          right={
            <TopIconButton
              icon="volume-high-outline"
              label="Audio"
              variant="ghost"
              onPress={() =>
                speakText(
                  showAnswer ? currentCard.english : currentCard.korean,
                  showAnswer ? 'en-US' : 'ko-KR'
                )
              }
            />
          }
          minHeight="100%"
        >
          <Flashcard
            animatedStyle={{
              opacity: fadeAnim,
              transform: [{ translateY: riseAnim }, { scale: cardScale }],
            }}
            questionNumber={`${currentIndex + 1} / ${flashcards.length}`}
            text={showAnswer ? currentCard.english : currentCard.korean}
            hint={
              showAnswer
                ? 'Nice work. Read it once more and keep moving.'
                : 'Pause, think, and reveal when ready.'
            }
          />
        </GradientHeader>

        <Pressable style={({ pressed }) => [styles.bottomCTA, pressed && styles.pressed]} onPress={handleReveal}>
          <Text style={styles.bottomCTALabel}>{showAnswer ? 'Next Card' : 'Reveal Answer'}</Text>
        </Pressable>
      </View>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  bottomCTA: {
    marginTop: -10,
    backgroundColor: colors.secondaryDark,
    borderRadius: 0,
    paddingVertical: 22,
    alignItems: 'center',
  },
  bottomCTALabel: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.white,
  },
  emptyScreen: {
    flex: 1,
    borderRadius: tokens.radius.panel,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  emptyTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.white,
  },
  emptyButton: {
    borderRadius: tokens.radius.button,
    backgroundColor: colors.secondaryDark,
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  emptyButtonLabel: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.white,
  },
  pressed: {
    opacity: 0.86,
  },
});
