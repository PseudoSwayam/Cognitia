import React from 'react';
import { FileText, Loader2 } from 'lucide-react';

interface ChatHeaderProps {
  onShowJournal: () => void;
  isLoadingJournal: boolean;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ 
  onShowJournal, 
  isLoadingJournal 
}) => {
  return (
    <div className="border-b border-gray-200 bg-white px-4 py-3">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-800">
          AI Chat Assistant
        </h1>
        
        <button
          onClick={onShowJournal}
          disabled={isLoadingJournal}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoadingJournal ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <FileText className="w-4 h-4" />
          )}
          Show Weekly Journal
        </button>
      </div>
    </div>
  );
};