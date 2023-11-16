//Context for handling drawing tools

import {useContext, useState,createContext} from 'react';


const DrawingToolsContext = createContext();

export const useDrawingTools = () => {
    return useContext(DrawingToolsContext);
}

export const DrawingToolsProvider = ({children}) => {
    const [selectedTool, setSelectedTool] = useState("Pencil");  //Default tool is pencil
    const [selectedColor, setSelectedColor] = useState("black");    //Default color is black
    const [lineWidth, setLineWidth] = useState(1);      //Default line width is 1
    const [eraserWidth,setEraserWidth] = useState(5);   //Default eraser width is 5


    const contextValue = {
        selectedTool,
        setSelectedTool,
        selectedColor,
        setSelectedColor,
        lineWidth,
        setLineWidth,
        eraserWidth,
        setEraserWidth
    }

    return (
        <DrawingToolsContext.Provider value={contextValue}>
            {children}
        </DrawingToolsContext.Provider>
    )
}
