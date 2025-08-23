import { Expo, ExpoPushMessage } from 'expo-server-sdk';

const expo = new Expo();

export const sendPushNotification = async (
  expoPushToken: string,
  message: {
    title: string;
    body: string;
    data?: Record<string, any>;
  }
) => {
  if (!Expo.isExpoPushToken(expoPushToken)) {
    console.warn(`Invalid Expo push token: ${expoPushToken}`);
    return;
  }

  const messages: ExpoPushMessage[] = [
    {
      to: expoPushToken,
      sound: 'default',
      title: message.title,
      body: message.body,
      data: message.data || {},
    },
  ];

  try {
    await expo.sendPushNotificationsAsync(messages);
    console.log('Notification sent');
  } catch (err) {
    console.error('Failed to send push notification:', err);
  }
};
