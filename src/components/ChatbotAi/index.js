import React from "react";
import "./ChatbotAi.css";
import Chatbot from "../Chatbot";
const ChatbotAi = () => {
  const [showChat, setShowChat] = React.useState(false);
  return (
    <div>
      {" "}
      {showChat ? (
        <div className="chatbot">
          <Chatbot onClose={() => setShowChat(false)} />
        </div>
      ) : (
        <button className="chat-widget" onClick={() => setShowChat(!showChat)}>
          {/* <div className="chat-bubble">Hi! What can I do for you?</div> */}
          <div className="chat-avatar">
            <img
              src="KASHI AI LOGO.jpg"
              alt="Chat Avatar"
            />
          </div>
        </button>
      )}
    </div>
  );
};

export default ChatbotAi;
