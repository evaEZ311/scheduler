import { useState } from "react";

export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  function transition (mode, replace = false){ 
    if (replace === true) {
      const currentMode = history.pop();
      const updateHistory = history.filter((h) => h !== currentMode);
    }
    setMode(mode);
    setHistory(prev => [...prev, mode]);
  };

  function back(){
      if (history.length === 1){
        return;
      }
      const currentMode = history.pop();
      const updateHistory = history.filter((h) => h !== currentMode);
      setHistory(updateHistory);

      const prevMode = history[history.length-1];
      setMode(prevMode);
    
  };

  return { mode, transition, back };
}

