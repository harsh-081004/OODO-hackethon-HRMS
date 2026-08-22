import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { useApp } from '../../context/AppContext';
import { departmentList } from '../../data/seedData';
import { Save, User, Shield, Briefcase, Mail, Phone, MapPin, DollarSign } from 'lucide-react';

export const EditEmployeeModal = ({ isOpen, onClose, employee }) => {
  const { updateEmployee } = useApp();

  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (employee) {
      setFormData({
        firstName: employee.firstName || '',
        lastName: employee.lastName || '',
        email: employee.email || '',
        phone: employee.phone || '',
        role: employee.role || 'employee',
        department: employee.department || 'Engineering',
        designation: employee.designation || '',
        status: employee.status || 'Active',
        address: employee.address || '',
        bloodGroup: employee.bloodGroup || 'O+',
        basicSalary: employee.salary?.basic || 60000,
        hra: employee.salary?.hra || 24000,
        specialAllowance: employee.salary?.specialAllowance || 10000,
        providentFund: employee.salary?.providentFund || 7200,
        incomeTax: employee.salary?.incomeTax || 6500,
        paidLeave: employee.leaveBalances?.paid || 14,
        sickLeave: employee.leaveBalances?.sick || 8,
        casualLeave: employee.leaveBalances?.casual || 5
      });
    }
  }, [employee]);

  if (!employee) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    updateEmployee(employee.id, {
      firstName: formData.firstName,
      lastName: formData.lastName,
      fullName: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      phone: formData.phone,
      role: formData.role,
      department: formData.department,
      designation: formData.designation,
      status: formData.status,
      address: formData.address,
      bloodGroup: formData.bloodGroup,
      salary: {
        basic: Number(formData.basicSalary),
        hra: Number(formData.hra),
        specialAllowance: Number(formData.specialAllowance),
        providentFund: Number(formData.providentFund),
        professionalTax: 2500,
        incomeTax: Number(formData.incomeTax)
      },
      leaveBalances: {
        paid: Number(formData.paidLeave),
        sick: Number(formData.sickLeave),
        casual: Number(formData.casualLeave),
        unpaid: 0
      }
    }, false); // isSelfEdit = false (Admin privileges)

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Edit Employee: ${employee.fullName} (${employee.loginId})`}
      maxWidth="680px"
    >
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <div className="form-group">
            <label className="form-label">First Name</label>
            <input
              type="text"
              className="form-input"
              value={formData.firstName || ''}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Last Name</label>
            <input
              type="text"
              className="form-input"
              value={formData.lastName || ''}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              required
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-input"
              value={formData.email || ''}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Phone</label>
            <input
              type="tel"
              className="form-input"
              value={formData.phone || ''}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
          <div className="form-group">
            <label className="form-label">Role</label>
            <select
              className="form-select"
              value={formData.role || 'employee'}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            >
              <option value="employee">Employee</option>
              <option value="admin">Admin / HR Officer</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Department</label>
            <select
              className="form-select"
              value={formData.department || 'Engineering'}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            >
              {departmentList.map(dep => (
                <option key={dep} value={dep}>{dep}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Status</label>
            <select
              className="form-select"
              value={formData.status || 'Active'}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            >
              <option value="Active">Active</option>
              <option value="On Leave">On Leave</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Job Designation</label>
          <input
            type="text"
            className="form-input"
            value={formData.designation || ''}
            onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Address</label>
          <input
            type="text"
            className="form-input"
            value={formData.address || ''}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          />
        </div>

        {/* Salary section in edit */}
        <div style={{
          marginTop: '1rem',
          padding: '1rem',
          borderRadius: 'var(--radius-md)',
          background: 'var(--bg-hover)',
          border: '1px solid var(--border-subtle)'
        }}>
          <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <DollarSign size={16} color="var(--primary)" /> Compensation Structure
          </h4>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.6rem' }}>
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Basic Pay (₹)</label>
              <input
                type="number"
                className="form-input"
                value={formData.basicSalary || 0}
                onChange={(e) => setFormData({ ...formData, basicSalary: Number(e.target.value) })}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>HRA (₹)</label>
              <input
                type="number"
                className="form-input"
                value={formData.hra || 0}
                onChange={(e) => setFormData({ ...formData, hra: Number(e.target.value) })}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Special Allowances (₹)</label>
              <input
                type="number"
                className="form-input"
                value={formData.specialAllowance || 0}
                onChange={(e) => setFormData({ ...formData, specialAllowance: Number(e.target.value) })}
              />
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
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
            style={{ flex: 1.5 }}
          >
            <Save size={16} /> Save Changes
          </button>
        </div>
      </form>
    </Modal>
  );
};
