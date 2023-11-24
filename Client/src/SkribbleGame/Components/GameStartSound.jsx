
import React, { useEffect } from 'react';

const SoundComponent = () => {
  useEffect(() => {
    const playSound = async () => {
      try {
        const audioElement = new Audio('/Gamestart.mp3');
        await audioElement.play();
        // You might want to handle the end of the audio or any cleanup
        audioElement.addEventListener('ended', () => {
          // Handle end of playback or cleanup
        });
      } catch (error) {
        console.error('Failed to play sound:', error.message);
      }
    };

    // Call the playSound function when the component mounts
    playSound();
  }, []); // The empty dependency array ensures this effect runs only once on mount

  return <div></div>; // Render your component content here
};

export default SoundComponent;