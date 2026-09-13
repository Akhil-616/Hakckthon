import { useState } from 'react';
import { PortalSwitcher, type Portal } from './perspectives/PortalSwitcher';
import AdminPerspective from './perspectives/AdminPerspective';
import StudentPerspective from './perspectives/StudentPerspective';
import ParentPerspective from './perspectives/ParentPerspective';
import LandingHero from './components/landing/LandingHero';
import LandingFeatures from './components/landing/LandingFeatures';
import LandingFooter from './components/landing/LandingFooter';

export default function App() {
  const [portal, setPortal] = useState<Portal>();

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <button className="text-xl font-black" onClick={() => setPortal(undefined)}>
            Qubits
          </button>
          {portal && (
            <button className="text-sm text-slate-500" onClick={() => setPortal(undefined)}>
              Switch portal
            </button>
          )}
        </div>
      </header>
      {!portal ? (
        <>
          <LandingHero />
          <LandingFeatures />
          <div id="portals" style={{padding: '6rem 1.25rem', backgroundColor: '#f8fafc'}}>
            <div style={{maxWidth: '1200px', margin: '0 auto'}}>
              <h2 style={{fontSize: '2.25rem', fontWeight: '700', letterSpacing: '-0.02em', color: '#0f172a', marginBottom: '1rem'}}>
                Choose your portal
              </h2>
              <p style={{fontSize: '1rem', color: '#64748b', marginBottom: '3rem', maxWidth: '36rem'}}>
                Select the portal that matches your role to access attendance data and management tools.
              </p>
              <PortalSwitcher onSelect={setPortal} />
            </div>
          </div>
          <LandingFooter />
        </>
      ) : (
        <div className="mx-auto max-w-6xl px-5 py-10">
          {portal === 'admin' ? (
            <AdminPerspective />
          ) : portal === 'student' ? (
            <StudentPerspective />
          ) : (
            <ParentPerspective />
          )}
        </div>
      )}
    </div>
  );
}