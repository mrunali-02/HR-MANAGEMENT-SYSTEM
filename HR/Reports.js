// src/HR/Reports.jsx
import React from "react";
import HRNavbar from "./Navbar";
import "./style.css";

export default function HRReports() {
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

  const sampleData = [{ type: "Attendance", count: 124 }, { type: "Leaves", count: 8 }];

  return (
    <div className="hr-admin">
      <HRNavbar />
      <main className="hr-main">
        <header className="hr-header">
          <div>
            <h1>Reports</h1>
            <p className="sub">Generate and export HR reports</p>
          </div>
        </header>
        <section className="content">
          <div className="panel">
            <h2>Generate Reports</h2>
            <div className="report-grid">
              <div className="report-card">
                <h4>Attendance Report</h4>
                <div className="report-actions">
                  <button className="btn" onClick={() => downloadCSV(sampleData, "attendance-report.csv")}>Export CSV</button>
                </div>
              </div>
              <div className="report-card">
                <h4>Leave Report</h4>
                <div className="report-actions">
                  <button className="btn" onClick={() => downloadCSV(sampleData, "leave-report.csv")}>Export CSV</button>
                </div>
              </div>
              <div className="report-card">
                <h4>Employee Report</h4>
                <div className="report-actions">
                  <button className="btn" onClick={() => downloadCSV(sampleData, "employee-report.csv")}>Export CSV</button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}


