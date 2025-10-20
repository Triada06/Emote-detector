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
    <div className="mt-2 sm:mt-4 md:mt-8 text-center">
      <div className="relative inline-block">
        <button
          onClick={handleClick}
          disabled={!handsDetected || isProcessing}
          className={`relative p-2 sm:p-4 md:p-6 lg:p-8 rounded-lg sm:rounded-xl md:rounded-2xl font-black text-white text-sm sm:text-base md:text-lg transition-all duration-500 transform hover:scale-105 active:scale-95 border-2 ${
            handsDetected && !isProcessing
              ? "bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 hover:from-cyan-400 hover:via-purple-400 hover:to-pink-400 cursor-pointer shadow-2xl hover:shadow-cyan-500/50 border-cyan-400 hover:border-cyan-300"
              : "bg-gradient-to-r from-gray-700 to-gray-800 cursor-not-allowed opacity-50 shadow-lg border-gray-600"
          }`}
        >
          {handsDetected && !isProcessing && (
            <div className="absolute inset-0 rounded-lg sm:rounded-xl md:rounded-2xl bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 blur-xl opacity-50 animate-pulse"></div>
          )}

          {handsDetected && !isProcessing && (
            <div className="absolute inset-0 rounded-lg sm:rounded-xl md:rounded-2xl overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse"></div>
            </div>
          )}

          <div className="relative flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
            {isProcessing ? (
              <>
                <div className="w-6 h-6 sm:w-8 sm:h-8 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin"></div>
                <span className="font-mono tracking-wider">PROCESSING...</span>
              </>
            ) : (
              <>
                <span className="text-lg sm:text-xl md:text-2xl animate-bounce">📸</span>
                <span className="font-mono tracking-wider text-center sm:text-left">
                  CAPTURE GESTURE
                </span>
              </>
            )}
          </div>
        </button>

        {handsDetected && !isProcessing && (
          <div className="absolute inset-0 rounded-lg sm:rounded-xl md:rounded-2xl border-2 border-cyan-400/30 animate-ping"></div>
        )}

        <div className="absolute -top-1 sm:-top-2 -left-1 sm:-left-2 w-2 h-2 sm:w-4 sm:h-4 border-t-2 border-l-2 border-cyan-400"></div>
        <div className="absolute -top-1 sm:-top-2 -right-1 sm:-right-2 w-2 h-2 sm:w-4 sm:h-4 border-t-2 border-r-2 border-cyan-400"></div>
        <div className="absolute -bottom-1 sm:-bottom-2 -left-1 sm:-left-2 w-2 h-2 sm:w-4 sm:h-4 border-b-2 border-l-2 border-cyan-400"></div>
        <div className="absolute -bottom-1 sm:-bottom-2 -right-1 sm:-right-2 w-2 h-2 sm:w-4 sm:h-4 border-b-2 border-r-2 border-cyan-400"></div>
      </div>

      <div className="mt-2 sm:mt-4 md:mt-6 space-y-2 sm:space-y-3">
        <p
          className={`text-xs sm:text-sm font-bold transition-colors duration-300 font-mono tracking-wider ${
            handsDetected ? "text-green-400" : "text-cyan-300"
          }`}
        >
          {handsDetected
            ? "✅ HOLD GESTURE AND CLICK CAPTURE"
            : "👋 SHOW YOUR HAND TO ENABLE CAPTURE"}
        </p>

        {handsDetected && !isProcessing && (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 text-xs sm:text-sm text-cyan-400">
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
            <span className="font-mono tracking-wider text-center sm:text-left">
              SYSTEM READY - CLICK TO CAPTURE
            </span>
          </div>
        )}

        {isProcessing && (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 text-xs sm:text-sm text-yellow-400">
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-yellow-400 rounded-full animate-pulse shadow-lg shadow-yellow-400/50"></div>
            <span className="font-mono tracking-wider text-center sm:text-left">
              PROCESSING GESTURE...
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
