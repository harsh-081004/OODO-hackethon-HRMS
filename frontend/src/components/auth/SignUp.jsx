import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Upload, Building2, User, Mail, Phone, Lock, Eye, EyeOff, Check, AlertCircle, Sparkles } from 'lucide-react';

export const SignUp = ({ onSwitchToSignIn }) => {
  const { registerCompany, extractCompanyCode, backendConnected } = useApp();

  const [companyName, setCompanyName] = useState('Odoo India');
  const [logo, setLogo] = useState('');
  const [adminName, setAdminName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Live Company Code & Login ID preview
  const companyCode = extractCompanyCode(companyName);
  const nameParts = adminName.trim().split(/\s+/);
  const fName = nameParts[0] || 'AD';
  const lName = nameParts.length > 1 ? nameParts.slice(1).join('') : 'MI';
  const previewLoginId = `${companyCode}${(fName.substring(0, 2) + lName.substring(0, 2)).toUpperCase().padEnd(4, 'X')}${new Date().getFullYear()}0001`;

  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setLogo(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!companyName.trim() || !adminName.trim() || !email.trim() || !phone.trim() || !password) {
      setError('Please fill in all required registration fields.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const res = await registerCompany({
        companyName,
        logo,
        adminName,
        email,
        phone,
        password
      });
      setLoading(false);
      if (!res.success) {
        setError(res.error || 'Registration failed. Please try again.');
      }
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Registration failed.');
    }
  };

  return (
    <div className="glass-card animate-fade-in" style={{
      width: '100%',
      maxWidth: '520px',
      padding: '2.5rem 2rem',
      background: 'var(--bg-card-glass)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-xl)',
      boxShadow: 'var(--shadow-xl)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Top accent glow */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        background: 'linear-gradient(90deg, var(--secondary), var(--primary), var(--accent-purple))'
      }} />

      {/* Header Container */}
      <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '0.65rem 1.25rem',
          background: 'var(--bg-hover)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-subtle)',
          marginBottom: '0.75rem'
        }}>
          <Building2 size={20} color="var(--primary)" />
          <span style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-main)' }}>
            Dayflow HRMS • Company Registration
          </span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5rem' }}>
          <span className={`badge ${backendConnected ? 'badge-success' : 'badge-warning'}`} style={{ fontSize: '0.7rem' }}>
            {backendConnected ? '🟢 Live Backend Connected (:5000)' : '🟡 Offline Demo Workspace'}
          </span>
        </div>

        <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Create HRMS Workspace</h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
          Onboard your company, generate corporate Login IDs, and configure policies
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
          <AlertCircle size={16} /> {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Company Name + Upload Logo */}
        <div className="form-group">
          <label className="form-label" htmlFor="companyName">
            <span>Company Name</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 700 }}>
              Code: {companyCode}
            </span>
          </label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Building2 size={18} style={{
                position: 'absolute',
                left: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-subtle)'
              }} />
              <input
                id="companyName"
                type="text"
                className="form-input"
                style={{ paddingLeft: '2.75rem' }}
                placeholder="e.g. Odoo India"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
              />
            </div>

            <label
              htmlFor="logo-upload"
              className="btn btn-secondary"
              style={{
                cursor: 'pointer',
                padding: '0.7rem 1rem',
                border: '1.5px dashed var(--border-focus)',
                background: 'var(--primary-light)',
                color: 'var(--primary)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.85rem'
              }}
              title="Upload Company Logo"
            >
              <Upload size={16} />
              <span>{logo ? 'Logo Added' : 'Upload Logo'}</span>
              <input
                id="logo-upload"
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                style={{ display: 'none' }}
              />
            </label>
          </div>
        </div>

        {/* Administrator Name */}
        <div className="form-group">
          <label className="form-label" htmlFor="adminName">
            <span>Admin / HR Officer Name</span>
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
              id="adminName"
              type="text"
              className="form-input"
              style={{ paddingLeft: '2.75rem' }}
              placeholder="e.g. Sarah Jenkins"
              value={adminName}
              onChange={(e) => setAdminName(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Email & Phone side by side */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="email">
              <span>Corporate Email</span>
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{
                position: 'absolute',
                left: '0.9rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-subtle)'
              }} />
              <input
                id="email"
                type="email"
                className="form-input"
                style={{ paddingLeft: '2.5rem', fontSize: '0.85rem' }}
                placeholder="sarah@odoo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="phone">
              <span>Phone</span>
            </label>
            <div style={{ position: 'relative' }}>
              <Phone size={16} style={{
                position: 'absolute',
                left: '0.9rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-subtle)'
              }} />
              <input
                id="phone"
                type="tel"
                className="form-input"
                style={{ paddingLeft: '2.5rem', fontSize: '0.85rem' }}
                placeholder="+91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
          </div>
        </div>

        {/* Password (min 8 characters) */}
        <div className="form-group">
          <label className="form-label" htmlFor="password">
            <span>Password</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Min. 8 characters</span>
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
              placeholder="Create secure password (8+ chars)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={8}
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

        {/* Confirm Password */}
        <div className="form-group">
          <label className="form-label" htmlFor="confirmPassword">
            <span>Confirm Password</span>
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
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              className="form-input"
              style={{ paddingLeft: '2.75rem', paddingRight: '2.75rem' }}
              placeholder="Re-enter password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              minLength={8}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* System Generated ID Live Preview Box */}
        <div style={{
          padding: '0.85rem 1rem',
          borderRadius: 'var(--radius-md)',
          background: 'var(--bg-hover)',
          border: '1px solid var(--border-subtle)',
          marginBottom: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              Auto-Generated System Login ID Preview:
            </div>
            <div className="font-mono" style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--primary)', marginTop: '2px' }}>
              {previewLoginId}
            </div>
          </div>
          <span className="badge badge-success">
            <Check size={12} /> Auto Format
          </span>
        </div>

        {/* Sign Up CTA Button */}
        <button
          type="submit"
          className="btn btn-primary btn-lg"
          disabled={loading}
          style={{
            width: '100%',
            background: 'linear-gradient(135deg, #714B67 0%, #875A7B 100%)',
            border: 'none',
            fontSize: '1rem',
            letterSpacing: '0.05em',
            textTransform: 'uppercase'
          }}
        >
          {loading ? 'Creating Organization...' : 'Sign Up'}
        </button>
      </form>

      {/* Switch to Sign In */}
      <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
        Already have an account?{' '}
        <button
          onClick={onSwitchToSignIn}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--primary)',
            fontWeight: 700,
            cursor: 'pointer',
            textDecoration: 'underline'
          }}
        >
          Sign In
        </button>
      </div>
    </div>
  );
};
