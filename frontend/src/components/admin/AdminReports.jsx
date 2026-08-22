import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  BarChart3,
  TrendingUp,
  PieChart,
  Calendar,
  Users,
  Download,
  CheckCircle2,
  Clock,
  Sparkles
} from 'lucide-react';

export const AdminReports = () => {
  const { employees, attendance, leaveRequests, company, addToast } = useApp();

  const totalEmployees = employees.length;
  const approvedLeaves = leaveRequests.filter(r => r.status === 'Approved').length;
  const pendingLeaves = leaveRequests.filter(r => r.status === 'Pending').length;

  const handleDownloadReport = (reportName) => {
    addToast('Report Exported', `${reportName} generated and downloaded.`, 'success');
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
          <h2 style={{ fontSize: '1.65rem', fontWeight: 800 }}>HR Analytics & Intelligence</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
            Workforce health metrics, leave utilization trends, and payroll expense breakdown
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={() => handleDownloadReport('Comprehensive HRMS Audit Report')}
            className="btn btn-primary"
          >
            <Download size={16} />
            <span>Export Executive Summary</span>
          </button>
        </div>
      </div>

      {/* Grid of Report Visualizations */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Attendance Compliance Trend */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Weekly Attendance Compliance</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Average presence rate by workday</p>
            </div>
            <span className="badge badge-success">94.2% Avg</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '180px', paddingTop: '1rem', gap: '0.75rem' }}>
            {[
              { day: 'Mon', pct: 96 },
              { day: 'Tue', pct: 98 },
              { day: 'Wed', pct: 95 },
              { day: 'Thu', pct: 92 },
              { day: 'Fri', pct: 89 }
            ].map(item => (
              <div key={item.day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '4px' }}>
                  {item.pct}%
                </span>
                <div style={{
                  width: '100%',
                  height: `${item.pct}%`,
                  background: 'linear-gradient(180deg, var(--primary) 0%, #875A7B 100%)',
                  borderRadius: '6px 6px 0 0',
                  transition: 'height 0.5s ease'
                }} />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px', fontWeight: 600 }}>
                  {item.day}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Leave Type Breakdown */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Leave Utilization By Category</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Distribution of applied time-off types</p>
            </div>
            <span className="badge badge-primary">{leaveRequests.length} Total Requests</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.5rem' }}>
            {[
              { name: 'Paid Annual Leave', count: 6, pct: 60, color: 'var(--primary)' },
              { name: 'Medical / Sick Leave', count: 3, pct: 30, color: 'var(--warning)' },
              { name: 'Unpaid / Personal Leave', count: 1, pct: 10, color: 'var(--info)' }
            ].map(item => (
              <div key={item.name}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem', marginBottom: '0.35rem' }}>
                  <span style={{ fontWeight: 600 }}>{item.name}</span>
                  <span style={{ color: 'var(--text-muted)' }}>{item.count} applications ({item.pct}%)</span>
                </div>
                <div style={{
                  width: '100%',
                  height: '8px',
                  borderRadius: 'var(--radius-full)',
                  background: 'var(--bg-hover)',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${item.pct}%`,
                    height: '100%',
                    background: item.color,
                    borderRadius: 'var(--radius-full)'
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Available Downloadable Reports List */}
      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '1rem' }}>
          Standard Compliance & Export Hub
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
          {[
            { title: 'Monthly Salary Register (Annexure 1)', desc: 'Itemized base salary, HRA, TDS, and PF breakdown per employee.', file: 'Salary_Register.xlsx' },
            { title: 'Staff Attendance Audit Timesheet', desc: 'Daily punch in/out timestamps, hours logged, and device stamps.', file: 'Attendance_Audit.csv' },
            { title: 'Statutory Tax & PF Return Report', desc: 'Summary of company provident fund and income tax withholdings.', file: 'Tax_PF_Summary.pdf' }
          ].map(rep => (
            <div
              key={rep.title}
              style={{
                padding: '1.1rem',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-hover)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <strong style={{ fontSize: '0.925rem' }}>{rep.title}</strong>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem', marginBottom: '1rem' }}>
                  {rep.desc}
                </p>
              </div>

              <button
                onClick={() => handleDownloadReport(rep.title)}
                className="btn btn-secondary btn-sm"
                style={{ width: 'fit-content' }}
              >
                <Download size={14} /> Download Document
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
