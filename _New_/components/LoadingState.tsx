import React from 'react';
import { Wind } from 'lucide-react';

const LoadingState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-6 animate-fade-in">
      <div className="relative">
        <div className="absolute inset-0 bg-nature-300 blur-xl opacity-30 rounded-full animate-pulse"></div>
        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-inner relative z-10 border-4 border-nature-100">
           <Wind className="text-nature-500 animate-sway" size={48} />
        </div>
      </div>
      <div className="text-center space-y-2">
        <h3 className="text-xl font-semibold text-nature-800">Listening to the wind...</h3>
        <p className="text-nature-500 text-sm">Analyzing photos, sensors, and sounds.</p>
      </div>
    </div>
  );
};

export default LoadingState;