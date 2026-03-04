import { createContext, useState, useCallback } from 'react';

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [selectedContact, setSelectedContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [typingUsers, setTypingUsers] = useState(new Set());
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [unreadCounts, setUnreadCounts] = useState({});

  const addMessage = useCallback((message) => {
    setMessages((prev) => [...prev, message]);
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  const updateMessageStatus = useCallback((messageId, status) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg._id === messageId ? { ...msg, status } : msg
      )
    );
  }, []);

  const addTypingUser = useCallback((userId) => {
    setTypingUsers((prev) => new Set([...prev, userId]));
  }, []);

  const removeTypingUser = useCallback((userId) => {
    setTypingUsers((prev) => {
      const newSet = new Set(prev);
      newSet.delete(userId);
      return newSet;
    });
  }, []);

  const setUserOnlineStatus = useCallback((userId, isOnline) => {
    setOnlineUsers((prev) => {
      const newSet = new Set(prev);
      if (isOnline) {
        newSet.add(userId);
      } else {
        newSet.delete(userId);
      }
      return newSet;
    });
  }, []);

  const updateContactList = useCallback((newContacts) => {
    setContacts(newContacts);
  }, []);

  return (
    <ChatContext.Provider
      value={{
        selectedContact,
        setSelectedContact,
        messages,
        addMessage,
        clearMessages,
        updateMessageStatus,
        contacts,
        updateContactList,
        typingUsers,
        addTypingUser,
        removeTypingUser,
        onlineUsers,
        setUserOnlineStatus,
        unreadCounts,
        setUnreadCounts,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
