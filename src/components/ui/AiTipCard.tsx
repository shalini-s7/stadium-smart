import React from 'react';
import { Sparkles } from 'lucide-react';

interface AiTipCardProps {
  message: string;
}

export const AiTipCard: React.FC<AiTipCardProps> = ({ message }) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-tr from-primary-500 to-indigo-500 text-white rounded-2xl p-5 shadow-lg">
      <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-10 rounded-full blur-xl"></div>
      
      <div className="flex items-start space-x-3 relative z-10">
        <Sparkles size={24} className="mt-1 text-amber-300 shrink-0" />
        <div>
          <h4 className="font-semibold text-primary-100 text-sm mb-1 uppercase tracking-wider">AI Suggestion</h4>
          <p className="font-medium leading-relaxed shadow-sm block text-base/6">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
};
