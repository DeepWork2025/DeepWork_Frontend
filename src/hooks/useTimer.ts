import { useState, useEffect, useCallback } from 'react';
import { WorkLogData } from '../types/workLog.type';
import * as workLogService from '../api/workLogService';

export const useTimer = () => {
  const [activeLog, setActiveLog] = useState<WorkLogData | null>(() => 
    workLogService.getActiveLog()
  );
  const [elapsed, setElapsed] = useState(0);
  const [totalWorkTime, setTotalWorkTime] = useState(() => workLogService.getTotalWorkTime());
  const [pausedAt, setPausedAt] = useState<number | null>(null);
  
  // Update elapsed time every second for active timer
  useEffect(() => {
    if (!activeLog?.extendedProps.inProgress || activeLog?.extendedProps.isPaused) return;
    
    const startTime = new Date(activeLog.start).getTime();
    function updateElapsed() {
      setElapsed(Date.now() - startTime);
    }
    const interval = setInterval(updateElapsed, 1000);
    
    return () => clearInterval(interval);
  }, [activeLog, pausedAt]);

  // Update total work time when it changes
  useEffect(() => {
    const handleTotalTimeUpdate = (event: CustomEvent) => {
      setTotalWorkTime(event.detail.totalTime);
    };

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
    setPausedAt(null);
    return updatedLog;
  }, []);
  
  const stopTimer = useCallback(() => {
    if (activeLog) {
      const stoppedLog = workLogService.stopWorkLog(activeLog);
      setActiveLog(null);
      setElapsed(0);
      setPausedAt(null);
      return stoppedLog;
    }
    return null;
  }, [activeLog]);

  const pauseTimer = useCallback(() => {
    if (activeLog) {
      setPausedAt(Date.now());
      const updatedLog = {
        ...activeLog,
        extendedProps: {
          ...activeLog.extendedProps,
          isPaused: true
        }
      };
      workLogService.saveWorkLog(updatedLog);
      setActiveLog(updatedLog);
    }
  }, [activeLog]);

  const resumeTimer = useCallback(() => {
    if (activeLog) {
      setPausedAt(null);
      const updatedLog = {
        ...activeLog,
        extendedProps: {
          ...activeLog.extendedProps,
          isPaused: false
        }
      };
      workLogService.saveWorkLog(updatedLog);
      setActiveLog(updatedLog);
    }
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
    pauseTimer,
    resumeTimer,
    isRunning: !!activeLog?.extendedProps.inProgress && !activeLog?.extendedProps.isPaused,
    totalWorkTime,
    resetTotalTime
  };
};