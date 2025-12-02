// src/Manager/Attendance.jsx
import React, { useState } from "react";
import ManagerNavbar from "./Navbar";
import "./style.css";

export default function ManagerAttendance() {
  const [team] = useState([
    { id: "E-1001", name: "Asha Patil", date: "2025-11-30", status: "Present", in: "09:05", out: "18:02" },
    { id: "E-1002", name: "Ravi Kumar", date: "2025-11-30", status: "Present", in: "09:00", out: "17:45" },
    { id: "E-1003", name: "Neha Joshi", date: "2025-11-30", status: "On Leave", in: "-", out: "-" },
    { id: "E-1004", name: "Siddharth Rao", date: "2025-11-30", status: "Present", in: "08:58", out: "18:10" },
  ]);

  return (
    <div className="manager-wrapper">
      <ManagerNavbar />
      <main className="manager-main">
        <header className="manager-header">
          <div>
            <h1>Team Attendance</h1>
            <p className="manager-sub">View and manage your team's attendance</p>
          </div>
        </header>
        <section className="two-column">
          <div className="panel">
            <h3 className="panel-title">Today's Attendance</h3>
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr><th>Name</th><th>Status</th><th>In</th><th>Out</th></tr>
                </thead>
                <tbody>
                  {team.map(m => (
                    <tr key={m.id}>
                      <td>{m.name}</td>
                      <td><span className={`status ${m.status.replace(/\s+/g, "-").toLowerCase()}`}>{m.status}</span></td>
                      <td>{m.in}</td>
                      <td>{m.out}</td>
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


