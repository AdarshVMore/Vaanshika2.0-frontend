// File: src/components/chat/ChatWindow.jsx
// Component for displaying chat messages and sending new messages

import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useAuth } from '../../hooks/useAuth';
import { motion } from 'framer-motion';
import { FaPaperPlane, FaSmile, FaPaperclip, FaImage, FaVideo, FaPhone, FaEllipsisV } from 'react-icons/fa';
import { demoChatMessages, demoChatRooms, demoUserData } from '../../utils/demoData';
import '../../styles/chatStyles.css';

const ChatWindow = ({ chatId, onSendMessage, isLoading }) => {
  const { user } = useAuth();
  const [messageText, setMessageText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [messages, setMessages] = useState([]);
  const [participants, setParticipants] = useState([]);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  
  // Load messages and participants from demo data
  useEffect(() => {
    if (chatId) {
      // Get messages for this chat
      const chatMessages = demoChatMessages[chatId] || [];
      setMessages(chatMessages);
      
      // Get chat room details
      const chatRoom = demoChatRooms.find(room => room.id === chatId);
      if (chatRoom) {
        setParticipants(chatRoom.participants);
      }
    }
  }, [chatId]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  // Handle sending a message
  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (!messageText.trim()) return;
    
    // Create a new message
    const newMessage = {
      id: `msg-${Date.now()}`,
      senderId: demoUserData.id,
      text: messageText,
      timestamp: new Date().toISOString(),
      read: false,
      attachments: []
    };
    
    // Add message to the local state
    setMessages(prevMessages => [...prevMessages, newMessage]);
    
    // Clear input
    setMessageText('');
  };
  
  // Format timestamp to readable time
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Format date for message groups
  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString(undefined, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
  };
  
  // Group messages by date for better UI organization
  const groupMessagesByDate = () => {
    if (!messages || messages.length === 0) return [];
    
    const groups = [];
    let currentDate = null;
    let currentMessages = [];
    
    messages.forEach(message => {
      const messageDate = new Date(message.timestamp).toDateString();
      
      if (messageDate !== currentDate) {
        if (currentMessages.length > 0) {
          groups.push({
            date: currentDate,
            formattedDate: formatDate(currentMessages[0].timestamp),
            messages: currentMessages
          });
        }
        
        currentDate = messageDate;
        currentMessages = [message];
      } else {
        currentMessages.push(message);
      }
    });
    
    if (currentMessages.length > 0) {
      groups.push({
        date: currentDate,
        formattedDate: formatDate(currentMessages[0].timestamp),
        messages: currentMessages
      });
    }
    
    return groups;
  };
  
  // Get user name from participants array
  const getUserName = (userId) => {
    const participant = participants.find(p => p.id === userId);
    return participant ? participant.name : 'Unknown User';
  };
  
  // Check if message is from current user
  const isCurrentUser = (userId) => {
    return userId === demoUserData.id;
  };
  
  // Handle file selection
  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    // In a real app, you would upload the file to a server
    // For demo purposes, we'll just create a message with the file name
    const newMessage = {
      id: `msg-${Date.now()}`,
      senderId: demoUserData.id,
      text: `Sent a file: ${files[0].name}`,
      timestamp: new Date().toISOString(),
      read: false,
      attachments: [{
        name: files[0].name,
        type: files[0].type,
        url: URL.createObjectURL(files[0])
      }]
    };
    
    setMessages(prevMessages => [...prevMessages, newMessage]);
  };
  
  // Handle emoji selection
  const handleEmojiSelect = (emoji) => {
    setMessageText(prev => prev + emoji);
    setShowEmojiPicker(false);
  };
  
  // Get chat name
  const getChatName = () => {
    if (participants.length <= 2) {
      const otherParticipant = participants.find(p => p.id !== demoUserData.id);
      return otherParticipant ? otherParticipant.name : 'Chat';
    } else {
      return 'Group Chat';
    }
  };
  
  // Render message groups
  const messageGroups = groupMessagesByDate();
  
  return (
    <div className="chat-container">
      {/* Chat header */}
      <div className="chat-header">
        <div className="chat-header-info">
          <div className="chat-avatar">
            {participants.length > 0 && participants[0].photoURL ? (
              <img src={participants[0].photoURL} alt={participants[0].name} />
            ) : (
              <div className="chat-avatar-fallback">
                {getChatName().charAt(0)}
              </div>
            )}
          </div>
          <div>
            <h3 className="chat-title">{getChatName()}</h3>
            <p className="chat-subtitle">{participants.length} participants</p>
          </div>
        </div>
        <div className="chat-actions">
          <button className="chat-action-button">
            <FaPhone />
          </button>
          <button className="chat-action-button">
            <FaVideo />
          </button>
          <button className="chat-action-button">
            <FaEllipsisV />
          </button>
        </div>
      </div>
      
      {/* Messages container */}
      <div className="chat-messages">
        {isLoading ? (
          <div className="chat-loading">
            <div className="chat-loading-spinner"></div>
          </div>
        ) : messageGroups.length === 0 ? (
          <div className="chat-empty-state">
            <div className="chat-empty-icon">
              <FaPaperPlane />
            </div>
            <h3 className="chat-empty-title">No messages yet</h3>
            <p className="chat-empty-description">
              Start the conversation by sending a message below.
            </p>
          </div>
        ) : (
          messageGroups.map((group, groupIndex) => (
            <div key={group.date}>
              <div className="chat-date-divider">
                <span className="chat-date-label">
                  {group.formattedDate}
                </span>
              </div>
              
              {group.messages.map((message, messageIndex) => {
                const isUser = isCurrentUser(message.senderId);
                const showSender = messageIndex === 0 || 
                                  group.messages[messageIndex - 1].senderId !== message.senderId;
                
                return (
                  <motion.div 
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: messageIndex * 0.05 }}
                    className={`chat-message ${isUser ? 'chat-message-outgoing' : 'chat-message-incoming'}`}
                  >
                    <div className="chat-message-content">
                      {showSender && !isUser && (
                        <div className="chat-message-sender">
                          {getUserName(message.senderId)}
                        </div>
                      )}
                      
                      <p className="chat-message-text">{message.text}</p>
                      <div className="chat-message-time">
                        {formatTime(message.timestamp)}
                      </div>
                      {message.attachments && message.attachments.length > 0 && (
                        <div className="chat-attachment">
                          {message.attachments.map((attachment, index) => (
                            <div key={index}>
                              {attachment.type.startsWith('image/') ? (
                                <img 
                                  src={attachment.url} 
                                  alt={attachment.name} 
                                  className="chat-attachment-image"
                                />
                              ) : (
                                <div className="chat-attachment-file">
                                  <FaPaperclip className="chat-attachment-icon" />
                                  <span className="chat-attachment-name">{attachment.name}</span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Message input */}
      <div className="chat-input-container">
        <form onSubmit={handleSendMessage} className="chat-input-form">
          <div className="chat-input-actions">
            <button 
              type="button"
              className="chat-input-action"
              onClick={() => fileInputRef.current.click()}
            >
              <FaPaperclip />
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              onChange={handleFileSelect}
            />
            
            <button 
              type="button"
              className="chat-input-action"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            >
              <FaSmile />
              {showEmojiPicker && (
                <div className="chat-emoji-picker">
                  <div className="chat-emoji-grid">
                    {['😊', '😂', '❤️', '👍', '🎉', '🙏', '😍', '🤔', '😢', '😎', '🥳', '😇', '🤗', '🤣', '😘', '😁'].map(emoji => (
                      <button
                        key={emoji}
                        type="button"
                        className="chat-emoji-button"
                        onClick={() => handleEmojiSelect(emoji)}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </button>
          </div>
          
          <div className="chat-input-field-container">
            <input
              type="text"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Type a message..."
              className="chat-input-field"
            />
          </div>
          
          <button 
            type="submit"
            disabled={!messageText.trim()}
            className="chat-send-button"
          >
            <FaPaperPlane />
          </button>
        </form>
      </div>
    </div>
  );
};

ChatWindow.propTypes = {
  chatId: PropTypes.string.isRequired,
  onSendMessage: PropTypes.func,
  isLoading: PropTypes.bool
};

ChatWindow.defaultProps = {
  onSendMessage: () => {},
  isLoading: false
};

export default ChatWindow; 