import React from 'react'
import ShowChartRoundedIcon from '@mui/icons-material/ShowChartRounded';
import "./Styles.css"


const Line = () => {
  const handleClick = () =>{
    console.log("Line")
  }
  return (
    <div className="shapes">
      <ShowChartRoundedIcon onClick={handleClick}/>
    </div>
  )
}

export default Line
