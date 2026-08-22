import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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

export const Navbar = () => {
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
    backendConnected,
    checkBackendHealth,
    refreshBackendData,
    readNotifications,
    markNotificationsAsRead
  } = useApp();

  const [time, setTime] = useState(new Date());
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isPinging, setIsPinging] = useState(false);
  const navigate = useNavigate();

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

  // Notifications logic based on role
  const isAdmin = currentUser?.role === 'admin';
  const adminPendingLeaves = leaveRequests.filter(r => r.status === 'Pending' && !readNotifications.includes(r.id || r._id));
  const employeeProcessedLeaves = leaveRequests.filter(r => 
    (r.employeeId === currentUser?.id || r.loginId === currentUser?.loginId || r.employeeId === currentUser?._id) && 
    (r.status === 'Approved' || r.status === 'Rejected') &&
    !readNotifications.includes(r.id || r._id)
  );

  const notificationCount = isAdmin ? adminPendingLeaves.length : employeeProcessedLeaves.length;
  const currentNotificationIds = isAdmin ? adminPendingLeaves.map(r => r.id || r._id) : employeeProcessedLeaves.map(r => r.id || r._id);

  const handleOpenNotifications = () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications && currentNotificationIds.length > 0) {
      markNotificationsAsRead(currentNotificationIds);
    }
  };

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
        <img src="/casepoint-logo.png" alt="Case Point" style={{ height: '2.4rem', objectFit: 'contain' }} />
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-main)' }}>
              {company.name}
            </span>
            <span className="badge badge-primary" style={{ fontSize: '0.68rem', padding: '0.15rem 0.5rem' }}>
              Case Point HRMS
            </span>
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


        {/* Notifications */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={handleOpenNotifications}
            className="btn-icon btn-secondary"
            style={{ position: 'relative' }}
            title="Notifications"
          >
            <Bell size={18} />
            {notificationCount > 0 && (
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
                {notificationCount}
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
                <span className="badge badge-primary">{notificationCount} {isAdmin ? 'Pending' : 'Updates'}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '250px', overflowY: 'auto' }}>
                {notificationCount > 0 ? (
                  <div
                    onClick={() => {
                      setShowNotifications(false);
                      if (isAdmin) navigate('/leaves');
                      else navigate('/dashboard');
                    }}
                    style={{
                      padding: '0.75rem',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--warning-light)',
                      fontSize: '0.8rem',
                      cursor: 'pointer'
                    }}
                  >
                    <strong>🔔 {notificationCount} {isAdmin ? 'Leave Applications' : 'Leave Updates'}</strong>
                    <p style={{ color: 'var(--text-muted)', marginTop: '2px' }}>
                      {isAdmin ? 'Awaiting HR review and decision' : 'Your recent leave applications have been reviewed'}
                    </p>
                  </div>
                ) : (
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', padding: '1rem' }}>
                    No pending alerts right now.
                  </div>
                )}
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
                  navigate('/profile');
                }}
                className="btn btn-ghost"
                style={{ width: '100%', justifyContent: 'flex-start', fontSize: '0.85rem' }}
              >
                <User size={16} /> My Full Profile
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
