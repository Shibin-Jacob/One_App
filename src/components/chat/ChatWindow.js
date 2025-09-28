import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChat } from '../../contexts/ChatContext';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import TypingIndicator from './TypingIndicator';

const ChatWindow = ({ chat, onBack }) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef(null);
  const { messages, sendMessage, loadMessages, typingUsers, startTyping, stopTyping } = useChat();
  const { user } = useAuth();
  const { getChatWallpaperStyle } = useTheme();

  const chatMessages = messages[chat.id] || [];
  const typingUsersInChat = typingUsers[chat.id] || [];

  useEffect(() => {
    loadMessages(chat.id);
  }, [chat.id, loadMessages]);

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages.length]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (content, type = 'text', metadata = {}) => {
    const result = await sendMessage(chat.id, content, type, metadata);
    if (result.success) {
      setShowEmojiPicker(false);
    }
  };

  const handleTyping = (isTyping) => {
    if (isTyping) {
      startTyping(chat.id);
    } else {
      stopTyping(chat.id);
    }
  };

  const otherParticipant = chat.participants.find(p => p.id !== user?.id);

  return (
    <div className={`h-full flex flex-col ${getChatWallpaperStyle()}`}>
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center">
          <motion.button
            onClick={onBack}
            className="mr-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </motion.button>
          
          <div className="flex items-center flex-1">
            <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-white font-semibold mr-3">
              {otherParticipant?.displayName?.charAt(0) || '?'}
            </div>
            <div>
              <h2 className="font-semibold text-gray-900 dark:text-white">
                {otherParticipant?.displayName || 'Unknown User'}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                @{otherParticipant?.username || 'unknown'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <motion.button
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </motion.button>
            
            <motion.button
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto scrollbar-hide p-4 space-y-2">
        <AnimatePresence>
          {chatMessages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.05 }}
              className="message-send-animation"
            >
              <MessageBubble
                message={message}
                isOwn={message.sender?.id === user?.id}
                showAvatar={index === 0 || chatMessages[index - 1]?.sender?.id !== message.sender?.id}
              />
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing Indicator */}
        {typingUsersInChat.length > 0 && (
          <TypingIndicator users={typingUsersInChat} />
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <MessageInput
        onSendMessage={handleSendMessage}
        onTyping={handleTyping}
        showEmojiPicker={showEmojiPicker}
        onToggleEmojiPicker={() => setShowEmojiPicker(!showEmojiPicker)}
      />
    </div>
  );
};

export default ChatWindow;
