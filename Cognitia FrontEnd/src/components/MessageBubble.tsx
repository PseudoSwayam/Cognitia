import React from 'react';
import { Message } from '../types/chat';
import { User, Bot, MessageSquare } from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
  onGenerateDebate?: (messageId: string, content: string) => void;
  isGeneratingDebate?: boolean;
  isReadOnly?: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ 
  message, 
  onGenerateDebate, 
  isGeneratingDebate = false,
  isReadOnly = false
}) => {
  const isUser = message.type === 'user';

  const handleGenerateDebate = () => {
    if (onGenerateDebate && !message.debateGenerated) {
      onGenerateDebate(message.id, message.content);
    }
  };

  return (
    <div className="mb-4">
      <div className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
        {!isUser && (
          <div className="flex-shrink-0 w-8 h-8 rounded-full glass-subtle flex items-center justify-center">
            <Bot className="w-4 h-4 text-violet-300" />
          </div>
        )}
        
        <div className={`max-w-[75%] ${isUser ? 'order-first' : ''}`}>
          <div className={`glass-subtle rounded-2xl p-3 transition-smooth ${
            isUser 
              ? 'bg-gradient-to-r from-violet-600/20 to-blue-600/20' 
              : 'bg-gradient-to-r from-gray-800/30 to-gray-900/30'
          }`}>
            <div className="flex items-center gap-2 mb-1">
              {isUser && <User className="w-3 h-3 text-blue-300" />}
              <span className={`text-xs font-medium ${
                isUser ? 'text-blue-300' : 'text-violet-300'
              }`}>
                {isUser ? 'You' : 'Cognitia'}
              </span>
              <span className="text-xs text-gray-500">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            
            <div className="text-gray-100 text-sm leading-relaxed whitespace-pre-wrap">
              {message.content}
            </div>
          </div>

          {/* Generate Debate Button - Only for agent messages */}
          {!isUser && !isReadOnly && onGenerateDebate && (
            <div className="mt-2 flex justify-start">
              <button
                onClick={handleGenerateDebate}
                disabled={message.debateGenerated || isGeneratingDebate}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-smooth ${
                  message.debateGenerated 
                    ? 'bg-gray-600/30 text-gray-500 cursor-not-allowed'
                    : isGeneratingDebate
                      ? 'bg-violet-600/30 text-violet-300 cursor-wait'
                      : 'btn-secondary text-violet-300 hover-glow'
                }`}
              >
                <MessageSquare className="w-3 h-3" />
                {message.debateGenerated 
                  ? 'Debate Generated' 
                  : isGeneratingDebate 
                    ? 'Generating...' 
                    : 'Generate Debate'
                }
              </button>
            </div>
          )}
        </div>

        {isUser && (
          <div className="flex-shrink-0 w-8 h-8 rounded-full glass-subtle flex items-center justify-center">
            <User className="w-4 h-4 text-blue-300" />
          </div>
        )}
      </div>
    </div>
  );
};