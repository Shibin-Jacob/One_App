import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';

const CallsTab = () => {
  const [callType, setCallType] = useState('audio'); // 'audio' or 'video'
  const [isCalling, setIsCalling] = useState(false);
  const { user } = useAuth();

  const handleStartCall = (type) => {
    setCallType(type);
    setIsCalling(true);
    // Call logic would go here
  };

  const handleEndCall = () => {
    setIsCalling(false);
  };

  const CallButton = ({ type, icon, label, color }) => (
    <motion.button
      onClick={() => handleStartCall(type)}
      className={`w-20 h-20 ${color} rounded-full flex items-center justify-center text-white shadow-lg`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
      </svg>
    </motion.button>
  );

  if (isCalling) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900 dark:to-primary-800 p-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-center"
        >
          {/* Call Avatar */}
          <div className="w-32 h-32 bg-primary-600 rounded-full flex items-center justify-center text-white text-4xl font-bold mx-auto mb-8">
            {user?.displayName?.charAt(0) || '?'}
          </div>

          {/* Call Info */}
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {callType === 'audio' ? 'Audio Call' : 'Video Call'}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Connecting...
          </p>

          {/* Call Controls */}
          <div className="flex items-center space-x-6">
            <motion.button
              onClick={handleEndCall}
              className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center text-white shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </motion.button>

            <motion.button
              className="w-12 h-12 bg-gray-500 rounded-full flex items-center justify-center text-white shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Calls
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Start audio or video calls with your contacts
        </p>
      </div>

      {/* Call Options */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-8">
            Choose Call Type
          </h2>

          <div className="flex items-center justify-center space-x-12">
            {/* Audio Call */}
            <div className="text-center">
              <CallButton
                type="audio"
                icon="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                label="Audio Call"
                color="bg-green-500"
              />
              <p className="mt-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                Audio Call
              </p>
            </div>

            {/* Video Call */}
            <div className="text-center">
              <CallButton
                type="video"
                icon="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                label="Video Call"
                color="bg-blue-500"
              />
              <p className="mt-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                Video Call
              </p>
            </div>
          </div>

          <p className="text-gray-500 dark:text-gray-400 mt-8">
            Tap to start a call with your contacts
          </p>
        </motion.div>
      </div>

      {/* Call History (Placeholder) */}
      <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Recent Calls
        </h3>
        <div className="text-center py-8">
          <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          <p className="text-gray-500 dark:text-gray-400">No call history yet</p>
        </div>
      </div>
    </div>
  );
};

export default CallsTab;
