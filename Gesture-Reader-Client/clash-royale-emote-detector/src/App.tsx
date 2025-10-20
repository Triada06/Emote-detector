import React, { useState } from "react";
import { Hand } from "lucide-react";
import { useMediaPipe } from "./hooks/useMediaPipe";
import { useEmoteDetection } from "./hooks/useEmoteDetection";
import { CameraView } from "./components/CameraView";
import { EmoteDisplay } from "./components/EmoteDisplay";
import { Instructions } from "./components/Instructions";

const EmoteDetector: React.FC = () => {
  const [backendUrl] = useState<string>(
    (import.meta as any)?.env?.VITE_DETECT_EMOTE_URL ??

      "http://localhost:5000/api/emote/detect"
  );

  const { detectedEmote, isProcessing, handleHandsDetected, handleHandsLost } =
    useEmoteDetection({ backendUrl });

  const { videoRef, canvasRef, isLoading, error, handsDetected } = useMediaPipe(
    {
      onHandsDetected: handleHandsDetected,
      onHandsLost: handleHandsLost,
    }
  );

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-2 sm:p-4 md:p-6 lg:p-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-800"></div>
      <div className="absolute inset-0 opacity-20">
        <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-12 gap-2 sm:gap-4 h-full">
          {Array.from({ length: 144 }).map((_, i) => (
            <div
              key={i}
              className="border border-cyan-500/10 animate-pulse"
              style={{ animationDelay: `${i * 0.1}s` }}
            ></div>
          ))}
        </div>
      </div>

      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 sm:-top-40 -right-20 sm:-right-40 w-40 sm:w-80 h-40 sm:h-80 bg-cyan-500 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-20 sm:-bottom-40 -left-20 sm:-left-40 w-40 sm:w-80 h-40 sm:h-80 bg-purple-500 rounded-full filter blur-3xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 sm:w-96 h-48 sm:h-96 bg-pink-500 rounded-full filter blur-3xl opacity-10 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="max-w-7xl w-full relative z-10">
        <div className="text-center mb-2 sm:mb-4 md:mb-6 animate-fade-in">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 mb-2 sm:mb-4 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 animate-slide-down">
            <div className="p-2 sm:p-3 md:p-4 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg sm:rounded-xl md:rounded-2xl lg:rounded-3xl shadow-2xl animate-bounce border-2 border-cyan-400/50">
              <Hand className="w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 text-white" />
            </div>
            <span className="cyber-text text-center sm:text-left">CLASH ROYALE EMOTE DETECTOR</span>
          </h1>
          <p className="text-cyan-300 text-sm sm:text-base md:text-lg font-medium animate-fade-in-up animation-delay-500 tracking-wider">
            Show Your Hands 🎮
          </p>
        </div>

        <div className="bg-black/80 backdrop-blur-xl rounded-lg sm:rounded-xl md:rounded-2xl lg:rounded-3xl shadow-2xl p-2 sm:p-4 md:p-6 lg:p-8 border-2 border-cyan-500/30 hover:border-cyan-400/50 transition-all duration-500 animate-slide-up cyber-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 sm:gap-4 md:gap-6 lg:gap-8 items-stretch">
            <div className="flex min-h-[300px] sm:min-h-[400px] md:min-h-[480px]">
              <div className="flex-1 flex items-stretch">
                <CameraView
                  videoRef={videoRef}
                  canvasRef={canvasRef}
                  isLoading={isLoading}
                  error={error}
                  handsDetected={handsDetected}
                />
              </div>
            </div>

            <div className="flex min-h-[300px] sm:min-h-[400px] md:min-h-[480px]">
              <div className="flex-1 flex items-stretch">
                <EmoteDisplay
                  detectedEmote={detectedEmote}
                  isProcessing={isProcessing}
                />
              </div>
            </div>
          </div>
          <div className="mt-4">
            <Instructions />
          </div>
        </div>

        <div className="text-center mt-2 sm:mt-4 md:mt-6 animate-fade-in-up animation-delay-1000">
          <p className="text-cyan-400 text-xs sm:text-sm font-mono tracking-wider">
            Backend URL:{" "}
            <span className="bg-black/50 p-1 sm:p-2 md:p-3 rounded-lg sm:rounded-xl md:rounded-2xl border border-cyan-500/50 text-cyan-300 break-all">
              {backendUrl}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmoteDetector;
