import React, {FunctionComponent, useMemo, useRef, useState} from 'react';
import {Image, Platform, ScrollView, StyleSheet, Text} from 'react-native';
import {Button} from 'react-native-paper';
import {
  checkMultiple,
  PERMISSIONS,
  requestMultiple,
} from 'react-native-permissions';
import {Camera, useCameraDevice} from 'react-native-vision-camera';
import {isIOS} from '@notifee/react-native/dist/utils';
import DeviceInfo from 'react-native-device-info';

interface OwnProps {
  onMessage: (message: string) => void;
}

type Props = OwnProps;

const ANDROID_CAMERA_PERMISSIONS = [
  PERMISSIONS.ANDROID.CAMERA,
  PERMISSIONS.ANDROID.RECORD_AUDIO,
];

const IOS_CAMERA_PERMISSIONS = [PERMISSIONS.IOS.CAMERA];

const CameraPart: FunctionComponent<Props> = props => {
  const {onMessage} = props;

  const currentPermissionStrategy =
    Platform.OS === 'ios' ? IOS_CAMERA_PERMISSIONS : ANDROID_CAMERA_PERMISSIONS;

  const cameraRef = useRef<Camera>(null);

  const device = useCameraDevice('front');

  const [canUseCamera, setCanUseCamera] = useState(false);
  // photo data
  const [photoData, setPhotoData] = useState('');

  const isIOSSimulator = isIOS && DeviceInfo.isEmulatorSync();

  const checkAndRequestPermisstion = async () =>
    new Promise(async (resolve, reject) => {
      let result = null;
      if (Platform.OS === 'ios') {
        result = await requestMultiple([PERMISSIONS.IOS.CAMERA]);
      } else {
        result = await requestMultiple([PERMISSIONS.ANDROID.CAMERA]);
      }
      if (handleMultiplePermissionsResult(Object.values(result))) {
        onMessage('Camera Permission Granted');
        resolve(true);
      } else {
        onMessage('Camera Permission Denied');
        reject(result);
      }
    });

  const handleMultiplePermissionsResult = (result: string[]): boolean => {
    // check ios permission, if camera and audio permission is granted, return true
    return result[0] === 'granted';
  };

  const requestCameraPermission = async () => {
    console.log('Request Camera Permission');
    try {
      let result = null;
      if (Platform.OS === 'ios') {
        result = await checkMultiple([
          PERMISSIONS.IOS.CAMERA,
          PERMISSIONS.IOS.MICROPHONE,
        ]);
      } else {
        result = await checkMultiple([
          PERMISSIONS.ANDROID.RECORD_AUDIO,
          PERMISSIONS.ANDROID.CAMERA,
        ]);
      }

      const combinedResult = handleMultiplePermissionsResult(
        Object.values(result),
      );

      if (combinedResult) {
        onMessage('Camera Permission Granted');
        setCanUseCamera(true);
      } else {
        const requestResult = await checkAndRequestPermisstion();
        if (requestResult) {
          setCanUseCamera(true);
        }
      }
    } catch (error) {
      console.log('Request Camera Permission Error:', error);
      onMessage('Request Camera Permission Error');
    }
  };

  const takePhoto = async () => {
    try {
      console.log('Take a photo');
      const photo = await cameraRef.current?.takePhoto({
        qualityPrioritization: 'speed',
      });
      const data = await photo?.path;
      console.log('Photo:', data);
      if (photo) {
        setPhotoData(data || '');
      }
    } catch (error) {
      console.log('Take a photo error:', error);
      onMessage('Take a photo error');
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

      <Button disabled={!canUseCamera} mode="contained" onPress={takePhoto}>
        <Text>Take a Photo</Text>
      </Button>

      {device && canUseCamera ? (
        <Camera
          ref={cameraRef}
          device={device}
          photo={true}
          isActive={true}
          audio={true}
          style={styles.camera}
        />
      ) : (
        <Text>Camera not available</Text>
      )}
      <Text style={styles.h4Title}>
        Step3: Show the photo when the photo is taken.
      </Text>
      {photoData && (
        <Image
          style={styles.image}
          source={{
            uri: `file://${photoData}`,
          }}
        />
      )}
      {isIOSSimulator && (
        <Text>
          note:The iOS simulator does not support the camera feature. Please use
          a real device to test the camera feature.
        </Text>
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
  camera: {
    bottom: 0,
    left: 0,
    width: 300,
    height: 300,
  },
  image: {
    width: 100,
    height: 100,
  },
});

export default CameraPart;
