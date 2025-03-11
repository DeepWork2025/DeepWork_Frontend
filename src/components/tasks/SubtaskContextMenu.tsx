import { useState, useRef, useEffect } from "react";

interface SubtaskContextMenuProps {
  taskIndex: number;
  subtaskIndex: number;
  convertSubtaskToTask: (taskIndex: number, subtaskIndex: number) => void;
  deleteSubtask: (taskIndex: number, subtaskIndex: number) => void;
}

export const SubtaskContextMenu = ({
  taskIndex,
  subtaskIndex,
  convertSubtaskToTask,
  deleteSubtask,
}: SubtaskContextMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close the menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative ml-auto" ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity text-gray-500 hover:text-gray-700 flex items-center justify-center"
        aria-label="Subtask options"
      >
        ⋮
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-10">
          <div className="py-1">
            <button
              type="button"
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => {
                convertSubtaskToTask(taskIndex, subtaskIndex);
                setIsOpen(false);
              }}
            >
              Convert to task
            </button>
            <button
              type="button"
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
              onClick={() => {
                deleteSubtask(taskIndex, subtaskIndex);
                setIsOpen(false);
              }}
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
