import { useState, useContext, useEffect } from 'react';
import { ChatContext } from '../context/ChatContext';
import { userAPI } from '../utils/api';
import { useSocket } from '../utils/socket';
import '../styles/Sidebar.css';

const Sidebar = () => {
  const { contacts, updateContactList, setSelectedContact, selectedContact } = useContext(ChatContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const socket = useSocket();

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      const response = await userAPI.getContacts();
      updateContactList(response.data);
    } catch (error) {
      console.error('Failed to load contacts:', error);
    }
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);

    if (!query.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    setLoading(true);
    try {
      const response = await userAPI.searchUsers(query);
      setSearchResults(response.data);
      setShowSearchResults(true);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddContact = async (userId) => {
    try {
      await userAPI.addContact(userId);
      await loadContacts();
      setSearchQuery('');
      setSearchResults([]);
      setShowSearchResults(false);
    } catch (error) {
      console.error('Failed to add contact:', error);
    }
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Chats</h2>
      </div>

      <div className="search-box">
        <input
          type="text"
          placeholder="Search contacts..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="search-input"
        />
      </div>

      {showSearchResults && (
        <div className="search-results">
          {loading ? (
            <p className="loading">Searching...</p>
          ) : searchResults.length > 0 ? (
            searchResults.map((user) => (
              <div key={user._id} className="search-result-item">
                <img src={user.profilePicture} alt={user.name} />
                <div className="user-info">
                  <p className="name">{user.name}</p>
                  <p className="username">@{user.username}</p>
                </div>
                <button
                  onClick={() => handleAddContact(user._id)}
                  className="add-btn"
                >
                  Add
                </button>
              </div>
            ))
          ) : (
            <p className="no-results">No users found</p>
          )}
        </div>
      )}

      <div className="contacts-list">
        {contacts.length === 0 ? (
          <p className="no-contacts">No contacts. Search to add friends!</p>
        ) : (
          contacts.map((contact) => (
            <div
              key={contact._id}
              className={`contact-item ${selectedContact?._id === contact._id ? 'active' : ''}`}
              onClick={() => setSelectedContact(contact)}
            >
              <img src={contact.profilePicture} alt={contact.name} />
              <div className="contact-info">
                <p className="contact-name">{contact.name}</p>
                <p className="contact-status">
                  {contact.isOnline ? 'Online' : 'Offline'}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Sidebar;
