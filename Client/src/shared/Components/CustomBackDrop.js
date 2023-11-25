import React from 'react';
import { Backdrop, CircularProgress } from '@mui/material';

const CustomBackdrop = ({showProgress }) => {  
    return (
        <Backdrop open={showProgress} sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <CircularProgress sx={{color:"orange"}} />
      </Backdrop>
    )
}

export default CustomBackdrop;