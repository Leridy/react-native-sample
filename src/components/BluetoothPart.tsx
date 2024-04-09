import React, {FunctionComponent, useRef, useState} from 'react';
import {Platform, ScrollView, StyleSheet, Text} from 'react-native';
import {Button} from 'react-native-paper';
import {PERMISSIONS, requestMultiple} from 'react-native-permissions';

import {BleManager} from 'react-native-ble-plx';
import DeviceInfo from 'react-native-device-info';

interface OwnProps {
  onMessage: (message: string) => void;
}

type Props = OwnProps;

const IOS_BLUETOOTH_PERMISSIONS = [PERMISSIONS.IOS.BLUETOOTH];
const ANDROID_BLUETOOTH_PERMISSIONS = [
  PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
  PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
  PERMISSIONS.ANDROID.BLUETOOTH_ADVERTISE,
];

const BluetoothPart: FunctionComponent<Props> = props => {
  const {onMessage} = props;
  const bluetoothRef = useRef<BleManager | null>(null);

  if (Platform.OS === 'android') {
    bluetoothRef.current = new BleManager({
      restoreStateIdentifier: 'BleInTheBackground',
      restoreStateFunction: bleRestoredState => {
        if (bleRestoredState) {
          console.log('Ble Restored State:', bleRestoredState);
        }
      },
    });
  } else if (Platform.OS === 'ios' && DeviceInfo.getModel() === 'Simulator') {
    // if Platform.OS is ios, and in the simulator
    onMessage('Bluetooth is not supported in the simulator');
  }

  const [canUseBluetooth, setCanUseBluetooth] = useState(false);

  const requestPermission = async () =>
    new Promise(async (resolve, reject) => {
      let result = requestMultiple(
        Platform.OS === 'ios'
          ? IOS_BLUETOOTH_PERMISSIONS
          : ANDROID_BLUETOOTH_PERMISSIONS,
      );

      if (Object.values(result).every(permission => permission === 'granted')) {
        resolve(true);
      } else {
        reject(result);
      }
    });

  const requestBluetoothPermission = async () => {
    try {
      const result = await requestMultiple(
        Platform.OS === 'ios'
          ? IOS_BLUETOOTH_PERMISSIONS
          : ANDROID_BLUETOOTH_PERMISSIONS,
      );

      const isGranted = Object.values(result).every(
        permission => permission === 'granted',
      );

      if (isGranted) {
        console.log('Bluetooth Permission Granted');
        onMessage('Bluetooth Permission Granted');
        setCanUseBluetooth(true);
      } else {
        const requestResult = await requestPermission();
        if (requestResult) {
          setCanUseBluetooth(true);
          onMessage('Bluetooth Permission Granted');
        }
      }
    } catch (error) {
      onMessage('Bluetooth Permission Denied');
      console.log('Request Bluetooth Permission Error:', error);
    }
  };

  const asyncDeviceScan = async () => {
    return new Promise((resolve, reject) => {
      const manager = bluetoothRef.current;
      if (!manager) {
        reject('Bluetooth is not supported in the simulator');
        return;
      }
      manager.startDeviceScan(null, null, (error, device) => {
        if (error) {
          reject(error);
          return;
        }
        if (device) {
          console.log('Device:', device);
          manager.stopDeviceScan();
          resolve(device);
        }
      });
    });
  };

  const handleScanAndShowList = async () => {
    try {
      const result = await asyncDeviceScan();
      console.log('Scan Result:', result);
      onMessage('Scan and Show List');
    } catch (e) {
      onMessage('Something wrong with bluetooth function');
      console.log(e);
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
        disabled={!canUseBluetooth}
        mode="contained"
        onPress={handleScanAndShowList}>
        <Text>Show the all bluetooth devices we can find</Text>
      </Button>
      <Text style={styles.h4Title}>
        Step3: Show the all bluetooth devices we can find.
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
