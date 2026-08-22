// Initial seed data for Dayflow HRMS
export const initialCompany = {
  name: "Case Point HRMS",
  code: "OI",
  tagline: "Every workday, perfectly aligned.",
  logo: "https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=150&auto=format&fit=crop&q=80",
  address: "Case Point House, Infocity, Gandhinagar, Gujarat, India",
  contactEmail: "contact@casepoint.com",
  phone: "+91 79 4050 0000"
};

export const initialEmployees = [
  // 1. CEO / Executive Administrator (Oversees company; data not shown in staff attendance)
  {
    id: "EMP-000",
    loginId: "OIALVA20200001",
    firstName: "Alexander",
    lastName: "Vance",
    fullName: "Alexander Vance",
    email: "alexander.vance@casepoint.com",
    role: "admin", // Executive CEO Admin
    phone: "+91 99999 11111",
    joiningDate: "2020-01-01",
    department: "Executive Management",
    designation: "Chief Executive Officer (CEO)",
    status: "Active",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&auto=format&fit=crop&q=80",
    address: "Penthouse 10, SkyCity Towers, Ahmedabad, Gujarat",
    emergencyContact: "+91 99999 00000 (Executive Office)",
    bloodGroup: "O+",
    password: "Password@123",
    isFirstLogin: false,
    leaveBalances: {
      paid: 30,
      sick: 15,
      casual: 10,
      unpaid: 0
    },
    salary: {
      basic: 300000,
      hra: 120000,
      specialAllowance: 60000,
      providentFund: 36000,
      professionalTax: 2500,
      incomeTax: 45000
    }
  },

  // 2. HR Manager (HR is an Employee — data appears in employee rosters & attendance)
  {
    id: "EMP-001",
    loginId: "OISAJE20210001",
    firstName: "Sarah",
    lastName: "Jenkins",
    fullName: "Sarah Jenkins",
    email: "sarah.jenkins@casepoint.com",
    role: "employee", // HR Employee
    phone: "+91 98765 43210",
    joiningDate: "2021-03-15",
    department: "Human Resources",
    designation: "HR Manager & Talent Lead",
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

  // 3. Senior Engineer
  {
    id: "EMP-002",
    loginId: "OIJODO20220001",
    firstName: "John",
    lastName: "Doe",
    fullName: "John Doe",
    email: "john.doe@casepoint.com",
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

  // 4. Product Designer
  {
    id: "EMP-003",
    loginId: "OIPRSH20230002",
    firstName: "Priya",
    lastName: "Sharma",
    fullName: "Priya Sharma",
    email: "priya.sharma@casepoint.com",
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

  // 5. DevOps Specialist
  {
    id: "EMP-004",
    loginId: "OIALRI20230003",
    firstName: "Alex",
    lastName: "Rivera",
    fullName: "Alex Rivera",
    email: "alex.rivera@casepoint.com",
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

  // 6. Marketing Lead
  {
    id: "EMP-005",
    loginId: "OIMISC20240004",
    firstName: "Michael",
    lastName: "Scott",
    fullName: "Michael Scott",
    email: "michael.scott@casepoint.com",
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
  // Today's records for all staff employees (including HR)
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
    device: "HR Portal Terminal"
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
    id: "LR-501",
    employeeId: "EMP-001",
    employeeName: "Sarah Jenkins",
    loginId: "OISAJE20210001",
    department: "Human Resources",
    leaveType: "Paid",
    startDate: "2026-09-01",
    endDate: "2026-09-03",
    days: 3,
    reason: "Attending National HR Tech Summit & Keynote",
    status: "Pending",
    appliedOn: "2026-08-20",
    reviewerComments: null
  },
  {
    id: "LR-502",
    employeeId: "EMP-002",
    employeeName: "John Doe",
    loginId: "OIJODO20220001",
    department: "Engineering",
    leaveType: "Sick",
    startDate: "2026-08-24",
    endDate: "2026-08-25",
    days: 2,
    reason: "Viral fever and physician recommended rest",
    status: "Pending",
    appliedOn: "2026-08-21",
    reviewerComments: null
  },
  {
    id: "LR-503",
    employeeId: "EMP-003",
    employeeName: "Priya Sharma",
    loginId: "OIPRSH20230002",
    department: "Design",
    leaveType: "Casual",
    startDate: "2026-08-15",
    endDate: "2026-08-16",
    days: 2,
    reason: "Family function in native town",
    status: "Approved",
    appliedOn: "2026-08-10",
    reviewerComments: "Approved by CEO. Have a great time!"
  }
];

export const initialAnnouncements = [];

export const departmentList = [
  "Executive Management",
  "Human Resources",
  "Engineering",
  "Design",
  "Sales & Marketing",
  "Finance & Operations"
];
