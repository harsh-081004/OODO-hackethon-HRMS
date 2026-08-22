import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PayslipModal } from '../admin/PayslipModal';
import {
  DollarSign,
  FileText,
  Download,
  Printer,
  CheckCircle2,
  Lock,
  Building,
  ShieldCheck,
  TrendingUp
} from 'lucide-react';

export const EmployeePayroll = () => {
  const { currentUser, company } = useApp();
  const [selectedMonth, setSelectedMonth] = useState('August 2026');
  const [isPayslipOpen, setIsPayslipOpen] = useState(false);

  const s = currentUser?.salary || {
    basic: 80000,
    hra: 32000,
    specialAllowance: 15000,
    providentFund: 9600,
    professionalTax: 2500,
    incomeTax: 9500
  };

  const grossEarnings = (s.basic || 0) + (s.hra || 0) + (s.specialAllowance || 0);
  const totalDeductions = (s.providentFund || 0) + (s.professionalTax || 2500) + (s.incomeTax || 0);
  const netSalary = grossEarnings - totalDeductions;

  const pastPayslips = [
    { month: 'August 2026', gross: grossEarnings, net: netSalary, status: 'Processed / Paid', date: '2026-08-01' },
    { month: 'July 2026', gross: grossEarnings, net: netSalary, status: 'Processed / Paid', date: '2026-07-01' },
    { month: 'June 2026', gross: grossEarnings, net: netSalary, status: 'Processed / Paid', date: '2026-06-01' }
  ];

  const handleOpenPayslip = (month) => {
    setSelectedMonth(month);
    setIsPayslipOpen(true);
  };

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
          <h2 style={{ fontSize: '1.65rem', fontWeight: 800 }}>My Salary & Payslip Registry</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
            Official compensation structure, monthly net payout records, and tax deductions
          </p>
        </div>

        <button
          onClick={() => handleOpenPayslip('August 2026')}
          className="btn btn-primary btn-lg"
        >
          <FileText size={16} />
          <span>View Current Payslip</span>
        </button>
      </div>

      {/* Highlights */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
        gap: '1.25rem',
        marginBottom: '2rem'
      }}>
        <div className="glass-card" style={{ padding: '1.4rem' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Net Monthly Payout
          </span>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--success)', fontFamily: 'Outfit, sans-serif', marginTop: '0.2rem' }}>
            ₹{netSalary.toLocaleString()}
          </div>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Direct wire to registered bank</span>
        </div>

        <div className="glass-card" style={{ padding: '1.4rem' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Gross Monthly Earnings
          </span>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--primary)', fontFamily: 'Outfit, sans-serif', marginTop: '0.2rem' }}>
            ₹{grossEarnings.toLocaleString()}
          </div>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Basic + HRA + Allowances</span>
        </div>

        <div className="glass-card" style={{ padding: '1.4rem' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Total Monthly Deductions
          </span>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--danger)', fontFamily: 'Outfit, sans-serif', marginTop: '0.2rem' }}>
            ₹{totalDeductions.toLocaleString()}
          </div>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>PF + Professional Tax + TDS</span>
        </div>
      </div>

      {/* Salary Breakdown (Read-Only) */}
      <div className="glass-card" style={{ padding: '1.75rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Itemized Compensation Breakdown</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Monthly allowances & statutory contributions</p>
          </div>
          <span className="badge badge-primary">
            <Lock size={12} /> Read-Only Record
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div style={{ background: 'var(--bg-hover)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.75rem' }}>
              Earnings (A)
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Basic Salary</span>
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
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.4rem', fontWeight: 800 }}>
                <span>Total Gross Earnings</span>
                <span style={{ color: 'var(--primary)' }}>₹{grossEarnings.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div style={{ background: 'var(--bg-hover)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--danger)', marginBottom: '0.75rem' }}>
              Deductions (B)
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Provident Fund (PF)</span>
                <strong>₹{s.providentFund?.toLocaleString()}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Professional Tax</span>
                <strong>₹{s.professionalTax?.toLocaleString() || '2,500'}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Tax Deducted at Source (TDS)</span>
                <strong>₹{s.incomeTax?.toLocaleString()}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.4rem', fontWeight: 800 }}>
                <span>Total Deductions</span>
                <span style={{ color: 'var(--danger)' }}>-₹{totalDeductions.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Past Payslips Archive Table */}
      <div className="glass-card" style={{ overflowX: 'auto' }}>
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-subtle)' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Monthly Payslip Archives</h3>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ background: 'var(--bg-hover)', borderBottom: '1px solid var(--border-subtle)', textAlign: 'left' }}>
              <th style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>Pay Period</th>
              <th style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>Disbursement Date</th>
              <th style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>Gross Pay</th>
              <th style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>Net Disbursed</th>
              <th style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>Status</th>
              <th style={{ padding: '0.85rem 1rem', fontWeight: 700, textAlign: 'right' }}>Document</th>
            </tr>
          </thead>
          <tbody>
            {pastPayslips.map((ps) => (
              <tr key={ps.month} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <td style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>{ps.month}</td>
                <td style={{ padding: '0.85rem 1rem', color: 'var(--text-muted)' }}>{ps.date}</td>
                <td style={{ padding: '0.85rem 1rem' }}>₹{ps.gross.toLocaleString()}</td>
                <td style={{ padding: '0.85rem 1rem', fontWeight: 800, color: 'var(--success)' }}>
                  ₹{ps.net.toLocaleString()}
                </td>
                <td style={{ padding: '0.85rem 1rem' }}>
                  <span className="badge badge-success">
                    <CheckCircle2 size={12} /> {ps.status}
                  </span>
                </td>
                <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                  <button
                    onClick={() => handleOpenPayslip(ps.month)}
                    className="btn btn-primary btn-sm"
                  >
                    <FileText size={14} />
                    <span>View / Print</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Payslip Modal */}
      {isPayslipOpen && (
        <PayslipModal
          isOpen={isPayslipOpen}
          onClose={() => setIsPayslipOpen(false)}
          employee={currentUser}
          month={selectedMonth}
        />
      )}
    </div>
  );
};
