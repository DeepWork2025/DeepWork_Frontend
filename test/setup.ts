import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock localStorage
class LocalStorageMock {
  store: Record<string, string> = {};
  getItem(key: string) { return this.store[key] ?? null; }
  setItem(key: string, value: string) { this.store[key] = String(value); }
  removeItem(key: string) { delete this.store[key]; }
  clear() { this.store = {}; }
}
Object.defineProperty(window, 'localStorage', { value: new LocalStorageMock() });

// Mock Notification API
Object.defineProperty(window, 'Notification', {
  value: class {
    static permission = 'granted';
    constructor(_title: string, _opts?: NotificationOptions) {}
  },
  writable: true,
  configurable: true
});

// Mock confirm dialog
Object.defineProperty(window, 'confirm', {
  value: vi.fn(() => true) // 默认"继续"
});

// Mock dispatchEvent
Object.defineProperty(window, 'dispatchEvent', {
  value: window.dispatchEvent.bind(window)
});

// Mock document visibility state
Object.defineProperty(document, 'visibilityState', {
  value: 'visible',
  writable: true
});
Object.defineProperty(document, 'hidden', {
  value: false,
  writable: true
});

// Mock CustomEvent
vi.stubGlobal('CustomEvent', class extends Event {
  detail: any;
  constructor(event: string, params: any = {}) {
    super(event, params);
    this.detail = params.detail;
  }
});

// Mock beforeunload event
const originalAddEventListener = window.addEventListener;
window.addEventListener = vi.fn((event: string, listener: any) => {
  if (event === 'beforeunload') {
    // Store the listener for testing
    (window as any)._beforeunloadListener = listener;
  }
  return originalAddEventListener.call(window, event, listener);
});

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  warn: vi.fn(),
  error: vi.fn(),
  log: vi.fn(),
};
