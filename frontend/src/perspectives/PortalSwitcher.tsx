export type Portal = 'admin' | 'student' | 'parent';

export function PortalSwitcher({ onSelect }: { onSelect: (portal: Portal) => void }) {
  const portals = [
    {
      id: 'student',
      title: 'Student Portal',
      description: 'Check your attendance records and submit justifications for absences.',
      icon: '📚',
      color: '#3b82f6'
    },
    {
      id: 'parent',
      title: 'Parent Portal',
      description: 'Monitor your child\'s attendance and view detailed reports.',
      icon: '👨‍👩‍👧',
      color: '#8b5cf6'
    },
    {
      id: 'admin',
      title: 'Admin Portal',
      description: 'Manage students, courses, attendance records, and review justifications.',
      icon: '⚙️',
      color: '#059669'
    }
  ];

  return (
    <div style={{display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))'}}>
      {portals.map((portal) => (
        <button
          key={portal.id}
          onClick={() => onSelect(portal.id as Portal)}
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            padding: '2rem',
            backgroundColor: 'white',
            border: '1px solid #e2e8f0',
            borderRadius: '1rem',
            textAlign: 'left',
            cursor: 'pointer',
            transition: 'all 0.2s',
            overflow: 'hidden'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = portal.color;
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.08)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#e2e8f0';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '3.5rem',
            height: '3.5rem',
            backgroundColor: `${portal.color}15`,
            borderRadius: '0.75rem',
            fontSize: '1.5rem',
            marginBottom: '1.25rem'
          }}>
            {portal.icon}
          </div>
          <h3 style={{
            fontSize: '1.25rem',
            fontWeight: '700',
            color: '#0f172a',
            marginBottom: '0.5rem'
          }}>
            {portal.title}
          </h3>
          <p style={{
            fontSize: '0.9375rem',
            lineHeight: '1.5',
            color: '#64748b',
            marginBottom: '1rem'
          }}>
            {portal.description}
          </p>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.875rem',
            fontWeight: '600',
            color: portal.color,
            marginTop: 'auto'
          }}>
            Access Portal
            <span style={{fontSize: '1rem'}}>→</span>
          </div>
        </button>
      ))}
    </div>
  );
}