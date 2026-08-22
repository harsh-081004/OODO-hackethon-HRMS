import React, { useEffect, useRef, useState } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

// Animated count-up hook
function useCountUp(target, duration = 1200) {
  const [count, setCount] = useState(0);
  const startRef = useRef(null);

  useEffect(() => {
    const numTarget = parseFloat(String(target).replace(/[^0-9.]/g, '')) || 0;
    const prefix = String(target).match(/^[^0-9]*/)?.[0] || '';
    const suffix = String(target).match(/[^0-9.]*$/)?.[0] || '';

    const animate = (timestamp) => {
      if (!startRef.current) startRef.current = timestamp;
      const progress = Math.min((timestamp - startRef.current) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
      setCount(prefix + Math.floor(eased * numTarget) + suffix);
      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
    return () => { startRef.current = null; };
  }, [target, duration]);

  return count;
}

export const StatCard = ({ title, value, subtitle, icon: Icon, color = 'var(--primary)', trend, badge }) => {
  const animatedValue = useCountUp(value);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="stat-card-3d holographic animate-fade-in-up"
      style={{ '--accent-color': color }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Top Row: Title & Icon */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div style={{ flex: 1 }}>
          <span style={{
            fontSize: '0.72rem',
            fontWeight: 700,
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            display: 'block',
            marginBottom: '0.5rem'
          }}>
            {title}
          </span>

          {/* Animated value */}
          <div style={{
            fontSize: '2rem',
            fontWeight: 900,
            fontFamily: 'Outfit, sans-serif',
            color: color,
            lineHeight: 1,
            transition: 'color 0.3s ease',
            textShadow: isHovered ? `0 0 20px ${color}55` : 'none'
          }}>
            {animatedValue}
          </div>
        </div>

        {Icon && (
          <div style={{
            width: '3.25rem',
            height: '3.25rem',
            borderRadius: 'var(--radius-md)',
            background: `color-mix(in srgb, ${color} 12%, transparent)`,
            border: `1px solid color-mix(in srgb, ${color} 25%, transparent)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: color,
            flexShrink: 0,
            boxShadow: isHovered ? `0 4px 16px ${color}40` : `0 2px 8px ${color}20`,
            transition: 'all 0.3s ease',
            transform: isHovered ? 'scale(1.05)' : 'scale(1)'
          }}>
            <Icon size={22} strokeWidth={2} />
          </div>
        )}
      </div>

      {/* Progress bar (optional — shows at 60% by default for visual richness) */}
      <div className="progress-track" style={{ marginBottom: '0.85rem' }}>
        <div
          className="progress-fill"
          style={{
            width: isHovered ? '80%' : '60%',
            background: `linear-gradient(90deg, ${color}, color-mix(in srgb, ${color} 60%, var(--secondary)))`,
            transition: 'width 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
        />
      </div>

      {/* Bottom Row: Subtitle, Badge, Trend */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', flexWrap: 'wrap' }}>
        {subtitle && (
          <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem', flex: 1 }}>
            {subtitle}
          </span>
        )}
        {badge && (
          <span className="badge badge-primary" style={{ fontSize: '0.65rem' }}>
            {badge}
          </span>
        )}
        {trend && (
          <span style={{
            color: trend.isPositive ? 'var(--success)' : 'var(--danger)',
            fontWeight: 700,
            fontSize: '0.78rem',
            display: 'flex',
            alignItems: 'center',
            gap: '3px',
            background: trend.isPositive ? 'var(--success-light)' : 'var(--danger-light)',
            padding: '2px 8px',
            borderRadius: 'var(--radius-full)'
          }}>
            {trend.isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {trend.text}
          </span>
        )}
      </div>
    </div>
  );
};
