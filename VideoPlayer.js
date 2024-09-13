import React from 'react';
import {requireNativeComponent, View, StyleSheet} from 'react-native';

const RCTVideoPlayer = requireNativeComponent('RCTVideoPlayer');

const VideoPlayer = ({videoUri, shouldLoop, play}) => {
  return (
    <View style={styles.container}>
      <RCTVideoPlayer
        style={styles.video}
        videoUri={videoUri}
        shouldLoop={shouldLoop}
        play={play}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 300, // Set height for the video player
    resizeMode: 'cover',
  },
  video: {
    width: '100%',
    height: '100%',
  },
});

export default VideoPlayer;
