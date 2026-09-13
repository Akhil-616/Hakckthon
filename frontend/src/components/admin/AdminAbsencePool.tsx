import { useState, useEffect } from 'react';

interface PoolEntry {
  studentid: string;
  studentname: string;
  sectioncode: string;
  moduleid: string;
  modulename: string;
  absentcount: number;
}

export default function AdminAbsencePool() {
  const [pool, setPool] = useState<PoolEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<Map<string, string>>(new Map());
  const [sending, setSending] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadPool();
  }, []);

  async function loadPool() {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/absence-pool');
      const data = await res.json();
      setPool(data);

      // Pre-fill default messages
      const defaultMessages = new Map<string, string>();
      for (const entry of data) {
        const key = `${entry.studentid}_${entry.moduleid}`;
        defaultMessages.set(key, `${entry.studentname} has been marked Absent ${entry.absentcount} times in ${entry.modulename}. Please ensure regular attendance going forward.`);
      }
      setMessages(defaultMessages);
    } catch (err) {
      console.error('Failed to load absence pool:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSend(entry: PoolEntry) {
    const key = `${entry.studentid}_${entry.moduleid}`;
    const messageText = messages.get(key) || '';
    if (!messageText.trim()) return;

    setSending(prev => new Set(prev).add(key));
    try {
      const res = await fetch('/api/admin/absence-pool/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: entry.studentid,
          moduleId: entry.moduleid,
          messageText: messageText.trim(),
          absentCountAtSend: entry.absentcount
        })
      });

      if (res.ok) {
        // Optimistic update: remove from pool
        setPool(prev => prev.filter(e => !(e.studentid === entry.studentid && e.moduleid === entry.moduleid)));
        setMessages(prev => {
          const updated = new Map(prev);
          updated.delete(key);
          return updated;
        });
      }
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setSending(prev => {
        const updated = new Set(prev);
        updated.delete(key);
        return updated;
      });
    }
  }

  function updateMessage(studentId: string, moduleId: string, text: string) {
    const key = `${studentId}_${moduleId}`;
    setMessages(prev => new Map(prev).set(key, text));
  }

  if (loading) {
    return <div style={{padding: '2rem', textAlign: 'center', color: '#64748b'}}>Loading absence pool...</div>;
  }

  return (
    <div style={{backgroundColor: 'white', borderRadius: '1rem', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', border: '1px solid #e2e8f0'}}>
      <h2 style={{fontSize: '1.25rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
        <span>🚨</span> Absence Pool
      </h2>
      <p style={{fontSize: '0.875rem', color: '#64748b', marginBottom: '1.5rem'}}>
        Students with 3+ absences who haven't been notified yet at their current absence level
      </p>

      {pool.length === 0 ? (
        <div style={{textAlign: 'center', padding: '2rem', color: '#64748b', backgroundColor: '#f8fafc', borderRadius: '0.5rem'}}>
          No students currently flagged
        </div>
      ) : (
        <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
          {pool.map(entry => {
            const key = `${entry.studentid}_${entry.moduleid}`;
            const messageText = messages.get(key) || '';
            const isSending = sending.has(key);

            return (
              <div key={key} style={{padding: '1rem', backgroundColor: '#fef2f2', borderRadius: '0.5rem', border: '1px solid #fecaca'}}>
                <div style={{display: 'flex', gap: '1rem', marginBottom: '0.75rem', flexWrap: 'wrap'}}>
                  <div style={{flex: '1 1 200px'}}>
                    <div style={{fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: '600', marginBottom: '0.125rem'}}>Student</div>
                    <div style={{fontWeight: '600', color: '#0f172a'}}>{entry.studentname}</div>
                    <div style={{fontSize: '0.8125rem', color: '#64748b'}}>{entry.studentid} • {entry.sectioncode}</div>
                  </div>
                  <div style={{flex: '1 1 200px'}}>
                    <div style={{fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: '600', marginBottom: '0.125rem'}}>Module</div>
                    <div style={{fontWeight: '600', color: '#0f172a'}}>{entry.modulename}</div>
                  </div>
                  <div style={{flex: '0 0 auto'}}>
                    <div style={{fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: '600', marginBottom: '0.125rem'}}>Absences</div>
                    <div style={{fontSize: '1.5rem', fontWeight: '700', color: '#dc2626'}}>{entry.absentcount}</div>
                  </div>
                </div>

                <textarea
                  value={messageText}
                  onChange={e => updateMessage(entry.studentid, entry.moduleid, e.target.value)}
                  disabled={isSending}
                  style={{width: '100%', padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '0.375rem', fontSize: '0.9375rem', minHeight: '4rem', marginBottom: '0.5rem', resize: 'vertical'}}
                />

                <button
                  onClick={() => handleSend(entry)}
                  disabled={isSending || !messageText.trim()}
                  style={{padding: '0.5rem 1rem', backgroundColor: '#dc2626', color: 'white', border: 'none', borderRadius: '0.375rem', fontWeight: '500', cursor: isSending || !messageText.trim() ? 'not-allowed' : 'pointer', opacity: isSending || !messageText.trim() ? 0.5 : 1, fontSize: '0.875rem'}}
                >
                  {isSending ? 'Sending...' : 'Send Message'}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
