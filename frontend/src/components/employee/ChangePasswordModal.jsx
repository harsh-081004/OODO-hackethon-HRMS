import React, { useState } from 'react';
import { Lock, Mail, ShieldCheck, X, AlertCircle } from 'lucide-react';
import { authApi } from '../../services/api';
import { useApp } from '../../context/AppContext';

export const ChangePasswordModal = ({ isOpen, onClose }) => {
  const { addToast } = useApp();
  const [step, setStep] = useState(1); // 1: Request OTP, 2: Enter OTP & New Password
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Form State
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  if (!isOpen) return null;

  const handleRequestOtp = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await authApi.requestPasswordOtp();
      addToast('OTP Sent', 'Check your email for the 6-digit verification code.', 'success');
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      await authApi.changePasswordWithOtp({ otp, newPassword });
      addToast('Success!', 'Your password has been changed securely.', 'success');
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP or failed to change password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999
    }}>
      <div className="glass-card animate-fade-in" style={{ 
        width: '100%', 
        maxWidth: '450px',
        padding: '2rem',
        position: 'relative'
      }}>
        <button 
          onClick={onClose}
          className="btn btn-ghost"
          style={{ position: 'absolute', top: '1rem', right: '1rem', padding: '0.5rem' }}
        >
          <X size={20} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ 
            width: '48px', height: '48px', 
            borderRadius: '50%', 
            background: 'var(--primary-light)', 
            color: 'var(--primary)', 
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1rem auto' 
          }}>
            <ShieldCheck size={24} />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Change Password</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            {step === 1 ? 'Verify your identity to proceed.' : 'Enter the OTP sent to your email.'}
          </p>
        </div>

        {error && (
          <div style={{ 
            padding: '0.75rem', 
            borderRadius: 'var(--radius-md)', 
            background: 'rgba(239, 68, 68, 0.1)', 
            color: 'var(--danger)', 
            fontSize: '0.875rem',
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            marginBottom: '1.5rem'
          }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {step === 1 ? (
          <div>
            <div style={{ padding: '1rem', background: 'var(--bg-hover)', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', textAlign: 'center' }}>
              <Mail size={20} style={{ color: 'var(--primary)', marginBottom: '0.5rem' }} />
              <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', margin: 0 }}>
                We will send a secure 6-digit One Time Password (OTP) to your registered corporate email address.
              </p>
            </div>
            <button 
              onClick={handleRequestOtp} 
              disabled={isLoading}
              className="btn btn-primary" 
              style={{ width: '100%', justifyContent: 'center' }}
            >
              {isLoading ? 'Sending OTP...' : 'Send Verification OTP'}
            </button>
          </div>
        ) : (
          <form onSubmit={handleChangePassword}>
            <div className="form-group">
              <label className="form-label">6-Digit OTP</label>
              <input
                type="text"
                maxLength="6"
                placeholder="000000"
                className="form-input font-mono"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                required
                style={{ textAlign: 'center', fontSize: '1.2rem', letterSpacing: '0.2em' }}
              />
            </div>

            <div className="form-group">
              <label className="form-label">New Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '12px', color: 'var(--text-subtle)' }} />
                <input
                  type="password"
                  placeholder="••••••••"
                  className="form-input"
                  style={{ paddingLeft: '2.5rem' }}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label className="form-label">Confirm New Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '12px', color: 'var(--text-subtle)' }} />
                <input
                  type="password"
                  placeholder="••••••••"
                  className="form-input"
                  style={{ paddingLeft: '2.5rem' }}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading || otp.length !== 6 || !newPassword}
              className="btn btn-primary" 
              style={{ width: '100%', justifyContent: 'center' }}
            >
              {isLoading ? 'Updating...' : 'Change Password Securely'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
