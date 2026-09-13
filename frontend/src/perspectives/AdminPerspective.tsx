import { useState } from 'react';
import AdminStudentsTable from '../components/admin/AdminStudentsTable';
import AdminCoursesManager from '../components/admin/AdminCoursesManager';
import AdminJustificationReview from '../components/admin/AdminJustificationReview';
import AdminAbsencePool from '../components/admin/AdminAbsencePool';
import InformationPage from '../components/shared/InformationPage';

type Tab = 'students' | 'courses' | 'justifications' | 'absence-pool' | 'information';

export default function AdminPerspective() {
  const [activeTab, setActiveTab] = useState<Tab>('students');

  return (
    <div style={{minHeight: '100vh', backgroundColor: '#f8fafc'}}>
      {/* Top Navigation */}
      <div style={{backgroundColor: 'white', borderBottom: '1px solid #e2e8f0', position: 'sticky', top: 0, zIndex: 10}}>
        <div style={{maxWidth: '1400px', margin: '0 auto', padding: '1rem 1.25rem'}}>
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '2rem', flexWrap: 'wrap'}}>
            <div style={{display: 'flex', gap: '1.5rem'}}>
              <button
                onClick={() => setActiveTab('students')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 1rem',
                  color: activeTab === 'students' ? '#059669' : '#64748b',
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontWeight: '500',
                  fontSize: '0.9375rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  if (activeTab !== 'students') e.currentTarget.style.backgroundColor = '#f1f5f9';
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== 'students') e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <span>👥</span>
                <span>Students</span>
              </button>
              <button
                onClick={() => setActiveTab('courses')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 1rem',
                  color: activeTab === 'courses' ? '#059669' : '#64748b',
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontWeight: '500',
                  fontSize: '0.9375rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  if (activeTab !== 'courses') e.currentTarget.style.backgroundColor = '#f1f5f9';
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== 'courses') e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <span>📚</span>
                <span>Courses</span>
              </button>
              <button
                onClick={() => setActiveTab('justifications')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 1rem',
                  color: activeTab === 'justifications' ? '#059669' : '#64748b',
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontWeight: '500',
                  fontSize: '0.9375rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  if (activeTab !== 'justifications') e.currentTarget.style.backgroundColor = '#f1f5f9';
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== 'justifications') e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <span>📝</span>
                <span>Justifications</span>
              </button>
              <button
                onClick={() => setActiveTab('absence-pool')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 1rem',
                  color: activeTab === 'absence-pool' ? '#059669' : '#64748b',
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontWeight: '500',
                  fontSize: '0.9375rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  if (activeTab !== 'absence-pool') e.currentTarget.style.backgroundColor = '#f1f5f9';
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== 'absence-pool') e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <span>🚨</span>
                <span>Absence Pool</span>
              </button>
              <button
                onClick={() => setActiveTab('information')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 1rem',
                  color: activeTab === 'information' ? '#059669' : '#64748b',
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontWeight: '500',
                  fontSize: '0.9375rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  if (activeTab !== 'information') e.currentTarget.style.backgroundColor = '#f1f5f9';
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== 'information') e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <span>ℹ️</span>
                <span>Information</span>
              </button>
            </div>
            <a
              href="/"
              style={{
                padding: '0.5rem 1rem',
                color: '#64748b',
                backgroundColor: 'transparent',
                border: '1px solid #e2e8f0',
                borderRadius: '0.5rem',
                textDecoration: 'none',
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
              Switch Portal
            </a>
          </div>
        </div>
      </div>

      <div style={{maxWidth: '1400px', margin: '0 auto', padding: '2rem 1.25rem'}}>
        {/* Admin Info Card */}
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
              backgroundColor: '#05966915',
              borderRadius: '1rem',
              fontSize: '2rem',
              flexShrink: 0
            }}>
              🛡️
            </div>
            <div style={{flex: 1}}>
              <p style={{fontSize: '0.875rem', color: '#64748b', fontWeight: '500', marginBottom: '0.5rem'}}>
                Admin portal
              </p>
              <h1 style={{fontSize: '1.875rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.5rem'}}>
                Qubits Administration
              </h1>
              <p style={{fontSize: '0.9375rem', color: '#64748b'}}>
                Manage students, courses, and review absence justifications
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'students' && <AdminStudentsTable />}
        {activeTab === 'courses' && <AdminCoursesManager />}
        {activeTab === 'justifications' && <AdminJustificationReview />}
        {activeTab === 'absence-pool' && <AdminAbsencePool />}
        {activeTab === 'information' && <InformationPage isAdmin apiBase="/api/admin" />}
      </div>
    </div>
  );
}