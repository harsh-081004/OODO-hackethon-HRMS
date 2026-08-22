import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  initialCompany,
  initialEmployees,
  initialAttendance,
  initialLeaveRequests,
  initialAnnouncements
} from '../data/seedData';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Theme state
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('dayflow_theme') || 'light';
  });

  // Company profile
  const [company, setCompany] = useState(() => {
    const saved = localStorage.getItem('dayflow_company');
    return saved ? JSON.parse(saved) : initialCompany;
  });

  // Employees registry
  const [employees, setEmployees] = useState(() => {
    const saved = localStorage.getItem('dayflow_employees');
    return saved ? JSON.parse(saved) : initialEmployees;
  });

  // Active Current User
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('dayflow_currentUser');
    return saved ? JSON.parse(saved) : initialEmployees[0]; // default to Sarah (Admin) for instant preview
  });

  // Attendance Records
  const [attendance, setAttendance] = useState(() => {
    const saved = localStorage.getItem('dayflow_attendance');
    return saved ? JSON.parse(saved) : initialAttendance;
  });

  // Leave Requests
  const [leaveRequests, setLeaveRequests] = useState(() => {
    const saved = localStorage.getItem('dayflow_leave_requests');
    return saved ? JSON.parse(saved) : initialLeaveRequests;
  });

  // Announcements
  const [announcements, setAnnouncements] = useState(() => {
    const saved = localStorage.getItem('dayflow_announcements');
    return saved ? JSON.parse(saved) : initialAnnouncements;
  });

  // Toasts
  const [toasts, setToasts] = useState([]);

  // Sync theme to DOM
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('dayflow_theme', theme);
  }, [theme]);

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('dayflow_company', JSON.stringify(company));
  }, [company]);

  useEffect(() => {
    localStorage.setItem('dayflow_employees', JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('dayflow_currentUser', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('dayflow_currentUser');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('dayflow_attendance', JSON.stringify(attendance));
  }, [attendance]);

  useEffect(() => {
    localStorage.setItem('dayflow_leave_requests', JSON.stringify(leaveRequests));
  }, [leaveRequests]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const addToast = (title, message, type = 'info') => {
    const id = Date.now() + Math.random().toString();
    setToasts(prev => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  /**
   * Generates Company Code (2 letters) from Company Name
   * Example: "Odoo India" -> "OI", "Google" -> "GO"
   */
  const extractCompanyCode = (companyName) => {
    if (!companyName) return 'OI';
    const words = companyName.trim().split(/\s+/);
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return companyName.substring(0, 2).toUpperCase();
  };

  /**
   * System Login ID Generator according to exact diagram specs:
   * Format: [CompanyCode (2 letters)][First 2 of First name + First 2 of Last name][Year of Joining (4 digits)][Serial Number (4 digits)]
   * Example: OIJODO20220001
   */
  const generateLoginId = (compCode, firstName, lastName, joiningYear) => {
    const cCode = (compCode || company.code || 'OI').toUpperCase().substring(0, 2);
    const fPart = (firstName || 'XX').trim().substring(0, 2).toUpperCase();
    const lPart = (lastName || 'XX').trim().substring(0, 2).toUpperCase();
    const namePart = (fPart + lPart).padEnd(4, 'X');
    const year = joiningYear ? String(joiningYear).substring(0, 4) : new Date().getFullYear().toString();
    
    // Calculate serial number for that year
    const sameYearEmployees = employees.filter(e => {
      const eYear = e.joiningDate ? e.joiningDate.substring(0, 4) : '';
      return eYear === year;
    });
    const serialNum = (sameYearEmployees.length + 1).toString().padStart(4, '0');

    return `${cCode}${namePart}${year}${serialNum}`;
  };

  /**
   * Temporary Password Generator
   */
  const generateTempPassword = () => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `Dayflow@${randomNum}`;
  };

  /**
   * Sign In Handler
   */
  const login = (loginIdOrEmail, password) => {
    const identifier = loginIdOrEmail.trim().toLowerCase();
    const found = employees.find(
      e => e.loginId.toLowerCase() === identifier || e.email.toLowerCase() === identifier
    );

    if (!found) {
      addToast('Authentication Failed', 'Invalid Login ID or Email.', 'danger');
      return { success: false, error: 'User not found' };
    }

    if (found.password && found.password !== password) {
      addToast('Authentication Failed', 'Incorrect password entered.', 'danger');
      return { success: false, error: 'Invalid password' };
    }

    setCurrentUser(found);
    addToast('Welcome Back', `Logged in as ${found.fullName} (${found.role === 'admin' ? 'HR / Admin' : 'Employee'})`, 'success');
    return { success: true, user: found, isFirstLogin: found.isFirstLogin };
  };

  /**
   * Sign Up Handler (Company & Admin Onboarding)
   */
  const registerCompany = ({ companyName, logo, adminName, email, phone, password }) => {
    const compCode = extractCompanyCode(companyName);
    const nameParts = adminName.trim().split(/\s+/);
    const firstName = nameParts[0] || 'Admin';
    const lastName = nameParts.slice(1).join(' ') || 'Officer';
    const currentYear = new Date().getFullYear();
    const loginId = generateLoginId(compCode, firstName, lastName, currentYear);

    const newCompany = {
      name: companyName,
      code: compCode,
      tagline: 'Every workday, perfectly aligned.',
      logo: logo || initialCompany.logo,
      address: 'Headquarters',
      contactEmail: email,
      phone: phone
    };

    const newAdmin = {
      id: `EMP-${Date.now().toString().slice(-4)}`,
      loginId: loginId,
      firstName,
      lastName,
      fullName: adminName,
      email,
      role: 'admin',
      phone,
      joiningDate: new Date().toISOString().split('T')[0],
      department: 'Human Resources',
      designation: 'Managing Director / HR Admin',
      status: 'Active',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
      address: 'Corporate HQ',
      emergencyContact: phone,
      bloodGroup: 'O+',
      password: password,
      isFirstLogin: false,
      leaveBalances: { paid: 20, sick: 10, casual: 8, unpaid: 0 },
      salary: {
        basic: 150000,
        hra: 60000,
        specialAllowance: 30000,
        providentFund: 18000,
        professionalTax: 2500,
        incomeTax: 22500
      }
    };

    setCompany(newCompany);
    setEmployees(prev => [newAdmin, ...prev]);
    setCurrentUser(newAdmin);
    addToast('Account Created!', `Welcome to Dayflow! Your Login ID is ${loginId}`, 'success');
    return { success: true, user: newAdmin };
  };

  /**
   * Log out
   */
  const logout = () => {
    setCurrentUser(null);
    addToast('Signed Out', 'You have been safely logged out.', 'info');
  };

  /**
   * Update password (e.g. first login or settings)
   */
  const updatePassword = (employeeId, newPassword) => {
    setEmployees(prev =>
      prev.map(emp => {
        if (emp.id === employeeId || emp.loginId === employeeId) {
          return { ...emp, password: newPassword, isFirstLogin: false };
        }
        return emp;
      })
    );

    if (currentUser && (currentUser.id === employeeId || currentUser.loginId === employeeId)) {
      setCurrentUser(prev => ({ ...prev, password: newPassword, isFirstLogin: false }));
    }

    addToast('Password Updated', 'Your new password is now active.', 'success');
  };

  /**
   * Add New Employee (Admin Only)
   */
  const addEmployee = (data) => {
    const year = data.joiningDate ? data.joiningDate.substring(0, 4) : new Date().getFullYear().toString();
    const loginId = generateLoginId(company.code, data.firstName, data.lastName, year);
    const tempPassword = generateTempPassword();

    const newEmp = {
      id: `EMP-${(employees.length + 1).toString().padStart(3, '0')}`,
      loginId,
      firstName: data.firstName,
      lastName: data.lastName,
      fullName: `${data.firstName} ${data.lastName}`.trim(),
      email: data.email,
      role: data.role || 'employee',
      phone: data.phone || '',
      joiningDate: data.joiningDate || new Date().toISOString().split('T')[0],
      department: data.department || 'Engineering',
      designation: data.designation || 'Specialist',
      status: 'Active',
      avatar: data.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.firstName}_${data.lastName}`,
      address: data.address || '',
      emergencyContact: data.emergencyContact || '',
      bloodGroup: data.bloodGroup || 'B+',
      password: tempPassword,
      isFirstLogin: true, // Requires first-time password update
      leaveBalances: {
        paid: Number(data.paidLeave || 14),
        sick: Number(data.sickLeave || 8),
        casual: Number(data.casualLeave || 5),
        unpaid: 0
      },
      salary: {
        basic: Number(data.basicSalary || 60000),
        hra: Number(data.hra || 24000),
        specialAllowance: Number(data.specialAllowance || 10000),
        providentFund: Number(data.providentFund || 7200),
        professionalTax: 2500,
        incomeTax: Number(data.incomeTax || 6500)
      }
    };

    setEmployees(prev => [...prev, newEmp]);
    addToast('Employee Onboarded', `Created profile for ${newEmp.fullName} with Login ID: ${loginId}`, 'success');
    return { success: true, employee: newEmp, tempPassword };
  };

  /**
   * Edit Employee
   */
  const updateEmployee = (id, updatedFields, isSelfEdit = false) => {
    setEmployees(prev =>
      prev.map(emp => {
        if (emp.id === id || emp.loginId === id) {
          if (isSelfEdit) {
            // Self-service allowed fields only
            return {
              ...emp,
              phone: updatedFields.phone ?? emp.phone,
              address: updatedFields.address ?? emp.address,
              avatar: updatedFields.avatar ?? emp.avatar,
              emergencyContact: updatedFields.emergencyContact ?? emp.emergencyContact,
              bloodGroup: updatedFields.bloodGroup ?? emp.bloodGroup
            };
          }
          // Admin can edit everything
          return {
            ...emp,
            ...updatedFields,
            fullName: updatedFields.firstName && updatedFields.lastName 
              ? `${updatedFields.firstName} ${updatedFields.lastName}`
              : emp.fullName
          };
        }
        return emp;
      })
    );

    if (currentUser && (currentUser.id === id || currentUser.loginId === id)) {
      setCurrentUser(prev => ({
        ...prev,
        ...updatedFields,
        fullName: updatedFields.firstName && updatedFields.lastName 
          ? `${updatedFields.firstName} ${updatedFields.lastName}`
          : prev.fullName
      }));
    }

    addToast('Profile Updated', 'Employee details saved successfully.', 'success');
  };

  /**
   * Check In Punch
   */
  const checkIn = (employeeId, device = 'Web Portal') => {
    const today = new Date().toISOString().split('T')[0];
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    const emp = employees.find(e => e.id === employeeId || e.loginId === employeeId);

    if (!emp) return;

    setAttendance(prev => {
      const existing = prev.find(a => (a.employeeId === emp.id || a.loginId === emp.loginId) && a.date === today);
      if (existing) {
        return prev.map(a => {
          if (a.id === existing.id) {
            return { ...a, checkIn: nowTime, status: 'Present' };
          }
          return a;
        });
      }
      const newRecord = {
        id: `ATT-${Date.now().toString().slice(-4)}`,
        employeeId: emp.id,
        employeeName: emp.fullName,
        loginId: emp.loginId,
        date: today,
        checkIn: nowTime,
        checkOut: null,
        status: 'Present',
        hoursWorked: 0,
        device: device
      };
      return [newRecord, ...prev];
    });

    addToast('Checked In', `Good day, ${emp.firstName}! Shift started at ${nowTime}`, 'success');
  };

  /**
   * Check Out Punch
   */
  const checkOut = (employeeId) => {
    const today = new Date().toISOString().split('T')[0];
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    const emp = employees.find(e => e.id === employeeId || e.loginId === employeeId);

    if (!emp) return;

    setAttendance(prev => {
      return prev.map(a => {
        if ((a.employeeId === emp.id || a.loginId === emp.loginId) && a.date === today) {
          return {
            ...a,
            checkOut: nowTime,
            hoursWorked: 8.5
          };
        }
        return a;
      });
    });

    addToast('Checked Out', `Shift concluded at ${nowTime}. Great work today!`, 'info');
  };

  /**
   * Apply for Leave (Employee)
   */
  const applyLeave = ({ leaveType, startDate, endDate, days, reason }) => {
    if (!currentUser) return;

    // Check balance
    const balanceKey = leaveType.toLowerCase();
    const available = currentUser.leaveBalances[balanceKey] || 0;

    if (balanceKey !== 'unpaid' && days > available) {
      addToast('Insufficient Balance', `You only have ${available} ${leaveType} leave days remaining.`, 'danger');
      return { success: false, error: 'Insufficient balance' };
    }

    const newRequest = {
      id: `LR-${Date.now().toString().slice(-4)}`,
      employeeId: currentUser.id,
      employeeName: currentUser.fullName,
      loginId: currentUser.loginId,
      department: currentUser.department,
      leaveType,
      startDate,
      endDate,
      days: Number(days),
      reason,
      status: 'Pending',
      appliedOn: new Date().toISOString().split('T')[0],
      reviewerComments: null
    };

    setLeaveRequests(prev => [newRequest, ...prev]);
    addToast('Leave Request Submitted', `Your application for ${days} day(s) is pending HR approval.`, 'info');
    return { success: true, request: newRequest };
  };

  /**
   * Review Leave (Admin/HR Officer)
   */
  const reviewLeave = (requestId, newStatus, comments = '') => {
    const req = leaveRequests.find(r => r.id === requestId);
    if (!req) return;

    setLeaveRequests(prev =>
      prev.map(r => {
        if (r.id === requestId) {
          return { ...r, status: newStatus, reviewerComments: comments };
        }
        return r;
      })
    );

    // If approved, deduct leave balance
    if (newStatus === 'Approved') {
      const balanceKey = req.leaveType.toLowerCase();
      setEmployees(prev =>
        prev.map(emp => {
          if (emp.id === req.employeeId || emp.loginId === req.loginId) {
            const currentBal = emp.leaveBalances[balanceKey] || 0;
            return {
              ...emp,
              leaveBalances: {
                ...emp.leaveBalances,
                [balanceKey]: Math.max(0, currentBal - req.days)
              }
            };
          }
          return emp;
        })
      );
    }

    addToast(
      `Leave ${newStatus}`,
      `Request by ${req.employeeName} has been ${newStatus.toLowerCase()}.`,
      newStatus === 'Approved' ? 'success' : 'danger'
    );
  };

  /**
   * Update Salary Structure (Admin Only)
   */
  const updateSalaryStructure = (employeeId, newSalary) => {
    setEmployees(prev =>
      prev.map(emp => {
        if (emp.id === employeeId || emp.loginId === employeeId) {
          return {
            ...emp,
            salary: { ...emp.salary, ...newSalary }
          };
        }
        return emp;
      })
    );

    if (currentUser && (currentUser.id === employeeId || currentUser.loginId === employeeId)) {
      setCurrentUser(prev => ({
        ...prev,
        salary: { ...prev.salary, ...newSalary }
      }));
    }

    addToast('Payroll Updated', 'Salary structure has been recalculated and saved.', 'success');
  };

  /**
   * Reset All Demo Data
   */
  const resetDemoData = () => {
    setCompany(initialCompany);
    setEmployees(initialEmployees);
    setCurrentUser(initialEmployees[0]);
    setAttendance(initialAttendance);
    setLeaveRequests(initialLeaveRequests);
    setAnnouncements(initialAnnouncements);
    localStorage.clear();
    addToast('System Reset', 'All demo data has been restored to factory defaults.', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        company,
        setCompany,
        employees,
        currentUser,
        setCurrentUser,
        attendance,
        leaveRequests,
        announcements,
        toasts,
        addToast,
        removeToast,
        extractCompanyCode,
        generateLoginId,
        generateTempPassword,
        login,
        registerCompany,
        logout,
        updatePassword,
        addEmployee,
        updateEmployee,
        checkIn,
        checkOut,
        applyLeave,
        reviewLeave,
        updateSalaryStructure,
        resetDemoData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
