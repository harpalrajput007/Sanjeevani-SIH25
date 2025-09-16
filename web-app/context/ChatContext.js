import { createContext, useContext, useState, useEffect } from 'react';
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
  const [conversations, setConversations] = useState([]);
  
  // Initialize with empty state - conversations will be created dynamically

  const addMessage = (conversationId, message) => {
    setConversations(prev => prev.map(conv => 
      conv.id === conversationId 
        ? { 
            ...conv, 
            messages: [...conv.messages, { ...message, id: conv.messages.length + 1 }],
            lastMessage: message.message,
            timestamp: message.timestamp
          }
        : conv
    ));
  };

  const createConversation = (manufacturerName, farmerName, batchId, initialMessage) => {
    const existingConv = conversations.find(conv => 
      conv.manufacturerName === manufacturerName && 
      conv.farmerName === farmerName && 
      conv.batchId === batchId
    );
    
    if (existingConv) return existingConv.id;
    
    const newConv = {
      id: Date.now(),
      manufacturerName,
      farmerName,
      batchId,
      lastMessage: initialMessage.message,
      timestamp: initialMessage.timestamp,
      messages: [{ ...initialMessage, id: 1 }]
    };
    setConversations(prev => [...prev, newConv]);
    return newConv.id;
  };

  const getConversationsForUser = (userType, userName) => {
    return conversations.map(conv => ({
      ...conv,
      unread: Math.floor(Math.random() * 3) // Mock unread count
    }));
  };

  return (
    <ChatContext.Provider value={{
      conversations,
      addMessage,
      createConversation,
      getConversationsForUser
    }}>
      {children}
    </ChatContext.Provider>
  );
};