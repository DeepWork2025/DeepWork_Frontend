import { useState, useEffect, useCallback } from 'react';
import { WorkLogData } from '../types/workLog.type';
import * as workLogService from '../api/workLogService';

export const useTimer = () => {
  const [activeLog, setActiveLog] = useState<WorkLogData | null>(() => 
    workLogService.getActiveLog()
  );
  const [elapsed, setElapsed] = useState(0);
  const [totalWorkTime, setTotalWorkTime] = useState(() => workLogService.getTotalWorkTime());
  
  // Update elapsed time every second for active timer
  useEffect(() => {
    if (!activeLog?.extendedProps.inProgress) return;
    
    const startTime = new Date(activeLog.start).getTime();
    
    const interval = setInterval(() => {
      setElapsed(Date.now() - startTime);
    }, 1000);
    
    return () => clearInterval(interval);
  }, [activeLog]);

  // Update total work time when it changes
  useEffect(() => {
    const handleTotalTimeUpdate = (event: CustomEvent) => {
      setTotalWorkTime(event.detail.totalTime);
    };

    // Listen for both storage and custom events
    window.addEventListener('storage', () => {
      setTotalWorkTime(workLogService.getTotalWorkTime());
    });
    
    window.addEventListener('totalWorkTimeUpdate', handleTotalTimeUpdate as EventListener);
    
    return () => {
      window.removeEventListener('storage', () => {
        setTotalWorkTime(workLogService.getTotalWorkTime());
      });
      window.removeEventListener('totalWorkTimeUpdate', handleTotalTimeUpdate as EventListener);
    };
  }, []);
  
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

  const resetTotalTime = useCallback(() => {
    workLogService.resetTotalWorkTime();
    setTotalWorkTime(0);
  }, []);
  
  return { 
    activeLog, 
    elapsed, 
    startTimer, 
    stopTimer,
    isRunning: !!activeLog?.extendedProps.inProgress,
    totalWorkTime,
    resetTotalTime
  };
};