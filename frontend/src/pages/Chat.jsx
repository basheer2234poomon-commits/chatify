import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';
import { useSocket, useSocketListener } from '../utils/socket';
import Sidebar from '../components/Sidebar';
import ChatWindow from '../components/ChatWindow';
import '../styles/Chat.css';

const Chat = () => {
  const { user, logout } = useContext(AuthContext);
  const { contacts, selectedContact, setUserOnlineStatus } = useContext(ChatContext);
  const [showProfile, setShowProfile] = useState(false);
  const socket = useSocket();

  // Listen for user online/offline status changes
  useSocketListener('user_status_change', (data) => {
    const { userId, isOnline } = data;
    setUserOnlineStatus(userId, isOnline);
    console.log(`User ${userId} is ${isOnline ? 'online' : 'offline'}`);
  });

  const handleLogout = async () => {
    await logout();
    window.location.href = '/login';
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="chat-container">
      <Sidebar />
      <ChatWindow />

      {showProfile && (
        <div className="profile-modal">
          <div className="profile-content">
            <h2>Profile</h2>
            <img
              src={user.profilePicture}
              alt={user.name}
              className="profile-pic-large"
            />
            <div className="profile-info">
              <p>
                <strong>Name:</strong> {user.name}
              </p>
              <p>
                <strong>Username:</strong> @{user.username}
              </p>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <p>
                <strong>Bio:</strong> {user.bio || 'No bio'}
              </p>
            </div>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
            <button onClick={() => setShowProfile(false)} className="close-btn">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;
