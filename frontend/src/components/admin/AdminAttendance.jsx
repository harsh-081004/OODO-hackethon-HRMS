import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  CalendarCheck,
  Calendar as CalendarIcon,
  Download,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  XCircle,
  AlertTriangle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export const AdminAttendance = () => {
  const { employees, attendance, setAttendance, addToast } = useApp();

  const [viewType, setViewType] = useState('daily'); // 'daily' | 'weekly'
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Days of week helper for weekly view
  const getWeekDays = (baseDateStr) => {
    const base = new Date(baseDateStr);
    const day = base.getDay();
    const diff = base.getDate() - day + (day === 0 ? -6 : 1); // Monday start
    const monday = new Date(base.setDate(diff));

    const week = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      week.push(d.toISOString().split('T')[0]);
    }
    return week;
  };

  const currentWeekDays = getWeekDays(selectedDate);

  // Manual status change by HR
  const handleUpdateStatus = (employeeId, date, newStatus) => {
    setAttendance(prev => {
      const existingIndex = prev.findIndex(a => a.employeeId === employeeId && a.date === date);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          status: newStatus,
          checkIn: newStatus === 'Present' ? (updated[existingIndex].checkIn || '09:00 AM') : null,
          checkOut: newStatus === 'Present' ? (updated[existingIndex].checkOut || '06:00 PM') : null
        };
        return updated;
      } else {
        const emp = employees.find(e => e.id === employeeId);
        return [
          {
            id: `ATT-${Date.now().toString().slice(-4)}`,
            employeeId,
            employeeName: emp?.fullName || 'Employee',
            loginId: emp?.loginId || 'ID',
            date,
            checkIn: newStatus === 'Present' ? '09:00 AM' : null,
            checkOut: newStatus === 'Present' ? '06:00 PM' : null,
            status: newStatus,
            hoursWorked: newStatus === 'Present' ? 9 : 0,
            device: 'HR Manual Entry'
          },
          ...prev
        ];
      }
    });

    addToast('Attendance Updated', `Status marked as ${newStatus} for ${date}`, 'success');
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['Employee Name', 'Login ID', 'Date', 'Check In', 'Check Out', 'Hours Worked', 'Status', 'Device'];
    const rows = attendance.map(a => [
      `"${a.employeeName}"`,
      `"${a.loginId}"`,
      `"${a.date}"`,
      `"${a.checkIn || '-'}"`,
      `"${a.checkOut || '-'}"`,
      `"${a.hoursWorked || 0}"`,
      `"${a.status}"`,
      `"${a.device || '-'}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Dayflow_Attendance_${selectedDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast('Export Successful', 'Attendance register downloaded as CSV.', 'success');
  };

  // Filtered employees
  const filteredEmployees = employees.filter(e =>
    e.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.loginId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.department.toLowerCase().includes(searchTerm.toLowerCase())
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
          <h2 style={{ fontSize: '1.65rem', fontWeight: 800 }}>Company Attendance Roster</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
            Daily and weekly timesheet tracking, punch records, and manual status adjustments
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={handleExportCSV}
            className="btn btn-secondary"
          >
            <Download size={16} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Control Bar */}
      <div className="glass-card" style={{ padding: '1rem 1.25rem', marginBottom: '1.5rem' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          {/* View Mode & Date Selection */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              display: 'flex',
              background: 'var(--bg-hover)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              padding: '2px'
            }}>
              <button
                onClick={() => setViewType('daily')}
                className="btn btn-sm"
                style={{
                  background: viewType === 'daily' ? 'var(--primary)' : 'transparent',
                  color: viewType === 'daily' ? 'white' : 'var(--text-main)',
                  borderRadius: '6px'
                }}
              >
                Daily View
              </button>
              <button
                onClick={() => setViewType('weekly')}
                className="btn btn-sm"
                style={{
                  background: viewType === 'weekly' ? 'var(--primary)' : 'transparent',
                  color: viewType === 'weekly' ? 'white' : 'var(--text-main)',
                  borderRadius: '6px'
                }}
              >
                Weekly Matrix
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <CalendarIcon size={16} color="var(--primary)" />
              <input
                type="date"
                className="form-input"
                style={{ width: 'auto', padding: '0.4rem 0.75rem', fontSize: '0.85rem' }}
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
          </div>

          {/* Search & Status Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{
                position: 'absolute',
                left: '0.75rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-subtle)'
              }} />
              <input
                type="text"
                className="form-input"
                style={{ paddingLeft: '2.25rem', width: '220px', fontSize: '0.85rem' }}
                placeholder="Search employee / Login ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {viewType === 'daily' && (
              <select
                className="form-select"
                style={{ width: 'auto', fontSize: '0.85rem' }}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All Statuses</option>
                <option value="Present">Present</option>
                <option value="Absent">Absent</option>
                <option value="Half-day">Half-day</option>
                <option value="Leave">Leave</option>
              </select>
            )}
          </div>
        </div>
      </div>

      {/* DAILY VIEW */}
      {viewType === 'daily' && (
        <div className="glass-card" style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ background: 'var(--bg-hover)', borderBottom: '1px solid var(--border-subtle)', textAlign: 'left' }}>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>Employee</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>Login ID</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>Check In</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>Check Out</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>Device / Terminal</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>Status</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 700, textAlign: 'right' }}>Admin Override</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((emp) => {
                const record = attendance.find(a => (a.employeeId === emp.id || a.loginId === emp.loginId) && a.date === selectedDate);
                const status = record?.status || 'Absent';

                if (statusFilter !== 'All' && status !== statusFilter) {
                  return null;
                }

                return (
                  <tr
                    key={emp.id}
                    style={{ borderBottom: '1px solid var(--border-subtle)', transition: 'background var(--transition-fast)' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-hover)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <img
                          src={emp.avatar}
                          alt={emp.fullName}
                          style={{ width: '32px', height: '32px', borderRadius: '8px', objectFit: 'cover' }}
                        />
                        <div>
                          <div style={{ fontWeight: 700 }}>{emp.fullName}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{emp.department}</div>
                        </div>
                      </div>
                    </td>

                    <td style={{ padding: '0.85rem 1rem' }}>
                      <code className="font-mono" style={{ fontWeight: 700, color: 'var(--primary)' }}>
                        {emp.loginId}
                      </code>
                    </td>

                    <td style={{ padding: '0.85rem 1rem' }}>
                      {record?.checkIn ? (
                        <span style={{ color: 'var(--success)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Clock size={14} /> {record.checkIn}
                        </span>
                      ) : (
                        <span style={{ color: 'var(--text-subtle)' }}>--:--</span>
                      )}
                    </td>

                    <td style={{ padding: '0.85rem 1rem' }}>
                      {record?.checkOut ? (
                        <span style={{ color: 'var(--info)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Clock size={14} /> {record.checkOut}
                        </span>
                      ) : (
                        <span style={{ color: 'var(--text-subtle)' }}>--:--</span>
                      )}
                    </td>

                    <td style={{ padding: '0.85rem 1rem', color: 'var(--text-muted)' }}>
                      {record?.device || 'Portal'}
                    </td>

                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span className={`badge ${
                        status === 'Present' ? 'badge-success' : status === 'Half-day' ? 'badge-warning' : status === 'Leave' ? 'badge-info' : 'badge-danger'
                      }`}>
                        {status}
                      </span>
                    </td>

                    <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                      <select
                        className="form-select"
                        style={{ width: 'auto', padding: '0.25rem 0.5rem', fontSize: '0.78rem', display: 'inline-block' }}
                        value={status}
                        onChange={(e) => handleUpdateStatus(emp.id, selectedDate, e.target.value)}
                      >
                        <option value="Present">Present</option>
                        <option value="Absent">Absent</option>
                        <option value="Half-day">Half-day</option>
                        <option value="Leave">Leave</option>
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* WEEKLY MATRIX VIEW */}
      {viewType === 'weekly' && (
        <div className="glass-card" style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ background: 'var(--bg-hover)', borderBottom: '1px solid var(--border-subtle)' }}>
                <th style={{ padding: '0.85rem 1rem', textAlign: 'left', fontWeight: 700, minWidth: '180px' }}>
                  Employee
                </th>
                {currentWeekDays.map(dayStr => {
                  const d = new Date(dayStr);
                  const isToday = dayStr === new Date().toISOString().split('T')[0];
                  return (
                    <th key={dayStr} style={{
                      padding: '0.85rem 0.5rem',
                      textAlign: 'center',
                      fontWeight: 700,
                      background: isToday ? 'var(--primary-light)' : 'transparent',
                      color: isToday ? 'var(--primary)' : 'inherit'
                    }}>
                      <div>{d.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-muted)' }}>{dayStr.substring(5)}</div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((emp) => (
                <tr key={emp.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <div style={{ fontWeight: 700 }}>{emp.fullName}</div>
                    <code className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {emp.loginId}
                    </code>
                  </td>

                  {currentWeekDays.map(dayStr => {
                    const record = attendance.find(a => (a.employeeId === emp.id || a.loginId === emp.loginId) && a.date === dayStr);
                    const status = record?.status || 'Absent';
                    const isToday = dayStr === new Date().toISOString().split('T')[0];

                    return (
                      <td key={dayStr} style={{
                        padding: '0.65rem 0.4rem',
                        textAlign: 'center',
                        background: isToday ? 'rgba(113, 75, 103, 0.04)' : 'transparent'
                      }}>
                        <span className={`badge ${
                          status === 'Present' ? 'badge-success' : status === 'Half-day' ? 'badge-warning' : status === 'Leave' ? 'badge-info' : 'badge-danger'
                        }`} style={{ fontSize: '0.68rem', padding: '0.2rem 0.45rem' }}>
                          {status === 'Present' ? 'P' : status === 'Half-day' ? 'HD' : status === 'Leave' ? 'L' : 'A'}
                        </span>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
