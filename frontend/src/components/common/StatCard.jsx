import React from 'react';

export const StatCard = ({ title, value, subtitle, icon: Icon, color = 'var(--primary)', trend, badge }) => {
  return (
    <div className="glass-card glass-card-hover" style={{ padding: '1.4rem' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
        <div>
          <span style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            {title}
          </span>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, marginTop: '0.2rem', fontFamily: 'Outfit, sans-serif' }}>
            {value}
          </div>
        </div>
        {Icon && (
          <div style={{
            width: '3rem',
            height: '3rem',
            borderRadius: 'var(--radius-md)',
            background: `color-mix(in srgb, ${color} 15%, transparent)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: color,
            flexShrink: 0
          }}>
            <Icon size={22} />
          </div>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem' }}>
        {subtitle && (
          <span style={{ color: 'var(--text-muted)' }}>
            {subtitle}
          </span>
        )}
        {badge && (
          <span className="badge badge-primary">
            {badge}
          </span>
        )}
        {trend && (
          <span style={{
            color: trend.isPositive ? 'var(--success)' : 'var(--danger)',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '2px'
          }}>
            {trend.isPositive ? '↑' : '↓'} {trend.text}
          </span>
        )}
      </div>
    </div>
  );
};
