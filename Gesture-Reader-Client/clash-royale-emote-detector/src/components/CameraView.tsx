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
      <div className="relative overflow-hidden rounded-2xl shadow-2xl border-2 border-cyan-500/50 group-hover:border-cyan-400 transition-all duration-500 cyber-frame">
        <canvas
          ref={canvasRef}
          width={640}
          height={480}
          className="w-full rounded-2xl transition-all duration-500 group-hover:scale-105"
          style={{ maxWidth: "100%", height: "auto" }}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent rounded-2xl pointer-events-none"></div>
        <div className="absolute inset-0 border-2 border-cyan-500/20 rounded-2xl pointer-events-none"></div>
      </div>

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 rounded-2xl backdrop-blur-sm">
          <div className="text-center bg-black/90 p-8 rounded-2xl border-2 border-cyan-500/50 shadow-2xl">
            <div className="relative">
              <Loader2 className="w-16 h-16 text-cyan-400 animate-spin mx-auto mb-4" />
              <div className="absolute inset-0 w-16 h-16 border-4 border-cyan-500/30 rounded-full animate-ping"></div>
            </div>
            <p className="text-cyan-300 font-bold text-lg tracking-wider">
              INITIALIZING CAMERA...
            </p>
            <p className="text-cyan-400/70 text-sm mt-2 font-mono">
              PLEASE ALLOW CAMERA ACCESS
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 rounded-2xl backdrop-blur-sm">
          <div className="text-center bg-red-900/90 p-8 rounded-2xl max-w-md border-2 border-red-500/50 shadow-2xl">
            <div className="relative">
              <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4 animate-pulse" />
              <div className="absolute inset-0 w-16 h-16 border-4 border-red-500/50 rounded-full animate-ping"></div>
            </div>
            <p className="text-red-300 font-bold text-lg tracking-wider">
              {error}
            </p>
          </div>
        </div>
      )}

      <div className="absolute top-4 right-4 flex gap-3">
        <div
          className={`px-4 py-2 rounded-lg text-sm font-bold transition-all duration-500 transform hover:scale-110 border-2 ${
            handsDetected
              ? "bg-gradient-to-r from-green-500 to-emerald-500 text-black shadow-lg shadow-green-500/50 animate-pulse border-green-400"
              : "bg-gradient-to-r from-gray-700 to-gray-800 text-gray-300 shadow-lg border-gray-600"
          }`}
        >
          <div className="flex items-center gap-2">
            {handsDetected ? (
              <>
                <div className="w-2 h-2 bg-black rounded-full animate-ping"></div>
                <span className="font-mono tracking-wider">HAND DETECTED</span>
              </>
            ) : (
              <>
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                <span className="font-mono tracking-wider">NO HAND</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
