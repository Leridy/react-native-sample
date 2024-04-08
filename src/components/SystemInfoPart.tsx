/**
 * @file SystemInfoPart.tsx
 * @brief This file contains the system information part of the application.
 * @description get the system information and display it.
 */

import React, {FunctionComponent, useEffect, useState} from 'react';
import DeviceInfo from 'react-native-device-info';
import {ScrollView, StyleSheet, Text} from 'react-native';
import {DataTable} from 'react-native-paper';

interface OwnProps {}

type Props = OwnProps;

const SystemInfoPart: FunctionComponent<Props> = props => {
  const [systemInfo, setSystemInfo] = useState({});

  const handleGetSystemInfo = () => {
    // get system information
    const systemInfo = {
      DeviceName: DeviceInfo.getDeviceName(),
      DeviceId: DeviceInfo.getDeviceId(),
      Manufacturer: DeviceInfo.getManufacturer(),
      Model: DeviceInfo.getModel(),
      Brand: DeviceInfo.getBrand(),
      SystemName: DeviceInfo.getSystemName(),
      SystemVersion: DeviceInfo.getSystemVersion(),
      BundleId: DeviceInfo.getBundleId(),
      BuildNumber: DeviceInfo.getBuildNumber(),
      Version: DeviceInfo.getVersion(),
      ReadableVersion: DeviceInfo.getReadableVersion(),
      DeviceType: DeviceInfo.getDeviceType(),
      IsEmulator: DeviceInfo.isEmulator(),
      IsTablet: DeviceInfo.isTablet(),
      IsPinOrFingerprintSet: DeviceInfo.isPinOrFingerprintSet(),
      HasNotch: DeviceInfo.hasNotch(),
    };
    setSystemInfo(systemInfo);
  };

  useEffect(() => {
    handleGetSystemInfo();
  }, []);

  const handleObjectValues = (value: any) => {
    if (typeof value !== 'object') {
      return String(value).toString();
    }
    return JSON.stringify(value);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>System Information</Text>
      <DataTable>
        <DataTable.Header>
          <DataTable.Title>Key</DataTable.Title>
          <DataTable.Title>Value</DataTable.Title>
        </DataTable.Header>
        {Object.entries(systemInfo).map(([key, value]) => (
          <DataTable.Row key={key}>
            <DataTable.Cell>{key}</DataTable.Cell>
            <DataTable.Cell>{handleObjectValues(value)}</DataTable.Cell>
          </DataTable.Row>
        ))}
      </DataTable>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '60%',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    height: 50,
    color: 'black',
  },
});

export default SystemInfoPart;
