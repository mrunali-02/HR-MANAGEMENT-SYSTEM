// src/HR/LeaveApplications.jsx
import React, { useState } from "react";
import HRNavbar from "./Navbar";
import "./style.css";

export default function HRLeaveApplications() {
  const [leaves, setLeaves] = useState([
    { id: 1, empId: "E-1003", name: "Neha Joshi", type: "Paid", from: "2025-11-28", to: "2025-12-02", days: 5, status: "Pending", balance: 12 },
    { id: 2, empId: "E-1001", name: "Asha Patil", type: "Sick", from: "2025-12-05", to: "2025-12-05", days: 1, status: "Pending", balance: 8 },
  ]);

  const handleLeaveDecision = (id, decision) => {
    setLeaves(prev => prev.map(l => l.id === id ? { ...l, status: decision === "approve" ? "Approved" : "Rejected" } : l));
  };

  const downloadCSV = (data, filename) => {
    if (!data || !data.length) return;
    const keys = Object.keys(data[0]);
    const csv = [keys.join(",")].concat(data.map(r => keys.map(k => `"${(r[k] ?? "").toString().replace(/"/g, '""')}"`).join(","))).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="hr-admin">
      <HRNavbar />
      <main className="hr-main">
        <header className="hr-header">
          <div>
            <h1>Leave Applications</h1>
            <p className="sub">Review and manage employee leave requests</p>
          </div>
          <div className="header-actions">
            <button className="btn" onClick={() => downloadCSV(leaves, "leaves.csv")}>Export CSV</button>
          </div>
        </header>

        <section className="content">
          <div className="panel">
            <div className="panel-head">
              <h2>Leave Requests</h2>
              <div className="filters">
                <select onChange={(e) => {
                  const status = e.target.value;
                  // Filter logic can be added here
                }} defaultValue="">
                  <option value="">All</option><option>Pending</option><option>Approved</option><option>Rejected</option>
                </select>
              </div>
            </div>

            <div className="requests">
              {leaves.map(l => (
                <div key={l.id} className="request">
                  <div>
                    <div><strong>{l.name}</strong> ({l.empId})</div>
                    <div className="muted">From {l.from} to {l.to} — {l.days} day(s) — Balance: {l.balance}</div>
                    <div className="muted">Type: {l.type} | Status: {l.status}</div>
                  </div>
                  <div className="request-actions">
                    {l.status === "Pending" && (
                      <>
                        <button className="btn-small" onClick={() => handleLeaveDecision(l.id, "approve")}>Approve</button>
                        <button className="btn-small reject" onClick={() => handleLeaveDecision(l.id, "reject")}>Reject</button>
                      </>
                    )}
                  </div>
                </div>
              ))}
              {leaves.length === 0 && <div className="muted">No leave requests.</div>}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}


