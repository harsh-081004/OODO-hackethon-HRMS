import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  initialCompany,
  initialEmployees,
  initialAttendance,
  initialLeaveRequests,
  initialAnnouncements
} from '../data/seedData';
import {
  authApi,
  usersApi,
  attendanceApi,
  leaveApi,
  payrollApi,
  healthApi,
  getStoredToken,
  clearStoredToken,
  transformUserFromBackend
} from '../services/api';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Theme state
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('dayflow_theme') || 'light';
  });

  // Server Connection Status
  const [backendConnected, setBackendConnected] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

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
    return saved ? JSON.parse(saved) : null;
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

  // Payroll Records
  const [payrolls, setPayrolls] = useState([]);

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
   * Health Check & Backend Status Heartbeat
   */
  const checkBackendHealth = useCallback(async () => {
    const isHealthy = await healthApi.check();
    setBackendConnected(isHealthy);
    return isHealthy;
  }, []);

  /**
   * Hydrate App Data from Backend
   */
  const refreshBackendData = useCallback(async (user) => {
    const activeUser = user || currentUser;
    if (!activeUser) return;

    try {
      if (activeUser.role === 'admin' || activeUser.role === 'hr') {
        const [usersList, attList, leavesList, payList] = await Promise.allSettled([
          usersApi.getAllUsers(),
          attendanceApi.getAllAttendance(),
          leaveApi.getAllLeaves(),
          payrollApi.getAllPayrolls(),
        ]);

        if (usersList.status === 'fulfilled' && usersList.value.length > 0) {
          setEmployees(usersList.value);
        }
        if (attList.status === 'fulfilled' && attList.value.length > 0) {
          setAttendance(attList.value);
        }
        if (leavesList.status === 'fulfilled' && leavesList.value.length > 0) {
          setLeaveRequests(leavesList.value);
        }
        if (payList.status === 'fulfilled') {
          setPayrolls(payList.value);
        }
      } else {
        const [attList, leavesList, payList] = await Promise.allSettled([
          attendanceApi.getMyAttendance(),
          leaveApi.getMyLeaves(),
          payrollApi.getMyPayrolls(),
        ]);

        if (attList.status === 'fulfilled' && attList.value.length > 0) {
          setAttendance(attList.value);
        }
        if (leavesList.status === 'fulfilled' && leavesList.value.length > 0) {
          setLeaveRequests(leavesList.value);
        }
        if (payList.status === 'fulfilled') {
          setPayrolls(payList.value);
        }
      }
    } catch (err) {
      console.warn('Error refreshing backend data:', err);
    }
  }, [currentUser]);

  /**
   * Initial App Boot
   */
  useEffect(() => {
    let isMounted = true;

    const initialize = async () => {
      const isHealthy = await checkBackendHealth();
      const token = getStoredToken();

      if (isHealthy && token) {
        try {
          const me = await usersApi.getMe();
          if (isMounted && me) {
            setCurrentUser(me);
            await refreshBackendData(me);
          }
        } catch (err) {
          console.warn('Session verification failed, falling back to local session:', err);
          clearStoredToken();
        }
      }

      if (isMounted) {
        setIsInitializing(false);
      }
    };

    initialize();

    // Check health periodically
    const healthInterval = setInterval(checkBackendHealth, 15000);
    return () => {
      isMounted = false;
      clearInterval(healthInterval);
    };
  }, [checkBackendHealth, refreshBackendData]);

  /**
   * Generates Company Code (2 letters) from Company Name
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
   * System Login ID Generator
   */
  const generateLoginId = (compCode, firstName, lastName, joiningYear) => {
    const cCode = (compCode || company.code || 'OI').toUpperCase().substring(0, 2);
    const fPart = (firstName || 'XX').trim().substring(0, 2).toUpperCase();
    const lPart = (lastName || 'XX').trim().substring(0, 2).toUpperCase();
    const namePart = (fPart + lPart).padEnd(4, 'X');
    const year = joiningYear ? String(joiningYear).substring(0, 4) : new Date().getFullYear().toString();
    
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
  const login = async (emailOrLoginId, password) => {
    const identifier = (emailOrLoginId || '').trim();

    // Try backend authentication if server is connected
    if (backendConnected) {
      try {
        // Backend expects valid email format
        let loginEmail = identifier;
        if (!loginEmail.includes('@')) {
          // If user provided Login ID, find corresponding email from known registry
          const matched = employees.find(
            e => e.loginId?.toLowerCase() === identifier.toLowerCase() || e.employeeId?.toLowerCase() === identifier.toLowerCase()
          );
          if (matched && matched.email) {
            loginEmail = matched.email;
          }
        }

        const res = await authApi.login(loginEmail, password);
        if (res?.user) {
          setCurrentUser(res.user);
          addToast('Welcome Back', `Logged in as ${res.user.fullName} (${res.user.role === 'admin' ? 'HR / Admin' : 'Employee'})`, 'success');
          await refreshBackendData(res.user);
          return { success: true, user: res.user };
        }
      } catch (backendError) {
        console.warn('Backend login failed, checking local seed database:', backendError.message);
        // If backend returns explicit unauthorized, return error
        if (backendError.status === 401 || backendError.status === 400) {
          addToast('Authentication Failed', backendError.message || 'Invalid email or password.', 'danger');
          return { success: false, error: backendError.message };
        }
      }
    }

    // Fallback: Local Seed Database
    const found = employees.find(
      e => e.loginId?.toLowerCase() === identifier.toLowerCase() ||
           e.email?.toLowerCase() === identifier.toLowerCase()
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
    addToast('Welcome Back (Demo Mode)', `Logged in as ${found.fullName} (${found.role === 'admin' ? 'HR / Admin' : 'Employee'})`, 'success');
    return { success: true, user: found, isFirstLogin: found.isFirstLogin };
  };

  /**
   * Sign Up Handler (Company & Admin Registration)
   */
  const registerCompany = async ({ companyName, logo, adminName, email, phone, password }) => {
    // 1. Try Backend Registration
    if (backendConnected) {
      try {
        const res = await authApi.register({
          companyName: companyName.trim(),
          name: adminName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          password: password,
          companyLogo: typeof logo === 'string' && logo.startsWith('http') ? logo : undefined
        });

        if (res?.user) {
          const compCode = extractCompanyCode(companyName);
          const newCompany = {
            name: companyName,
            code: compCode,
            tagline: 'Every workday, perfectly aligned.',
            logo: logo || initialCompany.logo,
            contactEmail: email,
            phone: phone
          };

          setCompany(newCompany);
          setCurrentUser(res.user);
          setEmployees(prev => [res.user, ...prev.filter(e => e.id !== res.user.id)]);
          addToast('Organization Created!', `Welcome to Dayflow! Admin Employee ID: ${res.user.employeeId || res.user.loginId}`, 'success');
          await refreshBackendData(res.user);
          return { success: true, user: res.user };
        }
      } catch (err) {
        console.warn('Backend register error:', err.message);
        addToast('Registration Note', err.message || 'Could not complete on backend, registering locally.', 'warning');
      }
    }

    // 2. Local Fallback Registration
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
      employeeId: loginId,
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
    clearStoredToken();
    setCurrentUser(null);
    addToast('Signed Out', 'You have been safely logged out.', 'info');
  };

  /**
   * Update password
   */
  const updatePassword = async (employeeId, newPassword, oldPassword = '') => {
    if (backendConnected && oldPassword) {
      try {
        await authApi.changePassword(oldPassword, newPassword);
        addToast('Password Updated', 'Your new password is now active on the backend.', 'success');
      } catch (err) {
        addToast('Password Update Error', err.message || 'Failed to update backend password', 'danger');
      }
    }

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
   * Add New Employee (Admin Only) - Connects to POST /api/v1/users
   */
  const addEmployee = async (data) => {
    const fullName = `${data.firstName} ${data.lastName}`.trim();
    const joiningDate = data.joiningDate || new Date().toISOString().split('T')[0];

    // 1. Try Backend Onboarding
    if (backendConnected) {
      try {
        const payload = {
          name: fullName,
          email: data.email.trim(),
          role: data.role || 'employee',
          profile: {
            mobile: data.phone || '',
            department: data.department || 'Engineering',
          },
          privateInfo: {
            dateOfJoining: joiningDate,
          },
          salaryStructure: {
            basic: Number(data.basicSalary || 75000),
          },
        };

        const res = await usersApi.createUser(payload);
        if (res?.user) {
          const transformed = {
            ...res.user,
            designation: data.designation || 'Software Engineer',
            address: data.address || '',
            bloodGroup: data.bloodGroup || 'B+',
            leaveBalances: {
              paid: Number(data.paidLeave || 14),
              sick: Number(data.sickLeave || 8),
              casual: Number(data.casualLeave || 5),
              unpaid: 0
            },
            salary: {
              basic: Number(data.basicSalary || 75000),
              hra: Number(data.hra || 30000),
              specialAllowance: Number(data.specialAllowance || 12000),
              providentFund: Number(data.providentFund || 9000),
              professionalTax: 2500,
              incomeTax: Number(data.incomeTax || 8500)
            }
          };

          setEmployees(prev => [transformed, ...prev]);
          addToast('Employee Onboarded', `Created profile for ${transformed.fullName} with Login ID: ${transformed.loginId}`, 'success');
          return {
            success: true,
            employee: transformed,
            tempPassword: res.generatedPassword || 'AutoGenerated'
          };
        }
      } catch (err) {
        console.warn('Backend createUser failed, proceeding with local fallback:', err.message);
        addToast('Notice', `Backend error: ${err.message}. Adding locally.`, 'warning');
      }
    }

    // 2. Local Fallback Onboarding
    const year = data.joiningDate ? data.joiningDate.substring(0, 4) : new Date().getFullYear().toString();
    const loginId = generateLoginId(company.code, data.firstName, data.lastName, year);
    const tempPassword = generateTempPassword();

    const newEmp = {
      id: `EMP-${(employees.length + 1).toString().padStart(3, '0')}`,
      loginId,
      employeeId: loginId,
      firstName: data.firstName,
      lastName: data.lastName,
      fullName: fullName,
      email: data.email,
      role: data.role || 'employee',
      phone: data.phone || '',
      joiningDate: joiningDate,
      department: data.department || 'Engineering',
      designation: data.designation || 'Specialist',
      status: 'Active',
      avatar: data.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.firstName}_${data.lastName}`,
      address: data.address || '',
      emergencyContact: data.emergencyContact || '',
      bloodGroup: data.bloodGroup || 'B+',
      password: tempPassword,
      isFirstLogin: true,
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

    setEmployees(prev => [newEmp, ...prev]);
    addToast('Employee Onboarded', `Created profile for ${newEmp.fullName} with Login ID: ${loginId}`, 'success');
    return { success: true, employee: newEmp, tempPassword };
  };

  /**
   * Edit Employee Profile (Self-Service or Admin)
   */
  const updateEmployee = async (id, updatedFields, isSelfEdit = false) => {
    // 1. Try Backend Update
    if (backendConnected) {
      try {
        if (isSelfEdit) {
          const profilePayload = {
            mobile: updatedFields.phone || currentUser?.phone,
            address: updatedFields.address || currentUser?.address,
            profilePicture: updatedFields.avatar || currentUser?.avatar,
          };
          const updated = await usersApi.updateMyProfile(profilePayload);
          if (updated) {
            setCurrentUser(prev => ({ ...prev, ...updated, ...updatedFields }));
          }
        } else if (id && id.length === 24) {
          // Valid MongoDB ObjectId
          const updatePayload = {
            name: updatedFields.fullName,
            role: updatedFields.role,
            profile: {
              mobile: updatedFields.phone,
              department: updatedFields.department,
              address: updatedFields.address,
              profilePicture: updatedFields.avatar,
            },
            salaryStructure: updatedFields.salary ? {
              basic: updatedFields.salary.basic,
              allowances: updatedFields.salary.specialAllowance,
              deductions: updatedFields.salary.incomeTax,
            } : undefined,
          };
          await usersApi.updateUser(id, updatePayload);
        }
      } catch (err) {
        console.warn('Backend updateEmployee error:', err.message);
      }
    }

    // 2. Local State Update
    setEmployees(prev =>
      prev.map(emp => {
        if (emp.id === id || emp.loginId === id || emp._id === id) {
          if (isSelfEdit) {
            return {
              ...emp,
              phone: updatedFields.phone ?? emp.phone,
              address: updatedFields.address ?? emp.address,
              avatar: updatedFields.avatar ?? emp.avatar,
              emergencyContact: updatedFields.emergencyContact ?? emp.emergencyContact,
              bloodGroup: updatedFields.bloodGroup ?? emp.bloodGroup
            };
          }
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

    if (currentUser && (currentUser.id === id || currentUser.loginId === id || currentUser._id === id)) {
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
   * Check In Punch - Connects to POST /api/v1/attendance/check-in
   */
  const checkIn = async (employeeId, device = 'Web Portal') => {
    const today = new Date().toISOString().split('T')[0];
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

    if (backendConnected && currentUser) {
      try {
        const attRec = await attendanceApi.checkIn();
        if (attRec) {
          setAttendance(prev => [attRec, ...prev.filter(a => a.date !== today || a.employeeId !== currentUser.id)]);
          addToast('Checked In (Backend Synced)', `Shift started at ${attRec.checkIn || nowTime}`, 'success');
          return;
        }
      } catch (err) {
        console.warn('Backend checkIn failed:', err.message);
        addToast('Check In Notice', err.message || 'Saved punch locally.', 'info');
      }
    }

    // Local punch fallback
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
   * Check Out Punch - Connects to POST /api/v1/attendance/check-out
   */
  const checkOut = async (employeeId) => {
    const today = new Date().toISOString().split('T')[0];
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

    if (backendConnected && currentUser) {
      try {
        const attRec = await attendanceApi.checkOut();
        if (attRec) {
          setAttendance(prev => prev.map(a => (a.date === today && (a.employeeId === currentUser.id || a.loginId === currentUser.loginId)) ? attRec : a));
          addToast('Checked Out (Backend Synced)', `Shift concluded at ${attRec.checkOut || nowTime}. Hours logged: ${attRec.hoursWorked}`, 'info');
          return;
        }
      } catch (err) {
        console.warn('Backend checkOut failed:', err.message);
        addToast('Check Out Notice', err.message || 'Saved punch locally.', 'info');
      }
    }

    // Local punch checkout fallback
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
   * Apply for Leave (Employee) - Connects to POST /api/v1/leaves
   */
  const applyLeave = async ({ leaveType, startDate, endDate, days, reason }) => {
    if (!currentUser) return;

    // Check balance
    const balanceKey = leaveType.toLowerCase();
    const available = currentUser.leaveBalances?.[balanceKey] || 0;

    if (balanceKey !== 'unpaid' && days > available) {
      addToast('Insufficient Balance', `You only have ${available} ${leaveType} leave days remaining.`, 'danger');
      return { success: false, error: 'Insufficient balance' };
    }

    // 1. Try Backend Apply
    if (backendConnected) {
      try {
        const res = await leaveApi.applyLeave({
          leaveType: leaveType === 'Casual' ? 'Paid' : leaveType, // Map Casual to Paid if needed
          startDate: new Date(startDate).toISOString(),
          endDate: new Date(endDate).toISOString(),
          remarks: reason
        });

        if (res) {
          setLeaveRequests(prev => [res, ...prev]);
          addToast('Leave Request Submitted', `Application for ${days} day(s) sent to HR on backend.`, 'info');
          return { success: true, request: res };
        }
      } catch (err) {
        console.warn('Backend applyLeave error:', err.message);
        addToast('Notice', `Backend error: ${err.message}. Submitted locally.`, 'warning');
      }
    }

    // 2. Local Fallback
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
   * Review Leave (Admin/HR Officer) - Connects to PATCH /api/v1/leaves/:id/approve
   */
  const reviewLeave = async (requestId, newStatus, comments = '') => {
    const req = leaveRequests.find(r => r.id === requestId || r._id === requestId);
    if (!req) return;

    // 1. Try Backend Review
    if (backendConnected && (requestId.length === 24 || req._id?.length === 24)) {
      try {
        const idToUse = req._id || requestId;
        const res = await leaveApi.reviewLeave(idToUse, newStatus, comments);
        if (res) {
          setLeaveRequests(prev => prev.map(r => (r.id === requestId || r._id === requestId) ? res : r));
          addToast(`Leave ${newStatus}`, `Request has been ${newStatus.toLowerCase()} on backend.`, newStatus === 'Approved' ? 'success' : 'danger');
          return;
        }
      } catch (err) {
        console.warn('Backend reviewLeave error:', err.message);
      }
    }

    // 2. Local Fallback Review
    setLeaveRequests(prev =>
      prev.map(r => {
        if (r.id === requestId || r._id === requestId) {
          return { ...r, status: newStatus, reviewerComments: comments };
        }
        return r;
      })
    );

    if (newStatus === 'Approved') {
      const balanceKey = req.leaveType.toLowerCase();
      setEmployees(prev =>
        prev.map(emp => {
          if (emp.id === req.employeeId || emp.loginId === req.loginId) {
            const currentBal = emp.leaveBalances?.[balanceKey] || 0;
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
  const updateSalaryStructure = async (employeeId, newSalary) => {
    if (backendConnected && employeeId && employeeId.length === 24) {
      try {
        await usersApi.updateUser(employeeId, {
          salaryStructure: {
            basic: newSalary.basic,
            allowances: newSalary.specialAllowance,
            deductions: newSalary.incomeTax
          }
        });
      } catch (err) {
        console.warn('Backend updateSalaryStructure error:', err.message);
      }
    }

    setEmployees(prev =>
      prev.map(emp => {
        if (emp.id === employeeId || emp.loginId === employeeId || emp._id === employeeId) {
          return {
            ...emp,
            salary: { ...emp.salary, ...newSalary }
          };
        }
        return emp;
      })
    );

    if (currentUser && (currentUser.id === employeeId || currentUser.loginId === employeeId || currentUser._id === employeeId)) {
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
    clearStoredToken();
    setCompany(initialCompany);
    setEmployees(initialEmployees);
    setCurrentUser(initialEmployees[0]);
    setAttendance(initialAttendance);
    setLeaveRequests(initialLeaveRequests);
    setAnnouncements(initialAnnouncements);
    localStorage.clear();
    addToast('System Reset', 'All demo data has been restored to defaults.', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        backendConnected,
        checkBackendHealth,
        isInitializing,
        company,
        setCompany,
        employees,
        currentUser,
        setCurrentUser,
        attendance,
        setAttendance,
        leaveRequests,
        setLeaveRequests,
        payrolls,
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
        resetDemoData,
        refreshBackendData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
