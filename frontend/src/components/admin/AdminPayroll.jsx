import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PayslipModal } from './PayslipModal';
import { EditEmployeeModal } from './EditEmployeeModal';
import {
  DollarSign,
  TrendingUp,
  FileText,
  Edit2,
  Download,
  Search,
  CheckCircle2,
  PieChart,
  ShieldCheck
} from 'lucide-react';

export const AdminPayroll = () => {
  const { employees, updateSalaryStructure } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPayslipEmp, setSelectedPayslipEmp] = useState(null);
  const [editingEmployee, setEditingEmployee] = useState(null);

  // Compute totals
  const totalGrossPayroll = employees.reduce((acc, emp) => {
    const s = emp.salary || {};
    return acc + (s.basic || 0) + (s.hra || 0) + (s.specialAllowance || 0);
  }, 0);

  const totalDeductions = employees.reduce((acc, emp) => {
    const s = emp.salary || {};
    return acc + (s.providentFund || 0) + (s.professionalTax || 2500) + (s.incomeTax || 0);
  }, 0);

  const totalNetDisbursement = totalGrossPayroll - totalDeductions;

  const filteredEmployees = employees.filter(e =>
    e.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.loginId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="page-wrapper animate-fade-in">
      {/* Top Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '1.75rem'
      }}>
        <div>
          <h2 style={{ fontSize: '1.65rem', fontWeight: 800 }}>Payroll & Compensation Control</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
            Manage salary structures, generate monthly payslips, and review statutory deductions
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={() => setSelectedPayslipEmp(employees[0])}
            className="btn btn-primary"
          >
            <FileText size={16} />
            <span>Generate Sample Payslip</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1.25rem',
        marginBottom: '2rem'
      }}>
        <div className="glass-card" style={{ padding: '1.4rem' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Total Gross Payroll
          </span>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--primary)', fontFamily: 'Outfit, sans-serif', marginTop: '0.2rem' }}>
            ₹{totalGrossPayroll.toLocaleString()}
          </div>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Monthly baseline expenditure</span>
        </div>

        <div className="glass-card" style={{ padding: '1.4rem' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Total Net Disbursement
          </span>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--success)', fontFamily: 'Outfit, sans-serif', marginTop: '0.2rem' }}>
            ₹{totalNetDisbursement.toLocaleString()}
          </div>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Bank transfer batch ready</span>
        </div>

        <div className="glass-card" style={{ padding: '1.4rem' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Total Statutory Deductions
          </span>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--warning)', fontFamily: 'Outfit, sans-serif', marginTop: '0.2rem' }}>
            ₹{totalDeductions.toLocaleString()}
          </div>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>PF + Professional Tax + TDS</span>
        </div>
      </div>

      {/* Payroll Table */}
      <div className="glass-card" style={{ padding: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Employee Salary Register</h3>
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{
              position: 'absolute',
              left: '0.75rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-subtle)'
            }} />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '2.25rem', width: '240px', fontSize: '0.85rem' }}
              placeholder="Filter employee..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ background: 'var(--bg-hover)', borderBottom: '1px solid var(--border-subtle)', textAlign: 'left' }}>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>Employee</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>Login ID</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>Basic Pay</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>HRA</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>Allowances</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>Deductions</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>Net Monthly Pay</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 700, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((emp) => {
                const s = emp.salary || {};
                const gross = (s.basic || 0) + (s.hra || 0) + (s.specialAllowance || 0);
                const ded = (s.providentFund || 0) + (s.professionalTax || 2500) + (s.incomeTax || 0);
                const net = gross - ded;

                return (
                  <tr
                    key={emp.id}
                    style={{ borderBottom: '1px solid var(--border-subtle)', transition: 'background var(--transition-fast)' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-hover)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <div style={{ fontWeight: 700 }}>{emp.fullName}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{emp.designation}</div>
                    </td>

                    <td style={{ padding: '0.85rem 1rem' }}>
                      <code className="font-mono" style={{ color: 'var(--primary)', fontWeight: 700 }}>
                        {emp.loginId}
                      </code>
                    </td>

                    <td style={{ padding: '0.85rem 1rem' }}>₹{s.basic?.toLocaleString()}</td>
                    <td style={{ padding: '0.85rem 1rem' }}>₹{s.hra?.toLocaleString()}</td>
                    <td style={{ padding: '0.85rem 1rem' }}>₹{s.specialAllowance?.toLocaleString()}</td>
                    <td style={{ padding: '0.85rem 1rem', color: 'var(--danger)' }}>-₹{ded.toLocaleString()}</td>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: 800, color: 'var(--success)' }}>
                      ₹{net.toLocaleString()}
                    </td>

                    <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                        <button
                          onClick={() => setEditingEmployee(emp)}
                          className="btn btn-secondary btn-sm"
                          style={{ fontSize: '0.78rem' }}
                          title="Edit Structure"
                        >
                          <Edit2 size={13} />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => setSelectedPayslipEmp(emp)}
                          className="btn btn-primary btn-sm"
                          style={{ fontSize: '0.78rem' }}
                          title="View Payslip"
                        >
                          <FileText size={13} />
                          <span>Payslip</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payslip Modal */}
      {selectedPayslipEmp && (
        <PayslipModal
          isOpen={!!selectedPayslipEmp}
          onClose={() => setSelectedPayslipEmp(null)}
          employee={selectedPayslipEmp}
          month="August 2026"
        />
      )}

      {/* Edit Structure Modal */}
      {editingEmployee && (
        <EditEmployeeModal
          isOpen={!!editingEmployee}
          onClose={() => setEditingEmployee(null)}
          employee={editingEmployee}
        />
      )}
    </div>
  );
};
