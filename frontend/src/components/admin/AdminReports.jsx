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

  // Calculate dynamic weekly compliance (dummy logic based on real attendance count vs total)
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const weekStats = { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0 };
  attendance.forEach(a => {
    const d = new Date(a.date);
    const dayName = daysOfWeek[d.getDay()];
    if (weekStats[dayName] !== undefined && a.status === 'Present') {
      weekStats[dayName]++;
    }
  });

  const staffCount = employees.filter(e => e.role !== 'admin').length || 1;
  const weeklyData = Object.keys(weekStats).map(day => ({
    day,
    pct: Math.min(100, Math.round((weekStats[day] / staffCount) * 100))
  }));

  const avgCompliance = weeklyData.reduce((acc, curr) => acc + curr.pct, 0) / 5;

  // Calculate dynamic leave breakdown
  const leaveStats = leaveRequests.reduce((acc, req) => {
    acc[req.leaveType] = (acc[req.leaveType] || 0) + 1;
    return acc;
  }, {});
  
  const totalLeaves = leaveRequests.length;
  const leaveCategories = Object.entries(leaveStats).map(([type, count]) => ({
    name: `${type} Leave`,
    count,
    pct: totalLeaves > 0 ? Math.round((count / totalLeaves) * 100) : 0,
    color: type.toLowerCase() === 'paid' ? 'var(--primary)' : type.toLowerCase() === 'sick' ? 'var(--warning)' : 'var(--info)'
  }));

  const handleDownloadReport = (reportName, fileName) => {
    let headers = [];
    let rows = [];

    if (reportName.includes('Salary')) {
      headers = ['Employee', 'Base Salary', 'HRA', 'TDS', 'PF', 'Net Pay'];
      rows = employees.map(e => [`"${e.fullName}"`, '50000', '10000', '2000', '1500', '56500']);
    } else if (reportName.includes('Attendance')) {
      headers = ['Employee Name', 'Login ID', 'Date', 'Check In', 'Check Out', 'Hours Worked', 'Status'];
      rows = attendance.map(a => [
        `"${a.employeeName}"`, `"${a.loginId}"`, `"${a.date}"`, `"${a.checkIn || '-'}"`, `"${a.checkOut || '-'}"`, `"${a.workHours || 0}"`, `"${a.status}"`
      ]);
    } else {
      headers = ['Month', 'Total PF Contributed', 'Total TDS Withheld'];
      rows = [['"Current Month"', '"15000"', '"20000"']];
    }

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', fileName || 'Report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

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
            <span className="badge badge-success">{avgCompliance.toFixed(1)}% Avg</span>
          </div>

          <div style={{ display: 'flex', height: '180px', paddingTop: '1rem', position: 'relative' }}>
            {/* Y-Axis & Grid Lines */}
            <div style={{ position: 'absolute', top: '1rem', bottom: '1.5rem', left: 0, right: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', zIndex: 0 }}>
              {[100, 75, 50, 25, 0].map(val => (
                <div key={val} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', width: '24px', textAlign: 'right' }}>{val}%</span>
                  <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)', borderStyle: val === 0 ? 'solid' : 'dashed', borderWidth: '1px' }} />
                </div>
              ))}
            </div>

            {/* Bars */}
            <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', gap: '0.75rem', paddingLeft: '32px', zIndex: 1, position: 'relative', height: '100%' }}>
              {weeklyData.map(item => (
                <div key={item.day} style={{ flex: 1, maxWidth: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '4px' }}>
                    {item.pct}%
                  </span>
                  <div style={{
                    width: '100%',
                    height: `${Math.max(item.pct, 2)}%`, // Minimum height so it's always slightly visible
                    background: 'linear-gradient(180deg, var(--primary) 0%, #875A7B 100%)',
                    borderRadius: '4px 4px 0 0',
                    transition: 'height 0.5s ease',
                    boxShadow: '0 4px 12px rgba(56, 189, 248, 0.2)'
                  }} />
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px', fontWeight: 600 }}>
                    {item.day}
                  </span>
                </div>
              ))}
            </div>
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
            {leaveCategories.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                No leave requests found.
              </div>
            ) : (
              leaveCategories.map(item => (
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
            )))}
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
            { title: 'Monthly Salary Register (Annexure 1)', desc: 'Itemized base salary, HRA, TDS, and PF breakdown per employee.', file: 'Salary_Register.csv' },
            { title: 'Staff Attendance Audit Timesheet', desc: 'Daily punch in/out timestamps, hours logged, and device stamps.', file: 'Attendance_Audit.csv' },
            { title: 'Statutory Tax & PF Return Report', desc: 'Summary of company provident fund and income tax withholdings.', file: 'Tax_PF_Summary.csv' }
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
                onClick={() => handleDownloadReport(rep.title, rep.file)}
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
