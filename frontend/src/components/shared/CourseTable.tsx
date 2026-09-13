import type { Course } from '../../types/canonical';
import StatusBadge from './StatusBadge';
import { getAttendanceStatus } from '../../lib/constants';

interface CourseTableProps {
  courses: Course[];
  focusedModuleId?: string | null;
  onCourseClick?: (moduleId: string) => void;
}

export default function CourseTable({ courses, focusedModuleId, onCourseClick }: CourseTableProps) {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Module</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Credits</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Semester</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Classes</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Present</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Late</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Absent</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Attendance</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {courses.map((course) => {
            const percent = course.attendancepercent === '—' ? 0 : parseFloat(course.attendancepercent);
            const status = getAttendanceStatus(percent);
            const isFocused = focusedModuleId === course.moduleid;

            return (
              <tr
                key={course.moduleid}
                onClick={() => onCourseClick?.(course.moduleid)}
                className={`${onCourseClick ? 'cursor-pointer' : ''} ${isFocused ? 'bg-blue-50 font-semibold' : 'hover:bg-gray-50'} transition-colors`}
              >
                <td className="px-4 py-3 text-sm text-gray-900">{course.modulename}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{course.credits}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{course.semester}</td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {course.totalsessions} / {course.totalclassespersemester || '—'}
                </td>
                <td className="px-4 py-3 text-sm text-green-600">{course.present}</td>
                <td className="px-4 py-3 text-sm text-yellow-600">{course.late}</td>
                <td className="px-4 py-3 text-sm text-red-600">{course.totaleffectiveabsent}</td>
                <td className="px-4 py-3 text-sm">
                  <div className="flex items-center gap-2">
                    <span>{course.attendancepercent}</span>
                    {course.attendancepercent !== '—' && <StatusBadge status={status} />}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}