import { useState, useCallback } from 'react';
import { processCommand, getQuickResponse } from '../services/terminalEngine';

/**
 * Manages terminal output via React state instead of
 * direct DOM manipulation (document.getElementById).
 */
export function useTerminal(initialMessage = 'Systems Ready. Awaiting architectural commands...') {
  const [output, setOutput] = useState(initialMessage);

  const executeCommand = useCallback((rawInput: string) => {
    const result = processCommand(rawInput);
    setOutput(result);
  }, []);

  const executeQuickCommand = useCallback((cmd: string) => {
    setOutput(getQuickResponse(cmd));
  }, []);

  return { output, executeCommand, executeQuickCommand, setOutput };
}