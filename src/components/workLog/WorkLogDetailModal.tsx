import React from 'react';
import { WorkLogData } from '../../types/workLog.type';

interface WorkLogDetailModalProps {
  workLog: WorkLogData;
  onClose: () => void;
  onDelete: () => void;
}

export const WorkLogDetailModal: React.FC<WorkLogDetailModalProps> = ({
  workLog,
  onClose,
  onDelete
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-lg w-full">
        <h3 className="text-xl font-semibold mb-4">{workLog.title}</h3>
        <div className="mb-4">
          <p><span className="font-medium">Start:</span> {new Date(workLog.start).toLocaleString()}</p>
          <p><span className="font-medium">End:</span> {new Date(workLog.end).toLocaleString()}</p>
          <p><span className="font-medium">Type:</span> {workLog.extendedProps.type}</p>
          {workLog.extendedProps.category && (
            <p><span className="font-medium">Category:</span> {workLog.extendedProps.category}</p>
          )}
          {workLog.extendedProps.description && (
            <div>
              <p className="font-medium">Description:</p>
              <p className="mt-1">{workLog.extendedProps.description}</p>
            </div>
          )}
        </div>
        <div className="flex justify-end">
          <button 
            className="px-4 py-2 bg-gray-200 rounded-md mr-2"
            onClick={onClose}
          >
            Close
          </button>
          <button 
            className="px-4 py-2 bg-red-500 text-white rounded-md"
            onClick={onDelete}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}; 