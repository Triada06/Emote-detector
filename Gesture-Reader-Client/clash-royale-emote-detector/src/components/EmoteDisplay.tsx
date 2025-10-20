import React from "react";
import type { EmoteResponse } from "../types";

interface EmoteDisplayProps {
  detectedEmote: EmoteResponse | null;
  isProcessing: boolean;
}

export const EmoteDisplay: React.FC<EmoteDisplayProps> = ({
  detectedEmote,
  isProcessing,
}) => {
  const isError = !!detectedEmote && detectedEmote.emote?.toLowerCase() === "error";
  const imageSrc = isError
    ? "/exclamationmark.png"
    : detectedEmote?.imageUrl || "/thumbs-up.jpeg";
  const displayDescription = isError
    ? "Failed to detect emote, please rearrange your hands"
    : detectedEmote?.description;
  return (
    <div className="relative bg-gradient-to-br from-gray-900 via-black to-gray-800 rounded-lg sm:rounded-xl md:rounded-2xl p-2 sm:p-4 md:p-8 text-center shadow-2xl border-2 border-cyan-500/30 overflow-hidden group cyber-container">
      <div className="absolute inset-0 opacity-20">
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-1 sm:gap-2 h-full">
          {Array.from({ length: 64 }).map((_, i) => (
            <div
              key={i}
              className="border border-cyan-500/20 animate-pulse"
              style={{ animationDelay: `${i * 0.05}s` }}
            ></div>
          ))}
        </div>
      </div>

      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent animate-pulse animation-delay-1000"></div>
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-center gap-2 sm:gap-3 mb-2 sm:mb-4 md:mb-6">
          <div className="w-2 h-2 sm:w-3 sm:h-3 bg-cyan-400 rounded-full animate-ping shadow-lg shadow-cyan-400/50"></div>
          <p className="text-cyan-300 text-xs sm:text-sm font-bold tracking-widest uppercase font-mono">
            EMOTE DETECTION STATUS
          </p>
          <div className="w-2 h-2 sm:w-3 sm:h-3 bg-purple-400 rounded-full animate-ping animation-delay-1000 shadow-lg shadow-purple-400/50"></div>
        </div>

        {detectedEmote ? (
          <div className="flex flex-col items-center gap-2 sm:gap-4 md:gap-6 animate-fade-in-up">
            <div className="relative group-hover:scale-110 transition-transform duration-500">
              <div className="absolute inset-0 bg-cyan-500/20 rounded-lg sm:rounded-xl md:rounded-2xl blur-2xl group-hover:blur-3xl transition-all duration-500"></div>
              <img
                src={imageSrc}
                alt={detectedEmote.emote}
                className="relative w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 object-contain bg-black/50 rounded-lg sm:rounded-xl md:rounded-2xl p-1 sm:p-2 md:p-4 shadow-2xl border-2 border-cyan-500/50"
                onError={(e) => {
                  e.currentTarget.src = "/exclamationmark.png";
                }}
              />
              <div className="absolute inset-0 rounded-lg sm:rounded-xl md:rounded-2xl border-2 border-cyan-400/70 animate-pulse"></div>
              <div className="absolute -inset-1 sm:-inset-2 rounded-lg sm:rounded-xl md:rounded-2xl border border-purple-400/30 animate-ping"></div>
            </div>
            <div className="space-y-2 sm:space-y-4">
              <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 mb-2 sm:mb-3 md:mb-4 animate-bounce">
                {detectedEmote.emote}
              </p>
              {detectedEmote.confidence && !isError && (
                <div className="bg-black/50 rounded-lg sm:rounded-xl md:rounded-2xl p-1 sm:p-2 md:p-3 inline-block border-2 border-cyan-500/50">
                  <p className="text-cyan-300 font-bold text-xs sm:text-sm font-mono tracking-wider">
                    CONFIDENCE: {(detectedEmote.confidence * 100).toFixed(0)}%
                  </p>
                </div>
              )}
              {(displayDescription || isError) && (
                <p className="text-cyan-200/90 text-xs sm:text-sm font-medium max-w-xs sm:max-w-md mx-auto font-mono">
                  {displayDescription}
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="py-6 sm:py-12">
            <div className="relative">
              <p className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-600 to-gray-400 animate-pulse">
                ---
              </p>
              <div className="absolute inset-0 text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-cyan-500/20 animate-ping">
                ---
              </div>
            </div>
            <p className="text-cyan-400/70 text-xs sm:text-sm mt-2 sm:mt-4 font-mono tracking-wider">
              NO EMOTE DETECTED YET
            </p>
          </div>
        )}

        {isProcessing && (
          <div className="mt-2 sm:mt-4 md:mt-8 flex items-center justify-center gap-2 sm:gap-4 animate-fade-in">
            <div className="w-4 h-4 sm:w-6 sm:h-6 border-2 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin"></div>
            <p className="text-cyan-300 text-xs sm:text-sm font-bold font-mono tracking-wider">
              PROCESSING GESTURE...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
