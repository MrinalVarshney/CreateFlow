import React from 'react'
import Brightness1OutlinedIcon from '@mui/icons-material/Brightness1Outlined';
import "./Styles.css"
import { useDrawingTools } from '../Context/DrawingToolsContext';

const Circle = () => {
  const {setSelectedTool} = useDrawingTools()
  const handleClick = () =>{
    setSelectedTool("Circle")
  }
  return (
    <div className='shapes'>
      <Brightness1OutlinedIcon onClick={handleClick}/>
    </div>
  )
}

export default Circle
