export default function LandingHero() {
  return (
    <section style={{minHeight: '100dvh', display: 'flex', alignItems: 'center', paddingTop: '4rem', paddingBottom: '4rem'}}>
      <div style={{maxWidth: '1200px', margin: '0 auto', width: '100%', padding: '0 1.25rem'}}>
        <div style={{display: 'grid', gap: '3rem', gridTemplateColumns: '1fr', alignItems: 'center'}}>
          <div style={{maxWidth: '42rem'}}>
            <p style={{fontSize: '0.8125rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#059669', marginBottom: '1rem'}}>
              Islington College
            </p>
            <h1 style={{fontSize: '3rem', fontWeight: '800', lineHeight: '1.1', letterSpacing: '-0.02em', color: '#0f172a', marginBottom: '1.5rem'}}>
              Attendance tracking that respects your time
            </h1>
            <p style={{fontSize: '1.125rem', lineHeight: '1.7', color: '#64748b', maxWidth: '36rem', marginBottom: '2rem'}}>
              Real-time attendance monitoring for students, transparent reporting for parents, efficient management for administrators.
            </p>
            <div style={{display: 'flex', gap: '1rem', flexWrap: 'wrap'}}>
              <a
                href="#portals"
                style={{
                  display: 'inline-block',
                  padding: '0.875rem 2rem',
                  backgroundColor: '#059669',
                  color: 'white',
                  borderRadius: '0.5rem',
                  fontWeight: '600',
                  fontSize: '1rem',
                  textDecoration: 'none',
                  transition: 'background-color 0.2s',
                  border: 'none',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#047857'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#059669'}
              >
                Get Started
              </a>
              <a
                href="#features"
                style={{
                  display: 'inline-block',
                  padding: '0.875rem 2rem',
                  backgroundColor: 'white',
                  color: '#0f172a',
                  borderRadius: '0.5rem',
                  fontWeight: '600',
                  fontSize: '1rem',
                  textDecoration: 'none',
                  border: '1px solid #e2e8f0',
                  cursor: 'pointer',
                  transition: 'border-color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = '#cbd5e1'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
