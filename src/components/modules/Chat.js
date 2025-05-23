import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import io from 'socket.io-client';

let socket;

const Chat = () => {
  const { astroId } = useParams(); // used as room ID
  const location = useLocation();
  const role = location.state?.role || 'user'; // 'user' or 'astro'
  const userId = location.state?.userId || socket.id;

  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket = io('http://localhost:5000');
    socket.emit('joinRoom', {
      roomId: astroId,
      role,
      userId,
    });

    socket.on('receiveMessage', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.disconnect();
    };
  }, [astroId, role]);

  const handleSend = () => {
    if (input.trim()) {
      const messageData = {
        text: input,
        sender: role,
        userId,
        room: astroId,
        timestamp: new Date().toISOString(),
      };
      socket.emit('sendMessage', messageData);
    //   setMessages((prev) => [...prev, messageData]);
      setInput('');
    }
  };

  return (
    <div style={{ padding: 20, border: '1px solid #ccc', borderRadius: 8 }}>
      <h2>Chat Room with Astro: {astroId}</h2>

      <div
        style={{
          height: 300,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          padding: '10px',
          marginBottom: '12px',
          backgroundColor: '#f9f9f9',
          borderRadius: '8px',
        }}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              backgroundColor: msg.sender === 'user' ? '#DCF8C6' : 'pink',
              padding: '8px 12px',
              borderRadius: '12px',
              marginBottom: '4px',
              maxWidth: '60%',
            }}
          >
            <div style={{ fontSize: 14 }}>{msg.text}</div>
          </div>
        ))}
      </div>

      <div>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          style={{ width: '75%', padding: 8 }}
        />
        <button onClick={handleSend} style={{ padding: 8, marginLeft: 6 ,float:"right", backgroundColor:"red", color:"white", borderRadius:"10px"}}>
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
