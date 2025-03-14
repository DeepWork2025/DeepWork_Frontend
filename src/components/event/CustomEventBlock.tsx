import React, { useState, useEffect } from 'react';
import { EventContentArg } from '@fullcalendar/core';
import { useTimer } from '../../hooks/useTimer';
import { WorkLogData } from '../../types/workLog.type';
import * as workLogService from '../../api/workLogService';

interface CustomEventBlockProps {
  event: EventContentArg['event'];
  timeText: string;
}

export const CustomEventBlock: React.FC<CustomEventBlockProps> = ({ event, timeText }) => {
  const { activeLog, elapsed, startTimer, stopTimer, isRunning } = useTimer();
  const [isStarted, setIsStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isStopped, setIsStopped] = useState(false);

  // Check if this event is the active log
  useEffect(() => {
    if (activeLog && activeLog.id === event.id) {
      setIsStarted(true);
      setIsPaused(false);
      setIsStopped(false);
    } else if (event.extendedProps.isStopped) {
      setIsStarted(false);
      setIsPaused(false);
      setIsStopped(true);
    }
  }, [activeLog, event.id, event.extendedProps.isStopped]);

  const handleStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Create a new work log with all required properties
    const workLog: WorkLogData = {
      id: event.id,
      title: event.title,
      start: new Date().toISOString(),
      end: '',
      extendedProps: {
        type: event.extendedProps.type || 'deep',
        category: event.extendedProps.category,
        inProgress: true,
        description: event.extendedProps.description
      }
    };

    // Save the work log first
    workLogService.saveWorkLog(workLog);
    
    // Then start the timer
    startTimer(workLog);
  };

  const handlePause = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Pause functionality can be implemented if needed
    setIsPaused(!isPaused);
  };

  const handleStop = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeLog && activeLog.id === event.id) {
      // Calculate duration before stopping
      const startTime = new Date(activeLog.start).getTime();
      const endTime = new Date().getTime();
      const duration = endTime - startTime;

      // Stop the timer first to clear the active state
      stopTimer();

      // Update the work log with end time
      const updatedLog = {
        ...activeLog,
        end: new Date().toISOString(),
        extendedProps: {
          ...activeLog.extendedProps,
          inProgress: false
        }
      };

      // Save the updated log
      workLogService.saveWorkLog(updatedLog);

      // Update total work time
      workLogService.updateTotalWorkTime(duration);

      // Update local state
      setIsStarted(false);
      setIsPaused(false);
      setIsStopped(true);
    }
  };

  // Format elapsed time (HH:MM:SS)
  const formatElapsedTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  const isActive = isRunning && activeLog?.id === event.id;

  return (
    <div 
      className={`
        h-full w-full rounded-lg shadow-sm flex flex-col
        transition-all duration-300 ease-in-out
        ${isActive 
          ? 'bg-sky-500 shadow-lg scale-[1.02]' 
          : isStopped 
            ? 'bg-sky-400' 
            : 'bg-sky-450'
        }
      `}
    >
      <div className="flex justify-between items-start p-2 flex-1">
        <div className="flex-1">
          <div className="text-sm font-medium text-white">{timeText}</div>
          <div className="text-sm font-semibold text-white">
            {event.title} {event.extendedProps.type && `[${event.extendedProps.type}]`}
          </div>
          <div className="text-xs text-white/80">
            {isActive ? (
              `Duration: ${formatElapsedTime(elapsed)}`
            ) : (
              `Duration: ${event.extendedProps.duration || '1:30 h'}`
            )}
          </div>
        </div>
        <div className="flex gap-1 ml-2">
          {!isStarted && !isStopped && (
            <button
              onClick={handleStart}
              className="p-1.5 rounded hover:bg-white/20 transition-colors"
              title="Start"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
            </button>
          )}
          {isStarted && !isStopped && (
            <>
              <button
                onClick={handlePause}
                className="p-1.5 rounded hover:bg-white/20 transition-colors"
                title="Pause"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="6" y1="4" x2="6" y2="20"></line>
                  <line x1="18" y1="4" x2="18" y2="20"></line>
                </svg>
              </button>
              <button
                onClick={handleStop}
                className="p-1.5 rounded hover:bg-white/20 transition-colors"
                title="Stop"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                </svg>
              </button>
            </>
          )}
          {isStopped && (
            <button
              className="p-1.5 rounded hover:bg-white/20 transition-colors"
              title="Mark Complete"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};