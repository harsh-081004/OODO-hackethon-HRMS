import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  authApi,
  usersApi,
  attendanceApi,
  leaveApi,
  payrollApi,
  healthApi,
  noticeApi,
  getStoredToken,
  clearStoredToken,
} from '../services/api';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => localStorage.getItem('dayflow_theme') || 'light');
  const [backendConnected, setBackendConnected] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  // Application Data States (Strictly from Backend)
  const [currentUser, setCurrentUser] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [payrolls, setPayrolls] = useState([]);
  const [notices, setNotices] = useState([]);
  const [company, setCompany] = useState({ name: 'Dayflow HR', logo: null });
  const [toasts, setToasts] = useState([]);
  
  // UI States
  const [isGlobalLoading, setIsGlobalLoading] = useState(false);
  const [readNotifications, setReadNotifications] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('dayflow_read_notifications')) || [];
    } catch {
      return [];
    }
  });

  const markNotificationsAsRead = (ids) => {
    const newRead = [...new Set([...readNotifications, ...ids])];
    setReadNotifications(newRead);
    localStorage.setItem('dayflow_read_notifications', JSON.stringify(newRead));
  };

  // Sync theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('dayflow_theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => (prev === 'light' ? 'dark' : 'light'));

  const addToast = (title, message, type = 'info') => {
    const id = Date.now() + Math.random().toString();
    setToasts(prev => [...prev, { id, title, message, type }]);
    setTimeout(() => removeToast(id), 4500);
  };

  const removeToast = (id) => setToasts(prev => prev.filter(t => t.id !== id));

  const extractCompanyCode = (name) => {
    if (!name) return 'OI';
    const words = name.trim().split(/\s+/);
    if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  const generateLoginId = (code, first, last, year) => {
    const c = code || 'OI';
    const f = first.substring(0,2).toUpperCase();
    const l = last.substring(0,2).toUpperCase();
    return `${c}${year.substring(2)}${f}${l}${Math.floor(Math.random()*1000).toString().padStart(3,'0')}`;
  };

  const checkBackendHealth = useCallback(async () => {
    const isHealthy = await healthApi.check();
    setBackendConnected(isHealthy);
    return isHealthy;
  }, []);

  const refreshBackendData = useCallback(async (user) => {
    const activeUser = user || currentUser;
    if (!activeUser) return;
    setIsGlobalLoading(true);

    try {
      if (activeUser.role === 'admin' || activeUser.role === 'hr') {
        const [usersList, attList, leavesList, payList, noticeList] = await Promise.allSettled([
          usersApi.getAllUsers(),
          attendanceApi.getAllAttendance(),
          leaveApi.getAllLeaves(),
          payrollApi.getAllPayrolls(),
          noticeApi.getAllNotices(),
        ]);

        if (usersList.status === 'fulfilled') setEmployees(usersList.value);
        if (attList.status === 'fulfilled') setAttendance(attList.value);
        if (leavesList.status === 'fulfilled') setLeaveRequests(leavesList.value);
        if (payList.status === 'fulfilled') setPayrolls(payList.value);
        if (noticeList.status === 'fulfilled') setNotices(noticeList.value);
      } else {
        const [attList, leavesList, payList, noticeList] = await Promise.allSettled([
          attendanceApi.getMyAttendance(),
          leaveApi.getMyLeaves(),
          payrollApi.getMyPayrolls(),
          noticeApi.getAllNotices({ isActive: true }),
        ]);

        if (attList.status === 'fulfilled') setAttendance(attList.value);
        if (leavesList.status === 'fulfilled') setLeaveRequests(leavesList.value);
        if (payList.status === 'fulfilled') setPayrolls(payList.value);
        if (noticeList.status === 'fulfilled') setNotices(noticeList.value);
      }
    } catch (err) {
      console.warn('Error refreshing backend data:', err);
    } finally {
      setIsGlobalLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    let isMounted = true;
    const initialize = async () => {
      await checkBackendHealth();
      const token = getStoredToken();
      if (token) {
        try {
          const me = await usersApi.getMe();
          if (isMounted && me) {
            setCurrentUser(me);
            if (me.companyName) {
              setCompany({ name: me.companyName, logo: me.companyLogo });
            }
            await refreshBackendData(me);
          }
        } catch (err) {
          clearStoredToken();
        }
      }
      if (isMounted) setIsInitializing(false);
    };
    initialize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auth Methods
  const login = async (email, password) => {
    try {
      const res = await authApi.login(email, password);
      if (res.user) {
        setCurrentUser(res.user);
        if (res.user.companyName) {
          setCompany({ name: res.user.companyName, logo: res.user.companyLogo });
        }
        addToast('Welcome Back', `Logged in as ${res.user.fullName}`, 'success');
        await refreshBackendData(res.user);
        return { success: true, user: res.user };
      }
    } catch (err) {
      addToast('Authentication Failed', err.message || 'Invalid email or password.', 'danger');
      return { success: false, error: err.message };
    }
  };

  const registerCompany = async (data) => {
    try {
      const formData = new FormData();
      formData.append('companyName', data.companyName);
      formData.append('name', data.adminName);
      formData.append('email', data.email);
      formData.append('phone', data.phone);
      formData.append('password', data.password);
      if (data.logo) {
        formData.append('companyLogo', data.logo);
      }

      const res = await authApi.register(formData);
      addToast('Registration Successful', res.message || 'Please check your email to verify your account.', 'success');
      return { success: true, message: res.message };
    } catch (err) {
      addToast('Registration Failed', err.message || 'Could not register.', 'danger');
      return { success: false, error: err.message };
    }
  };

  const logout = () => {
    clearStoredToken();
    setCurrentUser(null);
    setEmployees([]);
    setAttendance([]);
    setLeaveRequests([]);
    setPayrolls([]);
    setNotices([]);
    addToast('Signed Out', 'You have been safely logged out.', 'info');
  };

  const updatePassword = async (employeeId, newPassword, oldPassword = '') => {
    try {
      await authApi.changePassword(oldPassword, newPassword);
      addToast('Password Updated', 'Your new password is now active.', 'success');
      return { success: true };
    } catch (err) {
      addToast('Password Update Error', err.message || 'Failed to update password', 'danger');
      return { success: false, error: err.message };
    }
  };

  // Employees Methods
  const addEmployee = async (data) => {
    try {
      const payload = {
        name: `${data.firstName} ${data.lastName}`,
        email: data.email,
        role: data.role || 'employee',
        phone: data.phone || '',
        privateInfo: {
          dateOfJoining: data.joiningDate || new Date().toISOString().split('T')[0],
        },
        salaryStructure: {
          wage: Number(data.basicSalary || 75000),
          components: {
             standardAllowance: { value: Number(data.specialAllowance || 0) }
          }
        },
        leaveBalances: {
          paid: Number(data.paidLeave || 14),
          sick: Number(data.sickLeave || 8),
          unpaid: Number(data.casualLeave || 5)
        }
      };
      const res = await usersApi.createUser(payload);
      setEmployees(prev => [res.user, ...prev]);
      addToast('Employee Onboarded', `Created profile. Password auto-generated.`, 'success');
      return { success: true, employee: res.user, tempPassword: res.generatedPassword };
    } catch (err) {
      addToast('Error', err.message || 'Failed to add employee.', 'danger');
      return { success: false, error: err.message };
    }
  };

  const updateEmployee = async (id, updatedFields, isSelfEdit = false) => {
    try {
      if (isSelfEdit) {
        const profilePayload = {
          profile: {
            mobile: updatedFields.phone,
            address: updatedFields.address,
            profilePicture: updatedFields.avatar,
          }
        };
        const updated = await usersApi.updateMyProfile(profilePayload);
        setCurrentUser(updated);
      } else {
        const updatePayload = {
          name: updatedFields.fullName,
          role: updatedFields.role,
          profile: {
            mobile: updatedFields.phone,
            department: updatedFields.department,
            address: updatedFields.address,
            profilePicture: updatedFields.avatar,
          }
        };
        const updated = await usersApi.updateUser(id, updatePayload);
        setEmployees(prev => prev.map(emp => emp.id === id ? updated : emp));
      }
      addToast('Profile Updated', 'Employee details saved successfully.', 'success');
    } catch (err) {
      addToast('Update Error', err.message || 'Failed to update employee.', 'danger');
    }
  };

  const updateSalaryStructure = async (employeeId, newSalary) => {
    try {
      const updated = await usersApi.updateUser(employeeId, {
        salaryStructure: {
          wage: newSalary.basic,
          components: {
            standardAllowance: { value: newSalary.specialAllowance }
          },
          deductions: {
            pf: { value: newSalary.providentFund }
          }
        }
      });
      setEmployees(prev => prev.map(emp => emp.id === employeeId ? updated : emp));
      addToast('Payroll Updated', 'Salary structure saved.', 'success');
    } catch (err) {
      addToast('Update Error', err.message || 'Failed to update salary structure.', 'danger');
    }
  };

  // Attendance Methods
  const checkIn = async (device = 'Web Portal') => {
    try {
      const attRec = await attendanceApi.checkIn(device);
      setAttendance(prev => [attRec, ...prev.filter(a => a.id !== attRec.id)]);
      addToast('Checked In', `Shift started successfully.`, 'success');
    } catch (err) {
      addToast('Check In Failed', err.message || 'Could not check in.', 'danger');
    }
  };

  const checkOut = async () => {
    try {
      const attRec = await attendanceApi.checkOut();
      setAttendance(prev => prev.map(a => a.id === attRec.id ? attRec : a));
      addToast('Checked Out', `Shift concluded successfully.`, 'info');
    } catch (err) {
      addToast('Check Out Failed', err.message || 'Could not check out.', 'danger');
    }
  };

  const overrideAttendance = async (employeeId, date, status) => {
    try {
      const updated = await attendanceApi.overrideAttendance(employeeId, date, status);
      setAttendance(prev => {
        const existingIndex = prev.findIndex(a => a.employeeId === employeeId && a.date === date);
        if (existingIndex >= 0) {
          const newArray = [...prev];
          newArray[existingIndex] = updated;
          return newArray;
        }
        return [updated, ...prev];
      });
      addToast('Attendance Overridden', `Status updated to ${status} for ${date}`, 'success');
    } catch (err) {
      addToast('Override Failed', err.message || 'Could not override attendance.', 'danger');
      throw err;
    }
  };

  // Leave Methods
  const applyLeave = async ({ leaveType, startDate, endDate, days, reason }) => {
    try {
      const res = await leaveApi.applyLeave({
        leaveType: leaveType === 'Casual' ? 'Paid' : leaveType,
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
        allocationDays: Number(days),
        remarks: reason
      });
      setLeaveRequests(prev => [res, ...prev]);
      addToast('Leave Request Submitted', `Application for ${days} day(s) sent.`, 'info');
      return { success: true, request: res };
    } catch (err) {
      addToast('Submission Failed', err.message || 'Could not apply for leave.', 'danger');
      return { success: false, error: err.message };
    }
  };

  const reviewLeave = async (requestId, newStatus, comments = '') => {
    try {
      const res = await leaveApi.reviewLeave(requestId, newStatus, comments);
      setLeaveRequests(prev => prev.map(r => r.id === requestId ? res : r));
      addToast(`Leave ${newStatus}`, `Request has been ${newStatus.toLowerCase()}.`, newStatus === 'Approved' ? 'success' : 'danger');
    } catch (err) {
      addToast('Review Failed', err.message || 'Could not review leave.', 'danger');
    }
  };

  // Notice Methods
  const createNotice = async (noticeData) => {
    try {
      const res = await noticeApi.createNotice(noticeData);
      setNotices(prev => [res, ...prev]);
      addToast('Notice Created', 'Notice successfully broadcasted.', 'success');
      return { success: true, notice: res };
    } catch (err) {
      addToast('Error', err.message || 'Failed to create notice.', 'danger');
      return { success: false, error: err.message };
    }
  };

  const updateNotice = async (noticeId, updateData) => {
    try {
      const res = await noticeApi.updateNotice(noticeId, updateData);
      setNotices(prev => prev.map(n => n.id === noticeId ? res : n));
      addToast('Notice Updated', 'Notice details saved.', 'success');
      return { success: true, notice: res };
    } catch (err) {
      addToast('Error', err.message || 'Failed to update notice.', 'danger');
      return { success: false, error: err.message };
    }
  };

  const deleteNotice = async (noticeId) => {
    try {
      await noticeApi.deleteNotice(noticeId);
      setNotices(prev => prev.filter(n => n.id !== noticeId));
      addToast('Notice Deleted Successfully', 'The notice has been removed from the company board.', 'success');
      return { success: true };
    } catch (err) {
      addToast('Error', err.message || 'Failed to delete notice.', 'danger');
      return { success: false, error: err.message };
    }
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
        leaveRequests,
        payrolls,
        notices,
        toasts,
        addToast,
        removeToast,
        login,
        registerCompany,
        logout,
        updatePassword,
        addEmployee,
        updateEmployee,
        checkIn,
        checkOut,
        overrideAttendance,
        applyLeave,
        reviewLeave,
        updateSalaryStructure,
        refreshBackendData,
        extractCompanyCode,
        generateLoginId,
        isGlobalLoading,
        readNotifications,
        markNotificationsAsRead,
        createNotice,
        updateNotice,
        deleteNotice
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
