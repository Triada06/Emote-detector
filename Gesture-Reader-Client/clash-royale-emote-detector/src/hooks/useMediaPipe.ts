import { useEffect, useRef, useState } from "react";
import type { Landmark } from "../types";

interface UseMediaPipeProps {
  onHandsDetected: (landmarks: Landmark[][], handedness: any[]) => void;
  onHandsLost: () => void;
}

export const useMediaPipe = ({
  onHandsDetected,
  onHandsLost,
}: UseMediaPipeProps) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [handsDetected, setHandsDetected] = useState<boolean>(false);

  const drawConnectors = (
    ctx: CanvasRenderingContext2D,
    landmarks: Landmark[],
    connections: number[][],
    style: { color: string; lineWidth: number },
    canvasWidth: number,
    canvasHeight: number
  ) => {
    ctx.strokeStyle = style.color;
    ctx.lineWidth = style.lineWidth;

    for (const connection of connections) {
      const start = landmarks[connection[0]];
      const end = landmarks[connection[1]];

      ctx.beginPath();
      ctx.moveTo(start.x * canvasWidth, start.y * canvasHeight);
      ctx.lineTo(end.x * canvasWidth, end.y * canvasHeight);
      ctx.stroke();
    }
  };

  const drawLandmarks = (
    ctx: CanvasRenderingContext2D,
    landmarks: Landmark[],
    style: { color: string; lineWidth: number; radius: number },
    canvasWidth: number,
    canvasHeight: number
  ) => {
    ctx.fillStyle = style.color;

    for (const landmark of landmarks) {
      ctx.beginPath();
      ctx.arc(
        landmark.x * canvasWidth,
        landmark.y * canvasHeight,
        style.radius,
        0,
        2 * Math.PI
      );
      ctx.fill();
    }
  };

  const onResults = (results: any) => {
    const canvas = canvasRef.current;
    const video = videoRef.current;

    if (!canvas || !video) return;
    if (video.videoWidth === 0 || video.videoHeight === 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
      setHandsDetected(true);
      onHandsDetected(results.multiHandLandmarks, results.multiHandedness);

      for (const landmarks of results.multiHandLandmarks) {
        drawConnectors(
          ctx,
          landmarks,
          window.HAND_CONNECTIONS,
          {
            color: "#00FF00",
            lineWidth: 2,
          },
          canvas.width,
          canvas.height
        );

        drawLandmarks(
          ctx,
          landmarks,
          {
            color: "#FF0000",
            lineWidth: 1,
            radius: 3,
          },
          canvas.width,
          canvas.height
        );
      }
    } else {
      setHandsDetected(false);
      onHandsLost();
    }

    ctx.restore();
  };

  useEffect(() => {
    let hands: any = null;
    let camera: any = null;

    const initializeCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480 },
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;

          await new Promise<void>((resolve) => {
            if (videoRef.current) {
              videoRef.current.onloadedmetadata = () => {
                videoRef.current?.play();
                resolve();
              };
            }
          });
        }

        hands = new window.Hands({
          locateFile: (file: string) => {
            return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
          },
        });

        hands.setOptions({
          maxNumHands: 2,
          modelComplexity: 1,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5,
        });

        hands.onResults(onResults);

        camera = new window.Camera(videoRef.current, {
          onFrame: async () => {
            if (
              hands &&
              videoRef.current &&
              videoRef.current.readyState === 4
            ) {
              await hands.send({ image: videoRef.current });
            }
          },
          width: 640,
          height: 480,
        });

        camera.start();
        setIsLoading(false);
      } catch (err) {
        setError("Failed to access camera: " + (err as Error).message);
        setIsLoading(false);
      }
    };

    const loadScripts = () => {
      const scripts = [
        "https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js",
        "https://cdn.jsdelivr.net/npm/@mediapipe/control_utils/control_utils.js",
        "https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js",
        "https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js",
      ];

      let loadedCount = 0;

      scripts.forEach((src) => {
        const script = document.createElement("script");
        script.src = src;
        script.async = false;
        script.onload = () => {
          loadedCount++;
          if (loadedCount === scripts.length) {
            initializeCamera();
          }
        };
        script.onerror = () => {
          setError("Failed to load MediaPipe libraries");
          setIsLoading(false);
        };
        document.body.appendChild(script);
      });
    };

    loadScripts();

    return () => {
      if (camera) {
        camera.stop();
      }
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  return {
    videoRef,
    canvasRef,
    isLoading,
    error,
    handsDetected,
  };
};
