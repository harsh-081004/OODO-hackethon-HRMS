import React, { useState } from 'react';
import { SignIn } from './SignIn';
import { SignUp } from './SignUp';
import { FirstTimePasswordModal } from './FirstTimePasswordModal';
import { useApp } from '../../context/AppContext';
import { Moon, Sun, Sparkles, HelpCircle, ShieldCheck, CheckCircle2, FileText, ChevronRight } from 'lucide-react';

export const AuthLayout = () => {
  const { theme, toggleTheme, company } = useApp();
  const [isSignUp, setIsSignUp] = useState(false);
  const [firstTimeUser, setFirstTimeUser] = useState(null);
  const [showSpecDrawer, setShowSpecDrawer] = useState(false);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: 'radial-gradient(circle at 10% 20%, rgba(113, 75, 103, 0.15) 0%, transparent 40%), radial-gradient(circle at 90% 80%, rgba(0, 135, 132, 0.1) 0%, transparent 40%), var(--bg-app)',
      position: 'relative'
    }}>
      {/* Top Header Bar with Theme Switch & Spec Guide */}
      <header style={{
        padding: '1.25rem 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid var(--border-subtle)',
        background: 'var(--bg-card-glass)',
        backdropFilter: 'blur(12px)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{
            width: '2.5rem',
            height: '2.5rem',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, var(--primary) 0%, #875A7B 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 800,
            fontSize: '1.2rem',
            boxShadow: '0 4px 12px var(--primary-glow)'
          }}>
            {company.code || 'OI'}
          </div>
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 800, lineHeight: 1.1 }}>
              Dayflow HRMS
            </h1>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Human Resource Management System • Odoo Standard
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Spec breakdown badge modal toggle */}
          <button
            onClick={() => setShowSpecDrawer(!showSpecDrawer)}
            className="btn btn-secondary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <HelpCircle size={15} color="var(--primary)" />
            <span>Login ID Rule Breakdown</span>
          </button>

          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            className="btn-icon btn-secondary"
            title="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={18} color="#f59e0b" /> : <Moon size={18} color="var(--primary)" />}
          </button>
        </div>
      </header>

      {/* Main Centered Content */}
      <main style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1.5rem',
        flexDirection: 'column'
      }}>
        {/* Title corresponding to diagram */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{
            fontSize: '2rem',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            background: 'linear-gradient(135deg, var(--text-main) 30%, var(--primary) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Human Resource Management System
          </h2>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            {company.tagline || 'Every workday, perfectly aligned.'}
          </p>
        </div>

        {/* Sign In or Sign Up Form */}
        {isSignUp ? (
          <SignUp onSwitchToSignIn={() => setIsSignUp(false)} />
        ) : (
          <SignIn
            onSwitchToSignUp={() => setIsSignUp(true)}
            onFirstTimeLoginPrompt={(user) => setFirstTimeUser(user)}
          />
        )}

        {/* Specification Info Banner (from wireframe diagram notes) */}
        {showSpecDrawer && (
          <div className="glass-card animate-fade-in" style={{
            marginTop: '2rem',
            maxWidth: '720px',
            width: '100%',
            padding: '1.5rem',
            border: '1px solid var(--border-focus)',
            background: 'var(--bg-card-glass)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <ShieldCheck size={20} color="var(--primary)" />
              <h3 style={{ fontSize: '1rem', fontWeight: 800 }}>
                Specification Details: Auto-Generated Login ID & Workflow
              </h3>
            </div>

            <div style={{
              background: 'var(--bg-hover)',
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '0.85rem',
              marginBottom: '1rem'
            }}>
              <div style={{ color: 'var(--primary)', fontWeight: 700, marginBottom: '0.25rem' }}>
                Format: [OI] [First 2 of First & Last Name] [Year of Joining] [Serial Number]
              </div>
              <div style={{ color: 'var(--text-muted)' }}>
                Example: <strong style={{ color: 'var(--text-main)' }}>OIJODO20220001</strong>
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.5rem', lineHeight: 1.6 }}>
                • <strong>OI</strong> → Odoo India (Company Name initials)<br/>
                • <strong>JODO</strong> → First two letters of employee's first and last name (John Doe)<br/>
                • <strong>2022</strong> → Year of Joining<br/>
                • <strong>0001</strong> → Serial Number of Joining for that Year
              </div>
            </div>

            <div style={{
              background: 'var(--warning-light)',
              padding: '0.85rem 1rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.8rem',
              color: 'var(--text-main)',
              lineHeight: 1.5,
              borderLeft: '4px solid var(--warning)'
            }}>
              <strong>Note on Access:</strong> Normal employees do not register publicly. They are created inside the HRMS by the Admin/HR Officer, which automatically generates their unique Login ID and temporary secure password. On initial login, they are prompted to update their password.
            </div>
          </div>
        )}
      </main>

      {/* First Time Password Modal */}
      {firstTimeUser && (
        <FirstTimePasswordModal
          user={firstTimeUser}
          onClose={() => setFirstTimeUser(null)}
        />
      )}

      {/* Footer */}
      <footer style={{
        padding: '1.25rem',
        textAlign: 'center',
        fontSize: '0.8rem',
        color: 'var(--text-muted)',
        borderTop: '1px solid var(--border-subtle)'
      }}>
        Dayflow HRMS • Powered by Odoo India • Designed for seamless workforce operations
      </footer>
    </div>
  );
};
