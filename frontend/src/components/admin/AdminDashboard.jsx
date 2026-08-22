import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { StatCard } from '../common/StatCard';
import {
  Users, CalendarCheck, PlaneTakeoff, DollarSign,
  UserCheck, Clock, ArrowRight, CheckCircle2, TrendingUp, Activity
} from 'lucide-react';

// SVG Ring Chart Component
const RingChart = ({ percent, color, size = 80, strokeWidth = 8, label }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - percent / 100);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} className="ring-chart">
          <circle
            className="ring-track"
            cx={size / 2} cy={size / 2} r={radius}
            strokeWidth={strokeWidth}
          />
          <circle
            className="ring-fill"
            cx={size / 2} cy={size / 2} r={radius}
            strokeWidth={strokeWidth}
            stroke={color}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center'
        }}>
          <span style={{ fontSize: '1.1rem', fontWeight: 900, fontFamily: 'Outfit,sans-serif', color }}>
            {percent}%
          </span>
        </div>
      </div>
      {label && (
        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textAlign: 'center' }}>
          {label}
        </span>
      )}
    </div>
  );
};

export const AdminDashboard = () => {
  const { employees, attendance, leaveRequests, company } = useApp();
  const navigate = useNavigate();

  // Only track and display regular employees (exclude Admin)
  const staffEmployees = employees.filter(e => e.role !== 'admin');
  const totalEmployees = staffEmployees.length;
  const today = new Date().toISOString().split('T')[0];
  const todayAttendance = attendance.filter(
    a => a.date === today && (
      staffEmployees.some(e => e.id === a.employeeId || e.loginId === a.loginId || e._id === a.employeeId || e.fullName === a.employeeName)
    )
  );
  const presentToday = todayAttendance.filter(a => a.status === 'Present').length;
  const attendancePct = totalEmployees ? Math.round((presentToday / totalEmployees) * 100) : 0;

  const pendingLeaves = leaveRequests.filter(r => r.status === 'Pending');

  const totalMonthlyPayroll = staffEmployees.reduce((acc, emp) => {
    const s = emp.salary || {};
    return acc + (s.basic || 0) + (s.hra || 0) + (s.specialAllowance || 0);
  }, 0);

  const deptCounts = staffEmployees.reduce((acc, emp) => {
    acc[emp.department] = (acc[emp.department] || 0) + 1;
    return acc;
  }, {});

  const deptColors = [
    'var(--primary)', 'var(--secondary)', 'var(--accent-purple)',
    'var(--accent-blue)', 'var(--accent-orange)', 'var(--success)', 'var(--warning)'
  ];

  return (
    <div className="page-wrapper animate-fade-in">

      {/* ── Welcome Banner ── */}
      <div className="glass-card holographic" style={{
        padding: '1.75rem 2rem',
        marginBottom: '1.75rem',
        background: 'linear-gradient(135deg, var(--bg-card) 0%, var(--bg-hover) 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1.25rem',
        boxShadow: 'var(--shadow-3d)',
        overflow: 'hidden',
        position: 'relative'
      }}>
        {/* Decorative top accent line */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
          background: 'linear-gradient(90deg, var(--primary), var(--secondary), var(--accent-purple))'
        }} />

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
            <span className="badge badge-primary" style={{ boxShadow: '0 0 10px var(--primary-glow)' }}>
              Executive Dashboard
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
          </div>
          <h2 style={{ fontSize: '1.65rem', fontWeight: 900 }}>
            Welcome back,{' '}
            <span className="gradient-text">HR Operations</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.2rem' }}>
            {company.name} • {presentToday} of {totalEmployees} personnel present today
          </p>
        </div>

        {/* Quick ring summary */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
          <RingChart percent={attendancePct} color="var(--success)" size={80} label="Present Rate" />
          <RingChart
            percent={totalEmployees ? Math.round(((totalEmployees - pendingLeaves.length) / totalEmployees) * 100) : 100}
            color="var(--primary)"
            size={80}
            label="HR Clear Rate"
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <button onClick={() => navigate('/leaves')} className="btn btn-secondary btn-sm">
              Review Leaves
            </button>
            <button onClick={() => navigate('/employees')} className="btn btn-primary btn-sm">
              <Users size={14} /> Manage Employees
            </button>
          </div>
        </div>
      </div>

      {/* ── 3D KPI Stat Cards ── */}
      <div className="stagger-children" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
        gap: '1.25rem',
        marginBottom: '1.75rem'
      }}>
        <StatCard
          title="Total Workforce"
          value={totalEmployees}
          subtitle="Registered active staff"
          icon={Users}
          color="var(--primary)"
          trend={{ isPositive: true, text: '+2 this quarter' }}
        />
        <StatCard
          title="Present Today"
          value={presentToday}
          subtitle={`${attendancePct}% attendance rate`}
          icon={UserCheck}
          color="var(--success)"
          badge="Live"
        />
        <StatCard
          title="Pending Approvals"
          value={pendingLeaves.length}
          subtitle="Leave & time-off requests"
          icon={PlaneTakeoff}
          color={pendingLeaves.length > 0 ? 'var(--warning)' : 'var(--success)'}
          badge={pendingLeaves.length > 0 ? 'Action Required' : 'All Clear'}
        />
        <StatCard
          title="Monthly Gross Payroll"
          value={`₹${(totalMonthlyPayroll / 100000).toFixed(2)}L`}
          subtitle="Company monthly budget"
          icon={DollarSign}
          color="var(--secondary)"
          trend={{ isPositive: true, text: 'Disbursed on 1st' }}
        />
      </div>

      {/* ── Two Column Section ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '1.5rem',
        marginBottom: '1.75rem'
      }}>
        {/* Pending Leaves Quick Panel */}
        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800 }}>Pending Leave Approvals</h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Requires HR decision</p>
            </div>
            <button onClick={() => navigate('/leaves')} className="btn btn-ghost btn-sm" style={{ color: 'var(--primary)', fontWeight: 700 }}>
              View All <ArrowRight size={13} />
            </button>
          </div>

          {pendingLeaves.length === 0 ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              <CheckCircle2 size={40} color="var(--success)" style={{ marginBottom: '0.5rem', filter: 'drop-shadow(0 0 8px var(--success))' }} />
              <div style={{ fontWeight: 800 }}>All Clear!</div>
              <div style={{ fontSize: '0.8rem' }}>No pending leave applications.</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', flex: 1 }}>
              {pendingLeaves.slice(0, 3).map((req) => (
                <div key={req.id || req._id}
                  className="glass-card-hover"
                  style={{
                    padding: '0.85rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-hover)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    transition: 'all var(--transition-normal)',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>{req.employeeName}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {req.leaveType} Leave • <strong>{req.days} days</strong>
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)', marginTop: '1px', fontStyle: 'italic' }}>
                      "{req.reason || req.remarks}"
                    </div>
                  </div>
                  <button onClick={() => navigate('/leaves')} className="btn btn-primary btn-sm" style={{ fontSize: '0.75rem' }}>
                    Review Request
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Department Distribution — 3D Bar Style */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800 }}>Department Distribution</h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Headcount across teams</p>
            </div>
            <span className="badge badge-primary">{Object.keys(deptCounts).length} Teams</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
            {Object.entries(deptCounts).map(([dept, count], i) => {
              const pct = Math.round((count / totalEmployees) * 100);
              const color = deptColors[i % deptColors.length];
              return (
                <div key={dept}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.3rem' }}>
                    <span style={{ fontWeight: 700 }}>{dept}</span>
                    <span style={{ color: 'var(--text-muted)' }}>{count} staff ({pct}%)</span>
                  </div>
                  <div className="progress-track">
                    <div className="progress-fill" style={{
                      width: `${pct}%`,
                      background: `linear-gradient(90deg, ${color}, color-mix(in srgb, ${color} 60%, var(--secondary)))`
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Live Attendance Stream ── */}
      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800 }}>Today's Live Attendance Stream</h3>
              <div className="beacon" style={{ color: 'var(--success)' }}>
                <span style={{ display: 'block', width: '8px', height: '8px', borderRadius: '50%', background: 'currentColor' }} />
              </div>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Real-time check-in records for {today}</p>
          </div>
          <button onClick={() => navigate('/attendance')} className="btn btn-secondary btn-sm">
            Detailed Logster <ArrowRight size={13} />
          </button>
        </div>

        {todayAttendance.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
            <Activity size={36} style={{ marginBottom: '0.5rem', opacity: 0.4 }} />
            <div>No attendance punches recorded yet today.</div>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Login ID</th>
                  <th>Punch In</th>
                  <th>Punch Out</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {todayAttendance.map((att) => (
                  <tr key={att.id || att._id}>
                    <td style={{ fontWeight: 700 }}>{att.employeeName}</td>
                    <td>
                      <code className="font-mono" style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.82rem' }}>
                        {att.loginId}
                      </code>
                    </td>
                    <td>
                      {att.checkIn ? (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--success)', fontWeight: 700 }}>
                          <Clock size={13} /> {att.checkIn}
                        </span>
                      ) : <span style={{ color: 'var(--text-subtle)' }}>—</span>}
                    </td>
                    <td>
                      {att.checkOut ? (
                        <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>{att.checkOut}</span>
                      ) : <span style={{ color: 'var(--text-subtle)' }}>Still In</span>}
                    </td>
                    <td>
                      <span className={`badge ${att.status === 'Present' ? 'badge-success' : att.status === 'Half-day' ? 'badge-warning' : 'badge-danger'}`}
                        style={{ boxShadow: att.status === 'Present' ? '0 0 8px var(--success-glow)' : 'none' }}>
                        {att.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
