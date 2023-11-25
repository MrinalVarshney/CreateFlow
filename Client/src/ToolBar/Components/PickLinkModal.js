// PicLinkModal.js

import React from 'react';
import {
  Modal,
  Backdrop,
  Fade,
  Typography,
  Button,
} from '@mui/material'
import {makeStyles} from '@mui/styles'

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {

    border: '2px solid #000',

  },
}));

const PicLinkModal = ({ open, onClose, picUrl }) => {
  const classes = useStyles();

  return (
    <Modal
      open={open}
      onClose={onClose}
      className={classes.modal}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={open}>
        <div className={classes.paper}>
          <Typography variant="h6" gutterBottom>
            Pic URL:
          </Typography>
          <Typography variant="body1" gutterBottom>
            {picUrl}
          </Typography>
          <Button variant="contained" color="primary" onClick={onClose}>
            Close
          </Button>
        </div>
      </Fade>
    </Modal>
  );
};

export default PicLinkModal;
