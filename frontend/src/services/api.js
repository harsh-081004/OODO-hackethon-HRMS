/**
 * Dayflow HRMS - Backend API Service Layer
 * Connects frontend directly to Node.js/Express backend API (http://localhost:5000/api/v1)
 */

const API_BASE = import.meta.env.VITE_API_URL || '/api/v1';

// Token Management
export const getStoredToken = () => {
  return localStorage.getItem('dayflow_token') || null;
};

export const setStoredToken = (token) => {
  if (token) {
    localStorage.setItem('dayflow_token', token);
  } else {
    localStorage.removeItem('dayflow_token');
  }
};

export const clearStoredToken = () => {
  localStorage.removeItem('dayflow_token');
};

/**
 * Generic HTTP Request Wrapper
 */
async function request(endpoint, options = {}) {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE}${endpoint}`;
  const token = getStoredToken();

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Handle FormData if body is FormData
  if (options.body instanceof FormData) {
    delete headers['Content-Type'];
  } else if (options.body && typeof options.body === 'object') {
    options.body = JSON.stringify(options.body);
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const isJson = response.headers.get('content-type')?.includes('application/json');
    const data = isJson ? await response.json() : await response.text();

    if (!response.ok) {
      const errorMessage = data?.message || data?.error || response.statusText || 'Request failed';
      const error = new Error(errorMessage);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (error) {
    console.warn(`[API Request Error] ${options.method || 'GET'} ${url}:`, error.message);
    throw error;
  }
}

/**
 * Data Transformers between Backend Mongoose Models and Frontend State
 */

export const transformUserFromBackend = (u) => {
  if (!u) return null;
  const rawId = u._id || u.id;
  const nameParts = (u.name || '').trim().split(/\s+/);
  const firstName = nameParts[0] || 'User';
  const lastName = nameParts.slice(1).join(' ') || '';

  const basicSalary = u.salaryStructure?.basic || 75000;
  const allowances = u.salaryStructure?.allowances || Math.round(basicSalary * 0.4);
  const deductions = u.salaryStructure?.deductions || Math.round(basicSalary * 0.15);

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
      paid: 14,
      sick: 8,
      casual: 5,
      unpaid: 0,
    },
    salary: {
      basic: basicSalary,
      hra: Math.round(basicSalary * 0.4),
      specialAllowance: allowances,
      providentFund: Math.round(basicSalary * 0.12),
      professionalTax: 2500,
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
    device: 'Web Portal',
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
  const diffTime = end - start;
  const days = diffTime >= 0 ? Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1 : 1;

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
    days,
    reason: l.remarks || 'Time-off requested',
    status: l.status || 'Pending',
    appliedOn,
    reviewerComments: l.adminComments || null,
    approvedBy: l.approvedBy,
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
  };
};

/**
 * Health API
 */
export const healthApi = {
  check: async () => {
    try {
      const res = await fetch(`${API_BASE}/health`, { signal: AbortSignal.timeout(3000) });
      return res.ok;
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
    const res = await request('/auth/register', {
      method: 'POST',
      body: registerData,
    });
    if (res?.data?.tokens?.access?.token) {
      setStoredToken(res.data.tokens.access.token);
    }
    return {
      user: transformUserFromBackend(res?.data?.user),
      tokens: res?.data?.tokens,
      message: res?.message,
    };
  },

  login: async (email, password) => {
    const res = await request('/auth/login', {
      method: 'POST',
      body: { email, password },
    });
    if (res?.data?.tokens?.access?.token) {
      setStoredToken(res.data.tokens.access.token);
    }
    return {
      user: transformUserFromBackend(res?.data?.user),
      tokens: res?.data?.tokens,
      message: res?.message,
    };
  },

  changePassword: async (oldPassword, newPassword) => {
    return request('/auth/change-password', {
      method: 'PATCH',
      body: { oldPassword, newPassword },
    });
  },
};

/**
 * Users API
 */
export const usersApi = {
  getMe: async () => {
    const res = await request('/users/me');
    return transformUserFromBackend(res?.data || res);
  },

  updateMyProfile: async (profileData) => {
    const res = await request('/users/me', {
      method: 'PATCH',
      body: { profile: profileData },
    });
    return transformUserFromBackend(res?.data || res);
  },

  getAllUsers: async () => {
    const res = await request('/users');
    const list = res?.data || res || [];
    return Array.isArray(list) ? list.map(transformUserFromBackend) : [];
  },

  getUserById: async (userId) => {
    const res = await request(`/users/${userId}`);
    return transformUserFromBackend(res?.data || res);
  },

  createUser: async (userData) => {
    const res = await request('/users', {
      method: 'POST',
      body: userData,
    });
    return {
      user: transformUserFromBackend(res?.data?.user || res?.data),
      generatedPassword: res?.data?.generatedPassword,
      message: res?.message,
    };
  },

  updateUser: async (userId, updateData) => {
    const res = await request(`/users/${userId}`, {
      method: 'PATCH',
      body: updateData,
    });
    return transformUserFromBackend(res?.data || res);
  },
};

/**
 * Attendance API
 */
export const attendanceApi = {
  checkIn: async () => {
    const res = await request('/attendance/check-in', {
      method: 'POST',
    });
    return transformAttendanceFromBackend(res?.data || res);
  },

  checkOut: async () => {
    const res = await request('/attendance/check-out', {
      method: 'POST',
    });
    return transformAttendanceFromBackend(res?.data || res);
  },

  getMyAttendance: async () => {
    const res = await request('/attendance/me');
    const list = res?.data || res || [];
    return Array.isArray(list) ? list.map(transformAttendanceFromBackend) : [];
  },

  getAllAttendance: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await request(`/attendance${query ? `?${query}` : ''}`);
    const list = res?.data || res || [];
    return Array.isArray(list) ? list.map(transformAttendanceFromBackend) : [];
  },
};

/**
 * Leave API
 */
export const leaveApi = {
  applyLeave: async (leaveData) => {
    const res = await request('/leaves', {
      method: 'POST',
      body: leaveData,
    });
    return transformLeaveFromBackend(res?.data || res);
  },

  getMyLeaves: async () => {
    const res = await request('/leaves/me');
    const list = res?.data || res || [];
    return Array.isArray(list) ? list.map(transformLeaveFromBackend) : [];
  },

  getAllLeaves: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await request(`/leaves${query ? `?${query}` : ''}`);
    const list = res?.data || res || [];
    return Array.isArray(list) ? list.map(transformLeaveFromBackend) : [];
  },

  reviewLeave: async (leaveId, status, adminComments = '') => {
    const res = await request(`/leaves/${leaveId}/approve`, {
      method: 'PATCH',
      body: { status, adminComments },
    });
    return transformLeaveFromBackend(res?.data || res);
  },
};

/**
 * Payroll API
 */
export const payrollApi = {
  getMyPayrolls: async () => {
    const res = await request('/payrolls/me');
    const list = res?.data || res || [];
    return Array.isArray(list) ? list.map(transformPayrollFromBackend) : [];
  },

  getAllPayrolls: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await request(`/payrolls${query ? `?${query}` : ''}`);
    const list = res?.data || res || [];
    return Array.isArray(list) ? list.map(transformPayrollFromBackend) : [];
  },

  createPayroll: async (payrollData) => {
    const res = await request('/payrolls', {
      method: 'POST',
      body: payrollData,
    });
    return transformPayrollFromBackend(res?.data || res);
  },

  updatePayroll: async (payrollId, updateData) => {
    const res = await request(`/payrolls/${payrollId}`, {
      method: 'PATCH',
      body: updateData,
    });
    return transformPayrollFromBackend(res?.data || res);
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

