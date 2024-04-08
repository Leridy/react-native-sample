import React, {FunctionComponent, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import SystemInfoPart from './SystemInfoPart.tsx';
import NotificationPart from './NotificationPart.tsx';
import CameraPart from './CameraPart.tsx';
import BluetoothPart from './BluetoothPart.tsx';
import GeoLocationPart from './GeoLocationPart.tsx';
import FileSystemPart from './FileSystemPart.tsx';
import {Snackbar} from 'react-native-paper';

export type functionType =
  | 'system'
  | 'notification'
  | 'camera'
  | 'bluetooth'
  | 'geo-location'
  | 'file';

interface OwnProps {
  currentTab: functionType;
}

type Props = OwnProps;

const FunctionBox: FunctionComponent<Props> = props => {
  const {currentTab} = props;
  const [message, setMessage] = useState<string>('');

  const handleMessage = (m: string) => {
    console.log('Message:', m);
    setMessage(m);
  };

  return (
    <View style={styles.container}>
      {currentTab === 'system' && <SystemInfoPart />}
      {currentTab === 'notification' && (
        <NotificationPart onMessage={handleMessage} />
      )}
      {currentTab === 'camera' && <CameraPart />}
      {currentTab === 'bluetooth' && <BluetoothPart />}
      {currentTab === 'geo-location' && <GeoLocationPart />}
      {currentTab === 'file' && <FileSystemPart />}
      <Snackbar
        style={{
          position: 'absolute',
          bottom: 110,
          width: '95%',
        }}
        visible={Boolean(message)}
        onDismiss={() => setMessage('')}
        action={{
          label: 'Undo',
          onPress: () => {
            setMessage('');
          },
        }}>
        {message}
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '90%',
  },
});

export default FunctionBox;
