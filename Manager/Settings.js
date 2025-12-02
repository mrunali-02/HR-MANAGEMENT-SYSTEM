// src/Manager/Settings.jsx
import React from "react";
import ManagerNavbar from "./Navbar";
import "./style.css";

export default function ManagerSettings() {
  return (
    <div className="manager-wrapper">
      <ManagerNavbar />
      <main className="manager-main">
        <header className="manager-header">
          <div>
            <h1>Settings</h1>
            <p className="manager-sub">Configure your preferences</p>
          </div>
        </header>
        <section className="two-column">
          <div className="panel">
            <h3 className="panel-title">Settings</h3>
            <p className="muted">Settings management functionality - to be implemented</p>
          </div>
        </section>
      </main>
    </div>
  );
}


