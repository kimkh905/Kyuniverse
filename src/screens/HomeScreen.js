import { Pressable, StyleSheet, Text, View } from 'react-native';
import AppShell from '../components/AppShell';
import Avatar from '../components/Avatar';
import BottomNav from '../components/BottomNav';
import ClassCard from '../components/ClassCard';
import StatCard from '../components/StatCard';
import TopIconButton from '../components/TopIconButton';
import { useFlashcards } from '../context/FlashcardContext';
import colors from '../theme/colors';
import tokens from '../theme/tokens';

const classAuthors = {
  Beginner: { name: 'Mina Kim', role: 'Core basics' },
  Intermediate: { name: 'Daniel Park', role: 'Real conversation' },
  Travel: { name: 'Hana Lee', role: 'Travel phrases' },
};

export default function HomeScreen({ navigation, onLogout }) {
  const { allFlashcards, levels, knownCardIds, rememberStudyScreen } = useFlashcards();

  const classCards = levels
    .filter((level) => level !== 'All')
    .map((level) => {
      const cards = allFlashcards.filter((card) => card.level === level);

      return {
        level,
        title:
          level === 'Beginner'
            ? 'Korean Foundations'
            : level === 'Intermediate'
              ? 'Daily Conversation'
              : 'Travel & Survival',
        category: level.toUpperCase(),
        author: classAuthors[level],
        count: cards.length,
      };
    });

  return (
    <AppShell
      scroll
      contentContainerStyle={styles.content}
      bottomNav={
        <BottomNav
          navigation={navigation}
          currentRoute="Home"
          onCenterPress={() => {
            rememberStudyScreen('Flashcards');
            navigation.navigate('Flashcards');
          }}
        />
      }
    >
      <View style={styles.topBar}>
        <TopIconButton icon="grid-outline" label="Browse" />
        <View style={styles.topActions}>
          <Pressable
            onPress={onLogout}
            style={({ pressed }) => [styles.logoutButton, pressed && styles.logoutButtonPressed]}
          >
            <Text style={styles.logoutLabel}>Logout</Text>
          </Pressable>
          <TopIconButton label="" onPress={() => navigation.navigate('Profile')}>
            <Avatar label="K" size={52} shape="rounded" />
          </TopIconButton>
        </View>
      </View>

      <Text style={styles.title}>Dashboard</Text>

      <View style={styles.statsRow}>
        <StatCard value={knownCardIds.length} label="Studied cards" tone="lavender" />
        <StatCard value={classCards.length + 15} label="Deck created" tone="beige" />
      </View>

      <Text style={styles.sectionTitle}>Classes</Text>

      <View style={styles.classList}>
        {classCards.map((classCard) => (
          <ClassCard
            key={classCard.level}
            category={classCard.category}
            title={classCard.title}
            authorName={classCard.author.name}
            authorSubtitle={`${classCard.author.role} | ${classCard.count} cards`}
            onPress={() => navigation.navigate('DeckDetail', { level: classCard.level })}
          />
        ))}
      </View>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 28,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: tokens.spacing.lg,
  },
  topActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.sm,
  },
  logoutButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: tokens.radius.pill,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.backgroundAccent,
    ...tokens.shadow.card,
  },
  logoutButtonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  logoutLabel: {
    fontSize: tokens.type.caption,
    fontWeight: '700',
    color: colors.text,
  },
  title: {
    fontSize: tokens.type.screenTitle,
    lineHeight: 44,
    fontWeight: '800',
    color: colors.text,
    marginBottom: tokens.spacing.lg,
  },
  statsRow: {
    flexDirection: 'row',
    gap: tokens.spacing.md,
    marginBottom: tokens.spacing.xl,
  },
  sectionTitle: {
    fontSize: tokens.type.sectionTitle,
    fontWeight: '700',
    color: colors.text,
    marginBottom: tokens.spacing.md,
  },
  classList: {
    gap: tokens.spacing.md,
  },
});
