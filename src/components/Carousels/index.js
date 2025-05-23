import React, { useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./Carousels.css";

const books = [
  { image: "Sunday1.jpg" },
  { image: "Sunday2.jpg" },
  { image: "Monday.jpg" },
  { image: "Tuesday.jpg" },
  { image: "Wednesday.jpg" },
  { image: "Thrusday.jpg" },
  { image: "Friday.jpg" },
  { image: "Saturday.jpg" },
];

function Carousels() {
  const [selectedImage, setSelectedImage] = useState(null);

  const settings = {
    className: "center",
    centerMode: true,
    infinite: true,
    centerPadding: "10px",
    slidesToShow: 3,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 2000,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  };

  function SampleNextArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{
          ...style,
          display: "block",
          background: "lightgrey",
          borderRadius: "50%",
          width: "40px",
          height: "40px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginRight: "25px",
        }}
        onClick={onClick}
      />
    );
  }

  function SamplePrevArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{
          ...style,
          display: "block",
          background: "lightgrey",
          borderRadius: "50%",
          width: "40px",
          height: "40px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 100,
          marginLeft: "25px",
        }}
        onClick={onClick}
      />
    );
  }

  return (
    <div className="slider-container">
      <Slider {...settings}>
        {books.map((book, index) => (
          <div key={index} className="sliders">
            <img
              src={book.image}
              alt={`Book ${index + 1}`}
              className="carousel-image"
              onClick={() => setSelectedImage(book.image)}
            />
          </div>
        ))}
      </Slider>

      {/* Modal for Enlarged Image */}
      {selectedImage && (
        <div className="image-modal" onClick={() => setSelectedImage(null)}>
          <img src={selectedImage} alt="Enlarged" className="enlarged-image" />
        </div>
      )}
    </div>
  );
}

export default Carousels;
