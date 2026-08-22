import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, XCircle, X } from 'lucide-react';

export const ToastContainer = () => {
  const { toasts, removeToast } = useApp();

  if (!toasts.length) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '1.5rem',
      right: '1.5rem',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem',
      maxWidth: '380px',
      width: '100%',
      pointerEvents: 'none'
    }}>
      {toasts.map(toast => {
        let Icon = Info;
        let colorClass = 'var(--info)';
        let bgStyle = 'var(--bg-card)';
        
        if (toast.type === 'success') {
          Icon = CheckCircle2;
          colorClass = 'var(--success)';
        } else if (toast.type === 'danger') {
          Icon = XCircle;
          colorClass = 'var(--danger)';
        } else if (toast.type === 'warning') {
          Icon = AlertCircle;
          colorClass = 'var(--warning)';
        }

        return (
          <div
            key={toast.id}
            className="animate-fade-in glass-card"
            style={{
              padding: '1rem',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.75rem',
              pointerEvents: 'auto',
              borderLeft: `4px solid ${colorClass}`,
              boxShadow: 'var(--shadow-xl)',
              background: bgStyle
            }}
          >
            <Icon size={20} style={{ color: colorClass, flexShrink: 0, marginTop: '2px' }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.15rem' }}>
                {toast.title}
              </div>
              {toast.message && (
                <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)', wordBreak: 'break-word' }}>
                  {toast.message}
                </div>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-subtle)',
                cursor: 'pointer',
                padding: '2px',
                borderRadius: '4px',
                display: 'flex'
              }}
            >
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
