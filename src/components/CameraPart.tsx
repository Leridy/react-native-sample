import React, {FunctionComponent} from 'react';
import {ScrollView, StyleSheet, Text} from 'react-native';
import {Button} from 'react-native-paper';

interface OwnProps {}

type Props = OwnProps;

const CameraPart: FunctionComponent<Props> = props => {
  const requestCameraPermission = async () => {
    try {
      // Request camera permission
    } catch (error) {
      console.log('Request Camera Permission Error:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.h2Title}>Camera</Text>
      <Text style={styles.h4Title}>Step1: Requires the Camera permission.</Text>
      <Button mode="contained" onPress={requestCameraPermission}>
        <Text>Request Camera Permission</Text>
      </Button>
      <Text style={styles.h4Title}>Step2: Take a photo.</Text>
      <Button mode="contained" onPress={() => console.log('Set Reminder')}>
        <Text>Take a Photo</Text>
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

export default CameraPart;
