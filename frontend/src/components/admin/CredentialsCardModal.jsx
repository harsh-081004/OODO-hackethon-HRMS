import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Check, Copy, UserCheck, KeyRound, Building, Mail, Phone, Calendar, Download } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const CredentialsCardModal = ({ isOpen, onClose, employee, tempPassword }) => {
  const { company, addToast } = useApp();
  const [copied, setCopied] = useState(false);

  if (!employee) return null;

  const handleCopy = () => {
    const text = `🎉 Welcome to ${company.name}!\n\nYour Dayflow HRMS Login Credentials:\n• Portal: Dayflow HRMS\n• Employee Name: ${employee.fullName}\n• Login ID: ${employee.loginId}\n• Email: ${employee.email}\n• Temporary Password: ${tempPassword}\n\n*Please login and change your password on first login.*`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    addToast('Credentials Copied', 'Employee login details copied to clipboard.', 'success');
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Employee Onboarded Successfully!"
      maxWidth="540px"
    >
      <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
        <div style={{
          width: '3.5rem',
          height: '3.5rem',
          borderRadius: '50%',
          background: 'var(--success-light)',
          color: 'var(--success)',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '0.75rem'
        }}>
          <UserCheck size={26} />
        </div>
        <h4 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Welcome to {company.name}!</h4>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          The employee record and auto-generated system credentials have been created.
        </p>
      </div>

      {/* Official Credentials Card */}
      <div className="glass-card" style={{
        padding: '1.5rem',
        background: 'linear-gradient(135deg, var(--bg-hover) 0%, var(--bg-card) 100%)',
        border: '1.5px solid var(--border-focus)',
        borderRadius: 'var(--radius-lg)',
        position: 'relative'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Building size={18} color="var(--primary)" />
            <span style={{ fontWeight: 800, fontSize: '0.95rem' }}>{company.name}</span>
          </div>
          <span className="badge badge-primary">Dayflow HRMS</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', fontSize: '0.85rem' }}>
          <div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Employee Name</div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{employee.fullName}</div>
          </div>

          <div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Department / Role</div>
            <div style={{ fontWeight: 600 }}>{employee.department} • {employee.designation}</div>
          </div>

          <div style={{ gridColumn: '1 / -1', background: 'var(--bg-card)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600 }}>
              AUTO-GENERATED SYSTEM LOGIN ID:
            </div>
            <div className="font-mono" style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--primary)', letterSpacing: '0.04em', marginTop: '2px' }}>
              {employee.loginId}
            </div>
          </div>

          <div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Email Address</div>
            <div style={{ fontWeight: 600 }}>{employee.email}</div>
          </div>

          <div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Temporary Password</div>
            <div className="font-mono" style={{ fontWeight: 700, color: 'var(--accent-purple)' }}>
              {tempPassword}
            </div>
          </div>
        </div>

        <div style={{
          marginTop: '1rem',
          padding: '0.65rem 0.85rem',
          borderRadius: 'var(--radius-sm)',
          background: 'var(--warning-light)',
          fontSize: '0.75rem',
          color: 'var(--text-main)',
          lineHeight: 1.4
        }}>
          💡 <strong>Security Note:</strong> The employee can sign in using this Login ID & Temporary Password. The system will prompt them to set their permanent password on first login.
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onClose}
          style={{ flex: 1 }}
        >
          Done
        </button>
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleCopy}
          style={{ flex: 1.5 }}
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
          <span>{copied ? 'Copied Credentials!' : 'Copy Credentials'}</span>
        </button>
      </div>
    </Modal>
  );
};
