// Countdown.js

import React, { useState, useEffect } from 'react';
import { Typography, Modal, Backdrop, Fade } from '@mui/material';

const Countdown = ({ onStartGame }) => {
  const [count, setCount] = useState(3);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prevCount) => prevCount - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (count === 0) {
      onStartGame();
    }
  }, [count, onStartGame]);

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={count > 0}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={count > 0}>
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
          }}
        >
          <Typography variant="h4" gutterBottom>
            Game Starting
          </Typography>
          <Typography variant="h2">{count}</Typography>
        </div>
      </Fade>
    </Modal>
  );
};

export default Countdown;
