import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';

const ChatList = ({ chats, onChatSelect }) => {
  const { user } = useAuth();

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 168) { // 7 days
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const getLastMessage = (chat) => {
    if (!chat.lastMessage) return 'No messages yet';
    
    const { content, type, sender } = chat.lastMessage;
    const isFromMe = sender?.id === user?.id;
    
    let displayContent = content;
    if (type === 'image') displayContent = '📷 Photo';
    else if (type === 'video') displayContent = '🎥 Video';
    else if (type === 'audio') displayContent = '🎵 Voice message';
    else if (type === 'file') displayContent = '📎 File';
    
    return isFromMe ? `You: ${displayContent}` : displayContent;
  };

  if (chats.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No chats yet
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Start a conversation by tapping the + button
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto scrollbar-hide">
      <div className="p-2">
        {chats.map((chat, index) => {
          const otherParticipant = chat.participants.find(p => p.id !== user?.id);
          const isOnline = chat.isOnline;
          const unreadCount = chat.unreadCount || 0;

          return (
            <motion.div
              key={chat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => onChatSelect(chat)}
              className="flex items-center p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors duration-200 mb-1"
            >
              {/* Avatar */}
              <div className="relative mr-3">
                <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {otherParticipant?.displayName?.charAt(0) || '?'}
                </div>
                {isOnline && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800" />
                )}
              </div>

              {/* Chat Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                    {otherParticipant?.displayName || 'Unknown User'}
                  </h3>
                  <div className="flex items-center space-x-2">
                    {unreadCount > 0 && (
                      <span className="bg-primary-600 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                        {unreadCount > 99 ? '99+' : unreadCount}
                      </span>
                    )}
                    <span className={`text-xs ${unreadCount > 0 ? 'text-gray-900 dark:text-white font-medium' : 'text-gray-500 dark:text-gray-400'}`}>
                      {formatTime(chat.lastMessage?.timestamp || chat.updatedAt)}
                    </span>
                  </div>
                </div>
                <p className={`text-sm truncate ${unreadCount > 0 ? 'text-gray-900 dark:text-white font-medium' : 'text-gray-500 dark:text-gray-400'}`}>
                  {getLastMessage(chat)}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default ChatList;
