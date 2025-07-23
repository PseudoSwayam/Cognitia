import React from 'react';
import { Clock, ChevronLeft, ChevronRight, MessageCircle, Plus } from 'lucide-react';
import { Chat } from '../types/chat';

interface LeftSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  chats: Chat[];
  currentChatId: string | null;
  onSelectChat: (chatId: string) => void;
  onNewChat: () => void;
}

export const LeftSidebar: React.FC<LeftSidebarProps> = ({
  isOpen,
  onToggle,
  chats,
  currentChatId,
  onSelectChat,
  onNewChat,
}) => {
  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className="fixed top-4 left-4 z-50 w-9 h-9 glass-dark rounded-lg flex items-center justify-center text-violet-300 hover-glow transition-smooth"
      >
        {isOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
      </button>

      {/* New Chat Button */}
      <button
        onClick={onNewChat}
        className="fixed top-4 left-16 z-50 flex items-center gap-2 px-3 py-2 glass-dark rounded-lg text-violet-300 hover-glow transition-smooth text-sm font-medium"
      >
        <Plus className="w-4 h-4" />
        New Chat
      </button>

      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full w-72 glass-dark transition-smooth duration-300 z-40 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-4 pt-16">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-4 h-4 text-violet-400" />
            <h2 className="text-sm font-semibold text-white">Previous Chats</h2>
          </div>

          <div className="space-y-2">
            {chats.length === 0 ? (
              <div className="text-gray-500 text-center py-6">
                <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-xs">No previous chats</p>
              </div>
            ) : (
              chats.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => onSelectChat(chat.id)}
                  className={`w-full text-left p-3 rounded-lg transition-smooth text-sm ${
                    currentChatId === chat.id
                      ? 'bg-violet-600/20 border border-violet-500/30'
                      : 'glass-subtle hover-glow'
                  }`}
                >
                  <div className="font-medium text-white mb-1">{chat.title}</div>
                  <div className="text-xs text-gray-400">
                    {chat.messages.length} messages • {chat.createdAt.toLocaleDateString()}
                  </div>
                </button>
              ))
            )}
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