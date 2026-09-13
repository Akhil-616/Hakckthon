import { useState } from 'react';
import StudentNameSearch from '../components/student/StudentNameSearch';
import StudentDashboard from '../components/student/StudentDashboard';

export default function StudentPerspective() {
  const [studentId, setStudentId] = useState<string | null>(null);

  if (studentId) {
    return <StudentDashboard studentId={studentId} onLogout={() => setStudentId(null)} />;
  }

  return <StudentNameSearch onSelect={setStudentId} />;
}