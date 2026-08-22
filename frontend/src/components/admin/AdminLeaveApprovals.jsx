import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import {
  PlaneTakeoff,
  CheckCircle2,
  XCircle,
  Clock,
  MessageSquare,
  User,
  Calendar,
  AlertCircle,
  Sparkles
} from 'lucide-react';

export const AdminLeaveApprovals = () => {
  const { leaveRequests, reviewLeave, employees } = useApp();

  const [activeFilter, setActiveFilter] = useState('All'); // 'All' | 'Pending' | 'Approved' | 'Rejected'
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [actionType, setActionType] = useState(null); // 'Approved' | 'Rejected'
  const [comments, setComments] = useState('');

  const filteredRequests = leaveRequests.filter(r => {
    if (activeFilter === 'All') return true;
    return r.status === activeFilter;
  });

  const handleOpenReview = (req, type) => {
    setSelectedRequest(req);
    setActionType(type);
    setComments(type === 'Approved' ? 'Approved by HR Operations.' : 'Request could not be accommodated due to staffing requirements.');
  };

  const handleConfirmReview = (e) => {
    e.preventDefault();
    if (!selectedRequest || !actionType) return;

    reviewLeave(selectedRequest.id, actionType, comments);
    setSelectedRequest(null);
    setActionType(null);
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
          <h2 style={{ fontSize: '1.65rem', fontWeight: 800 }}>Leave & Time-Off Approvals</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
            Review staff time-off requests, provide remarks, and automatically balance quotas
          </p>
        </div>

        {/* Filter Pills */}
        <div style={{
          display: 'flex',
          background: 'var(--bg-hover)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)',
          padding: '3px'
        }}>
          {['All', 'Pending', 'Approved', 'Rejected'].map(filter => {
            const count = filter === 'All'
              ? leaveRequests.length
              : leaveRequests.filter(r => r.status === filter).length;

            return (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className="btn btn-sm"
                style={{
                  background: activeFilter === filter ? 'var(--primary)' : 'transparent',
                  color: activeFilter === filter ? 'white' : 'var(--text-main)',
                  borderRadius: '6px',
                  fontWeight: 600
                }}
              >
                {filter} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Leave Requests Table */}
      <div className="glass-card" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ background: 'var(--bg-hover)', borderBottom: '1px solid var(--border-subtle)', textAlign: 'left' }}>
              <th style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>Employee</th>
              <th style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>Leave Type</th>
              <th style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>Duration / Dates</th>
              <th style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>Days</th>
              <th style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>Reason / Remarks</th>
              <th style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>Status</th>
              <th style={{ padding: '0.85rem 1rem', fontWeight: 700, textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                  No leave requests found for filter "{activeFilter}".
                </td>
              </tr>
            ) : (
              filteredRequests.map((req) => {
                const emp = employees.find(e => e.id === req.employeeId || e.loginId === req.loginId);

                return (
                  <tr
                    key={req.id}
                    style={{ borderBottom: '1px solid var(--border-subtle)', transition: 'background var(--transition-fast)' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-hover)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <img
                          src={emp?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${req.employeeName}`}
                          alt={req.employeeName}
                          style={{ width: '34px', height: '34px', borderRadius: '10px', objectFit: 'cover' }}
                        />
                        <div>
                          <div style={{ fontWeight: 700 }}>{req.employeeName}</div>
                          <code className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--primary)' }}>
                            {req.loginId}
                          </code>
                        </div>
                      </div>
                    </td>

                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span className={`badge ${
                        req.leaveType === 'Paid' ? 'badge-primary' : req.leaveType === 'Sick' ? 'badge-warning' : 'badge-info'
                      }`}>
                        {req.leaveType} Leave
                      </span>
                    </td>

                    <td style={{ padding: '0.85rem 1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Calendar size={14} color="var(--text-subtle)" />
                        <span>{req.startDate} to {req.endDate}</span>
                      </div>
                    </td>

                    <td style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>
                      {req.days} Day{req.days > 1 ? 's' : ''}
                    </td>

                    <td style={{ padding: '0.85rem 1rem', maxWidth: '280px' }}>
                      <div style={{ color: 'var(--text-main)', fontSize: '0.825rem' }}>
                        "{req.reason}"
                      </div>
                      {req.reviewerComments && (
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <MessageSquare size={12} color="var(--primary)" />
                          <span>HR: {req.reviewerComments}</span>
                        </div>
                      )}
                    </td>

                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span className={`badge ${
                        req.status === 'Approved' ? 'badge-success' : req.status === 'Rejected' ? 'badge-danger' : 'badge-warning'
                      }`}>
                        {req.status}
                      </span>
                    </td>

                    <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                      {req.status === 'Pending' ? (
                        <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                          <button
                            onClick={() => handleOpenReview(req, 'Approved')}
                            className="btn btn-success btn-sm"
                            style={{ padding: '0.35rem 0.65rem' }}
                            title="Approve Request"
                          >
                            <CheckCircle2 size={15} />
                            <span>Approve</span>
                          </button>
                          <button
                            onClick={() => handleOpenReview(req, 'Rejected')}
                            className="btn btn-danger btn-sm"
                            style={{ padding: '0.35rem 0.65rem' }}
                            title="Reject Request"
                          >
                            <XCircle size={15} />
                            <span>Reject</span>
                          </button>
                        </div>
                      ) : (
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          Reviewed
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Review Modal */}
      {selectedRequest && (
        <Modal
          isOpen={!!selectedRequest}
          onClose={() => setSelectedRequest(null)}
          title={`Review Leave Application: ${selectedRequest.employeeName}`}
          maxWidth="520px"
        >
          <form onSubmit={handleConfirmReview}>
            <div style={{
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              background: actionType === 'Approved' ? 'var(--success-light)' : 'var(--danger-light)',
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}>
              {actionType === 'Approved' ? (
                <CheckCircle2 size={24} color="var(--success)" />
              ) : (
                <XCircle size={24} color="var(--danger)" />
              )}
              <div>
                <strong style={{ fontSize: '0.95rem', color: actionType === 'Approved' ? 'var(--success)' : 'var(--danger)' }}>
                  Action: {actionType} Leave
                </strong>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {selectedRequest.days} day(s) of {selectedRequest.leaveType} Leave ({selectedRequest.startDate} to {selectedRequest.endDate})
                </p>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="hrRemarks">
                HR Reviewer Comments / Feedback *
              </label>
              <textarea
                id="hrRemarks"
                rows={3}
                className="form-textarea"
                placeholder="Provide notes visible to the employee..."
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                required
              />
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setSelectedRequest(null)}
                style={{ flex: 1 }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`btn ${actionType === 'Approved' ? 'btn-success' : 'btn-danger'}`}
                style={{ flex: 1.5 }}
              >
                Confirm {actionType}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
