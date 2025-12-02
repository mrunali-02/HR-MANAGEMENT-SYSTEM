// src/HR/Dashboard.jsx
import React, { useState, useMemo, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import HRNavbar from "./Navbar";
import "./style.css";

/**
 * Dummy HR Dashboard
 * - Sections: Employees, Attendance, Leave, Overtime, Reports, Statistics
 * - Replace dummy arrays with API calls to your backend
 */

const DUMMY_EMPLOYEES = [
  { id: "E-1001", name: "Asha Patil", dept: "Engineering", email: "asha@vitec.co.in", salary: 55000, status: "Active" },
  { id: "E-1002", name: "Ravi Kumar", dept: "QA", email: "ravi@vitec.co.in", salary: 38000, status: "Active" },
  { id: "E-1003", name: "Neha Joshi", dept: "Design", email: "neha@vitec.co.in", salary: 42000, status: "On Leave" },
  { id: "E-1004", name: "Siddharth Rao", dept: "DevOps", email: "sid@vitec.co.in", salary: 61000, status: "Active" },
];

const DUMMY_ATTENDANCE = [
  { empId: "E-1001", date: "2025-11-30", status: "Present", in: "09:05", out: "18:02" },
  { empId: "E-1002", date: "2025-11-30", status: "Present", in: "09:00", out: "17:45" },
  { empId: "E-1003", date: "2025-11-30", status: "On Leave", in: "-", out: "-" },
  { empId: "E-1004", date: "2025-11-30", status: "Present", in: "08:58", out: "18:10" },
];

const DUMMY_LEAVES = [
  { id: 1, empId: "E-1003", name: "Neha Joshi", type: "Paid", from: "2025-11-28", to: "2025-12-02", days: 5, status: "Pending", balance: 12 },
];

const DUMMY_OVERTIME = [
  { id: 1, empId: "E-1002", name: "Ravi Kumar", date: "2025-11-27", hours: 3, reason: "Release bug", status: "Pending" }
];

export default function HRDashboard() {
  const navigate = useNavigate();
  const [section, setSection] = useState("employees"); // employees | attendance | leave | overtime | reports | stats
  const [employees, setEmployees] = useState(DUMMY_EMPLOYEES);
  const [attendance, setAttendance] = useState(DUMMY_ATTENDANCE);
  const [leaves, setLeaves] = useState(DUMMY_LEAVES);
  const [overtimes, setOvertimes] = useState(DUMMY_OVERTIME);

  // Employee search/autocomplete
  const [query, setQuery] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const searchRef = useRef(null);

  useEffect(() => {
    if (!query) {
      setSearchSuggestions([]);
      return;
    }
    const q = query.trim().toLowerCase();
    const suggestions = employees
      .filter(e => e.name.toLowerCase().includes(q) || e.id.toLowerCase().includes(q) || e.email.toLowerCase().includes(q) || e.dept.toLowerCase().includes(q))
      .slice(0,6);
    setSearchSuggestions(suggestions);
  }, [query, employees]);

  // Simple export CSV helper
  const downloadCSV = (rows, filename = "export.csv") => {
    if (!rows || !rows.length) return;
    const keys = Object.keys(rows[0]);
    const csv = [keys.join(",")].concat(rows.map(r => keys.map(k => `"${(r[k] ?? "").toString().replace(/"/g, '""')}"`).join(","))).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  };

  // Attendance correction action
  const approveCorrection = (empId, date) => {
    // Dummy: mark entry as corrected
    setAttendance(prev => prev.map(r => (r.empId === empId && r.date === date ? { ...r, status: "Corrected" } : r)));
  };

  // Leave approve/reject
  const handleLeaveDecision = (id, decision, remark="") => {
    setLeaves(prev => prev.map(l => l.id === id ? { ...l, status: decision === "approve" ? "Approved" : "Rejected", hrRemark: remark } : l));
    // you may also notify employee in real implementation
  };

  // Overtime approve/reject
  const handleOvertimeDecision = (id, decision, remark="") => {
    setOvertimes(prev => prev.map(o => o.id === id ? { ...o, status: decision === "approve" ? "Approved" : "Rejected", hrRemark: remark } : o));
  };

  // Edit employee details (dummy)
  const handleUpdateEmployee = (id, changes) => {
    setEmployees(prev => prev.map(e => e.id === id ? { ...e, ...changes } : e));
    // add audit log in backend
  };

  // Quick stats derived
  const stats = useMemo(() => {
    const total = employees.length;
    const pendingLeaves = leaves.filter(l => l.status === "Pending").length;
    const presentToday = attendance.filter(a => a.status === "Present").length;
    const overtimePending = overtimes.filter(o => o.status === "Pending").length;
    return { total, pendingLeaves, presentToday, overtimePending };
  }, [employees, leaves, attendance, overtimes]);

  return (
    <div className="hr-admin">
      <HRNavbar />

      <main className="hr-main">
        <header className="hr-header">
          <div>
            <h1>HR Dashboard</h1>
            <p className="sub">Manage employees, attendance, leaves, overtime, and reports</p>
          </div>

          <div className="header-actions">
            <div className="quick-stat">Employees: <strong>{stats.total}</strong></div>
            <button className="btn" onClick={() => navigate("/hr/employees")}>Manage Employees</button>
          </div>
        </header>

        {/* --- Sections --- */}
        <section className="content">
          {section === "employees" && (
            <div className="panel">
              <div className="panel-head">
                <h2>Search Employee</h2>
                <div className="search-row">
                  <input ref={searchRef} value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Search by name, ID, dept or email" />
                  <button className="btn-ghost" onClick={()=> { setQuery(""); searchRef.current?.focus(); }}>Clear</button>
                  <button className="btn" onClick={()=> downloadCSV(employees, "employees.csv")}>Export CSV</button>
                </div>
                {searchSuggestions.length>0 && (
                  <div className="suggestions">
                    {searchSuggestions.map(s => <button key={s.id} className="suggest" onClick={()=> { setQuery(`${s.name}`); setSearchSuggestions([]); }}>{s.name} — {s.id}</button>)}
                  </div>
                )}
              </div>

              <div className="table-wrap">
                <table className="table">
                  <thead>
                    <tr><th>ID</th><th>Name</th><th>Dept</th><th>Email</th><th>Salary</th><th>Status</th><th>Action</th></tr>
                  </thead>
                  <tbody>
                    {employees.filter(e => {
                      if(!query) return true;
                      const q = query.toLowerCase();
                      return [e.id,e.name,e.dept,e.email].some(v=>v.toLowerCase().includes(q));
                    }).map(e => (
                      <tr key={e.id}>
                        <td>{e.id}</td>
                        <td>{e.name}</td>
                        <td>{e.dept}</td>
                        <td>{e.email}</td>
                        <td>₹{e.salary.toLocaleString()}</td>
                        <td>{e.status}</td>
                        <td>
                          <button className="btn-small" onClick={()=> {
                            const newSalary = prompt("Enter new salary", String(e.salary));
                            if(newSalary) handleUpdateEmployee(e.id, { salary: Number(newSalary) });
                          }}>Edit</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {section === "attendance" && (
            <div className="panel">
              <div className="panel-head">
                <h2>Attendance Records</h2>
                <div className="filters">
                  <button className="btn" onClick={() => navigate("/hr/attendance")}>View Full Attendance</button>
                  <button className="btn-ghost" onClick={()=> downloadCSV(attendance, "attendance.csv")}>Export CSV</button>
                </div>
              </div>
              <p className="muted">Quick view. Use the button above to see full attendance management.</p>
            </div>
          )}

          {section === "leave" && (
            <div className="panel">
              <div className="panel-head">
                <h2>Leave Requests</h2>
                <div className="filters">
                  <button className="btn" onClick={() => navigate("/hr/leaves")}>View All Leave Requests</button>
                  <button className="btn-ghost" onClick={()=> downloadCSV(leaves, "leaves.csv")}>Export CSV</button>
                </div>
              </div>
              <p className="muted">Quick view. Use the button above to see full leave management.</p>
            </div>
          )}

          {section === "overtime" && (
            <div className="panel">
              <div className="panel-head">
                <h2>Overtime Submissions</h2>
                <div className="filters">
                  <button className="btn-ghost" onClick={()=> downloadCSV(overtimes, "overtime.csv")}>Export CSV</button>
                </div>
              </div>

              <div className="requests">
                {overtimes.map(o => (
                  <div key={o.id} className="request">
                    <div>
                      <div><strong>{o.name}</strong> ({o.empId})</div>
                      <div className="muted">{o.date} — {o.hours} hrs — {o.reason}</div>
                    </div>
                    <div className="request-actions">
                      <button className="btn-small" onClick={()=> handleOvertimeDecision(o.id, "approve")}>Approve</button>
                      <button className="btn-small reject" onClick={()=> handleOvertimeDecision(o.id, "reject")}>Reject</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {section === "reports" && (
            <div className="panel">
              <h2>Generate Reports</h2>
              <p className="muted">Select report type and date range, then export (CSV / Excel / PDF).</p>
              <button className="btn" onClick={() => navigate("/hr/reports")} style={{marginTop: 12}}>Go to Reports Page</button>
            </div>
          )}

          {section === "stats" && (
            <div className="panel">
              <h2>Employee Statistics</h2>
              <p className="muted">View detailed statistics and analytics.</p>
              <button className="btn" onClick={() => navigate("/hr/reports")} style={{marginTop: 12}}>View Statistics</button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
