import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { SignIn } from './SignIn';
import { SignUp } from './SignUp';
import { FirstTimePasswordModal } from './FirstTimePasswordModal';
import { useApp } from '../../context/AppContext';
import { Moon, Sun } from 'lucide-react';

// Animated canvas particle mesh
const ParticleCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let W = canvas.width = window.innerWidth;
    let H = canvas.height = window.innerHeight;

    const PARTICLE_COUNT = 60;
    const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 2 + 1,
    }));

    let rafId;

    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      // Draw connection lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(113, 75, 103, ${0.15 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      // Draw particles
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(113, 75, 103, 0.35)';
        ctx.fill();

        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
      });

      rafId = requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
        opacity: 0.6
      }}
    />
  );
};

export const AuthLayout = () => {
  const { theme, toggleTheme, company } = useApp();
  const [firstTimeUser, setFirstTimeUser] = useState(null);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: theme === 'dark'
        ? 'radial-gradient(ellipse at 15% 25%, rgba(113, 75, 103, 0.2) 0%, transparent 50%), radial-gradient(ellipse at 85% 75%, rgba(0, 135, 132, 0.15) 0%, transparent 50%), var(--bg-app)'
        : 'radial-gradient(ellipse at 15% 25%, rgba(113, 75, 103, 0.08) 0%, transparent 50%), radial-gradient(ellipse at 85% 75%, rgba(0, 135, 132, 0.06) 0%, transparent 50%), var(--bg-app)',
      position: 'relative',
      overflow: 'hidden'
    }}>

      {/* Animated particle mesh background */}
      <ParticleCanvas />

      {/* Floating ambient orbs */}
      <div className="auth-bg">
        <div className="auth-orb auth-orb-1" />
        <div className="auth-orb auth-orb-2" />
        <div className="auth-orb auth-orb-3" />
      </div>

      {/* Header bar */}
      <header className="navbar-glass" style={{
        padding: '1rem 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
        zIndex: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <img src="/casepoint-logo.png" alt="Case Point" style={{ height: '2.6rem', objectFit: 'contain' }} />

          <div>
            <h1 className="gradient-text" style={{ fontSize: '1.25rem', fontWeight: 900, lineHeight: 1.1 }}>
              Case Point HRMS
            </h1>
            <div style={{ marginTop: '0.2rem', color: 'var(--text-subtle)', fontSize: '0.875rem' }}>
              Human Resource Management
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <button onClick={toggleTheme} className="btn-icon" title="Toggle theme">
            {theme === 'dark' ? <Sun size={17} color="#f59e0b" /> : <Moon size={17} color="var(--primary)" />}
          </button>
        </div>
      </header>

      {/* Main content area */}
      <main style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1.5rem',
        flexDirection: 'column',
        position: 'relative',
        zIndex: 10
      }}>

        {/* Animated heading */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }} className="animate-fade-in-up">
          <h2 style={{
            fontSize: '2.25rem',
            fontWeight: 900,
            letterSpacing: '-0.04em',
            background: 'linear-gradient(135deg, var(--text-main) 20%, var(--primary) 60%, var(--secondary) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            lineHeight: 1.1,
          }}>
            Human Resource<br />Management System
          </h2>
        </div>

        {/* Auth Card */}
        <div className="animate-fade-in-up" style={{ animationDelay: '0.1s', width: '100%', display: 'flex', justifyContent: 'center' }}>
          <Routes>
            <Route path="/" element={<SignIn onFirstTimeLoginPrompt={(user) => setFirstTimeUser(user)} />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </main>

      {/* First-time password modal */}
      {firstTimeUser && (
        <FirstTimePasswordModal
          user={firstTimeUser}
          onClose={() => setFirstTimeUser(null)}
        />
      )}

      {/* Footer */}
      <footer style={{ position: 'absolute', bottom: '1.5rem', width: '100%', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
        Case Point HRMS v2.0 • Full-Stack Node.js + MongoDB + React
      </footer>
    </div>
  );
};
