// src/Employee/Attendance.jsx
import React, { useState } from "react";
import EmployeeNavbar from "./Navbar";
import "./style.css";

export default function EmployeeAttendance() {
  const [employee] = useState({
    id: "E-1004",
    name: "Siddharth Rao",
    role: "DevOps Engineer",
    dept: "DevOps",
    avatarColor: "#4fa7ff"
  });

  const [attendanceRecords] = useState([
    { date: "2025-11-30", status: "Present", in: "08:58", out: "18:10", hours: 8.2 },
    { date: "2025-11-29", status: "Present", in: "09:05", out: "18:00", hours: 8.0 },
    { date: "2025-11-28", status: "On Leave", in: "-", out: "-", hours: 0 },
  ]);

  return (
    <div className="emp-wrap">
      <EmployeeNavbar employee={employee} />
      <main className="emp-main">
        <header className="emp-header">
          <div>
            <h1>Attendance Records</h1>
            <p className="muted">View your attendance history and request corrections.</p>
          </div>
        </header>

        <section className="grid-2">
          <div className="card">
            <div className="card-head">
              <h3>Recent Attendance</h3>
            </div>
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Status</th>
                    <th>In</th>
                    <th>Out</th>
                    <th>Hours</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceRecords.map((record, idx) => (
                    <tr key={idx}>
                      <td>{record.date}</td>
                      <td>
                        <span className={`status-pill ${record.status.replace(/\s+/g,'-').toLowerCase()}`}>
                          {record.status}
                        </span>
                      </td>
                      <td>{record.in}</td>
                      <td>{record.out}</td>
                      <td>{record.hours}h</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card">
            <div className="card-head">
              <h3>Request Correction</h3>
            </div>
            <div style={{ padding: "12px" }}>
              <p className="muted">If you notice any discrepancy in your attendance, request a correction.</p>
              <button className="btn" style={{ marginTop: "12px" }} onClick={() => alert("Correction request form - to be implemented")}>
                Request Correction
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

