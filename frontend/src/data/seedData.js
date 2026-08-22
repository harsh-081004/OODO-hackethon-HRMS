// Initial seed data for Dayflow HRMS
export const initialCompany = {
  name: "Odoo India",
  code: "OI",
  tagline: "Every workday, perfectly aligned.",
  logo: "https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=150&auto=format&fit=crop&q=80",
  address: "Odoo House, Infocity, Gandhinagar, Gujarat, India",
  contactEmail: "contact@odoo.com",
  phone: "+91 79 4050 0000"
};

export const initialEmployees = [
  {
    id: "EMP-001",
    loginId: "OISAJE20210001",
    firstName: "Sarah",
    lastName: "Jenkins",
    fullName: "Sarah Jenkins",
    email: "sarah.jenkins@odoo.com",
    role: "admin", // Admin / HR Officer
    phone: "+91 98765 43210",
    joiningDate: "2021-03-15",
    department: "Human Resources",
    designation: "Head of People Operations",
    status: "Active",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80",
    address: "402, Royal Palms, SG Highway, Ahmedabad, Gujarat",
    emergencyContact: "+91 98765 00000 (Spouse)",
    bloodGroup: "O+",
    password: "Password@123",
    isFirstLogin: false,
    leaveBalances: {
      paid: 18,
      sick: 10,
      casual: 6,
      unpaid: 0
    },
    salary: {
      basic: 120000,
      hra: 48000,
      specialAllowance: 22000,
      providentFund: 14400,
      professionalTax: 2500,
      incomeTax: 16500
    }
  },
  {
    id: "EMP-002",
    loginId: "OIJODO20220001",
    firstName: "John",
    lastName: "Doe",
    fullName: "John Doe",
    email: "john.doe@odoo.com",
    role: "employee",
    phone: "+91 98234 56789",
    joiningDate: "2022-06-01",
    department: "Engineering",
    designation: "Senior Full Stack Engineer",
    status: "Active",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
    address: "12, Maple Residency, Bodakdev, Ahmedabad",
    emergencyContact: "+91 98234 00000 (Father)",
    bloodGroup: "A+",
    password: "Password@123",
    isFirstLogin: false,
    leaveBalances: {
      paid: 14,
      sick: 8,
      casual: 4,
      unpaid: 0
    },
    salary: {
      basic: 95000,
      hra: 38000,
      specialAllowance: 15000,
      providentFund: 11400,
      professionalTax: 2500,
      incomeTax: 11200
    }
  },
  {
    id: "EMP-003",
    loginId: "OIPRSH20230002",
    firstName: "Priya",
    lastName: "Sharma",
    fullName: "Priya Sharma",
    email: "priya.sharma@odoo.com",
    role: "employee",
    phone: "+91 97123 45678",
    joiningDate: "2023-01-10",
    department: "Design",
    designation: "Lead Product Designer",
    status: "Active",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80",
    address: "704, Silver Oak Heights, Vastrapur, Ahmedabad",
    emergencyContact: "+91 97123 11111 (Mother)",
    bloodGroup: "B+",
    password: "Password@123",
    isFirstLogin: false,
    leaveBalances: {
      paid: 12,
      sick: 7,
      casual: 5,
      unpaid: 0
    },
    salary: {
      basic: 85000,
      hra: 34000,
      specialAllowance: 14000,
      providentFund: 10200,
      professionalTax: 2500,
      incomeTax: 9500
    }
  },
  {
    id: "EMP-004",
    loginId: "OIALRI20230003",
    firstName: "Alex",
    lastName: "Rivera",
    fullName: "Alex Rivera",
    email: "alex.rivera@odoo.com",
    role: "employee",
    phone: "+91 96543 21876",
    joiningDate: "2023-08-20",
    department: "Engineering",
    designation: "DevOps & Cloud Specialist",
    status: "Active",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
    address: "B-22, Green Valley Apartments, Prahlad Nagar, Ahmedabad",
    emergencyContact: "+91 96543 00000 (Sister)",
    bloodGroup: "AB+",
    password: "Password@123",
    isFirstLogin: false,
    leaveBalances: {
      paid: 10,
      sick: 6,
      casual: 3,
      unpaid: 0
    },
    salary: {
      basic: 90000,
      hra: 36000,
      specialAllowance: 14500,
      providentFund: 10800,
      professionalTax: 2500,
      incomeTax: 10800
    }
  },
  {
    id: "EMP-005",
    loginId: "OIMISC20240004",
    firstName: "Michael",
    lastName: "Scott",
    fullName: "Michael Scott",
    email: "michael.scott@odoo.com",
    role: "employee",
    phone: "+91 99887 76655",
    joiningDate: "2024-02-01",
    department: "Sales & Marketing",
    designation: "Enterprise Growth Lead",
    status: "Active",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80",
    address: "101, Dunder Heights, Science City Road, Ahmedabad",
    emergencyContact: "+91 99887 11111 (Friend)",
    bloodGroup: "O-",
    password: "Password@123",
    isFirstLogin: false,
    leaveBalances: {
      paid: 8,
      sick: 5,
      casual: 4,
      unpaid: 0
    },
    salary: {
      basic: 80000,
      hra: 32000,
      specialAllowance: 20000,
      providentFund: 9600,
      professionalTax: 2500,
      incomeTax: 9200
    }
  }
];

export const initialAttendance = [
  // Today's records
  {
    id: "ATT-101",
    employeeId: "EMP-001",
    employeeName: "Sarah Jenkins",
    loginId: "OISAJE20210001",
    date: new Date().toISOString().split("T")[0],
    checkIn: "08:55 AM",
    checkOut: null,
    status: "Present",
    hoursWorked: 0,
    device: "Office Terminal #1"
  },
  {
    id: "ATT-102",
    employeeId: "EMP-002",
    employeeName: "John Doe",
    loginId: "OIJODO20220001",
    date: new Date().toISOString().split("T")[0],
    checkIn: "09:12 AM",
    checkOut: null,
    status: "Present",
    hoursWorked: 0,
    device: "Web App (Remote)"
  },
  {
    id: "ATT-103",
    employeeId: "EMP-003",
    employeeName: "Priya Sharma",
    loginId: "OIPRSH20230002",
    date: new Date().toISOString().split("T")[0],
    checkIn: "09:05 AM",
    checkOut: null,
    status: "Present",
    hoursWorked: 0,
    device: "Office Terminal #2"
  },
  {
    id: "ATT-104",
    employeeId: "EMP-004",
    employeeName: "Alex Rivera",
    loginId: "OIALRI20230003",
    date: new Date().toISOString().split("T")[0],
    checkIn: "09:30 AM",
    checkOut: null,
    status: "Half-day",
    hoursWorked: 0,
    device: "Web App"
  },
  {
    id: "ATT-105",
    employeeId: "EMP-005",
    employeeName: "Michael Scott",
    loginId: "OIMISC20240004",
    date: new Date().toISOString().split("T")[0],
    checkIn: null,
    checkOut: null,
    status: "Leave",
    hoursWorked: 0,
    device: "-"
  }
];

export const initialLeaveRequests = [
  {
    id: "LR-001",
    employeeId: "EMP-005",
    employeeName: "Michael Scott",
    loginId: "OIMISC20240004",
    department: "Sales & Marketing",
    leaveType: "Paid",
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date(Date.now() + 86400000).toISOString().split("T")[0],
    days: 2,
    reason: "Attending annual regional sales leadership symposium",
    status: "Approved",
    appliedOn: "2026-08-18",
    reviewerComments: "Approved. Have a productive summit!"
  },
  {
    id: "LR-002",
    employeeId: "EMP-002",
    employeeName: "John Doe",
    loginId: "OIJODO20220001",
    department: "Engineering",
    leaveType: "Paid",
    startDate: new Date(Date.now() + 86400000 * 3).toISOString().split("T")[0],
    endDate: new Date(Date.now() + 86400000 * 5).toISOString().split("T")[0],
    days: 3,
    reason: "Family travel and long weekend trip",
    status: "Pending",
    appliedOn: "2026-08-20",
    reviewerComments: null
  },
  {
    id: "LR-003",
    employeeId: "EMP-003",
    employeeName: "Priya Sharma",
    loginId: "OIPRSH20230002",
    department: "Design",
    leaveType: "Sick",
    startDate: "2026-08-12",
    endDate: "2026-08-13",
    days: 2,
    reason: "Viral flu and recovery",
    status: "Approved",
    appliedOn: "2026-08-11",
    reviewerComments: "Get well soon Priya."
  },
  {
    id: "LR-004",
    employeeId: "EMP-004",
    employeeName: "Alex Rivera",
    loginId: "OIALRI20230003",
    department: "Engineering",
    leaveType: "Unpaid",
    startDate: new Date(Date.now() + 86400000 * 10).toISOString().split("T")[0],
    endDate: new Date(Date.now() + 86400000 * 12).toISOString().split("T")[0],
    days: 3,
    reason: "Personal home relocation work",
    status: "Pending",
    appliedOn: "2026-08-21",
    reviewerComments: null
  }
];

export const initialAnnouncements = [
  {
    id: "ANN-1",
    title: "Odoo Dayflow 2.0 Live Rollout",
    content: "Welcome to our upgraded Dayflow HRMS portal. Explore real-time punch timesheets, self-service leave requests, and live payslip access.",
    date: "2026-08-20",
    tag: "Company Update",
    author: "Sarah Jenkins (HR Director)"
  },
  {
    id: "ANN-2",
    title: "Upcoming Holiday: Janmashtami Festival",
    content: "Please note our offices will be closed on Friday, August 28th for the festive holiday. Enjoy the long weekend!",
    date: "2026-08-19",
    tag: "Holiday Notice",
    author: "HR Operations"
  }
];

export const departmentList = [
  "Engineering",
  "Design",
  "Human Resources",
  "Sales & Marketing",
  "Finance & Operations",
  "Product Management"
];
