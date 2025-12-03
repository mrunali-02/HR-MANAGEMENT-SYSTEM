// src/App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './Dashboard';
import Login from './Login';

// Admin routes
import AdminDashboard from './Admin/Dashboard';
import AdminEmployeeList from './Admin/EmployeeList';
import AdminLeaveApplications from './Admin/LeaveApplications';
import AdminReports from './Admin/Reports';
import AdminSettings from './Admin/Settings';

// HR routes
import HRDashboard from './HR/Dashboard';
import HRAttendance from './HR/Attendance';
import HREmployeeList from './HR/EmployeeList';
import HRLeaveApplications from './HR/LeaveApplications';
import HRProfile from './HR/Profile';
import HRRecruitment from './HR/Recruitment';
import HRReports from './HR/Reports';
import HRSettings from './HR/Settings';

// Manager routes
import ManagerDashboard from './Manager/Dashboard';
import ManagerAttendance from './Manager/Attendance';
import ManagerLeaveApplications from './Manager/LeaveApplications';
import ManagerProfile from './Manager/Profile';
import ManagerReports from './Manager/Reports';
import ManagerSettings from './Manager/Settings';

// Employee routes
import EmployeeDashboard from './Employee/Dashboard';
import EmployeeAttendance from './Employee/Attendance';
import EmployeeLeaves from './Employee/Leaves';
import EmployeeSettings from './Employee/Settings';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/login" element={<Login />} />
      
      {/* Admin Routes */}
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/employees" element={<AdminEmployeeList />} />
      <Route path="/admin/leaves" element={<AdminLeaveApplications />} />
      <Route path="/admin/reports" element={<AdminReports />} />
      <Route path="/admin/settings" element={<AdminSettings />} />
      <Route path="/ad_dash" element={<Navigate to="/admin" replace />} />
      
      {/* HR Routes */}
      <Route path="/hr" element={<HRDashboard />} />
      <Route path="/hr/attendance" element={<HRAttendance />} />
      <Route path="/hr/employees" element={<HREmployeeList />} />
      <Route path="/hr/leaves" element={<HRLeaveApplications />} />
      <Route path="/hr/profile" element={<HRProfile />} />
      <Route path="/hr/recruitment" element={<HRRecruitment />} />
      <Route path="/hr/reports" element={<HRReports />} />
      <Route path="/hr/settings" element={<HRSettings />} />
      <Route path="/hr_dash" element={<Navigate to="/hr" replace />} />
      
      {/* Manager Routes */}
      <Route path="/manager" element={<ManagerDashboard />} />
      <Route path="/manager/attendance" element={<ManagerAttendance />} />
      <Route path="/manager/leaves" element={<ManagerLeaveApplications />} />
      <Route path="/manager/profile" element={<ManagerProfile />} />
      <Route path="/manager/reports" element={<ManagerReports />} />
      <Route path="/manager/settings" element={<ManagerSettings />} />
      <Route path="/man_dash" element={<Navigate to="/manager" replace />} />
      
      {/* Employee Routes */}
      <Route path="/employee" element={<EmployeeDashboard />} />
      <Route path="/employee/attendance" element={<EmployeeAttendance />} />
      <Route path="/employee/leaves" element={<EmployeeLeaves />} />
      <Route path="/employee/settings" element={<EmployeeSettings />} />
      <Route path="/employee/profile" element={<EmployeeSettings />} />
      <Route path="/emp_dash" element={<Navigate to="/employee" replace />} />
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
