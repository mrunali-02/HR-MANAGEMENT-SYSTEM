// src/Admin/LeaveApplications.jsx

import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth"; // <-- NEW
import AdminNavbar from "./Navbar";
import "./style.css";

// helper: get token, optionally force refresh
async function fetchWithAuth(url, options = {}, { forceRefresh = false, retryOn401 = true } = {}) {
  const auth = getAuth();
  let token = null;

  try {
    const user = auth.currentUser;
    if (user) {
      token = await user.getIdToken(forceRefresh); // forceRefresh true gets a fresh token from Firebase
      localStorage.setItem("token", token); // keep localStorage in sync (optional)
    } else {
      token = localStorage.getItem("token");
    }
  } catch (e) {
    console.warn("fetchWithAuth: getIdToken error", e);
    token = localStorage.getItem("token");
  }

  const headers = {
    ...(options.headers || {}),
    "Content-Type": "application/json",
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(url, { ...options, headers });
  if (res.status === 401 && retryOn401) {
    // Try one forced refresh and retry (in case token expired)
    try {
      const user = getAuth().currentUser;
      if (user) {
        const fresh = await user.getIdToken(true); // force refresh
        localStorage.setItem("token", fresh);
        headers.Authorization = `Bearer ${fresh}`;
        const retryRes = await fetch(url, { ...options, headers });
        return retryRes;
      }
    } catch (e) {
      console.warn("fetchWithAuth retry error", e);
    }
  }

  return res;
}


export default function AdminLeaveApplications() {
  const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000";

  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  // Helper: try to get a fresh ID token from firebase currentUser, fallback to localStorage
  async function getFreshToken() {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        // Use getIdToken(true) if you want to force refresh (useful during debugging)
        return await user.getIdToken();
      }
    } catch (e) {
      console.warn("getFreshToken() firebase error:", e);
    }
    return localStorage.getItem("token");
  }

  useEffect(() => {
    const ac = new AbortController();

    async function loadLeaves() {
      try {
        setLoading(true);
        setError(null);

        const token = await getFreshToken();
        console.log("loadLeaves: token ->", !!token, token ? token.slice(0, 20) + "..." : null);

        const headers = token
          ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
          : { "Content-Type": "application/json" };

        console.log("loadLeaves: calling", `${API_BASE}/api/leaves`, "headers:", headers);

        const res = await fetchWithAuth(`${API_BASE}/api/leaves`, {
  signal: ac.signal
});

        

        const text = await res.text();
        console.log("loadLeaves: raw response status", res.status, "body", text);

        if (!res.ok) {
          // server returned error text (already captured)
          throw new Error(`API error ${res.status}: ${text}`);
        }

        // parse JSON (server returned JSON)
        const data = text ? JSON.parse(text) : [];
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

  const handleDecision = async (id, decision) => {
    const remark = window.prompt("Add remarks (optional):", "") || "";

    setUpdatingId(id);
    try {
      const token = await getFreshToken();
      console.log("handleDecision: token ->", !!token, token ? token.slice(0, 20) + "..." : null);

      const headers = token
        ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
        : { "Content-Type": "application/json" };

      console.log("handleDecision: PATCH", `${API_BASE}/api/leaves/${id}/status`, "headers:", headers, "body:", { status: decision === "Approved" ? "Approved" : "Rejected", remark });

      const res = await fetch(`${API_BASE}/api/leaves/${id}/status`, {
        method: "PATCH",
        headers,
        body: JSON.stringify({ status: decision === "Approved" ? "Approved" : "Rejected", remark }),
      });

      const text = await res.text();
      console.log("handleDecision: response", res.status, text);

      if (!res.ok) {
        throw new Error(`API error ${res.status}: ${text}`);
      }

      const updated = text ? JSON.parse(text) : {};

      setLeaves((prev) =>
        prev.map((l) =>
          l.id === id
            ? {
                ...l,
                status: updated.status || decision,
                remark: updated.managerRemarks || remark,
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
          <p className="admin-sub">Review and approve leave requests directly from the database</p>
        </header>

        {loading && <div className="notice">Loading leave requests…</div>}
        {error && <div className="error">Error: {error}</div>}

        {!loading && !error && (
          <section className="action-grid">
            {leaves.length === 0 && <div className="muted">No leave requests found.</div>}
            {leaves.map((l) => (
              <div key={l.id} className="action-card">
                <h3>
                  {l.name} ({l.empId})
                </h3>
                <p>
                  Type: {l.type} | Days: {l.days}
                </p>
                <p className="muted">From {l.from} to {l.to}</p>
                <p className="muted">Status: {l.status}</p>
                {l.remark && <p className="muted">Remarks: {l.remark}</p>}
                {l.status === "Pending" && (
                  <div style={{ marginTop: "12px", display: "flex", gap: "8px", alignItems: "center" }}>
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
