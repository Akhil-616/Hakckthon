// Single source of truth for attendance threshold
export const ATTENDANCE_GOOD_THRESHOLD = 85;

export function getAttendanceStatus(percent: number): 'Good' | 'Warning' {
  return percent >= ATTENDANCE_GOOD_THRESHOLD ? 'Good' : 'Warning';
}