import { useState } from "react";

export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);
  function transition(value, replace = false) {
    setMode(value);
    setHistory((prev) => {
      if (replace) {
        const result = prev;
        result.pop();
        return [...result, value];
      }
      return [...prev, value];
    });
  }
  function back() {
    setMode((prev) => {
      if (history.length > 1) {
        return history[history.length - 2];
      }
      return prev;
    });
    setHistory((prev) => {
      if (history.length > 1) {
        const result = prev;
        result.pop();
        return result;
      }
      return prev;
    });
  }
  return { mode, history, transition, back };
}
