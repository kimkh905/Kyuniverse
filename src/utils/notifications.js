import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

const DAILY_REMINDER_HOUR = 20;
const DAILY_REMINDER_MINUTE = 0;

if (Platform.OS !== 'web') {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}

export async function configureNotifications() {
  if (Platform.OS === 'web') {
    return;
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('daily-reminders', {
      name: 'Daily reminders',
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }
}

export async function enableDailyReminder(goalTarget) {
  if (Platform.OS === 'web') {
    return { granted: false, reason: 'web-not-supported' };
  }

  const permissions = await Notifications.getPermissionsAsync();
  let finalStatus = permissions.status;

  if (finalStatus !== 'granted') {
    const request = await Notifications.requestPermissionsAsync();
    finalStatus = request.status;
  }

  if (finalStatus !== 'granted') {
    return { granted: false };
  }

  await Notifications.cancelAllScheduledNotificationsAsync();

  const identifier = await Notifications.scheduleNotificationAsync({
    content: {
      title: 'One small step today',
      body: `Do this now to become one step closer to your ${goalTarget}-word goal.`,
      sound: false,
    },
    trigger: {
      hour: DAILY_REMINDER_HOUR,
      minute: DAILY_REMINDER_MINUTE,
      repeats: true,
      channelId: 'daily-reminders',
    },
  });

  return { granted: true, identifier };
}

export async function disableDailyReminder() {
  if (Platform.OS === 'web') {
    return;
  }

  await Notifications.cancelAllScheduledNotificationsAsync();
}

export async function sendTestNotification(goalTarget) {
  if (Platform.OS === 'web') {
    return { granted: false, reason: 'web-not-supported' };
  }

  const permissions = await Notifications.getPermissionsAsync();
  let finalStatus = permissions.status;

  if (finalStatus !== 'granted') {
    const request = await Notifications.requestPermissionsAsync();
    finalStatus = request.status;
  }

  if (finalStatus !== 'granted') {
    return { granted: false };
  }

  const identifier = await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Quick practice check',
      body: `Do this now to become one step closer to your ${goalTarget}-word goal.`,
      sound: false,
    },
    trigger: {
      seconds: 2,
      channelId: 'daily-reminders',
    },
  });

  return { granted: true, identifier };
}

export function getReminderTimeLabel() {
  return '8:00 PM';
}
