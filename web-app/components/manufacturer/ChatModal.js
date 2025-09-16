import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, User, DollarSign, Package } from 'lucide-react';
import { useChat } from '../../context/ChatContext';
import { useAuth } from '../../context/AuthContext';

export default function ChatModal({ isOpen, onClose, farmerName, batchId }) {
  const { conversations, addMessage, createConversation } = useChat();
  const { user } = useAuth();
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen && farmerName && batchId) {
      // Find existing conversation or create new one
      let existingConv = conversations.find(conv => 
        conv.farmerName === farmerName && conv.batchId === batchId
      );
      
      if (!existingConv) {
        const initialMessage = {
          sender: 'manufacturer',
          message: `Hello! I'm interested in your batch #${batchId}.`,
          timestamp: new Date()
        };
        const manufacturerName = user?.name || user?.email || 'Manufacturer';
        const newConvId = createConversation(manufacturerName, farmerName, batchId, initialMessage);
        setConversationId(newConvId);
        setMessages([initialMessage]);
      } else {
        setConversationId(existingConv.id);
        setMessages(existingConv.messages);
      }
    }
  }, [isOpen, farmerName, batchId, conversations]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !conversationId) return;

    const message = {
      sender: 'manufacturer',
      message: newMessage,
      timestamp: new Date()
    };

    addMessage(conversationId, message);
    setMessages(prev => [...prev, { ...message, id: prev.length + 1 }]);
    setNewMessage('');

    // Simulate farmer typing
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const responses = [
        "That sounds reasonable. What's your best offer?",
        "I can consider that price. When do you need delivery?",
        "Let me check the quality standards you require.",
        "I have premium quality herbs. Price is negotiable."
      ];
      const response = {
        sender: 'farmer',
        message: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date()
      };
      addMessage(conversationId, response);
      setMessages(prev => [...prev, { ...response, id: prev.length + 1 }]);
    }, 2000);
  };

  const sendQuickMessage = (message) => {
    if (!conversationId) return;
    
    const quickMsg = {
      sender: 'manufacturer',
      message,
      timestamp: new Date()
    };
    addMessage(conversationId, quickMsg);
    setMessages(prev => [...prev, { ...quickMsg, id: prev.length + 1 }]);
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white rounded-2xl w-full max-w-md h-[600px] flex flex-col shadow-2xl"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-4 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mr-3">
                  <User size={20} />
                </div>
                <div>
                  <h3 className="font-semibold">{farmerName}</h3>
                  <p className="text-sm text-green-100">Batch #{batchId}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.sender === 'manufacturer' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] ${
                  msg.sender === 'manufacturer'
                    ? 'bg-green-600 text-white rounded-l-2xl rounded-tr-2xl'
                    : 'bg-gray-100 text-gray-900 rounded-r-2xl rounded-tl-2xl'
                } p-3`}>
                  <p className="text-sm">{msg.message}</p>
                  <p className={`text-xs mt-1 ${
                    msg.sender === 'manufacturer' ? 'text-green-100' : 'text-gray-500'
                  }`}>
                    {formatTime(msg.timestamp)}
                  </p>
                </div>
              </motion.div>
            ))}
            
            {isTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="bg-gray-100 rounded-r-2xl rounded-tl-2xl p-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          <div className="px-4 py-2 border-t border-gray-200">
            <div className="flex space-x-2 mb-3">
              <button
                onClick={() => sendQuickMessage("What's your price per kg?")}
                className="flex items-center bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs hover:bg-blue-200 transition-colors"
              >
                <DollarSign size={12} className="mr-1" />
                Price per kg?
              </button>
              <button
                onClick={() => sendQuickMessage("Can you deliver by next week?")}
                className="flex items-center bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs hover:bg-purple-200 transition-colors"
              >
                <Package size={12} className="mr-1" />
                Delivery time?
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
        </motion.div>
      </div>
    </AnimatePresence>
  );
}