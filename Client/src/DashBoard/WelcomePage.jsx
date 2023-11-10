
// WelcomePage.js
/*import React from 'react';
import './WelcomePage.css';

const WelcomePage = () => {
  return (
    <div className="welcome-page">
      <h2>Welcome, Doodlers!</h2>
      <p>Get ready to unleash your creativity. Here's a quick guide to get started:</p>
      <ul>
        <li>Choose your favorite colors from the palette.</li>
        <li>Select your brush size.</li>
        <li>Start doodling on the canvas.</li>
        <li>Use the eraser tool to correct any mistakes.</li>
        <li>Have fun and create amazing artwork!</li>
      </ul>
    </div>
  );
}

export default WelcomePage;
*/

// WelcomePage.js
// import React, { useEffect } from 'react';
import lottie from 'lottie-web';
import animationData from "../Animations/A2.json" ; // Replace with the path to your Lottie animation JSON file

// Other code for your component


import React, { useEffect } from 'react';
import './WelcomePage.css';

const WelcomePage = () => {
  // useEffect(() => {
  //   // Trigger the animation by adding the 'slide-in' class when the component is mounted
  // const welcomePage = document.querySelector('.welcome-page');
  // welcomePage.classList.add('slide-in');

  // }, []);


  useEffect(() => {
  
    // Other animations and transitions here
    const welcomePage = document.querySelector('.welcome-page');
    welcomePage.classList.add('slide-in');
  
    }, []); // Empty dependency array to run this effect only once when the component mounts
  


  return (
    <div className="welcome-page">
  
      <h2>Welcome, Doodlers!</h2>
      <p>Get ready to unleash your creativity. Here's a quick guide to get started:</p>
      <ul>
        <li>Choose your favorite colors from the palette.</li>
        <li>Select your brush size.</li>
        <li>Start doodling on the canvas.</li>
        <li>Use the eraser tool to correct any mistakes.</li>
        <li>Have fun and create amazing artwork!</li>
      </ul>


    </div>
  );
}

export default WelcomePage;
