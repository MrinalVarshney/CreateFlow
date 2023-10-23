import { useContext, useState, createContext } from "react";

const HistoryContext = createContext();

export const useHistory = () => {
  return useContext(HistoryContext);
};

export const HistoryProvider = ({ children }) => {
  const [undoHistory, setUndoHistory] = useState([]);
  const [redoHistory, setRedoHistory] = useState([]);
  const [blankStage, setBlankStage] = useState(null); 
  const addToHistory = (data) => {
    if (undoHistory.length > 0 && data === undoHistory[undoHistory.length - 1])
      return;
    if(undoHistory.length===0) setBlankStage(data);
    setUndoHistory([...undoHistory, data]);
    setRedoHistory([]);
  };
  const undo = () => {   
    if (undoHistory.length > 0) {
      const last = undoHistory[undoHistory.length - 1];
      
      if(undoHistory.length===1){
        setUndoHistory([blankStage])
      }
      else {
        setUndoHistory(undoHistory.slice(0, -1));
        setRedoHistory([...redoHistory, last]);
      }
      return last;
    }
  };
  const redo = () => {
    if (redoHistory.length > 0) {
      const last = redoHistory[redoHistory.length - 1];
      setUndoHistory([...undoHistory, last]);
      setRedoHistory(redoHistory.slice(0, -1));
      return last; 
    }
  };
  const contextValue = {
    undoHistory,
    redoHistory,
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
