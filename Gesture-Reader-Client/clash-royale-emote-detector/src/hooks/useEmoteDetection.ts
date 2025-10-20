import { useState, useRef } from "react";
import type { Landmark, HandPayload, EmoteResponse } from "../types";

interface UseEmoteDetectionProps {
  backendUrl: string;
}

export const useEmoteDetection = ({ backendUrl }: UseEmoteDetectionProps) => {
  const [detectedEmote, setDetectedEmote] = useState<EmoteResponse | null>(
    null
  );
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const lastCaptureTime = useRef<number>(0);
  const noHandResetTimer = useRef<number | null>(null);
  const currentHandData = useRef<{
    landmarks: Landmark[][];
    handedness: any[];
  } | null>(null);

  const sendToBackend = async (landmarks: Landmark[][], handedness: any[]) => {
    setIsProcessing(true);

    try {
      const handData: HandPayload = {
        hands: landmarks.map((hand, index) => ({
          landmarks: hand.map((lm) => ({
            x: lm.x,
            y: lm.y,
            z: lm.z,
          })),
          handedness: handedness[index].label,
          score: handedness[index].score,
        })),
        timestamp: Date.now(),
      };

      const response = await fetch(backendUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "cors",
        body: JSON.stringify(handData),
      });

      if (response.ok) {
        const result: EmoteResponse = await response.json();
        if (result.emote) {
          setDetectedEmote(result);
        }
      } else {
        console.error("Backend error:", response.status, response.statusText);
      }
    } catch (err) {
      console.error("Failed to send data to backend:", err);
    } finally {
      setTimeout(() => {
        setIsProcessing(false);
      }, 1000);
    }
  };

  const handleHandsDetected = (landmarks: Landmark[][], handedness: any[]) => {
    currentHandData.current = { landmarks, handedness };

    if (noHandResetTimer.current) {
      window.clearTimeout(noHandResetTimer.current);
      noHandResetTimer.current = null;
    }

    const now = Date.now();
    if (!isProcessing && now - lastCaptureTime.current > 3000) {
      lastCaptureTime.current = now;
      sendToBackend(landmarks, handedness);
    }
  };

  const handleHandsLost = () => {
    if (noHandResetTimer.current) return;
    noHandResetTimer.current = window.setTimeout(() => {
      setDetectedEmote(null);
      noHandResetTimer.current = null;
    }, 3000);
  };

  const captureGesture = () => {
    if (currentHandData.current && !isProcessing) {
      const now = Date.now();
      if (now - lastCaptureTime.current > 3000) {
        lastCaptureTime.current = now;
        sendToBackend(
          currentHandData.current.landmarks,
          currentHandData.current.handedness
        );
      }
    }
  };

  return {
    detectedEmote,
    isProcessing,
    handleHandsDetected,
    handleHandsLost,
    captureGesture,
  };
};
