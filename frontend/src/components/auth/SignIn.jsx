import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Eye, EyeOff, Lock, User, ShieldCheck, ArrowRight, Sparkles, Building2 } from 'lucide-react';

export const SignIn = ({ onSwitchToSignUp, onFirstTimeLoginPrompt }) => {
  const { login, company, employees } = useApp();
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!loginId.trim() || !password) {
      setError('Please fill in all credentials.');
      return;
    }
    setError('');
    setLoading(true);

    setTimeout(() => {
      const res = login(loginId, password);
      setLoading(false);
      if (!res.success) {
        setError(res.error === 'User not found' ? 'No user found with this Login ID / Email.' : 'Invalid password.');
      } else if (res.isFirstLogin) {
        onFirstTimeLoginPrompt && onFirstTimeLoginPrompt(res.user);
      }
    }, 400);
  };

  // Demo 1-click accounts helper
  const handleQuickLogin = (emp) => {
    setLoginId(emp.loginId);
    setPassword(emp.password || 'Password@123');
    login(emp.loginId, emp.password || 'Password@123');
  };

  return (
    <div className="glass-card animate-fade-in" style={{
      width: '100%',
      maxWidth: '460px',
      padding: '2.5rem 2rem',
      background: 'var(--bg-card-glass)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-xl)',
      boxShadow: 'var(--shadow-xl)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative top accent glow */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        background: 'linear-gradient(90deg, var(--primary), var(--secondary), var(--accent-purple))'
      }} />

      {/* App / Web Logo Container matching wireframe */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '0.75rem 1.5rem',
          background: 'var(--bg-hover)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-subtle)',
          marginBottom: '1rem'
        }}>
          <div style={{
            width: '2.5rem',
            height: '2.5rem',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, var(--primary) 0%, #875A7B 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 800,
            fontSize: '1.25rem',
            boxShadow: '0 4px 10px var(--primary-glow)'
          }}>
            {company.code || 'OI'}
          </div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontWeight: 800, fontSize: '1.15rem', color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
              {company.name || 'Dayflow HRMS'}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Human Resource Management System
            </div>
          </div>
        </div>

        <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Sign In</h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
          Access your employee portal & workforce management
        </p>
      </div>

      {error && (
        <div style={{
          padding: '0.75rem 1rem',
          borderRadius: 'var(--radius-md)',
          background: 'var(--danger-light)',
          color: 'var(--danger)',
          fontSize: '0.85rem',
          fontWeight: 600,
          marginBottom: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <span>⚠️</span> {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Login ID / Email */}
        <div className="form-group">
          <label className="form-label" htmlFor="loginId">
            <span>Login Id / Email</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>
              e.g. {company.code}JODO20220001
            </span>
          </label>
          <div style={{ position: 'relative' }}>
            <User size={18} style={{
              position: 'absolute',
              left: '1rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-subtle)'
            }} />
            <input
              id="loginId"
              type="text"
              className="form-input font-mono"
              style={{ paddingLeft: '2.75rem' }}
              placeholder="e.g. OIJODO20220001 or name@odoo.com"
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Password */}
        <div className="form-group">
          <label className="form-label" htmlFor="password">
            <span>Password</span>
          </label>
          <div style={{ position: 'relative' }}>
            <Lock size={18} style={{
              position: 'absolute',
              left: '1rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-subtle)'
            }} />
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              className="form-input"
              style={{ paddingLeft: '2.75rem', paddingRight: '2.75rem' }}
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '0.75rem',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'transparent',
                border: 'none',
                color: 'var(--text-subtle)',
                cursor: 'pointer',
                padding: '4px'
              }}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* SIGN IN BUTTON (Matching Purple Style from Wireframe) */}
        <button
          type="submit"
          className="btn btn-primary btn-lg"
          disabled={loading}
          style={{
            width: '100%',
            marginTop: '0.75rem',
            background: 'linear-gradient(135deg, #714B67 0%, #875A7B 100%)',
            border: 'none',
            fontSize: '1rem',
            letterSpacing: '0.05em',
            textTransform: 'uppercase'
          }}
        >
          {loading ? 'Authenticating...' : 'SIGN IN'}
        </button>
      </form>

      {/* Switch to Sign Up link */}
      <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
        Don't have an Account?{' '}
        <button
          onClick={onSwitchToSignUp}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--primary)',
            fontWeight: 700,
            cursor: 'pointer',
            textDecoration: 'underline'
          }}
        >
          Sign Up
        </button>
      </div>

      {/* Demo 1-Click Fast Switcher */}
      <div style={{
        marginTop: '2rem',
        paddingTop: '1.25rem',
        borderTop: '1px dashed var(--border-subtle)',
        textAlign: 'center'
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          fontSize: '0.75rem',
          fontWeight: 700,
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          marginBottom: '0.75rem'
        }}>
          <Sparkles size={14} color="var(--primary)" /> Demo 1-Click Fast Logins
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {employees.slice(0, 3).map((emp) => (
            <button
              key={emp.id}
              onClick={() => handleQuickLogin(emp)}
              className="btn btn-secondary btn-sm"
              style={{
                justifyContent: 'space-between',
                padding: '0.5rem 0.85rem',
                fontSize: '0.8rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: emp.role === 'admin' ? 'var(--accent-purple)' : 'var(--secondary)'
                }} />
                <strong>{emp.fullName}</strong> ({emp.role === 'admin' ? 'HR / Admin' : 'Employee'})
              </div>
              <code style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>{emp.loginId}</code>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
