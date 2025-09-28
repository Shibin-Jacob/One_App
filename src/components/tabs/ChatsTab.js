import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChat } from '../../contexts/ChatContext';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import ChatList from '../chat/ChatList';
import ChatWindow from '../chat/ChatWindow';
import NewChatModal from '../chat/NewChatModal';

const ChatsTab = () => {
  const [showNewChat, setShowNewChat] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { chats, activeChat, loadChats, setActiveChat } = useChat();
  const { user } = useAuth();
  const { getChatWallpaperStyle } = useTheme();

  useEffect(() => {
    loadChats();
  }, [loadChats]);

  const filteredChats = chats.filter(chat => {
    if (!searchQuery) return true;
    
    const otherParticipant = chat.participants.find(p => p.id !== user?.id);
    return otherParticipant?.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
           otherParticipant?.displayName?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className={`h-full flex flex-col ${getChatWallpaperStyle()}`}>
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Chats
          </h1>
          <motion.button
            onClick={() => setShowNewChat(true)}
            className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-white hover:bg-primary-700 transition-colors duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </motion.button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search chats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg border-0 focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-gray-100"
          />
          <svg
            className="absolute left-3 top-2.5 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Chat List or Chat Window */}
      <div className="flex-1 overflow-hidden">
        {activeChat ? (
          <ChatWindow 
            chat={activeChat} 
            onBack={() => setActiveChat(null)}
          />
        ) : (
          <ChatList 
            chats={filteredChats}
            onChatSelect={setActiveChat}
          />
        )}
      </div>

      {/* New Chat Modal */}
      <AnimatePresence>
        {showNewChat && (
          <NewChatModal
            onClose={() => setShowNewChat(false)}
            onChatCreated={(chat) => {
              setActiveChat(chat);
              setShowNewChat(false);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatsTab;
