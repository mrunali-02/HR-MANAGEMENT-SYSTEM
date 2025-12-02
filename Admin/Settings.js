// src/Admin/Settings.jsx
import React from "react";
import AdminNavbar from "./Navbar";
import "./style.css";

export default function AdminSettings() {
  return (
    <div className="admin-wrapper">
      <AdminNavbar />
      <main className="admin-main">
        <header className="admin-header">
          <h1>Settings</h1>
          <p className="admin-sub">Configure system settings</p>
        </header>
        <section className="action-grid">
          <div className="action-card">
            <h3>System Configuration</h3>
            <p>Manage system-wide settings</p>
          </div>
          <div className="action-card">
            <h3>User Management</h3>
            <p>Manage user roles and permissions</p>
          </div>
          <div className="action-card">
            <h3>Email Settings</h3>
            <p>Configure email notifications</p>
          </div>
        </section>
      </main>
    </div>
  );
}


