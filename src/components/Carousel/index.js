import React, { useState, useEffect } from "react";
import "./Carousel.css";
import { Style } from "@mui/icons-material";

const slides = [
  {
    bookCover:
      "crousal 1.jpg",
  },
  {
    bookCover:
      "crousal 2.jpg",
  },
  {
    bookCover:
      "crousal 3.jpg",
  },
  {
    bookCover:
      "BANNER2.jpg",
  },
];

export default function Carousel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  // 🔥 Auto-play effect
  useEffect(() => {
    const interval = setInterval(nextSlide, 6000); // Slide every 6 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="sliderDotContainer">
      <div className="slider-container">
        <button className="nav-button prev" onClick={prevSlide}>
          &lt;
        </button>
        <img
          className="slider-image"
          src={slides[currentSlide].bookCover}
          alt="imgs"
          style={{width:"95%", height:"auto"}}
        />

        {/* <div className="dots">
          {slides.map((_, index) => (
            <span
              key={index}
              className={`dot ${currentSlide === index ? "active" : ""}`}
              onClick={() => setCurrentSlide(index)} // 🔘 Clickable dots
            />
          ))}
        </div> */}

        <button className="nav-button next" onClick={nextSlide}>
          &gt;
        </button>
      </div>
    </div>
  );
}
