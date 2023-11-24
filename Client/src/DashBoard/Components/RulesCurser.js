


import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import img1 from './Image/1.png';
import img2 from './Image/2.png';
import img3 from './Image/3.png';
import img4 from './Image/4.png';
import img5 from './Image/5.png';
import './RulesCurser.css';

const RulesCurser = () => {
  const images = [
    img4,
    img1,
    img3,    
    img5,
    img2,
    
    // Add more image URLs as needed
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 300,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000, // Adjust the speed of automatic sliding
  };

  return (
    <div className="slider-container">
      <Slider {...settings}>
        {images.map((image, index) => (
          <div  key={index}>
            <img src={image} style={{borderRadius:"20px"}} alt={`Slide ${index + 1}`} />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default RulesCurser;
