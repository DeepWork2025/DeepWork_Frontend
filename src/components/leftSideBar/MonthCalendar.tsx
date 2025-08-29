import React, { useState } from "react";

interface MonthCalendarProps {
  selectedDate?: Date;
  onDateClick?: (date: Date) => void;
}

const MonthCalendar: React.FC<MonthCalendarProps> = ({
  selectedDate,
  onDateClick
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const today = new Date();

  const daysInMonth = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const startDay = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const prevMonth = () =>
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );

  const nextMonth = () =>
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );

  const isToday = (day: number) =>
    today.getDate() === day &&
    today.getMonth() === currentDate.getMonth() &&
    today.getFullYear() === currentDate.getFullYear();

  const isSelected = (date: Date) =>
    selectedDate &&
    date.getDate() === selectedDate.getDate() &&
    date.getMonth() === selectedDate.getMonth() &&
    date.getFullYear() === selectedDate.getFullYear();

  const renderDays = () => {
    const days = [];
    const totalDays = daysInMonth(currentDate);
    const startingDay = startDay(currentDate);

    // Fill empty cells before the 1st
    for (let i = 0; i < startingDay; i++) {
      days.push(<div key={`empty-${i}`} className="w-10 h-10" />);
    }

// Fill actual days
for (let i = 1; i <= totalDays; i++) {
  const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
  const isCurrent = isToday(date.getDate());
  const isPicked = isSelected(date);

  const baseStyle =
    "w-10 h-10 flex items-center justify-center text-xs font-medium cursor-pointer rounded-md transition";
  const todayStyle = isCurrent
    ? "bg-blue-500 text-white font-bold shadow-md"
    : "hover:bg-gray-200 text-gray-700";
  const selectedStyle = isPicked ? "ring-2 ring-blue-500" : "";

  days.push(
    <div
      key={i}
      onClick={() => onDateClick?.(date)}
      className={`${baseStyle} ${todayStyle} ${selectedStyle}`}
    >
      {i}
    </div>
  );
}

return days;
};

  return (
    <div className="max-w-xs mx-auto h-[360px] flex flex-col border rounded-lg shadow-md bg-white overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center bg-gray-100 px-4 py-2">
        <button
          className="text-base font-bold hover:text-gray-600 transition"
          onClick={prevMonth}
        >
          &lt;
        </button>
        <h2 className="text-sm font-semibold tracking-wide">
          {currentDate.toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
        </h2>
        <button
          className="text-base font-bold hover:text-gray-600 transition"
          onClick={nextMonth}
        >
          &gt;
        </button>
      </div>

      {/* Weekdays */}
      <div className="grid grid-cols-7 text-center font-medium bg-gray-50 py-1 text-gray-700 border-b">
        {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
          <div
            key={`weekday-${index}`}
            className="text-xs h-10 flex items-center justify-center"
            style={{ lineHeight: "1" }}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Dates */}
      <div className="grid grid-cols-7 gap-0.5 p-2">
        {renderDays().map((day, index) => (
          <div
            key={`calendar-day-${index}`}
            className="flex items-center justify-center text-xs font-medium cursor-pointer rounded-md transition"
            style={{ lineHeight: "1" }}
          >
            {day}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MonthCalendar;
