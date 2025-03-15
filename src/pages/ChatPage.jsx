// File: src/pages/ChatPage.jsx
// Chat page for family communication

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaPlus, FaSearch, FaUsers, FaEllipsisV, FaTimes } from 'react-icons/fa';

// Components
import ChatWindow from '../components/chat/ChatWindow';
import LoadingSpinner from '../components/common/LoadingSpinner';

// Hooks
import { useAuth } from '../hooks/useAuth';

// Demo Data
import { demoChatRooms, demoUserData } from '../utils/demoData';

// Styles
import '../styles/chatStyles.css';

const ChatPage = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [chatRooms, setChatRooms] = useState([]);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewRoomModal, setShowNewRoomModal] = useState(false);
  const [newRoomData, setNewRoomData] = useState({
    name: '',
    description: '',
    type: 'family'
  });
  
  // Load chat rooms from demo data
  useEffect(() => {
    const loadChatRooms = async () => {
      setLoading(true);
      try {
        // Use demo data
        setChatRooms(demoChatRooms);
        setError(null);
      } catch (err) {
        console.error('Error loading chat rooms:', err);
        setError('Failed to load chat rooms');
      } finally {
        setLoading(false);
      }
    };
    
    loadChatRooms();
  }, []);
  
  // Select room when roomId changes
  useEffect(() => {
    if (roomId && chatRooms.length > 0) {
      const room = chatRooms.find(room => room.id === roomId);
      if (room) {
        setCurrentRoom(room);
      } else {
        // If room not found, navigate to the first available room
        if (chatRooms.length > 0) {
          navigate(`/chat/${chatRooms[0].id}`);
        }
      }
    } else if (chatRooms.length > 0 && !roomId) {
      // If no roomId is provided, navigate to the first room
      navigate(`/chat/${chatRooms[0].id}`);
    }
  }, [roomId, chatRooms, navigate]);
  
  // Filter chat rooms based on search query
  const filteredChatRooms = chatRooms.filter(room => {
    if (!searchQuery) return true;
    
    const searchLower = searchQuery.toLowerCase();
    
    // Check if room name matches
    if (room.name && room.name.toLowerCase().includes(searchLower)) {
      return true;
    }
    
    // Check if any participant name matches
    if (room.participants && room.participants.some(p => 
      p.name && p.name.toLowerCase().includes(searchLower)
    )) {
      return true;
    }
    
    // Check if last message matches
    if (room.lastMessage && room.lastMessage.text && 
        room.lastMessage.text.toLowerCase().includes(searchLower)) {
      return true;
    }
    
    return false;
  });
  
  // Handle creating a new chat room
  const handleCreateRoom = (e) => {
    e.preventDefault();
    
    if (!newRoomData.name.trim()) {
      return;
    }
    
    // Create a new room with demo data
    const newRoom = {
      id: `room-${Date.now()}`,
      name: newRoomData.name,
      description: newRoomData.description,
      type: newRoomData.type,
      createdAt: new Date().toISOString(),
      participants: [
        {
          id: demoUserData.id,
          name: demoUserData.name,
          photoURL: demoUserData.photoURL
        }
      ],
      lastMessage: null,
      unreadCount: 0
    };
    
    // Add the new room to the list
    setChatRooms(prevRooms => [...prevRooms, newRoom]);
    
    // Reset form and close modal
    setNewRoomData({
      name: '',
      description: '',
      type: 'family'
    });
    setShowNewRoomModal(false);
    
    // Navigate to the new room
    navigate(`/chat/${newRoom.id}`);
  };
  
  // Handle sending a message
  const handleSendMessage = (text) => {
    // In a real app, this would send the message to the server
    console.log('Sending message:', text);
  };
  
  // Get the other participant's name for direct chats
  const getChatName = (room) => {
    if (room.name) return room.name;
    
    if (room.participants && room.participants.length === 2) {
      const otherParticipant = room.participants.find(p => p.id !== demoUserData.id);
      return otherParticipant ? otherParticipant.name : 'Chat';
    }
    
    return 'Group Chat';
  };
  
  // Get avatar for the chat room
  const getChatAvatar = (room) => {
    if (room.photoURL) return room.photoURL;
    
    if (room.participants && room.participants.length === 2) {
      const otherParticipant = room.participants.find(p => p.id !== demoUserData.id);
      return otherParticipant && otherParticipant.photoURL ? otherParticipant.photoURL : null;
    }
    
    return null;
  };
  
  // Get initials for avatar fallback
  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };
  
  return (
    <div className="h-screen flex">
      <div className="flex h-full overflow-hidden w-full">
        {/* Sidebar */}
        <motion.div 
          className="chat-sidebar"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {/* Sidebar header */}
          <div className="chat-sidebar-header">
            <h1 className="chat-sidebar-title">Messages</h1>
            
            <div className="chat-search-container">
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="chat-search-input"
              />
              <FaSearch className="chat-search-icon" />
              {searchQuery && (
                <button
                  className="chat-search-clear"
                  onClick={() => setSearchQuery('')}
                >
                  <FaTimes />
                </button>
              )}
            </div>
          </div>
          
          {/* Chat rooms list */}
          <div className="chat-rooms-container">
            {loading ? (
              <div className="chat-loading">
                <LoadingSpinner />
              </div>
            ) : error ? (
              <div className="chat-error">
                {error}
              </div>
            ) : filteredChatRooms.length === 0 ? (
              <div className="chat-empty-rooms">
                {searchQuery ? 'No conversations match your search' : 'No conversations yet'}
              </div>
            ) : (
              <div className="chat-rooms-list">
                {filteredChatRooms.map(room => (
                  <motion.div
                    key={room.id}
                    className={`chat-room-item ${
                      currentRoom && currentRoom.id === room.id ? 'chat-room-active' : ''
                    }`}
                    onClick={() => navigate(`/chat/${room.id}`)}
                    whileHover={{ backgroundColor: 'rgba(0,0,0,0.05)' }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="chat-room-content">
                      <div className="chat-room-avatar-container">
                        {getChatAvatar(room) ? (
                          <img 
                            src={getChatAvatar(room)} 
                            alt={getChatName(room)} 
                            className="chat-room-avatar"
                          />
                        ) : (
                          <div className="chat-room-avatar-fallback">
                            {getInitials(getChatName(room))}
                          </div>
                        )}
                        {room.unreadCount > 0 && (
                          <div className="chat-room-badge">
                            {room.unreadCount}
                          </div>
                        )}
                      </div>
                      <div className="chat-room-info">
                        <div className="chat-room-header">
                          <h3 className="chat-room-name">
                            {getChatName(room)}
                          </h3>
                          {room.lastMessage && (
                            <span className="chat-room-time">
                              {new Date(room.lastMessage.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          )}
                        </div>
                        <p className="chat-room-preview">
                          {room.lastMessage ? room.lastMessage.text : 'No messages yet'}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
          
          {/* New chat button */}
          <div className="chat-sidebar-footer">
            <button
              className="chat-new-button"
              onClick={() => setShowNewRoomModal(true)}
            >
              <FaPlus className="chat-new-button-icon" />
              New Conversation
            </button>
          </div>
        </motion.div>
        
        {/* Chat area */}
        <motion.div 
          className="chat-main"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          {currentRoom ? (
            <ChatWindow 
              chatId={currentRoom.id}
              onSendMessage={handleSendMessage}
              isLoading={false}
            />
          ) : (
            <div className="chat-empty-state">
              <div className="chat-empty-icon">
                <FaUsers />
              </div>
              <h2 className="chat-empty-title">
                Select a conversation
              </h2>
              <p className="chat-empty-description">
                Choose an existing conversation from the sidebar or start a new one to connect with your family members.
              </p>
              <button
                className="chat-action-button-primary"
                onClick={() => setShowNewRoomModal(true)}
              >
                <FaPlus className="chat-button-icon" />
                Start New Conversation
              </button>
            </div>
          )}
        </motion.div>
      </div>
      
      {/* New chat room modal */}
      {showNewRoomModal && (
        <div className="chat-modal-overlay">
          <motion.div 
            className="chat-modal"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <div className="chat-modal-content">
              <h2 className="chat-modal-title">
                New Conversation
              </h2>
              
              <form onSubmit={handleCreateRoom}>
                <div className="chat-form-group">
                  <label className="chat-form-label">
                    Name
                  </label>
                  <input
                    type="text"
                    value={newRoomData.name}
                    onChange={(e) => setNewRoomData({ ...newRoomData, name: e.target.value })}
                    placeholder="Enter conversation name"
                    className="chat-form-input"
                    required
                  />
                </div>
                
                <div className="chat-form-group">
                  <label className="chat-form-label">
                    Description (optional)
                  </label>
                  <textarea
                    value={newRoomData.description}
                    onChange={(e) => setNewRoomData({ ...newRoomData, description: e.target.value })}
                    placeholder="Enter a description"
                    className="chat-form-textarea"
                    rows={3}
                  />
                </div>
                
                <div className="chat-form-group">
                  <label className="chat-form-label">
                    Type
                  </label>
                  <select
                    value={newRoomData.type}
                    onChange={(e) => setNewRoomData({ ...newRoomData, type: e.target.value })}
                    className="chat-form-select"
                  >
                    <option value="family">Family Group</option>
                    <option value="direct">Direct Message</option>
                    <option value="event">Event Planning</option>
                  </select>
                </div>
                
                <div className="chat-form-actions">
                  <button
                    type="button"
                    onClick={() => setShowNewRoomModal(false)}
                    className="chat-button-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="chat-button-primary"
                  >
                    Create
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ChatPage; 