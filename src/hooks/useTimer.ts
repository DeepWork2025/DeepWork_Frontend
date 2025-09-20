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
  
  // 添加自动超时机制
  useEffect(() => {
    if (!activeLog?.extendedProps.inProgress || activeLog?.extendedProps.isPaused) return;
    
    const startTime = new Date(activeLog.start).getTime();
    const MAX_DURATION = 8 * 60 * 60 * 1000; // 8小时最大时长
    
    function updateElapsed() {
      const currentElapsed = Date.now() - startTime;
      setElapsed(currentElapsed);
      
      // 检查是否超过最大时长
      if (currentElapsed >= MAX_DURATION) {
        console.warn('Timer exceeded maximum duration, auto-stopping...');
        // 直接在这里处理自动停止，避免依赖问题
        const endTime = new Date().getTime();
        const duration = endTime - startTime;

        const updatedLog = {
          ...activeLog,
          end: new Date().toISOString(),
          extendedProps: {
            ...activeLog.extendedProps,
            inProgress: false,
            isPaused: false,
            autoStopped: true,
          },
        };

        workLogService.saveWorkLog(updatedLog);
        workLogService.updateTotalWorkTime(duration);
        
        setActiveLog(null);
        setElapsed(0);
        setPausedAt(null);
        
        // 显示通知
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('Timer Auto Stopped', {
            body: `"${activeLog.title}" System Auto Stopped after 8 hours`,
            icon: '/favicon.ico'
          });
        }
      }
    }
    
    const interval = setInterval(updateElapsed, 1000);
    
    return () => clearInterval(interval);
  }, [activeLog, pausedAt]);

  // 自动停止计时器
  const autoStopTimer = useCallback(() => {
    if (activeLog) {
      const startTime = new Date(activeLog.start).getTime();
      const endTime = new Date().getTime();
      const duration = endTime - startTime;

      const updatedLog = {
        ...activeLog,
        end: new Date().toISOString(),
        extendedProps: {
          ...activeLog.extendedProps,
          inProgress: false,
          isPaused: false,
          autoStopped: true, // 标记为自动停止
        },
      };

      workLogService.saveWorkLog(updatedLog);
      workLogService.updateTotalWorkTime(duration);
      
      setActiveLog(null);
      setElapsed(0);
      setPausedAt(null);
      
      // 显示通知
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Timer Auto Stopped', {
          body: `"${activeLog.title}" System Auto Stopped after 8 hours`,
          icon: '/favicon.ico'
        });
      }
    }
  }, [activeLog]);

  // 定期提醒机制
  useEffect(() => {
    if (!activeLog?.extendedProps.inProgress || activeLog?.extendedProps.isPaused) return;
    
    const startTime = new Date(activeLog.start).getTime();
    let reminderInterval: NodeJS.Timeout;
    
    // 每小时提醒一次
    const scheduleReminder = () => {
      const currentTime = Date.now();
      const runningDuration = currentTime - startTime;
      const hours = Math.floor(runningDuration / (60 * 60 * 1000));
      
      if (hours > 0 && hours % 1 === 0) { // 整点提醒
        const shouldContinue = window.confirm(
          `"${activeLog.title}" Haven been working for ${hours} hours, are you sure to continue?\n\nClick "OK" to continue, click "Cancel" to stop.`
        );
        
        if (!shouldContinue) {
          autoStopTimer();
          return;
        }
      }
      
      // 安排下次提醒
      reminderInterval = setTimeout(scheduleReminder, 60 * 60 * 1000); // 1小时后再次检查
    };
    
    // 延迟1小时后开始提醒
    const initialReminder = setTimeout(scheduleReminder, 60 * 60 * 1000);
    
    return () => {
      clearTimeout(initialReminder);
      clearTimeout(reminderInterval);
    };
  }, [activeLog]);

  // 页面卸载保护
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (activeLog?.extendedProps.inProgress && !activeLog?.extendedProps.isPaused) {
        const message = `You have active worklog "${activeLog.title}", are you sure to leave?`;
        e.preventDefault();
        e.returnValue = message;
        return message;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [activeLog]);

  // 页面可见性检测
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && activeLog?.extendedProps.inProgress && !activeLog?.extendedProps.isPaused) {
        // 用户回到页面，检查计时器状态
        const startTime = new Date(activeLog.start).getTime();
        const currentTime = Date.now();
        const runningDuration = currentTime - startTime;
        
        // 如果运行时间超过2小时，显示提醒
        if (runningDuration > 2 * 60 * 60 * 1000) {
          const shouldContinue = window.confirm(
            `"${activeLog.title}" Has working for ${Math.floor(runningDuration / (60 * 60 * 1000))} hours, are you sure to continure?\n\nClick "OK" to continue, click "Cancel" to stop.`
          );
          
          if (!shouldContinue) {
            autoStopTimer();
          }
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [activeLog]);

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
    autoStopTimer, // 导出自动停止功能
    isRunning: !!activeLog?.extendedProps.inProgress && !activeLog?.extendedProps.isPaused,
    totalWorkTime,
    resetTotalTime
  };
};