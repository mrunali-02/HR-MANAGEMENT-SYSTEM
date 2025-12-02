// src/HR/Profile.jsx
import React from "react";
import HRNavbar from "./Navbar";
import "./style.css";

export default function HRProfile() {
  return (
    <div className="hr-admin">
      <HRNavbar />
      <main className="hr-main">
        <header className="hr-header">
          <div>
            <h1>HR Profile</h1>
            <p className="sub">Manage your HR profile information</p>
          </div>
        </header>
        <section className="content">
          <div className="panel">
            <h2>Profile Settings</h2>
            <p className="muted">Profile management functionality - to be implemented</p>
          </div>
        </section>
      </main>
    </div>
  );
}


