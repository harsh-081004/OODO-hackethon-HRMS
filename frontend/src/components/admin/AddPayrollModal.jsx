import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Save } from 'lucide-react';
import { payrollApi } from '../../services/api';
import { useApp } from '../../context/AppContext';

export const AddPayrollModal = ({ isOpen, onClose }) => {
  const { employees, addToast, refreshBackendData } = useApp();
  
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState('');
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  
  // Earnings
  const [basicSalary, setBasicSalary] = useState(0);
  const [hra, setHra] = useState(0);
  const [standardAllowance, setStandardAllowance] = useState(0);
  const [performanceBonus, setPerformanceBonus] = useState(0);
  const [lta, setLta] = useState(0);
  const [fixedAllowance, setFixedAllowance] = useState(0);

  // Deductions
  const [pf, setPf] = useState(0);
  const [professionalTax, setProfessionalTax] = useState(0);

  const staffEmployees = employees.filter(emp => emp.role !== 'admin');

  // Pre-fill defaults based on selected employee
  useEffect(() => {
    if (selectedUser) {
      const emp = staffEmployees.find(e => e.id === selectedUser);
      if (emp && emp.salary) {
        setBasicSalary(emp.salary.basic || 0);
        setHra(emp.salary.hra || 0);
        setFixedAllowance(emp.salary.specialAllowance || 0); // mapping special to fixed
        setPf(emp.salary.providentFund || 0);
        setProfessionalTax(emp.salary.professionalTax || 2500);
      }
    } else {
      // reset
      setBasicSalary(0);
      setHra(0);
      setStandardAllowance(0);
      setPerformanceBonus(0);
      setLta(0);
      setFixedAllowance(0);
      setPf(0);
      setProfessionalTax(0);
    }
  }, [selectedUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUser) {
      addToast('Error', 'Please select an employee.', 'error');
      return;
    }

    setLoading(true);
    try {
      await payrollApi.createPayroll({
        user: selectedUser,
        month: Number(month),
        year: Number(year),
        basicSalary: Number(basicSalary),
        hra: Number(hra),
        standardAllowance: Number(standardAllowance),
        performanceBonus: Number(performanceBonus),
        lta: Number(lta),
        fixedAllowance: Number(fixedAllowance),
        pf: Number(pf),
        professionalTax: Number(professionalTax)
      });
      
      addToast('Success', 'Payroll record created successfully.', 'success');
      await refreshBackendData();
      onClose();
    } catch (err) {
      addToast('Error', err.response?.data?.message || 'Failed to create payroll record', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Manual Payslip" maxWidth="600px">
      <form onSubmit={handleSubmit} style={{ padding: '1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.5rem' }}>
          
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label className="form-label">Employee</label>
            <select
              className="form-select"
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              required
            >
              <option value="">-- Select Employee --</option>
              {staffEmployees.map(emp => (
                <option key={emp.id} value={emp.id}>
                  {emp.fullName} ({emp.loginId})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Month</label>
            <select className="form-select" value={month} onChange={e => setMonth(e.target.value)}>
              {[...Array(12)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {new Date(0, i).toLocaleString('default', { month: 'long' })}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Year</label>
            <input
              type="number"
              className="form-input"
              value={year}
              onChange={e => setYear(e.target.value)}
              min="2020"
              max="2050"
              required
            />
          </div>

          {/* EARNINGS */}
          <div style={{ gridColumn: '1 / -1', marginTop: '1rem' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
              Earnings
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Basic Salary</label>
                <input type="number" className="form-input" value={basicSalary} onChange={e => setBasicSalary(e.target.value)} required min="0" />
              </div>
              <div className="form-group">
                <label className="form-label">HRA</label>
                <input type="number" className="form-input" value={hra} onChange={e => setHra(e.target.value)} required min="0" />
              </div>
              <div className="form-group">
                <label className="form-label">Standard Allowance</label>
                <input type="number" className="form-input" value={standardAllowance} onChange={e => setStandardAllowance(e.target.value)} required min="0" />
              </div>
              <div className="form-group">
                <label className="form-label">Performance Bonus</label>
                <input type="number" className="form-input" value={performanceBonus} onChange={e => setPerformanceBonus(e.target.value)} required min="0" />
              </div>
              <div className="form-group">
                <label className="form-label">LTA</label>
                <input type="number" className="form-input" value={lta} onChange={e => setLta(e.target.value)} required min="0" />
              </div>
              <div className="form-group">
                <label className="form-label">Fixed Allowance</label>
                <input type="number" className="form-input" value={fixedAllowance} onChange={e => setFixedAllowance(e.target.value)} required min="0" />
              </div>
            </div>
          </div>

          {/* DEDUCTIONS */}
          <div style={{ gridColumn: '1 / -1', marginTop: '1rem' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--danger)', marginBottom: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
              Deductions
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Provident Fund (PF)</label>
                <input type="number" className="form-input" value={pf} onChange={e => setPf(e.target.value)} required min="0" />
              </div>
              <div className="form-group">
                <label className="form-label">Professional Tax</label>
                <input type="number" className="form-input" value={professionalTax} onChange={e => setProfessionalTax(e.target.value)} required min="0" />
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '2rem' }}>
          <button type="button" onClick={onClose} className="btn btn-secondary">
            Cancel
          </button>
          <button type="submit" disabled={loading} className="btn btn-primary">
            <Save size={16} />
            {loading ? 'Saving...' : 'Save Payslip'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
