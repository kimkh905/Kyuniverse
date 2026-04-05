import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import BlueHeroCard from '../components/BlueHeroCard';
import BottomNavigation from '../components/BottomNavigation';
import ScreenContainer from '../components/ScreenContainer';
import { useFlashcards } from '../context/FlashcardContext';
import colors from '../theme/colors';
import tokens from '../theme/tokens';

export default function LeaderboardScreen({ navigation }) {
  const { allFlashcards, knownCardIds, cardStatsById, levels, streakCount, todayProgress, dailyGoal } =
    useFlashcards();

  const rankedLevels = useMemo(
    () =>
      levels
        .filter((level) => level !== 'All')
        .map((level) => {
          const cards = allFlashcards.filter((card) => card.level === level);
          const learned = cards.filter((card) => knownCardIds.includes(card.id)).length;
          const studyTouches = cards.reduce(
            (count, card) => count + (cardStatsById[card.id]?.seenCount ?? 0),
            0
          );
          const score = learned * 10 + studyTouches;

          return {
            level,
            learned,
            studyTouches,
            score,
          };
        })
        .sort((left, right) => right.score - left.score),
    [allFlashcards, cardStatsById, knownCardIds, levels]
  );

  return (
    <ScreenContainer scroll={false}>
      <View style={styles.screen}>
        <View style={styles.content}>
          <BlueHeroCard style={styles.heroCard}>
            <Text style={styles.heroEyebrow}>Leaderboard</Text>
            <Text style={styles.heroTitle}>See which class is leading your study momentum.</Text>
            <Text style={styles.heroText}>
              This page turns your local study history into an easy ranking view for interface preview and focus.
            </Text>
          </BlueHeroCard>

          <View style={styles.summaryRow}>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryValue}>{streakCount}</Text>
              <Text style={styles.summaryLabel}>Current streak</Text>
            </View>
            <View style={[styles.summaryCard, styles.summaryCardBlue]}>
              <Text style={styles.summaryValue}>
                {todayProgress}/{dailyGoal}
              </Text>
              <Text style={styles.summaryLabel}>Today score</Text>
            </View>
          </View>

          <View style={styles.listCard}>
            {rankedLevels.map((entry, index) => (
              <Pressable
                key={entry.level}
                style={({ pressed }) => [styles.rankRow, pressed && styles.pressed]}
                onPress={() => navigation.navigate('DeckDetail', { level: entry.level })}
              >
                <Text style={styles.rankNumber}>#{index + 1}</Text>
                <View style={styles.rankMeta}>
                  <Text style={styles.rankTitle}>{entry.level}</Text>
                  <Text style={styles.rankText}>
                    {entry.learned} learned | {entry.studyTouches} study touches
                  </Text>
                </View>
                <View style={styles.rankScore}>
                  <Text style={styles.rankScoreValue}>{entry.score}</Text>
                  <Text style={styles.rankScoreLabel}>pts</Text>
                </View>
              </Pressable>
            ))}
          </View>
        </View>

        <BottomNavigation
          navigation={navigation}
          currentRoute="Leaderboard"
          onCenterPress={() => navigation.navigate('Flashcards')}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  heroCard: {
    marginBottom: 18,
  },
  heroEyebrow: {
    fontSize: tokens.type.caption,
    fontWeight: '700',
    color: tokens.colors.heroText,
    marginBottom: 10,
  },
  heroTitle: {
    fontSize: tokens.type.headerTitle + 2,
    lineHeight: 34,
    fontWeight: '800',
    color: colors.white,
    marginBottom: 10,
    maxWidth: 290,
  },
  heroText: {
    fontSize: tokens.type.body,
    lineHeight: 22,
    color: tokens.colors.heroText,
    maxWidth: 300,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 18,
  },
  summaryCard: {
    flex: 1,
    borderRadius: tokens.radius.card,
    padding: 18,
    backgroundColor: colors.beige,
  },
  summaryCardBlue: {
    backgroundColor: colors.lavender,
  },
  summaryValue: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 13,
    color: colors.textSoft,
  },
  listCard: {
    backgroundColor: colors.white,
    borderRadius: tokens.radius.panelMd,
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: colors.backgroundAccent,
    ...tokens.shadow.card,
  },
  rankRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1e6d9',
  },
  rankNumber: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.primary,
    width: 36,
  },
  rankMeta: {
    flex: 1,
  },
  rankTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 4,
  },
  rankText: {
    fontSize: 14,
    color: colors.textSoft,
  },
  rankScore: {
    borderRadius: tokens.radius.button,
    backgroundColor: colors.cardAlt,
    paddingHorizontal: 14,
    paddingVertical: 10,
    minWidth: 66,
    alignItems: 'center',
  },
  rankScoreValue: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.primary,
  },
  rankScoreLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSoft,
    marginTop: 2,
  },
  pressed: {
    opacity: 0.86,
  },
});
