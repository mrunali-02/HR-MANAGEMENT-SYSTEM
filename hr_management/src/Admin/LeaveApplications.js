// src/Admin/LeaveApplications.jsx

import React, { useEffect, useState } from "react";
import AdminNavbar from "./Navbar";
import "./style.css";

export default function AdminLeaveApplications() {
  const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000";

  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  // Load leave applications
  useEffect(() => {
    const ac = new AbortController();

    async function loadLeaves() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`${API_BASE}/api/leaves`, {
          signal: ac.signal,
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          const text = await res.text();
          throw new Error(`API error ${res.status}: ${text}`);
        }

        const data = await res.json();
        const list = Array.isArray(data) ? data : [];

        const mapped = list.map((item) => ({
          id: item.id,
          empId: item.employee_id || item.employeeId,
          name: item.name,
          type: item.leaveType || item.type,
          from: item.startDate || item.start_date,
          to: item.endDate || item.end_date,
          days: item.days,
          status: item.status,
          remark: item.managerRemarks || item.manager_remarks,
          createdAt: item.createdAt || item.created_at,
        }));

        setLeaves(mapped);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("loadLeaves error:", err);
          setError(err.message || "Failed to load leave requests");
        }
      } finally {
        setLoading(false);
      }
    }

    loadLeaves();
    return () => ac.abort();
  }, [API_BASE]);

  // Approve / Reject leave
  const handleDecision = async (id, decision) => {
    const remark = window.prompt("Add remarks (optional):", "") || "";
    setUpdatingId(id);

    try {
      const res = await fetch(`${API_BASE}/api/leaves/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: decision === "Approved" ? "Approved" : "Rejected",
          remark,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`API error ${res.status}: ${text}`);
      }

      const updated = await res.json();

      setLeaves((prev) =>
        prev.map((l) =>
          l.id === id
            ? {
                ...l,
                status: updated.status || decision,
                remark: updated.managerRemarks || updated.manager_remarks || remark,
              }
            : l
        )
      );
    } catch (err) {
      console.error("handleDecision error:", err);
      alert(err.message || "Failed to update leave status");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="admin-wrapper">
      <AdminNavbar />
      <main className="admin-main">
        <header className="admin-header">
          <h1>Leave Applications</h1>
          <p className="admin-sub">Review and approve leave requests</p>
        </header>

        {loading && <div className="notice">Loading leave requests…</div>}
        {error && (
          <div className="error">
            <div>{error}</div>
            <button
              className="primary-btn"
              onClick={() => window.location.reload()}
              style={{ marginTop: "12px" }}
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && (
          <section className="action-grid">
            {leaves.length === 0 && (
              <div className="muted">No leave requests found.</div>
            )}

            {leaves.map((l) => (
              <div key={l.id} className="action-card">
                <h3>
                  {l.name} ({l.empId})
                </h3>
                <p>Type: {l.type} | Days: {l.days}</p>
                <p className="muted">From {l.from} to {l.to}</p>
                <p className="muted">Status: {l.status}</p>

                {l.remark && <p className="muted">Remarks: {l.remark}</p>}

                {l.status === "Pending" && (
                  <div
                    style={{
                      marginTop: "12px",
                      display: "flex",
                      gap: "8px",
                      alignItems: "center",
                    }}
                  >
                    <button
                      className="btn-small accept"
                      disabled={updatingId === l.id}
                      onClick={() => handleDecision(l.id, "Approved")}
                    >
                      {updatingId === l.id ? "Updating…" : "Approve"}
                    </button>

                    <button
                      className="btn-small reject"
                      disabled={updatingId === l.id}
                      onClick={() => handleDecision(l.id, "Rejected")}
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}
