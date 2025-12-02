// src/Employee/Dashboard.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import EmployeeNavbar from "./Navbar";
import "./style.css";

export default function EmployeeDashboard() {
  // Dummy employee data (replace with real API)
  const [employee] = useState({
    id: "E-1004",
    name: "Siddharth Rao",
    role: "DevOps Engineer",
    dept: "DevOps",
    email: "sid@vitec.co.in",
    phone: "+91 98765 43210",
    joined: "2022-06-15",
    avatarColor: "#4fa7ff"
  });

  const [attendanceToday, setAttendanceToday] = useState({
    status: "Present", // Present / Absent / On Leave / Remote
    in: "08:58",
    out: "—",
    workHours: 3.5
  });

  const [leaveBalance] = useState({
    paid: 12,
    sick: 5,
    casual: 4
  });

  const [recentLeaves, setRecentLeaves] = useState([
    { id: 1, type: "Sick", from: "2025-10-20", to: "2025-10-21", status: "Approved" },
  ]);

  const [notifications, setNotifications] = useState([
    { id: 1, text: "Attendance correction approved (2025-10-12)", time: "2d" },
    { id: 2, text: "Leave request processed (2025-10-20)", time: "8d" },
  ]);

  const [upcomingShifts] = useState([
    { id: 1, label: "Mon - Fri (9:00 - 18:00)", start: "2025-12-01" },
    { id: 2, label: "On-call (weekend)", start: "2025-12-06" }
  ]);

  // Dummy actions
  const handlePunchIn = () => {
    setAttendanceToday(prev => ({ ...prev, status: "Present", in: "09:02" }));
    setNotifications(n => [{ id: Date.now(), text: "You punched in at 09:02", time: "now" }, ...n]);
  };

  const handlePunchOut = () => {
    setAttendanceToday(prev => ({ ...prev, out: "18:05", workHours: 8.1 }));
    setNotifications(n => [{ id: Date.now(), text: "You punched out at 18:05", time: "now" }, ...n]);
  };

  const handleRequestLeave = () => {
    // Navigate to leaves page for proper leave request
    window.location.href = "/employee/leaves";
  };

  return (
    <div className="emp-wrap">
      <EmployeeNavbar employee={employee} />

      <main className="emp-main">
        <header className="emp-header">
          <div>
            <h1>Hello, {employee.name.split(" ")[0]} 👋</h1>
            <p className="muted">Here’s a quick summary of your day and recent activity.</p>
          </div>

          <div className="header-actions">
            <button className="btn" onClick={handleRequestLeave}>Request Leave</button>
            <Link to="/employee/settings" className="btn-ghost">Edit Profile</Link>
          </div>
        </header>

        <section className="grid-3">
          {/* Attendance card */}
          <div className="card">
            <div className="card-head">
              <h3>Today's Attendance</h3>
              <div className={`status-pill ${attendanceToday.status.replace(/\s+/g,'-').toLowerCase()}`}>
                {attendanceToday.status}
              </div>
            </div>

            <div className="attendance-body">
              <div className="times">
                <div><div className="label">In</div><div className="value">{attendanceToday.in}</div></div>
                <div><div className="label">Out</div><div className="value">{attendanceToday.out}</div></div>
                <div><div className="label">Hours</div><div className="value">{attendanceToday.workHours}h</div></div>
              </div>

              <div className="attendance-actions">
                <button className="btn" onClick={handlePunchIn}>Punch In</button>
                <button className="btn btn-ghost" onClick={handlePunchOut}>Punch Out</button>
              </div>
            </div>
          </div>

          {/* Leaves card */}
          <div className="card">
            <div className="card-head">
              <h3>Leave Balance</h3>
              <div className="muted">Available balances</div>
            </div>

            <div className="leave-grid">
              <div className="leave-item">
                <div className="leave-num">{leaveBalance.paid}</div>
                <div className="leave-label">Paid</div>
              </div>
              <div className="leave-item">
                <div className="leave-num">{leaveBalance.sick}</div>
                <div className="leave-label">Sick</div>
              </div>
              <div className="leave-item">
                <div className="leave-num">{leaveBalance.casual}</div>
                <div className="leave-label">Casual</div>
              </div>
            </div>

            <div style={{ marginTop: 12 }}>
              <button className="btn" onClick={handleRequestLeave}>Request Leave</button>
            </div>
          </div>

          {/* Shifts card */}
          <div className="card">
            <div className="card-head">
              <h3>Upcoming Shifts</h3>
              <div className="muted">Next scheduled shifts</div>
            </div>

            <ul className="shift-list">
              {upcomingShifts.map(s => (
                <li key={s.id}>
                  <div>
                    <div className="shift-label">{s.label}</div>
                    <div className="muted small">Starts {s.start}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="grid-2">
          {/* Recent Leaves / Requests */}
          <div className="card">
            <div className="card-head">
              <h3>Recent Leave Requests</h3>
              <div className="muted">Status and history</div>
            </div>

            <div className="requests-col">
              {recentLeaves.map(r => (
                <div className="request-row" key={r.id}>
                  <div>
                    <div><strong>{r.type}</strong> — {r.from} to {r.to}</div>
                    <div className="muted small">{r.status}</div>
                  </div>
                  <div>
                    {r.status === "Pending" && <button className="btn-small" onClick={() => {
                      setRecentLeaves(prev => prev.map(x => x.id === r.id ? { ...x, status: "Cancelled" } : x));
                    }}>Cancel</button>}
                  </div>
                </div>
              ))}
              {recentLeaves.length === 0 && <div className="muted">No recent leaves</div>}
            </div>
          </div>

          {/* Notifications */}
          <div className="card">
            <div className="card-head">
              <h3>Notifications</h3>
              <div className="muted">Latest updates</div>
            </div>

            <ul className="notif-list">
              {notifications.map(n => (
                <li key={n.id}>
                  <div>{n.text}</div>
                  <div className="muted small">{n.time}</div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <footer className="emp-footer">
          <div>© {new Date().getFullYear()} Vivekananda Technologies</div>
        </footer>
      </main>
    </div>
  );
}
