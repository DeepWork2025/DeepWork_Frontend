import { useState } from 'react';
import { Calendar } from '@fullcalendar/core';

interface ToolBarProps {
  leftCalendarRef: React.RefObject<Calendar>;
  rightCalendarRef: React.RefObject<Calendar>;
}

const ToolBar = ({ leftCalendarRef, rightCalendarRef }: ToolBarProps) => {
  const [currentView, setCurrentView] = useState("timeGridDay");

  // functions to control navigation: prev, today, next
  const handleNav = (action: "prev" | "next" | "today") => {
    if (leftCalendarRef.current && rightCalendarRef.current) {
      // Update both calendars
      leftCalendarRef.current[action]();
      rightCalendarRef.current[action]();
      
      // For the work log calendar, we need to update its date state
      const newDate = action === "today" 
        ? new Date() 
        : action === "prev"
          ? new Date(leftCalendarRef.current.getDate().getTime() - 24 * 60 * 60 * 1000)
          : new Date(leftCalendarRef.current.getDate().getTime() + 24 * 60 * 60 * 1000);
      
      // Dispatch a custom event that WorkLogCalendar will listen to
      window.dispatchEvent(new CustomEvent('workLogDateChange', { 
        detail: { date: newDate } 
      }));
    }
  }
  
  // functions to switch views: Day, Week, Month.
  const handleChangeView = (view: string) => {
    setCurrentView(view);
    if (leftCalendarRef.current && rightCalendarRef.current) {
      // Only allow timeGridDay view for WorkLogCalendar
      if (view === "timeGridDay") {
        leftCalendarRef.current.changeView(view);
        rightCalendarRef.current.changeView(view);
      } else {
        // For other views, only update the left calendar
        leftCalendarRef.current.changeView(view);
      }
    }
  }

  return (
    <div className="flex justify-between items-center p-2 bg-white w-full">
      {/* Navigation Buttons */}
      <div className="flex space-x-2">
        <button
          onClick={() => handleNav("prev")}
          className="bg-gray-300 px-4 py-2 rounded-md hover:bg-gray-400"
        >Prev</button>
        <button
          onClick={() => handleNav("today")}
          className="bg-gray-300 px-4 py-2 rounded-md hover:bg-gray-400"
        >Today</button>
        <button
          onClick={() => handleNav("next")}
          className="bg-gray-300 px-4 py-2 rounded-md hover:bg-gray-400"
        >Next</button>
      </div>
      {/* Switch view Buttons */}
      <div className="flex space-x-2">
        <button
          onClick={() => handleChangeView("timeGridDay")}
          className={`px-4 py-2 rounded-md ${
            currentView === "timeGridDay"
              ? "bg-blue-500 text-white"
              : "bg-gray-300 hover:bg-gray-400"
          }`}
        >Day</button>
        <button
          onClick={() => handleChangeView("timeGridWeek")}
          className={`px-2 py-2 rounded-md ${
            currentView === "timeGridWeek"
              ? "bg-blue-500 text-white"
              : "bg-gray-300 hover:bg-gray-400"
          }`}
        >Week</button>
        <button
          onClick={() => handleChangeView("timeGridMonth")}
          className={`px-2 py-2 rounded-md ${
            currentView === "timeGridMonth"
              ? "bg-blue-500 text-white"
              : "bg-gray-300 hover:bg-gray-400"
          }`}
        >Month</button>
      </div>
    </div>
  )
}

export default ToolBar