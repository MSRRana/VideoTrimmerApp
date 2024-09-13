import React, {useState, useEffect} from 'react';
import {
  View,
  Button,
  Text,
  Alert,
  StyleSheet,
  PermissionsAndroid,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import Slider from '@react-native-community/slider';

const VideoPickerAndTrimmer = ({onTrimVideo}) => {
  const [video, setVideo] = useState(null);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(100); // Default end time as a percentage
  const [duration, setDuration] = useState(0);

  // Function to pick video from gallery
  const pickVideo = () => {
    launchImageLibrary({mediaType: 'video', includeBase64: false}, response => {
      if (response.didCancel) {
        Alert.alert('Cancelled', 'Video selection was cancelled');
      } else if (response.errorMessage) {
        Alert.alert('Error', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        const selectedVideo = response.assets[0];
        console.log(selectedVideo, 'selectedVideo=====>');
        setVideo({
          uri: selectedVideo.uri,
          fileName: selectedVideo.fileName,
          duration: selectedVideo.duration, // convert to seconds
        });
        setDuration(selectedVideo.duration); // Set the video duration
        setEndTime(selectedVideo.duration); // Set the end time to video length
      }
    });
  };

  const handleTrim = () => {
    if (video && startTime >= 0 && endTime > startTime && endTime <= duration) {
      onTrimVideo(video.uri, startTime, endTime);
    } else {
      Alert.alert('Error', 'Invalid trim range.');
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Pick a Video" onPress={pickVideo} />
      {video && (
        <View style={styles.videoInfo}>
          <Text>Selected Video: {video.fileName}</Text>
          <Text>Duration: {duration.toFixed(2)} seconds</Text>

          <Text>Start Time: {startTime.toFixed(2)}s</Text>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={duration}
            value={startTime}
            onValueChange={setStartTime}
            step={0.1} // Fine-tune step size for better control
            minimumTrackTintColor="#1EB1FC"
            maximumTrackTintColor="#d3d3d3"
          />

          <Text>End Time: {endTime.toFixed(2)}s</Text>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={duration}
            value={endTime}
            onValueChange={setEndTime}
            step={0.1}
            minimumTrackTintColor="#1EB1FC"
            maximumTrackTintColor="#d3d3d3"
          />

          <Button title="Trim Video" onPress={handleTrim} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  videoInfo: {
    marginTop: 20,
  },
  slider: {
    width: '100%',
    height: 40,
    marginVertical: 10,
  },
});

export default VideoPickerAndTrimmer;
