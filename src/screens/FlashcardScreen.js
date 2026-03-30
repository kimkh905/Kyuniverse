import { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
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
  const { flashcards, markCardKnown, selectedPartOfSpeech } = useFlashcards();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showEnglish, setShowEnglish] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const scaleAnim = useRef(new Animated.Value(0.96)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredCards = useMemo(() => {
    if (!normalizedQuery) {
      return flashcards;
    }

    return flashcards.filter(
      (card) =>
        card.korean.includes(searchQuery.trim()) ||
        card.english.toLowerCase().includes(normalizedQuery) ||
        card.partOfSpeech.toLowerCase().includes(normalizedQuery)
    );
  }, [flashcards, normalizedQuery, searchQuery]);

  const [cardOrder, setCardOrder] = useState(() => createDefaultOrder(filteredCards.length));

  const activeCardIndex = cardOrder[currentIndex];
  const currentCard = filteredCards[activeCardIndex];
  const isLastCard = currentIndex === cardOrder.length - 1;

  const progressLabel = useMemo(
    () => `${currentIndex + 1} / ${cardOrder.length}`,
    [cardOrder.length, currentIndex]
  );

  useEffect(() => {
    const currentCardId = currentCard?.id;
    const nextOrder = isShuffled
      ? createShuffledOrder(filteredCards.length, 0)
      : createDefaultOrder(filteredCards.length);

    if (!filteredCards.length) {
      setCurrentIndex(0);
      setShowEnglish(false);
      setCardOrder(nextOrder);
      return;
    }

    const nextPinnedIndex = currentCardId
      ? filteredCards.findIndex((card) => card.id === currentCardId)
      : 0;

    setCurrentIndex(0);
    setShowEnglish(false);
    setCardOrder(
      isShuffled
        ? createShuffledOrder(filteredCards.length, Math.max(nextPinnedIndex, 0))
        : createDefaultOrder(filteredCards.length)
    );
  }, [currentCard?.id, filteredCards, isShuffled]);

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
      setCardOrder(createDefaultOrder(filteredCards.length));
      setCurrentIndex(activeCardIndex);
      setIsShuffled(false);
      return;
    }

    setCardOrder(createShuffledOrder(filteredCards.length, activeCardIndex));
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

  if (!flashcards.length) {
    return (
      <ScreenContainer>
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No cards match this filter yet</Text>
          <Text style={styles.emptyText}>Try a different level or word type from the home screen.</Text>
        </View>
      </ScreenContainer>
    );
  }

  if (!filteredCards.length) {
    return (
      <ScreenContainer>
        <View style={styles.searchPanel}>
          <Text style={styles.searchLabel}>Search your current flashcards</Text>
          <View style={styles.searchInputWrap}>
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Try Korean, English, or word type"
              placeholderTextColor={colors.textSoft}
              style={styles.searchInput}
            />
            <Pressable onPress={() => setSearchQuery('')} style={styles.clearButton}>
              <Text style={styles.clearLabel}>Clear</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No cards matched that search</Text>
          <Text style={styles.emptyText}>Try a shorter word or clear the search to keep studying.</Text>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scroll={false}>
      <View style={styles.searchPanel}>
        <Text style={styles.searchLabel}>Search your current flashcards</Text>
        <View style={styles.searchInputWrap}>
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Try Korean, English, or word type"
            placeholderTextColor={colors.textSoft}
            style={styles.searchInput}
          />
          {searchQuery ? (
            <Pressable onPress={() => setSearchQuery('')} style={styles.clearButton}>
              <Text style={styles.clearLabel}>Clear</Text>
            </Pressable>
          ) : null}
        </View>
        <Text style={styles.searchMeta}>
          {filteredCards.length} card{filteredCards.length === 1 ? '' : 's'} ready in {selectedPartOfSpeech}.
        </Text>
      </View>

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

      <Text style={styles.typeBadge}>
        {selectedPartOfSpeech === 'All' ? currentCard.partOfSpeech : selectedPartOfSpeech}
      </Text>

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

      <View style={styles.browserSection}>
        <Text style={styles.browserTitle}>Jump to a word</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.browserRow}>
          {filteredCards.map((card, index) => {
            const isActive = index === activeCardIndex;

            return (
              <Pressable
                key={card.id}
                onPress={() => {
                  setCurrentIndex(cardOrder.indexOf(index));
                  setShowEnglish(false);
                }}
                style={({ pressed }) => [
                  styles.wordChip,
                  isActive && styles.wordChipActive,
                  pressed && styles.controlPressed,
                ]}
              >
                <Text style={[styles.wordChipLabel, isActive && styles.wordChipLabelActive]}>
                  {card.korean}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  searchPanel: {
    backgroundColor: colors.cardAlt,
    borderRadius: 24,
    padding: 16,
    marginBottom: 14,
  },
  searchLabel: {
    fontSize: 14,
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
  clearButton: {
    borderRadius: 999,
    backgroundColor: colors.lavender,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  clearLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
  },
  searchMeta: {
    marginTop: 10,
    fontSize: 13,
    color: colors.textSoft,
  },
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
  typeBadge: {
    alignSelf: 'flex-start',
    fontSize: 13,
    fontWeight: '700',
    color: colors.secondaryDark,
    backgroundColor: colors.secondary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    marginBottom: 14,
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
  browserSection: {
    marginTop: 14,
  },
  browserTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 10,
  },
  browserRow: {
    paddingRight: 6,
    gap: 10,
  },
  wordChip: {
    borderRadius: 999,
    backgroundColor: colors.cardAlt,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: colors.backgroundAccent,
  },
  wordChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  wordChipLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  wordChipLabelActive: {
    color: colors.white,
  },
  controlPressed: {
    opacity: 0.85,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 10,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.textSoft,
    textAlign: 'center',
  },
});
