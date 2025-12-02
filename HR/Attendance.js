// src/HR/Attendance.jsx
import React, { useState } from "react";
import HRNavbar from "./Navbar";
import "./style.css";

export default function HRAttendance() {
  const [attendance] = useState([
    { empId: "E-1001", name: "Asha Patil", date: "2025-11-30", status: "Present", in: "09:05", out: "18:02" },
    { empId: "E-1002", name: "Ravi Kumar", date: "2025-11-30", status: "Present", in: "09:00", out: "17:45" },
    { empId: "E-1003", name: "Neha Joshi", date: "2025-11-30", status: "On Leave", in: "-", out: "-" },
    { empId: "E-1004", name: "Siddharth Rao", date: "2025-11-30", status: "Present", in: "08:58", out: "18:10" },
  ]);

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
            <h1>Attendance Management</h1>
            <p className="sub">View and manage employee attendance records</p>
          </div>
          <div className="header-actions">
            <button className="btn" onClick={() => downloadCSV(attendance, "attendance.csv")}>Export CSV</button>
          </div>
        </header>

        <section className="content">
          <div className="panel">
            <div className="panel-head">
              <h2>Attendance Records</h2>
              <div className="filters">
                <input type="date" defaultValue="2025-11-30" />
                <select defaultValue="">
                  <option value="">All Departments</option>
                  <option>Engineering</option><option>QA</option><option>Design</option><option>DevOps</option>
                </select>
              </div>
            </div>

            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr><th>Emp ID</th><th>Name</th><th>Date</th><th>Status</th><th>In</th><th>Out</th></tr>
                </thead>
                <tbody>
                  {attendance.map((a, idx) => (
                    <tr key={idx}>
                      <td>{a.empId}</td>
                      <td>{a.name}</td>
                      <td>{a.date}</td>
                      <td><span className={`badge ${a.status.replace(/\s+/g,'-').toLowerCase()}`}>{a.status}</span></td>
                      <td>{a.in}</td>
                      <td>{a.out}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}


