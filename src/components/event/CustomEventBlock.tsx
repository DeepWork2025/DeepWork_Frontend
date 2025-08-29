import React, { useState, useEffect } from "react";
import { EventContentArg } from "@fullcalendar/core";
import { useTimer } from "../../hooks/useTimer";
import { WorkLogData } from "../../types/workLog.type";
import * as workLogService from "../../api/workLogService";

interface CustomEventBlockProps {
  event: EventContentArg["event"];
  timeText: string;
  readOnly?: boolean
}

export const CustomEventBlock: React.FC<CustomEventBlockProps> = ({
  event,
  timeText,
  readOnly
}) => {
  const {
    activeLog,
    // elapsed,
    startTimer,
    stopTimer,
    isRunning,
    pauseTimer,
    resumeTimer,
  } = useTimer();
  const [isStarted, setIsStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isStopped, setIsStopped] = useState(false);

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

  const formatElapsedTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  const calculateDuration = () => {
    if (!event.start || !event.end) return "0h 0m 0s";
    const start = new Date(event.start).getTime();
    const end = new Date(event.end).getTime();
    return formatElapsedTime(end - start);
  };

  const formatTimeDisplay = () => {
    if (!event.start || !event.end) return timeText;
    const start = new Date(event.start);
    const end = new Date(event.end);
    const format = (d: Date) =>
      d.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    return `${format(start)} - ${format(end)}`;
  };

  const isShortestEvent = () => {
    if (!event.start || !event.end) return false;
    return new Date(event.end).getTime() - new Date(event.start).getTime() <= 15 * 60 * 1000;
  };

  const isShortEvent = () => {
    if (!event.start || !event.end) return false;
    return new Date(event.end).getTime() - new Date(event.start).getTime() <= 30 * 60 * 1000;
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
      <div className="flex justify-between items-center p-2 flex-1">
        {isShortestEvent() ? (
          // 👉 单行展示（小于15分钟）
          <div className="flex-1 min-w-0 px-1.5">
            <div className="text-sm font-semibold text-white truncate">
              {event.title} {event.extendedProps.type && `[${event.extendedProps.type}]`}
            </div>
          </div>
        ) : isShortEvent() ? (
          // 👉 两行展示（小于30分钟）
          <div className="flex-1 min-w-0 px-1.5">
            <div className="text-sm font-semibold text-white truncate">
              {event.title} {event.extendedProps.type && `[${event.extendedProps.type}]`}
            </div>
            <div className="text-xs text-white/80 truncate">
              {`Duration: ${calculateDuration()}`}
            </div>
          </div>
        ) : (
          // 👉 完整展示（超过30分钟）
          <div className="flex-1 min-w-0 px-1.5">
            <div className="text-sm font-medium text-white truncate">
              {formatTimeDisplay()}
            </div>
            <div className="text-sm font-semibold text-white truncate">
              {event.title} {event.extendedProps.type && `[${event.extendedProps.type}]`}
            </div>
            <div className="text-xs text-white/80 truncate">
              { `Duration: ${calculateDuration()}`}
            </div>
            {label && (
              <span className="text-xs inline-block px-2 py-0.5 mt-1 bg-white/20 rounded-full text-white">
                {label}
              </span>
            )}
          </div>
        )}

        {/* 操作按钮区域 */}
        <div className="flex gap-1 ml-2 shrink-0">
          {!readOnly && !isStarted && !isStopped && (
            <button onClick={handleStart} className="p-1.5 rounded hover:bg-white/20" title="Start">
              ▶️
            </button>
          )}
          {!readOnly && isStarted && !isStopped && (
            <>
              <button onClick={handlePause} className="p-1.5 rounded hover:bg-white/20" title={isPaused ? "Resume" : "Pause"}>
                {isPaused ? "▶️" : "⏸"}
              </button>
              <button onClick={handleStop} className="p-1.5 rounded hover:bg-white/20" title="Stop">
                ⏹
              </button>
            </>
          )}
          {!readOnly && isStopped && (
            <button className="p-1.5 rounded hover:bg-white/20" title={
              event.extendedProps.autoStopped ? "Auto Stopped" : "Finished"
            }>
              {event.extendedProps.autoStopped ? "⏰" : "✅"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
