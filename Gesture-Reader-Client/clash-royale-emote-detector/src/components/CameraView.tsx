import React from "react";
import { Loader2, AlertCircle } from "lucide-react";

interface CameraViewProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  isLoading: boolean;
  error: string | null;
  handsDetected: boolean;
}

export const CameraView: React.FC<CameraViewProps> = ({
  videoRef,
  canvasRef,
  isLoading,
  error,
  handsDetected,
}) => {
  React.useEffect(() => {}, [handsDetected]);

  return (
    <div className="relative group h-full">
      <video ref={videoRef} className="hidden" playsInline />
      <div className="relative overflow-hidden rounded-lg sm:rounded-xl md:rounded-2xl shadow-2xl border-2 border-cyan-500/50 group-hover:border-cyan-400 transition-all duration-500 cyber-frame">
        <canvas
          ref={canvasRef}
          width={640}
          height={480}
          className="w-full rounded-lg sm:rounded-xl md:rounded-2xl transition-all duration-500 group-hover:scale-105"
          style={{ maxWidth: "100%", height: "auto" }}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent rounded-lg sm:rounded-xl md:rounded-2xl pointer-events-none"></div>
        <div className="absolute inset-0 border-2 border-cyan-500/20 rounded-lg sm:rounded-xl md:rounded-2xl pointer-events-none"></div>
      </div>

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 rounded-lg sm:rounded-xl md:rounded-2xl backdrop-blur-sm">
          <div className="text-center bg-black/90 p-2 sm:p-4 md:p-8 rounded-lg sm:rounded-xl md:rounded-2xl border-2 border-cyan-500/50 shadow-2xl max-w-xs sm:max-w-md">
            <div className="relative">
              <Loader2 className="w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 text-cyan-400 animate-spin mx-auto mb-2 sm:mb-4" />
              <div className="absolute inset-0 w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 border-2 sm:border-4 border-cyan-500/30 rounded-full animate-ping"></div>
            </div>
            <p className="text-cyan-300 font-bold text-sm sm:text-base md:text-lg tracking-wider">
              INITIALIZING CAMERA...
            </p>
            <p className="text-cyan-400/70 text-xs sm:text-sm mt-2 font-mono">
              PLEASE ALLOW CAMERA ACCESS
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 rounded-lg sm:rounded-xl md:rounded-2xl backdrop-blur-sm">
          <div className="text-center bg-red-900/90 p-2 sm:p-4 md:p-8 rounded-lg sm:rounded-xl md:rounded-2xl max-w-xs sm:max-w-md border-2 border-red-500/50 shadow-2xl">
            <div className="relative">
              <AlertCircle className="w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 text-red-400 mx-auto mb-2 sm:mb-4 animate-pulse" />
              <div className="absolute inset-0 w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 border-2 sm:border-4 border-red-500/50 rounded-full animate-ping"></div>
            </div>
            <p className="text-red-300 font-bold text-sm sm:text-base md:text-lg tracking-wider">
              {error}
            </p>
          </div>
        </div>
      )}

      <div className="absolute top-2 sm:top-4 right-2 sm:right-4 flex gap-2 sm:gap-3">
        <div
          className={`p-1 sm:p-2 md:p-4 rounded-lg sm:rounded-xl md:rounded-2xl text-xs sm:text-sm font-bold transition-all duration-500 transform hover:scale-110 border-2 ${
            handsDetected
              ? "bg-gradient-to-r from-green-500 to-emerald-500 text-black shadow-lg shadow-green-500/50 animate-pulse border-green-400"
              : "bg-gradient-to-r from-gray-700 to-gray-800 text-gray-300 shadow-lg border-gray-600"
          }`}
        >
          <div className="flex items-center gap-1 sm:gap-2">
            {handsDetected ? (
              <>
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-black rounded-full animate-ping"></div>
                <span className="font-mono tracking-wider hidden xs:inline">HAND DETECTED</span>
                <span className="font-mono tracking-wider xs:hidden">HAND ✓</span>
              </>
            ) : (
              <>
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full"></div>
                <span className="font-mono tracking-wider hidden xs:inline">NO HAND</span>
                <span className="font-mono tracking-wider xs:hidden">NO HAND</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
