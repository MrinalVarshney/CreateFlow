import React from 'react'
import ShowChartRoundedIcon from '@mui/icons-material/ShowChartRounded';
import "./Styles.css"
import { useDrawingTools } from '../Context/DrawingToolsContext';

const Line = () => {
  const {setSelectedTool} = useDrawingTools()
  const handleClick = () =>{
    setSelectedTool("Line")
  }
  return (
    <div className="shapes">
      <ShowChartRoundedIcon onClick={handleClick}/>
    </div>
  )
}

export default Line
