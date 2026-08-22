import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useApp } from '../../context/AppContext';
import { Send, Upload } from 'lucide-react';

export const ApplyLeaveModal = ({ isOpen, onClose }) => {
  const { currentUser, applyLeave } = useApp();

  const [leaveType, setLeaveType] = useState('Paid'); // 'Paid' | 'Sick' | 'Unpaid' | 'Casual'
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date(Date.now() + 86400000).toISOString().split('T')[0]);
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [attachment, setAttachment] = useState(null);

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
      setAttachment(null);
      setLoading(false);
      onClose();
    }, 300);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Time off Type Request" maxWidth="450px">
      <form onSubmit={handleSubmit} style={{ padding: '1.5rem', margin: '-1.5rem', background: '#0f172a', color: 'white', borderRadius: '0 0 var(--radius-lg) var(--radius-lg)' }}>
        
        <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
          <label style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Employee</label>
          <div style={{ color: '#38bdf8', fontWeight: 600 }}>[{currentUser?.fullName || 'Employee'}]</div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
          <label style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Time off Type</label>
          <select
            style={{ 
              background: 'transparent', 
              color: '#38bdf8', 
              border: 'none', 
              outline: 'none', 
              fontWeight: 600, 
              cursor: 'pointer',
              appearance: 'none',
              padding: 0
            }}
            value={leaveType}
            onChange={(e) => setLeaveType(e.target.value)}
          >
            <option value="Paid" style={{ color: 'black' }}>[Paid time off]</option>
            <option value="Sick" style={{ color: 'black' }}>[Sick Leave]</option>
            <option value="Unpaid" style={{ color: 'black' }}>[Unpaid Leaves]</option>
          </select>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
          <label style={{ fontSize: '0.85rem', color: '#94a3b8', whiteSpace: 'nowrap' }}>Validity Period</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', overflow: 'hidden' }}>
            <input 
              type="date" 
              value={startDate} 
              onChange={e => setStartDate(e.target.value)}
              style={{ background: 'transparent', color: '#38bdf8', border: 'none', outline: 'none', width: '100%', maxWidth: '110px' }} 
              required
            />
            <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>To</span>
            <input 
              type="date" 
              value={endDate} 
              onChange={e => setEndDate(e.target.value)}
              style={{ background: 'transparent', color: '#38bdf8', border: 'none', outline: 'none', width: '100%', maxWidth: '110px' }} 
              required
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
          <label style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Allocation</label>
          <div style={{ color: '#38bdf8', fontWeight: 600 }}>
            {calculatedDays < 10 ? `0${calculatedDays}.00` : `${calculatedDays}.00`} Days
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem' }}>
          <label style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Reason</label>
          <input
            type="text"
            placeholder="Brief rationale..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            style={{ background: 'transparent', color: 'white', border: '1px solid #334155', borderRadius: '4px', padding: '0.25rem 0.5rem' }}
            required
          />
        </div>

        {leaveType === 'Sick' && (
          <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem' }}>
            <label style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Attachment:</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#94a3b8', fontSize: '0.85rem' }}>
              <label style={{ cursor: 'pointer', background: '#2563eb', color: 'white', width: '24px', height: '24px', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Upload size={14} />
                <input type="file" style={{ display: 'none' }} onChange={(e) => setAttachment(e.target.files[0])} />
              </label>
              <span>(For sick leave certificate)</span>
              {attachment && <span style={{ color: '#38bdf8' }}>{attachment.name}</span>}
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-start', marginTop: '1.5rem' }}>
          <button
            type="submit"
            style={{
              background: '#d946ef',
              color: 'white',
              border: 'none',
              padding: '0.4rem 1rem',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.85rem'
            }}
            disabled={loading || calculatedDays <= 0 || (leaveType !== 'Unpaid' && calculatedDays > availableBalance)}
          >
            Submit
          </button>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'transparent',
              color: '#94a3b8',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.85rem'
            }}
          >
            Discard
          </button>
        </div>
      </form>
    </Modal>
  );
};
