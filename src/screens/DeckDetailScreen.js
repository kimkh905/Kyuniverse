import { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import AppShell from '../components/AppShell';
import AuthorCard from '../components/AuthorCard';
import DeckProgressCard from '../components/DeckProgressCard';
import GradientHeader from '../components/GradientHeader';
import InfoCard from '../components/InfoCard';
import LeaderboardRow from '../components/LeaderboardRow';
import PrimaryButton from '../components/PrimaryButton';
import TabBar from '../components/TabBar';
import TopIconButton from '../components/TopIconButton';
import { useFlashcards } from '../context/FlashcardContext';
import tokens from '../theme/tokens';

const deckTabs = ['Decks', 'About', 'Leaderboard'];

const subjectMeta = {
  Beginner: {
    title: 'Starter\nVocabulary',
    overview:
      'A gentle subject path that introduces practical nouns, verbs, and descriptors in a calmer study flow.',
    author: {
      name: 'Mina Kim',
      email: 'mina@kyuniverse.app',
    },
  },
  Intermediate: {
    title: 'Conversation\nBuilder',
    overview:
      'This subject groups useful Korean patterns into cleaner decks so learners can grow confidence one part of speech at a time.',
    author: {
      name: 'Daniel Park',
      email: 'daniel@kyuniverse.app',
    },
  },
  Travel: {
    title: 'Travel\nEssentials',
    overview:
      'A practical subject focused on transport, navigation, food, and quick responses for daily travel situations.',
    author: {
      name: 'Hana Lee',
      email: 'hana@kyuniverse.app',
    },
  },
};

export default function DeckDetailScreen({ navigation, route }) {
  const {
    allFlashcards,
    knownCardIds,
    changeLevel,
    changePartOfSpeech,
    changeStudyMode,
    clearSearchQuery,
    rememberStudyScreen,
  } = useFlashcards();
  const [activeTab, setActiveTab] = useState('Decks');
  const level = route.params?.level ?? 'Beginner';
  const meta = subjectMeta[level] ?? subjectMeta.Beginner;

  useEffect(() => {
    changeLevel(level);
    changePartOfSpeech('All');
    changeStudyMode('All Cards');
    clearSearchQuery();
  }, [changeLevel, changePartOfSpeech, changeStudyMode, clearSearchQuery, level]);

  const levelCards = useMemo(
    () => allFlashcards.filter((card) => card.level === level),
    [allFlashcards, level]
  );

  const deckGroups = useMemo(
    () =>
      ['Noun', 'Verb', 'Adjective', 'Adverb']
        .map((partOfSpeech) => {
          const cards = levelCards.filter((card) => card.partOfSpeech === partOfSpeech);
          const learned = cards.filter((card) => knownCardIds.includes(card.id)).length;

          return {
            partOfSpeech,
            total: cards.length,
            learned,
          };
        })
        .filter((group) => group.total > 0),
    [knownCardIds, levelCards]
  );

  const leaderboardRows = useMemo(
    () =>
      deckGroups
        .map((group, index) => ({
          id: `${group.partOfSpeech}-${index}`,
          name:
            group.partOfSpeech === 'Noun'
              ? 'Mina Kim'
              : group.partOfSpeech === 'Verb'
                ? 'Daniel Park'
                : group.partOfSpeech === 'Adjective'
                  ? 'Hana Lee'
                  : 'Chris Yoon',
          timeframe: 'Last 7 Days',
          score: group.learned * 28 + group.total,
        }))
        .sort((left, right) => right.score - left.score),
    [deckGroups]
  );

  const handleOpenDeck = (partOfSpeech) => {
    changePartOfSpeech(partOfSpeech);
    rememberStudyScreen('Flashcards');
    navigation.navigate('Flashcards');
  };

  return (
    <AppShell>
      <GradientHeader
        title={meta.title}
        left={<TopIconButton icon="chevron-back" label="Back" variant="ghost" onPress={() => navigation.goBack()} />}
        right={<TopIconButton icon="bookmark-outline" label="Save" variant="ghost" />}
        minHeight="32%"
      >
        <TabBar tabs={deckTabs} activeTab={activeTab} onChange={setActiveTab} />
      </GradientHeader>

      <View style={styles.contentPanel}>
        {activeTab === 'Decks' ? (
          <View style={styles.stack}>
            {deckGroups.map((group) => (
              <DeckProgressCard
                key={group.partOfSpeech}
                name={group.partOfSpeech}
                learned={group.learned}
                total={group.total}
                onPress={() => handleOpenDeck(group.partOfSpeech)}
              />
            ))}
          </View>
        ) : null}

        {activeTab === 'About' ? (
          <View style={styles.stack}>
            <InfoCard title="Overview">{meta.overview}</InfoCard>
            <AuthorCard name={meta.author.name} email={meta.author.email} />
          </View>
        ) : null}

        {activeTab === 'Leaderboard' ? (
          <View style={styles.stack}>
            <InfoCard title="Overview">
              <View>
                {leaderboardRows.map((row) => (
                  <LeaderboardRow
                    key={row.id}
                    name={row.name}
                    timeframe={row.timeframe}
                    score={row.score}
                  />
                ))}
              </View>
            </InfoCard>
            <PrimaryButton title="Share Leaderboard" onPress={() => {}} />
          </View>
        ) : null}
      </View>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  contentPanel: {
    flex: 1,
    marginTop: tokens.spacing.lg,
  },
  stack: {
    gap: tokens.spacing.md,
  },
});
