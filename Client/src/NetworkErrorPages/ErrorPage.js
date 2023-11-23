
import React, { useState, useEffect } from 'react';
import './ErrorPage.css';
import RexGame from './RexGame';

const NetworkErrorPage = () => {
  const [isOnline, setIsOnline] = useState(window.navigator.onLine);

  useEffect(() => {
    const handleOnlineStatus = () => {
      setIsOnline(window.navigator.onLine);
    };

    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);

    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
    };
  }, []);

  return (
    <div className="errorPage">
      {!isOnline && (
        <div style={{ display: "grid",  justifyContent:'center', alignItems:'center' }}>
          <div className="network-error">
            <h1>Oops! Network Error</h1>
            <p >Please check your internet connection and try again.</p>
          </div>
          <div className='game-rules'>
           <h2>Let's have some fun !</h2>
           <p>Press 'Space' or 'J' to Jump. </p>
           <p>Press 'LeftShift' or 'D' to Duck.</p>
          
          </div>
          <div className="game-box">
            <RexGame/>
          </div>
          
          
        </div>
      )}
    </div>
  );
};

export default NetworkErrorPage;















