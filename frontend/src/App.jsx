import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useApp } from './context/AppContext';
import { AuthLayout } from './components/auth/AuthLayout';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { ToastContainer } from './components/common/Toast';

// Admin Modules
import { AdminDashboard } from './components/admin/AdminDashboard';
import { EmployeeManagement } from './components/admin/EmployeeManagement';
import { AdminAttendance } from './components/admin/AdminAttendance';
import { AdminLeaveApprovals } from './components/admin/AdminLeaveApprovals';
import { AdminPayroll } from './components/admin/AdminPayroll';
import { AdminReports } from './components/admin/AdminReports';

// Employee Modules
import { EmployeeDashboard } from './components/employee/EmployeeDashboard';
import { EmployeeProfile } from './components/employee/EmployeeProfile';
import { EmployeeAttendance } from './components/employee/EmployeeAttendance';
import { EmployeeLeave } from './components/employee/EmployeeLeave';
import { EmployeePayroll } from './components/employee/EmployeePayroll';

export const App = () => {
  const { currentUser } = useApp();

  // If no logged in user, show auth screens
  if (!currentUser) {
    return (
      <>
        <AuthLayout />
        <ToastContainer />
      </>
    );
  }

  const isAdmin = currentUser.role === 'admin';

  return (
    <div className="app-container">
      {/* Top Navbar */}
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
        <Navbar />

        {/* Body Layout: Sidebar + Main Content */}
        <div style={{ display: 'flex', flex: 1, minHeight: 'calc(100vh - 70px)' }}>
          <Sidebar />

          <main className="main-content">
            {isAdmin ? (
              // ADMIN ROLE VIEWS
              <Routes>
                <Route path="/dashboard" element={<AdminDashboard />} />
                <Route path="/employees" element={<EmployeeManagement />} />
                <Route path="/attendance" element={<AdminAttendance />} />
                <Route path="/leaves" element={<AdminLeaveApprovals />} />
                <Route path="/payroll" element={<AdminPayroll />} />
                <Route path="/reports" element={<AdminReports />} />
                <Route path="/profile" element={<EmployeeProfile />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            ) : (
              // EMPLOYEE ROLE VIEWS
              <Routes>
                <Route path="/dashboard" element={<EmployeeDashboard />} />
                <Route path="/profile" element={<EmployeeProfile />} />
                <Route path="/attendance" element={<EmployeeAttendance />} />
                <Route path="/leaves" element={<EmployeeLeave />} />
                <Route path="/payroll" element={<EmployeePayroll />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            )}
          </main>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default App;
