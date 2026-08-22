import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ApplyLeaveModal } from './ApplyLeaveModal';
import { PlusCircle } from 'lucide-react';

export const EmployeeLeave = () => {
  const { currentUser, leaveRequests } = useApp();
  const [isApplyOpen, setIsApplyOpen] = useState(false);

  const [selectionStart, setSelectionStart] = useState(null);
  const [selectionEnd, setSelectionEnd] = useState(null);

  const currentYear = new Date().getFullYear();
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();

  const handleDateClick = (d, mIndex, year) => {
    const dateStr = `${year}-${String(mIndex + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const dateObj = new Date(dateStr);
    dateObj.setHours(0, 0, 0, 0);

    if (!selectionStart || (selectionStart && selectionEnd)) {
      setSelectionStart(dateObj);
      setSelectionEnd(null);
    } else if (selectionStart && !selectionEnd) {
      if (dateObj >= selectionStart) {
        setSelectionEnd(dateObj);
      } else {
        setSelectionStart(dateObj);
      }
    }
  };

  const isSelected = (d, m, y) => {
    if (!selectionStart) return false;
    const dateStr = `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const dateObj = new Date(dateStr);
    dateObj.setHours(0, 0, 0, 0);

    if (selectionEnd) {
      return dateObj >= selectionStart && dateObj <= selectionEnd;
    }
    return dateObj.getTime() === selectionStart.getTime();
  };

  // Helper to check if a date is within an approved/pending leave request
  const getLeaveStatusForDate = (day, month, year) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dateObj = new Date(dateStr);
    dateObj.setHours(0, 0, 0, 0);
    
    // Find matching request
    const myRequests = leaveRequests.filter(r => r.employeeId === currentUser?.id || r.loginId === currentUser?.loginId);
    
    for (const req of myRequests) {
      const s = new Date(req.startDate);
      s.setHours(0, 0, 0, 0);
      const e = new Date(req.endDate);
      e.setHours(0, 0, 0, 0);
      if (dateObj >= s && dateObj <= e) {
        return { type: req.leaveType, status: req.status };
      }
    }
    return null;
  };

  return (
    <div className="page-wrapper animate-fade-in" style={{ paddingBottom: '3rem' }}>
      
      {/* Top Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '1rem'
      }}>
        <button 
          onClick={() => setIsApplyOpen(true)}
          className="btn"
          style={{ background: '#d946ef', color: 'white', fontWeight: 700, padding: '0.4rem 1.25rem', borderRadius: '4px', border: 'none' }}
        >
          {selectionStart ? 'APPLY FOR SELECTED DATES' : 'NEW'}
        </button>
      </div>

      {/* Quota Overview */}
      <div style={{
        display: 'flex',
        gap: '4rem',
        marginBottom: '2rem',
        padding: '1rem 0',
        borderBottom: '1px solid var(--border-subtle)'
      }}>
        <div>
          <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#38bdf8' }}>Paid time Off</span>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-main)', marginTop: '0.2rem' }}>
            {currentUser?.leaveBalances?.paid || 0} Days Available
          </div>
        </div>
        <div>
          <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#38bdf8' }}>Sick time off</span>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-main)', marginTop: '0.2rem' }}>
            {currentUser?.leaveBalances?.sick || 0} Days Available
          </div>
        </div>
        <div>
          <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#38bdf8' }}>Unpaid Leaves</span>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-main)', marginTop: '0.2rem' }}>
            Flexible
          </div>
        </div>
      </div>

      {/* 12-Month Calendar Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '2rem'
      }}>
        {months.map((monthName, mIndex) => {
          const daysInMonth = getDaysInMonth(mIndex, currentYear);
          const firstDay = getFirstDayOfMonth(mIndex, currentYear);
          
          const blanks = Array.from({ length: firstDay }, (_, i) => i);
          const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

          return (
            <div key={monthName} style={{ background: 'var(--bg-main)', border: 'none' }}>
              <div style={{ fontWeight: 800, fontSize: '0.9rem', marginBottom: '0.75rem', textAlign: 'center' }}>
                {monthName} {currentYear}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', textAlign: 'center', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                <div>S</div><div>M</div><div>T</div><div>W</div><div>T</div><div>F</div><div>S</div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', textAlign: 'center', fontSize: '0.75rem' }}>
                {blanks.map(b => <div key={`blank-${b}`} />)}
                {days.map(d => {
                  const leaveStatus = getLeaveStatusForDate(d, mIndex, currentYear);
                  let bgColor = 'transparent';
                  let color = 'var(--text-main)';
                  let border = 'none';

                  const selected = isSelected(d, mIndex, currentYear);

                  if (leaveStatus) {
                    if (leaveStatus.status === 'Approved') {
                      bgColor = leaveStatus.type === 'Sick' ? '#fbbf24' : '#ef4444'; // specific colors per wireframe
                      color = 'white';
                    } else if (leaveStatus.status === 'Pending') {
                      border = '1px solid #38bdf8';
                      color = '#38bdf8';
                    }
                  } else if (selected) {
                    bgColor = 'rgba(217, 70, 239, 0.15)'; // #d946ef
                    color = '#d946ef';
                    border = '1px solid #d946ef';
                  }

                  const isToday = d === new Date().getDate() && mIndex === new Date().getMonth() && currentYear === new Date().getFullYear();
                  if (isToday && !leaveStatus && !selected) {
                    bgColor = 'rgba(56, 189, 248, 0.1)';
                    color = '#38bdf8';
                    border = '1px solid #38bdf8';
                  }

                  return (
                    <div 
                      key={d} 
                      onClick={() => handleDateClick(d, mIndex, currentYear)}
                      style={{ 
                        padding: '0.35rem 0', 
                        borderRadius: '50%',
                        background: bgColor,
                        color: color,
                        border: border,
                        fontWeight: (leaveStatus || isToday || selected) ? 800 : 500,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '24px',
                        height: '24px',
                        margin: '0 auto',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        if (!leaveStatus && !selected) e.currentTarget.style.background = 'var(--bg-hover)';
                      }}
                      onMouseLeave={(e) => {
                        if (!leaveStatus && !selected && !isToday) e.currentTarget.style.background = 'transparent';
                        if (isToday && !leaveStatus && !selected) e.currentTarget.style.background = 'rgba(56, 189, 248, 0.1)';
                      }}
                    >
                      {d}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {isApplyOpen && (
        <ApplyLeaveModal 
          isOpen={isApplyOpen} 
          onClose={() => setIsApplyOpen(false)} 
          initialStartDate={selectionStart}
          initialEndDate={selectionEnd || selectionStart}
        />
      )}
    </div>
  );
};
