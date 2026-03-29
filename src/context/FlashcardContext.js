import { createContext, useContext, useMemo, useState } from 'react';
import { flashcards } from '../data/flashcards';

const FlashcardContext = createContext(null);

export function FlashcardProvider({ children }) {
  const [knownCardIds, setKnownCardIds] = useState([]);
  const [quizResults, setQuizResults] = useState([]);

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

  const value = useMemo(
    () => ({
      flashcards,
      knownCardIds,
      quizResults,
      markCardKnown,
      saveQuizResult,
      resetProgress,
    }),
    [knownCardIds, quizResults]
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
