// src/Employee/Navbar.jsx
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./style.css";

export default function EmployeeNavbar({ employee }) {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => {
    if (path === "/employee" && location.pathname === "/employee") return true;
    if (path !== "/employee" && location.pathname.startsWith(path)) return true;
    return false;
  };

  const handleLogout = () => {
    localStorage.removeItem("email");
    localStorage.removeItem("userId");
    navigate("/");
  };

  return (
    <aside className="emp-sidebar">
      <div className="emp-profile">
        <div className="avatar" style={{ background: employee?.avatarColor || "#4fa7ff" }}>
          {employee?.name ? employee.name.split(" ").map(n => n[0]).slice(0,2).join("") : "E"}
        </div>
        <div className="emp-info">
          <div className="emp-name">{employee?.name || "Employee"}</div>
          <div className="emp-role">{employee?.role || "Employee"}</div>
          <div className="emp-meta">{employee?.dept || "Dept"} • {employee?.id || "E-0000"}</div>
        </div>
      </div>

      <nav className="emp-nav">
        <Link to="/employee" className={`nav-item ${isActive("/employee") ? "active" : ""}`}>
          Overview
        </Link>
        <Link to="/employee/attendance" className={`nav-item ${isActive("/employee/attendance") ? "active" : ""}`}>
          Attendance
        </Link>
        <Link to="/employee/leaves" className={`nav-item ${isActive("/employee/leaves") ? "active" : ""}`}>
          Leaves
        </Link>
        <Link to="/employee/settings" className={`nav-item ${isActive("/employee/settings") ? "active" : ""}`}>
          Settings
        </Link>
        <Link to="/" className="nav-item" onClick={handleLogout}>
          Logout
        </Link>
      </nav>

      <div className="emp-side-footer">
        <div className="small-muted">Contact HR</div>
        <a href="mailto:hr@vitec.co.in" className="link">hr@vitec.co.in</a>
      </div>
    </aside>
  );
}


