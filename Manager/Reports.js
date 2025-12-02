// src/Manager/Reports.jsx
import React from "react";
import ManagerNavbar from "./Navbar";
import "./style.css";

export default function ManagerReports() {
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

  const sampleData = [{ type: "Team Attendance", count: 4 }, { type: "Leave Requests", count: 2 }];

  return (
    <div className="manager-wrapper">
      <ManagerNavbar />
      <main className="manager-main">
        <header className="manager-header">
          <div>
            <h1>Reports</h1>
            <p className="manager-sub">Generate team reports</p>
          </div>
        </header>
        <section className="action-grid">
          <div className="action-card" onClick={() => downloadCSV(sampleData, "team-attendance.csv")} style={{cursor: "pointer"}}>
            <h3>Team Attendance</h3>
            <p className="muted">Export team attendance report</p>
          </div>
          <div className="action-card" onClick={() => downloadCSV(sampleData, "leave-requests.csv")} style={{cursor: "pointer"}}>
            <h3>Leave Requests</h3>
            <p className="muted">Export leave requests report</p>
          </div>
        </section>
      </main>
    </div>
  );
}


