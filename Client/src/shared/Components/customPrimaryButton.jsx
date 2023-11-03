import React from 'react';
import {Button} from "@mui/material";
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
    button: {
        background: 'linear-gradient(45deg, #2196F3 30%, #1976D2 90%)',
        borderRadius: 3,
        border: 0,
        color: 'white',
        height: 48,
        padding: '0 30px',
        boxShadow: '0 3px 5px 2px rgba(33, 150, 243, 0.3)',
        fontWeight: 'bold',
        fontSize: '1.2rem',
        transition: 'background 0.3s ease-in-out',
        '&:hover': {
          background: 'linear-gradient(45deg, #1976D2 30%, #1565C0 90%)',
        },
    }
});

const CustomPrimaryButton = ({ onClick, label,disabled}) => {
  const classes = useStyles();

  return (
    <Button
      className={classes.button}
      onClick={onClick}
      disabled={disabled}
    >
      <span  style={{color:"white"}}>{label}</span>
    </Button>
  );
};

export default CustomPrimaryButton;
