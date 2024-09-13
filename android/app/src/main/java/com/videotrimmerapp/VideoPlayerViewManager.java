package com.videotrimmerapp;

import android.content.Context;
import android.widget.VideoView;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.uimanager.ViewGroupManager;

public class VideoPlayerViewManager extends SimpleViewManager<VideoView> {

    public static final String REACT_CLASS = "RCTVideoPlayer";

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    protected VideoView createViewInstance(ThemedReactContext reactContext) {
        return new VideoView(reactContext);
    }

    // Set the video URI prop for React Native
    @ReactProp(name = "videoUri")
    public void setVideoUri(VideoView view, String videoUri) {
        view.setVideoPath(videoUri);
        view.start();
    }

    // Set whether video should loop
    @ReactProp(name = "shouldLoop")
    public void setShouldLoop(VideoView view, boolean shouldLoop) {
        view.setOnCompletionListener(mediaPlayer -> {
            if (shouldLoop) {
                view.start();
            }
        });
    }

    // Add play and pause functionalities
    @ReactProp(name = "play")
    public void playVideo(VideoView view, boolean play) {
        if (play) {
            view.start();
        } else {
            view.pause();
        }
    }
}
