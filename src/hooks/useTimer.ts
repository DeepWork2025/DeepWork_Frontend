import { useState, useEffect, useCallback } from 'react';
import { WorkLogData } from '../types/workLog.type';
import * as workLogService from '../api/workLogService';

export const useTimer = () => {
  const [activeLog, setActiveLog] = useState<WorkLogData | null>(() => 
    workLogService.getActiveLog()
  );
  const [elapsed, setElapsed] = useState(0);
  
  // Update elapsed time every second for active timer
  useEffect(() => {
    if (!activeLog?.extendedProps.inProgress) return;
    
    const startTime = new Date(activeLog.start).getTime();
    
    const interval = setInterval(() => {
      setElapsed(Date.now() - startTime);
    }, 1000);
    
    return () => clearInterval(interval);
  }, [activeLog]);
  
  const startTimer = useCallback((log: WorkLogData) => {
    const updatedLog = workLogService.startWorkLog(log);
    setActiveLog(updatedLog);
    return updatedLog;
  }, []);
  
  const stopTimer = useCallback(() => {
    if (activeLog) {
      const stoppedLog = workLogService.stopWorkLog(activeLog);
      setActiveLog(null);
      setElapsed(0);
      return stoppedLog;
    }
    return null;
  }, [activeLog]);
  
  return { 
    activeLog, 
    elapsed, 
    startTimer, 
    stopTimer,
    isRunning: !!activeLog?.extendedProps.inProgress
  };
};