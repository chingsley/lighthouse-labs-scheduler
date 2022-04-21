import { useState } from 'react';

export default function useVisualMode(initial) {
  const [history, setHistory] = useState([initial]);

  function transition(newMode, replaceLastMode = false) {
    if (replaceLastMode) {
      // setHistory((prev) => [...prev.slice(0, prev.length - 1), newMode]);
      setHistory((prev) => [...prev.slice(0, - 1), newMode]);
    } else {
      // setHistory([...history, newMode]);
      setHistory(prev => [...prev, newMode]);
    }
  }
  function back() {
    // if there's only one item in history, then we have no mode to go back to
    // therefore, history must have a minimum of 1 item at every point time
    // ... since mode = last item in history, if history is empty then mode would be undefined...
    // ... and we don't want that
    if (history.length < 2) return;

    // remove last history item
    // setHistory((prev) => [...prev.slice(0, prev.length - 1)]);
    setHistory((prev) => [...prev.slice(0, - 1)]);
  }

  return {
    mode: history[history.length - 1],
    transition,
    back,
  };
}



