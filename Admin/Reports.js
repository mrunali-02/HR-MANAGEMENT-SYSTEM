// src/Admin/Reports.jsx
import React from "react";
import AdminNavbar from "./Navbar";
import "./style.css";

export default function AdminReports() {
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

  const sampleData = [{ type: "Total Employees", count: 124 }, { type: "Pending Leaves", count: 8 }];

  return (
    <div className="admin-wrapper">
      <AdminNavbar />
      <main className="admin-main">
        <header className="admin-header">
          <h1>Reports</h1>
          <p className="admin-sub">Generate system reports</p>
        </header>
        <section className="action-grid">
          <div className="action-card" onClick={() => downloadCSV(sampleData, "employees-report.csv")} style={{cursor: "pointer"}}>
            <h3>Employee Report</h3>
            <p>Export employee data</p>
          </div>
          <div className="action-card" onClick={() => downloadCSV(sampleData, "leaves-report.csv")} style={{cursor: "pointer"}}>
            <h3>Leave Report</h3>
            <p>Export leave applications</p>
          </div>
          <div className="action-card" onClick={() => downloadCSV(sampleData, "attendance-report.csv")} style={{cursor: "pointer"}}>
            <h3>Attendance Report</h3>
            <p>Export attendance records</p>
          </div>
        </section>
      </main>
    </div>
  );
}


