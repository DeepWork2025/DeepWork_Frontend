import React, { useRef, useEffect } from "react";

const TimeAxis: React.FC = () => {
  const hours = Array.from({ length: 24 }, (_, hour) => hour);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      const scrollOffset = 8 * 48;
      containerRef.current.scrollTop = scrollOffset;
    }
  }, []);

  return (
    <div
      className="h-[540px] w-full overflow-y-auto bg-gray-100 border border-gray-300 shadow-md rounded-md"
      ref={containerRef}
    >
      {hours.map((hour) => (
        <div key={hour} className="flex items-center h-12  px-4">
          <div className="w-16 text-right text-gray-700 font-medium">
            {hour === 0
              ? "12 AM"
              : hour < 12
              ? `${hour} AM`
              : hour === 12
              ? "12 PM"
              : `${hour - 12} PM`}
          </div>

          <div className="flex-grow h-px bg-gray-300 ml-4"></div>
        </div>
      ))}
    </div>
  );
};

export default TimeAxis;