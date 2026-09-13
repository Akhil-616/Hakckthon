import { useState, useEffect } from 'react';

interface Event {
  eventid: string;
  title: string;
  description: string;
  eventdate?: string;
  postedat: string;
}

interface ImportantMessage {
  messageid: string;
  modulename: string;
  messagetext: string;
  absentcountatsend: number;
  sentat: string;
  acknowledged: boolean;
}

interface InformationPageProps {
  studentId?: string;
  isAdmin?: boolean;
  apiBase: string; // '/api/admin', '/api/students/:id', or '/api/parents/:id'
}

export default function InformationPage({ studentId, isAdmin, apiBase }: InformationPageProps) {
  const [events, setEvents] = useState<Event[]>([]);
  const [messages, setMessages] = useState<ImportantMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [newEvent, setNewEvent] = useState({ title: '', description: '', eventdate: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, [studentId]);

  async function loadData() {
    setLoading(true);
    try {
      const eventsRes = await fetch('/api/admin/events');
      const eventsData = await eventsRes.json();
      setEvents(eventsData);

      if (studentId) {
        const messagesRes = await fetch(`${apiBase}/messages`);
        const messagesData = await messagesRes.json();
        setMessages(messagesData);
      }
    } catch (err) {
      console.error('Failed to load information:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateEvent(e: React.FormEvent) {
    e.preventDefault();
    if (!newEvent.title.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/admin/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newEvent.title.trim(),
          description: newEvent.description.trim() || null,
          eventdate: newEvent.eventdate || null
        })
      });
      if (res.ok) {
        setNewEvent({ title: '', description: '', eventdate: '' });
        loadData();
      }
    } catch (err) {
      console.error('Failed to create event:', err);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDeleteEvent(eventId: string) {
    try {
      const res = await fetch(`/api/admin/events/${eventId}`, { method: 'DELETE' });
      if (res.ok) loadData();
    } catch (err) {
      console.error('Failed to delete event:', err);
    }
  }

  async function markAsRead(messageId: string) {
    try {
      await fetch(`${apiBase}/messages/${messageId}/read`, { method: 'PATCH' });
      setMessages(prev => prev.map(m => m.messageid === messageId ? { ...m, acknowledged: true } : m));
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  }

  function timeAgo(dateStr: string) {
    const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  }

  if (loading) {
    return <div style={{padding: '2rem', textAlign: 'center', color: '#64748b'}}>Loading information...</div>;
  }

  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: '2rem'}}>
      {/* EVENTS SECTION */}
      <div style={{backgroundColor: 'white', borderRadius: '1rem', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', border: '1px solid #e2e8f0'}}>
        <h2 style={{fontSize: '1.25rem', fontWeight: '700', color: '#0f172a', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
          <span>📅</span> Events
        </h2>

        {isAdmin && (
          <form onSubmit={handleCreateEvent} style={{marginBottom: '1.5rem', padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '0.5rem'}}>
            <input
              type="text"
              placeholder="Event title"
              value={newEvent.title}
              onChange={e => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
              style={{width: '100%', padding: '0.5rem', marginBottom: '0.5rem', border: '1px solid #e2e8f0', borderRadius: '0.375rem', fontSize: '0.9375rem'}}
              disabled={submitting}
            />
            <textarea
              placeholder="Description (optional)"
              value={newEvent.description}
              onChange={e => setNewEvent(prev => ({ ...prev, description: e.target.value }))}
              style={{width: '100%', padding: '0.5rem', marginBottom: '0.5rem', border: '1px solid #e2e8f0', borderRadius: '0.375rem', fontSize: '0.9375rem', minHeight: '4rem', resize: 'vertical'}}
              disabled={submitting}
            />
            <div style={{display: 'flex', gap: '0.5rem', alignItems: 'center'}}>
              <input
                type="date"
                value={newEvent.eventdate}
                onChange={e => setNewEvent(prev => ({ ...prev, eventdate: e.target.value }))}
                style={{padding: '0.5rem', border: '1px solid #e2e8f0', borderRadius: '0.375rem', fontSize: '0.9375rem'}}
                disabled={submitting}
              />
              <button
                type="submit"
                disabled={!newEvent.title.trim() || submitting}
                style={{padding: '0.5rem 1rem', backgroundColor: '#059669', color: 'white', border: 'none', borderRadius: '0.375rem', fontWeight: '500', cursor: submitting || !newEvent.title.trim() ? 'not-allowed' : 'pointer', opacity: submitting || !newEvent.title.trim() ? 0.5 : 1}}
              >
                {submitting ? 'Creating...' : 'Create Event'}
              </button>
            </div>
          </form>
        )}

        {events.length === 0 ? (
          <p style={{color: '#64748b', textAlign: 'center', padding: '1rem'}}>No events posted yet</p>
        ) : (
          <div style={{display: 'flex', flexDirection: 'column', gap: '0.75rem'}}>
            {events.map(event => (
              <div key={event.eventid} style={{padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '0.5rem', border: '1px solid #e2e8f0'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: '1rem'}}>
                  <div style={{flex: 1}}>
                    <div style={{fontWeight: '600', color: '#0f172a', marginBottom: '0.25rem'}}>{event.title}</div>
                    {event.description && <p style={{fontSize: '0.9375rem', color: '#64748b', marginBottom: '0.5rem'}}>{event.description}</p>}
                    <div style={{fontSize: '0.8125rem', color: '#94a3b8'}}>
                      {event.eventdate && <span>📆 {new Date(event.eventdate).toLocaleDateString()} • </span>}
                      Posted {timeAgo(event.postedat)}
                    </div>
                  </div>
                  {isAdmin && (
                    <button
                      onClick={() => handleDeleteEvent(event.eventid)}
                      style={{padding: '0.25rem 0.5rem', fontSize: '0.8125rem', color: '#dc2626', backgroundColor: 'transparent', border: '1px solid #fecaca', borderRadius: '0.25rem', cursor: 'pointer'}}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* IMPORTANT MESSAGES SECTION (student/parent only) */}
      {studentId && (
        <div style={{backgroundColor: 'white', borderRadius: '1rem', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', border: '1px solid #e2e8f0'}}>
          <h2 style={{fontSize: '1.25rem', fontWeight: '700', color: '#0f172a', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
            <span>⚠️</span> Important Messages
          </h2>

          {messages.length === 0 ? (
            <p style={{color: '#64748b', textAlign: 'center', padding: '1rem'}}>No important messages</p>
          ) : (
            <div style={{display: 'flex', flexDirection: 'column', gap: '0.75rem'}}>
              {messages.map(msg => (
                <div key={msg.messageid} style={{padding: '1rem', backgroundColor: msg.acknowledged ? '#f8fafc' : '#fef3c7', borderRadius: '0.5rem', border: `1px solid ${msg.acknowledged ? '#e2e8f0' : '#fcd34d'}`}}>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: '1rem'}}>
                    <div style={{flex: 1}}>
                      <div style={{fontWeight: '600', color: '#0f172a', marginBottom: '0.25rem', fontSize: '0.875rem'}}>{msg.modulename}</div>
                      <p style={{fontSize: '0.9375rem', color: '#334155', marginBottom: '0.5rem'}}>{msg.messagetext}</p>
                      <div style={{fontSize: '0.8125rem', color: '#94a3b8'}}>
                        Sent {timeAgo(msg.sentat)}
                      </div>
                    </div>
                    {!msg.acknowledged && apiBase.includes('/students/') && (
                      <button
                        onClick={() => markAsRead(msg.messageid)}
                        style={{padding: '0.25rem 0.5rem', fontSize: '0.8125rem', color: '#059669', backgroundColor: 'transparent', border: '1px solid #059669', borderRadius: '0.25rem', cursor: 'pointer', whiteSpace: 'nowrap'}}
                      >
                        Mark as read
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
