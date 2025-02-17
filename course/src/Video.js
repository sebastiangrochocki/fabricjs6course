import React, { useState, useEffect, useRef } from "react";
import { Image as FabricImage } from "fabric";
import { IconButton, Button } from "blocksin-system";
import { VideoCameraIcon, PlayIcon, StopIcon } from "sebikostudio-icons";

function Video({ canvas, canvasRef }) {
  const [videoSrc, setVideoSrc] = useState(null);
  const [fabricVideo, setFabricVideo] = useState(null);
  const [recordingChunks, setRecordingChunks] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [loadedPercentage, setLoadedPercentage] = useState(0);
  const [uploadMessage, setUploadMessage] = useState("");
  const [recordingTime, setRecordingTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);
  const fileInputRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordingIntervalRef = useRef(null);

  const handleVideoUpload = (event) => {
    const file = event.target.files[0];

    if (file) {
      setLoadedPercentage(0);
      setVideoSrc(null);
      setUploadMessage("");

      const url = URL.createObjectURL(file);
      setVideoSrc(url);
      const videoElement = document.createElement("video");
      videoElement.src = url;
      videoElement.crossOrigin = "anonymous";

      videoElement.addEventListener("loadeddata", () => {
        const videoWidth = videoElement.videoWidth;
        const videoHeight = videoElement.videoHeight;
        videoElement.width = videoWidth;
        videoElement.height = videoHeight;

        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;

        const scale = Math.min(
          canvasWidth / videoWidth,
          canvasHeight / videoHeight
        );

        canvas.renderAll();

        const fabricImage = new FabricImage(videoElement, {
          left: 0,
          top: 0,
          scaleX: scale,
          scaleY: scale,
        });

        setFabricVideo(fabricImage);
        canvas.add(fabricImage);
        canvas.renderAll();

        setUploadMessage("Uploaded");
        setTimeout(() => {
          setUploadMessage("");
        }, 3000);
      });

      videoElement.addEventListener("progress", () => {
        if (videoElement.buffered.length > 0) {
          const bufferedEnd = videoElement.buffered.end(
            videoElement.buffered.length - 1
          );
          const duration = videoElement.duration;
          if (duration > 0) {
            setLoadedPercentage((bufferedEnd / duration) * 100);
          }
        }
      });

      videoElement.addEventListener("error", (error) => {
        console.error("Video load error:", error);
      });

      videoRef.current = videoElement;
    }
  };

  const handlePlayPauseVideo = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        const updateCanvas = () => {
          if (!videoRef.current.paused) {
            fabricVideo.setElement(videoRef.current);
            canvas.renderAll();
            requestAnimationFrame(updateCanvas);
          }
        };
        videoRef.current.play();
        requestAnimationFrame(updateCanvas);
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const handleStopVideo = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      setIsPlaying(false);
      canvas.renderAll();
    }
  };

  const handleVideoUploadButtonClick = () => {
    fileInputRef.current.click();
  };

  //   Recording
  const handleStartRecording = () => {
    const stream = canvasRef.current.captureStream();
    mediaRecorderRef.current = new MediaRecorder(stream, {
      mimeType: "video/webm; codecs=vp9", // Use webm format for recording
    });
    mediaRecorderRef.current.ondataavailable = handleDataAvailable;
    mediaRecorderRef.current.start();
    setIsRecording(true);

    canvas.getObjects().forEach((obj) => {
      obj.hasControls = false;
      obj.selectable = true;
    });
    canvas.renderAll();

    setRecordingTime(0);
    recordingIntervalRef.current = setInterval(() => {
      setRecordingTime((prev) => prev + 1);
    }, 1000);
  };

  const handleStopRecording = () => {
    mediaRecorderRef.current.stop();
    setIsRecording(false);

    canvas.getObjects().forEach((obj) => {
      obj.hasControls = true; // Show controls again
    });
    canvas.renderAll();

    clearInterval(recordingIntervalRef.current);
  };

  const handleDataAvailable = (event) => {
    if (event.data.size > 0) {
      setRecordingChunks((prev) => [...prev, event.data]);
    }
  };

  const handleExportVideo = () => {
    const blob = new Blob(recordingChunks, {
      type: "video/webm", // Save as webm format
    });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = "canvas-video.webm";
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
    setRecordingChunks([]);
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        style={{ display: "none" }}
        accept="video/mp4"
        onChange={handleVideoUpload}
      />
      <IconButton
        onClick={handleVideoUploadButtonClick}
        variant="ghost"
        size="medium"
      >
        <VideoCameraIcon />
      </IconButton>

      {videoSrc && (
        <div className="bottom transform darkmode">
          <div className="Toolbar">
            <Button
              onClick={handlePlayPauseVideo}
              variant="ghost"
              size="medium"
            >
              {isPlaying ? "Pause Video" : "Play Video"}
            </Button>
            <Button onClick={handleStopVideo} variant="ghost" size="medium">
              Stop
            </Button>
          </div>
          <div className="Toolbar">
            {uploadMessage && (
              <div className="progress-bar">
                <div
                  className="progress"
                  style={{ width: `${loadedPercentage}%` }}
                ></div>
              </div>
            )}

            {uploadMessage && (
              <div className="upload-message">{uploadMessage}</div>
            )}

            <Button
              onClick={isRecording ? handleStopRecording : handleStartRecording}
              variant="ghost"
              size="medium"
              showBadge={isRecording}
              badgeLabel={new Date(recordingTime * 1000)
                .toISOString()
                .substr(11, 8)}
            >
              {isRecording ? (
                <>
                  <StopIcon /> End
                </>
              ) : (
                <>
                  <PlayIcon /> Record
                </>
              )}
            </Button>

            <Button
              onClick={handleExportVideo}
              disabled={!recordingChunks.length}
            >
              Export Video
            </Button>
          </div>
        </div>
      )}
    </>
  );
}

export default Video;
