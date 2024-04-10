import React, {FunctionComponent, useState} from 'react';
import {Platform, ScrollView, StyleSheet, Text} from 'react-native';
import {Button} from 'react-native-paper';
import {PERMISSIONS} from 'react-native-permissions';
import {checkAllPermissionsGranted, requestAllPermissions} from '../utils.ts';
import Geolocation, {
  GeolocationResponse,
} from '@react-native-community/geolocation';
import WebView from 'react-native-webview';

interface OwnProps {
  onMessage: (message: string) => void;
}

type Props = OwnProps;

const ANDROID_GEOLOCATION_PERMISSIONS = [
  PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
  PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION,
  PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
];

const IOS_GEOLOCATION_PERMISSIONS = [
  PERMISSIONS.IOS.LOCATION_ALWAYS,
  PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
];

const GeoLocationPart: FunctionComponent<Props> = props => {
  const {onMessage} = props;
  const [allowGetLocation, setAllowGetLocation] = useState(false);
  const [currentLocation, setCurrentLocation] =
    useState<GeolocationResponse | null>(null);

  const currentPermissionStrategy =
    Platform.OS === 'ios'
      ? IOS_GEOLOCATION_PERMISSIONS
      : ANDROID_GEOLOCATION_PERMISSIONS;

  const checkAndRequestPermission = async () => {
    try {
      // check permissions
      const checkResult = await checkAllPermissionsGranted(
        currentPermissionStrategy,
      );
      if (checkResult) {
        onMessage('Geo-location Permission Granted');
      } else {
        // request permissions
        const requestResult = await requestAllPermissions(
          currentPermissionStrategy,
        );
        console.log('Request Permission Result:', requestResult);
        if (requestResult) {
          onMessage('Geo-location Permission Granted');
        }
      }
      setAllowGetLocation(true);
    } catch (error) {
      console.log('Check and Request Permission Error:', error);
      onMessage(`Check and Request Permission Error ${JSON.stringify(error)}`);
    }
  };

  const asyncGetLocation = async (): Promise<GeolocationResponse> => {
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        position => {
          resolve(position);
        },
        error => {
          reject(error);
        },
      );
    });
  };

  const handleGetCurrentLocation = async () => {
    // get current location
    onMessage('Get the current location');
    try {
      const result = await asyncGetLocation();
      console.log('Current Location:', result);
      setCurrentLocation(result);
    } catch (error) {
      console.log('Get Current Location Error:', error);
      onMessage(`Get Current Location Error ${JSON.stringify(error)}`);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.h2Title}>Geo-location</Text>
      <Text style={styles.h4Title}>
        Step1: Requires the Geo-location permission.
      </Text>
      <Button mode="contained" onPress={checkAndRequestPermission}>
        <Text>Request Geo-location Permission</Text>
      </Button>
      <Text style={styles.h4Title}>Step2: Get the current location.</Text>
      <Button
        mode="contained"
        disabled={!allowGetLocation}
        onPress={handleGetCurrentLocation}>
        <Text>Get the current location</Text>
      </Button>
      <Text style={styles.h4Title}>
        Step3: Show the current location when the location is obtained.
      </Text>
      {currentLocation && (
        <Text>
          {`Latitude: ${currentLocation.coords.latitude}, Longitude: ${currentLocation.coords.longitude}`}
        </Text>
      )}
      {currentLocation && (
        <WebView
          style={styles.webView}
          source={{
            // use bing map to show the location
            uri: `https://www.bing.com/maps?q=${currentLocation.coords.latitude},${currentLocation.coords.longitude}`,
          }}
        />
      )}
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
  webView: {
    marginTop: 20,
    height: 300,
    width: '100%',
    marginBottom: 100,
  },
});
export default GeoLocationPart;
