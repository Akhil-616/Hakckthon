import type { ParentDashboard as DashboardData } from '../../types/canonical';
import AttendanceSummaryCards from '../shared/AttendanceSummaryCards';
import InformationPage from '../shared/InformationPage';

interface ParentDashboardProps {
  data: DashboardData;
  onLogout: () => void;
}

export default function ParentDashboard({ data, onLogout }: ParentDashboardProps) {
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
        {/* Parent & Student Info Card */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '1rem',
          padding: '2rem',
          marginBottom: '2rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{display: 'flex', alignItems: 'flex-start', gap: '1.5rem', flexWrap: 'wrap'}}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '4rem',
              height: '4rem',
              backgroundColor: '#8b5cf615',
              borderRadius: '1rem',
              fontSize: '2rem',
              flexShrink: 0
            }}>
              👨‍👩‍👧
            </div>
            <div style={{flex: 1}}>
              <h1 style={{fontSize: '1.875rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.5rem'}}>
                {data.parent.parentname}
              </h1>
              <p style={{fontSize: '1rem', color: '#8b5cf6', fontWeight: '600', marginBottom: '0.75rem'}}>
                {data.parent.relationtostudent} of {data.student.studentname}
              </p>
              <div style={{display: 'grid', gap: '0.5rem', fontSize: '0.9375rem', color: '#64748b'}}>
                <div style={{display: 'flex', gap: '2rem', flexWrap: 'wrap'}}>
                  <span><strong style={{color: '#475569'}}>Student ID:</strong> {data.student.studentid}</span>
                  <span><strong style={{color: '#475569'}}>Year:</strong> {data.student.year}</span>
                  <span><strong style={{color: '#475569'}}>Section:</strong> {data.student.sectioncode}</span>
                </div>
                <div><strong style={{color: '#475569'}}>Programme:</strong> {data.student.programmename}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Important Messages Section */}
        <div style={{marginBottom: '2rem'}}>
          <InformationPage studentId={data.student.studentid} apiBase={`/api/parents/${data.student.studentid}`} />
        </div>

        {/* Overview Section */}
        <div id="overview" style={{scrollMarginTop: '5rem', marginBottom: '3rem'}}>
          <h2 style={{fontSize: '1.5rem', fontWeight: '700', color: '#0f172a', marginBottom: '1.5rem'}}>
            Attendance Overview
          </h2>
          <AttendanceSummaryCards overall={data.overall} />
        </div>

        {/* Courses Section with Visual Charts */}
        <div id="courses" style={{scrollMarginTop: '5rem'}}>
          <h2 style={{fontSize: '1.5rem', fontWeight: '700', color: '#0f172a', marginBottom: '1.5rem'}}>
            Course Performance
          </h2>
          <div style={{display: 'grid', gap: '1rem'}}>
            {data.courses.map((course) => {
              const attendancePercent = course.attendancepercent === '—' ? 0 : parseFloat(course.attendancepercent);
              const presentPercent = course.totalsessions > 0 ? (course.present / course.totalsessions) * 100 : 0;
              const latePercent = course.totalsessions > 0 ? (course.late / course.totalsessions) * 100 : 0;
              const absentPercent = course.totalsessions > 0 ? (course.totaleffectiveabsent / course.totalsessions) * 100 : 0;

              return (
                <div
                  key={course.moduleid}
                  style={{
                    backgroundColor: 'white',
                    borderRadius: '1rem',
                    padding: '1.5rem',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
                  }}
                >
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap'}}>
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
                      backgroundColor: attendancePercent >= 80 ? '#dcfce7' : attendancePercent >= 60 ? '#fed7aa' : '#fee2e2',
                      color: attendancePercent >= 80 ? '#166534' : attendancePercent >= 60 ? '#9a3412' : '#991b1b',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      fontWeight: '600'
                    }}>
                      {course.attendancepercent}
                    </div>
                  </div>

                  <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem'}}>
                    {/* Stats */}
                    <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem'}}>
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

                    {/* Visual Chart */}
                    <div>
                      <div style={{fontSize: '0.8125rem', color: '#64748b', marginBottom: '0.75rem', fontWeight: '600'}}>
                        Attendance Breakdown
                      </div>
                      <div style={{
                        height: '1.5rem',
                        backgroundColor: '#f1f5f9',
                        borderRadius: '0.75rem',
                        overflow: 'hidden',
                        display: 'flex',
                        marginBottom: '0.75rem'
                      }}>
                        {presentPercent > 0 && (
                          <div style={{
                            width: `${presentPercent}%`,
                            backgroundColor: '#10b981',
                            transition: 'width 0.5s ease'
                          }} />
                        )}
                        {latePercent > 0 && (
                          <div style={{
                            width: `${latePercent}%`,
                            backgroundColor: '#fbbf24',
                            transition: 'width 0.5s ease'
                          }} />
                        )}
                        {absentPercent > 0 && (
                          <div style={{
                            width: `${absentPercent}%`,
                            backgroundColor: '#ef4444',
                            transition: 'width 0.5s ease'
                          }} />
                        )}
                      </div>
                      <div style={{display: 'flex', gap: '1rem', flexWrap: 'wrap', fontSize: '0.8125rem'}}>
                        <div style={{display: 'flex', alignItems: 'center', gap: '0.375rem'}}>
                          <div style={{width: '0.75rem', height: '0.75rem', backgroundColor: '#10b981', borderRadius: '0.125rem'}} />
                          <span style={{color: '#64748b'}}>Present ({presentPercent.toFixed(0)}%)</span>
                        </div>
                        <div style={{display: 'flex', alignItems: 'center', gap: '0.375rem'}}>
                          <div style={{width: '0.75rem', height: '0.75rem', backgroundColor: '#fbbf24', borderRadius: '0.125rem'}} />
                          <span style={{color: '#64748b'}}>Late ({latePercent.toFixed(0)}%)</span>
                        </div>
                        <div style={{display: 'flex', alignItems: 'center', gap: '0.375rem'}}>
                          <div style={{width: '0.75rem', height: '0.75rem', backgroundColor: '#ef4444', borderRadius: '0.125rem'}} />
                          <span style={{color: '#64748b'}}>Absent ({absentPercent.toFixed(0)}%)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}