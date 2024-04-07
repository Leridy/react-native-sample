import React, {FunctionComponent} from 'react';
import {ScrollView, StyleSheet, Text} from 'react-native';
import {Button} from 'react-native-paper';

interface OwnProps {}

type Props = OwnProps;

const BluetoothPart: FunctionComponent<Props> = props => {
  const requestBluetoothPermission = async () => {
    try {
      // Request Bluetooth permission
    } catch (error) {
      console.log('Request Bluetooth Permission Error:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.h2Title}>Bluetooth</Text>
      <Text style={styles.h4Title}>
        Step1: Requires the Bluetooth permission.
      </Text>
      <Button mode="contained" onPress={requestBluetoothPermission}>
        <Text>Request Bluetooth Permission</Text>
      </Button>
      <Text style={styles.h4Title}>Step2: Do a bluetooth operation.</Text>
      <Button
        mode="contained"
        onPress={() => console.log('Do a bluetooth operation')}>
        <Text>Do a bluetooth operation</Text>
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

export default BluetoothPart;
