

import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const ImageCarousel = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,          // Enable automatic sliding
    autoplaySpeed: 2000,     // Set the speed of automatic sliding in milliseconds (e.g., 2000ms = 2 seconds)
  };

  return (
    <div className="max-w-screen-lg mx-auto mt-8" style={{ width: "85%" }}>
      <Slider {...settings}>
        {/* ... Your slide content remains the same */}
        <div className="relative">
          <img
            src="https://placekitten.com/800/400"
            className="w-full"
            alt="Slide 1"
          />
          <div
            className="absolute top-0 left-0 right-0 text-center text-white"
            style={{
              backgroundColor: "white",
              borderRadius: "10px",
              height: "auto",
            }}
          >
            <h2 className="text-2xl font-bold" style={{ padding: "2px" }}>
              First Slide
            </h2>
            <p className="text-lg" style={{ padding: "5px" }}>
              Some representative placeholder content for the first slide.
            </p>
          </div>
        </div>
        {/* ... Repeat for other slides */}
           <div className="relative">
          <img
            src="https://placekitten.com/800/401"
            className="w-full"
            alt="Slide 2"
          />
          <div
            className="absolute top-0 left-0 right-0 text-center text-white"
            style={{
              backgroundColor: "white",
              borderRadius: "10px",
              height: "auto",
            }}
          >
            <h2 className="text-2xl font-bold" style={{ padding: "2px" }}>
              second Slide
            </h2>
            <p className="text-lg" style={{ padding: "5px" }}>
              Some representative placeholder content for the first slide.
            </p>
          </div>
        </div>
        <div className="relative">
          <img
            src="https://placekitten.com/800/402"
            className="w-full"
            alt="Slide 3"
          />
          <div
            className="absolute top-0 left-0 right-0 text-center text-white"
            style={{
              backgroundColor: "white",
              borderRadius: "10px",
              height: "auto",
            }}
          >
            <h2 className="text-2xl font-bold" style={{ padding: "2px" }}>
              third Slide
            </h2>
            <p className="text-lg" style={{ padding: "5px" }}>
              Some representative placeholder content for the first slide.
            </p>
          </div>
        </div>        
      </Slider>
    </div>
  );
};

export default ImageCarousel;
