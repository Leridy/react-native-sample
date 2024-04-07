import React, {FunctionComponent} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import SystemInfoPart from './SystemInfoPart.tsx';
import NotificationPart from './NotificationPart.tsx';
import CameraPart from './CameraPart.tsx';
import BluetoothPart from './BluetoothPart.tsx';
import GeoLocationPart from './GeoLocationPart.tsx';
import FileSystemPart from './FileSystemPart.tsx';

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
  return (
    <View style={styles.container}>
      {currentTab === 'system' && <SystemInfoPart />}
      {currentTab === 'notification' && <NotificationPart />}
      {currentTab === 'camera' && <CameraPart />}
      {currentTab === 'bluetooth' && <BluetoothPart />}
      {currentTab === 'geo-location' && <GeoLocationPart />}
      {currentTab === 'file' && <FileSystemPart />}
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
