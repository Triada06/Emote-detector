import React from "react";

interface CaptureButtonProps {
  onCapture: () => void;
  handsDetected: boolean;
  isProcessing: boolean;
}

export const CaptureButton: React.FC<CaptureButtonProps> = ({
  onCapture,
  handsDetected,
  isProcessing,
}) => {
  const handleClick = () => {
    console.log("🔥 BUTTON CLICKED!", {
      handsDetected,
      isProcessing,
      buttonDisabled: !handsDetected || isProcessing,
    });

    if (!handsDetected) {
      console.log("❌ Button disabled: No hand detected");
      alert("❌ No hand detected! Show your hand to the camera first.");
      return;
    }
    if (isProcessing) {
      console.log("❌ Button disabled: Already processing");
      alert("❌ Already processing! Wait for current process to finish.");
      return;
    }
    console.log("✅ Button enabled, calling onCapture");
    onCapture();
  };

  return (
    <div className="mt-8 text-center">
      <div className="relative inline-block">
        <button
          onClick={handleClick}
          disabled={!handsDetected || isProcessing}
          className={`relative px-16 py-6 rounded-2xl font-black text-white text-xl transition-all duration-500 transform hover:scale-105 active:scale-95 border-2 ${
            handsDetected && !isProcessing
              ? "bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 hover:from-cyan-400 hover:via-purple-400 hover:to-pink-400 cursor-pointer shadow-2xl hover:shadow-cyan-500/50 border-cyan-400 hover:border-cyan-300"
              : "bg-gradient-to-r from-gray-700 to-gray-800 cursor-not-allowed opacity-50 shadow-lg border-gray-600"
          }`}
        >
          {handsDetected && !isProcessing && (
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 blur-xl opacity-50 animate-pulse"></div>
          )}

          {handsDetected && !isProcessing && (
            <div className="absolute inset-0 rounded-2xl overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse"></div>
            </div>
          )}

          <div className="relative flex items-center gap-4">
            {isProcessing ? (
              <>
                <div className="w-8 h-8 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin"></div>
                <span className="font-mono tracking-wider">PROCESSING...</span>
              </>
            ) : (
              <>
                <span className="text-3xl animate-bounce">📸</span>
                <span className="font-mono tracking-wider">
                  CAPTURE GESTURE
                </span>
              </>
            )}
          </div>
        </button>

        {handsDetected && !isProcessing && (
          <div className="absolute inset-0 rounded-2xl border-2 border-cyan-400/30 animate-ping"></div>
        )}

        <div className="absolute -top-2 -left-2 w-4 h-4 border-t-2 border-l-2 border-cyan-400"></div>
        <div className="absolute -top-2 -right-2 w-4 h-4 border-t-2 border-r-2 border-cyan-400"></div>
        <div className="absolute -bottom-2 -left-2 w-4 h-4 border-b-2 border-l-2 border-cyan-400"></div>
        <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b-2 border-r-2 border-cyan-400"></div>
      </div>

      <div className="mt-6 space-y-3">
        <p
          className={`text-sm font-bold transition-colors duration-300 font-mono tracking-wider ${
            handsDetected ? "text-green-400" : "text-cyan-300"
          }`}
        >
          {handsDetected
            ? "✅ HOLD GESTURE AND CLICK CAPTURE"
            : "👋 SHOW YOUR HAND TO ENABLE CAPTURE"}
        </p>

        {handsDetected && !isProcessing && (
          <div className="flex items-center justify-center gap-3 text-xs text-cyan-400">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
            <span className="font-mono tracking-wider">
              SYSTEM READY - CLICK TO CAPTURE
            </span>
          </div>
        )}

        {isProcessing && (
          <div className="flex items-center justify-center gap-3 text-xs text-yellow-400">
            <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse shadow-lg shadow-yellow-400/50"></div>
            <span className="font-mono tracking-wider">
              PROCESSING GESTURE...
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
