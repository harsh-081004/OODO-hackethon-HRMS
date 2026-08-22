import React from 'react';
import { Modal } from '../common/Modal';
import { useApp } from '../../context/AppContext';
import { Printer, Download, Building, CheckCircle2, Shield } from 'lucide-react';

export const PayslipModal = ({ isOpen, onClose, employee, month = 'August 2026' }) => {
  const { company } = useApp();

  if (!employee) return null;

  const s = employee.salary || {
    basic: 70000,
    hra: 28000,
    specialAllowance: 12000,
    providentFund: 8400,
    professionalTax: 2500,
    incomeTax: 7500
  };

  const grossEarnings = (s.basic || 0) + (s.hra || 0) + (s.specialAllowance || 0);
  const totalDeductions = (s.providentFund || 0) + (s.professionalTax || 2500) + (s.incomeTax || 0);
  const netPay = grossEarnings - totalDeductions;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Official Payslip: ${month}`}
      maxWidth="720px"
    >
      <div className="payslip-print-container" style={{
        background: '#ffffff',
        color: '#0f172a',
        padding: '2rem',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid #e2e8f0',
        fontFamily: 'Inter, sans-serif'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #714B67', paddingBottom: '1.25rem', marginBottom: '1.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: '#714B67',
                color: 'white',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1rem'
              }}>
                {company.code}
              </div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#714B67', margin: 0 }}>
                {company.name}
              </h2>
            </div>
            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{company.address}</div>
            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Email: {company.contactEmail} • Web: Dayflow HRMS</div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span style={{
              background: '#f5edf3',
              color: '#714B67',
              padding: '0.3rem 0.75rem',
              borderRadius: '999px',
              fontSize: '0.75rem',
              fontWeight: 800,
              display: 'inline-block',
              marginBottom: '0.4rem'
            }}>
              CONFIDENTIAL PAYSLIP
            </span>
            <div style={{ fontWeight: 800, fontSize: '1rem' }}>Pay Period: {month}</div>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Generated on: {new Date().toLocaleDateString()}</div>
          </div>
        </div>

        {/* Employee Summary Box */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1rem',
          background: '#f8fafc',
          padding: '1rem',
          borderRadius: '8px',
          border: '1px solid #e2e8f0',
          marginBottom: '1.5rem',
          fontSize: '0.825rem'
        }}>
          <div>
            <div style={{ color: '#64748b', fontSize: '0.75rem' }}>Employee Name:</div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{employee.fullName}</div>
          </div>
          <div>
            <div style={{ color: '#64748b', fontSize: '0.75rem' }}>System Login ID:</div>
            <div style={{ fontWeight: 800, color: '#714B67', fontFamily: 'JetBrains Mono, monospace' }}>{employee.loginId}</div>
          </div>
          <div>
            <div style={{ color: '#64748b', fontSize: '0.75rem' }}>Designation:</div>
            <div style={{ fontWeight: 600 }}>{employee.designation}</div>
          </div>
          <div>
            <div style={{ color: '#64748b', fontSize: '0.75rem' }}>Department:</div>
            <div style={{ fontWeight: 600 }}>{employee.department}</div>
          </div>
          <div>
            <div style={{ color: '#64748b', fontSize: '0.75rem' }}>Date of Joining:</div>
            <div style={{ fontWeight: 600 }}>{employee.joiningDate}</div>
          </div>
          <div>
            <div style={{ color: '#64748b', fontSize: '0.75rem' }}>Bank Transfer Status:</div>
            <div style={{ fontWeight: 700, color: '#10b981' }}>Processed / Direct Credit</div>
          </div>
        </div>

        {/* Earnings & Deductions Tables */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
          {/* Earnings */}
          <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
            <div style={{ background: '#f5edf3', padding: '0.65rem 1rem', fontWeight: 800, fontSize: '0.85rem', color: '#714B67' }}>
              EARNINGS
            </div>
            <table style={{ width: '100%', fontSize: '0.825rem', borderCollapse: 'collapse' }}>
              <tbody>
                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '0.6rem 1rem' }}>Basic Pay</td>
                  <td style={{ padding: '0.6rem 1rem', textAlign: 'right', fontWeight: 600 }}>₹{s.basic?.toLocaleString()}</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '0.6rem 1rem' }}>House Rent Allowance (HRA)</td>
                  <td style={{ padding: '0.6rem 1rem', textAlign: 'right', fontWeight: 600 }}>₹{s.hra?.toLocaleString()}</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '0.6rem 1rem' }}>Special & Flexible Allowance</td>
                  <td style={{ padding: '0.6rem 1rem', textAlign: 'right', fontWeight: 600 }}>₹{s.specialAllowance?.toLocaleString()}</td>
                </tr>
                <tr style={{ background: '#f8fafc', fontWeight: 800 }}>
                  <td style={{ padding: '0.75rem 1rem' }}>Gross Earnings (A)</td>
                  <td style={{ padding: '0.75rem 1rem', textAlign: 'right', color: '#714B67' }}>₹{grossEarnings.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Deductions */}
          <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
            <div style={{ background: '#fef2f2', padding: '0.65rem 1rem', fontWeight: 800, fontSize: '0.85rem', color: '#dc2626' }}>
              DEDUCTIONS
            </div>
            <table style={{ width: '100%', fontSize: '0.825rem', borderCollapse: 'collapse' }}>
              <tbody>
                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '0.6rem 1rem' }}>Provident Fund (PF)</td>
                  <td style={{ padding: '0.6rem 1rem', textAlign: 'right', fontWeight: 600 }}>₹{s.providentFund?.toLocaleString()}</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '0.6rem 1rem' }}>Professional Tax (PT)</td>
                  <td style={{ padding: '0.6rem 1rem', textAlign: 'right', fontWeight: 600 }}>₹{s.professionalTax?.toLocaleString()}</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '0.6rem 1rem' }}>Tax Deducted at Source (TDS)</td>
                  <td style={{ padding: '0.6rem 1rem', textAlign: 'right', fontWeight: 600 }}>₹{s.incomeTax?.toLocaleString()}</td>
                </tr>
                <tr style={{ background: '#f8fafc', fontWeight: 800 }}>
                  <td style={{ padding: '0.75rem 1rem' }}>Total Deductions (B)</td>
                  <td style={{ padding: '0.75rem 1rem', textAlign: 'right', color: '#dc2626' }}>₹{totalDeductions.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Net Payout Banner */}
        <div style={{
          background: 'linear-gradient(135deg, #714B67 0%, #875A7B 100%)',
          color: 'white',
          padding: '1.25rem 1.5rem',
          borderRadius: '8px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem'
        }}>
          <div>
            <div style={{ fontSize: '0.85rem', opacity: 0.9 }}>NET SALARY PAYABLE (Gross - Deductions):</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: 'Outfit, sans-serif' }}>
              ₹{netPay.toLocaleString()}
            </div>
          </div>
          <div style={{ textAlign: 'right', fontSize: '0.78rem', opacity: 0.9 }}>
            <div>Payment Mode: Electronic Wire</div>
            <div>Status: Credited to Salary Account</div>
          </div>
        </div>

        {/* Signatures */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2.5rem', paddingTop: '1rem', borderTop: '1px dashed #cbd5e1', fontSize: '0.8rem', color: '#64748b' }}>
          <div>
            <div style={{ height: '35px' }}></div>
            <div><strong>Employee Signature</strong></div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ color: '#714B67', fontWeight: 800, height: '35px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
              Dayflow HRMS • Authorized
            </div>
            <div><strong>HR & Finance Operations Signatory</strong></div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onClose}
          style={{ flex: 1 }}
        >
          Close
        </button>
        <button
          type="button"
          className="btn btn-primary"
          onClick={handlePrint}
          style={{ flex: 1.5 }}
        >
          <Printer size={16} /> Print / Save PDF
        </button>
      </div>
    </Modal>
  );
};
