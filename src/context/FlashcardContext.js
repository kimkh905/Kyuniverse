import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { flashcards, levels, partsOfSpeech } from '../data/flashcards';

const FlashcardContext = createContext(null);
const STORAGE_KEY = 'flashcard-progress';
const DEFAULT_DAILY_GOAL = 5;
const DEFAULT_GOAL_TARGET = 20;
const MAX_SEARCH_QUERY_LENGTH = 80;
const quizDifficulties = ['Easy', 'Medium', 'Hard'];
const quizScopes = ['Current Filters', 'Word Type Only'];
const goalTargets = [10, 20, 30, 50];
const studyModes = ['All Cards', 'Needs Review', 'Unlearned', 'Bookmarked'];
const streakMilestones = [3, 7, 14, 30];

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

function normalizeText(text) {
  return String(text ?? '').trim().toLowerCase();
}

function sanitizeSearchQuery(text) {
  return String(text ?? '')
    .replace(/[\u0000-\u001F\u007F]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, MAX_SEARCH_QUERY_LENGTH);
}

function matchesSearch(card, query) {
  if (!query) {
    return true;
  }

  return [card.korean, card.english, card.level, card.partOfSpeech].some((value) =>
    normalizeText(value).includes(query)
  );
}

function createEmptyCardStats(cardId) {
  return {
    cardId,
    seenCount: 0,
    correctCount: 0,
    incorrectCount: 0,
    knownCount: 0,
    lastStudiedAt: null,
    lastIncorrectAt: null,
    lastKnownAt: null,
  };
}

function getCardStats(cardStatsById, cardId) {
  return cardStatsById[cardId] ?? createEmptyCardStats(cardId);
}

function sortByStudyPriority(cards, cardStatsById, knownCardIds, favoriteCardIds, mistakeCardIds) {
  return [...cards].sort((leftCard, rightCard) => {
    const leftStats = getCardStats(cardStatsById, leftCard.id);
    const rightStats = getCardStats(cardStatsById, rightCard.id);

    const leftScore =
      (mistakeCardIds.includes(leftCard.id) ? 20 : 0) +
      (!knownCardIds.includes(leftCard.id) ? 8 : 0) +
      (favoriteCardIds.includes(leftCard.id) ? 4 : 0) +
      leftStats.incorrectCount * 3 -
      leftStats.correctCount;
    const rightScore =
      (mistakeCardIds.includes(rightCard.id) ? 20 : 0) +
      (!knownCardIds.includes(rightCard.id) ? 8 : 0) +
      (favoriteCardIds.includes(rightCard.id) ? 4 : 0) +
      rightStats.incorrectCount * 3 -
      rightStats.correctCount;

    if (rightScore !== leftScore) {
      return rightScore - leftScore;
    }

    const leftLastStudied = leftStats.lastStudiedAt ? new Date(leftStats.lastStudiedAt).getTime() : 0;
    const rightLastStudied = rightStats.lastStudiedAt ? new Date(rightStats.lastStudiedAt).getTime() : 0;

    if (leftLastStudied !== rightLastStudied) {
      return leftLastStudied - rightLastStudied;
    }

    return Number(leftCard.id) - Number(rightCard.id);
  });
}

export function FlashcardProvider({ children }) {
  const [knownCardIds, setKnownCardIds] = useState([]);
  const [favoriteCardIds, setFavoriteCardIds] = useState([]);
  const [mistakeCardIds, setMistakeCardIds] = useState([]);
  const [cardStatsById, setCardStatsById] = useState({});
  const [quizResults, setQuizResults] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [selectedPartOfSpeech, setSelectedPartOfSpeech] = useState('All');
  const [selectedStudyMode, setSelectedStudyMode] = useState('All Cards');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedQuizDifficulty, setSelectedQuizDifficulty] = useState('Easy');
  const [selectedQuizScope, setSelectedQuizScope] = useState('Current Filters');
  const [dailyGoal] = useState(DEFAULT_DAILY_GOAL);
  const [selectedGoalTarget, setSelectedGoalTarget] = useState(DEFAULT_GOAL_TARGET);
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [showOnboardingTip, setShowOnboardingTip] = useState(true);
  const [lastStudyScreen, setLastStudyScreen] = useState('Flashcards');
  const [celebration, setCelebration] = useState(null);
  const [activityByDate, setActivityByDate] = useState({});
  const [isHydrated, setIsHydrated] = useState(false);
  const previousMilestonesRef = useRef({
    todayProgress: 0,
    knownCount: 0,
    streakCount: 0,
  });

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

        if (Array.isArray(parsedProgress.mistakeCardIds)) {
          setMistakeCardIds(parsedProgress.mistakeCardIds);
        }

        if (
          parsedProgress.cardStatsById &&
          typeof parsedProgress.cardStatsById === 'object' &&
          !Array.isArray(parsedProgress.cardStatsById)
        ) {
          setCardStatsById(parsedProgress.cardStatsById);
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
          typeof parsedProgress.selectedStudyMode === 'string' &&
          studyModes.includes(parsedProgress.selectedStudyMode)
        ) {
          setSelectedStudyMode(parsedProgress.selectedStudyMode);
        }

        if (typeof parsedProgress.searchQuery === 'string') {
          setSearchQuery(sanitizeSearchQuery(parsedProgress.searchQuery));
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

        if (typeof parsedProgress.showOnboardingTip === 'boolean') {
          setShowOnboardingTip(parsedProgress.showOnboardingTip);
        }

        if (typeof parsedProgress.lastStudyScreen === 'string') {
          setLastStudyScreen(parsedProgress.lastStudyScreen);
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
            mistakeCardIds,
            cardStatsById,
            quizResults,
            selectedLevel,
            selectedPartOfSpeech,
            selectedStudyMode,
            searchQuery,
            selectedQuizDifficulty,
            selectedQuizScope,
            selectedGoalTarget,
            reminderEnabled,
            showOnboardingTip,
            lastStudyScreen,
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
    cardStatsById,
    favoriteCardIds,
    isHydrated,
    knownCardIds,
    mistakeCardIds,
    reminderEnabled,
    quizResults,
    searchQuery,
    selectedGoalTarget,
    selectedLevel,
    selectedPartOfSpeech,
    selectedQuizDifficulty,
    selectedQuizScope,
    selectedStudyMode,
    showOnboardingTip,
    lastStudyScreen,
  ]);

  const normalizedSearchQuery = normalizeText(searchQuery);
  const filteredByLevel =
    selectedLevel === 'All' ? flashcards : flashcards.filter((card) => card.level === selectedLevel);
  const filteredByWordType =
    selectedPartOfSpeech === 'All'
      ? filteredByLevel
      : filteredByLevel.filter((card) => card.partOfSpeech === selectedPartOfSpeech);
  const filteredBySearch = filteredByWordType.filter((card) => matchesSearch(card, normalizedSearchQuery));
  const studyFilteredFlashcards = filteredBySearch.filter((card) => {
    if (selectedStudyMode === 'Needs Review') {
      return mistakeCardIds.includes(card.id);
    }

    if (selectedStudyMode === 'Unlearned') {
      return !knownCardIds.includes(card.id);
    }

    if (selectedStudyMode === 'Bookmarked') {
      return favoriteCardIds.includes(card.id);
    }

    return true;
  });

  const orderedFlashcards = sortByStudyPriority(
    studyFilteredFlashcards,
    cardStatsById,
    knownCardIds,
    favoriteCardIds,
    mistakeCardIds
  );

  const wordTypeQuizBase =
    selectedPartOfSpeech === 'All'
      ? flashcards
      : flashcards.filter((card) => card.partOfSpeech === selectedPartOfSpeech);
  const wordTypeQuizSearchFiltered = wordTypeQuizBase.filter((card) =>
    matchesSearch(card, normalizedSearchQuery)
  );
  const quizBaseCards =
    selectedQuizScope === 'Word Type Only' ? wordTypeQuizSearchFiltered : studyFilteredFlashcards;
  const quizFlashcards = sortByStudyPriority(
    quizBaseCards,
    cardStatsById,
    knownCardIds,
    favoriteCardIds,
    mistakeCardIds
  );

  const levelKnownCount = studyFilteredFlashcards.filter((card) => knownCardIds.includes(card.id)).length;
  const favoriteCount = studyFilteredFlashcards.filter((card) => favoriteCardIds.includes(card.id)).length;
  const mistakeCount = studyFilteredFlashcards.filter((card) => mistakeCardIds.includes(card.id)).length;
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

  const updateCardStats = (cardId, buildNextStats) => {
    setCardStatsById((currentStats) => {
      const existingStats = getCardStats(currentStats, cardId);
      const nextStats = buildNextStats(existingStats, new Date().toISOString());

      return {
        ...currentStats,
        [cardId]: {
          ...existingStats,
          ...nextStats,
          cardId,
        },
      };
    });
  };

  const markCardKnown = (cardId) => {
    trackDailyActivity();

    setKnownCardIds((currentIds) => {
      if (currentIds.includes(cardId)) {
        return currentIds;
      }

      return [...currentIds, cardId];
    });

    setMistakeCardIds((currentIds) => currentIds.filter((currentId) => currentId !== cardId));

    updateCardStats(cardId, (existingStats, now) => ({
      knownCount: existingStats.knownCount + 1,
      lastKnownAt: now,
      lastStudiedAt: now,
    }));
  };

  const saveQuizResult = (cardId, isCorrect) => {
    trackDailyActivity();
    setQuizResults((currentResults) => [...currentResults, isCorrect]);

    updateCardStats(cardId, (existingStats, now) => ({
      seenCount: existingStats.seenCount + 1,
      correctCount: existingStats.correctCount + (isCorrect ? 1 : 0),
      incorrectCount: existingStats.incorrectCount + (isCorrect ? 0 : 1),
      lastIncorrectAt: isCorrect ? existingStats.lastIncorrectAt : now,
      lastStudiedAt: now,
    }));

    if (isCorrect) {
      return;
    }

    setMistakeCardIds((currentIds) => {
      if (currentIds.includes(cardId)) {
        return currentIds;
      }

      return [...currentIds, cardId];
    });
  };

  const clearMistakeCard = (cardId) => {
    setMistakeCardIds((currentIds) => currentIds.filter((currentId) => currentId !== cardId));
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
    setMistakeCardIds([]);
    setCardStatsById({});
    setQuizResults([]);
    setActivityByDate({});
  };

  const changeLevel = (level) => {
    setSelectedLevel(level);
  };

  const changePartOfSpeech = (partOfSpeech) => {
    setSelectedPartOfSpeech(partOfSpeech);
  };

  const changeStudyMode = (studyMode) => {
    setSelectedStudyMode(studyMode);
  };

  const changeSearchQuery = (query) => {
    setSearchQuery(sanitizeSearchQuery(query));
  };

  const clearSearchQuery = () => {
    setSearchQuery('');
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

  const dismissOnboardingTip = () => {
    setShowOnboardingTip(false);
  };

  const showOnboardingAgain = () => {
    setShowOnboardingTip(true);
  };

  const rememberStudyScreen = (screenName) => {
    setLastStudyScreen(screenName);
  };

  const dismissCelebration = () => {
    setCelebration(null);
  };

  const todayKey = getTodayKey();
  const todayProgress = activityByDate[todayKey] ?? 0;
  const dailyGoalProgress = Math.min(todayProgress, dailyGoal);
  const streakCount = calculateStreak(activityByDate);
  const isDailyGoalComplete = todayProgress >= dailyGoal;

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    const previousMilestones = previousMilestonesRef.current;

    if (previousMilestones.todayProgress < dailyGoal && todayProgress >= dailyGoal) {
      setCelebration({
        id: `daily-goal-${todayKey}`,
        title: 'Daily goal complete',
        message: "Nice work. You reached today's study goal.",
      });
    } else if (
      previousMilestones.knownCount < selectedGoalTarget &&
      knownCardIds.length >= selectedGoalTarget
    ) {
      setCelebration({
        id: `goal-${selectedGoalTarget}`,
        title: 'Goal milestone reached',
        message: `You hit your ${selectedGoalTarget}-word milestone. That is real progress.`,
      });
    } else {
      const reachedStreakMilestone = streakMilestones.find(
        (milestone) => previousMilestones.streakCount < milestone && streakCount >= milestone
      );

      if (reachedStreakMilestone) {
        setCelebration({
          id: `streak-${reachedStreakMilestone}`,
          title: 'Streak milestone',
          message: `You made it to a ${reachedStreakMilestone}-day streak. Keep it warm tomorrow.`,
        });
      }
    }

    previousMilestonesRef.current = {
      todayProgress,
      knownCount: knownCardIds.length,
      streakCount,
    };
  }, [dailyGoal, isHydrated, knownCardIds.length, selectedGoalTarget, streakCount, todayKey, todayProgress]);

  const value = useMemo(
    () => ({
      flashcards: orderedFlashcards,
      quizFlashcards,
      allFlashcards: flashcards,
      levels,
      partsOfSpeech,
      studyModes,
      selectedLevel,
      selectedPartOfSpeech,
      selectedStudyMode,
      searchQuery,
      selectedQuizDifficulty,
      selectedQuizScope,
      quizDifficulties,
      quizScopes,
      goalTargets,
      selectedGoalTarget,
      goalProgressCount,
      remainingGoalCount,
      isGoalComplete,
      reminderEnabled,
      showOnboardingTip,
      lastStudyScreen,
      celebration,
      knownCardIds,
      favoriteCardIds,
      favoriteCount,
      mistakeCardIds,
      mistakeCount,
      cardStatsById,
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
      clearMistakeCard,
      toggleFavoriteCard,
      resetProgress,
      changeLevel,
      changePartOfSpeech,
      changeStudyMode,
      changeSearchQuery,
      clearSearchQuery,
      changeQuizDifficulty,
      changeQuizScope,
      changeGoalTarget,
      changeReminderEnabled,
      dismissOnboardingTip,
      showOnboardingAgain,
      rememberStudyScreen,
      dismissCelebration,
    }),
    [
      dailyGoal,
      dailyGoalProgress,
      favoriteCardIds,
      favoriteCount,
      goalProgressCount,
      isDailyGoalComplete,
      isGoalComplete,
      isHydrated,
      knownCardIds,
      levelKnownCount,
      mistakeCardIds,
      mistakeCount,
      orderedFlashcards,
      quizFlashcards,
      quizResults,
      remainingGoalCount,
      reminderEnabled,
      searchQuery,
      selectedGoalTarget,
      selectedLevel,
      selectedPartOfSpeech,
      selectedQuizDifficulty,
      selectedQuizScope,
      selectedStudyMode,
      showOnboardingTip,
      streakCount,
      todayProgress,
      cardStatsById,
      lastStudyScreen,
      celebration,
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
