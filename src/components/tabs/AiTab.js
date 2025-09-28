import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AiTab = () => {
  const [selectedPersona, setSelectedPersona] = useState('main');
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const personas = [
    {
      id: 'main',
      name: 'Main AI',
      description: 'General purpose AI assistant',
      icon: '🤖',
      color: 'bg-blue-500'
    },
    {
      id: 'lawyer',
      name: 'Legal Assistant',
      description: 'Legal advice and document review',
      icon: '⚖️',
      color: 'bg-purple-500'
    },
    {
      id: 'writer',
      name: 'Writing Assistant',
      description: 'Content creation and editing',
      icon: '✍️',
      color: 'bg-green-500'
    },
    {
      id: 'teacher',
      name: 'Educational Tutor',
      description: 'Learning and teaching support',
      icon: '👨‍🏫',
      color: 'bg-orange-500'
    },
    {
      id: 'doctor',
      name: 'Health Advisor',
      description: 'General health information',
      icon: '👨‍⚕️',
      color: 'bg-red-500'
    },
    {
      id: 'developer',
      name: 'Code Assistant',
      description: 'Programming and technical help',
      icon: '💻',
      color: 'bg-indigo-500'
    }
  ];

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: `This is a simulated response from ${personas.find(p => p.id === selectedPersona)?.name}. In a real implementation, this would connect to the Gemini API for actual AI responses.`,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 2000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            AI Assistant
          </h1>
          <motion.button
            onClick={clearChat}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </motion.button>
        </div>

        {/* Persona Selector */}
        <div className="flex space-x-2 overflow-x-auto scrollbar-hide">
          {personas.map((persona) => (
            <motion.button
              key={persona.id}
              onClick={() => setSelectedPersona(persona.id)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 whitespace-nowrap ${
                selectedPersona === persona.id
                  ? 'bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="text-lg">{persona.icon}</span>
              <span>{persona.name}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto scrollbar-hide p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <div className="w-20 h-20 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">
                  {personas.find(p => p.id === selectedPersona)?.icon}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {personas.find(p => p.id === selectedPersona)?.name}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {personas.find(p => p.id === selectedPersona)?.description}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                Start a conversation to get help
              </p>
            </motion.div>
          </div>
        ) : (
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                    message.type === 'user'
                      ? 'bg-primary-600 text-white'
                      : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  <p className={`text-xs mt-1 ${
                    message.type === 'user' ? 'text-primary-100' : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}

        {/* Typing Indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl px-4 py-2">
              <div className="flex items-center space-x-1">
                <span className="text-sm text-gray-600 dark:text-gray-400 mr-2">
                  {personas.find(p => p.id === selectedPersona)?.name} is typing
                </span>
                <div className="flex space-x-1">
                  <motion.div
                    className="w-2 h-2 bg-gray-400 rounded-full"
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 1.4, repeat: Infinity, delay: 0 }}
                  />
                  <motion.div
                    className="w-2 h-2 bg-gray-400 rounded-full"
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 1.4, repeat: Infinity, delay: 0.2 }}
                  />
                  <motion.div
                    className="w-2 h-2 bg-gray-400 rounded-full"
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 1.4, repeat: Infinity, delay: 0.4 }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Input */}
      <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-end space-x-2">
          <div className="flex-1">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`Ask ${personas.find(p => p.id === selectedPersona)?.name} anything...`}
              className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-full resize-none border-0 focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
              rows="1"
              style={{ minHeight: '48px', maxHeight: '120px' }}
            />
          </div>
          <motion.button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim()}
            className={`p-3 rounded-full transition-colors duration-200 ${
              inputMessage.trim()
                ? 'bg-primary-600 text-white hover:bg-primary-700'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
            }`}
            whileHover={{ scale: inputMessage.trim() ? 1.05 : 1 }}
            whileTap={{ scale: inputMessage.trim() ? 0.95 : 1 }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default AiTab;
