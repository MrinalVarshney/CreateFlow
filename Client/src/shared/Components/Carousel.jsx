

import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import wordchoice from './Animations/wordchoice.png';
import canvas from './Animations/canvas.png';
import leaderboard from './Animations/leaderboard.png';
import { blue } from "@mui/material/colors";
import './Carousel.css'

const ImageCarousel = () => {
  const images = [
    wordchoice,
    canvas,
    leaderboard,
    
    // Add more image URLs as needed
  ];


  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,          // Enable automatic sliding
    autoplaySpeed: 3000,     // Set the speed of automatic sliding in milliseconds (e.g., 2000ms = 2 seconds)
  };

  return (
    <div className="max-w-screen-lg mx-auto mt-8" style={{ width: "85%" }}>
      <Slider {...settings}>
        {/* ... Your slide content remains the same */}
        <div className="relative">
          <img
            src={wordchoice}
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
            {/* <h2 className="text-2xl font-bold" style={{ padding: "2px" }}>
              First Slide
            </h2> */}
            <p className="text-lg" style={{ padding: "5px", }}>
              Choose your favorite word and create a story with it.
            </p>
          </div>
        </div>
        {/* ... Repeat for other slides */}
           <div className="relative">
          <img
            src={canvas}
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
            {/* <h2 className="text-2xl font-bold" style={{ padding: "2px" }}>
              second Slide
            </h2> */}
            <p className="text-lg" style={{ padding: "5px" }}>
              Draw the object with your favorite color.
            </p>
          </div>
        </div>
        <div className="relative">
          <img
            src={leaderboard}
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
            {/* <h2 className="text-2xl font-bold" style={{ padding: "2px" }}>
              third Slide
            </h2> */}
            <p className="text-lg" style={{ padding: "5px" }}>
              Here is Winner of the rounds.
            </p>
          </div>
        </div>        
      </Slider>
    </div>
  );
};

export default ImageCarousel;
