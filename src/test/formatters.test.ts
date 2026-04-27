import { describe, it, expect } from 'vitest';
import { formatTime } from '../utils/formatters'; // Hypothetical utility

describe('formatTime', () => {
  it('should format seconds into MM:SS format', () => {
    expect(formatTime(0)).toBe('00:00');
    expect(formatTime(5)).toBe('00:05');
    expect(formatTime(59)).toBe('00:59');
    expect(formatTime(60)).toBe('01:00');
    expect(formatTime(65)).toBe('01:05');
    expect(formatTime(120)).toBe('02:00');
    expect(formatTime(3599)).toBe('59:59'); // 59 minutes, 59 seconds
  });

  it('should handle times over an hour correctly by continuing to count minutes', () => {
    expect(formatTime(3600)).toBe('60:00');
    expect(formatTime(3661)).toBe('61:01');
  });

  it('should handle negative numbers by returning 00:00', () => {
    expect(formatTime(-1)).toBe('00:00');
    expect(formatTime(-100)).toBe('00:00');
  });
});