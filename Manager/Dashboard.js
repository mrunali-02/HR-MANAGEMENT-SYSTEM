// src/Manager/Dashboard.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ManagerNavbar from "./Navbar";
import "./style.css";

export default function ManagerDashboard() {
  const navigate = useNavigate();
  // Dummy data
  const team = [
    { id: 1, name: "Asha Patil", role: "Developer", status: "Present" },
    { id: 2, name: "Ravi Kumar", role: "QA Engineer", status: "Remote" },
    { id: 3, name: "Neha Joshi", role: "Designer", status: "On Leave" },
    { id: 4, name: "Siddharth Rao", role: "DevOps", status: "Present" }
  ];

  const [approvals, setApprovals] = useState([
    { id: 1, type: "Leave", by: "Neha Joshi", days: 2, status: "Pending" },
    { id: 2, type: "Overtime", by: "Ravi Kumar", hours: 4, status: "Pending" }
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

      {/* Main content */}
      <main className="manager-main">
        <header className="manager-header">
          <div>
            <h1>Good morning, Manager 👋</h1>
            <p className="manager-sub">Quick view of your team's activity and pending actions.</p>
          </div>

          <div className="header-actions">
            <button className="action-btn" onClick={() => navigate("/manager/leaves")}>View Approvals</button>
            <button className="action-btn secondary" onClick={() => navigate("/manager/reports")}>Export report</button>
          </div>
        </header>

        {/* Top stats */}
        <section className="stats-grid">
          <div className="stat-card">
            <h3>Team Size</h3>
            <p className="stat-number">4</p>
          </div>

          <div className="stat-card">
            <h3>Pending Approvals</h3>
            <p className="stat-number">{approvals.length}</p>
          </div>

          <div className="stat-card">
            <h3>Present Today</h3>
            <p className="stat-number">2</p>
          </div>

          <div className="stat-card">
            <h3>Weekly Hours (est.)</h3>
            <p className="stat-number">192h</p>
          </div>
        </section>

        {/* Approvals + Team list */}
        <section className="two-column">
          <div className="panel">
            <h3 className="panel-title">Pending Approvals</h3>
            {approvals.length === 0 ? (
              <p className="muted">No pending approvals.</p>
            ) : (
              <ul className="approval-list">
                {approvals.filter(a => a.status === "Pending").map(a => (
                  <li key={a.id} className="approval-item">
                    <div>
                      <strong>{a.type}</strong> — {a.by}
                      <div className="muted small">
                        {a.days ? `${a.days} day(s)` : a.hours ? `${a.hours} hr(s)` : ""}
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

          <div className="panel">
            <h3 className="panel-title">Team</h3>
            <ul className="team-list">
              {team.map(member => (
                <li key={member.id} className="team-item">
                  <div>
                    <div className="team-name">{member.name}</div>
                    <div className="muted small">{member.role}</div>
                  </div>
                  <div>
                    <span className={`status ${member.status.replace(/\s+/g, "-").toLowerCase()}`}>{member.status}</span>
                  </div>
                </li>
              ))}
            </ul>
            <div style={{marginTop:12}}>
              <button className="btn-ghost" onClick={() => navigate("/manager/attendance")}>View Team Attendance</button>
            </div>
          </div>
        </section>

        {/* Quick actions */}
        <section className="action-grid">
          <div className="action-card" onClick={() => navigate("/manager/leaves")} style={{cursor: "pointer"}}>
            <h3>Leave Approvals</h3>
            <p className="muted">Review and approve pending leave requests.</p>
          </div>

          <div className="action-card" onClick={() => navigate("/manager/attendance")} style={{cursor: "pointer"}}>
            <h3>Team Attendance</h3>
            <p className="muted">View and manage team attendance records.</p>
          </div>

          <div className="action-card" onClick={() => navigate("/manager/reports")} style={{cursor: "pointer"}}>
            <h3>Generate Reports</h3>
            <p className="muted">Export timesheets and attendance reports.</p>
          </div>

          <div className="action-card" onClick={() => navigate("/manager/profile")} style={{cursor: "pointer"}}>
            <h3>Profile Settings</h3>
            <p className="muted">Manage your profile and preferences.</p>
          </div>
        </section>
      </main>
    </div>
  );
}
