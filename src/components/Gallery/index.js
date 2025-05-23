import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./gallery.css";

const images = [
  "Kashi_Vishvanath_image.jpg",
  "Backimage.jpg",
  "IMG-20250224-WA0027.jpg",
  "IMG-20250224-WA0028.jpg",
  "A1.jpg",
  "A2.jpg",
  "A3.jpg",
  "A4.jpg",
  "Demanded pooja.png",
  "IMG-20250224-WA0019.jpg",
  "IMG-20250224-WA0029.jpg",
  "IMG-20250224-WA0030.jpg",
  "Sunday1.jpg",
  "Monday.jpg",
  "Tuesday.jpg",
  "Wednesday.jpg",
  "Thrusday.jpg",
  "Friday.jpg",
  "Saturday.jpg",
  "Sunday2.jpg",
];

const PhotoGallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);

  return (
    <div className="heading_class" id="galleryid">
      <h1><span style={{fontSize: "50px"}}>O</span>ur <span style={{fontSize: "50px"}}>P</span>hoto<span style={{color: "#ff1100"}}> <span style={{fontSize: "50px"}}>G</span>allery</span></h1>
      <div className="gallery-container">
        {images.map((src, index) => (
          <div key={index} className="gallery-item" onClick={() => setSelectedImage(src)}>
            <img src={src} alt={`Gallery ${index + 1}`} className="gallery-image" />
          </div>
        ))}
      </div>
      {selectedImage && (
        <div className="lightbox" onClick={() => setSelectedImage(null)}>
          <img src={selectedImage} alt="Enlarged" className="lightbox-image" />
        </div>
      )}
    </div>
  );
};

export default PhotoGallery;