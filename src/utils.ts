import {
  checkMultiple,
  Permission,
  requestMultiple,
} from 'react-native-permissions';

/**
 * checkAllPermissionsGranted
 */
export const checkAllPermissionsGranted = async (
  permissions: Permission[],
): Promise<boolean> => {
  return new Promise(async (resolve, reject) => {
    try {
      let result = await checkMultiple(permissions);
      if (Object.values(result).every(permission => permission === 'granted')) {
        resolve(true);
      } else {
        console.log('Check Permissions Denied:', result, permissions);
        resolve(false);
      }
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * requestAllPermissions
 */
export const requestAllPermissions = async (
  permissions: Permission[],
): Promise<boolean> => {
  return new Promise(async (resolve, reject) => {
    let result = await requestMultiple(permissions);
    console.log('Request Permissions Result:', result);
    if (Object.values(result).every(permission => permission === 'granted')) {
      resolve(true);
    } else {
      reject(result);
    }
  });
};
