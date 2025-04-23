import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { EventClickArg, EventDropArg, EventInput } from "@fullcalendar/core";
import { useCalendarEvents } from "../../hooks/useCalendarEvents";
import EventDetailModal from "../event/EventDetailModal";
import { CustomEventBlock } from "../event/CustomEventBlock";
import { useDrop } from "react-dnd";

interface FullCalendarWrapperProps {
  selectedDate: Date;
  customEvents?: EventInput[];
  onEventDrop?: (info: EventDropArg) => void;
  onEventClick?: (info: EventClickArg) => void;
}

interface DraggedTask {
  id: string;
  title: string;
  extendedProps: {
    description?: string;
    label?: string;
    // [key: string]: any;
  };
}

const FullCalendarWrapper: React.FC<FullCalendarWrapperProps> = ({
  selectedDate,
  customEvents,
  onEventDrop,
  onEventClick,
}) => {

// helper function to check if date = today
const isToday = (date: Date) => {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

const isTodayView = isToday(selectedDate);

  const {
    events: defaultEvents,
    handleEventClick: defaultHandleEventClick,
    handleDateSelect,
    deleteEvent,
    handleEventDrop: defaultHandleEventDrop,
    handleEventResize,
    selectedEvent,
    loading,
    saveEvent,
  } = useCalendarEvents();

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Use custom events if provided, otherwise use default events
  const events = customEvents || defaultEvents;
  const handleEventDrop = onEventDrop || defaultHandleEventDrop;
  const handleEventClick = onEventClick || defaultHandleEventClick;

  const [{ isOver }, drop] = useDrop(() => ({
    accept: "TASK",
    drop: (item: DraggedTask, monitor) => {
      if (!monitor.didDrop()) {
        const dropTarget = document.querySelector(".fc-timegrid-body");
        if (dropTarget) {
          const clientOffset = monitor.getClientOffset();
          if (clientOffset) {
            const timeGridRect = dropTarget.getBoundingClientRect();
            const relativeYInTimeGrid = clientOffset.y - timeGridRect.top;

            // Calculate the exact time based on position
            const timeSlotHeight = timeGridRect.height / 24; // 24 hours in a day
            const hourDecimal = relativeYInTimeGrid / timeSlotHeight;

            // Create date at precise drop position
            const dropDate = new Date();
            const hours = Math.floor(hourDecimal);
            const minutes = Math.round((hourDecimal % 1) * 60);

            dropDate.setHours(hours, minutes, 0, 0);

            // Round to nearest 15 minutes for better UX
            const roundedMinutes = Math.round(minutes / 15) * 15;
            dropDate.setMinutes(roundedMinutes);

            // Default duration is 1 hour
            const endDate = new Date(dropDate);
            endDate.setHours(endDate.getHours() + 1);

            // Check if we're dropping near the end of an existing event
            // to create a continuous schedule
            const existingEvents = events.filter((evt) => {
              if (!evt.end) return false;

              // Convert to Date object if needed
              const evtEnd =
                evt.end instanceof Date ? evt.end : new Date(evt.end as string);

              // Events that end within 15 minutes of our drop position
              const timeDiff = Math.abs(evtEnd.getTime() - dropDate.getTime());
              return timeDiff < 15 * 60 * 1000; // 15 minutes in milliseconds
            });

            // If we found an event that ends near our drop position, adjust start time
            if (existingEvents.length > 0) {
              // Sort to find the latest ending event
              existingEvents.sort((a, b) => {
                const aEnd =
                  a.end instanceof Date ? a.end : new Date(a.end as string);

                const bEnd =
                  b.end instanceof Date ? b.end : new Date(b.end as string);

                return bEnd.getTime() - aEnd.getTime();
              });

              const latestEvent = existingEvents[0];
              const latestEventEnd =
                latestEvent.end instanceof Date
                  ? latestEvent.end
                  : new Date(latestEvent.end as string);

              // Set our new event to start exactly when the latest event ends
              dropDate.setTime(latestEventEnd.getTime());
              endDate.setTime(dropDate.getTime() + 60 * 60 * 1000); // 1 hour later
            }

            // Create new event
            const newEvent = {
              id: item.id,
              title: item.title,
              start: dropDate,
              end: endDate,
              backgroundColor: "#3788d8",
              borderColor: "#3788d8",
              textColor: "#ffffff",
              extendedProps: {
                ...item.extendedProps,
                isStopped: false,
              },
            };

            console.log("Creating new event:", {
              start: dropDate.toLocaleTimeString(),
              end: endDate.toLocaleTimeString(),
              title: item.title,
            });

            // Save the event
            saveEvent({
              id: Number(newEvent.id),
              title: newEvent.title,
              startTime: newEvent.start.toISOString(),
              endTime: newEvent.end.toISOString(),
              description: newEvent.extendedProps.description || "",
              label: newEvent.extendedProps.label || "",
              backgroundColor: newEvent.backgroundColor,
            });
          }
        }
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  useEffect(() => {
    console.log("Current events in FullCalendar:", events);
    events.forEach((event) => {
      console.log("Event details:", {
        id: event.id,
        title: event.title,
        start: event.start,
        end: event.end,
        backgroundColor: event.backgroundColor,
        extendedProps: event.extendedProps,
      });
    });
  }, [events]);

  return (
    <div className="h-full min-h-[600px]">
      <div className={`h-full ${isOver ? "bg-blue-50" : ""}`} ref={drop}>
        {/* Optional UI hint for Archieved mode */}
        {!isTodayView && (
          <div className="text-center text-sm text-gray-500 italic mb-2">
            Viewing archived events (read-only)
          </div>
        )}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-gray-500">Loading calendar...</div>
          </div>
        ) : (
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="timeGridDay"
            initialDate={selectedDate}
            headerToolbar={false}
            dayHeaders={false}
            events={events}
            slotMinTime="00:00:00"
            slotMaxTime="24:00:00"
            slotDuration="00:15:00"
            slotLabelInterval="01:00"
            height="auto"
            contentHeight="auto"
            selectable={isTodayView}
            selectMirror={true} // select mirror
            editable={isTodayView}
            droppable={false}
            slotEventOverlap={false}
            select={isTodayView? handleDateSelect : undefined}
            eventClick={(e) => {
              console.log("Event clicked:", e.event);
              handleEventClick(e);
              setIsDetailModalOpen(true);
            }}
            eventDrop={isTodayView? handleEventDrop: undefined}
            eventResize={isTodayView? handleEventResize: undefined}
            expandRows={true}
            nowIndicator={true}
            allDaySlot={false}
            eventContent={(arg) => {
              console.log("Rendering event:", arg.event);
              return (
                <CustomEventBlock event={arg.event} timeText={arg.timeText} />
              );
            }}
            viewDidMount={(view) => {
              // Ensure the time grid has a minimum height
              const timeGrid = view.el.querySelector(
                ".fc-timegrid-body"
              ) as HTMLElement;
              if (timeGrid) {
                timeGrid.style.minHeight = "600px";
              }
            }}
          />
        )}
      </div>
      {isDetailModalOpen && selectedEvent && (
        <EventDetailModal
          event={selectedEvent}
          onClose={() => setIsDetailModalOpen(false)}
          onDelete={deleteEvent}
          onUpdate={saveEvent}
        />
      )}
    </div>
  );
};

export default FullCalendarWrapper;
