# Dayflow - Human Resource Management System (HRMS)

> *Every workday, perfectly aligned.*

A modern, executive-grade frontend web application for **Dayflow HRMS** built with React, Vite, and Lucide Icons, following Odoo design principles and specifications.

---

## 🌟 Key Features

### 1. 🔑 Auto-Generated System Login ID Engine
- **Format**: `[Company Code][First 2 letters of First & Last Name][Year of Joining][4-Digit Serial Number]`
- **Example**: `OIJODO20220001` (Odoo India + John Doe + 2022 + Serial 0001)
- **Onboarding Workflow**:
  - Public registration creates Company and Admin workspace.
  - Regular employees are added inside the HR console by Admin/HR Officers, automatically computing their Login ID and initial secure temporary password.
  - Includes a shareable/copyable **Credentials Card**.
  - Prompts first-time employees to set their permanent password.

### 2. 🔐 Authentication & Onboarding
- **Sign In**: Login ID / Email, password visibility toggle, 1-click fast demo logins, specification rule drawer.
- **Sign Up**: Company workspace registration with live company code calculation, logo upload, and admin configuration.

### 3. 👑 Admin & HR Officer Console
- **Executive Dashboard**: Workforce KPIs, live punch stream, pending approvals, and department distribution.
- **Employee Directory**: Grid/Table views, search & filters, **Add Employee Wizard** (live Login ID preview), and full-field edit modal.
- **Attendance Records**: Daily roster, Weekly matrix, manual status overrides, and **Export CSV**.
- **Leave & Time-Off Approvals**: Review queue with Approve/Reject actions, HR remarks, and auto-quota deductions.
- **Payroll & Compensation**: Salary register, itemized breakdown (Basic, HRA, Allowances, PF, PT, TDS), and **Official Printable Payslips**.
- **Reports & Intelligence**: Attendance compliance trends, leave utilization analytics, and compliance downloads.

### 4. 💼 Employee Self-Service Portal
- **Dashboard**: **Interactive Check-In / Check-Out stopwatch punch widget** with live duration timer.
- **My Profile**: Multi-tab profile with self-service contact editing (job role & compensation locked as read-only).
- **My Attendance**: Personal punch timesheet history.
- **Leave Management**: Apply for leave with real-time balance calculations and HR comments tracking.
- **My Salary & Payslips**: Read-only compensation breakdown and downloadable payslip archives.

### 5. 🎨 Design System
- Odoo signature purple palette (`#714B67`, `#875A7B`), glassmorphic styling, Dark/Light mode toggle, and full `localStorage` persistence.

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Build for Production
```bash
npm run build
```
The compiled static assets will be located in the `dist/` directory.

---

## 🛠️ Tech Stack
- **Framework**: React 19 + Vite
- **Icons**: Lucide React
- **Styling**: Vanilla CSS Design Tokens, Glassmorphism, Dark/Light theme variables
- **Typography**: Google Fonts (*Outfit*, *Plus Jakarta Sans*, *JetBrains Mono*)
- **State & Storage**: React Context API with persistent `localStorage` synchronization
