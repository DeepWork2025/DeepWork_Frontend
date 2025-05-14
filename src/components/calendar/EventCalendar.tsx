import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import {  EventClickArg, EventDropArg, EventInput } from "@fullcalendar/core";
import { useCalendarEvents } from "../../hooks/useCalendarEvents";
import EventDetailModal from "../event/EventDetailModal";
import { CustomEventBlock } from "../event/CustomEventBlock";
import { useDrop } from "react-dnd";

interface EventCalendarProps {
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

const EventCalendar: React.FC<EventCalendarProps> = ({
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

const debugInfo = useCalendarEvents();
console.log(debugInfo);

const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Use custom events if provided, otherwise use default events
const calendarEntries = customEvents || defaultEvents;
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
            const events = calendarEntries || []; // TODO: fix hack
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
    console.log("new entry added to calendar");
 calendarEntries.filter((entry) => {
   if (entry.start instanceof Date) {
     return entry.start.getTime() > new Date().setHours(0, 0, 0, 0);
   } else {
     // Handle the case where entry.start is a string
     // You may need to parse the string into a Date object
     const startDate = new Date("" + entry.start);
     return startDate.getTime() > new Date().setHours(0, 0, 0, 0);
   }
 });
    calendarEntries.forEach((entry) => {

      console.log("--",entry.title);
    });
  }, [calendarEntries]);

  return (
    <div className="h-full min-h-[600px]">
      <div className={`h-full ${isOver ? "bg-blue-50" : ""}`} ref={drop}>
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
            events={calendarEntries}
            slotMinTime="00:00:00"
            slotMaxTime="24:00:00"
            slotDuration="00:15:00"
            slotLabelInterval="01:00"
            height="auto"
            contentHeight="auto"
            selectable={isTodayView} // 确认是否今天，是：可以更改；否：不能更改
            selectMirror={true} // select mirror
            editable={isTodayView}
            droppable={false}
            slotEventOverlap={false}
            select={isTodayView? handleDateSelect : undefined} // 确认是否今天，是：可以更改；否：不能更改
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
              // console.log("Rendering event:", arg.event);
              return (
                <CustomEventBlock event={arg.event} timeText={arg.timeText}
                readOnly={isTodayView}/>
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

export default EventCalendar;
