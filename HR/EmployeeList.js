// src/HR/EmployeeList.jsx
import React, { useState } from "react";
import HRNavbar from "./Navbar";
import "./style.css";

export default function HREmployeeList() {
  const [employees, setEmployees] = useState([
    { id: "E-1001", name: "Asha Patil", dept: "Engineering", email: "asha@vitec.co.in", salary: 55000, status: "Active" },
    { id: "E-1002", name: "Ravi Kumar", dept: "QA", email: "ravi@vitec.co.in", salary: 38000, status: "Active" },
    { id: "E-1003", name: "Neha Joshi", dept: "Design", email: "neha@vitec.co.in", salary: 42000, status: "On Leave" },
    { id: "E-1004", name: "Siddharth Rao", dept: "DevOps", email: "sid@vitec.co.in", salary: 61000, status: "Active" },
  ]);

  const [query, setQuery] = useState("");

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

  const filteredEmployees = employees.filter(e => {
    if (!query) return true;
    const q = query.toLowerCase();
    return [e.id, e.name, e.dept, e.email].some(v => v.toLowerCase().includes(q));
  });

  return (
    <div className="hr-admin">
      <HRNavbar />
      <main className="hr-main">
        <header className="hr-header">
          <div>
            <h1>Employee Management</h1>
            <p className="sub">Manage employee information and records</p>
          </div>
          <div className="header-actions">
            <button className="btn" onClick={() => alert("Add employee form - to be implemented")}>Add Employee</button>
          </div>
        </header>

        <section className="content">
          <div className="panel">
            <div className="panel-head">
              <h2>Search Employee</h2>
              <div className="search-row">
                <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by name, ID, dept or email" />
                <button className="btn-ghost" onClick={() => setQuery("")}>Clear</button>
                <button className="btn" onClick={() => downloadCSV(filteredEmployees, "employees.csv")}>Export CSV</button>
              </div>
            </div>

            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr><th>ID</th><th>Name</th><th>Dept</th><th>Email</th><th>Salary</th><th>Status</th><th>Action</th></tr>
                </thead>
                <tbody>
                  {filteredEmployees.map(e => (
                    <tr key={e.id}>
                      <td>{e.id}</td>
                      <td>{e.name}</td>
                      <td>{e.dept}</td>
                      <td>{e.email}</td>
                      <td>₹{e.salary.toLocaleString()}</td>
                      <td>{e.status}</td>
                      <td>
                        <button className="btn-small" onClick={() => {
                          const newSalary = prompt("Enter new salary", String(e.salary));
                          if (newSalary) setEmployees(prev => prev.map(emp => emp.id === e.id ? { ...emp, salary: Number(newSalary) } : emp));
                        }}>Edit</button>
                      </td>
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


