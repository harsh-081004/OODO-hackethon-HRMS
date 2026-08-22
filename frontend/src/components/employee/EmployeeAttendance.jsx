import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  CalendarCheck,
  Clock,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Play,
  Square,
  Sparkles
} from 'lucide-react';

export const EmployeeAttendance = () => {
  const { currentUser, attendance, checkIn, checkOut } = useApp();

  const today = new Date().toISOString().split('T')[0];
  const userTodayAttendance = attendance.find(
    a => (a.employeeId === currentUser?.id || a.loginId === currentUser?.loginId) && a.date === today
  );

  const isCheckedIn = userTodayAttendance && userTodayAttendance.checkIn && !userTodayAttendance.checkOut;

  // Filter attendance records for current employee only
  const myAttendanceRecords = attendance.filter(
    a => a.employeeId === currentUser?.id || a.loginId === currentUser?.loginId
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
          <h2 style={{ fontSize: '1.65rem', fontWeight: 800 }}>My Attendance & Timesheet</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
            Daily check-in / check-out history, worked hours, and presence compliance logs
          </p>
        </div>

        {/* Fast Punch CTA */}
        {isCheckedIn ? (
          <button
            onClick={() => checkOut(currentUser.id)}
            className="btn btn-danger btn-lg"
          >
            <Square size={16} fill="white" />
            <span>Clock Out ({userTodayAttendance.checkIn})</span>
          </button>
        ) : (
          <button
            onClick={() => checkIn(currentUser.id)}
            className="btn btn-success btn-lg"
          >
            <Play size={16} fill="white" />
            <span>{userTodayAttendance?.checkOut ? 'Clock In Again' : 'Clock In for Today'}</span>
          </button>
        )}
      </div>

      {/* Summary KPI Highlights */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1.25rem',
        marginBottom: '2rem'
      }}>
        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Count of days present
          </span>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: '0.2rem', color: 'var(--primary)' }}>
            21 Days
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Leaves count
          </span>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: '0.2rem', color: 'var(--warning)' }}>
            02 Days
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Total working days
          </span>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: '0.2rem', color: 'var(--secondary)' }}>
            23 Days
          </div>
        </div>
      </div>

      {/* Attendance History Table */}
      <div className="glass-card" style={{ overflowX: 'auto' }}>
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-subtle)' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Punch Timesheet History</h3>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ background: 'var(--bg-hover)', borderBottom: '1px solid var(--border-subtle)', textAlign: 'left' }}>
              <th style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>Date</th>
              <th style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>Check In</th>
              <th style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>Check Out</th>
              <th style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>Work Hours</th>
              <th style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>Extra hours</th>
              <th style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {myAttendanceRecords.map((att) => (
              <tr key={att.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <td style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Calendar size={14} color="var(--primary)" />
                    <span>{att.date}</span>
                    {att.date === today && <span className="badge badge-primary" style={{ fontSize: '0.65rem' }}>Today</span>}
                  </div>
                </td>

                <td style={{ padding: '0.85rem 1rem' }}>
                  {att.checkIn ? (
                    <span style={{ color: 'var(--success)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={14} /> {att.checkIn}
                    </span>
                  ) : (
                    <span style={{ color: 'var(--text-subtle)' }}>--:--</span>
                  )}
                </td>

                <td style={{ padding: '0.85rem 1rem' }}>
                  {att.checkOut ? (
                    <span style={{ color: 'var(--info)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={14} /> {att.checkOut}
                    </span>
                  ) : (
                    <span style={{ color: 'var(--text-subtle)' }}>{att.checkIn ? 'In Progress' : '--:--'}</span>
                  )}
                </td>

                <td style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>
                  {att.hoursWorked > 0 ? (
                    <span>{att.hoursWorked < 10 ? `0${att.hoursWorked.toFixed(2)}` : att.hoursWorked.toFixed(2)}</span>
                  ) : (
                    <span style={{ color: 'var(--text-subtle)' }}>--:--</span>
                  )}
                </td>

                <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: (att.extraHours > 0) ? 'var(--primary)' : 'var(--text-subtle)' }}>
                  {att.extraHours > 0 ? (
                    <span>{att.extraHours < 10 ? `0${att.extraHours.toFixed(2)}` : att.extraHours.toFixed(2)}</span>
                  ) : (
                    <span>00.00</span>
                  )}
                </td>

                <td style={{ padding: '0.85rem 1rem' }}>
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
  );
};
