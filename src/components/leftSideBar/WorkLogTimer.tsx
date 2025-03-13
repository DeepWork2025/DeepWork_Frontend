import React from 'react'
import { useTimer } from '../../hooks/useTimer';
import { WorkLogData } from '../../types/workLog.type';

const WorkLogTimer: React.FC = () => {
  const { elapsed, startTimer, stopTimer, isRunning, totalWorkTime, resetTotalTime } = useTimer();

  // Handle Start/Stop Button Click
  const handleStartStopClick = () => {
    if (isRunning) {
      stopTimer(); // Stop active timer
    } else {
      // Create a new work log entry
      const newLog: WorkLogData = {
        id: Date.now().toString(),
        title: "Work Session",
        start: new Date().toISOString(),
        end: "", // Will be set when stopping
        extendedProps: {
          type: 'deep',
          inProgress: true
        },
      };
      startTimer(newLog); // Start timer with new log
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

  // Format total work time (HH:MM:SS)
  const formatTotalWorkTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  return (
    <div className="p-4">
      {/* Total Work Time Tracker */}
      <div className="bg-gray-100 p-3 rounded-md mb-4 text-center">
        <h2 className="text-lg font-semibold">Total Work Time</h2>
        <p className="text-xl font-bold">{formatTotalWorkTime(totalWorkTime)}</p>
        <button
          onClick={resetTotalTime}
          className="mt-2 px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
        >
          Reset Total Time
        </button>
      </div>

      {/* Active Timer Display */}
      {isRunning && (
        <div className="bg-blue-100 p-3 rounded-md text-center">
          <h2 className="text-lg font-semibold">Active Timer</h2>
          <p className="text-xl font-bold">{formatElapsedTime(elapsed)}</p>
        </div>
      )}

      {/* Timer Controls */}
      <div className="mt-4 text-center">
        <button
          onClick={handleStartStopClick}
          className={`p-2 rounded ${isRunning ? 'bg-red-500' : 'bg-blue-500'} text-white`}
        >
          {isRunning ? 'Stop Timer' : 'Start Timer'}
        </button>
      </div>
    </div>
  );
}

export default WorkLogTimer