// src/Admin/LeaveApplications.jsx
import React, { useState } from "react";
import AdminNavbar from "./Navbar";
import "./style.css";

export default function AdminLeaveApplications() {
  const [leaves, setLeaves] = useState([
    { id: 1, empId: "E-1003", name: "Neha Joshi", type: "Paid", from: "2025-11-28", to: "2025-12-02", days: 5, status: "Pending" },
    { id: 2, empId: "E-1001", name: "Asha Patil", type: "Sick", from: "2025-12-05", to: "2025-12-05", days: 1, status: "Pending" },
  ]);

  const handleDecision = (id, decision) => {
    setLeaves(prev => prev.map(l => l.id === id ? { ...l, status: decision } : l));
  };

  return (
    <div className="admin-wrapper">
      <AdminNavbar />
      <main className="admin-main">
        <header className="admin-header">
          <h1>Leave Applications</h1>
          <p className="admin-sub">Review and approve leave requests</p>
        </header>
        <section className="action-grid">
          {leaves.map(l => (
            <div key={l.id} className="action-card">
              <h3>{l.name} ({l.empId})</h3>
              <p>Type: {l.type} | Days: {l.days}</p>
              <p className="muted">From {l.from} to {l.to}</p>
              <p className="muted">Status: {l.status}</p>
              {l.status === "Pending" && (
                <div style={{ marginTop: "12px", display: "flex", gap: "8px" }}>
                  <button className="btn-small accept" onClick={() => handleDecision(l.id, "Approved")}>Approve</button>
                  <button className="btn-small reject" onClick={() => handleDecision(l.id, "Rejected")}>Reject</button>
                </div>
              )}
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}


