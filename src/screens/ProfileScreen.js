import { StyleSheet, Text, View } from 'react-native';
import AppShell from '../components/AppShell';
import Avatar from '../components/Avatar';
import BottomNav from '../components/BottomNav';
import InfoCard from '../components/InfoCard';
import PrimaryButton from '../components/PrimaryButton';
import StatCard from '../components/StatCard';
import TopIconButton from '../components/TopIconButton';
import { useFlashcards } from '../context/FlashcardContext';
import colors from '../theme/colors';
import tokens from '../theme/tokens';

export default function ProfileScreen({ navigation }) {
  const { knownCardIds, streakCount, selectedGoalTarget, goalProgressCount, favoriteCardIds } =
    useFlashcards();

  return (
    <AppShell
      scroll
      contentContainerStyle={styles.content}
      bottomNav={
        <BottomNav
          navigation={navigation}
          currentRoute="Profile"
          onCenterPress={() => navigation.navigate('Flashcards')}
        />
      }
    >
      <View style={styles.topRow}>
        <View>
          <Text style={styles.eyebrow}>Profile</Text>
          <Text style={styles.title}>Your learning space</Text>
        </View>
        <TopIconButton label="" onPress={() => navigation.navigate('Home')}>
          <Avatar label="K" size={52} shape="rounded" />
        </TopIconButton>
      </View>

      <InfoCard style={styles.heroCard}>
        <Text style={styles.heroTitle}>You are making steady progress.</Text>
        <Text style={styles.heroText}>
          Keep your streak alive, return to saved cards, and keep building toward your next milestone.
        </Text>
      </InfoCard>

      <View style={styles.statsRow}>
        <StatCard value={knownCardIds.length} label="Studied cards" tone="lavender" />
        <StatCard value={favoriteCardIds.length} label="Saved cards" tone="beige" />
      </View>

      <InfoCard title="Current target">
        {`${goalProgressCount} of ${selectedGoalTarget} memorized, with a ${streakCount}-day streak behind you.`}
      </InfoCard>

      <View style={styles.actions}>
        <PrimaryButton title="View Goals" onPress={() => navigation.navigate('Goals')} />
        <PrimaryButton title="Privacy & Data" variant="secondary" onPress={() => navigation.navigate('Privacy')} />
      </View>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 28,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: tokens.spacing.lg,
  },
  eyebrow: {
    fontSize: tokens.type.caption,
    fontWeight: '700',
    color: colors.primaryDark,
    marginBottom: 6,
  },
  title: {
    fontSize: tokens.type.screenTitle,
    lineHeight: 44,
    fontWeight: '800',
    color: colors.text,
    maxWidth: 250,
  },
  heroCard: {
    marginBottom: tokens.spacing.md,
  },
  heroTitle: {
    fontSize: tokens.type.sectionTitle,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 8,
  },
  heroText: {
    fontSize: tokens.type.body,
    lineHeight: 22,
    color: colors.textSoft,
  },
  statsRow: {
    flexDirection: 'row',
    gap: tokens.spacing.md,
    marginBottom: tokens.spacing.md,
  },
  actions: {
    marginTop: tokens.spacing.md,
  },
});
