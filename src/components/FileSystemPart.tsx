import React, {FunctionComponent, useState} from 'react';
import {Image, Platform, ScrollView, StyleSheet, Text} from 'react-native';
import {Button, List, Modal} from 'react-native-paper';
import {PERMISSIONS} from 'react-native-permissions';
import {checkAllPermissionsGranted, requestAllPermissions} from '../utils.ts';
import DocumentPicker, {
  DocumentPickerResponse,
} from 'react-native-document-picker';

interface OwnProps {
  onMessage: (message: string) => void;
}

type Props = OwnProps;

const ANDROID_FILE_SYSTEM_PERMISSIONS = [
  PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
  PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
];

const IOS_FILE_SYSTEM_PERMISSIONS = [
  // PERMISSIONS.IOS.MEDIA_LIBRARY,
  PERMISSIONS.IOS.PHOTO_LIBRARY,
];

const FileSystemPart: FunctionComponent<Props> = props => {
  const {onMessage} = props;

  const [allowHandleFile, setAllowHandleFile] = useState(false);
  const [fileContent, setFileContent] = useState<
    DocumentPickerResponse[] | null
  >([]);
  const [showFileDetails, setShowFileDetails] =
    useState<DocumentPickerResponse | null>(null);

  const currentPermissionStrategy =
    Platform.OS === 'ios'
      ? IOS_FILE_SYSTEM_PERMISSIONS
      : ANDROID_FILE_SYSTEM_PERMISSIONS;

  /**
   * request file access
   */
  const checkAndRequestFilePermisstion = async () => {
    // check
    try {
      const checkResult = await checkAllPermissionsGranted(
        currentPermissionStrategy,
      );
      if (checkResult) {
        onMessage('File System Permission Granted');
      } else {
        const requestResult = await requestAllPermissions(
          currentPermissionStrategy,
        );
        if (requestResult) {
          onMessage('File System Permission Granted');
        }
      }
      setAllowHandleFile(true);
    } catch (error) {
      console.log('File System Permission Denied', error);
      onMessage(`File System Permission Denied ${JSON.stringify(error)}`);
    }
  };

  const asyncSelectFile = async (): Promise<DocumentPickerResponse[]> => {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await DocumentPicker.pick({
          type: [DocumentPicker.types.allFiles],
        });

        if (res) {
          resolve(res);
        } else {
          reject(false);
        }
      } catch (e) {
        console.log('Select File Error:', e);
        reject(e);
      }
    });
  };

  const handleSelectedFile = async () => {
    try {
      const file = await asyncSelectFile();
      setFileContent(file);
    } catch (error) {
      console.log('Select File Error:', error);
      onMessage('Select File Failed');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.h2Title}>File System</Text>
      <Text style={styles.h4Title}>
        Step1: Requires the File System permission.
      </Text>
      <Button mode="contained" onPress={checkAndRequestFilePermisstion}>
        <Text>Request File System Permission</Text>
      </Button>
      <Text style={styles.h4Title}>Step2: Do a file system operation.</Text>
      <Button
        mode="contained"
        disabled={!allowHandleFile}
        onPress={handleSelectedFile}>
        <Text>Do a file system operation</Text>
      </Button>

      <Text style={styles.h4Title}>
        Step3: Show the file information of file you selected.
      </Text>

      <List.Section
        title="Selected File Information"
        titleStyle={{color: 'black'}}
        style={{backgroundColor: 'white', minHeight: '30%'}}>
        {fileContent?.map((file, index) => (
          <List.Item
            key={index}
            title={file.name}
            onPress={() => {
              setShowFileDetails(file);
            }}
            description={`${file.type} ${
              file.size && Math.ceil(file.size / 1024 / 1024)
            }MB`}
            left={p => <List.Icon {...p} icon="file" />}
          />
        ))}
      </List.Section>
      <Modal
        style={styles.modal}
        visible={Boolean(showFileDetails)}
        onDismiss={() => setShowFileDetails(null)}>
        {showFileDetails?.type?.includes('image') && (
          <Image style={styles.image} source={{uri: showFileDetails.uri}} />
        )}
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    color: 'black',
    height: '100%',
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
  modal: {
    position: 'absolute',
    top: 0,
    width: '100%',
    height: '100%',
    padding: 20,
  },
  image: {
    width: '100%',
    height: '80%',
  },
});

export default FileSystemPart;
