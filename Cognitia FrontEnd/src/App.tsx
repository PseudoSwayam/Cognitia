import React, { useState, useEffect, useRef } from 'react';
import { Message, Chat } from './types/chat';
import { apiService } from './services/api';
import { MessageBubble } from './components/MessageBubble';
import { ChatInput } from './components/ChatInput';
import { TypingIndicator } from './components/TypingIndicator';
import { LeftSidebar } from './components/LeftSidebar';
import { RightSidebar } from './components/RightSidebar';

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingDebate, setIsGeneratingDebate] = useState(false);
  const [isPreparingTopic, setIsPreparingTopic] = useState(false);
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(false);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(true); // Open by default
  const [isReadOnlyMode, setIsReadOnlyMode] = useState(false);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [chats, setChats] = useState<Chat[]>([]);
  const [prepareResult, setPrepareResult] = useState<{ success: boolean; message: string } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock data for previous chats
  useEffect(() => {
    const mockChats: Chat[] = [
      {
        id: '1',
        title: 'Chat #1 - AI Ethics',
        messages: [
          {
            id: '1-1',
            type: 'user',
            content: 'What are the main ethical concerns with AI?',
            timestamp: new Date(Date.now() - 86400000),
          },
          {
            id: '1-2',
            type: 'agent',
            content: 'The main ethical concerns with AI include bias and fairness, privacy and surveillance, job displacement, accountability and transparency, and the potential for misuse in autonomous weapons systems.',
            timestamp: new Date(Date.now() - 86400000 + 30000),
            hasDebate: true,
          },
        ],
        createdAt: new Date(Date.now() - 86400000),
      },
      {
        id: '2',
        title: 'Chat #2 - Machine Learning',
        messages: [
          {
            id: '2-1',
            type: 'user',
            content: 'Explain gradient descent in simple terms',
            timestamp: new Date(Date.now() - 172800000),
          },
          {
            id: '2-2',
            type: 'agent',
            content: 'Gradient descent is like finding the bottom of a valley while blindfolded. You feel the slope around you and take steps in the steepest downward direction until you reach the lowest point.',
            timestamp: new Date(Date.now() - 172800000 + 45000),
            hasDebate: true,
          },
        ],
        createdAt: new Date(Date.now() - 172800000),
      },
    ];
    setChats(mockChats);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const addMessage = (content: string, type: Message['type']) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date(),
      hasDebate: type === 'agent',
      debateGenerated: false,
    };
    setMessages(prev => [...prev, newMessage]);
    return newMessage.id;
  };

  const handleSendMessage = async (userMessage: string) => {
    if (isReadOnlyMode) return;
    
    // Add user message immediately
    addMessage(userMessage, 'user');
    
    // Set loading state
    setIsLoading(true);
    
    try {
      const response = await apiService.sendMessage(userMessage);
      addMessage(response, 'agent');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      addMessage(`Error: ${errorMessage}`, 'agent');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateDebate = async (messageId: string, content: string) => {
    setIsGeneratingDebate(true);
    
    // Mark the message as debate generated
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, debateGenerated: true } : msg
    ));
    
    try {
      const debateResponse = await apiService.generateDebate(content);
      addMessage(`Debate Response:\n\n${debateResponse}`, 'agent');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate debate';
      addMessage(`Error generating debate: ${errorMessage}`, 'agent');
    } finally {
      setIsGeneratingDebate(false);
    }
  };

  const handlePrepareTopic = async (topic: string) => {
    setIsPreparingTopic(true);
    setPrepareResult(null);
    
    try {
      const response = await apiService.prepareTopic(topic);
      setPrepareResult({ success: true, message: response });
      // Auto-collapse sidebar after successful topic preparation
      setTimeout(() => {
        setRightSidebarOpen(false);
      }, 1500);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to prepare topic';
      setPrepareResult({ success: false, message: errorMessage });
    } finally {
      setIsPreparingTopic(false);
    }
  };

  const handleSelectChat = (chatId: string) => {
    const selectedChat = chats.find(chat => chat.id === chatId);
    if (selectedChat) {
      setMessages(selectedChat.messages);
      setCurrentChatId(chatId);
      setIsReadOnlyMode(true);
      setLeftSidebarOpen(false);
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setCurrentChatId(null);
    setIsReadOnlyMode(false);
    setRightSidebarOpen(true); // Re-open right sidebar for new topic
    setPrepareResult(null);
  };

  return (
    <div className="h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
      {/* Left Sidebar */}
      <LeftSidebar
        isOpen={leftSidebarOpen}
        onToggle={() => setLeftSidebarOpen(!leftSidebarOpen)}
        chats={chats}
        currentChatId={currentChatId}
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
      />

      {/* Right Sidebar */}
      <RightSidebar
        isOpen={rightSidebarOpen}
        onToggle={() => setRightSidebarOpen(!rightSidebarOpen)}
        onPrepareTopic={handlePrepareTopic}
        isLoading={isPreparingTopic}
        lastResult={prepareResult}
      />

      {/* Main Layout */}
      <div className="flex h-full">
        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="p-4 pb-0">
            <div className="glass-dark rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-xl font-semibold text-white mb-1">
                    Cognitia
                  </h1>
                  <p className="text-xs text-gray-400">
                    Not Just Smarter — Kinder, Wiser, and Truly Yours.
                  </p>
                </div>
                {isReadOnlyMode && (
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-400 bg-gray-700/30 px-2 py-1 rounded-full">
                      Read-only mode
                    </span>
                    <button
                      onClick={handleNewChat}
                      className="px-3 py-1.5 btn-primary text-white rounded-lg font-medium text-sm transition-smooth"
                    >
                      New Chat
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto px-4">
            <div className="py-4">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-400">
                  <div className="text-center">
                    <h2 className="text-lg font-semibold mb-2 text-white">Welcome to Cognitia</h2>
                    <p className="text-sm mb-1">Your AI assistant that's kinder, wiser, and truly yours</p>
                    <p className="text-xs text-gray-500">Prepare topics, ask questions, and generate debates</p>
                  </div>
                </div>
              ) : (
                <>
                  {messages.map((message) => (
                    <MessageBubble
                      key={message.id}
                      message={message}
                      onGenerateDebate={handleGenerateDebate}
                      isGeneratingDebate={isGeneratingDebate}
                      isReadOnly={isReadOnlyMode}
                    />
                  ))}
                  
                  {isLoading && <TypingIndicator />}
                  
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>
          </div>

          {/* Input Area */}
          <ChatInput
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            disabled={isReadOnlyMode}
          />
        </div>
      </div>
    </div>
  );
}

export default App;