import {Alert, PermissionsAndroid, Platform} from 'react-native';
import {PERMISSIONS} from 'react-native-permissions';

export const androidCameraPermission = () =>
  new Promise(async (resolve, reject) => {
    try {
      if (Platform.OS === 'android' && Platform.Version > 22) {
        if (Platform.Version >= 33) {
          const granted = await PermissionsAndroid.requestMultiple([
            PERMISSIONS.ANDROID.CAMERA,
            PERMISSIONS.ANDROID.READ_MEDIA_IMAGES,
            PERMISSIONS.ANDROID.READ_MEDIA_VIDEO,
            // PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
            // PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
          ]);
          if (
            granted['android.permission.READ_MEDIA_IMAGES'] !== 'granted' ||
            granted['android.permission.READ_MEDIA_VIDEO'] !== 'granted' ||
            granted['android.permission.CAMERA'] !== 'granted'
            // granted['android.permission.WRITE_EXTERNAL_STORAGE'] !== 'granted'
          ) {
            Alert.alert(
              'Alert',
              "Don't have permission to open camera",
              [{text: 'Okay'}],
              {cancelable: true},
            );
            return resolve(false);
            // alert(strings.DO_NOT_HAVE_PERMISSIONS_TO_SELECT_IMAGE);
          }
        } else {
          const granted = await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.CAMERA,
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          ]);
          if (
            granted['android.permission.CAMERA'] !== 'granted' ||
            granted['android.permission.WRITE_EXTERNAL_STORAGE'] !==
              'granted' ||
            granted['android.permission.READ_EXTERNAL_STORAGE'] !== 'granted'
          ) {
            Alert.alert(
              'Alert',
              "Don't have permission to open camera",
              [{text: 'Okay'}],
              {cancelable: true},
            );
            return resolve(false);
            // alert(strings.DO_NOT_HAVE_PERMISSIONS_TO_SELECT_IMAGE);
          }
        }
        return resolve(true);
      }

      return resolve(true);
    } catch (error) {
      return resolve(false);
    }
  });
