import React, { useState, useEffect, useRef } from 'react';
import { EventImpl } from '@fullcalendar/core/internal';

interface WorkLogTimerProps {
  onLogCreated: (workLog: any) => void;
  onLogUpdated: (workLog: any) => void;
}

const WorkLogTimer: React.FC<WorkLogTimerProps> = ({ onLogCreated, onLogUpdated }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [currentLog, setCurrentLog] = useState<any>(null);
  const [title, setTitle] = useState('');
  const [type, setType] = useState<'deep' | 'shallow'>('deep');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    // Load saved categories from localStorage
    const savedCategories = localStorage.getItem('workLogCategories');
    if (savedCategories) {
      setCategories(JSON.parse(savedCategories));
    }
    
    // Check if there's an active timer in localStorage
    const activeTimer = localStorage.getItem('activeWorkLog');
    if (activeTimer) {
      const parsedTimer = JSON.parse(activeTimer);
      setCurrentLog(parsedTimer);
      setTitle(parsedTimer.title);
      setType(parsedTimer.extendedProps.type);
      setCategory(parsedTimer.extendedProps.category || '');
      
      // Calculate elapsed seconds
      const startTime = new Date(parsedTimer.start);
      const elapsedMs = Date.now() - startTime.getTime();
      setSeconds(Math.floor(elapsedMs / 1000));
      
      // Resume timer
      setIsRunning(true);
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);
  
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setSeconds(prevSeconds => prevSeconds + 1);
        
        // Update the end time of the current log every 10 seconds
        if (currentLog && prevSeconds % 10 === 0) {
          updateCurrentLog();
        }
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRunning, currentLog]);
  
  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    return [
      hours.toString().padStart(2, '0'),
      minutes.toString().padStart(2, '0'),
      seconds.toString().padStart(2, '0')
    ].join(':');
  };
  
  const startTimer = () => {
    if (!title.trim()) {
      alert('Please enter what you are working on');
      return;
    }
    
    // Save category if it's new
    if (category && !categories.includes(category)) {
      const updatedCategories = [...categories, category];
      setCategories(updatedCategories);
      localStorage.setItem('workLogCategories', JSON.stringify(updatedCategories));
    }
    
    const now = new Date();
    const newLog = {
      id: Date.now().toString(),
      title: title,
      start: now,
      end: new Date(now.getTime() + 1000), // Initial end time just 1 second ahead
      allDay: false,
      extendedProps: {
        type: type,
        category: category,
        inProgress: true
      }
    };
    
    setCurrentLog(newLog);
    setIsRunning(true);
    setSeconds(0);
    
    // Store in localStorage
    localStorage.setItem('activeWorkLog', JSON.stringify(newLog));
    
    // Notify parent component
    onLogCreated(newLog);
  };
  
  const updateCurrentLog = () => {
    if (currentLog) {
      const updatedLog = {
        ...currentLog,
        end: new Date(),
        extendedProps: {
          ...currentLog.extendedProps,
          inProgress: true
        }
      };
      
      setCurrentLog(updatedLog);
      
      // Update in localStorage
      localStorage.setItem('activeWorkLog', JSON.stringify(updatedLog));
      
      // Notify parent component
      onLogUpdated(updatedLog);
    }
  };
  
  const stopTimer = () => {
    if (currentLog) {
      const finalLog = {
        ...currentLog,
        end: new Date(),
        extendedProps: {
          ...currentLog.extendedProps,
          inProgress: false
        }
      };
      
      // Remove from localStorage
      localStorage.removeItem('activeWorkLog');
      
      // Notify parent component
      onLogUpdated(finalLog);
      
      // Reset state
      setIsRunning(false);
      setCurrentLog(null);
      setTitle('');
      setType('deep');
      setCategory('');
      setSeconds(0);
    }
  };
  
  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-3">Work Timer</h2>
      
      <div className="mb-4">
        <div className="text-4xl font-mono text-center mb-4">
          {formatTime(seconds)}
        </div>
        
        {!isRunning ? (
          <div className="space-y-3">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                What are you working on?
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="e.g., Project research, Writing code"
                required
              />
            </div>
            
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                Work Type
              </label>
              <select
                id="type"
                value={type}
                onChange={(e) => setType(e.target.value as 'deep' | 'shallow')}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
              >
                <option value="deep">Deep Work</option>
                <option value="shallow">Shallow Work</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                Category/Project
              </label>
              <input
                type="text"
                id="category"
                list="category-options"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="e.g., Project X, Learning, Admin"
              />
              <datalist id="category-options">
                {categories.map((cat, index) => (
                  <option key={index} value={cat} />
                ))}
              </datalist>
            </div>
            
            <button
              onClick={startTimer}
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Start Timer
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-gray-100 p-3 rounded-md">
              <div className="font-semibold">{title}</div>
              <div className="text-sm text-gray-600 flex justify-between">
                <span>{type === 'deep' ? 'Deep Work' : 'Shallow Work'}</span>
                {category && <span>{category}</span>}
              </div>
            </div>
            
            <button
              onClick={stopTimer}
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Stop Timer
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkLogTimer;