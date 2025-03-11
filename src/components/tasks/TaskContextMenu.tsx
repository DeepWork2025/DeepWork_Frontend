import { useState, useRef, useEffect } from "react";

interface TaskContextMenuProps {
  taskIndex: number;
  handleAddSubtaskClick: (taskIndex: number) => void;
  deleteTask: (taskIndex: number) => void;
  toggleSubtasks: (taskIndex: number) => void;
  hasSubtasks: boolean;
  isExpanded: boolean;
}

export const TaskContextMenu = ({
  taskIndex,
  handleAddSubtaskClick,
  deleteTask,
  toggleSubtasks,
  hasSubtasks,
  isExpanded,
}: TaskContextMenuProps) => {
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
        className="w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity text-gray-500 hover:text-gray-700 flex items-center justify-center"
        aria-label="Task options"
      >
        ⋯
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-10">
          <div className="py-1">
            <button
              type="button"
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => {
                handleAddSubtaskClick(taskIndex);
                setIsOpen(false);
              }}
            >
              Add a subtask
            </button>

            {hasSubtasks && (
              <button
                type="button"
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => {
                  toggleSubtasks(taskIndex);
                  setIsOpen(false);
                }}
              >
                {isExpanded ? "Hide subtasks" : "Show subtasks"}
              </button>
            )}

            <button
              type="button"
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
              onClick={() => {
                deleteTask(taskIndex);
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
