import React from 'react';
import { useApp } from '../../context/AppContext';
import { Megaphone, Calendar } from 'lucide-react';

export const EmployeeNotices = () => {
  const { notices } = useApp();

  return (
    <div className="page-wrapper animate-fade-in" style={{ paddingBottom: '3rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Megaphone className="text-primary" /> Notice Board
        </h2>
        <p style={{ color: 'var(--text-muted)' }}>Latest updates and announcements from the company.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {notices.filter(n => n.isActive).map(notice => (
          <div key={notice.id} className="glass-card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--primary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>{notice.title}</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                <Calendar size={14} />
                {new Date(notice.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </div>
            </div>
            <div style={{ whiteSpace: 'pre-wrap', color: 'var(--text-main)', lineHeight: 1.6 }}>
              {notice.content}
            </div>
            <div style={{ marginTop: '1.5rem', fontSize: '0.85rem', color: 'var(--text-subtle)', fontStyle: 'italic' }}>
              Posted by {notice.author?.name || 'HR Administration'}
            </div>
          </div>
        ))}

        {notices.filter(n => n.isActive).length === 0 && (
          <div className="glass-card" style={{ padding: '4rem 2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            <Megaphone size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
            <h3 style={{ fontWeight: 700 }}>No New Notices</h3>
            <p>You're all caught up! There are no active announcements at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
};
