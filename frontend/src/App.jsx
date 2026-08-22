import React, { useState } from 'react';
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
  const [activeTab, setActiveTab] = useState('dashboard');
  const [inspectedEmployee, setInspectedEmployee] = useState(null);

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

  const handleSelectEmployee = (emp) => {
    setInspectedEmployee(emp);
    setActiveTab('profile');
  };

  const handleTabChange = (newTab) => {
    if (newTab !== 'profile') {
      setInspectedEmployee(null);
    }
    setActiveTab(newTab);
  };

  return (
    <div className="app-container">
      {/* Top Navbar */}
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
        <Navbar activeTab={activeTab} setActiveTab={handleTabChange} />

        {/* Body Layout: Sidebar + Main Content */}
        <div style={{ display: 'flex', flex: 1, minHeight: 'calc(100vh - 70px)' }}>
          <Sidebar activeTab={activeTab} setActiveTab={handleTabChange} />

          <main className="main-content">
            {isAdmin ? (
              // ADMIN ROLE VIEWS
              <>
                {activeTab === 'dashboard' && (
                  <AdminDashboard
                    setActiveTab={handleTabChange}
                    onSelectEmployee={handleSelectEmployee}
                  />
                )}
                {activeTab === 'employees' && (
                  <EmployeeManagement onSelectEmployee={handleSelectEmployee} />
                )}
                {activeTab === 'attendance' && <AdminAttendance />}
                {activeTab === 'leaves' && <AdminLeaveApprovals />}
                {activeTab === 'payroll' && <AdminPayroll />}
                {activeTab === 'reports' && <AdminReports />}
                {activeTab === 'profile' && (
                  <EmployeeProfile targetEmployee={inspectedEmployee || currentUser} />
                )}
              </>
            ) : (
              // EMPLOYEE ROLE VIEWS
              <>
                {activeTab === 'dashboard' && (
                  <EmployeeDashboard setActiveTab={handleTabChange} />
                )}
                {activeTab === 'profile' && <EmployeeProfile targetEmployee={currentUser} />}
                {activeTab === 'attendance' && <EmployeeAttendance />}
                {activeTab === 'leaves' && <EmployeeLeave />}
                {activeTab === 'payroll' && <EmployeePayroll />}
              </>
            )}
          </main>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default App;
