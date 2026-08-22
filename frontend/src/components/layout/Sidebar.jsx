import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  PlaneTakeoff,
  DollarSign,
  BarChart3,
  UserCircle,
  FileBadge,
  LogOut,
  Sparkles,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';

export const Sidebar = ({ activeTab, setActiveTab }) => {
  const { currentUser, logout, leaveRequests } = useApp();
  const isAdmin = currentUser?.role === 'admin';

  // Count pending leaves for badge
  const pendingLeavesCount = leaveRequests.filter(r => r.status === 'Pending').length;

  const adminNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'employees', label: 'Employee Directory', icon: Users },
    { id: 'attendance', label: 'Attendance Records', icon: CalendarCheck },
    { id: 'leaves', label: 'Leave Approvals', icon: PlaneTakeoff, badge: pendingLeavesCount > 0 ? pendingLeavesCount : null },
    { id: 'payroll', label: 'Payroll Management', icon: DollarSign },
    { id: 'reports', label: 'Analytics & Reports', icon: BarChart3 },
    { id: 'profile', label: 'My Profile', icon: UserCircle }
  ];

  const employeeNavItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'profile', label: 'My Profile', icon: UserCircle },
    { id: 'attendance', label: 'My Attendance', icon: CalendarCheck },
    { id: 'leaves', label: 'Apply for Leave', icon: PlaneTakeoff },
    { id: 'payroll', label: 'My Salary & Payslips', icon: DollarSign }
  ];

  const navItems = isAdmin ? adminNavItems : employeeNavItems;

  return (
    <aside style={{
      width: '260px',
      background: 'var(--bg-sidebar)',
      borderRight: '1px solid var(--border-subtle)',
      display: 'flex',
      flexDirection: 'column',
      height: 'calc(100vh - 70px)',
      position: 'sticky',
      top: '70px',
      padding: '1.25rem 0.85rem',
      flexShrink: 0
    }}>
      {/* Role Pill Banner */}
      <div style={{
        padding: '0.65rem 0.85rem',
        borderRadius: 'var(--radius-md)',
        background: isAdmin ? 'var(--primary-light)' : 'var(--secondary-light)',
        border: `1px solid ${isAdmin ? 'var(--primary-glow)' : 'rgba(0, 135, 132, 0.2)'}`,
        marginBottom: '1.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: isAdmin ? 'var(--primary)' : 'var(--secondary)'
          }} />
          <span style={{ fontSize: '0.8rem', fontWeight: 800, color: isAdmin ? 'var(--primary)' : 'var(--secondary)' }}>
            {isAdmin ? 'HR / ADMIN PORTAL' : 'EMPLOYEE PORTAL'}
          </span>
        </div>
        <span className="font-mono" style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
          {currentUser?.loginId}
        </span>
      </div>

      {/* Navigation Links */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', flex: 1 }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                background: isActive
                  ? 'linear-gradient(135deg, var(--primary) 0%, #875A7B 100%)'
                  : 'transparent',
                color: isActive ? '#ffffff' : 'var(--text-main)',
                fontWeight: isActive ? 700 : 500,
                fontSize: '0.9rem',
                border: 'none',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
                textAlign: 'left'
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.background = 'var(--bg-hover)';
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.background = 'transparent';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Icon size={18} style={{ color: isActive ? '#ffffff' : 'var(--primary)' }} />
                <span>{item.label}</span>
              </div>

              {item.badge && (
                <span style={{
                  padding: '0.15rem 0.5rem',
                  borderRadius: 'var(--radius-full)',
                  background: isActive ? '#ffffff' : 'var(--danger)',
                  color: isActive ? 'var(--danger)' : '#ffffff',
                  fontSize: '0.72rem',
                  fontWeight: 800
                }}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Quick Bottom Help Card */}
      <div style={{
        marginTop: 'auto',
        padding: '1rem',
        borderRadius: 'var(--radius-md)',
        background: 'var(--bg-hover)',
        border: '1px solid var(--border-subtle)',
        fontSize: '0.78rem'
      }}>
        <div style={{ fontWeight: 700, marginBottom: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <Sparkles size={14} color="var(--primary)" /> Dayflow HRMS
        </div>
        <p style={{ color: 'var(--text-muted)', lineHeight: 1.4 }}>
          Auto Login ID logic active. Employee punch and leave sync in real-time.
        </p>
      </div>
    </aside>
  );
};
