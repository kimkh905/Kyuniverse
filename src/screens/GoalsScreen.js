import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import PrimaryButton from '../components/PrimaryButton';
import ScreenContainer from '../components/ScreenContainer';
import { useFlashcards } from '../context/FlashcardContext';
import colors from '../theme/colors';
import {
  disableDailyReminder,
  enableDailyReminder,
  getReminderTimeLabel,
} from '../utils/notifications';

export default function GoalsScreen() {
  const {
    knownCardIds,
    goalTargets,
    selectedGoalTarget,
    goalProgressCount,
    remainingGoalCount,
    isGoalComplete,
    reminderEnabled,
    changeGoalTarget,
    changeReminderEnabled,
  } = useFlashcards();
  const [statusMessage, setStatusMessage] = useState(
    reminderEnabled
      ? `Daily reminders are on for ${getReminderTimeLabel()}.`
      : 'Turn on a daily reminder when you want a gentle push.'
  );

  const handleGoalChange = async (goalTarget) => {
    changeGoalTarget(goalTarget);

    if (!reminderEnabled) {
      return;
    }

    const result = await enableDailyReminder(goalTarget);

    if (!result.granted) {
      changeReminderEnabled(false);
      setStatusMessage('Notifications are off because permission was not granted.');
      return;
    }

    setStatusMessage(`Daily reminders are set for ${getReminderTimeLabel()} and your ${goalTarget}-word goal.`);
  };

  const handleEnableReminder = async () => {
    const result = await enableDailyReminder(selectedGoalTarget);

    if (!result.granted) {
      changeReminderEnabled(false);
      setStatusMessage('Notifications need permission before reminders can be scheduled.');
      return;
    }

    changeReminderEnabled(true);
    setStatusMessage(
      `Daily reminders are on for ${getReminderTimeLabel()} to support your ${selectedGoalTarget}-word goal.`
    );
  };

  const handleDisableReminder = async () => {
    await disableDailyReminder();
    changeReminderEnabled(false);
    setStatusMessage('Daily reminders are paused for now.');
  };

  return (
    <ScreenContainer>
      <Text style={styles.title}>Your Goal</Text>
      <Text style={styles.subtitle}>
        Pick a memorized-word target that feels real, then let the app nudge you toward it.
      </Text>

      <View style={styles.heroCard}>
        <Text style={styles.heroEyebrow}>Current target</Text>
        <Text style={styles.heroValue}>{selectedGoalTarget} words</Text>
        <Text style={styles.heroText}>
          {isGoalComplete
            ? `You reached this goal with ${knownCardIds.length} memorized words. Time for a bigger target.`
            : `${goalProgressCount} down, ${remainingGoalCount} to go. Keep stacking small wins.`}
        </Text>
        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              { width: `${Math.min((goalProgressCount / selectedGoalTarget) * 100, 100)}%` },
            ]}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Choose your memorized-word goal</Text>
        <View style={styles.goalList}>
          {goalTargets.map((goalTarget) => (
            <Pressable
              key={goalTarget}
              onPress={() => handleGoalChange(goalTarget)}
              style={({ pressed }) => [
                styles.goalChip,
                selectedGoalTarget === goalTarget && styles.goalChipActive,
                pressed && styles.pressed,
              ]}
            >
              <Text style={[styles.goalChipLabel, selectedGoalTarget === goalTarget && styles.goalChipLabelActive]}>
                {goalTarget} words
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.reminderCard}>
        <Text style={styles.reminderTitle}>Daily reminder</Text>
        <Text style={styles.reminderText}>
          Reminder tone: "Do this now to become one step closer to your goal."
        </Text>
        <Text style={styles.reminderText}>Scheduled time: {getReminderTimeLabel()}</Text>
        <Text style={styles.reminderStatus}>{statusMessage}</Text>
      </View>

      <PrimaryButton
        title={reminderEnabled ? 'Refresh Daily Reminder' : 'Turn On Daily Reminder'}
        onPress={handleEnableReminder}
      />
      <PrimaryButton
        title="Turn Off Reminder"
        variant="secondary"
        onPress={handleDisableReminder}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.textSoft,
    marginBottom: 18,
  },
  heroCard: {
    backgroundColor: '#fff0d7',
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: colors.backgroundAccent,
  },
  heroEyebrow: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.secondaryDark,
    marginBottom: 8,
  },
  heroValue: {
    fontSize: 30,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 8,
  },
  heroText: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSoft,
    marginBottom: 14,
  },
  progressTrack: {
    height: 12,
    borderRadius: 999,
    backgroundColor: colors.white,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 999,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  goalList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  goalChip: {
    borderRadius: 999,
    backgroundColor: colors.lavender,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  goalChipActive: {
    backgroundColor: colors.secondary,
  },
  goalChipLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  goalChipLabelActive: {
    color: colors.secondaryDark,
  },
  reminderCard: {
    backgroundColor: '#ffe9f2',
    borderRadius: 24,
    padding: 20,
    marginBottom: 18,
  },
  reminderTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  reminderText: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSoft,
    marginBottom: 6,
  },
  reminderStatus: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.primaryDark,
    marginTop: 8,
  },
  pressed: {
    opacity: 0.85,
  },
});
