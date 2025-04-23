import { useState, useEffect, useRef } from "react";
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
  customEvents?: EventInput[];
  onEventDrop?: (info: EventDropArg) => void;
  onEventClick?: (info: EventClickArg) => void;
}

const FullCalendarWrapper: React.FC<FullCalendarWrapperProps> = ({
  customEvents,
  onEventDrop,
  onEventClick,
}) => {
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
  const calendarRef = useRef<HTMLDivElement>(null);

  // Use custom events if provided, otherwise use default events
  const events = customEvents || defaultEvents;
  const handleEventDrop = onEventDrop || defaultHandleEventDrop;
  const handleEventClick = onEventClick || defaultHandleEventClick;

  const [{ isOver }, drop] = useDrop(() => ({
    accept: "TASK",
    drop: (item: any, monitor) => {
      if (!monitor.didDrop()) {
        const dropTarget = calendarRef.current;
        if (dropTarget) {
          const clientOffset = monitor.getClientOffset();
          if (clientOffset) {
            // Convert coordinates to date
            const timeGrid = dropTarget.querySelector(".fc-timegrid-body");
            if (timeGrid) {
              const timeGridRect = timeGrid.getBoundingClientRect();
              const relativeYInTimeGrid = clientOffset.y - timeGridRect.top;
              const timeSlotHeight = timeGridRect.height / 24;
              const hours = relativeYInTimeGrid / timeSlotHeight;

              const dropDate = new Date();
              dropDate.setHours(Math.floor(hours));
              dropDate.setMinutes(Math.round((hours % 1) * 60));

              // Create new event
              const newEvent = {
                id: item.id,
                title: item.title,
                start: dropDate,
                end: new Date(dropDate.getTime() + 60 * 60 * 1000),
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
      <div
        className={`h-full ${isOver ? "bg-blue-50" : ""}`}
        ref={(node) => {
          drop(node);
          calendarRef.current = node;
        }}
      >
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-gray-500">Loading calendar...</div>
          </div>
        ) : (
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="timeGridDay"
            headerToolbar={false}
            dayHeaders={false}
            events={events}
            slotMinTime="00:00:00"
            slotMaxTime="24:00:00"
            slotDuration="00:15:00"
            slotLabelInterval="01:00"
            height="auto"
            contentHeight="auto"
            selectable={true}
            selectMirror={true}
            editable={true}
            droppable={false}
            select={handleDateSelect}
            eventClick={(e) => {
              console.log("Event clicked:", e.event);
              handleEventClick(e);
              setIsDetailModalOpen(true);
            }}
            eventDrop={handleEventDrop}
            eventResize={handleEventResize}
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
