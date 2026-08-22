import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { KeyRound, ShieldAlert, CheckCircle2 } from 'lucide-react';

export const FirstTimePasswordModal = ({ user, onClose }) => {
  const { updatePassword } = useApp();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleUpdate = (e) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) {
      setError('Please provide your new password.');
      return;
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    updatePassword(user.id, newPassword);
    onClose();
  };

  return (
    <Modal
      isOpen={!!user}
      onClose={onClose}
      title="First Time Login: Update Password"
      maxWidth="480px"
    >
      <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
        <div style={{
          width: '3.5rem',
          height: '3.5rem',
          borderRadius: '50%',
          background: 'var(--warning-light)',
          color: 'var(--warning)',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '0.75rem'
        }}>
          <KeyRound size={26} />
        </div>
        <h4 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Set Your Permanent Password</h4>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
          Welcome, <strong>{user?.fullName}</strong>! You are currently using a system-generated temporary password. Please set a personal secure password to continue.
        </p>
      </div>

      {error && (
        <div style={{
          padding: '0.65rem 0.85rem',
          borderRadius: 'var(--radius-md)',
          background: 'var(--danger-light)',
          color: 'var(--danger)',
          fontSize: '0.825rem',
          marginBottom: '1rem',
          fontWeight: 600
        }}>
          ⚠️ {error}
        </div>
      )}

      <form onSubmit={handleUpdate}>
        <div className="form-group">
          <label className="form-label" htmlFor="newPass">
            New Password
          </label>
          <input
            id="newPass"
            type="password"
            className="form-input"
            placeholder="Minimum 6 characters"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="confirmPass">
            Confirm New Password
          </label>
          <input
            id="confirmPass"
            type="password"
            className="form-input"
            placeholder="Re-type new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
            style={{ flex: 1 }}
          >
            Remind Me Later
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            style={{ flex: 1.5 }}
          >
            <CheckCircle2 size={16} /> Save & Continue
          </button>
        </div>
      </form>
    </Modal>
  );
};
