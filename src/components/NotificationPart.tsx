/**
 * NotificationPart component
 * @description this part mainly show the notification function of the application.
 * 1. first step requires the notification permission.
 * 2. help user to send notification.
 */
import React, {FunctionComponent, useState} from 'react';
import {Alert, Platform, ScrollView, StyleSheet, Text} from 'react-native';
import {Button} from 'react-native-paper';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
// import notification package for android
import pushNotification from 'react-native-push-notification';

interface OwnProps {
  onMessage: (message: string) => void;
}

type Props = OwnProps;

const NotificationPart: FunctionComponent<Props> = props => {
  const {onMessage} = props;

  const [canSendNotification, setCanSendNotification] = useState(false);

  const sendNotification = (title: string, content: string) => {
    if (Platform.OS === 'ios') {
      PushNotificationIOS.addNotificationRequest({
        id: 'notification-id',
        title: title,
        body: content,
        badge: 1,
        category: 'category-id',
      });
    } else {
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
      const title = await asyncPrompt(
        'Notification Title',
        'Please input the notification title',
      );
      const content = await asyncPrompt(
        'Notification Content',
        'Please input the notification content',
      );
      sendNotification(title, content);
    } catch (error) {
      if (error === 'cancel') {
        onMessage('Cancel Notification');
      }
    }
  };

  const asyncRequestPermission = async (): Promise<boolean> => {
    return new Promise(async (resolve, reject) => {
      try {
        if (Platform.OS === 'ios') {
          const result = await PushNotificationIOS.requestPermissions();
          if (result.alert) {
            resolve(true);
          } else {
            reject('User refuse the notification permission.');
          }
        } else if (Platform.OS === 'android') {
          const result = await pushNotification.requestPermissions([
            'alert',
            'sound',
            'badge',
          ]);
          if (result.alert) {
            resolve(true);
          } else {
            reject('User refuse the notification permission.');
          }
          reject('Android does not support this feature.');
        }
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
      console.log('Request Notification Permission Error:', error);
      onMessage(String(error) || 'Request Notification Permission Error');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.h2Title}>Notification</Text>
      <Text style={styles.h4Title}>
        Step1: Requires the notification permission.
      </Text>
      <Button mode="contained" onPress={requestUserPermission}>
        <Text>Request Notification Permission</Text>
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
