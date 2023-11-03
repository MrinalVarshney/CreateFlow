import React, { useEffect } from 'react'
import CreateCanvas from './CreateBox/CreateCanvas'
import "../Assets/Styles/styles.css"
import {connectWithSocketServer} from '../RealTimeCommunication/socketConnection'

const SelectionBoard = () => {
  useEffect(() => {
    connectWithSocketServer()
  },[])
  
  return (
    <div className="backGround" style={{height:"100vh"}}>
      <CreateCanvas />
    </div>
  )
}

export default SelectionBoard
