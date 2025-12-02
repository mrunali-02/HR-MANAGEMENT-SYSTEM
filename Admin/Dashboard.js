// src/Admin/Dashboard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "./Navbar";
import "./style.css";

export default function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <div className="admin-wrapper">
      <AdminNavbar />

      {/* --- MAIN CONTENT --- */}
      <main className="admin-main">

        <header className="admin-header">
          <h1>Welcome, Admin 👋</h1>
          <p className="admin-sub">
            Here is a quick overview of your HR operations.
          </p>
        </header>

        {/* --- STATS CARDS --- */}
        <section className="stats-grid">
          <div className="stat-card">
            <h3>Total Employees</h3>
            <p className="stat-number">124</p>
          </div>

          <div className="stat-card">
            <h3>Pending Leave Requests</h3>
            <p className="stat-number">08</p>
          </div>

          <div className="stat-card">
            <h3>Today's Attendance</h3>
            <p className="stat-number">87 Present</p>
          </div>

          <div className="stat-card">
            <h3>Overtime Requests</h3>
            <p className="stat-number">03</p>
          </div>
        </section>

        {/* --- GRID OF ACTIONS --- */}
        <section className="action-grid">
          <div className="action-card" onClick={() => navigate("/admin/employees")} style={{cursor: "pointer"}}>
            <h3>Manage Employees</h3>
            <p>Add, update, or remove employee data.</p>
          </div>

          <div className="action-card" onClick={() => navigate("/admin/leaves")} style={{cursor: "pointer"}}>
            <h3>Leave Approvals</h3>
            <p>Review and approve pending leave requests.</p>
          </div>

          <div className="action-card" onClick={() => navigate("/admin/reports")} style={{cursor: "pointer"}}>
            <h3>Generate Reports</h3>
            <p>Export CSV/PDF files for HR insights.</p>
          </div>

          <div className="action-card" onClick={() => navigate("/admin/settings")} style={{cursor: "pointer"}}>
            <h3>Settings</h3>
            <p>Configure system settings and preferences.</p>
          </div>
        </section>

      </main>
    </div>
  );
}
