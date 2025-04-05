import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Messages.css";

const Messages = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/messages");
        if (!response.ok) throw new Error("Failed to fetch messages");

        const data = await response.json();
        setMessages(data);
      } catch (err) {
        console.error("Error:", err);
      }
    };

    fetchMessages();
  }, []);

  return (
    <div className="messages-container">
      <h2>📩 Messages</h2>
      {messages.length === 0 ? (
        <p className="no-messages">No messages yet.</p>
      ) : (
        <ul className="messages-list">
          {messages.map((msg, index) => (
            <li key={index} className="message-item">
              <h3>{msg.subject}</h3>
              <p><strong>From:</strong> {msg.name} ({msg.email})</p>
              <p>{msg.message}</p>
            </li>
          ))}
        </ul>
      )}
      <button onClick={() => navigate("/")} className="back-btn">
        🔙 Back to Contact
      </button>
    </div>
  );
};

export default Messages;
