import React from 'react';
import { useApp } from '../../context/AppContext';
import { StatCard } from '../common/StatCard';
import {
  Users,
  CalendarCheck,
  PlaneTakeoff,
  DollarSign,
  TrendingUp,
  UserCheck,
  Clock,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const AdminDashboard = ({ setActiveTab, onSelectEmployee }) => {
  const { employees, attendance, leaveRequests, company } = useApp();

  const totalEmployees = employees.length;
  const today = new Date().toISOString().split('T')[0];
  const todayAttendance = attendance.filter(a => a.date === today);
  const presentToday = todayAttendance.filter(a => a.status === 'Present').length;
  const onLeaveToday = todayAttendance.filter(a => a.status === 'Leave').length;

  const pendingLeaves = leaveRequests.filter(r => r.status === 'Pending');

  // Compute total monthly payroll
  const totalMonthlyPayroll = employees.reduce((acc, emp) => {
    const s = emp.salary || {};
    const gross = (s.basic || 0) + (s.hra || 0) + (s.specialAllowance || 0);
    return acc + gross;
  }, 0);

  // Department distribution
  const deptCounts = employees.reduce((acc, emp) => {
    acc[emp.department] = (acc[emp.department] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="page-wrapper animate-fade-in">
      {/* Welcome Banner */}
      <div className="glass-card" style={{
        padding: '1.75rem 2rem',
        marginBottom: '2rem',
        background: 'linear-gradient(135deg, var(--bg-card) 0%, var(--bg-hover) 100%)',
        border: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1.25rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
            <span className="badge badge-primary">Executive Dashboard</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>
            Welcome back, HR Operations
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
            {company.name} workforce summary • {presentToday} of {totalEmployees} active personnel present today
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={() => setActiveTab('leaves')}
            className="btn btn-secondary"
          >
            <PlaneTakeoff size={16} />
            <span>Leave Requests ({pendingLeaves.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('employees')}
            className="btn btn-primary"
          >
            <Users size={16} />
            <span>Manage Employees</span>
          </button>
        </div>
      </div>

      {/* KPI Stat Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1.25rem',
        marginBottom: '2rem'
      }}>
        <StatCard
          title="Total Workforce"
          value={totalEmployees}
          subtitle="Registered Active Staff"
          icon={Users}
          color="var(--primary)"
          trend={{ isPositive: true, text: '+2 this quarter' }}
        />
        <StatCard
          title="Present Today"
          value={presentToday}
          subtitle={`${Math.round((presentToday / (totalEmployees || 1)) * 100)}% attendance rate`}
          icon={UserCheck}
          color="var(--success)"
          badge="Live Status"
        />
        <StatCard
          title="Pending Approvals"
          value={pendingLeaves.length}
          subtitle="Leave & time-off requests"
          icon={PlaneTakeoff}
          color="var(--warning)"
          badge={pendingLeaves.length > 0 ? "Action Required" : "All Clear"}
        />
        <StatCard
          title="Monthly Gross Payroll"
          value={`₹${(totalMonthlyPayroll / 100000).toFixed(2)}L`}
          subtitle="Monthly company budget"
          icon={DollarSign}
          color="var(--secondary)"
          trend={{ isPositive: true, text: 'Disbursed on 1st' }}
        />
      </div>

      {/* Two Column Section */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        {/* Left: Pending Leave Approvals Quick Action */}
        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Pending Leave Approvals</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Employees requesting time off</p>
            </div>
            <button
              onClick={() => setActiveTab('leaves')}
              className="btn btn-ghost btn-sm"
              style={{ color: 'var(--primary)', fontWeight: 700 }}
            >
              View All <ArrowRight size={14} />
            </button>
          </div>

          {pendingLeaves.length === 0 ? (
            <div style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '2rem',
              textAlign: 'center',
              color: 'var(--text-muted)'
            }}>
              <CheckCircle2 size={36} color="var(--success)" style={{ marginBottom: '0.5rem' }} />
              <div style={{ fontWeight: 700 }}>All Clear!</div>
              <div style={{ fontSize: '0.825rem' }}>No pending leave applications requiring approval.</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1 }}>
              {pendingLeaves.slice(0, 3).map((req) => (
                <div
                  key={req.id}
                  style={{
                    padding: '0.85rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-hover)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{req.employeeName}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      {req.leaveType} Leave • <strong>{req.days} days</strong> ({req.startDate} to {req.endDate})
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', marginTop: '2px', fontStyle: 'italic' }}>
                      "{req.reason}"
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTab('leaves')}
                    className="btn btn-primary btn-sm"
                    style={{ fontSize: '0.78rem' }}
                  >
                    Review
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Department Workforce Distribution */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Department Distribution</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Headcount breakdown across company teams</p>
            </div>
            <span className="badge badge-primary">{Object.keys(deptCounts).length} Teams</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {Object.entries(deptCounts).map(([dept, count]) => {
              const percentage = Math.round((count / totalEmployees) * 100);
              return (
                <div key={dept}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem', marginBottom: '0.3rem' }}>
                    <span style={{ fontWeight: 600 }}>{dept}</span>
                    <span style={{ color: 'var(--text-muted)' }}>{count} staff ({percentage}%)</span>
                  </div>
                  <div style={{
                    width: '100%',
                    height: '8px',
                    borderRadius: 'var(--radius-full)',
                    background: 'var(--bg-hover)',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${percentage}%`,
                      height: '100%',
                      background: 'linear-gradient(90deg, var(--primary), var(--secondary))',
                      borderRadius: 'var(--radius-full)'
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Live Attendance Activity Stream */}
      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Today's Live Attendance Stream</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Real-time check-in records for {today}</p>
          </div>
          <button
            onClick={() => setActiveTab('attendance')}
            className="btn btn-secondary btn-sm"
          >
            Open Full Roster <ArrowRight size={14} />
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', textAlign: 'left', background: 'var(--bg-hover)' }}>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 700 }}>Employee</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 700 }}>Login ID</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 700 }}>Punch In Time</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 700 }}>Device / Terminal</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 700 }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {todayAttendance.map((att) => (
                <tr key={att.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>{att.employeeName}</td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <code className="font-mono" style={{ color: 'var(--primary)', fontWeight: 700 }}>
                      {att.loginId}
                    </code>
                  </td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    {att.checkIn ? (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--success)', fontWeight: 600 }}>
                        <Clock size={14} /> {att.checkIn}
                      </span>
                    ) : (
                      <span style={{ color: 'var(--text-subtle)' }}>Not Checked In</span>
                    )}
                  </td>
                  <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)' }}>{att.device}</td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <span className={`badge ${
                      att.status === 'Present' ? 'badge-success' : att.status === 'Half-day' ? 'badge-warning' : 'badge-danger'
                    }`}>
                      {att.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
