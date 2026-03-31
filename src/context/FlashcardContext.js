import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { flashcards, levels, partsOfSpeech } from '../data/flashcards';

const FlashcardContext = createContext(null);
const STORAGE_KEY = 'flashcard-progress';
const DEFAULT_DAILY_GOAL = 5;
const DEFAULT_GOAL_TARGET = 20;
const quizDifficulties = ['Easy', 'Medium', 'Hard'];
const quizScopes = ['Current Filters', 'Word Type Only'];
const goalTargets = [10, 20, 30, 50];

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
  const [favoriteCardIds, setFavoriteCardIds] = useState([]);
  const [quizResults, setQuizResults] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [selectedPartOfSpeech, setSelectedPartOfSpeech] = useState('All');
  const [selectedQuizDifficulty, setSelectedQuizDifficulty] = useState('Easy');
  const [selectedQuizScope, setSelectedQuizScope] = useState('Current Filters');
  const [dailyGoal] = useState(DEFAULT_DAILY_GOAL);
  const [selectedGoalTarget, setSelectedGoalTarget] = useState(DEFAULT_GOAL_TARGET);
  const [reminderEnabled, setReminderEnabled] = useState(false);
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

        if (Array.isArray(parsedProgress.favoriteCardIds)) {
          setFavoriteCardIds(parsedProgress.favoriteCardIds);
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
          typeof parsedProgress.selectedGoalTarget === 'number' &&
          goalTargets.includes(parsedProgress.selectedGoalTarget)
        ) {
          setSelectedGoalTarget(parsedProgress.selectedGoalTarget);
        }

        if (typeof parsedProgress.reminderEnabled === 'boolean') {
          setReminderEnabled(parsedProgress.reminderEnabled);
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
            favoriteCardIds,
            quizResults,
            selectedLevel,
            selectedPartOfSpeech,
            selectedQuizDifficulty,
            selectedQuizScope,
            selectedGoalTarget,
            reminderEnabled,
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
    favoriteCardIds,
    isHydrated,
    knownCardIds,
    reminderEnabled,
    quizResults,
    selectedGoalTarget,
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
  const favoriteCount = filteredFlashcards.filter((card) => favoriteCardIds.includes(card.id)).length;
  const goalProgressCount = Math.min(knownCardIds.length, selectedGoalTarget);
  const remainingGoalCount = Math.max(selectedGoalTarget - knownCardIds.length, 0);
  const isGoalComplete = knownCardIds.length >= selectedGoalTarget;

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

  const toggleFavoriteCard = (cardId) => {
    setFavoriteCardIds((currentIds) =>
      currentIds.includes(cardId)
        ? currentIds.filter((currentId) => currentId !== cardId)
        : [...currentIds, cardId]
    );
  };

  const resetProgress = () => {
    setKnownCardIds([]);
    setFavoriteCardIds([]);
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

  const changeGoalTarget = (goalTarget) => {
    setSelectedGoalTarget(goalTarget);
  };

  const changeReminderEnabled = (enabled) => {
    setReminderEnabled(enabled);
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
      goalTargets,
      selectedGoalTarget,
      goalProgressCount,
      remainingGoalCount,
      isGoalComplete,
      reminderEnabled,
      knownCardIds,
      favoriteCardIds,
      favoriteCount,
      quizResults,
      levelKnownCount,
      dailyGoal,
      todayProgress,
      dailyGoalProgress,
      streakCount,
      isDailyGoalComplete,
      isHydrated,
      markCardKnown,
      toggleFavoriteCard,
      saveQuizResult,
      resetProgress,
      changeLevel,
      changePartOfSpeech,
      changeQuizDifficulty,
      changeQuizScope,
      changeGoalTarget,
      changeReminderEnabled,
    }),
    [
      dailyGoal,
      dailyGoalProgress,
      filteredFlashcards,
      favoriteCardIds,
      favoriteCount,
      goalProgressCount,
      goalTargets,
      isDailyGoalComplete,
      isGoalComplete,
      isHydrated,
      knownCardIds,
      levelKnownCount,
      quizFlashcards,
      quizResults,
      remainingGoalCount,
      reminderEnabled,
      selectedGoalTarget,
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
