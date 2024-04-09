/**
 * NotificationPart component
 * @description this part mainly show the notification function of the application.
 * 1. first step requires the notification permission.
 * 2. help user to send notification.
 */
import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from 'react';
import {Alert, Platform, ScrollView, StyleSheet, Text} from 'react-native';
import {Button} from 'react-native-paper';

import notifee from '@notifee/react-native';
import {check, PERMISSIONS} from 'react-native-permissions';

interface OwnProps {
  onMessage: (message: string) => void;
}

type Props = OwnProps;

const NotificationPart: FunctionComponent<Props> = props => {
  const {onMessage} = props;
  const channelIdRef = React.useRef<string | null>(null);
  const [canSendNotification, setCanSendNotification] = useState(false);

  const sendNotification = async (title: string, content: string) => {
    try {
      await notifee.displayNotification({
        title: title,
        body: content,
        android: {
          channelId: channelIdRef.current || 'default',
          // 如果你想要通知被按下时打开应用，需要 pressAction
          pressAction: {
            id: 'default',
          },
        },
      });
    } catch (error) {
      onMessage('Send Notification Error');
    }
  };

  const asyncPrompt = async (
    title: string,
    message: string,
  ): Promise<string> => {
    return new Promise((resolve, reject) => {
      Alert.prompt(
        title,
        message,
        [
          {
            text: 'Cancel',
            onPress: () => reject('cancel'),
            style: 'cancel',
          },
          {
            text: 'OK',
            onPress: (content: string = 'default content') => {
              resolve(content);
            },
          },
        ],
        'plain-text',
      );
    });
  };

  const handleNotification = async () => {
    try {
      let title = 'default title';
      let content = 'default content';
      if (Platform.OS === 'ios') {
        title = await asyncPrompt(
          'Notification Title',
          'Please input the notification title',
        );
        content = await asyncPrompt(
          'Notification Content',
          'Please input the notification content',
        );
      } else {
        title = 'Android Notification';
        content =
          'This is a notification from Android, Android does not support `Alert.prompt` to custom title and content.';
      }
      sendNotification(title, content);
    } catch (error) {
      if (error === 'cancel') {
        onMessage('Cancel Notification');
      } else {
        onMessage('Send Notification Error');
        Alert.alert('Error', String(error));
      }
    }
  };

  const asyncRequestPermission = async (): Promise<boolean> => {
    return new Promise(async (resolve, reject) => {
      try {
        const settings = await notifee.requestPermission();
        if (Platform.OS === 'android') {
          channelIdRef.current = await notifee.createChannel({
            id: 'default',
            name: '默认频道',
          });
        }

        if (settings.authorizationStatus === 1) {
          resolve(true);
        } else {
          reject('User refuse the notification permission.');
        }
        reject('Android does not support this feature.');
      } catch (error) {
        reject(error);
      }
    });
  };

  const requestUserPermission = async () => {
    try {
      await asyncRequestPermission();
      onMessage('Request Notification Permission Success');
      setCanSendNotification(true);
    } catch (error) {
      onMessage(String(error) || 'Request Notification Permission Error');
    }
  };

  const checkNotificationPermission = useCallback(async () => {
    try {
      const result = await check(PERMISSIONS.ANDROID.POST_NOTIFICATIONS);
      if (result === 'granted') {
        onMessage('Notification Permission Granted');
        setCanSendNotification(true);
      } else {
        onMessage('Notification Permission Denied');
      }
    } catch (error) {
      onMessage('Check Notification Permission Error');
    }
  }, [onMessage]);

  useEffect(() => {
    if (Platform.OS === 'android') {
      // only work on Android
      checkNotificationPermission();
    }
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.h2Title}>Notification</Text>
      <Text style={styles.h4Title}>
        Step1: Require/Check the notification permission.
      </Text>
      <Button mode="contained" onPress={requestUserPermission}>
        <Text>Request/Check Notification Permission</Text>
      </Button>
      <Text style={styles.h4Title}>
        Step2: Set up a real-time locale notification.
      </Text>
      <Button
        disabled={!canSendNotification}
        mode="contained"
        onPress={handleNotification}>
        <Text>Send a Notification</Text>
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    color: 'black',
  },
  h2Title: {
    marginBottom: 10,
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
  h4Title: {
    marginTop: 10,
    marginBottom: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
});

export default NotificationPart;
