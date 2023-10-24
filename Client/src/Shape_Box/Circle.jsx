import React from 'react'
import Brightness1OutlinedIcon from '@mui/icons-material/Brightness1Outlined';
import "./Styles.css"


const Circle = () => {
  const handleClick = () =>{
    console.log("Circle")
  }
  return (
    <div className='shapes'>
      <Brightness1OutlinedIcon onClick={handleClick}/>
    </div>
  )
}

export default Circle
