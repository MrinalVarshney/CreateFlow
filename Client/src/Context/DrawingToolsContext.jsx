import {useContext, useState,createContext} from 'react';

const DrawingToolsContext = createContext();

export const useDrawingTools = () => {
    return useContext(DrawingToolsContext);
}

export const DrawingToolsProvider = ({children}) => {
    const [selectedTool, setSelectedTool] = useState("Pencil");
    const [selectedColor, setSelectedColor] = useState("black");
    const [lineWidth, setLineWidth] = useState(1);
    const [eraserWidth,setEraserWidth] = useState(5);
    
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
