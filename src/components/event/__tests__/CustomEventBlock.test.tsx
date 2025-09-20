import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { CustomEventBlock } from '../CustomEventBlock';
import * as workLogService from '../../../api/workLogService';

// 使用假时钟
vi.useFakeTimers();
vi.setSystemTime(new Date('2025-01-01T08:00:00.000Z'));

const baseEvent: any = {
  id: 'e1',
  title: 'Deep Work',
  start: new Date('2025-01-01T08:00:00.000Z'),
  end: new Date('2025-01-01T09:00:00.000Z'),
  extendedProps: { 
    type: 'deep', 
    category: 'Focus', 
    description: 'Test work session',
    inProgress: false,
    isPaused: false
  }
};

const shortEvent: any = {
  ...baseEvent,
  end: new Date('2025-01-01T08:15:00.000Z'), // 15分钟
};

const mediumEvent: any = {
  ...baseEvent,
  end: new Date('2025-01-01T08:25:00.000Z'), // 25分钟
};

const longEvent: any = {
  ...baseEvent,
  end: new Date('2025-01-01T10:00:00.000Z'), // 2小时
};

describe('CustomEventBlock', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('renders start button when not started', () => {
    render(<CustomEventBlock event={baseEvent} timeText="08:00 - 09:00" />);
    expect(screen.getByTitle('Start')).toBeInTheDocument();
  });

  it('starts, pauses, resumes, and stops timer', () => {
    const saveSpy = vi.spyOn(workLogService, 'saveWorkLog').mockImplementation(() => {});
    const updateTotalSpy = vi.spyOn(workLogService, 'updateTotalWorkTime').mockImplementation(() => {});
    const startTimerSpy = vi.spyOn(workLogService, 'startWorkLog').mockImplementation((log) => log);

    render(<CustomEventBlock event={baseEvent} timeText="08:00 - 09:00" />);
    
    // 开始计时
    const startBtn = screen.getByTitle('Start');
    fireEvent.click(startBtn);
    expect(startTimerSpy).toHaveBeenCalled();

    // 暂停计时
    const pauseBtn = screen.getByTitle('Pause');
    fireEvent.click(pauseBtn);

    // 恢复计时
    const resumeBtn = screen.getByTitle('Resume');
    fireEvent.click(resumeBtn);

    // 停止计时
    const stopBtn = screen.getByTitle('Stop');
    fireEvent.click(stopBtn);

    expect(saveSpy).toHaveBeenCalled();
    expect(updateTotalSpy).toHaveBeenCalled();
    
    saveSpy.mockRestore();
    updateTotalSpy.mockRestore();
    startTimerSpy.mockRestore();
  });

  it('shows auto-stopped state with clock icon', () => {
    const stoppedEvent = {
      ...baseEvent,
      extendedProps: { 
        ...baseEvent.extendedProps, 
        autoStopped: true, 
        isStopped: true 
      }
    };
    render(<CustomEventBlock event={stoppedEvent} timeText="08:00 - 09:00" />);
    expect(screen.getByTitle('Auto Stopped')).toBeInTheDocument();
  });

  it('shows finished state with checkmark icon', () => {
    const finishedEvent = {
      ...baseEvent,
      extendedProps: { 
        ...baseEvent.extendedProps, 
        isStopped: true 
      }
    };
    render(<CustomEventBlock event={finishedEvent} timeText="08:00 - 09:00" />);
    expect(screen.getByTitle('Finished')).toBeInTheDocument();
  });

  it('renders single line for shortest events (< 15 minutes)', () => {
    render(<CustomEventBlock event={shortEvent} timeText="08:00 - 08:15" />);
    
    // 应该只显示标题和类型，不显示时长
    expect(screen.getByText('Deep Work [deep]')).toBeInTheDocument();
    expect(screen.queryByText(/Duration:/)).not.toBeInTheDocument();
  });

  it('renders two lines for short events (< 30 minutes)', () => {
    render(<CustomEventBlock event={mediumEvent} timeText="08:00 - 08:25" />);
    
    // 应该显示标题和时长
    expect(screen.getByText('Deep Work [deep]')).toBeInTheDocument();
    expect(screen.getByText(/Duration:/)).toBeInTheDocument();
  });

  it('renders full layout for long events (>= 30 minutes)', () => {
    render(<CustomEventBlock event={longEvent} timeText="08:00 - 10:00" />);
    
    // 应该显示时间、标题、时长
    expect(screen.getByText(/8:00 AM - 10:00 AM/)).toBeInTheDocument();
    expect(screen.getByText('Deep Work [deep]')).toBeInTheDocument();
    expect(screen.getByText(/Duration:/)).toBeInTheDocument();
  });

  it('shows label when provided', () => {
    const eventWithLabel = {
      ...longEvent,
      extendedProps: {
        ...longEvent.extendedProps,
        label: 'Important'
      }
    };
    render(<CustomEventBlock event={eventWithLabel} timeText="08:00 - 10:00" />);
    
    expect(screen.getByText('Important')).toBeInTheDocument();
  });

  it('handles readOnly mode correctly', () => {
    render(<CustomEventBlock event={baseEvent} timeText="08:00 - 09:00" readOnly={true} />);
    
    // 在只读模式下不应该显示任何操作按钮
    expect(screen.queryByTitle('Start')).not.toBeInTheDocument();
    expect(screen.queryByTitle('Pause')).not.toBeInTheDocument();
    expect(screen.queryByTitle('Stop')).not.toBeInTheDocument();
  });

  it('calculates duration correctly', () => {
    render(<CustomEventBlock event={longEvent} timeText="08:00 - 10:00" />);
    
    // 2小时的时长应该显示为 "2h 0m 0s"
    expect(screen.getByText(/Duration: 2h 0m 0s/)).toBeInTheDocument();
  });

  it('formats time display correctly', () => {
    render(<CustomEventBlock event={longEvent} timeText="08:00 - 10:00" />);
    
    // 应该显示格式化的时间
    expect(screen.getByText(/8:00 AM - 10:00 AM/)).toBeInTheDocument();
  });

  it('handles events without end time', () => {
    const eventWithoutEnd = {
      ...baseEvent,
      end: null
    };
    render(<CustomEventBlock event={eventWithoutEnd} timeText="08:00 - 09:00" />);
    
    // 应该显示原始时间文本
    expect(screen.getByText('08:00 - 09:00')).toBeInTheDocument();
  });
});
