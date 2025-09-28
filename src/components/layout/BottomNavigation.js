import React from 'react';
import { motion } from 'framer-motion';

const BottomNavigation = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 safe-area-inset">
      <div className="flex">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          
          return (
            <motion.button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex-1 flex flex-col items-center justify-center py-2 px-1 relative ${
                isActive 
                  ? 'text-primary-600 dark:text-primary-400' 
                  : 'text-gray-500 dark:text-gray-400'
              }`}
              whileTap={{ scale: 0.95 }}
            >
              {/* Active indicator */}
              {isActive && (
                <motion.div
                  className="absolute top-0 left-1/2 w-12 h-1 bg-primary-600 rounded-b-full"
                  initial={{ scaleX: 0, x: '-50%' }}
                  animate={{ scaleX: 1, x: '-50%' }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
              
              {/* Icon */}
              <motion.div
                className="text-2xl mb-1"
                animate={{ 
                  scale: isActive ? 1.1 : 1,
                  rotate: isActive ? [0, -10, 10, 0] : 0
                }}
                transition={{ 
                  scale: { duration: 0.2 },
                  rotate: { duration: 0.5, delay: 0.1 }
                }}
              >
                {tab.icon}
              </motion.div>
              
              {/* Label */}
              <motion.span
                className={`text-xs font-medium ${
                  isActive ? 'opacity-100' : 'opacity-70'
                }`}
                animate={{ 
                  opacity: isActive ? 1 : 0.7,
                  y: isActive ? 0 : 2
                }}
                transition={{ duration: 0.2 }}
              >
                {tab.label}
              </motion.span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;
