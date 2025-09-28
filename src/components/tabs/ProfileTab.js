import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

const ProfileTab = () => {
  const [activeSection, setActiveSection] = useState('profile');
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [editData, setEditData] = useState({
    displayName: '',
    email: '',
    username: ''
  });
  const { user, updateProfile, logout } = useAuth();
  const { theme, toggleTheme, fontSize, updateFontSize, chatWallpaper, updateChatWallpaper } = useTheme();

  const sections = [
    { id: 'profile', name: 'Profile', icon: '👤' },
    { id: 'appearance', name: 'Appearance', icon: '🎨' },
    { id: 'notifications', name: 'Notifications', icon: '🔔' },
    { id: 'privacy', name: 'Privacy', icon: '🔒' },
    { id: 'about', name: 'About', icon: 'ℹ️' }
  ];

  const handleEditProfile = () => {
    setEditData({
      displayName: user?.displayName || '',
      email: user?.email || '',
      username: user?.username || ''
    });
    setShowEditProfile(true);
  };

  const handleSaveProfile = async () => {
    const result = await updateProfile(editData);
    if (result.success) {
      setShowEditProfile(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  const renderProfileSection = () => (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="text-center">
        <div className="w-24 h-24 bg-primary-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4">
          {user?.displayName?.charAt(0) || '?'}
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
          {user?.displayName || 'Unknown User'}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          @{user?.username || 'unknown'}
        </p>
        <motion.button
          onClick={handleEditProfile}
          className="btn-primary px-6 py-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Edit Profile
        </motion.button>
      </div>

      {/* Profile Info */}
      <div className="space-y-4">
        <div className="card p-4">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Account Information</h3>
          <div className="space-y-3">
            <div>
              <label className="text-sm text-gray-600 dark:text-gray-400">Display Name</label>
              <p className="text-gray-900 dark:text-white">{user?.displayName || 'Not set'}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600 dark:text-gray-400">Username</label>
              <p className="text-gray-900 dark:text-white">@{user?.username || 'unknown'}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600 dark:text-gray-400">Email</label>
              <p className="text-gray-900 dark:text-white">{user?.email || 'Not set'}</p>
            </div>
          </div>
        </div>

        <div className="card p-4">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Account Actions</h3>
          <div className="space-y-2">
            <motion.button
              onClick={handleLogout}
              className="w-full text-left p-3 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg transition-colors duration-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Sign Out
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAppearanceSection = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Appearance</h2>
      
      {/* Theme */}
      <div className="card p-4">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Theme</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-900 dark:text-white">Current theme: {theme}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Choose between light and dark mode</p>
          </div>
          <motion.button
            onClick={toggleTheme}
            className="w-16 h-8 bg-gray-200 dark:bg-gray-700 rounded-full relative transition-colors duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              className="w-6 h-6 bg-white rounded-full shadow-md absolute top-1"
              animate={{ x: theme === 'dark' ? 32 : 4 }}
              transition={{ duration: 0.2 }}
            />
          </motion.button>
        </div>
      </div>

      {/* Font Size */}
      <div className="card p-4">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Font Size</h3>
        <div className="space-y-3">
          {[
            { value: 'small', label: 'Small' },
            { value: 'medium', label: 'Medium' },
            { value: 'large', label: 'Large' },
            { value: 'xlarge', label: 'Extra Large' }
          ].map((option) => (
            <label key={option.value} className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name="fontSize"
                value={option.value}
                checked={fontSize === option.value}
                onChange={(e) => updateFontSize(e.target.value)}
                className="w-4 h-4 text-primary-600"
              />
              <span className="text-gray-900 dark:text-white">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Chat Wallpaper */}
      <div className="card p-4">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Chat Wallpaper</h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            { value: 'default', label: 'Default', color: 'bg-white dark:bg-gray-900' },
            { value: 'ocean', label: 'Ocean', color: 'bg-gradient-to-br from-ocean-50 to-ocean-100 dark:from-ocean-900 dark:to-ocean-800' },
            { value: 'gradient', label: 'Gradient', color: 'bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900 dark:to-pink-900' },
            { value: 'dark', label: 'Dark', color: 'bg-gray-900' }
          ].map((option) => (
            <motion.button
              key={option.value}
              onClick={() => updateChatWallpaper(option.value)}
              className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                chatWallpaper === option.value
                  ? 'border-primary-500 ring-2 ring-primary-200 dark:ring-primary-800'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className={`w-full h-12 rounded ${option.color} mb-2`} />
              <p className="text-sm text-gray-900 dark:text-white">{option.label}</p>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderNotificationsSection = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Notifications</h2>
      
      <div className="card p-4">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Push Notifications</h3>
        <div className="space-y-4">
          {[
            { id: 'chats', label: 'Chat Messages', description: 'Get notified about new messages' },
            { id: 'calls', label: 'Calls', description: 'Get notified about incoming calls' },
            { id: 'meetings', label: 'Meetings', description: 'Get notified about meeting invitations' },
            { id: 'mail', label: 'Email', description: 'Get notified about new emails' }
          ].map((item) => (
            <div key={item.id} className="flex items-center justify-between">
              <div>
                <p className="text-gray-900 dark:text-white font-medium">{item.label}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
              </div>
              <motion.button
                className="w-12 h-6 bg-primary-600 rounded-full relative transition-colors duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  className="w-4 h-4 bg-white rounded-full absolute top-1 right-1"
                  animate={{ x: 0 }}
                  transition={{ duration: 0.2 }}
                />
              </motion.button>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Quiet Hours</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-900 dark:text-white">Do Not Disturb</span>
            <motion.button
              className="w-12 h-6 bg-gray-200 dark:bg-gray-700 rounded-full relative transition-colors duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="w-4 h-4 bg-white rounded-full absolute top-1 left-1"
                animate={{ x: 0 }}
                transition={{ duration: 0.2 }}
              />
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPrivacySection = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Privacy</h2>
      
      <div className="card p-4">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Blocked Users</h3>
        <div className="text-center py-8">
          <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
          </svg>
          <p className="text-gray-500 dark:text-gray-400">No blocked users</p>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">SOS Contacts</h3>
        <div className="text-center py-8">
          <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <p className="text-gray-500 dark:text-gray-400">No SOS contacts added</p>
        </div>
      </div>
    </div>
  );

  const renderAboutSection = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">About</h2>
      
      <div className="card p-4">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">One In One</h3>
        <div className="space-y-3">
          <p className="text-gray-600 dark:text-gray-400">
            Version 1.0.0
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            A comprehensive mobile-first web app with messaging, calls, meetings, AI, notes, and mail.
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            Built with React, Flask, and powered by Gemini AI.
          </p>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Support</h3>
        <div className="space-y-2">
          <motion.button
            className="w-full text-left p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Help Center
          </motion.button>
          <motion.button
            className="w-full text-left p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Contact Support
          </motion.button>
          <motion.button
            className="w-full text-left p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Privacy Policy
          </motion.button>
          <motion.button
            className="w-full text-left p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Terms of Service
          </motion.button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Profile & Settings
        </h1>

        {/* Section Tabs */}
        <div className="flex space-x-1 overflow-x-auto scrollbar-hide">
          {sections.map((section) => (
            <motion.button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 whitespace-nowrap ${
                activeSection === section.id
                  ? 'bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span>{section.icon}</span>
              <span>{section.name}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto scrollbar-hide p-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeSection === 'profile' && renderProfileSection()}
            {activeSection === 'appearance' && renderAppearanceSection()}
            {activeSection === 'notifications' && renderNotificationsSection()}
            {activeSection === 'privacy' && renderPrivacySection()}
            {activeSection === 'about' && renderAboutSection()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {showEditProfile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-4"
            onClick={() => setShowEditProfile(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="bg-white dark:bg-gray-800 rounded-t-2xl sm:rounded-2xl w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Edit Profile
                  </h2>
                  <button
                    onClick={() => setShowEditProfile(false)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
                  >
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="p-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={editData.displayName}
                    onChange={(e) => setEditData({ ...editData, displayName: e.target.value })}
                    className="input-field"
                    placeholder="Enter display name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={editData.email}
                    onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                    className="input-field"
                    placeholder="Enter email"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    value={editData.username}
                    onChange={(e) => setEditData({ ...editData, username: e.target.value })}
                    className="input-field"
                    placeholder="Enter username"
                  />
                </div>
              </div>

              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex space-x-3">
                  <motion.button
                    onClick={() => setShowEditProfile(false)}
                    className="flex-1 btn-secondary py-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    onClick={handleSaveProfile}
                    className="flex-1 btn-primary py-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Save Changes
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfileTab;
