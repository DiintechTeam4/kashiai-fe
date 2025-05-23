import React from "react";
import "./Footer.css";
import { Link } from "react-router-dom";

// import Chatbot from "../Chatbot";

export default function Footer() {
  // const [showChat, setShowChat] = React.useState(false);
  return (
    <footer className="footer" id="footerid">
  <div className="footer-content">
    <div className="footer-logo">
      <img
        src="KASHI AI LOGO.jpg"
        alt="KashiAI"
        className="logo"
        style={{ borderRadius: "50%" }}
      />
      <br />
      <b>Kashi AI</b>
      <p className="logo-text">
        An AI-powered spiritual platform offering authentic and traditional pooja services by the top priests of Kashi.
      </p>
    </div>

    <div className="footer-contact">
      <h2>HelpDesk</h2>
      <ul>
        <li>+91 8147540362</li>
        <li>contact@kashi.in</li>
        <li>Support: +91 8147540362</li>
      </ul>
    </div>

    <div className="footer-info">
      <h3>INFO</h3>
      <ul>
        <li><a href="#">Home</a></li>
        <li><a href="#">About us</a></li>
        <li><a href="#">Blog</a></li>
        <li><a href="#">Contact</a></li>
      </ul>
    </div>

    <div className="Service">
      <h3>Online Service</h3>
      <ul>
        <li><a href="#">Pooja</a></li>
        <li><a href="#">Darshan</a></li>
        <li><a href="#">Store</a></li>
        <li><a href="#">Astro</a></li>
      </ul>
    </div>
  </div>

  <div className="footer_playstore">
  <h2>Download Now </h2> <Link to="https://play.google.com/store/apps/details?id=com.diin.kashiai">
  <img src="Google play.jpg" alt="Not Available" width={"160px"} height={"50px"} 
  style={{borderRadius: "10px", marginLeft: "50px", marginTop: "-15px"}}
  className="playstore" /></Link>
  </div>

  <div className="footer-bottom">
    <p style={{ margin: "0px" }}>
      © 2025 - All Rights Reserved
    </p>
  </div>
</footer>
  );
}
