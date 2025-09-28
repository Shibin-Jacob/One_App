import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';

const MeetTab = () => {
  const [meetingCode, setMeetingCode] = useState('');
  const [isInMeeting, setIsInMeeting] = useState(false);
  const { user } = useAuth();

  const handleStartMeeting = () => {
    setIsInMeeting(true);
    // Meeting logic would go here
  };

  const handleJoinMeeting = () => {
    if (meetingCode.trim()) {
      setIsInMeeting(true);
      // Join meeting logic would go here
    }
  };

  const handleEndMeeting = () => {
    setIsInMeeting(false);
    setMeetingCode('');
  };

  if (isInMeeting) {
    return (
      <div className="h-full flex flex-col bg-gray-900">
        {/* Meeting Header */}
        <div className="bg-gray-800 p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
              {user?.displayName?.charAt(0) || '?'}
            </div>
            <div>
              <h2 className="text-white font-semibold">Meeting Room</h2>
              <p className="text-gray-400 text-sm">ID: {meetingCode || 'ABC-123-DEF'}</p>
            </div>
          </div>
          <motion.button
            onClick={handleEndMeeting}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            End Meeting
          </motion.button>
        </div>

        {/* Meeting Content */}
        <div className="flex-1 flex items-center justify-center p-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-center"
          >
            <div className="w-64 h-48 bg-gray-700 rounded-lg flex items-center justify-center mb-6">
              <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Meeting in Progress
            </h3>
            <p className="text-gray-400 mb-6">
              AI transcription and summarization features will be available here
            </p>

            {/* Meeting Controls */}
            <div className="flex items-center justify-center space-x-4">
              <motion.button
                className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center text-white hover:bg-gray-500 transition-colors duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </motion.button>

              <motion.button
                className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center text-white hover:bg-gray-500 transition-colors duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </motion.button>

              <motion.button
                className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-white hover:bg-red-700 transition-colors duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Meetings
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Host or join meetings with AI transcription
        </p>
      </div>

      {/* Meeting Options */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          {/* Host Meeting */}
          <motion.div
            className="card p-6 mb-6"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Host Meeting
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Start a new meeting room
                </p>
              </div>
            </div>
            <motion.button
              onClick={handleStartMeeting}
              className="w-full btn-primary py-3"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Start Meeting
            </motion.button>
          </motion.div>

          {/* Join Meeting */}
          <motion.div
            className="card p-6"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Join Meeting
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Enter meeting code to join
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Enter meeting code (e.g., ABC-123-DEF)"
                value={meetingCode}
                onChange={(e) => setMeetingCode(e.target.value)}
                className="input-field"
              />
              <motion.button
                onClick={handleJoinMeeting}
                disabled={!meetingCode.trim()}
                className={`w-full py-3 rounded-lg font-semibold transition-colors duration-200 ${
                  meetingCode.trim()
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                }`}
                whileHover={{ scale: meetingCode.trim() ? 1.02 : 1 }}
                whileTap={{ scale: meetingCode.trim() ? 0.98 : 1 }}
              >
                Join Meeting
              </motion.button>
            </div>
          </motion.div>

          {/* AI Features Info */}
          <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                  AI-Powered Meetings
                </h4>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  Real-time transcription, automatic summarization, and intelligent note-taking powered by Gemini AI
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MeetTab;
