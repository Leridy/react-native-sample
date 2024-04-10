import React, {FunctionComponent, useEffect, useRef, useState} from 'react';
import {Platform, ScrollView, StyleSheet, Text} from 'react-native';
import {Button, List, Modal} from 'react-native-paper';
import {PERMISSIONS, requestMultiple} from 'react-native-permissions';

import {BleManager, Device} from 'react-native-ble-plx';
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
  PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
];

const BluetoothPart: FunctionComponent<Props> = props => {
  const {onMessage} = props;
  const bluetoothRef = useRef<BleManager | null>(null);
  const [devicesList, setDevicesList] = useState<Device[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);

  useEffect(() => {
    if (Platform.OS === 'ios' && DeviceInfo.isEmulatorSync()) {
      onMessage('Bluetooth is not supported in the iOS simulator');
    } else {
      bluetoothRef.current = new BleManager({
        restoreStateIdentifier: 'BleInTheBackground',
        restoreStateFunction: bleRestoredState => {
          if (bleRestoredState) {
            console.log('Ble Restored State:', bleRestoredState);
          }
        },
      });
    }
  }, [onMessage]);

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

  const asyncDeviceScan = async (): Promise<Device[]> => {
    return new Promise((resolve, reject) => {
      let devices: Device[] = [];
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
        if (device && devices.length < 10) {
          if ('_manager' in device) {
            delete device._manager;
          }
          devices.push(device);
        } else {
          resolve(devices);
          manager.stopDeviceScan();
        }
      });
    });
  };

  const handleScanAndShowList = async () => {
    try {
      const result = await asyncDeviceScan();
      setDevicesList(result);
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
        <Text>Show the 10 bluetooth devices we can find</Text>
      </Button>
      <Text style={styles.h4Title}>
        Step3: Show recent 10 BLE bluetooth devices we can find.
      </Text>
      <List.Section style={styles.ListSection}>
        <List.Subheader>BLE Bluetooth Device List</List.Subheader>
        {devicesList.map(ele => (
          <List.Item
            title={ele.id}
            key={ele.id}
            left={() => <List.Icon icon={'bluetooth'} color={'blue'} />}
            description={ele.name || 'No Name'}
            onPress={() => setSelectedDevice(ele)}
          />
        ))}
      </List.Section>
      <Modal
        style={styles.modal}
        visible={Boolean(selectedDevice)}
        onDismiss={() => setSelectedDevice(null)}
        contentContainerStyle={styles.modalContent}>
        <Text>{JSON.stringify(selectedDevice, null, 2)}</Text>
      </Modal>
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
  modalContent: {
    backgroundColor: 'white',
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  modal: {
    position: 'absolute',
    top: 0,
    width: '100%',
    height: '100%',
  },
  ListSection: {
    marginBottom: 50,
  },
});

export default BluetoothPart;
