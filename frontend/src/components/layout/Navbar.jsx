import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sun,
  Moon,
  Clock,
  LogOut,
  Bell,
  User,
  Shield,
  RotateCcw,
  Sparkles,
  ChevronDown,
  Play,
  Square,
  Building,
  CheckCircle2,
  Server,
  Wifi,
  WifiOff,
  RefreshCw
} from 'lucide-react';

export const Navbar = ({ activeTab, setActiveTab }) => {
  const {
    theme,
    toggleTheme,
    currentUser,
    setCurrentUser,
    employees,
    logout,
    company,
    attendance,
    checkIn,
    checkOut,
    leaveRequests,
    resetDemoData,
    backendConnected,
    checkBackendHealth,
    refreshBackendData
  } = useApp();

  const [time, setTime] = useState(new Date());
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isPinging, setIsPinging] = useState(false);

  // Live digital clock
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Today's attendance status for current user
  const today = new Date().toISOString().split('T')[0];
  const userTodayAttendance = attendance.find(
    a => (a.employeeId === currentUser?.id || a.loginId === currentUser?.loginId || a.employeeId === currentUser?._id) && a.date === today
  );

  const isCheckedIn = userTodayAttendance && userTodayAttendance.checkIn && !userTodayAttendance.checkOut;

  // Pending leaves count for notifications
  const pendingLeavesCount = leaveRequests.filter(r => r.status === 'Pending').length;

  const handlePingServer = async () => {
    setIsPinging(true);
    await checkBackendHealth();
    if (currentUser) {
      await refreshBackendData(currentUser);
    }
    setTimeout(() => setIsPinging(false), 500);
  };

  return (
    <header style={{
      height: '70px',
      padding: '0 2rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      background: 'var(--bg-card-glass)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-subtle)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      {/* Left: Brand & Organization */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{
          width: '2.4rem',
          height: '2.4rem',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, var(--primary) 0%, #875A7B 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 800,
          fontSize: '1.1rem',
          boxShadow: '0 4px 10px var(--primary-glow)'
        }}>
          {company.code || 'OI'}
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-main)' }}>
              {company.name}
            </span>
            <span className="badge badge-primary" style={{ fontSize: '0.68rem', padding: '0.15rem 0.5rem' }}>
              Dayflow HRMS
            </span>

            {/* Backend Connection Status Badge */}
            <button
              onClick={handlePingServer}
              className={`badge ${backendConnected ? 'badge-success' : 'badge-warning'}`}
              style={{
                fontSize: '0.68rem',
                padding: '0.15rem 0.55rem',
                cursor: 'pointer',
                border: 'none',
                gap: '0.3rem'
              }}
              title={backendConnected ? 'Connected to Node.js Backend (:5000). Click to re-sync.' : 'Backend offline or starting. Click to ping server.'}
            >
              {backendConnected ? (
                <>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'currentColor' }} />
                  <span>API :5000</span>
                </>
              ) : (
                <>
                  <WifiOff size={10} />
                  <span>Demo Mode</span>
                </>
              )}
              {isPinging && <RefreshCw size={10} className="animate-spin" />}
            </button>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {currentUser?.role === 'admin'
              ? 'CEO & Executive Management Console'
              : currentUser?.department === 'Human Resources'
              ? 'HR Operations & Employee Portal'
              : 'Employee Self-Service Portal'}
          </span>
        </div>
      </div>

      {/* Middle: Live Clock & Quick Check-In Punch Widget */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.4rem 0.85rem',
          borderRadius: 'var(--radius-md)',
          background: 'var(--bg-hover)',
          border: '1px solid var(--border-subtle)',
          fontSize: '0.85rem',
          fontWeight: 600,
          color: 'var(--text-main)'
        }}>
          <Clock size={16} color="var(--primary)" />
          <span className="font-mono">
            {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}
          </span>
        </div>

        {/* Quick Check-In / Check-Out Action Button (Only for regular staff/HR, not CEO) */}
        {currentUser?.role !== 'admin' && (
          isCheckedIn ? (
            <button
              onClick={() => checkOut(currentUser?.id)}
              className="btn btn-danger btn-sm"
              style={{
                boxShadow: '0 2px 8px rgba(239, 68, 68, 0.25)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
            >
              <Square size={14} fill="white" />
              <span>Check Out ({userTodayAttendance.checkIn})</span>
            </button>
          ) : (
            <button
              onClick={() => checkIn(currentUser?.id)}
              className="btn btn-success btn-sm"
              style={{
                boxShadow: '0 2px 8px rgba(16, 185, 129, 0.25)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
            >
              <Play size={14} fill="white" />
              <span>{userTodayAttendance?.checkOut ? 'Checked Out Today' : 'Punch In Now'}</span>
            </button>
          )
        )}
      </div>

      {/* Right: Role Switcher, Notifications, Theme, User Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {/* Quick Switch Employee/Admin dropdown (Only Admin/CEO can switch) */}
        {currentUser?.role === 'admin' && (
          <div style={{ position: 'relative' }}>
            <select
              value={currentUser?.id || currentUser?._id}
              onChange={(e) => {
                const selected = employees.find(emp => emp.id === e.target.value || emp._id === e.target.value);
                if (selected) setCurrentUser(selected);
              }}
              className="form-select"
              style={{
                padding: '0.35rem 0.75rem',
                fontSize: '0.8rem',
                fontWeight: 600,
                width: 'auto',
                cursor: 'pointer',
                borderColor: 'var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-hover)'
              }}
              title="Fast switch between active user profiles (Admin / CEO Only)"
            >
              <optgroup label="Admin: Switch View / Profile">
                {employees.map(emp => (
                  <option key={emp.id || emp._id} value={emp.id || emp._id}>
                    {emp.fullName} ({emp.role === 'admin' ? 'CEO / Executive Admin' : emp.department === 'Human Resources' ? 'HR Employee' : 'Employee'})
                  </option>
                ))}
              </optgroup>
            </select>
          </div>
        )}

        {/* Notifications */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="btn-icon btn-secondary"
            style={{ position: 'relative' }}
            title="Notifications"
          >
            <Bell size={18} />
            {pendingLeavesCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-3px',
                right: '-3px',
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                background: 'var(--danger)',
                color: 'white',
                fontSize: '0.65rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {pendingLeavesCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div
              className="glass-card animate-fade-in"
              style={{
                position: 'absolute',
                right: 0,
                top: 'calc(100% + 8px)',
                width: '320px',
                padding: '1rem',
                zIndex: 200,
                boxShadow: 'var(--shadow-xl)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <strong style={{ fontSize: '0.9rem' }}>Activity Alerts</strong>
                <span className="badge badge-primary">{pendingLeavesCount} Pending</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '250px', overflowY: 'auto' }}>
                {pendingLeavesCount > 0 ? (
                  <div
                    onClick={() => {
                      setShowNotifications(false);
                      if (currentUser.role === 'admin') setActiveTab('leaves');
                    }}
                    style={{
                      padding: '0.75rem',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--warning-light)',
                      fontSize: '0.8rem',
                      cursor: 'pointer'
                    }}
                  >
                    <strong>🔔 {pendingLeavesCount} Leave Applications</strong>
                    <p style={{ color: 'var(--text-muted)', marginTop: '2px' }}>Awaiting HR review and decision</p>
                  </div>
                ) : (
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', padding: '1rem' }}>
                    No pending alerts right now.
                  </div>
                )}
                <div style={{
                  padding: '0.6rem',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--bg-hover)',
                  fontSize: '0.78rem'
                }}>
                  <CheckCircle2 size={14} color="var(--success)" style={{ display: 'inline', marginRight: '4px' }} />
                  {backendConnected ? 'Backend API connection active on :5000' : 'Operating in demo sandbox mode'}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="btn-icon btn-secondary"
          title="Toggle light / dark mode"
        >
          {theme === 'dark' ? <Sun size={18} color="#f59e0b" /> : <Moon size={18} color="var(--primary)" />}
        </button>

        {/* User Profile avatar & Dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              padding: '0.35rem 0.65rem 0.35rem 0.35rem',
              background: 'var(--bg-hover)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-full)',
              cursor: 'pointer',
              color: 'var(--text-main)'
            }}
          >
            <img
              src={currentUser?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser?.firstName || 'User'}`}
              alt={currentUser?.fullName || 'User'}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                objectFit: 'cover'
              }}
            />
            <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
              <span style={{ fontSize: '0.825rem', fontWeight: 700 }}>
                {currentUser?.firstName || currentUser?.name || 'Account'}
              </span>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                {currentUser?.role === 'admin' ? 'Admin' : 'Employee'}
              </span>
            </div>
            <ChevronDown size={14} color="var(--text-subtle)" />
          </button>

          {showProfileMenu && (
            <div
              className="glass-card animate-fade-in"
              style={{
                position: 'absolute',
                right: 0,
                top: 'calc(100% + 8px)',
                width: '240px',
                padding: '0.75rem',
                zIndex: 200,
                boxShadow: 'var(--shadow-xl)'
              }}
            >
              <div style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border-subtle)', marginBottom: '0.5rem' }}>
                <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>{currentUser?.fullName}</div>
                <div className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--primary)', marginTop: '2px' }}>
                  {currentUser?.loginId || currentUser?.employeeId}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{currentUser?.email}</div>
              </div>

              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  setActiveTab('profile');
                }}
                className="btn btn-ghost"
                style={{ width: '100%', justifyContent: 'flex-start', fontSize: '0.85rem' }}
              >
                <User size={16} /> My Full Profile
              </button>

              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  resetDemoData();
                }}
                className="btn btn-ghost"
                style={{ width: '100%', justifyContent: 'flex-start', fontSize: '0.85rem', color: 'var(--warning)' }}
              >
                <RotateCcw size={16} /> Reset Demo Data
              </button>

              <div style={{ borderTop: '1px solid var(--border-subtle)', marginTop: '0.5rem', paddingTop: '0.5rem' }}>
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    logout();
                  }}
                  className="btn btn-ghost"
                  style={{ width: '100%', justifyContent: 'flex-start', fontSize: '0.85rem', color: 'var(--danger)' }}
                >
                  <LogOut size={16} /> Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
