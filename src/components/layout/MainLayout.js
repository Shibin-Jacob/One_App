import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Tab Components
import ChatsTab from '../tabs/ChatsTab';
import CallsTab from '../tabs/CallsTab';
import MeetTab from '../tabs/MeetTab';
import AiTab from '../tabs/AiTab';
import NotesTab from '../tabs/NotesTab';
import MailTab from '../tabs/MailTab';
import ProfileTab from '../tabs/ProfileTab';

// Bottom Navigation
import BottomNavigation from './BottomNavigation';

const MainLayout = () => {
  const [activeTab, setActiveTab] = useState('chats');

  const tabs = [
    { id: 'chats', label: 'Chats', icon: '💬', component: ChatsTab },
    { id: 'calls', label: 'Calls', icon: '📞', component: CallsTab },
    { id: 'meet', label: 'Meet', icon: '🎥', component: MeetTab },
    { id: 'ai', label: 'AI', icon: '🤖', component: AiTab },
    { id: 'notes', label: 'Notes', icon: '📝', component: NotesTab },
    { id: 'mail', label: 'Mail', icon: '📧', component: MailTab },
    { id: 'profile', label: 'Profile', icon: '👤', component: ProfileTab },
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component;

  const pageVariants = {
    initial: { opacity: 0, x: 20 },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: -20 }
  };

  const pageTransition = {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.3
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
            className="h-full"
          >
            {ActiveComponent && <ActiveComponent />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
    </div>
  );
};

export default MainLayout;
