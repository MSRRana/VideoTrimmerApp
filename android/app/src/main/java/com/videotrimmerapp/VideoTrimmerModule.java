
package com.videotrimmerapp;

import android.media.MediaExtractor;
import android.media.MediaFormat;
import android.media.MediaMuxer;
import android.media.MediaCodec;
import android.util.Log;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.io.File;
import java.io.IOException;
import java.nio.ByteBuffer;

public class VideoTrimmerModule extends ReactContextBaseJavaModule {

    public VideoTrimmerModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "VideoTrimmer";
    }

    @ReactMethod
    public void trimVideo(String inputPath, String outputPath, double startTimeSec, double endTimeSec, Promise promise) {
        MediaExtractor extractor = new MediaExtractor();
        MediaMuxer muxer = null;

        try {
            extractor.setDataSource(inputPath);

            int videoTrackIndex = -1;
            for (int i = 0; i < extractor.getTrackCount(); i++) {
                MediaFormat format = extractor.getTrackFormat(i);
                String mime = format.getString(MediaFormat.KEY_MIME);
                if (mime.startsWith("video/")) {
                    videoTrackIndex = i;
                    break;
                }
            }

            if (videoTrackIndex == -1) {
                promise.reject("Error", "Video track not found");
                return;
            }

            extractor.selectTrack(videoTrackIndex);
            muxer = new MediaMuxer(outputPath, MediaMuxer.OutputFormat.MUXER_OUTPUT_MPEG_4);

            MediaFormat trackFormat = extractor.getTrackFormat(videoTrackIndex);
            int muxerTrackIndex = muxer.addTrack(trackFormat);
            muxer.start();

            extractor.seekTo((long) (startTimeSec * 1000000), MediaExtractor.SEEK_TO_CLOSEST_SYNC);

            ByteBuffer buffer = ByteBuffer.allocate(256 * 1024);
            MediaCodec.BufferInfo bufferInfo = new MediaCodec.BufferInfo();
            boolean done = false;

            while (!done) {
                bufferInfo.offset = 0;
                bufferInfo.size = extractor.readSampleData(buffer, 0);

                if (bufferInfo.size < 0) {
                    done = true;
                    bufferInfo.size = 0;
                } else {
                    long sampleTime = extractor.getSampleTime();
                    if (sampleTime > (long) (endTimeSec * 1000000)) {
                        done = true;
                    } else if (sampleTime >= (long) (startTimeSec * 1000000)) {
                        bufferInfo.presentationTimeUs = sampleTime;
                        bufferInfo.flags = extractor.getSampleFlags();
                        muxer.writeSampleData(muxerTrackIndex, buffer, bufferInfo);
                    }

                    extractor.advance();
                }
            }

            muxer.stop();
            muxer.release();
            extractor.release();

            promise.resolve("Video trimmed successfully!");

        } catch (Exception e) {
            if (muxer != null) {
                try {
                    muxer.release();
                } catch (IllegalStateException muxerError) {
                    promise.reject("MediaMuxerError", "MediaMuxer is in an invalid state: " + muxerError.getMessage());
                }
            }
            extractor.release();
            promise.reject("Error trimming video", e);
        }
    }
}