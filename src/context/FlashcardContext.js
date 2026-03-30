import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { flashcards, levels, partsOfSpeech } from '../data/flashcards';

const FlashcardContext = createContext(null);
const STORAGE_KEY = 'flashcard-progress';
const DEFAULT_DAILY_GOAL = 5;
const quizDifficulties = ['Easy', 'Medium', 'Hard'];
const quizScopes = ['Current Filters', 'Word Type Only'];

function getTodayKey() {
  return new Date().toISOString().slice(0, 10);
}

function getDateKeyDaysAgo(daysAgo) {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().slice(0, 10);
}

function calculateStreak(activityByDate) {
  let streak = 0;

  for (let daysAgo = 0; ; daysAgo += 1) {
    const dateKey = getDateKeyDaysAgo(daysAgo);

    if ((activityByDate[dateKey] ?? 0) <= 0) {
      break;
    }

    streak += 1;
  }

  return streak;
}

export function FlashcardProvider({ children }) {
  const [knownCardIds, setKnownCardIds] = useState([]);
  const [quizResults, setQuizResults] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [selectedPartOfSpeech, setSelectedPartOfSpeech] = useState('All');
  const [selectedQuizDifficulty, setSelectedQuizDifficulty] = useState('Easy');
  const [selectedQuizScope, setSelectedQuizScope] = useState('Current Filters');
  const [dailyGoal] = useState(DEFAULT_DAILY_GOAL);
  const [activityByDate, setActivityByDate] = useState({});
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

        if (typeof parsedProgress.selectedPartOfSpeech === 'string') {
          setSelectedPartOfSpeech(parsedProgress.selectedPartOfSpeech);
        }

        if (
          typeof parsedProgress.selectedQuizDifficulty === 'string' &&
          quizDifficulties.includes(parsedProgress.selectedQuizDifficulty)
        ) {
          setSelectedQuizDifficulty(parsedProgress.selectedQuizDifficulty);
        }

        if (
          typeof parsedProgress.selectedQuizScope === 'string' &&
          quizScopes.includes(parsedProgress.selectedQuizScope)
        ) {
          setSelectedQuizScope(parsedProgress.selectedQuizScope);
        }

        if (
          parsedProgress.activityByDate &&
          typeof parsedProgress.activityByDate === 'object' &&
          !Array.isArray(parsedProgress.activityByDate)
        ) {
          setActivityByDate(parsedProgress.activityByDate);
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
            selectedPartOfSpeech,
            selectedQuizDifficulty,
            selectedQuizScope,
            activityByDate,
          })
        );
      } catch (error) {
        console.warn('Failed to save flashcard progress', error);
      }
    };

    persistProgress();
  }, [
    activityByDate,
    isHydrated,
    knownCardIds,
    quizResults,
    selectedLevel,
    selectedPartOfSpeech,
    selectedQuizDifficulty,
    selectedQuizScope,
  ]);

  const filteredByLevel =
    selectedLevel === 'All' ? flashcards : flashcards.filter((card) => card.level === selectedLevel);

  const filteredFlashcards =
    selectedPartOfSpeech === 'All'
      ? filteredByLevel
      : filteredByLevel.filter((card) => card.partOfSpeech === selectedPartOfSpeech);

  const quizFlashcards =
    selectedQuizScope === 'Word Type Only'
      ? selectedPartOfSpeech === 'All'
        ? flashcards
        : flashcards.filter((card) => card.partOfSpeech === selectedPartOfSpeech)
      : filteredFlashcards;

  const levelKnownCount = filteredFlashcards.filter((card) => knownCardIds.includes(card.id)).length;

  const trackDailyActivity = () => {
    const todayKey = getTodayKey();

    setActivityByDate((currentActivity) => ({
      ...currentActivity,
      [todayKey]: (currentActivity[todayKey] ?? 0) + 1,
    }));
  };

  const markCardKnown = (cardId) => {
    trackDailyActivity();

    setKnownCardIds((currentIds) => {
      if (currentIds.includes(cardId)) {
        return currentIds;
      }

      return [...currentIds, cardId];
    });
  };

  const saveQuizResult = (isCorrect) => {
    trackDailyActivity();
    setQuizResults((currentResults) => [...currentResults, isCorrect]);
  };

  const resetProgress = () => {
    setKnownCardIds([]);
    setQuizResults([]);
    setActivityByDate({});
  };

  const changeLevel = (level) => {
    setSelectedLevel(level);
  };

  const changePartOfSpeech = (partOfSpeech) => {
    setSelectedPartOfSpeech(partOfSpeech);
  };

  const changeQuizDifficulty = (difficulty) => {
    setSelectedQuizDifficulty(difficulty);
  };

  const changeQuizScope = (scope) => {
    setSelectedQuizScope(scope);
  };

  const todayKey = getTodayKey();
  const todayProgress = activityByDate[todayKey] ?? 0;
  const dailyGoalProgress = Math.min(todayProgress, dailyGoal);
  const streakCount = calculateStreak(activityByDate);
  const isDailyGoalComplete = todayProgress >= dailyGoal;

  const value = useMemo(
    () => ({
      flashcards: filteredFlashcards,
      quizFlashcards,
      allFlashcards: flashcards,
      levels,
      partsOfSpeech,
      selectedLevel,
      selectedPartOfSpeech,
      quizDifficulties,
      selectedQuizDifficulty,
      quizScopes,
      selectedQuizScope,
      knownCardIds,
      quizResults,
      levelKnownCount,
      dailyGoal,
      todayProgress,
      dailyGoalProgress,
      streakCount,
      isDailyGoalComplete,
      isHydrated,
      markCardKnown,
      saveQuizResult,
      resetProgress,
      changeLevel,
      changePartOfSpeech,
      changeQuizDifficulty,
      changeQuizScope,
    }),
    [
      dailyGoal,
      dailyGoalProgress,
      filteredFlashcards,
      isDailyGoalComplete,
      isHydrated,
      knownCardIds,
      levelKnownCount,
      quizFlashcards,
      quizResults,
      selectedLevel,
      selectedPartOfSpeech,
      selectedQuizDifficulty,
      selectedQuizScope,
      streakCount,
      todayProgress,
    ]
  );

  return <FlashcardContext.Provider value={value}>{children}</FlashcardContext.Provider>;
}

export function useFlashcards() {
  const context = useContext(FlashcardContext);

  if (!context) {
    throw new Error('useFlashcards must be used within a FlashcardProvider');
  }

  return context;
}
