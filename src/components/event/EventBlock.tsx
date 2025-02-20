import React from 'react';
import { EventBlockProps } from '../../types/event.types';

const EventBlock: React.FC<EventBlockProps> = ({
  title,
  startTime,
  endTime,
  label,
  description,
  isOverlapping = false,
}) => {

  if (!startTime || !endTime) {
    console.error("Missing startTime or endTime in EventBlock", { startTime, endTime });
    return null; // Prevent rendering if data is invalid
  }
  console.log("Rendering EventBlock with props:", { title, startTime, endTime, label, description });


  // Convert time strings to pixels for positioning
  const calculatePosition = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    return (hours * 48) + (minutes / 60 * 48); // 48px per hour
  };

  const topPosition = calculatePosition(startTime);
  const height = calculatePosition(endTime) - calculatePosition(startTime);

  // Get background and border colors based on label
  const getColors = (label: string) => {
    const colorMap: Record<string, { bg: string; border: string }> = {
      work: { bg: 'bg-blue-100', border: 'border-blue-500' },
      meeting: { bg: 'bg-purple-100', border: 'border-purple-500' },
      personal: { bg: 'bg-green-100', border: 'border-green-500' },
      default: { bg: 'bg-gray-100', border: 'border-gray-500' },
    };
    return colorMap[label.toLowerCase()] || colorMap.default;
  };

  const { bg, border } = getColors(label);

  return (
    <div
      className={`
        absolute left-16 right-4
        ${bg} 
        ${border}
        border-l-4
        rounded-r-lg
        shadow-sm
        transition-all
        duration-200
        cursor-pointer
        group
        hover:shadow-md
        hover:opacity-90
        ${isOverlapping ? 'z-10 hover:z-20' : 'z-0'}
      `}
      style={{
        top: `${topPosition}px`,
        height: `${height}px`,
        minHeight: '24px', // Minimum height for very short events
      }}
    >
      <div className="p-2 h-full flex flex-col overflow-hidden">
        {/* Time display */}
        <div className="text-xs text-gray-600 mb-1">
          {startTime} - {endTime}
        </div>
        
        {/* Title */}
        <div className="font-medium text-sm truncate">
          {title}
        </div>
        
        {/* Description (only shown if space available) */}
        {description && height > 48 && (
          <div className="text-xs text-gray-600 mt-1 line-clamp-2">
            {description}
          </div>
        )}
        
        {/* Label badge */}
        <div className="mt-auto">
          <span className={`
            text-xs px-2 py-0.5 rounded-full
            ${bg.replace('100', '200')}
            ${border.replace('500', '700').replace('border-', 'text-')}
          `}>
            {label}
          </span>
        </div>
      </div>
    </div>
  );
};

export default EventBlock;