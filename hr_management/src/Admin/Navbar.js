// src/Admin/Navbar.jsx
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./style.css";

export default function AdminNavbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => {
    if (path === "/admin" && location.pathname === "/admin") return true;
    if (path !== "/admin" && location.pathname.startsWith(path)) return true;
    return false;
  };

  const handleLogout = () => {
    localStorage.removeItem("email");
    localStorage.removeItem("userId");
    navigate("/");
  };

  return (
    <aside className="admin-sidebar">
      <div className="sidebar-brand">
        <div className="brand-logo">VT</div>
        <div className="brand-text">Admin Panel</div>
      </div>

      <nav className="admin-nav">
        <Link to="/admin" className={`nav-item ${isActive("/admin") ? "active" : ""}`}>
          Dashboard
        </Link>
        <Link to="/admin/employees" className={`nav-item ${isActive("/admin/employees") ? "active" : ""}`}>
          Employees
        </Link>
        <Link to="/admin/leaves" className={`nav-item ${isActive("/admin/leaves") ? "active" : ""}`}>
          Leave Applications
        </Link>
        <Link to="/admin/reports" className={`nav-item ${isActive("/admin/reports") ? "active" : ""}`}>
          Reports
        </Link>
        <Link to="/admin/settings" className={`nav-item ${isActive("/admin/settings") ? "active" : ""}`}>
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


