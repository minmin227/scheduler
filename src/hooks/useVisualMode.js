import { react, useState } from "react";


export default function useVisualMode(initial) {

  const [mode, setMode] = useState(initial)
  const [history, setHistory] = useState([initial]);

  function transition (newmode, replace = false) {
    setMode(newmode);
    if (!replace) {
      setHistory(prev => [mode, ...prev])
    }
  }

  function back () {
    if (history.length === 1) {
      return
    }
    setHistory(([_, ...hist]) => hist);
    setMode(history[0]);
  }
  return { mode, transition, back }
}
