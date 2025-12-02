// src/Manager/LeaveApplications.jsx
import React, { useState } from "react";
import ManagerNavbar from "./Navbar";
import "./style.css";

export default function ManagerLeaveApplications() {
  const [approvals, setApprovals] = useState([
    { id: 1, type: "Leave", by: "Neha Joshi", days: 2, from: "2025-12-05", to: "2025-12-06", status: "Pending" },
    { id: 2, type: "Overtime", by: "Ravi Kumar", hours: 4, date: "2025-12-03", status: "Pending" },
  ]);

  const handleApprove = (id) => {
    setApprovals(prev => prev.map(a => a.id === id ? { ...a, status: "Approved" } : a));
  };

  const handleReject = (id) => {
    setApprovals(prev => prev.map(a => a.id === id ? { ...a, status: "Rejected" } : a));
  };

  return (
    <div className="manager-wrapper">
      <ManagerNavbar />
      <main className="manager-main">
        <header className="manager-header">
          <div>
            <h1>Leave Approvals</h1>
            <p className="manager-sub">Review and approve team leave requests</p>
          </div>
        </header>
        <section className="two-column">
          <div className="panel">
            <h3 className="panel-title">Pending Approvals</h3>
            {approvals.filter(a => a.status === "Pending").length === 0 ? (
              <p className="muted">No pending approvals.</p>
            ) : (
              <ul className="approval-list">
                {approvals.filter(a => a.status === "Pending").map(a => (
                  <li key={a.id} className="approval-item">
                    <div>
                      <strong>{a.type}</strong> — {a.by}
                      <div className="muted small">
                        {a.days ? `${a.days} day(s) - ${a.from} to ${a.to}` : a.hours ? `${a.hours} hr(s) on ${a.date}` : ""}
                      </div>
                    </div>
                    <div className="approval-actions">
                      <button className="btn-small accept" onClick={() => handleApprove(a.id)}>Approve</button>
                      <button className="btn-small reject" onClick={() => handleReject(a.id)}>Reject</button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}


