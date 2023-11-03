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
          }}
        >
        {props.children}
        </Box>
    );
  };
  
  export default AuthBox;
  
