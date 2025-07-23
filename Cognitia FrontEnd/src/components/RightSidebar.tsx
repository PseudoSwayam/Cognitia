import React, { useState } from 'react';
import { BookOpen, Search, Loader2, CheckCircle, XCircle, ChevronRight, ChevronLeft } from 'lucide-react';

interface RightSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onPrepareTopic: (topic: string) => void;
  isLoading: boolean;
  lastResult: { success: boolean; message: string } | null;
}

export const RightSidebar: React.FC<RightSidebarProps> = ({
  isOpen,
  onToggle,
  onPrepareTopic,
  isLoading,
  lastResult,
}) => {
  const [topic, setTopic] = useState('');

  const handleSubmit = () => {
    if (topic.trim() && !isLoading) {
      onPrepareTopic(topic.trim());
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className="fixed top-4 right-4 z-50 w-9 h-9 glass-dark rounded-lg flex items-center justify-center text-violet-300 hover-glow transition-smooth"
      >
        {isOpen ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>

      {/* Sidebar */}
      <div className={`fixed right-0 top-0 h-full w-72 glass-dark transition-smooth duration-300 z-40 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="p-4 pt-16">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-4 h-4 text-violet-400" />
            <h2 className="text-sm font-semibold text-white">Knowledge Base</h2>
          </div>

          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter a topic (e.g., LLM reasoning)"
                disabled={isLoading}
                className="w-full pl-9 pr-3 py-2.5 glass-subtle rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 disabled:opacity-50 text-sm transition-smooth"
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={!topic.trim() || isLoading}
              className="w-full py-2.5 px-3 btn-primary text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-smooth flex items-center justify-center gap-2 text-sm"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : (
                'Generate'
              )}
            </button>

            {/* Result Message */}
            {lastResult && (
              <div className={`p-3 rounded-lg flex items-center gap-2 text-sm ${
                lastResult.success 
                  ? 'bg-green-600/15 border border-green-500/20' 
                  : 'bg-red-600/15 border border-red-500/20'
              }`}>
                {lastResult.success ? (
                  <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                )}
                <p className={`text-xs ${
                  lastResult.success ? 'text-green-300' : 'text-red-300'
                }`}>
                  {lastResult.message}
                </p>
              </div>
            )}
          </div>

          {/* Info Section */}
          <div className="mt-6 p-3 glass-subtle rounded-lg">
            <h3 className="text-sm font-semibold text-white mb-2">How it works</h3>
            <ul className="text-xs text-gray-400 space-y-1">
              <li>• Enter a topic to prepare knowledge base</li>
              <li>• System fetches relevant content</li>
              <li>• Chat with AI about the prepared topic</li>
              <li>• Generate debates for deeper analysis</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30"
          onClick={onToggle}
        />
      )}
    </>
  );
};