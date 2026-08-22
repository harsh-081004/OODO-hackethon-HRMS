import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useApp } from '../../context/AppContext';
import { departmentList } from '../../data/seedData';
import { UserPlus, Sparkles, Check, DollarSign, Calendar, Shield, Briefcase, Mail, Phone, MapPin } from 'lucide-react';

export const AddEmployeeModal = ({ isOpen, onClose, onCreated }) => {
  const { addEmployee, company, generateLoginId } = useApp();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('employee');
  const [department, setDepartment] = useState('Engineering');
  const [designation, setDesignation] = useState('Software Engineer');
  const [joiningDate, setJoiningDate] = useState(new Date().toISOString().split('T')[0]);
  const [address, setAddress] = useState('');
  const [bloodGroup, setBloodGroup] = useState('B+');

  // Compensation structure
  const [basicSalary, setBasicSalary] = useState(75000);
  const [hra, setHra] = useState(30000);
  const [specialAllowance, setSpecialAllowance] = useState(12000);
  const [providentFund, setProvidentFund] = useState(9000);
  const [incomeTax, setIncomeTax] = useState(8500);

  // Leave quotas
  const [paidLeave, setPaidLeave] = useState(14);
  const [sickLeave, setSickLeave] = useState(8);
  const [casualLeave, setCasualLeave] = useState(5);

  const [activeTab, setActiveTab] = useState('general'); // 'general' | 'salary' | 'leave'

  // Live Login ID preview
  const previewYear = joiningDate ? joiningDate.substring(0, 4) : new Date().getFullYear().toString();
  const liveLoginId = generateLoginId(company.code, firstName || 'XX', lastName || 'XX', previewYear);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
      return;
    }

    const res = addEmployee({
      firstName,
      lastName,
      email,
      phone,
      role,
      department,
      designation,
      joiningDate,
      address,
      bloodGroup,
      basicSalary,
      hra,
      specialAllowance,
      providentFund,
      incomeTax,
      paidLeave,
      sickLeave,
      casualLeave
    });

    if (res.success) {
      onClose();
      onCreated && onCreated(res.employee, res.tempPassword);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Onboard New Employee"
      maxWidth="680px"
    >
      {/* Live System ID Preview Banner matching diagram */}
      <div style={{
        padding: '0.85rem 1.15rem',
        borderRadius: 'var(--radius-md)',
        background: 'var(--bg-hover)',
        border: '1.5px solid var(--border-focus)',
        marginBottom: '1.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>
            SYSTEM GENERATED LOGIN ID PREVIEW:
          </div>
          <div className="font-mono" style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary)', marginTop: '2px' }}>
            {liveLoginId}
          </div>
        </div>
        <span className="badge badge-primary">
          <Sparkles size={12} /> Auto-Formatted
        </span>
      </div>

      {/* Form Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
        <button
          type="button"
          onClick={() => setActiveTab('general')}
          className={`btn btn-sm ${activeTab === 'general' ? 'btn-primary' : 'btn-ghost'}`}
        >
          1. General & Job Details
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('salary')}
          className={`btn btn-sm ${activeTab === 'salary' ? 'btn-primary' : 'btn-ghost'}`}
        >
          2. Salary Structure
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('leave')}
          className={`btn btn-sm ${activeTab === 'leave' ? 'btn-primary' : 'btn-ghost'}`}
        >
          3. Leave Quotas
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {activeTab === 'general' && (
          <div className="animate-fade-in">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="empFirst">First Name *</label>
                <input
                  id="empFirst"
                  type="text"
                  className="form-input"
                  placeholder="John"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="empLast">Last Name *</label>
                <input
                  id="empLast"
                  type="text"
                  className="form-input"
                  placeholder="Doe"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="empEmail">Corporate Email *</label>
                <input
                  id="empEmail"
                  type="email"
                  className="form-input"
                  placeholder="john.doe@odoo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="empPhone">Phone Number</label>
                <input
                  id="empPhone"
                  type="tel"
                  className="form-input"
                  placeholder="+91 98234 56789"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
              <div className="form-group">
                <label className="form-label">Role Access</label>
                <select
                  className="form-select"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="employee">Regular Employee</option>
                  <option value="admin">HR Officer / Admin</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Department</label>
                <select
                  className="form-select"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                >
                  {departmentList.map(dep => (
                    <option key={dep} value={dep}>{dep}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Joining Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={joiningDate}
                  onChange={(e) => setJoiningDate(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="empDesignation">Designation / Job Title</label>
              <input
                id="empDesignation"
                type="text"
                className="form-input"
                placeholder="Senior React & Python Engineer"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="empAddress">Residential Address</label>
              <input
                id="empAddress"
                type="text"
                className="form-input"
                placeholder="Bodakdev, Ahmedabad, Gujarat"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
          </div>
        )}

        {activeTab === 'salary' && (
          <div className="animate-fade-in">
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Define standard monthly compensation components and statutory deductions.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div className="form-group">
                <label className="form-label">Basic Salary (₹)</label>
                <input
                  type="number"
                  className="form-input"
                  value={basicSalary}
                  onChange={(e) => setBasicSalary(Number(e.target.value))}
                />
              </div>

              <div className="form-group">
                <label className="form-label">House Rent Allowance - HRA (₹)</label>
                <input
                  type="number"
                  className="form-input"
                  value={hra}
                  onChange={(e) => setHra(Number(e.target.value))}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Special Allowance (₹)</label>
                <input
                  type="number"
                  className="form-input"
                  value={specialAllowance}
                  onChange={(e) => setSpecialAllowance(Number(e.target.value))}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Provident Fund - PF (₹)</label>
                <input
                  type="number"
                  className="form-input"
                  value={providentFund}
                  onChange={(e) => setProvidentFund(Number(e.target.value))}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Monthly Income Tax - TDS (₹)</label>
                <input
                  type="number"
                  className="form-input"
                  value={incomeTax}
                  onChange={(e) => setIncomeTax(Number(e.target.value))}
                />
              </div>

              <div style={{
                background: 'var(--bg-hover)',
                padding: '0.85rem',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Estimated Net Monthly Payout:</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--success)' }}>
                  ₹{(basicSalary + hra + specialAllowance - providentFund - 2500 - incomeTax).toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'leave' && (
          <div className="animate-fade-in">
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Assign initial annual leave quotas for this employee.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
              <div className="form-group">
                <label className="form-label">Paid Leaves (Days)</label>
                <input
                  type="number"
                  className="form-input"
                  value={paidLeave}
                  onChange={(e) => setPaidLeave(Number(e.target.value))}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Sick Leaves (Days)</label>
                <input
                  type="number"
                  className="form-input"
                  value={sickLeave}
                  onChange={(e) => setSickLeave(Number(e.target.value))}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Casual Leaves (Days)</label>
                <input
                  type="number"
                  className="form-input"
                  value={casualLeave}
                  onChange={(e) => setCasualLeave(Number(e.target.value))}
                />
              </div>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
            style={{ flex: 1 }}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            style={{ flex: 2 }}
          >
            <UserPlus size={16} /> Complete Onboarding & Generate Credentials
          </button>
        </div>
      </form>
    </Modal>
  );
};
