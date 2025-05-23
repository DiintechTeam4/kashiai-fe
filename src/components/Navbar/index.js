import React, { useState } from "react";
import { CiSearch } from "react-icons/ci";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";

const Header = () => {
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); 

  const toggleNavbar = () => {
    setIsMobile(!isMobile);
  };

  const scrollToSection = (id) => {
    if (location.pathname !== "/") {
      
      navigate("/");
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }, 100); 
    } else {
      
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <nav className="navbar">
        <div className="desktopNavIconContainer">
          <img className="logo" src="KASHI AI LOGO.jpg" alt="logo" />
        </div>

        <div className={`navbar-links ${isMobile ? "active" : ""}`}>
          <ul className="mobileNavList">
            <li>Buy</li>
            <li>Sell</li>
            <li><Link to="/admin">Admin Dashboard</Link></li>
          </ul>
        </div>
        <button className="toggle-button" onClick={toggleNavbar}>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>
      </nav>

      <nav className="desktopNav bg-transparent">
        <div className="desktop">
          <div className="desktopNavIconContainer">
            <img className="logo" src="KASHI AI LOGO.jpg" alt="KashiAI" style={{ width: "60px", height: "60px", borderRadius: "50%", margin: "10px" }} />
            <h3 style={{ paddingTop: "30px" }}>
              <Link to="/">KashiAI</Link>
            </h3>
          </div>

          <div>
            <ul className="desktopNavList" style={{ marginTop: "5px" }}>
             
              <li onClick={() => scrollToSection("drsnid")}>DARSHAN</li>
              <li onClick={() => scrollToSection("poojaid")}>POOJA</li>
              <li onClick={() => scrollToSection("astroid")}>ASTRO</li>
              <li onClick={() => scrollToSection("footerid")}>CONTACT</li>

              <li className="gallery_class" style={{ color: "white", fontSize: "18px", fontWeight: "500" }}>
                <Link className="gallery" style={{ textDecoration: "none", color: "white" }} to="/gallery#galleryid">
                  Gallery
                </Link>
              </li>
            </ul>
          </div>

          <div className="desktopNavSearch">
            <input className="desktopNavSearchInput" type="search" placeholder="Search" />
            <button className="desktopNavSearchButton">
              <CiSearch size={20} fill="white" />
            </button>
          </div>

          <li style={{ listStyleType: "none", marginTop: "30px", display: "none" }}>
            <Link to="/admin" className="admim_text">DashBoard</Link>
          </li>
        </div>
      </nav>
    </>
  );
};

export default Header;
