import { useEffect, useRef } from "react";
import EventForm from "../event/EventForm";
import { useCalendarEvents } from '../../hooks/useCalendarEvents';
import FullCalendarWrapper from "./FullCalendarWrapper";

import WorkLogCalendar from "../workLog/WorkLogCalendar";

console.log('TESTING CONSOLE LOG');

const CalendarContainer = () => {
  const {
    selectedEvent,
    isFormOpen,
    setIsFormOpen,
    saveEvent,
    deleteEvent,
  } = useCalendarEvents();

  // Function to open the form for a new event
  const handleAddEvent = () => {
    setIsFormOpen(true);
  };

  const leftCalendarRef = useRef<HTMLDivElement>(null);
  const rightCalendarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function syncHeight() {
      if (leftCalendarRef.current && rightCalendarRef.current) {
        const maxHeight = Math.max(
          leftCalendarRef.current.clientHeight,
          rightCalendarRef.current.clientHeight
        );
        leftCalendarRef.current.style.height = `${maxHeight}px`;
        rightCalendarRef.current.style.height = `${maxHeight}px`;
      }
    }

    // Set initial scroll position to 6:00 AM
    const setInitialScroll = () => {
      if (leftCalendarRef.current && rightCalendarRef.current) {
        // Each hour is 100px in height, so 6 hours = 600px
        const scrollTo6AM = 600;
        leftCalendarRef.current.scrollTop = scrollTo6AM;
        rightCalendarRef.current.scrollTop = scrollTo6AM;
      }
    };

    syncHeight();
    setInitialScroll();
    window.addEventListener("resize", syncHeight);
    return () => window.removeEventListener("resize", syncHeight);
  }, []);

    // Synchronize scrolling between the left and right calendars
    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
      if (rightCalendarRef.current && leftCalendarRef.current) {
       if(e.target === leftCalendarRef.current){
        rightCalendarRef.current.scrollTop = leftCalendarRef.current.scrollTop;
       } else if (e.target === rightCalendarRef.current){
        leftCalendarRef.current.scrollTop = rightCalendarRef.current.scrollTop;
       }
      }
    };


  // Format today's date for display
  const formatTodayDate = () => {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'short',
      weekday: 'long'
    };
    return today.toLocaleDateString('en-US', options);
  };

  return (
    <div className="flex flex-col w-full h-screen overflow-hidden">
      <div className="flex justify-between items-center  bg-white shadow w-full">
        {/* Header section with full row.*/}
        <header className="p-4 bg-white">
          <h1 className="text-2xl"><b>Today</b><span> {formatTodayDate()}</span></h1>
        </header>
        <button
          onClick={handleAddEvent}
          className="bg-blue-500 text-white px-4 py-2 rounded-md shadow hover:bg-blue-600"
        >
          + Add Event
        </button>
      </div>

      {/* Tool Bar */}
      {/* <ToolBar /> */}

    {/* Calendars Section */}
    <div className="flex w-full flex-1 overflow-hidden">
        {/* Left: Day Calendar */}
        <div ref={leftCalendarRef}
        className="w-1/2 bg-gray-100 overflow-auto"
        onScroll={handleScroll}
        >
          <FullCalendarWrapper />
        </div>

        {/* Right: WorkLog Calendar */}
        <div ref={rightCalendarRef}
        className="w-1/2 bg-gray-100 overflow-auto"
        onScroll={handleScroll}>
          <WorkLogCalendar />
        </div>
      </div>

      {/* Event Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <EventForm
            event={selectedEvent || {}}
            onSave={saveEvent}
            onDelete={deleteEvent}
            onClose={()=>setIsFormOpen(false)} // Close the form modal
          />
        </div>
      )}
    </div>
  );
};

export default CalendarContainer;