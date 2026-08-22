import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  PlaneTakeoff,
  DollarSign,
  BarChart3,
  UserCircle,
  LogOut,
  Sparkles,
  ShieldCheck,
  Cpu,
  Megaphone
} from 'lucide-react';

const NAV_COLORS = {
  dashboard: '#714B67',
  employees: '#008784',
  attendance: '#3b82f6',
  leaves: '#f59e0b',
  payroll: '#10b981',
  reports: '#9333ea',
  notices: '#ef4444',
  profile: '#f97316',
};

export const Sidebar = () => {
  const { currentUser, logout, leaveRequests, company, backendConnected } = useApp();
  const isAdmin = currentUser?.role === 'admin';
  const [hoveredItem, setHoveredItem] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const pendingLeavesCount = leaveRequests.filter(r => r.status === 'Pending').length;

  const adminNavItems = [
    { id: 'dashboard',  path: '/dashboard',  label: 'Dashboard',           icon: LayoutDashboard },
    { id: 'employees',  path: '/employees',  label: 'Employee Directory',   icon: Users },
    { id: 'attendance', path: '/attendance', label: 'Attendance Records',   icon: CalendarCheck },
    { id: 'leaves',     path: '/leaves',     label: 'Leave Approvals',      icon: PlaneTakeoff, badge: pendingLeavesCount > 0 ? pendingLeavesCount : null },
    { id: 'payroll',    path: '/payroll',    label: 'Payroll Management',   icon: DollarSign },
    { id: 'reports',    path: '/reports',    label: 'Analytics & Reports',  icon: BarChart3 },
    { id: 'notices',    path: '/notices',    label: 'Notice Board',         icon: Megaphone },
    { id: 'profile',    path: '/profile',    label: 'My Profile',           icon: UserCircle },
  ];

  const employeeNavItems = [
    { id: 'dashboard',  path: '/dashboard',  label: 'Overview',             icon: LayoutDashboard },
    { id: 'profile',    path: '/profile',    label: 'My Profile',           icon: UserCircle },
    { id: 'attendance', path: '/attendance', label: 'My Attendance',        icon: CalendarCheck },
    { id: 'leaves',     path: '/leaves',     label: 'Apply for Leave',      icon: PlaneTakeoff },
    { id: 'payroll',    path: '/payroll',    label: 'Salary & Payslips',    icon: DollarSign },
    { id: 'notices',    path: '/notices',    label: 'Notice Board',         icon: Megaphone },
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
      padding: '1.1rem 0.8rem',
      flexShrink: 0,
      boxShadow: '2px 0 16px rgba(0,0,0,0.04)',
    }}>

      {/* Role Badge */}
      <div style={{
        padding: '0.6rem 0.85rem',
        borderRadius: 'var(--radius-md)',
        background: isAdmin
          ? 'linear-gradient(135deg, var(--primary-light), var(--bg-hover))'
          : 'linear-gradient(135deg, var(--secondary-light), var(--bg-hover))',
        border: `1px solid ${isAdmin ? 'var(--primary-glow)' : 'var(--secondary-glow)'}`,
        marginBottom: '1.1rem',
        boxShadow: isAdmin ? '0 4px 12px var(--primary-glow)' : '0 4px 12px var(--secondary-glow)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div className="beacon" style={{ color: isAdmin ? 'var(--primary)' : 'var(--secondary)' }}>
              <span style={{
                display: 'block',
                width: '8px', height: '8px',
                borderRadius: '50%',
                background: 'currentColor'
              }} />
            </div>
            <span style={{
              fontSize: '0.72rem', fontWeight: 800,
              color: isAdmin ? 'var(--primary)' : 'var(--secondary)',
              textTransform: 'uppercase', letterSpacing: '0.06em'
            }}>
              {isAdmin ? 'HR Admin' : 'Employee'}
            </span>
          </div>
          {isAdmin && <ShieldCheck size={14} color="var(--primary)" />}
        </div>
        <div className="font-mono" style={{
          fontSize: '0.68rem', color: 'var(--text-muted)',
          marginTop: '3px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
        }}>
          {currentUser?.loginId || currentUser?.employeeId}
        </div>
      </div>

      {/* Navigation Items */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', flex: 1 }}>
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = location.pathname.startsWith(item.path);
          const color = NAV_COLORS[item.id] || 'var(--primary)';
          const isHov = hoveredItem === item.id;

          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
              className="animate-fade-in"
              style={{
                animationDelay: `${index * 0.05}s`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.68rem 0.9rem',
                borderRadius: 'var(--radius-md)',
                background: isActive
                  ? `color-mix(in srgb, ${color} 14%, var(--bg-card))`
                  : isHov ? 'var(--bg-hover)' : 'transparent',
                color: isActive ? color : isHov ? 'var(--text-main)' : 'var(--text-muted)',
                fontWeight: isActive ? 700 : 500,
                fontSize: '0.875rem',
                border: isActive ? `1px solid color-mix(in srgb, ${color} 30%, transparent)` : '1px solid transparent',
                cursor: 'pointer',
                transition: 'all var(--transition-normal)',
                textAlign: 'left',
                fontFamily: 'inherit',
                transform: isActive ? 'translateX(2px)' : isHov ? 'translateX(3px)' : 'translateX(0)',
                boxShadow: isActive ? `0 2px 12px color-mix(in srgb, ${color} 25%, transparent), inset 3px 0 0 ${color}` : 'none',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Shimmer on active */}
              {isActive && (
                <div style={{
                  position: 'absolute', inset: 0,
                  background: `linear-gradient(90deg, transparent, color-mix(in srgb, ${color} 8%, transparent), transparent)`,
                  pointerEvents: 'none'
                }} />
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', position: 'relative', zIndex: 1 }}>
                <div style={{
                  width: '30px', height: '30px',
                  borderRadius: 'var(--radius-sm)',
                  background: isActive || isHov
                    ? `color-mix(in srgb, ${color} 15%, transparent)`
                    : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all var(--transition-fast)',
                  boxShadow: isActive ? `0 0 10px color-mix(in srgb, ${color} 30%, transparent)` : 'none'
                }}>
                  <Icon size={17} color={isActive ? color : isHov ? color : 'var(--text-subtle)'} />
                </div>
                <span>{item.label}</span>
              </div>

              {item.badge && (
                <span style={{
                  padding: '0.15rem 0.55rem',
                  borderRadius: 'var(--radius-full)',
                  background: 'var(--danger)',
                  color: 'white',
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  boxShadow: '0 0 8px var(--danger-glow)',
                  animation: 'pulseGlow 2s ease-in-out infinite'
                }}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>



      {/* Sign Out Button */}
      <button
        onClick={logout}
        style={{
          marginTop: '0.5rem',
          display: 'flex', alignItems: 'center', gap: '0.6rem',
          padding: '0.6rem 0.9rem',
          borderRadius: 'var(--radius-md)',
          background: 'transparent',
          border: '1px solid transparent',
          color: 'var(--text-muted)',
          fontSize: '0.875rem',
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'all var(--transition-fast)',
          fontFamily: 'inherit',
          width: '100%',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = 'var(--danger-light)';
          e.currentTarget.style.color = 'var(--danger)';
          e.currentTarget.style.borderColor = 'var(--danger-glow)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = 'transparent';
          e.currentTarget.style.color = 'var(--text-muted)';
          e.currentTarget.style.borderColor = 'transparent';
        }}
      >
        <LogOut size={16} />
        Sign Out
      </button>
    </aside>
  );
};
