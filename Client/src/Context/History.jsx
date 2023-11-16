import { useContext, useState, createContext,useRef } from "react";

const HistoryContext = createContext();

export const useHistory = () => {
  return useContext(HistoryContext);
};

export const HistoryProvider = ({ children }) => {
  const undoHistoryRef = useRef([]);
  const redoHistoryRef = useRef([]);
  const [blankStage, setBlankStage] = useState(null); 
  const addToHistory = (data) => {
    if (undoHistoryRef.current.length > 0 && data === undoHistoryRef.current[undoHistoryRef.current.length - 1]){
      console.log("Duplicate")
      return;
    }
    if(undoHistoryRef.current.length===0) setBlankStage(data);
    undoHistoryRef.current = [...undoHistoryRef.current, data];
    redoHistoryRef.current = [];
  };
  const undo = () => { 
    if(undoHistoryRef.current.length > 0){
      const last = undoHistoryRef.current[undoHistoryRef.current.length - 1];
      if(undoHistoryRef.current.length===1){
        undoHistoryRef.current = [blankStage];
      }
      else {
        undoHistoryRef.current = undoHistoryRef.current.slice(0, -1);
        redoHistoryRef.current = [...redoHistoryRef.current, last];
      }
      return last;
    }
  };
  const redo = () => {
    if(redoHistoryRef.current.length > 0){
      const last = redoHistoryRef.current[redoHistoryRef.current.length - 1];
      undoHistoryRef.current = [...undoHistoryRef.current, last];
      redoHistoryRef.current = redoHistoryRef.current.slice(0, -1);
      return last;
    }
  };
  const contextValue = {
    addToHistory,
    undo,
    redo,
  };
  return (
    <HistoryContext.Provider value={contextValue}>
      {children}
    </HistoryContext.Provider>
  );
};
