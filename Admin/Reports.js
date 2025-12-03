// src/Admin/Reports.jsx
import React, { useEffect, useMemo, useState } from "react";
import AdminNavbar from "./Navbar";
import "./style.css";

export default function AdminReports() {
  const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000";

  const [employees, setEmployees] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const downloadCSV = (data, filename) => {
    if (!data || !data.length) return;
    const keys = Object.keys(data[0]);
    const csv = [keys.join(",")]
      .concat(
        data.map((r) =>
          keys
            .map((k) => `"${(r[k] ?? "").toString().replace(/"/g, '""')}"`)
            .join(",")
        )
      )
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    const ac = new AbortController();
    const token = localStorage.getItem("token");

    async function loadData() {
      try {
        setLoading(true);
        setError(null);

        // Employees (public API in this project)
        const empRes = await fetch(`${API_BASE}/api/employees?limit=500`, {
          signal: ac.signal,
        });

        if (empRes.ok) {
          const empJson = await empRes.json();
          if (empJson && empJson.success && Array.isArray(empJson.data)) {
            setEmployees(empJson.data);
          } else if (Array.isArray(empJson)) {
            setEmployees(empJson);
          } else {
            setEmployees([]);
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

        // Leaves (auth protected)
        try {
          const leaveRes = await fetch(`${API_BASE}/api/leaves`, commonOptions);
          if (leaveRes.ok) {
            const leaveJson = await leaveRes.json();
            setLeaves(Array.isArray(leaveJson) ? leaveJson : []);
          }
        } catch {
          setLeaves([]);
        }

        // Attendance summary (auth protected)
        try {
          const attRes = await fetch(`${API_BASE}/api/attendance`, commonOptions);
          if (attRes.ok) {
            const attJson = await attRes.json();
            setAttendance(Array.isArray(attJson) ? attJson : []);
          }
        } catch {
          setAttendance([]);
        }
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message || "Failed to load report data");
        }
      } finally {
        setLoading(false);
      }
    }

    loadData();

    return () => ac.abort();
  }, [API_BASE]);

  // --- Derived data for charts ---
  const deptCounts = useMemo(() => {
    const counts = {};
    employees.forEach((e) => {
      const dept = e.department || e.dept || "Unknown";
      counts[dept] = (counts[dept] || 0) + 1;
    });
    return counts;
  }, [employees]);

  const leaveStatusCounts = useMemo(() => {
    const counts = {};
    leaves.forEach((l) => {
      const status = (l.status || "Unknown").toUpperCase();
      counts[status] = (counts[status] || 0) + 1;
    });
    return counts;
  }, [leaves]);

  const attendanceStatusCounts = useMemo(() => {
    const counts = {};
    attendance.forEach((a) => {
      const status = (a.status || "Unknown").toUpperCase();
      counts[status] = (counts[status] || 0) + 1;
    });
    return counts;
  }, [attendance]);

  return (
    <div className="admin-wrapper">
      <AdminNavbar />
      <main className="admin-main">
        <header className="admin-header">
          <h1>Reports</h1>
          <p className="admin-sub">
            Generate CSV reports from live employee, leave, and attendance data.
          </p>
        </header>

        {loading && <div className="notice">Loading report data…</div>}
        {error && <div className="error">Error: {error}</div>}

        {/* --- CHARTS / SUMMARY --- */}
        <section className="charts-grid">
          <div className="chart-card">
            <h3>Employees by Department</h3>
            {!Object.keys(deptCounts).length && (
              <p className="muted">No employee data available.</p>
            )}
            {!!Object.keys(deptCounts).length && (
              <div className="bar-chart">
                {Object.entries(deptCounts).map(([dept, count]) => (
                  <div key={dept} className="bar-row">
                    <span className="bar-label">{dept}</span>
                    <div className="bar-track">
                      <div
                        className="bar-fill bar-fill-blue"
                        style={{ width: `${(count / Math.max(...Object.values(deptCounts))) * 100 || 0}%` }}
                      />
                    </div>
                    <span className="bar-value">{count}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="chart-card">
            <h3>Leave Requests by Status</h3>
            {!Object.keys(leaveStatusCounts).length && (
              <p className="muted">No leave data available.</p>
            )}
            {!!Object.keys(leaveStatusCounts).length && (
              <div className="bar-chart">
                {Object.entries(leaveStatusCounts).map(([status, count]) => (
                  <div key={status} className="bar-row">
                    <span className="bar-label">{status}</span>
                    <div className="bar-track">
                      <div
                        className={`bar-fill ${
                          status === "PENDING"
                            ? "bar-fill-amber"
                            : status === "APPROVED"
                            ? "bar-fill-green"
                            : "bar-fill-red"
                        }`}
                        style={{ width: `${(count / Math.max(...Object.values(leaveStatusCounts))) * 100 || 0}%` }}
                      />
                    </div>
                    <span className="bar-value">{count}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="chart-card">
            <h3>Attendance by Status</h3>
            {!Object.keys(attendanceStatusCounts).length && (
              <p className="muted">No attendance data available.</p>
            )}
            {!!Object.keys(attendanceStatusCounts).length && (
              <div className="bar-chart">
                {Object.entries(attendanceStatusCounts).map(([status, count]) => (
                  <div key={status} className="bar-row">
                    <span className="bar-label">{status}</span>
                    <div className="bar-track">
                      <div
                        className={`bar-fill ${
                          status === "PRESENT"
                            ? "bar-fill-green"
                            : status === "ABSENT"
                            ? "bar-fill-red"
                            : "bar-fill-blue"
                        }`}
                        style={{ width: `${(count / Math.max(...Object.values(attendanceStatusCounts))) * 100 || 0}%` }}
                      />
                    </div>
                    <span className="bar-value">{count}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="action-grid">
          <div
            className="action-card"
            onClick={() =>
              employees.length && downloadCSV(employees, "employees-report.csv")
            }
            style={{
              cursor: employees.length ? "pointer" : "not-allowed",
              opacity: employees.length ? 1 : 0.7,
            }}
          >
            <h3>Employee Report</h3>
            <p>Export all employees ({employees.length})</p>
          </div>

          <div
            className="action-card"
            onClick={() =>
              leaves.length && downloadCSV(leaves, "leaves-report.csv")
            }
            style={{
              cursor: leaves.length ? "pointer" : "not-allowed",
              opacity: leaves.length ? 1 : 0.7,
            }}
          >
            <h3>Leave Report</h3>
            <p>Export leave applications ({leaves.length})</p>
          </div>

          <div
            className="action-card"
            onClick={() =>
              attendance.length &&
              downloadCSV(attendance, "attendance-report.csv")
            }
            style={{
              cursor: attendance.length ? "pointer" : "not-allowed",
              opacity: attendance.length ? 1 : 0.7,
            }}
          >
            <h3>Attendance Report</h3>
            <p>Export attendance records ({attendance.length})</p>
          </div>
        </section>
      </main>
    </div>
  );
}

