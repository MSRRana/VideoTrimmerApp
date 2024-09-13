import React, {useEffect} from 'react';
import {View, Alert} from 'react-native';
import {
  NativeModules,
  PermissionsAndroid,
  Platform,
  Linking,
} from 'react-native';
import VideoPickerAndTrimmer from './VideoPickerAndTrimmer'; // The component created above
import RNFS from 'react-native-fs';
import {request, PERMISSIONS} from 'react-native-permissions';
import {androidCameraPermission} from './premission';
const {VideoTrimmer} = NativeModules;

const RequestStoragePermission = async () => {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      ]);

      if (
        granted[PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE] ===
          PermissionsAndroid.RESULTS.GRANTED &&
        granted[PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE] ===
          PermissionsAndroid.RESULTS.GRANTED
      ) {
        return true;
      } else if (
        granted[PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE] ===
          PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN ||
        granted[PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE] ===
          PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN
      ) {
        Alert.alert(
          'Permission required',
          'Storage permission is required to save the video. Please enable it in the app settings.',
          [
            {text: 'Cancel', style: 'cancel'},
            {text: 'Open Settings', onPress: openAppSettings},
          ],
        );
        return false;
      } else {
        Alert.alert(
          'Permission denied',
          'Storage permission is required to save the video.',
        );
        return false;
      }
    } catch (err) {
      console.warn(err);
      return false;
    }
  } else {
    return true; // For iOS or other platforms
  }
};

const openAppSettings = () => {
  Linking.openSettings().catch(() => {
    Alert.alert('Error', 'Unable to open app settings');
  });
};

// Generate a valid output path for the trimmed video
const generateOutputPath = () => {
  const directoryPath = RNFS.DocumentDirectoryPath;
  const fileName = `trimmed_video_${Date.now()}.mp4`;
  return `${directoryPath}/${fileName}`;
};

// Move trimmed video to public file manager folder
const saveTrimmedVideoToFileManager = async trimmedVideoPath => {
  // const hasPermission = await requestAccessPermissions();

  // if (!hasPermission) {
  //   Alert.alert(
  //     'Permission Denied',
  //     'Storage permission is required to save the video.',
  //   );
  //   return;
  // }

  const destinationPath = `${
    RNFS.DownloadDirectoryPath
  }/trimmed_video_${Date.now()}.mp4`;

  try {
    await RNFS.moveFile(trimmedVideoPath, destinationPath);
    Alert.alert('Success', `Video saved to: ${destinationPath}`);
  } catch (error) {
    console.error('Error saving video: ', error);
    Alert.alert('Error', 'Failed to save the video.');
  }
};

// Trim and save video
const handleTrimVideo = async (videoUri, startTime, endTime) => {
  const outputPath = generateOutputPath();

  try {
    await VideoTrimmer.trimVideo(videoUri, outputPath, startTime, endTime);
    await saveTrimmedVideoToFileManager(outputPath);
  } catch (error) {
    Alert.alert('Error', error.message);
  }
};

const App = () => {
  const requestAccessPermissions = async () => {
    const res = await androidCameraPermission();

    console.log(res, 'res=====>');
  };
  useEffect(() => {
    requestAccessPermissions();
    // RequestStoragePermission();
  }, []);
  return (
    <View style={{flex: 1}}>
      <VideoPickerAndTrimmer onTrimVideo={handleTrimVideo} />
    </View>
  );
};

export default App;
