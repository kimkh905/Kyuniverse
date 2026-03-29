import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { flashcards, levels } from '../data/flashcards';

const FlashcardContext = createContext(null);
const STORAGE_KEY = 'flashcard-progress';

export function FlashcardProvider({ children }) {
  const [knownCardIds, setKnownCardIds] = useState([]);
  const [quizResults, setQuizResults] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadProgress = async () => {
      try {
        const savedProgress = await AsyncStorage.getItem(STORAGE_KEY);

        if (!savedProgress || !isMounted) {
          return;
        }

        const parsedProgress = JSON.parse(savedProgress);

        if (Array.isArray(parsedProgress.knownCardIds)) {
          setKnownCardIds(parsedProgress.knownCardIds);
        }

        if (Array.isArray(parsedProgress.quizResults)) {
          setQuizResults(parsedProgress.quizResults);
        }

        if (typeof parsedProgress.selectedLevel === 'string') {
          setSelectedLevel(parsedProgress.selectedLevel);
        }
      } catch (error) {
        console.warn('Failed to load flashcard progress', error);
      } finally {
        if (isMounted) {
          setIsHydrated(true);
        }
      }
    };

    loadProgress();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    const persistProgress = async () => {
      try {
        await AsyncStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            knownCardIds,
            quizResults,
            selectedLevel,
          })
        );
      } catch (error) {
        console.warn('Failed to save flashcard progress', error);
      }
    };

    persistProgress();
  }, [isHydrated, knownCardIds, quizResults, selectedLevel]);

  const filteredFlashcards =
    selectedLevel === 'All'
      ? flashcards
      : flashcards.filter((card) => card.level === selectedLevel);

  const levelKnownCount = filteredFlashcards.filter((card) =>
    knownCardIds.includes(card.id)
  ).length;

  const markCardKnown = (cardId) => {
    setKnownCardIds((currentIds) => {
      if (currentIds.includes(cardId)) {
        return currentIds;
      }

      return [...currentIds, cardId];
    });
  };

  const saveQuizResult = (isCorrect) => {
    setQuizResults((currentResults) => [...currentResults, isCorrect]);
  };

  const resetProgress = () => {
    setKnownCardIds([]);
    setQuizResults([]);
  };

  const changeLevel = (level) => {
    setSelectedLevel(level);
  };

  const value = useMemo(
    () => ({
      flashcards: filteredFlashcards,
      allFlashcards: flashcards,
      levels,
      selectedLevel,
      knownCardIds,
      quizResults,
      levelKnownCount,
      isHydrated,
      markCardKnown,
      saveQuizResult,
      resetProgress,
      changeLevel,
    }),
    [filteredFlashcards, isHydrated, knownCardIds, levelKnownCount, quizResults, selectedLevel]
  );

  return (
    <FlashcardContext.Provider value={value}>
      {children}
    </FlashcardContext.Provider>
  );
}

export function useFlashcards() {
  const context = useContext(FlashcardContext);

  if (!context) {
    throw new Error('useFlashcards must be used within a FlashcardProvider');
  }

  return context;
}
