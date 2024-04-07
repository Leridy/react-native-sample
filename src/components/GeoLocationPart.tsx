import React, {FunctionComponent} from 'react';
import {ScrollView, StyleSheet, Text} from 'react-native';
import {Button} from 'react-native-paper';

interface OwnProps {}

type Props = OwnProps;

const GeoLocationPart: FunctionComponent<Props> = props => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.h2Title}>Geo-location</Text>
      <Text style={styles.h4Title}>
        Step1: Requires the Geo-location permission.
      </Text>
      <Button
        mode="contained"
        onPress={() => console.log('request permission')}>
        <Text>Request Geo-location Permission</Text>
      </Button>
      <Text style={styles.h4Title}>Step2: Get the current location.</Text>
      <Button
        mode="contained"
        onPress={() => console.log('Get the current location')}>
        <Text>Get the current location</Text>
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
export default GeoLocationPart;
