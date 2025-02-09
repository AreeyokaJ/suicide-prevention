import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import LiveChat from './LiveChat';

function App() {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);

  // Send message to backend
  const sendMessage = async () => {
    if (!message.trim()) return;

    // Add user message to chat history
    setChatHistory([...chatHistory, { sender: 'You', text: message }]);

    try {
      const response = await axios.post('http://localhost:5012/chatbot', {
        message,
      });

      // Add chatbot reply to chat history
      setChatHistory([
        ...chatHistory,
        { sender: 'You', text: message },
        { sender: 'Chatbot', text: response.data.reply },
      ]);
    } catch (error) {
      console.error("Error:", error);
      setChatHistory([
        ...chatHistory,
        { sender: 'Chatbot', text: 'Sorry, something went wrong!' },
      ]);
    }

    setMessage('');
  };

  return (
    <div className="App">
      <h1>Suicide Prevention Chatbot</h1>
      <div className="chatbox">
        {chatHistory.map((chat, index) => (
          <div
            key={index}
            className={chat.sender === 'You' ? 'user-message' : 'chatbot-message'}
          >
            <strong>{chat.sender}:</strong> {chat.text}
          </div>
        ))}
      </div>
      <div className="input-area">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
      
      
    </div>
    
  );
}

export default App;
