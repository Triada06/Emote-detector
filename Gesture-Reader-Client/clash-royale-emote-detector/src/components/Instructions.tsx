import React from 'react';
import { Camera } from 'lucide-react';

export const Instructions: React.FC = () => {
  const instructions = [
    { icon: "📷", text: "ALLOW CAMERA ACCESS WHEN PROMPTED", step: "01" },
    { icon: "✋", text: "SHOW YOUR HAND GESTURE CLEARLY IN FRONT OF THE CAMERA", step: "02" },
    { icon: "🤚", text: "HOLD THE GESTURE STEADY", step: "03" },
    { icon: "📸", text: "CLICK 'CAPTURE GESTURE' BUTTON TO DETECT", step: "04" },
    { icon: "⏱️", text: "WAIT AT LEAST 3 SECONDS BETWEEN CAPTURES", step: "05" }
  ];

  return (
    <div className="mt-2 sm:mt-4 md:mt-8 bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm rounded-lg sm:rounded-xl md:rounded-2xl p-2 sm:p-4 md:p-8 border-2 border-cyan-500/30 hover:border-cyan-400/50 transition-all duration-500 group cyber-container">
      <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 mb-2 sm:mb-4 md:mb-8">
        <div className="p-2 sm:p-3 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg sm:rounded-xl md:rounded-2xl shadow-2xl border-2 border-cyan-400/50">
          <Camera className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
        </div>
        <h3 className="text-cyan-300 font-black text-lg sm:text-xl font-mono tracking-wider text-center sm:text-left">
          SYSTEM INSTRUCTIONS
        </h3>
      </div>
      
      <div className="grid gap-3 sm:gap-6">
        {instructions.map((instruction, index) => (
          <div 
            key={index}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6 p-2 sm:p-3 md:p-4 bg-black/50 rounded-lg sm:rounded-xl md:rounded-2xl hover:bg-black/70 transition-all duration-300 group-hover:translate-x-2 border border-cyan-500/20 hover:border-cyan-400/40"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg sm:rounded-xl md:rounded-2xl flex items-center justify-center text-lg sm:text-2xl shadow-lg border-2 border-cyan-400/50">
              {instruction.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 sm:gap-3 mb-1">
                <span className="text-cyan-400 font-mono text-xs tracking-widest">STEP {instruction.step}</span>
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-cyan-400 rounded-full animate-pulse"></div>
              </div>
              <p className="text-cyan-200 text-xs sm:text-sm font-bold font-mono tracking-wider break-words">
                {instruction.text}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-2 sm:mt-4 md:mt-8 p-2 sm:p-4 md:p-6 bg-gradient-to-r from-green-900/30 to-cyan-900/30 rounded-lg sm:rounded-xl md:rounded-2xl border-2 border-green-500/30">
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 text-green-300 text-xs sm:text-sm font-bold font-mono">
          <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
          <span className="tracking-wider text-center sm:text-left">💡 PRO TIP: ENSURE OPTIMAL LIGHTING FOR MAXIMUM DETECTION ACCURACY</span>
        </div>
      </div>
    </div>
  );
};
