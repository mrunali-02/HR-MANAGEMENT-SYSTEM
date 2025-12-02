// src/Admin/EmployeeList.jsx
import React, { useState } from "react";
import AdminNavbar from "./Navbar";
import "./style.css";

export default function AdminEmployeeList() {
  const [employees] = useState([
    { id: "E-1001", name: "Asha Patil", dept: "Engineering", email: "asha@vitec.co.in", status: "Active" },
    { id: "E-1002", name: "Ravi Kumar", dept: "QA", email: "ravi@vitec.co.in", status: "Active" },
    { id: "E-1003", name: "Neha Joshi", dept: "Design", email: "neha@vitec.co.in", status: "On Leave" },
    { id: "E-1004", name: "Siddharth Rao", dept: "DevOps", email: "sid@vitec.co.in", status: "Active" },
  ]);

  return (
    <div className="admin-wrapper">
      <AdminNavbar />
      <main className="admin-main">
        <header className="admin-header">
          <h1>Employee Management</h1>
          <p className="admin-sub">Manage all employees in the system</p>
        </header>
        <section className="action-grid">
          {employees.map(emp => (
            <div key={emp.id} className="action-card">
              <h3>{emp.name}</h3>
              <p>{emp.dept} • {emp.id}</p>
              <p className="muted">Status: {emp.status}</p>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}


