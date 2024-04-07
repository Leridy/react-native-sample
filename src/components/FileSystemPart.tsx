import React, {FunctionComponent} from 'react';
import {ScrollView, StyleSheet, Text} from 'react-native';
import {Button} from 'react-native-paper';

interface OwnProps {}

type Props = OwnProps;

const FileSystemPart: FunctionComponent<Props> = props => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.h2Title}>File System</Text>
      <Text style={styles.h4Title}>
        Step1: Requires the File System permission.
      </Text>
      <Button
        mode="contained"
        onPress={() => console.log('request file access')}>
        <Text>Request File System Permission</Text>
      </Button>
      <Text style={styles.h4Title}>Step2: Do a file system operation.</Text>
      <Button
        mode="contained"
        onPress={() => console.log('Do a file system operation')}>
        <Text>Do a file system operation</Text>
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

export default FileSystemPart;
