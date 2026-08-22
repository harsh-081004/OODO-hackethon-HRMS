import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Building,
  Briefcase,
  DollarSign,
  FileText,
  Shield,
  Edit2,
  Save,
  Camera,
  Heart,
  CheckCircle2,
  Lock,
  Sparkles
} from 'lucide-react';

export const EmployeeProfile = ({ targetEmployee }) => {
  const { currentUser, updateEmployee, addToast } = useApp();

  // If viewed by admin for another employee, use targetEmployee; otherwise currentUser
  const employee = targetEmployee || currentUser;
  const isSelf = currentUser?.id === employee?.id;
  const isAdmin = currentUser?.role === 'admin';

  const [activeTab, setActiveTab] = useState('personal'); // 'personal' | 'job' | 'salary' | 'documents'
  const [isEditing, setIsEditing] = useState(false);

  // Editable fields for employee self-service: phone, address, emergency contact, bloodGroup, avatar
  const [phone, setPhone] = useState(employee?.phone || '');
  const [address, setAddress] = useState(employee?.address || '');
  const [emergencyContact, setEmergencyContact] = useState(employee?.emergencyContact || '');
  const [bloodGroup, setBloodGroup] = useState(employee?.bloodGroup || 'B+');
  const [avatar, setAvatar] = useState(employee?.avatar || '');

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveSelfService = (e) => {
    e.preventDefault();
    updateEmployee(employee.id, {
      phone,
      address,
      emergencyContact,
      bloodGroup,
      avatar
    }, true); // isSelfEdit = true
    setIsEditing(false);
  };

  const s = employee?.salary || {};
  const gross = (s.basic || 0) + (s.hra || 0) + (s.specialAllowance || 0);
  const deductions = (s.providentFund || 0) + (s.professionalTax || 2500) + (s.incomeTax || 0);
  const net = gross - deductions;

  return (
    <div className="page-wrapper animate-fade-in">
      {/* Profile Header Hero Card */}
      <div className="glass-card" style={{
        padding: '2rem',
        marginBottom: '2rem',
        background: 'linear-gradient(135deg, var(--bg-card) 0%, var(--bg-hover) 100%)',
        border: '1px solid var(--border-subtle)',
        position: 'relative'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.5rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative' }}>
              <img
                src={avatar || employee?.avatar}
                alt={employee?.fullName}
                style={{
                  width: '90px',
                  height: '90px',
                  borderRadius: '24px',
                  objectFit: 'cover',
                  border: '3px solid var(--primary)'
                }}
              />
              {isEditing && (
                <label
                  htmlFor="avatar-upload"
                  style={{
                    position: 'absolute',
                    bottom: '-4px',
                    right: '-4px',
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    background: 'var(--primary)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
                  }}
                  title="Upload New Photo"
                >
                  <Camera size={16} />
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    style={{ display: 'none' }}
                  />
                </label>
              )}
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>{employee?.fullName}</h2>
                <span className={`badge ${employee?.role === 'admin' ? 'badge-primary' : 'badge-info'}`}>
                  {employee?.role === 'admin' ? 'HR / Admin' : 'Employee'}
                </span>
                <span className="badge badge-success">{employee?.status || 'Active'}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.875rem', flexWrap: 'wrap' }}>
                <span>{employee?.designation}</span>
                <span>•</span>
                <span>{employee?.department}</span>
                <span>•</span>
                <span className="font-mono" style={{ color: 'var(--primary)', fontWeight: 700 }}>
                  ID: {employee?.loginId}
                </span>
              </div>
            </div>
          </div>

          <div>
            {isEditing ? (
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveSelfService}
                  className="btn btn-primary"
                >
                  <Save size={16} /> Save Details
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="btn btn-secondary"
              >
                <Edit2 size={16} />
                <span>Edit Contact Info</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        marginBottom: '1.5rem',
        borderBottom: '1px solid var(--border-subtle)',
        paddingBottom: '0.5rem'
      }}>
        {[
          { id: 'personal', label: 'Personal Information', icon: User },
          { id: 'job', label: 'Job & Employment Details', icon: Briefcase },
          { id: 'salary', label: 'Salary Structure', icon: DollarSign },
          { id: 'documents', label: 'Official Documents', icon: FileText }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`btn btn-sm ${isActive ? 'btn-primary' : 'btn-ghost'}`}
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT: Personal Information */}
      {activeTab === 'personal' && (
        <div className="glass-card animate-fade-in" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Personal & Contact Details</h3>
            {!isAdmin && (
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                * Contact info is self-editable by employee
              </span>
            )}
          </div>

          <form onSubmit={handleSaveSelfService}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={employee?.fullName || ''}
                  disabled
                />
              </div>

              <div className="form-group">
                <label className="form-label">Corporate Email</label>
                <input
                  type="email"
                  className="form-input"
                  value={employee?.email || ''}
                  disabled
                />
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number {isEditing && '*'}</label>
                <input
                  type="tel"
                  className="form-input"
                  value={isEditing ? phone : (employee?.phone || '')}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={!isEditing}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Blood Group</label>
                <select
                  className="form-select"
                  value={isEditing ? bloodGroup : (employee?.bloodGroup || 'B+')}
                  onChange={(e) => setBloodGroup(e.target.value)}
                  disabled={!isEditing}
                >
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>

              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Residential Address</label>
                <input
                  type="text"
                  className="form-input"
                  value={isEditing ? address : (employee?.address || '')}
                  onChange={(e) => setAddress(e.target.value)}
                  disabled={!isEditing}
                />
              </div>

              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Emergency Contact Info</label>
                <input
                  type="text"
                  className="form-input"
                  value={isEditing ? emergencyContact : (employee?.emergencyContact || '')}
                  onChange={(e) => setEmergencyContact(e.target.value)}
                  disabled={!isEditing}
                />
              </div>
            </div>

            {isEditing && (
              <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
                <button type="submit" className="btn btn-primary">
                  <Save size={16} /> Save Contact Details
                </button>
              </div>
            )}
          </form>
        </div>
      )}

      {/* TAB CONTENT: Job Details */}
      {activeTab === 'job' && (
        <div className="glass-card animate-fade-in" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Employment & Position Information</h3>
            <span className="badge badge-primary">
              <Lock size={12} /> Managed by HR Administration
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">System Login ID</label>
              <input
                type="text"
                className="form-input font-mono"
                value={employee?.loginId || ''}
                disabled
              />
            </div>

            <div className="form-group">
              <label className="form-label">Designation / Role Title</label>
              <input
                type="text"
                className="form-input"
                value={employee?.designation || ''}
                disabled
              />
            </div>

            <div className="form-group">
              <label className="form-label">Department</label>
              <input
                type="text"
                className="form-input"
                value={employee?.department || ''}
                disabled
              />
            </div>

            <div className="form-group">
              <label className="form-label">Joining Date</label>
              <input
                type="text"
                className="form-input"
                value={employee?.joiningDate || ''}
                disabled
              />
            </div>

            <div className="form-group">
              <label className="form-label">Work Location</label>
              <input
                type="text"
                className="form-input"
                value="Odoo Infocity Campus / Hybrid"
                disabled
              />
            </div>

            <div className="form-group">
              <label className="form-label">Employment Classification</label>
              <input
                type="text"
                className="form-input"
                value="Full-time Permanent"
                disabled
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: Salary Structure */}
      {activeTab === 'salary' && (
        <div className="glass-card animate-fade-in" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Compensation Structure</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {isAdmin ? 'Full compensation view with editing controls' : 'Read-only monthly payout & deductions'}
              </p>
            </div>
            <span className="badge badge-success">
              Net Monthly: ₹{net.toLocaleString()}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            <div style={{ border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.85rem' }}>
                Earnings Components
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Basic Pay</span>
                  <strong>₹{s.basic?.toLocaleString()}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>House Rent Allowance (HRA)</span>
                  <strong>₹{s.hra?.toLocaleString()}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Special Allowance</span>
                  <strong>₹{s.specialAllowance?.toLocaleString()}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.5rem', fontWeight: 800 }}>
                  <span>Gross Monthly Earnings</span>
                  <span style={{ color: 'var(--primary)' }}>₹{gross.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div style={{ border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--danger)', marginBottom: '0.85rem' }}>
                Monthly Deductions
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Provident Fund (PF)</span>
                  <strong>₹{s.providentFund?.toLocaleString()}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Professional Tax</span>
                  <strong>₹{s.professionalTax?.toLocaleString() || '2,500'}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Income Tax (TDS)</span>
                  <strong>₹{s.incomeTax?.toLocaleString()}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.5rem', fontWeight: 800 }}>
                  <span>Total Deductions</span>
                  <span style={{ color: 'var(--danger)' }}>-₹{deductions.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: Documents */}
      {activeTab === 'documents' && (
        <div className="glass-card animate-fade-in" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1rem' }}>
            Verified Employee Credentials & Files
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            {[
              { title: 'Employment Contract Agreement', size: '2.4 MB', date: employee?.joiningDate, status: 'Verified' },
              { title: 'Identity & Address Verification Proof', size: '1.8 MB', date: employee?.joiningDate, status: 'Verified' },
              { title: 'Educational & Degree Certifications', size: '3.1 MB', date: employee?.joiningDate, status: 'Verified' }
            ].map(doc => (
              <div
                key={doc.title}
                style={{
                  padding: '1.1rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-hover)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.85rem'
                }}
              >
                <div style={{
                  width: '2.5rem',
                  height: '2.5rem',
                  borderRadius: '8px',
                  background: 'var(--primary-light)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <FileText size={18} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: '0.875rem', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                    {doc.title}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {doc.size} • Uploaded {doc.date}
                  </div>
                </div>
                <span className="badge badge-success" style={{ fontSize: '0.68rem' }}>{doc.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
