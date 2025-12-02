// src/HR/Recruitment.jsx
import React, { useState } from "react";
import HRNavbar from "./Navbar";
import "./style.css";

export default function HRRecruitment() {
  const [candidates] = useState([
    { id: 1, name: "John Doe", position: "Software Engineer", status: "Interview Scheduled", date: "2025-12-05" },
    { id: 2, name: "Jane Smith", position: "UI Designer", status: "Pending Review", date: "2025-12-03" },
  ]);

  return (
    <div className="hr-admin">
      <HRNavbar />
      <main className="hr-main">
        <header className="hr-header">
          <div>
            <h1>Recruitment</h1>
            <p className="sub">Manage job postings and candidate applications</p>
          </div>
          <div className="header-actions">
            <button className="btn" onClick={() => alert("Add job posting - to be implemented")}>Post Job</button>
          </div>
        </header>
        <section className="content">
          <div className="panel">
            <h2>Candidates</h2>
            <div className="requests">
              {candidates.map(c => (
                <div key={c.id} className="request">
                  <div>
                    <div><strong>{c.name}</strong> — {c.position}</div>
                    <div className="muted">Status: {c.status} | Date: {c.date}</div>
                  </div>
                  <div className="request-actions">
                    <button className="btn-small" onClick={() => alert("View candidate details - to be implemented")}>View</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}


