import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, User, DollarSign, Clock, ChevronDown } from 'lucide-react';
import { useChat } from '../../context/ChatContext';
import { useAuth } from '../../context/AuthContext';

export default function MessengerWidget() {
  const { conversations: globalConversations, addMessage } = useChat();
  const { user } = useAuth();
  
  if (!user) {
    return null; // Don't render if user not logged in
  }
  const [isOpen, setIsOpen] = useState(false);
  const [conversations, setConversations] = useState([
    {
      id: 1,
      manufacturerName: 'GreenLife Pharmaceuticals',
      batchId: 'B001',
      lastMessage: 'What\'s your price per kg for turmeric?',
      timestamp: new Date(Date.now() - 300000),
      unread: 2,
      messages: [
        {
          id: 1,
          sender: 'manufacturer',
          message: 'Hello! I\'m interested in your turmeric batch B001.',
          timestamp: new Date(Date.now() - 600000)
        },
        {
          id: 2,
          sender: 'manufacturer',
          message: 'What\'s your price per kg for turmeric?',
          timestamp: new Date(Date.now() - 300000)
        }
      ]
    },
    {
      id: 2,
      manufacturerName: 'Ayur Wellness Co.',
      batchId: 'B002',
      lastMessage: 'Can you deliver by next week?',
      timestamp: new Date(Date.now() - 900000),
      unread: 0,
      messages: [
        {
          id: 1,
          sender: 'manufacturer',
          message: 'Hi! Your neem batch looks excellent.',
          timestamp: new Date(Date.now() - 1200000)
        },
        {
          id: 2,
          sender: 'farmer',
          message: 'Thank you! It\'s premium quality.',
          timestamp: new Date(Date.now() - 1000000)
        },
        {
          id: 3,
          sender: 'manufacturer',
          message: 'Can you deliver by next week?',
          timestamp: new Date(Date.now() - 900000)
        }
      ]
    }
  ]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    const currentUserName = user?.name || user?.email || 'Farmer';
    const farmerConvs = globalConversations
      .filter(conv => conv.farmerName === currentUserName)
      .map(conv => ({
        id: conv.id,
        manufacturerName: conv.manufacturerName,
        batchId: conv.batchId,
        lastMessage: conv.lastMessage,
        timestamp: conv.timestamp,
        unread: Math.floor(Math.random() * 3),
        messages: conv.messages
      }));
    setConversations(farmerConvs);
  }, [globalConversations, user]);

  const totalUnread = conversations.reduce((sum, conv) => sum + conv.unread, 0);

  const formatTime = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return timestamp.toLocaleDateString();
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const message = {
      id: selectedConversation.messages.length + 1,
      sender: 'farmer',
      message: newMessage,
      timestamp: new Date()
    };

    setConversations(prev => prev.map(conv => 
      conv.id === selectedConversation.id 
        ? { 
            ...conv, 
            messages: [...conv.messages, message],
            lastMessage: newMessage,
            timestamp: new Date()
          }
        : conv
    ));

    setSelectedConversation(prev => ({
      ...prev,
      messages: [...prev.messages, message]
    }));

    setNewMessage('');
  };

  const sendQuickReply = (message) => {
    const quickMsg = {
      id: selectedConversation.messages.length + 1,
      sender: 'farmer',
      message,
      timestamp: new Date()
    };

    setConversations(prev => prev.map(conv => 
      conv.id === selectedConversation.id 
        ? { 
            ...conv, 
            messages: [...conv.messages, quickMsg],
            lastMessage: message,
            timestamp: new Date()
          }
        : conv
    ));

    setSelectedConversation(prev => ({
      ...prev,
      messages: [...prev.messages, quickMsg]
    }));
  };

  return (
    <>
      {/* Floating Messenger Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-green-600 to-green-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl z-40"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <MessageCircle size={24} />
        {totalUnread > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
            {totalUnread}
          </span>
        )}
      </motion.button>

      {/* Messenger Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-2xl w-full max-w-4xl h-[600px] flex shadow-2xl"
            >
              {/* Conversations List */}
              <div className="w-1/3 border-r border-gray-200 flex flex-col">
                <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-4 rounded-tl-2xl">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Messages</h3>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="p-1 hover:bg-white/20 rounded"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                  {conversations.map((conv) => (
                    <motion.div
                      key={conv.id}
                      onClick={() => setSelectedConversation(conv)}
                      className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                        selectedConversation?.id === conv.id ? 'bg-green-50 border-l-4 border-l-green-600' : ''
                      }`}
                      whileHover={{ backgroundColor: '#f9fafb' }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center">
                            <h4 className="font-medium text-gray-900 truncate">{conv.manufacturerName}</h4>
                            {conv.unread > 0 && (
                              <span className="ml-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                {conv.unread}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-1">Batch #{conv.batchId}</p>
                          <p className="text-sm text-gray-500 truncate">{conv.lastMessage}</p>
                        </div>
                        <span className="text-xs text-gray-400 ml-2">{formatTime(conv.timestamp)}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Chat Area */}
              <div className="flex-1 flex flex-col">
                {selectedConversation ? (
                  <>
                    {/* Chat Header */}
                    <div className="bg-gray-50 p-4 border-b border-gray-200">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center mr-3">
                          <User size={20} className="text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{selectedConversation.manufacturerName}</h3>
                          <p className="text-sm text-gray-600">Batch #{selectedConversation.batchId}</p>
                        </div>
                      </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                      {selectedConversation.messages.map((msg) => (
                        <motion.div
                          key={msg.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex ${msg.sender === 'farmer' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`max-w-[80%] ${
                            msg.sender === 'farmer'
                              ? 'bg-green-600 text-white rounded-l-2xl rounded-tr-2xl'
                              : 'bg-gray-100 text-gray-900 rounded-r-2xl rounded-tl-2xl'
                          } p-3`}>
                            <p className="text-sm">{msg.message}</p>
                            <p className={`text-xs mt-1 ${
                              msg.sender === 'farmer' ? 'text-green-100' : 'text-gray-500'
                            }`}>
                              {formatTime(msg.timestamp)}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {/* Quick Replies */}
                    <div className="px-4 py-2 border-t border-gray-200">
                      <div className="flex space-x-2 mb-3">
                        <button
                          onClick={() => sendQuickReply("₹150 per kg, premium quality")}
                          className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs hover:bg-blue-200 transition-colors"
                        >
                          <DollarSign size={12} className="inline mr-1" />
                          Quote Price
                        </button>
                        <button
                          onClick={() => sendQuickReply("Available for delivery within 3 days")}
                          className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs hover:bg-purple-200 transition-colors"
                        >
                          <Clock size={12} className="inline mr-1" />
                          Delivery Time
                        </button>
                      </div>
                    </div>

                    {/* Message Input */}
                    <div className="p-4 border-t border-gray-200">
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                          placeholder="Type your message..."
                          className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                        <button
                          onClick={handleSendMessage}
                          disabled={!newMessage.trim()}
                          className="bg-green-600 text-white p-2 rounded-full hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <Send size={20} />
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-gray-500">
                    <div className="text-center">
                      <MessageCircle size={48} className="mx-auto mb-4 text-gray-300" />
                      <p>Select a conversation to start messaging</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}