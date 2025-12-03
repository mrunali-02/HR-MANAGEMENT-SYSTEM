// src/Admin/Settings.jsx
import React, { useEffect, useState } from "react";
import AdminNavbar from "./Navbar";
import "./style.css";

export default function AdminSettings() {
  const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000";

  const [settings, setSettings] = useState({
    companyName: "",
    timezone: "Asia/Kolkata",
    workingDays: "Mon-Fri",
    overtimeEnabled: true,
    emailNotifications: true,
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    // Load from localStorage as a fallback “settings store”
    const stored = localStorage.getItem("admin_settings");
    if (stored) {
      try {
        setSettings((prev) => ({ ...prev, ...JSON.parse(stored) }));
      } catch {
        // ignore parse errors
      }
    }
  }, []);

  const handleChange = (field, value) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleToggle = (field) => {
    setSettings((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    // Persist to localStorage so the admin experiences durable settings
    localStorage.setItem("admin_settings", JSON.stringify(settings));

    // If you later expose a real API endpoint (e.g. POST /api/admin/settings),
    // this is where you would call it. We keep it optional to avoid breaking.
    const token = localStorage.getItem("token");
    try {
      await fetch(`${API_BASE}/api/admin/settings`, {
        method: "POST",
        headers: token
          ? {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            }
          : { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      }).catch(() => {
        // silently ignore if endpoint is not implemented yet
      });
      setMessage("Settings saved.");
    } catch (err) {
      setMessage(err.message || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-wrapper">
      <AdminNavbar />
      <main className="admin-main">
        <header className="admin-header">
          <h1>Settings</h1>
          <p className="admin-sub">
            Configure system preferences for your HR management.
          </p>
        </header>

        <section className="settings-panel">
          <form onSubmit={handleSave} className="settings-form">
            <div className="form-row">
              <label>Company Name</label>
              <input
                type="text"
                value={settings.companyName}
                onChange={(e) => handleChange("companyName", e.target.value)}
                placeholder="Enter company name"
              />
            </div>

            <div className="form-row">
              <label>Timezone</label>
              <select
                value={settings.timezone}
                onChange={(e) => handleChange("timezone", e.target.value)}
              >
                <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                <option value="UTC">UTC</option>
                <option value="Asia/Dubai">Asia/Dubai</option>
              </select>
            </div>

            <div className="form-row">
              <label>Working Days</label>
              <select
                value={settings.workingDays}
                onChange={(e) => handleChange("workingDays", e.target.value)}
              >
                <option value="Mon-Fri">Mon–Fri</option>
                <option value="Mon-Sat">Mon–Sat</option>
              </select>
            </div>

            <div className="form-row toggle-row">
              <label>Enable Overtime Tracking</label>
              <button
                type="button"
                className={`toggle ${settings.overtimeEnabled ? "on" : "off"}`}
                onClick={() => handleToggle("overtimeEnabled")}
              >
                {settings.overtimeEnabled ? "On" : "Off"}
              </button>
            </div>

            <div className="form-row toggle-row">
              <label>Email Notifications</label>
              <button
                type="button"
                className={`toggle ${settings.emailNotifications ? "on" : "off"}`}
                onClick={() => handleToggle("emailNotifications")}
              >
                {settings.emailNotifications ? "On" : "Off"}
              </button>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn" disabled={saving}>
                {saving ? "Saving…" : "Save Settings"}
              </button>
              {message && <span className="muted" style={{ marginLeft: 12 }}>{message}</span>}
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}

