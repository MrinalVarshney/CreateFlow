
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
          <ul>
            <li>Press 'Space' or 'J' to Jump. </li>
            <li>Press 'LeftShift' or 'D' to Duck.</li>
          </ul>
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
















// import React from 'react';

// const NetworkErrorPage = () => {
//   return (
//     <div className="network-error-container">
//       <div className="error-content">
//         <h1>Network Error</h1>
//         <p>Oops! It seems there is an issue with your network connection.</p>
//         <p>Please check your internet connection and try again.</p>
//       </div>

//       <style jsx>{`
//         body {
//           margin: 0;
//           padding: 0;
//           overflow: hidden;
//         }

//         .network-error-container {
//           display: flex;
//           justify-content: center;
//           align-items: center;
//           height: 100vh;
//         }

//         .error-content {
//           text-align: center;
//           max-width: 400px;
//         }

//         h1 {
//           color: #ff0000; /* Red color for the heading */
//         }

//         p {
//           margin-bottom: 10px;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default NetworkErrorPage;


