// src/HR/Navbar.jsx
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./style.css";

export default function HRNavbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => {
    if (path === "/hr" && location.pathname === "/hr") return true;
    if (path !== "/hr" && location.pathname.startsWith(path)) return true;
    return false;
  };

  const handleLogout = () => {
    localStorage.removeItem("email");
    localStorage.removeItem("userId");
    navigate("/");
  };

  return (
    <aside className="hr-sidebar">
      <div className="sidebar-brand">
        <div className="brand-logo">VT</div>
        <div className="brand-text">HR Panel</div>
      </div>

      <nav className="hr-nav">
        <Link to="/hr" className={`nav-item ${isActive("/hr") ? "active" : ""}`}>
          Dashboard
        </Link>
        <Link to="/hr/employees" className={`nav-item ${isActive("/hr/employees") ? "active" : ""}`}>
          Employees
        </Link>
        <Link to="/hr/attendance" className={`nav-item ${isActive("/hr/attendance") ? "active" : ""}`}>
          Attendance
        </Link>
        <Link to="/hr/leaves" className={`nav-item ${isActive("/hr/leaves") ? "active" : ""}`}>
          Leave Requests
        </Link>
        <Link to="/hr/recruitment" className={`nav-item ${isActive("/hr/recruitment") ? "active" : ""}`}>
          Recruitment
        </Link>
        <Link to="/hr/reports" className={`nav-item ${isActive("/hr/reports") ? "active" : ""}`}>
          Reports
        </Link>
        <Link to="/hr/profile" className={`nav-item ${isActive("/hr/profile") ? "active" : ""}`}>
          Profile
        </Link>
        <Link to="/hr/settings" className={`nav-item ${isActive("/hr/settings") ? "active" : ""}`}>
          Settings
        </Link>
      </nav>

      <div className="sidebar-footer">
        <Link to="/" className="logout" onClick={handleLogout}>
          ← Logout
        </Link>
      </div>
    </aside>
  );
}


