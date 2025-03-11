import { useEffect, useRef } from "react";
import EventForm from "../event/EventForm";
import { useCalendarEvents } from '../../hooks/useCalendarEvents';
import FullCalendarWrapper from "./FullCalendarWrapper";

import WorkLogCalendar from "../workLog/WorkLogCalendar";
import ToolBar from "./ToolBar";

const CalendarContainer = () => {
  const {
    events,
    selectedEvent,
    isFormOpen,
    setIsFormOpen,
    handleSaveEvent,
    handleDeleteEvent,
    handleEventClick
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

    syncHeight();
    window.addEventListener("resize", syncHeight);
    return () => window.removeEventListener("resize", syncHeight);
  }, []);

  return (
    <div className="flex flex-col w-full">
      <div className="flex justify-between items-center  bg-white shadow w-full">
        {/* Header section with full row.*/}
        <header className="p-4 bg-white">
          <h1 className="text-2xl"><b>Today</b><span> 11 Mar, Tuesday</span></h1>
        </header>
        <button
          onClick={handleAddEvent}
          className="bg-blue-500 text-white px-4 py-2 rounded-md shadow hover:bg-blue-600"
        >
          + Add Event
        </button>
      </div>

      {/* Tool Bar */}
      <ToolBar />

    {/* Calendars Section */}
    <div className="flex w-full">
        {/* Left: Day Calendar */}
        <div ref={leftCalendarRef} className="w-1/2 bg-gray-100">
          <FullCalendarWrapper
            events={events}
            onEventClick={handleEventClick}
          />
        </div>

        {/* Right: WorkLog Calendar */}
        <div ref={rightCalendarRef} className="w-1/2 bg-gray-100">
          <WorkLogCalendar />
        </div>
      </div>

      {/* Event Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <EventForm
            event={selectedEvent || {}}
            onSave={handleSaveEvent}
            onDelete={handleDeleteEvent}
            onClose={()=>setIsFormOpen(false)} // Close the form modal
          />
        </div>
      )}
    </div>
  );
};

export default CalendarContainer;