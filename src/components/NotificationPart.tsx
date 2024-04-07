/**
 * NotificationPart component
 * @description this part mainly show the notification function of the application.
 * 1. first step requires the notification permission.
 * 2. help user to set up a reminder.
 * 3. show the notification when the reminder time comes.

 */
import React, {FunctionComponent} from 'react';
import {Platform, ScrollView, StyleSheet, Text} from 'react-native';
import {Button} from 'react-native-paper';
import PushNotification from 'react-native-push-notification';

interface OwnProps {}

type Props = OwnProps;

const NotificationPart: FunctionComponent<Props> = () => {
  const requestUserPermission = async () => {
    try {
      // 判断 iOS 和 Android
      if (Platform.OS === 'ios') {
        // PushNotification.requestPermissions().then(result => {
        //   console.log('Notification Permission:', result);
        // });
      } else {
        // PushNotification.createChannel(
        //   {
        //     channelId: 'channel-id',
        //     channelName: 'My channel',
        //     channelDescription: 'A channel to categorise your notifications',
        //     soundName: 'default',
        //     importance: 4,
        //     vibrate: true,
        //   },
        //   created => console.log(`createChannel returned '${created}'`),
        // );
        //
        // PushNotification.localNotification({
        //   channelId: 'channel-id',
        //   title: 'Notification Permission',
        //   message: 'Request Notification Permission',
        // });
      }
    } catch (error) {
      console.log('Request Notification Permission Error:', error);
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
      <Text style={styles.h4Title}>Step2: Set up a reminder.</Text>
      <Button mode="contained" onPress={() => console.log('Set Reminder')}>
        <Text>Set Reminder</Text>
      </Button>
      <Text style={styles.h4Title}>
        Step3: Show the notification when the reminder time comes.
      </Text>
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
