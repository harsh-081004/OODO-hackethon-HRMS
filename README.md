# Case Point HRMS

Case Point HRMS is a comprehensive Human Resource Management System built to streamline employee management, attendance tracking, leave approvals, payroll, and company-wide announcements. 

This repository contains both the **Frontend** (React + Vite) and **Backend** (Node.js + Express + MongoDB) architectures.

## 🌐 Live Demo

- **Frontend Application (Vercel):** [https://oodo-hackethon-hrms.vercel.app/](https://oodo-hackethon-hrms.vercel.app/)
- **Backend API (Render):** Deployed and live.

### 🔑 Test Credentials
You can test the application using the following roles:

**Admin (Company HR) Account:**
- **Email:** `nishh032@gmail.com`
- **Password:** `nishh@0810`

**Employee Account:**
- **Email:** `harshsuthar608@gmail.com`
- **Password:** `9697f9f1a4c38f5d`

---

## 🚀 Key Features

- **Role-Based Access Control:** Distinct views and permissions for Admins and Employees.
- **Employee Directory:** Onboard new employees and manage profiles.
- **Attendance & Time Tracking:** Live punch-in/out stopwatch and historical logs.
- **Leave Management:** Employees can apply for time-off; Admins can approve or reject with comments.
- **Payroll System:** Salary structure management and downloadable PDF payslips.
- **Company Notice Board:** Broadcast announcements from HR to all employees instantly.
- **Dynamic Analytics Dashboard:** Visualized reporting for attendance compliance and HR metrics.

---

## 🛠 Tech Stack

### Frontend
- **Framework:** React.js powered by Vite
- **Routing:** React Router DOM
- **Styling:** Custom CSS (glassmorphism UI, modern CSS variables)
- **Icons:** Lucide React
- **Hosting:** Vercel

### Backend
- **Framework:** Node.js with Express.js
- **Database:** MongoDB (Mongoose ODM)
- **Authentication:** JSON Web Tokens (JWT) & bcryptjs
- **Validation:** Zod
- **File Storage:** Cloudinary (for profile pictures and company logos)
- **PDF Generation:** PDFKit (for payslips)
- **Hosting:** Render

---

## 💻 Local Development Setup

To run this project locally, you will need [Node.js](https://nodejs.org/) and a [MongoDB](https://www.mongodb.com/) instance (local or Atlas).

### 1. Clone the repository
```bash
git clone https://github.com/your-username/OODO-hackethon-HRMS.git
cd OODO-hackethon-HRMS
```

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` directory based on the `.env.example` file and populate it with your MongoDB URI, JWT secret, and Cloudinary credentials.
```bash
npm run dev
```
*The backend server will start on port 4000.*

### 3. Frontend Setup
Open a new terminal window:
```bash
cd frontend
npm install
```
Create a `.env` file in the `frontend` directory:
```env
VITE_API_URL=http://localhost:4000/api/v1
```
```bash
npm run dev
```
*The React application will start on port 5173.*

---

## 📝 License

This project is licensed under the MIT License.
