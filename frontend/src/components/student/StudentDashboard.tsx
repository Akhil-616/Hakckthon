import { useState, useEffect } from 'react';
import { getStudentDashboard } from '../../lib/apiClient';
import type { StudentDashboard as DashboardData } from '../../types/canonical';
import AttendanceSummaryCards from '../shared/AttendanceSummaryCards';
import JustificationForm from './JustificationForm';
import InformationPage from '../shared/InformationPage';

interface StudentDashboardProps {
  studentId: string;
  onLogout: () => void;
}

function calculateAbsenceAllowance(totalClassesSemester: number, alreadyLost: number) {
  const minRequiredToAttend = Math.ceil(0.8 * totalClassesSemester);
  const maxAllowedAbsences = totalClassesSemester - minRequiredToAttend;
  return Math.max(0, maxAllowedAbsences - alreadyLost);
}

export default function StudentDashboard({ studentId, onLogout }: StudentDashboardProps) {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [focusedModuleId, setFocusedModuleId] = useState<string | null>(null);

  useEffect(() => {
    loadDashboard();
  }, [studentId]);

  async function loadDashboard() {
    setLoading(true);
    try {
      const dashboard = await getStudentDashboard(studentId);
      setData(dashboard);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  }

  function handleCourseClick(moduleId: string) {
    setFocusedModuleId(prev => prev === moduleId ? null : moduleId);
  }

  if (loading) {
    return (
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh'}}>
        <div style={{fontSize: '1.25rem', color: '#64748b'}}>Loading dashboard...</div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div style={{maxWidth: '42rem', margin: '2rem auto', backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '0.75rem', padding: '1.5rem'}}>
        <p style={{color: '#991b1b'}}>{error || 'Failed to load dashboard'}</p>
        <button onClick={onLogout} style={{marginTop: '1rem', color: '#dc2626', cursor: 'pointer', background: 'none', border: 'none', textDecoration: 'underline'}}>
          Go back
        </button>
      </div>
    );
  }

  let displayStats = data.overall;
  let totalSemesterClasses = data.courses.reduce((sum, c) => sum + (c.totalclassespersemester || 0), 0);
  let focusedCourseName = 'Overall';

  if (focusedModuleId) {
    const focusedCourse = data.courses.find(c => c.moduleid === focusedModuleId);
    if (focusedCourse) {
      displayStats = {
        totalHeld: focusedCourse.totalsessions,
        totalPresent: focusedCourse.present,
        totalLate: focusedCourse.late,
        totalAbsent: focusedCourse.totaleffectiveabsent,
        attendancePercent: focusedCourse.attendancepercent === '—' ? 0 : parseFloat(focusedCourse.attendancepercent)
      };
      totalSemesterClasses = focusedCourse.totalclassespersemester || 0;
      focusedCourseName = focusedCourse.modulename || focusedCourse.moduleid;
    }
  }

  const classesYouCanStillMiss = calculateAbsenceAllowance(totalSemesterClasses, displayStats.totalAbsent);

  return (
    <div style={{minHeight: '100vh', backgroundColor: '#f8fafc'}}>
      {/* Top Navigation */}
      <div style={{backgroundColor: 'white', borderBottom: '1px solid #e2e8f0', position: 'sticky', top: 0, zIndex: 10}}>
        <div style={{maxWidth: '1400px', margin: '0 auto', padding: '1rem 1.25rem'}}>
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '2rem', flexWrap: 'wrap'}}>
            <div style={{display: 'flex', gap: '1.5rem'}}>
              <a
                href="#overview"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 1rem',
                  color: '#64748b',
                  textDecoration: 'none',
                  borderRadius: '0.5rem',
                  fontWeight: '500',
                  fontSize: '0.9375rem',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <span>📊</span>
                <span>Overview</span>
              </a>
              <a
                href="#courses"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 1rem',
                  color: '#64748b',
                  textDecoration: 'none',
                  borderRadius: '0.5rem',
                  fontWeight: '500',
                  fontSize: '0.9375rem',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <span>📚</span>
                <span>Courses</span>
              </a>
              <a
                href="#justifications"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 1rem',
                  color: '#64748b',
                  textDecoration: 'none',
                  borderRadius: '0.5rem',
                  fontWeight: '500',
                  fontSize: '0.9375rem',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <span>📝</span>
                <span>Justifications</span>
              </a>
              <a
                href="#information"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 1rem',
                  color: '#64748b',
                  textDecoration: 'none',
                  borderRadius: '0.5rem',
                  fontWeight: '500',
                  fontSize: '0.9375rem',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <span>ℹ️</span>
                <span>Information</span>
              </a>
            </div>
            <button
              onClick={onLogout}
              style={{
                padding: '0.5rem 1rem',
                color: '#64748b',
                backgroundColor: 'transparent',
                border: '1px solid #e2e8f0',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontWeight: '500',
                fontSize: '0.9375rem',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f8fafc';
                e.currentTarget.style.borderColor = '#cbd5e1';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.borderColor = '#e2e8f0';
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div style={{maxWidth: '1400px', margin: '0 auto', padding: '2rem 1.25rem'}}>
        {/* Student Info Card */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '1rem',
          padding: '2rem',
          marginBottom: '2rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{display: 'flex', alignItems: 'flex-start', gap: '1.5rem'}}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '4rem',
              height: '4rem',
              backgroundColor: '#3b82f615',
              borderRadius: '1rem',
              fontSize: '2rem',
              flexShrink: 0
            }}>
              👤
            </div>
            <div style={{flex: 1}}>
              <h1 style={{fontSize: '1.875rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.75rem'}}>
                {data.student.studentname}
              </h1>
              <div style={{display: 'grid', gap: '0.5rem', fontSize: '0.9375rem', color: '#64748b'}}>
                <div style={{display: 'flex', gap: '2rem', flexWrap: 'wrap'}}>
                  <span><strong style={{color: '#475569'}}>ID:</strong> {data.student.studentid}</span>
                  <span><strong style={{color: '#475569'}}>Year:</strong> {data.student.year}</span>
                  <span><strong style={{color: '#475569'}}>Section:</strong> {data.student.sectioncode}</span>
                </div>
                <div><strong style={{color: '#475569'}}>Programme:</strong> {data.student.programmename}</div>
                <div><strong style={{color: '#475569'}}>Email:</strong> {data.student.email}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Important Messages Section */}
        <div style={{marginBottom: '2rem'}}>
          <InformationPage studentId={studentId} apiBase={`/api/students/${studentId}`} />
        </div>

        {/* Overview Section */}
        <div id="overview" style={{scrollMarginTop: '5rem', marginBottom: '3rem'}}>
          <h2 style={{fontSize: '1.5rem', fontWeight: '700', color: '#0f172a', marginBottom: '1rem'}}>
            Attendance Overview
          </h2>
          <div style={{marginBottom: '1.5rem'}}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1rem',
              backgroundColor: '#f1f5f9',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: '600',
              color: '#475569'
            }}>
              Viewing: <span style={{color: '#059669'}}>{focusedCourseName}</span>
              {focusedModuleId && (
                <button
                  onClick={() => setFocusedModuleId(null)}
                  style={{
                    marginLeft: '0.5rem',
                    color: '#3b82f6',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    textDecoration: 'underline',
                    fontSize: '0.8125rem'
                  }}
                >
                  View Overall
                </button>
              )}
            </div>
          </div>

          <AttendanceSummaryCards
            overall={displayStats}
            totalSemesterClasses={totalSemesterClasses}
            classesYouCanStillMiss={classesYouCanStillMiss}
          />
        </div>

        {/* Courses Section */}
        <div id="courses" style={{scrollMarginTop: '5rem', marginBottom: '3rem'}}>
          <h2 style={{fontSize: '1.5rem', fontWeight: '700', color: '#0f172a', marginBottom: '1.5rem'}}>
            Your Courses
          </h2>
          <div style={{display: 'grid', gap: '1rem'}}>
            {data.courses.map((course) => (
              <div
                key={course.moduleid}
                onClick={() => handleCourseClick(course.moduleid)}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '1rem',
                  padding: '1.5rem',
                  border: focusedModuleId === course.moduleid ? '2px solid #3b82f6' : '1px solid #e2e8f0',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  if (focusedModuleId !== course.moduleid) {
                    e.currentTarget.style.borderColor = '#cbd5e1';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (focusedModuleId !== course.moduleid) {
                    e.currentTarget.style.borderColor = '#e2e8f0';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.08)';
                  }
                }}
              >
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap'}}>
                  <div>
                    <h3 style={{fontSize: '1.125rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.25rem'}}>
                      {course.modulename}
                    </h3>
                    <div style={{fontSize: '0.875rem', color: '#64748b'}}>
                      {course.moduleid} • Semester {course.semester} • {course.credits} credits
                    </div>
                  </div>
                  <div style={{
                    padding: '0.375rem 0.75rem',
                    backgroundColor: course.attendancepercent === '—' ? '#f1f5f9' :
                      parseFloat(course.attendancepercent) >= 80 ? '#dcfce7' : '#fed7aa',
                    color: course.attendancepercent === '—' ? '#64748b' :
                      parseFloat(course.attendancepercent) >= 80 ? '#166534' : '#9a3412',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: '600'
                  }}>
                    {course.attendancepercent}
                  </div>
                </div>
                <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '1rem'}}>
                  <div>
                    <div style={{fontSize: '0.8125rem', color: '#64748b', marginBottom: '0.25rem'}}>Held</div>
                    <div style={{fontSize: '1.5rem', fontWeight: '700', color: '#0f172a'}}>{course.totalsessions}</div>
                  </div>
                  <div>
                    <div style={{fontSize: '0.8125rem', color: '#64748b', marginBottom: '0.25rem'}}>Present</div>
                    <div style={{fontSize: '1.5rem', fontWeight: '700', color: '#059669'}}>{course.present}</div>
                  </div>
                  <div>
                    <div style={{fontSize: '0.8125rem', color: '#64748b', marginBottom: '0.25rem'}}>Late</div>
                    <div style={{fontSize: '1.5rem', fontWeight: '700', color: '#ca8a04'}}>{course.late}</div>
                  </div>
                  <div>
                    <div style={{fontSize: '0.8125rem', color: '#64748b', marginBottom: '0.25rem'}}>Absent</div>
                    <div style={{fontSize: '1.5rem', fontWeight: '700', color: '#dc2626'}}>{course.totaleffectiveabsent}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Justifications Section */}
        <div id="justifications" style={{scrollMarginTop: '5rem'}}>
          <h2 style={{fontSize: '1.5rem', fontWeight: '700', color: '#0f172a', marginBottom: '1.5rem'}}>
            Absence Justifications
          </h2>
          <JustificationForm studentId={studentId} />
        </div>
      </div>
    </div>
  );
}