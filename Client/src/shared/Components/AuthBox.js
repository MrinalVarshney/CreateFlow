import React from 'react'
import {Box} from "@mui/material"

const AuthBox = (props) => {
    return (
      <Box
      sx={{
        width: 500,
        height: 'auto',
        borderRadius: '5px',
        boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        padding: '25px',
        gap: '20px',
        background: 'linear-gradient(45deg, #ffffff 0%, #ffffff  50%, rgba(255, 215, 0, 0.8) 50%,rgba(255, 215, 0, 0.8) 100%)',
      }}
    >
        {props.children}
        </Box>
    );
  };
  
  export default AuthBox;
  
