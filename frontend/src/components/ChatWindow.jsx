import { useState, useContext, useEffect, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';
import { messageAPI } from '../utils/api';
import { useSocket, useSocketListener } from '../utils/socket';
import '../styles/ChatWindow.css';

const ChatWindow = () => {
  const { user } = useContext(AuthContext);
  const { selectedContact, messages, addMessage, updateMessageStatus, addTypingUser, removeTypingUser } = useContext(ChatContext);
  const [newMessage, setNewMessage] = useState('');
  const [mediaFiles, setMediaFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [replyTo, setReplyTo] = useState(null);
  const socket = useSocket();
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const fileInputRef = useRef(null);
  const messagesMapRef = useRef({}); // Store messages by ID for reply lookup

  const emojis = ['😀', '😂', '😍', '😢', '😠', '👍', '👋', '❤️', '🎉', '🔥'];

  // Update messages map for quick lookup during replies
  useEffect(() => {
    messages.forEach(msg => {
      messagesMapRef.current[msg._id] = msg;
    });
  }, [messages]);

  useEffect(() => {
    if (selectedContact) {
      loadMessages();
      messagesMapRef.current = {}; // Clear messages map when changing contact
      // Mark messages as read when opening the conversation
      setTimeout(() => markAsRead(), 500);
    }
  }, [selectedContact]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useSocketListener('receive_message', (data) => {
    console.log('Message received:', data);
    if (selectedContact) {
      const senderId = typeof data.sender === 'string' ? data.sender : data.sender?._id;
      const selectedContactId = selectedContact._id;

      console.log(`Comparing sender: ${senderId} with selectedContact: ${selectedContactId}`);

      if (senderId === selectedContactId) {
        addMessage({
          ...data,
          sender: data.sender,
        });
        messagesMapRef.current[data._id] = data; // Store for reply lookup
        markAsRead();
      }
    }
  });

  useSocketListener('user_typing', (data) => {
    if (selectedContact && data.sender === selectedContact._id) {
      addTypingUser(selectedContact._id);
    }
  });

  useSocketListener('user_stop_typing', (data) => {
    if (selectedContact && data.sender === selectedContact._id) {
      removeTypingUser(selectedContact._id);
    }
  });

  useSocketListener('message_sent', (data) => {
    updateMessageStatus(data.messageId, data.status);
  });

  useSocketListener('messages_seen', (data) => {
    // When sender receives this, mark all messages in this conversation as seen
    const sendersMessages = messages.filter(
      msg => msg.conversationId === data.conversationId
    );
    sendersMessages.forEach(msg => {
      updateMessageStatus(msg._id, 'seen');
    });
  });

  const loadMessages = async () => {
    try {
      setLoading(true);
      const conversationId = [user._id, selectedContact._id].sort().join('-');
      const response = await messageAPI.getMessages(conversationId);
      console.log('Messages loaded:', response.data);
    } catch (error) {
      console.error('Failed to load messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async () => {
    if (!selectedContact) return;
    try {
      const conversationId = [user._id, selectedContact._id].sort().join('-');
      await messageAPI.markAsRead(conversationId);
      socket.emit('mark_as_read', { conversationId, userId: user._id });
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const handleTyping = () => {
    if (!selectedContact || !socket) return;

    if (!isTyping) {
      setIsTyping(true);
      socket.emit('typing', {
        sender: user._id,
        recipient: selectedContact._id,
      });
    }

    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      socket.emit('stop_typing', {
        sender: user._id,
        recipient: selectedContact._id,
      });
    }, 1000);
  };

  const handleMediaSelect = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => {
      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');
      const isLargeEnough = file.size > 0;
      return (isImage || isVideo) && isLargeEnough;
    });

    if (validFiles.length > 0) {
      setMediaFiles((prev) => [...prev, ...validFiles]);
    }

    e.target.value = '';
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if ((!newMessage.trim() && mediaFiles.length === 0) || !selectedContact || !socket) return;

    const conversationId = [user._id, selectedContact._id].sort().join('-');
    let mediaUrls = [];

    // Convert media files to base64
    if (mediaFiles.length > 0) {
      try {
        for (const file of mediaFiles) {
          const base64 = await convertToBase64(file);
          mediaUrls.push({
            url: base64,
            type: file.type.startsWith('image/') ? 'image' : 'video',
            size: file.size,
            name: file.name,
          });
        }
      } catch (error) {
        console.error('Error converting media:', error);
        return;
      }
    }

    const messageData = {
      sender: user._id,
      recipient: selectedContact._id,
      content: newMessage,
      conversationId,
      mediaUrls,
      replyTo: replyTo ? replyTo._id : null,
    };

    socket.emit('send_message', messageData);

    // Optimistic update
    addMessage({
      ...messageData,
      _id: Date.now().toString(),
      timestamp: new Date(),
      status: 'delivered',
      sender: user,
      replyTo: replyTo,
    });

    setNewMessage('');
    setMediaFiles([]);
    setReplyTo(null);
    setShowEmojiPicker(false);

    socket.emit('stop_typing', {
      sender: user._id,
      recipient: selectedContact._id,
    });
  };

  const removeMedia = (index) => {
    setMediaFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleReply = (message) => {
    setReplyTo(message);
  };

  if (!selectedContact) {
    return (
      <div className="chat-window empty">
        <div className="empty-state">
          <h2>No conversation selected</h2>
          <p>Select a contact from the sidebar to start chatting</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-window">
      <div className="chat-header">
        <div className="contact-header">
          <img
            src={selectedContact.profilePicture}
            alt={selectedContact.name}
            className="contact-avatar"
          />
          <div className="contact-details">
            <h3>{selectedContact.name}</h3>
            <p>
              {selectedContact.isOnline ? (
                <><span className="online-indicator"></span> Online</>
              ) : (
                'Offline'
              )}
            </p>
          </div>
        </div>
      </div>

      <div className="messages-container">
        {loading ? (
          <p className="loading">Loading messages...</p>
        ) : messages.length === 0 ? (
          <p className="no-messages">
            No messages yet. Say hello!
          </p>
        ) : (
          messages.map((message) => (
            <div
              key={message._id}
              className={`message ${message.sender === user._id || (typeof message.sender === 'object' && message.sender?._id === user._id) ? 'sent' : 'received'}`}
            >
              {/* Reply preview */}
              {message.replyTo && (
                <div className="reply-preview">
                  <div className="reply-content">
                    <p className="reply-label">Replying to:</p>
                    <p className="reply-text">
                      {typeof message.replyTo === 'string'
                        ? messagesMapRef.current[message.replyTo]?.content || 'Message not found'
                        : message.replyTo?.content || 'Message not found'}
                    </p>
                  </div>
                </div>
              )}

              <div className="message-content">
                {message.content && <p>{message.content}</p>}

                {/* Display media */}
                {message.mediaUrls && message.mediaUrls.length > 0 && (
                  <div className="message-media">
                    {message.mediaUrls.map((media, idx) => (
                      <div key={idx}>
                        {media.type === 'image' ? (
                          <img src={media.url} alt="shared" />
                        ) : (
                          <video controls>
                            <source src={media.url} />
                            Your browser does not support the video tag.
                          </video>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {message.sender === user._id || (typeof message.sender === 'object' && message.sender?._id === user._id) ? (
                  <span className="message-status">
                    {message.status === 'delivered' && '✓'}
                    {message.status === 'seen' && '✓✓'}
                  </span>
                ) : null}
              </div>

              <div className="message-actions">
                <button
                  className="reply-btn"
                  onClick={() => handleReply(message)}
                  title="Reply to message"
                >
                  ↩️
                </button>
              </div>

              <p className="message-time">
                {new Date(message.timestamp).toLocaleTimeString()}
              </p>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-area">
        {showEmojiPicker && (
          <div className="emoji-picker">
            {emojis.map((emoji) => (
              <button
                key={emoji}
                onClick={() => {
                  setNewMessage(newMessage + emoji);
                  setShowEmojiPicker(false);
                }}
              >
                {emoji}
              </button>
            ))}
          </div>
        )}

        {/* Media Preview */}
        {mediaFiles.length > 0 && (
          <div className="media-preview">
            {mediaFiles.map((file, index) => (
              <div key={index} className="preview-item">
                {file.type.startsWith('image/') ? (
                  <img src={URL.createObjectURL(file)} alt="preview" />
                ) : (
                  <video>
                    <source src={URL.createObjectURL(file)} />
                  </video>
                )}
                <button
                  className="remove-media"
                  onClick={() => removeMedia(index)}
                  type="button"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Reply preview */}
        {replyTo && (
          <div className="reply-to-preview">
            <div className="reply-preview-content">
              <p className="reply-label">Replying to message:</p>
              <p className="reply-preview-text">{replyTo.content || 'Media message'}</p>
            </div>
            <button
              className="cancel-reply-btn"
              onClick={() => setReplyTo(null)}
              type="button"
            >
              ✕
            </button>
          </div>
        )}

        <form onSubmit={handleSendMessage} className="message-form">
          <button
            type="button"
            className="emoji-btn"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            title="Emoji"
          >
            😊
          </button>

          <button
            type="button"
            className="media-btn"
            onClick={() => fileInputRef.current?.click()}
            title="Share image or video"
          >
            📎
          </button>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,video/*"
            onChange={handleMediaSelect}
            style={{ display: 'none' }}
          />

          <input
            type="text"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value);
              handleTyping();
            }}
            className="message-input"
          />
          <button type="submit" className="send-btn">
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;

