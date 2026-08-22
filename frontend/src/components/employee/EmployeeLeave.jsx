import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  PlaneTakeoff,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  MessageSquare,
  Sparkles,
  Send
} from 'lucide-react';

export const EmployeeLeave = () => {
  const { currentUser, leaveRequests, applyLeave } = useApp();

  const [leaveType, setLeaveType] = useState('Paid'); // 'Paid' | 'Sick' | 'Unpaid' | 'Casual'
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date(Date.now() + 86400000).toISOString().split('T')[0]);
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  // Compute number of days between startDate and endDate
  const computeDays = (start, end) => {
    const s = new Date(start);
    const e = new Date(end);
    const diffTime = e - s;
    if (diffTime < 0) return 0;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  const calculatedDays = computeDays(startDate, endDate);

  // Available balance
  const balanceKey = leaveType.toLowerCase();
  const availableBalance = currentUser?.leaveBalances?.[balanceKey] ?? 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!reason.trim()) return;
    if (calculatedDays <= 0) return;

    setLoading(true);
    setTimeout(() => {
      applyLeave({
        leaveType,
        startDate,
        endDate,
        days: calculatedDays,
        reason
      });
      setReason('');
      setLoading(false);
    }, 300);
  };

  const myRequests = leaveRequests.filter(
    r => r.employeeId === currentUser?.id || r.loginId === currentUser?.loginId
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
          <h2 style={{ fontSize: '1.65rem', fontWeight: 800 }}>Leave & Time-Off Management</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
            Submit time-off requests, check live quota balances, and track approval feedback
          </p>
        </div>
      </div>

      {/* Leave Quota Balance Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1.25rem',
        marginBottom: '2rem'
      }}>
        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Paid Annual Leave
          </span>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary)', marginTop: '0.2rem' }}>
            {currentUser?.leaveBalances?.paid || 0} Days
          </div>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Accrued per policy</span>
        </div>

        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Medical / Sick Leave
          </span>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--warning)', marginTop: '0.2rem' }}>
            {currentUser?.leaveBalances?.sick || 0} Days
          </div>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>For health & recovery</span>
        </div>

        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Casual Leave
          </span>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--secondary)', marginTop: '0.2rem' }}>
            {currentUser?.leaveBalances?.casual || 0} Days
          </div>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>For urgent personal tasks</span>
        </div>

        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Unpaid Leave
          </span>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--info)', marginTop: '0.2rem' }}>
            Flexible
          </div>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Requires HR approval</span>
        </div>
      </div>

      {/* Main Two Column Section: Application Form & Request History */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '1.75rem'
      }}>
        {/* Left: Apply for Leave Form */}
        <div className="glass-card" style={{ padding: '1.75rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.35rem' }}>
            Apply for Time-Off
          </h3>
          <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            Select leave category, dates, and provide a brief rationale
          </p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">
                <span>Leave Type</span>
                {leaveType !== 'Unpaid' && (
                  <span style={{ fontSize: '0.78rem', color: 'var(--primary)', fontWeight: 700 }}>
                    {availableBalance} Days Available
                  </span>
                )}
              </label>
              <select
                className="form-select"
                value={leaveType}
                onChange={(e) => setLeaveType(e.target.value)}
              >
                <option value="Paid">Paid Annual Leave</option>
                <option value="Sick">Sick / Medical Leave</option>
                <option value="Casual">Casual Leave</option>
                <option value="Unpaid">Unpaid Leave</option>
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div className="form-group">
                <label className="form-label">Start Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">End Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Duration Banner */}
            <div style={{
              background: 'var(--bg-hover)',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              marginBottom: '1.25rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '0.85rem'
            }}>
              <span style={{ color: 'var(--text-muted)' }}>Total Calculated Duration:</span>
              <strong style={{ color: 'var(--primary)', fontSize: '1rem' }}>
                {calculatedDays} Day{calculatedDays > 1 ? 's' : ''}
              </strong>
            </div>

            <div className="form-group">
              <label className="form-label">Reason / Remarks *</label>
              <textarea
                rows={3}
                className="form-textarea"
                placeholder="State the purpose of your leave request..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={loading || calculatedDays <= 0 || (leaveType !== 'Unpaid' && calculatedDays > availableBalance)}
              style={{ width: '100%', marginTop: '0.5rem' }}
            >
              <Send size={16} />
              <span>{loading ? 'Submitting...' : 'Submit Leave Application'}</span>
            </button>
          </form>
        </div>

        {/* Right: Request History */}
        <div className="glass-card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.35rem' }}>
            My Leave Request Status
          </h3>
          <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
            Track approval timeline and review feedback from HR
          </p>

          {myRequests.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <PlaneTakeoff size={36} color="var(--primary)" style={{ opacity: 0.5, marginBottom: '0.5rem' }} />
              <div>No leave applications submitted yet.</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', flex: 1, overflowY: 'auto' }}>
              {myRequests.map((req) => (
                <div
                  key={req.id}
                  style={{
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-hover)',
                    border: '1px solid var(--border-subtle)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                    <div>
                      <span className={`badge ${
                        req.leaveType === 'Paid' ? 'badge-primary' : req.leaveType === 'Sick' ? 'badge-warning' : 'badge-info'
                      }`}>
                        {req.leaveType} Leave
                      </span>
                      <span style={{ fontWeight: 700, fontSize: '0.9rem', marginLeft: '0.5rem' }}>
                        {req.days} Day{req.days > 1 ? 's' : ''}
                      </span>
                    </div>

                    <span className={`badge ${
                      req.status === 'Approved' ? 'badge-success' : req.status === 'Rejected' ? 'badge-danger' : 'badge-warning'
                    }`}>
                      {req.status}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                    📅 {req.startDate} to {req.endDate} • Applied on {req.appliedOn}
                  </div>

                  <div style={{ fontSize: '0.825rem', color: 'var(--text-main)', fontStyle: 'italic' }}>
                    "{req.reason}"
                  </div>

                  {req.reviewerComments && (
                    <div style={{
                      marginTop: '0.6rem',
                      padding: '0.5rem 0.75rem',
                      borderRadius: '6px',
                      background: req.status === 'Approved' ? 'var(--success-light)' : 'var(--danger-light)',
                      fontSize: '0.78rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem'
                    }}>
                      <MessageSquare size={13} color={req.status === 'Approved' ? 'var(--success)' : 'var(--danger)'} />
                      <span><strong>HR Remarks:</strong> {req.reviewerComments}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
