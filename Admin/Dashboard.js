// src/Admin/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "./Navbar";
import "./style.css";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000";

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalEmployees: 0,
    pendingLeaves: 0,
    todayPresent: 0,
    overtimePending: 0,
  });

  useEffect(() => {
    const ac = new AbortController();
    const token = localStorage.getItem("token");

    async function loadStats() {
      try {
        setLoading(true);
        setError(null);

        // --- Employees count (public API, no auth required) ---
        const empRes = await fetch(`${API_BASE}/api/employees?limit=1`, {
          signal: ac.signal,
        });
        let totalEmployees = 0;
        if (empRes.ok) {
          const empJson = await empRes.json();
          if (empJson && empJson.success && empJson.meta && empJson.meta.total != null) {
            totalEmployees = Number(empJson.meta.total) || 0;
          } else if (Array.isArray(empJson)) {
            totalEmployees = empJson.length;
          }
        }

        const commonOptions = {
          signal: ac.signal,
          headers: token
            ? {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              }
            : { "Content-Type": "application/json" },
        };

        // --- Leave requests (requires authenticated Admin / HR / Manager) ---
        let pendingLeaves = 0;
        try {
          const leaveRes = await fetch(`${API_BASE}/api/leaves`, commonOptions);
          if (leaveRes.ok) {
            const leaves = await leaveRes.json();
            const list = Array.isArray(leaves) ? leaves : [];
            pendingLeaves = list.filter((l) => (l.status || "").toLowerCase() === "pending").length;
          }
        } catch {
          // ignore, keep default 0 and show generic error below if nothing works
        }

        // --- Attendance summary (Admin / HR / Manager) ---
        let todayPresent = 0;
        try {
          const attRes = await fetch(`${API_BASE}/api/attendance`, commonOptions);
          if (attRes.ok) {
            const logs = await attRes.json();
            const list = Array.isArray(logs) ? logs : [];
            const today = new Date().toISOString().slice(0, 10);
            todayPresent = list.filter(
              (a) => a.date === today && (a.status || "").toLowerCase() === "present"
            ).length;
          }
        } catch {
          // ignore, keep default 0
        }

        // --- Overtime pending (if your API exposes it in leaves or another endpoint) ---
        // For now, we derive it from leave requests that have type 'Overtime' if present.
        let overtimePending = 0;
        try {
          const leaveRes = await fetch(`${API_BASE}/api/leaves`, commonOptions);
          if (leaveRes.ok) {
            const leaves = await leaveRes.json();
            const list = Array.isArray(leaves) ? leaves : [];
            overtimePending = list.filter((l) => {
              const type = (l.leaveType || l.type || "").toLowerCase();
              const status = (l.status || "").toLowerCase();
              return (type.includes("overtime") || type === "ot") && status === "pending";
            }).length;
          }
        } catch {
          // ignore, keep default 0
        }

        setStats({
          totalEmployees,
          pendingLeaves,
          todayPresent,
          overtimePending,
        });
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message || "Failed to load dashboard data");
        }
      } finally {
        setLoading(false);
      }
    }

    loadStats();

    return () => ac.abort();
  }, [API_BASE]);

  return (
    <div className="admin-wrapper">
      <AdminNavbar />

      {/* --- MAIN CONTENT --- */}
      <main className="admin-main">

        <header className="admin-header">
          <h1>Welcome, Admin 👋</h1>
          <p className="admin-sub">
            Live overview of employees, leaves, and attendance pulled from the database.
          </p>
        </header>

        {loading && <div className="notice">Loading dashboard data…</div>}
        {error && <div className="error">Error: {error}</div>}

        {/* --- STATS CARDS --- */}
        <section className="stats-grid">
          <div className="stat-card">
            <h3>Total Employees</h3>
            <p className="stat-number">
              {stats.totalEmployees ?? "—"}
            </p>
          </div>

          <div className="stat-card">
            <h3>Pending Leave Requests</h3>
            <p className="stat-number">
              {stats.pendingLeaves ?? "—"}
            </p>
            <p className="muted">Awaiting approval</p>
          </div>

          <div className="stat-card">
            <h3>Today's Attendance</h3>
            <p className="stat-number">
              {stats.todayPresent ?? "—"} Present
            </p>
            <p className="muted">Based on today's logs</p>
          </div>

          <div className="stat-card">
            <h3>Overtime Requests</h3>
            <p className="stat-number">
              {stats.overtimePending ?? "—"}
            </p>
            <p className="muted">Pending overtime approvals</p>
          </div>
        </section>

        {/* --- GRID OF ACTIONS --- */}
        <section className="action-grid">
          <div className="action-card" onClick={() => navigate("/admin/employees")} style={{cursor: "pointer"}}>
            <h3>Manage Employees</h3>
            <p>Add, update, or remove employee data.</p>
          </div>

          <div className="action-card" onClick={() => navigate("/admin/leaves")} style={{cursor: "pointer"}}>
            <h3>Leave Approvals</h3>
            <p>Review and approve pending leave requests.</p>
          </div>

          <div className="action-card" onClick={() => navigate("/admin/reports")} style={{cursor: "pointer"}}>
            <h3>Generate Reports</h3>
            <p>Export CSV/PDF files for HR insights.</p>
          </div>

          <div className="action-card" onClick={() => navigate("/admin/settings")} style={{cursor: "pointer"}}>
            <h3>Settings</h3>
            <p>Configure system settings and preferences.</p>
          </div>
        </section>

      </main>
    </div>
  );
}
