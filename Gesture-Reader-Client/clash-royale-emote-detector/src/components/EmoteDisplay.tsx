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
  return (
    <div className="relative bg-gradient-to-br from-gray-900 via-black to-gray-800 rounded-2xl p-8 text-center shadow-2xl border-2 border-cyan-500/30 overflow-hidden group cyber-container">
      <div className="absolute inset-0 opacity-20">
        <div className="grid grid-cols-8 gap-2 h-full">
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
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-3 h-3 bg-cyan-400 rounded-full animate-ping shadow-lg shadow-cyan-400/50"></div>
          <p className="text-cyan-300 text-sm font-bold tracking-widest uppercase font-mono">
            EMOTE DETECTION STATUS
          </p>
          <div className="w-3 h-3 bg-purple-400 rounded-full animate-ping animation-delay-1000 shadow-lg shadow-purple-400/50"></div>
        </div>

        {detectedEmote ? (
          <div className="flex flex-col items-center gap-6 animate-fade-in-up">
            <div className="relative group-hover:scale-110 transition-transform duration-500">
              <div className="absolute inset-0 bg-cyan-500/20 rounded-2xl blur-2xl group-hover:blur-3xl transition-all duration-500"></div>
              <img
                src={detectedEmote.imageUrl}
                alt={detectedEmote.emote}
                className="relative w-40 h-40 object-contain bg-black/50 rounded-2xl p-4 shadow-2xl border-2 border-cyan-500/50"
                onError={(e) => {
                  e.currentTarget.alt ="Image not available";
                }}
              />
              <div className="absolute inset-0 rounded-2xl border-2 border-cyan-400/70 animate-pulse"></div>
              <div className="absolute -inset-2 rounded-2xl border border-purple-400/30 animate-ping"></div>
            </div>
            <div className="space-y-4">
              <p className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 mb-3 animate-bounce">
                {detectedEmote.emote}
              </p>
              {detectedEmote.confidence && (
                <div className="bg-black/50 rounded-full px-6 py-3 inline-block border-2 border-cyan-500/50">
                  <p className="text-cyan-300 font-bold text-sm font-mono tracking-wider">
                    CONFIDENCE: {(detectedEmote.confidence * 100).toFixed(0)}%
                  </p>
                </div>
              )}
              {detectedEmote.description && (
                <p className="text-cyan-200/90 text-sm font-medium max-w-md mx-auto font-mono">
                  {detectedEmote.description}
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="py-12">
            <div className="relative">
              <p className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-600 to-gray-400 animate-pulse">
                ---
              </p>
              <div className="absolute inset-0 text-8xl font-black text-cyan-500/20 animate-ping">
                ---
              </div>
            </div>
            <p className="text-cyan-400/70 text-sm mt-4 font-mono tracking-wider">
              NO EMOTE DETECTED YET
            </p>
          </div>
        )}

        {isProcessing && (
          <div className="mt-8 flex items-center justify-center gap-4 animate-fade-in">
            <div className="w-6 h-6 border-2 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin"></div>
            <p className="text-cyan-300 text-sm font-bold font-mono tracking-wider">
              PROCESSING GESTURE...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
