import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { StatCard } from '../common/StatCard';
import { PayslipModal } from '../admin/PayslipModal';
import {
  Clock,
  Play,
  Square,
  Calendar,
  PlaneTakeoff,
  DollarSign,
  FileText,
  Bell,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  TrendingUp,
  User
} from 'lucide-react';

export const EmployeeDashboard = () => {
  const {
    currentUser,
    attendance,
    checkIn,
    checkOut,
    leaveRequests,
    announcements,
    company
  } = useApp();

  const navigate = useNavigate();

  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [showPayslipModal, setShowPayslipModal] = useState(false);

  const today = new Date().toISOString().split('T')[0];
  const userTodayAttendance = attendance.find(
    a => (a.employeeId === currentUser?.id || a.loginId === currentUser?.loginId) && a.date === today
  );

  const isCheckedIn = userTodayAttendance && userTodayAttendance.checkIn && !userTodayAttendance.checkOut;

  // Running punch timer
  useEffect(() => {
    let interval = null;
    if (isCheckedIn) {
      interval = setInterval(() => {
        setElapsedSeconds(prev => prev + 1);
      }, 1000);
    } else {
      setElapsedSeconds(0);
    }
    return () => clearInterval(interval);
  }, [isCheckedIn]);

  const formatTimer = (secs) => {
    const hrs = Math.floor(secs / 3600);
    const mins = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const userLeaveRequests = leaveRequests.filter(
    r => r.employeeId === currentUser?.id || r.loginId === currentUser?.loginId
  );

  const totalLeavesAvailable =
    (currentUser?.leaveBalances?.paid || 0) +
    (currentUser?.leaveBalances?.sick || 0) +
    (currentUser?.leaveBalances?.casual || 0);

  const s = currentUser?.salary || {};
  const gross = (s.basic || 0) + (s.hra || 0) + (s.specialAllowance || 0);
  const deductions = (s.providentFund || 0) + (s.professionalTax || 2500) + (s.incomeTax || 0);
  const netMonthly = gross - deductions;

  return (
    <div className="page-wrapper animate-fade-in">
      {/* Welcome & Live Punch Stopwatch Card */}
      <div className="glass-card" style={{
        padding: '2rem',
        marginBottom: '2rem',
        background: 'linear-gradient(135deg, var(--bg-card) 0%, var(--bg-hover) 100%)',
        border: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1.5rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
            <span className="badge badge-primary">
              <Sparkles size={12} /> Workday Console
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
          <h2 style={{ fontSize: '1.85rem', fontWeight: 800 }}>
            Good day, {currentUser?.firstName}!
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem', marginTop: '0.2rem' }}>
            {currentUser?.designation} • <strong>{currentUser?.department}</strong> ({currentUser?.loginId})
          </p>
        </div>

        {/* Live Stopwatch & Check-In Action */}
        <div style={{
          background: 'var(--bg-card)',
          padding: '1.25rem 1.75rem',
          borderRadius: 'var(--radius-lg)',
          border: '1.5px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-md)',
          display: 'flex',
          alignItems: 'center',
          gap: '1.5rem'
        }}>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              {isCheckedIn ? 'ACTIVE SHIFT TIMER' : 'TODAY\'S PUNCH STATUS'}
            </div>
            <div className="font-mono" style={{ fontSize: '1.6rem', fontWeight: 800, color: isCheckedIn ? 'var(--success)' : 'var(--text-main)', marginTop: '2px' }}>
              {isCheckedIn ? (
                <span>⏱ {formatTimer(elapsedSeconds)}</span>
              ) : userTodayAttendance?.checkOut ? (
                <span style={{ color: 'var(--info)', fontSize: '1.2rem' }}>Shift Completed (8.5 hrs)</span>
              ) : (
                <span style={{ color: 'var(--text-subtle)', fontSize: '1.2rem' }}>Not Punched In</span>
              )}
            </div>
          </div>

          {isCheckedIn ? (
            <button
              onClick={() => checkOut(currentUser.id)}
              className="btn btn-danger btn-lg"
              style={{ boxShadow: '0 4px 14px rgba(239, 68, 68, 0.3)' }}
            >
              <Square size={16} fill="white" />
              <span>Clock Out</span>
            </button>
          ) : (
            <button
              onClick={() => checkIn(currentUser.id)}
              className="btn btn-success btn-lg"
              style={{ boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)' }}
            >
              <Play size={16} fill="white" />
              <span>Clock In Now</span>
            </button>
          )}
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
        gap: '1.25rem',
        marginBottom: '2rem'
      }}>
        <StatCard
          title="Attendance Rate"
          value="96.5%"
          subtitle="This month (21 of 22 days)"
          icon={Calendar}
          color="var(--success)"
          trend={{ isPositive: true, text: 'On Track' }}
        />
        <StatCard
          title="Available Time-Off"
          value={`${totalLeavesAvailable} Days`}
          subtitle={`Paid: ${currentUser?.leaveBalances?.paid || 0} • Sick: ${currentUser?.leaveBalances?.sick || 0} • Casual: ${currentUser?.leaveBalances?.casual || 0}`}
          icon={PlaneTakeoff}
          color="var(--primary)"
          badge="Ready to Apply"
        />
        <StatCard
          title="Net Monthly Salary"
          value={`₹${netMonthly.toLocaleString()}`}
          subtitle="Credited on 1st of month"
          icon={DollarSign}
          color="var(--secondary)"
          badge="Processed"
        />
      </div>

      {/* Quick Action Navigation Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        {/* Left: Quick Access Links & Leave Overview */}
        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>My Recent Leave Applications</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Status of your time-off requests</p>
            </div>
            <button
              onClick={() => navigate('/leaves')}
              className="btn btn-ghost btn-sm"
            >
              Apply Leave <ArrowRight size={14} />
            </button>
          </div>

          {userLeaveRequests.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <PlaneTakeoff size={32} color="var(--primary)" style={{ opacity: 0.5, marginBottom: '0.5rem' }} />
              <div>No active leave applications.</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1 }}>
              {userLeaveRequests.slice(0, 3).map((req) => (
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
                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>
                      {req.leaveType} Leave ({req.days} Day{req.days > 1 ? 's' : ''})
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      {req.startDate} to {req.endDate}
                    </div>
                    {req.reviewerComments && (
                      <div style={{ fontSize: '0.75rem', color: 'var(--primary)', marginTop: '2px' }}>
                        HR Note: "{req.reviewerComments}"
                      </div>
                    )}
                  </div>

                  <span className={`badge ${
                    req.status === 'Approved' ? 'badge-success' : req.status === 'Rejected' ? 'badge-danger' : 'badge-warning'
                  }`}>
                    {req.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Company Updates & Announcements */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Company Notice Board</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Official updates from {company.name}</p>
            </div>
            <span className="badge badge-primary">
              <Bell size={12} /> Bulletin
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {announcements.map((ann) => (
              <div
                key={ann.id}
                style={{
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-hover)',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.35rem' }}>
                  <strong style={{ fontSize: '0.925rem' }}>{ann.title}</strong>
                  <span className="badge badge-info" style={{ fontSize: '0.68rem' }}>{ann.tag}</span>
                </div>
                <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', lineHeight: 1.4, marginBottom: '0.5rem' }}>
                  {ann.content}
                </p>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', display: 'flex', justifyContent: 'space-between' }}>
                  <span>{ann.author}</span>
                  <span>{ann.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Payslip Trigger Card */}
      <div className="glass-card" style={{
        padding: '1.5rem 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        background: 'linear-gradient(135deg, var(--primary-light) 0%, var(--bg-card) 100%)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '3rem',
            height: '3rem',
            borderRadius: '12px',
            background: 'var(--primary)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <FileText size={22} />
          </div>
          <div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 800 }}>August 2026 Salary Slip Ready</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Net Payout: ₹{netMonthly.toLocaleString()} • Electronic Direct Transfer Processed
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowPayslipModal(true)}
          className="btn btn-primary"
        >
          <FileText size={16} /> View & Print Payslip
        </button>
      </div>

      {/* Payslip Modal */}
      {showPayslipModal && (
        <PayslipModal
          isOpen={showPayslipModal}
          onClose={() => setShowPayslipModal(false)}
          employee={currentUser}
          month="August 2026"
        />
      )}
    </div>
  );
};
