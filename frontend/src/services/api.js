/**
 * Dayflow HRMS - Backend API Service Layer
 * Connects frontend directly to Node.js/Express backend API
 */

import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1';

// Token Management
export const getStoredToken = () => {
  const match = document.cookie.match(new RegExp('(^| )dayflow_token=([^;]+)'));
  return match ? match[2] : null;
};

export const setStoredToken = (token) => {
  if (token) {
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000).toUTCString();
    document.cookie = `dayflow_token=${token}; expires=${expires}; path=/`;
  } else {
    document.cookie = 'dayflow_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/';
  }
};

export const clearStoredToken = () => {
  document.cookie = 'dayflow_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/';
};

// Create Axios Instance
const api = axios.create({
  baseURL: API_BASE,
  timeout: 60000, // Increased timeout to 60s for Render cold starts and Cloudinary uploads
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor (Inject Token)
api.interceptors.request.use(
  (config) => {
    const token = getStoredToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor (Error Handling)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.warn('[API Error]', error.response?.data?.message || error.message);
    // You can optionally handle 401 unauthorized globally here to log out the user
    return Promise.reject(error.response?.data || error);
  }
);


/**
 * Data Transformers between Backend Mongoose Models and Frontend State
 */

export const transformUserFromBackend = (u) => {
  if (!u) return null;
  const rawId = u._id || u.id;
  const nameParts = (u.name || '').trim().split(/\s+/);
  const firstName = nameParts[0] || 'User';
  const lastName = nameParts.slice(1).join(' ') || '';

  const basicSalary = u.salaryStructure?.basic?.value || u.salaryStructure?.wage || 75000;
  const hra = u.salaryStructure?.components?.hra?.value || Math.round(basicSalary * 0.4);
  const deductions = u.salaryStructure?.deductions?.pf?.value || Math.round(basicSalary * 0.15);

  const joiningDateRaw = u.privateInfo?.dateOfJoining || u.createdAt;
  const joiningDate = joiningDateRaw
    ? new Date(joiningDateRaw).toISOString().split('T')[0]
    : new Date().toISOString().split('T')[0];

  return {
    id: rawId,
    _id: rawId,
    loginId: u.employeeId || `EMP-${String(rawId).slice(-4)}`,
    employeeId: u.employeeId || `EMP-${String(rawId).slice(-4)}`,
    firstName,
    lastName,
    fullName: u.name || `${firstName} ${lastName}`.trim(),
    email: u.email,
    role: u.role || 'employee',
    phone: u.profile?.mobile || u.phone || '',
    department: u.profile?.department || 'Engineering',
    designation: u.designation || (u.role === 'admin' ? 'Managing Director / HR Admin' : 'Software Engineer'),
    status: u.status || 'Active',
    avatar: u.profile?.profilePicture || u.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(u.name || 'User')}`,
    address: u.profile?.address || u.privateInfo?.residingAddress || '',
    emergencyContact: u.profile?.mobile || u.phone || '',
    bloodGroup: u.bloodGroup || 'B+',
    joiningDate,
    isFirstLogin: false,
    leaveBalances: {
      paid: u.leaveBalances?.paid ?? 24,
      sick: u.leaveBalances?.sick ?? 7,
      casual: u.leaveBalances?.unpaid ?? 0,
      unpaid: u.leaveBalances?.unpaid ?? 0,
    },
    salary: {
      basic: basicSalary,
      hra: hra,
      specialAllowance: u.salaryStructure?.components?.standardAllowance?.value || 0,
      providentFund: u.salaryStructure?.deductions?.pf?.value || Math.round(basicSalary * 0.12),
      professionalTax: u.salaryStructure?.deductions?.professionalTax || 2500,
      incomeTax: deductions,
    },
    salaryStructure: u.salaryStructure,
    profile: u.profile,
    privateInfo: u.privateInfo,
    companyName: u.companyName,
    companyLogo: u.companyLogo,
  };
};

export const transformAttendanceFromBackend = (att) => {
  if (!att) return null;
  const dateObj = new Date(att.date || att.createdAt);
  const dateStr = !isNaN(dateObj) ? dateObj.toISOString().split('T')[0] : new Date().toISOString().split('T')[0];

  const formatTime = (timeVal) => {
    if (!timeVal) return null;
    const d = new Date(timeVal);
    if (isNaN(d)) return timeVal;
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const userObj = att.user && typeof att.user === 'object' ? att.user : null;
  const userId = userObj ? (userObj._id || userObj.id) : att.user;
  const userName = userObj ? userObj.name : 'Employee';
  const loginId = userObj ? (userObj.employeeId || `ID-${String(userId).slice(-4)}`) : 'ID';

  return {
    id: att._id || att.id,
    _id: att._id || att.id,
    employeeId: userId,
    employeeName: userName,
    loginId: loginId,
    date: dateStr,
    checkIn: formatTime(att.checkIn),
    checkOut: formatTime(att.checkOut),
    status: att.status || 'Present',
    hoursWorked: att.workHours || (att.checkOut ? 8.5 : 0),
    extraHours: att.extraHours || 0,
    device: att.device || 'Web Portal',
  };
};

export const transformLeaveFromBackend = (l) => {
  if (!l) return null;
  const userObj = l.user && typeof l.user === 'object' ? l.user : null;
  const userId = userObj ? (userObj._id || userObj.id) : l.user;
  const userName = userObj ? userObj.name : 'Employee';
  const loginId = userObj ? (userObj.employeeId || `ID-${String(userId).slice(-4)}`) : 'ID';

  const start = new Date(l.startDate);
  const end = new Date(l.endDate);
  
  const appliedOn = l.createdAt ? new Date(l.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];

  return {
    id: l._id || l.id,
    _id: l._id || l.id,
    employeeId: userId,
    employeeName: userName,
    loginId: loginId,
    department: userObj?.profile?.department || 'General',
    leaveType: l.leaveType || 'Paid',
    startDate: !isNaN(start) ? start.toISOString().split('T')[0] : l.startDate,
    endDate: !isNaN(end) ? end.toISOString().split('T')[0] : l.endDate,
    days: l.allocationDays || 1,
    reason: l.remarks || 'Time-off requested',
    status: l.status || 'Pending',
    appliedOn,
    reviewerComments: l.adminComments || null,
    approvedBy: l.approvedBy,
    attachment: l.attachment || null,
  };
};

export const transformPayrollFromBackend = (p) => {
  if (!p) return null;
  const userObj = p.user && typeof p.user === 'object' ? p.user : null;
  const userId = userObj ? (userObj._id || userObj.id) : p.user;
  const userName = userObj ? userObj.name : 'Employee';
  const loginId = userObj ? (userObj.employeeId || `ID-${String(userId).slice(-4)}`) : 'ID';

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const monthName = p.month >= 1 && p.month <= 12 ? monthNames[p.month - 1] : 'August';

  return {
    id: p._id || p.id,
    _id: p._id || p.id,
    employeeId: userId,
    employeeName: userName,
    loginId: loginId,
    month: p.month,
    year: p.year,
    period: `${monthName} ${p.year}`,
    basicSalary: p.basicSalary || 0,
    allowances: p.allowances || 0,
    deductions: p.deductions || 0,
    netSalary: p.netSalary || (p.basicSalary + (p.allowances || 0) - (p.deductions || 0)),
    status: p.status || 'Pending',
    paymentDate: p.paymentDate ? new Date(p.paymentDate).toISOString().split('T')[0] : null,
    payslipNumber: p.payslipNumber,
  };
};

/**
 * Health API
 */
export const healthApi = {
  check: async () => {
    try {
      const res = await api.get('/health', { timeout: 3000 });
      return res.status === 200;
    } catch {
      return false;
    }
  },
};

/**
 * Auth API
 */
export const authApi = {
  register: async (registerData) => {
    const res = await api.post('/auth/register', registerData, {
      headers: {
        // Important: Use multipart/form-data if you have a file upload (logo)
        'Content-Type': registerData instanceof FormData ? 'multipart/form-data' : 'application/json',
      }
    });
    // We NO LONGER set tokens here because they must verify their email first
    return {
      user: transformUserFromBackend(res.data.data?.user || res.data.data),
      message: res.data.message,
    };
  },

  verifyEmail: async (token) => {
    const res = await api.get(`/auth/verify-email?token=${token}`);
    return res.data;
  },

  login: async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data.data?.tokens?.access?.token) {
      setStoredToken(res.data.data.tokens.access.token);
    }
    return {
      user: transformUserFromBackend(res.data.data?.user),
      tokens: res.data.data?.tokens,
      message: res.data.message,
    };
  },

  changePassword: async (data) => {
    const response = await api.post('/auth/change-password', data);
    return response.data.data;
  },
  requestPasswordOtp: async () => {
    const response = await api.post('/auth/request-password-otp');
    return response.data;
  },
  changePasswordWithOtp: async (data) => {
    const response = await api.post('/auth/change-password-otp', data);
    return response.data;
  }
};

/**
 * Users API
 */
export const usersApi = {
  getMe: async () => {
    const res = await api.get('/users/me');
    return transformUserFromBackend(res.data.data);
  },

  updateMyProfile: async (profileData) => {
    const res = await api.patch('/users/me', profileData);
    return transformUserFromBackend(res.data.data);
  },

  getAllUsers: async () => {
    const res = await api.get('/users');
    const list = res.data.data || [];
    return Array.isArray(list) ? list.map(transformUserFromBackend) : [];
  },

  getUserById: async (userId) => {
    const res = await api.get(`/users/${userId}`);
    return transformUserFromBackend(res.data.data);
  },

  createUser: async (userData) => {
    const res = await api.post('/users', userData);
    return {
      user: transformUserFromBackend(res.data.data?.user),
      generatedPassword: res.data.data?.generatedPassword,
      message: res.data.message,
    };
  },

  updateUser: async (userId, updateData) => {
    const res = await api.patch(`/users/${userId}`, updateData);
    return transformUserFromBackend(res.data.data);
  },
};

/**
 * Attendance API
 */
export const attendanceApi = {
  checkIn: async (device) => {
    const res = await api.post('/attendance/check-in', { device });
    return transformAttendanceFromBackend(res.data.data);
  },

  checkOut: async () => {
    const res = await api.post('/attendance/check-out');
    return transformAttendanceFromBackend(res.data.data);
  },

  getMyAttendance: async () => {
    const res = await api.get('/attendance/me');
    const list = res.data.data || [];
    return Array.isArray(list) ? list.map(transformAttendanceFromBackend) : [];
  },

  getAllAttendance: async (params = {}) => {
    const res = await api.get('/attendance', { params });
    const list = res.data.data || [];
    return Array.isArray(list) ? list.map(transformAttendanceFromBackend) : [];
  },

  overrideAttendance: async (employeeId, date, status) => {
    const res = await api.patch(`/attendance/${employeeId}/override`, { date, status });
    return transformAttendanceFromBackend(res.data.data);
  },
};

/**
 * Leave API
 */
export const leaveApi = {
  applyLeave: async (leaveData) => {
    const res = await api.post('/leaves', leaveData);
    return transformLeaveFromBackend(res.data.data);
  },

  getMyLeaves: async () => {
    const res = await api.get('/leaves/me');
    const list = res.data.data || [];
    return Array.isArray(list) ? list.map(transformLeaveFromBackend) : [];
  },

  getAllLeaves: async (params = {}) => {
    const res = await api.get('/leaves', { params });
    const list = res.data.data || [];
    return Array.isArray(list) ? list.map(transformLeaveFromBackend) : [];
  },

  reviewLeave: async (leaveId, status, adminComments = '') => {
    const res = await api.patch(`/leaves/${leaveId}/approve`, { status, adminComments });
    return transformLeaveFromBackend(res.data.data);
  },
};

/**
 * Payroll API
 */
export const payrollApi = {
  getMyPayrolls: async () => {
    const res = await api.get('/payrolls/me');
    const list = res.data.data || [];
    return Array.isArray(list) ? list.map(transformPayrollFromBackend) : [];
  },

  getAllPayrolls: async (params = {}) => {
    const res = await api.get('/payrolls', { params });
    const list = res.data.data || [];
    return Array.isArray(list) ? list.map(transformPayrollFromBackend) : [];
  },

  createPayroll: async (payrollData) => {
    const res = await api.post('/payrolls', payrollData);
    return transformPayrollFromBackend(res.data.data);
  },

  updatePayroll: async (payrollId, updateData) => {
    const res = await api.patch(`/payrolls/${payrollId}`, updateData);
    return transformPayrollFromBackend(res.data.data);
  },
};

/**
 * Reports API (PDF Payslips)
 */
export const reportsApi = {
  downloadPayslipPdf: async (payrollId) => {
    const token = getStoredToken();
    const res = await fetch(`${API_BASE}/reports/payslip/${payrollId}`, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    if (!res.ok) throw new Error('Failed to download PDF payslip from backend');
    return res.blob();
  },
};

/**
 * Notice API
 */
export const transformNoticeFromBackend = (n) => {
  if (!n) return null;
  return {
    id: n._id || n.id,
    _id: n._id || n.id,
    title: n.title,
    content: n.content,
    isActive: n.isActive,
    author: n.author,
    createdAt: n.createdAt,
    updatedAt: n.updatedAt,
  };
};

export const noticeApi = {
  getAllNotices: async (params = {}) => {
    const res = await api.get('/notices', { params });
    const list = res.data.data || [];
    return Array.isArray(list) ? list.map(transformNoticeFromBackend) : [];
  },
  createNotice: async (noticeData) => {
    const res = await api.post('/notices', noticeData);
    return transformNoticeFromBackend(res.data.data);
  },
  updateNotice: async (noticeId, updateData) => {
    const res = await api.patch(`/notices/${noticeId}`, updateData);
    return transformNoticeFromBackend(res.data.data);
  },
  deleteNotice: async (noticeId) => {
    await api.delete(`/notices/${noticeId}`);
    return true;
  }
};

