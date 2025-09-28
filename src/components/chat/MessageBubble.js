import React from 'react';
import { motion } from 'framer-motion';

const MessageBubble = ({ message, isOwn, showAvatar }) => {

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderMessageContent = () => {
    switch (message.type) {
      case 'image':
        return (
          <div className="max-w-xs">
            <img
              src={message.metadata.url}
              alt="Shared content"
              className="rounded-lg max-w-full h-auto"
            />
            {message.content && (
              <p className="mt-2 text-sm">{message.content}</p>
            )}
          </div>
        );
      
      case 'video':
        return (
          <div className="max-w-xs">
            <video
              src={message.metadata.url}
              controls
              className="rounded-lg max-w-full h-auto"
            />
            {message.content && (
              <p className="mt-2 text-sm">{message.content}</p>
            )}
          </div>
        );
      
      case 'audio':
        return (
          <div className="flex items-center space-x-2">
            <audio src={message.metadata.url} controls className="max-w-xs" />
            {message.content && (
              <p className="text-sm">{message.content}</p>
            )}
          </div>
        );
      
      case 'file':
        return (
          <div className="flex items-center space-x-2 p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <div>
              <p className="text-sm font-medium">{message.metadata.filename}</p>
              <p className="text-xs text-gray-500">{message.metadata.size}</p>
            </div>
          </div>
        );
      
      default:
        return (
          <p className="whitespace-pre-wrap break-words">
            {message.content}
          </p>
        );
    }
  };

  const handleDoubleClick = () => {
    // Add reaction logic here
    console.log('Double clicked message:', message.id);
  };

  return (
    <motion.div
      className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-2`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className={`flex items-end space-x-2 max-w-xs lg:max-w-md ${isOwn ? 'flex-row-reverse space-x-reverse' : ''}`}>
        {/* Avatar */}
        {!isOwn && showAvatar && (
          <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
            {message.sender?.displayName?.charAt(0) || '?'}
          </div>
        )}
        
        {!isOwn && !showAvatar && (
          <div className="w-8 h-8 flex-shrink-0" />
        )}

        {/* Message Bubble */}
        <motion.div
          className={`relative group ${isOwn ? 'ml-auto' : ''}`}
          onDoubleClick={handleDoubleClick}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div
            className={`chat-bubble ${
              isOwn 
                ? 'chat-bubble-sent' 
                : 'chat-bubble-received'
            }`}
          >
            {renderMessageContent()}
          </div>

          {/* Message Info */}
          <div className={`flex items-center space-x-1 mt-1 ${isOwn ? 'justify-end' : 'justify-start'}`}>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {formatTime(message.timestamp)}
            </span>
            {isOwn && (
              <div className="flex items-center space-x-1">
                {message.status === 'sending' && (
                  <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
                )}
                {message.status === 'sent' && (
                  <svg className="w-3 h-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
                {message.status === 'delivered' && (
                  <svg className="w-3 h-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
                {message.status === 'read' && (
                  <svg className="w-3 h-3 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            )}
          </div>

          {/* Reactions */}
          {message.reactions && message.reactions.length > 0 && (
            <div className={`flex flex-wrap gap-1 mt-1 ${isOwn ? 'justify-end' : 'justify-start'}`}>
              {message.reactions.map((reaction, index) => (
                <motion.span
                  key={index}
                  className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {reaction.emoji} {reaction.count}
                </motion.span>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default MessageBubble;
