import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import { useAuth } from './AuthContext';

const ChatContext = createContext();

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState({});
  const [socket, setSocket] = useState(null);
  const [typingUsers, setTypingUsers] = useState({});
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const { isAuthenticated, user } = useAuth();


  // Configure axios to include JWT token
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [isAuthenticated]);

  // Also configure axios on every request to ensure token is fresh
  const getAuthHeaders = useCallback(() => {
    const token = localStorage.getItem('token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }, []);

  useEffect(() => {
    // Only initialize socket connection if user is authenticated
    if (!isAuthenticated || !user) {
      if (socket) {
        socket.close();
        setSocket(null);
      }
      return;
    }

    // Initialize socket connection with JWT token
    const token = localStorage.getItem('token');
    const newSocket = io(process.env.REACT_APP_API_URL || 'http://localhost:5000', {
      auth: {
        token: token
      }
    });
    setSocket(newSocket);

    newSocket.on('message', (message) => {
      setMessages(prev => ({
        ...prev,
        [message.chatId]: [
          ...(prev[message.chatId] || []),
          message
        ]
      }));
    });

    newSocket.on('typing', (data) => {
      setTypingUsers(prev => ({
        ...prev,
        [data.chatId]: data.users
      }));
    });

    newSocket.on('userOnline', (userId) => {
      setOnlineUsers(prev => new Set([...prev, userId]));
    });

    newSocket.on('userOffline', (userId) => {
      setOnlineUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    });

    return () => {
      newSocket.close();
    };
  }, [isAuthenticated, user]);

  const createChat = async (participantUsernames) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/chats`, {
        participants: participantUsernames
      }, {
        headers: getAuthHeaders()
      });
      const newChat = response.data.chat;
      setChats(prev => [newChat, ...prev]);
      return { success: true, chat: newChat };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to create chat' 
      };
    }
  };

  const sendMessage = async (chatId, content, type = 'text', metadata = {}) => {
    try {
      const message = {
        chatId,
        content,
        type,
        metadata,
        timestamp: new Date().toISOString()
      };

      // Optimistic update
      setMessages(prev => ({
        ...prev,
        [chatId]: [
          ...(prev[chatId] || []),
          { ...message, id: 'temp-' + Date.now(), status: 'sending' }
        ]
      }));

      const response = await axios.post(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/chats/messages`, message, {
        headers: getAuthHeaders()
      });
      const sentMessage = response.data.message;

      // Update with actual message
      setMessages(prev => ({
        ...prev,
        [chatId]: prev[chatId].map(msg => 
          msg.id.startsWith('temp-') ? sentMessage : msg
        )
      }));

      // Emit to socket
      if (socket) {
        socket.emit('sendMessage', sentMessage);
      }

      return { success: true, message: sentMessage };
    } catch (error) {
      // Remove optimistic update on error
      setMessages(prev => ({
        ...prev,
        [chatId]: prev[chatId].filter(msg => !msg.id.startsWith('temp-'))
      }));

      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to send message' 
      };
    }
  };

  const loadChats = useCallback(async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/chats`, {
        headers: getAuthHeaders()
      });
      setChats(response.data.chats);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to load chats' 
      };
    }
  }, [getAuthHeaders]);

  const loadMessages = useCallback(async (chatId) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/chats/${chatId}/messages`, {
        headers: getAuthHeaders()
      });
      setMessages(prev => ({
        ...prev,
        [chatId]: response.data.messages
      }));
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to load messages' 
      };
    }
  }, [getAuthHeaders]);

  const startTyping = (chatId) => {
    if (socket) {
      socket.emit('typing', { chatId, isTyping: true });
    }
  };

  const stopTyping = (chatId) => {
    if (socket) {
      socket.emit('typing', { chatId, isTyping: false });
    }
  };

  const searchUsers = useCallback(async (query) => {
    try {
      if (!isAuthenticated || !user) {
        return { success: false, error: 'User not authenticated' };
      }

      const authHeaders = getAuthHeaders();
      const response = await axios.get(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/users/search?q=${query}`, {
        headers: authHeaders
      });
      
      return { success: true, users: response.data.users };
    } catch (error) {
      console.error('Search users error:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to search users' 
      };
    }
  }, [isAuthenticated, user, getAuthHeaders]);

  const addReaction = async (messageId, emoji) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/chats/messages/${messageId}/reactions`, {
        emoji
      }, {
        headers: getAuthHeaders()
      });
      return { success: true, reaction: response.data.reaction };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to add reaction' 
      };
    }
  };

  const value = {
    chats,
    activeChat,
    messages,
    typingUsers,
    onlineUsers,
    setActiveChat,
    createChat,
    sendMessage,
    loadChats,
    loadMessages,
    startTyping,
    stopTyping,
    searchUsers,
    addReaction
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};
