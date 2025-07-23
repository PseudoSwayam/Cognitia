import React from 'react';
import { Bot } from 'lucide-react';

export const TypingIndicator: React.FC = () => {
  return (
    <div className="mb-4">
      <div className="flex gap-3 justify-start">
        <div className="flex-shrink-0 w-8 h-8 rounded-full glass-subtle flex items-center justify-center">
          <Bot className="w-4 h-4 text-violet-300" />
        </div>
        
        <div className="max-w-[75%]">
          <div className="glass-subtle rounded-2xl p-3 bg-gradient-to-r from-gray-800/30 to-gray-900/30">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-medium text-violet-300">Cognitia</span>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-xs">Thinking</span>
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce-dot"></div>
                <div className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce-dot"></div>
                <div className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce-dot"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};