import type { OverallAttendance } from '../../types/canonical';
import StatusBadge from './StatusBadge';
import { getAttendanceStatus } from '../../lib/constants';

interface AttendanceSummaryCardsProps {
  overall: OverallAttendance;
  totalSemesterClasses?: number;
  classesYouCanStillMiss?: number;
}

export default function AttendanceSummaryCards({ overall, totalSemesterClasses, classesYouCanStillMiss }: AttendanceSummaryCardsProps) {
  const percentStatus = getAttendanceStatus(overall.attendancePercent);

  const stats = [
    {
      label: 'Total This Semester',
      value: totalSemesterClasses,
      icon: '📅',
      color: '#64748b',
      bgColor: '#f1f5f9'
    },
    {
      label: 'Classes Held',
      value: overall.totalHeld,
      icon: '🏫',
      color: '#3b82f6',
      bgColor: '#dbeafe'
    },
    {
      label: 'Present',
      value: overall.totalPresent,
      icon: '✓',
      color: '#059669',
      bgColor: '#d1fae5'
    },
    {
      label: 'Late',
      value: overall.totalLate,
      icon: '⏰',
      color: '#ca8a04',
      bgColor: '#fef3c7'
    },
    {
      label: 'Absent',
      value: overall.totalAbsent,
      icon: '✗',
      color: '#dc2626',
      bgColor: '#fee2e2'
    },
    {
      label: 'Can Still Miss',
      value: classesYouCanStillMiss,
      icon: classesYouCanStillMiss && classesYouCanStillMiss > 0 ? '🟢' : '🔴',
      color: classesYouCanStillMiss && classesYouCanStillMiss > 0 ? '#059669' : '#dc2626',
      bgColor: classesYouCanStillMiss && classesYouCanStillMiss > 0 ? '#d1fae5' : '#fee2e2'
    }
  ].filter(stat => stat.value !== undefined);

  return (
    <div>
      {/* Main Attendance Card */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '1rem',
        padding: '2rem',
        marginBottom: '1.5rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        border: '1px solid #e2e8f0'
      }}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem'}}>
          <div>
            <h3 style={{fontSize: '1.125rem', fontWeight: '600', color: '#64748b', marginBottom: '0.5rem'}}>
              Overall Attendance Rate
            </h3>
            <div style={{display: 'flex', alignItems: 'baseline', gap: '0.75rem'}}>
              <span style={{fontSize: '3rem', fontWeight: '700', color: '#0f172a', lineHeight: 1}}>
                {overall.attendancePercent.toFixed(1)}%
              </span>
              <StatusBadge status={percentStatus} />
            </div>
          </div>
          <div style={{
            width: '6rem',
            height: '6rem',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <svg width="96" height="96" viewBox="0 0 96 96" style={{transform: 'rotate(-90deg)'}}>
              <circle
                cx="48"
                cy="48"
                r="40"
                fill="none"
                stroke="#e2e8f0"
                strokeWidth="8"
              />
              <circle
                cx="48"
                cy="48"
                r="40"
                fill="none"
                stroke={overall.attendancePercent >= 80 ? '#059669' : '#f59e0b'}
                strokeWidth="8"
                strokeDasharray={`${2 * Math.PI * 40}`}
                strokeDashoffset={`${2 * Math.PI * 40 * (1 - Math.min(overall.attendancePercent, 100) / 100)}`}
                strokeLinecap="round"
                style={{transition: 'stroke-dashoffset 0.5s ease'}}
              />
            </svg>
            <div style={{
              position: 'absolute',
              fontSize: '1.5rem'
            }}>
              {overall.attendancePercent >= 80 ? '✓' : '⚠'}
            </div>
          </div>
        </div>

        {/* Progress Bar Alternative */}
        <div style={{marginBottom: '0.75rem'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', color: '#64748b', marginBottom: '0.5rem'}}>
            <span>Progress towards 80% minimum</span>
            <span>{overall.totalPresent + overall.totalLate} / {overall.totalHeld}</span>
          </div>
          <div style={{
            width: '100%',
            height: '0.75rem',
            backgroundColor: '#f1f5f9',
            borderRadius: '999px',
            overflow: 'hidden'
          }}>
            <div style={{
              height: '100%',
              width: `${Math.min(overall.attendancePercent, 100)}%`,
              background: overall.attendancePercent >= 80
                ? 'linear-gradient(90deg, #059669 0%, #10b981 100%)'
                : 'linear-gradient(90deg, #f59e0b 0%, #fbbf24 100%)',
              borderRadius: '999px',
              transition: 'width 0.5s ease'
            }} />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
        gap: '1rem'
      }}>
        {stats.map((stat) => (
          <div
            key={stat.label}
            style={{
              backgroundColor: 'white',
              borderRadius: '1rem',
              padding: '1.5rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
              border: '1px solid #e2e8f0',
              transition: 'transform 0.2s, box-shadow 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.12)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.08)';
            }}
          >
            <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem'}}>
              <div style={{
                width: '2.5rem',
                height: '2.5rem',
                backgroundColor: stat.bgColor,
                borderRadius: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.25rem'
              }}>
                {stat.icon}
              </div>
              <div style={{fontSize: '0.8125rem', color: '#64748b', fontWeight: '500', lineHeight: 1.3}}>
                {stat.label}
              </div>
            </div>
            <div style={{fontSize: '2rem', fontWeight: '700', color: stat.color, lineHeight: 1}}>
              {stat.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}