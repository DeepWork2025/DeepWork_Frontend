import React, { useState, useEffect } from "react";
import { EventContentArg } from "@fullcalendar/core";
import { useTimer } from "../../hooks/useTimer";
import { WorkLogData } from "../../types/workLog.type";
import * as workLogService from "../../api/workLogService";

interface CustomEventBlockProps {
  event: EventContentArg["event"];
  timeText: string;
}

export const CustomEventBlock: React.FC<CustomEventBlockProps> = ({
  event,
  timeText,
}) => {
  const {
    activeLog,
    elapsed,
    startTimer,
    stopTimer,
    isRunning,
    pauseTimer,
    resumeTimer,
  } = useTimer();
  const [isStarted, setIsStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isStopped, setIsStopped] = useState(false);

  // Check if this event is the active log
  useEffect(() => {
    if (activeLog && activeLog.id === event.id) {
      setIsStarted(true);
      setIsPaused(activeLog.extendedProps.isPaused || false);
      setIsStopped(false);
    } else if (event.extendedProps.isStopped) {
      setIsStarted(false);
      setIsPaused(false);
      setIsStopped(true);
    }
  }, [
    activeLog,
    event.id,
    event.extendedProps.isStopped,
    event.extendedProps.isPaused,
  ]);

  const handleStart = (e: React.MouseEvent) => {
    e.stopPropagation();

    const workLog: WorkLogData = {
      id: event.id,
      title: event.title,
      start: new Date().toISOString(),
      end: "",
      extendedProps: {
        type: event.extendedProps.type || "deep",
        category: event.extendedProps.category,
        inProgress: true,
        isPaused: false,
        description: event.extendedProps.description,
      },
    };

    workLogService.saveWorkLog(workLog);
    startTimer(workLog);
  };

  const handlePause = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeLog && activeLog.id === event.id) {
      if (isPaused) {
        resumeTimer();
      } else {
        pauseTimer();
      }
      setIsPaused(!isPaused);
    }
  };

  const handleStop = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeLog && activeLog.id === event.id) {
      const startTime = new Date(activeLog.start).getTime();
      const endTime = new Date().getTime();
      const duration = endTime - startTime;

      stopTimer();

      const updatedLog = {
        ...activeLog,
        end: new Date().toISOString(),
        extendedProps: {
          ...activeLog.extendedProps,
          inProgress: false,
          isPaused: false,
        },
      };

      workLogService.saveWorkLog(updatedLog);
      workLogService.updateTotalWorkTime(duration);

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

  // Calculate duration for non-active events
  const calculateDuration = () => {
    if (!event.start || !event.end) return "0h 0m 0s";

    const start = new Date(event.start).getTime();
    const end = new Date(event.end).getTime();
    const duration = end - start;
    return formatElapsedTime(duration);
  };

  // Format times for display
  const formatTimeDisplay = () => {
    if (!event.start || !event.end) return timeText;

    const start = new Date(event.start);
    const end = new Date(event.end);

    const formatTime = (date: Date) => {
      return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    };

    return `${formatTime(start)} - ${formatTime(end)}`;
  };

  const isActive = isRunning && activeLog?.id === event.id;
  const label = event.extendedProps.label || null;

  return (
    <div
      className={`
        h-full w-full rounded-lg shadow-sm flex flex-col
        transition-all duration-300 ease-in-out
        ${
          isActive
            ? "bg-sky-500 shadow-lg scale-[1.02]"
            : isStopped
            ? "bg-sky-400"
            : "bg-sky-450"
        }
      `}
    >
      <div className="flex justify-between items-start p-2 flex-1">
        <div className="flex-1">
          <div className="text-sm font-medium text-white">
            {formatTimeDisplay()}
          </div>
          <div className="text-base font-semibold text-white flex items-center">
            {event.title}
            {label && (
              <span className="ml-2 text-xs px-1.5 py-0.5 bg-white/20 rounded-full">
                {label}
              </span>
            )}
          </div>
          <div className="text-xs text-white/80">
            {isActive
              ? `Duration: ${formatElapsedTime(elapsed)}`
              : `Duration: ${calculateDuration()}`}
          </div>
        </div>
        <div className="flex gap-1 ml-2">
          {!isStarted && !isStopped && (
            <button
              onClick={handleStart}
              className="p-1.5 rounded hover:bg-white/20 transition-colors"
              title="Start"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
            </button>
          )}
          {isStarted && !isStopped && (
            <>
              <button
                onClick={handlePause}
                className="p-1.5 rounded hover:bg-white/20 transition-colors"
                title={isPaused ? "Resume" : "Pause"}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {isPaused ? (
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                  ) : (
                    <>
                      <line x1="6" y1="4" x2="6" y2="20"></line>
                      <line x1="18" y1="4" x2="18" y2="20"></line>
                    </>
                  )}
                </svg>
              </button>
              <button
                onClick={handleStop}
                className="p-1.5 rounded hover:bg-white/20 transition-colors"
                title="Stop"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
