// src/HR/Settings.jsx
import React from "react";
import HRNavbar from "./Navbar";
import "./style.css";

export default function HRSettings() {
  return (
    <div className="hr-admin">
      <HRNavbar />
      <main className="hr-main">
        <header className="hr-header">
          <div>
            <h1>Settings</h1>
            <p className="sub">Configure HR system settings</p>
          </div>
        </header>
        <section className="content">
          <div className="panel">
            <h2>System Settings</h2>
            <p className="muted">Settings management functionality - to be implemented</p>
          </div>
        </section>
      </main>
    </div>
  );
}


