// src/Manager/Profile.jsx
import React from "react";
import ManagerNavbar from "./Navbar";
import "./style.css";

export default function ManagerProfile() {
  return (
    <div className="manager-wrapper">
      <ManagerNavbar />
      <main className="manager-main">
        <header className="manager-header">
          <div>
            <h1>Manager Profile</h1>
            <p className="manager-sub">Manage your profile information</p>
          </div>
        </header>
        <section className="two-column">
          <div className="panel">
            <h3 className="panel-title">Profile Settings</h3>
            <p className="muted">Profile management functionality - to be implemented</p>
          </div>
        </section>
      </main>
    </div>
  );
}


