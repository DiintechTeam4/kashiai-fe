import React from "react";
// import { IoClose } from "react-icons/fi";
import { IoClose, IoSend } from "react-icons/io5";
import "./Chatbot.css";
const Chatbot = ({ onClose }) => {
  return (
    <div className="chatbotContainer" id="chatid">
      <div className="chatbotHeader">
        <button className="chatbotClose" onClick={onClose}>
          <IoClose size={20} />
        </button>
      </div>
      <div>
        <h1 className="Livetext">Live Chat</h1>
        <br />
        <div className="chatbotBody">
          <div className="chatbotMessage">
            <img
              className="chatbotAvatar"
              src="KASHI AI LOGO.jpg"
              alt="Chat Avatar"
            />
            <div style={{ marginLeft: "10px", textAlign: "left" }}>
              <p>Moster Bot</p>
              <p>Hi</p>
            </div>
          </div>
          <button className="chatbotButton">
            Chat now &nbsp; <IoSend size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
