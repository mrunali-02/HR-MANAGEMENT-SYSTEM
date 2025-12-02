// src/Manager/Navbar.jsx
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./style.css";

export default function ManagerNavbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => {
    if (path === "/manager" && location.pathname === "/manager") return true;
    if (path !== "/manager" && location.pathname.startsWith(path)) return true;
    return false;
  };

  const handleLogout = () => {
    localStorage.removeItem("email");
    localStorage.removeItem("userId");
    navigate("/");
  };

  return (
    <aside className="manager-sidebar">
      <div className="sidebar-brand">
        <div className="brand-logo">VT</div>
        <div className="brand-text">Manager Panel</div>
      </div>

      <nav className="manager-nav">
        <Link to="/manager" className={`nav-item ${isActive("/manager") ? "active" : ""}`}>
          Dashboard
        </Link>
        <Link to="/manager/attendance" className={`nav-item ${isActive("/manager/attendance") ? "active" : ""}`}>
          Attendance
        </Link>
        <Link to="/manager/leaves" className={`nav-item ${isActive("/manager/leaves") ? "active" : ""}`}>
          Leave Approvals
        </Link>
        <Link to="/manager/reports" className={`nav-item ${isActive("/manager/reports") ? "active" : ""}`}>
          Reports
        </Link>
        <Link to="/manager/profile" className={`nav-item ${isActive("/manager/profile") ? "active" : ""}`}>
          Profile
        </Link>
        <Link to="/manager/settings" className={`nav-item ${isActive("/manager/settings") ? "active" : ""}`}>
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


