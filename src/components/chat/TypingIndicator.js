import React from 'react';
import { motion } from 'framer-motion';

const TypingIndicator = ({ users }) => {
  if (!users || users.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex items-center space-x-2 mb-2"
    >
      <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
        <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
        </svg>
      </div>
      
      <div className="bg-gray-200 dark:bg-gray-700 rounded-2xl px-4 py-2">
        <div className="flex items-center space-x-1">
          <span className="text-sm text-gray-600 dark:text-gray-400 mr-2">
            {users.length === 1 ? users[0].displayName : `${users.length} people`} typing
          </span>
          <div className="flex space-x-1">
            <motion.div
              className="w-2 h-2 bg-gray-400 rounded-full typing-dot"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 1.4, repeat: Infinity, delay: 0 }}
            />
            <motion.div
              className="w-2 h-2 bg-gray-400 rounded-full typing-dot"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 1.4, repeat: Infinity, delay: 0.2 }}
            />
            <motion.div
              className="w-2 h-2 bg-gray-400 rounded-full typing-dot"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 1.4, repeat: Infinity, delay: 0.4 }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TypingIndicator;
