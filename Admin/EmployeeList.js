// src/Admin/EmployeeList.jsx
import React, { useEffect, useMemo, useState } from "react";
import AdminNavbar from "./Navbar";
import "./style.css";

export default function AdminEmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formError, setFormError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    employeeId: "",
    roleId: "4",
    name: "",
    email: "",
    department: "",
    phone: "",
    joinedOn: "",
    address: "",
    contactNumber: "",
    createdAt: new Date().toISOString().slice(0, 10),
  });
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [editData, setEditData] = useState(null);
  const [savingEdit, setSavingEdit] = useState(false);
  const [detailError, setDetailError] = useState(null);

  // change this if your backend lives elsewhere
  const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000";

  useEffect(() => {
    const ac = new AbortController();
    setLoading(true);
    setError(null);

    fetch(`${API_BASE}/api/employees?limit=200`, { signal: ac.signal })
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`API error ${res.status}: ${text}`);
        }
        return res.json();
      })
      .then((json) => {
        // Expecting { success: true, data: [...] } from server
        if (json && json.success) {
          setEmployees(json.data || []);
        } else if (Array.isArray(json)) {
          // fallback if server returns raw array
          setEmployees(json);
        } else {
          setEmployees([]);
          setError("Unexpected API response");
        }
      })
      .catch((err) => {
        if (err.name !== "AbortError") setError(err.message || "Fetch error");
      })
      .finally(() => setLoading(false));

    return () => ac.abort();
  }, [API_BASE]);

  // Helpers to normalize fields (avoids mixing ?? and || in JSX)
  const getId = (emp) => {
    return emp?.id || emp?.employee_id || emp?.employeeId || "—";
  };

  const getName = (emp) => {
    if (emp?.name) return emp.name;
    const first = emp?.first_name || emp?.firstName || "";
    const last = emp?.last_name || emp?.lastName || "";
    const full = `${first} ${last}`.trim();
    return full || "—";
  };

  const getDept = (emp) => {
    return emp?.department || emp?.dept || emp?.department_name || "—";
  };

  const getEmail = (emp) => {
    return emp?.email || emp?.work_email || "—";
  };

  const getStatus = (emp) => {
    return emp?.status || emp?.employment_status || "—";
  };

  const roleOptions = [
    { id: "1", label: "Admin" },
    { id: "2", label: "HR" },
    { id: "3", label: "Manager" },
    { id: "4", label: "Employee" },
  ];

  const departmentOptions = ["Leadership", "Finance", "IT", "Marketing", "Operations", "HR", "Sales"];

  const nextEmployeeId = useMemo(() => {
    if (!employees || employees.length === 0) return "EMP001";
    let maxNum = 0;
    employees.forEach((emp) => {
      const raw = emp?.employee_id || emp?.employeeId || emp?.id || "";
      const digits = String(raw).replace(/\D/g, "");
      const num = parseInt(digits || "0", 10);
      if (!Number.isNaN(num) && num > maxNum) maxNum = num;
    });
    const next = maxNum + 1;
    return `EMP${String(next).padStart(3, "0")}`;
  }, [employees]);

  const handleOpenForm = () => {
    setFormError(null);
    setFormData({
      employeeId: nextEmployeeId,
      roleId: "4",
      name: "",
      email: "",
      department: "",
      phone: "",
      joinedOn: "",
      address: "",
      contactNumber: "",
      createdAt: new Date().toISOString().slice(0, 10),
    });
    setShowForm(true);
  };

  const handleCloseForm = () => {
    if (submitting) return;
    setShowForm(false);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    setFormError(null);

    if (!formData.name || !formData.email || !formData.department || !formData.joinedOn) {
      setFormError("Please fill all required fields highlighted with *.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/api/employees`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          employee_id: formData.employeeId,
          role_id: Number(formData.roleId),
          name: formData.name,
          email: formData.email,
          department: formData.department,
          phone: formData.phone,
          joined_on: formData.joinedOn,
          address: formData.address,
          contact_number: formData.contactNumber,
          created_at: formData.createdAt,
        }),
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "Failed to create employee");
      }

      const payload = await res.json();
      const created = payload?.data || payload;
      setEmployees((prev) => [created, ...prev]);
      setShowForm(false);
    } catch (err) {
      setFormError(err.message || "Unable to add employee");
    } finally {
      setSubmitting(false);
    }
  };

  // --- Detail + edit modal ---
  const handleCardClick = (emp) => {
    const base = {
      id: emp.id,
      employeeId: emp.employee_id || emp.employeeId || getId(emp),
      roleId: emp.role_id || emp.roleId || "4",
      name: emp.name || getName(emp),
      email: emp.email || getEmail(emp),
      department: emp.department || getDept(emp),
      phone: emp.phone || emp.contact_number || emp.contactNumber || "",
      joinedOn: emp.joined_on || emp.joinedOn || "",
      address: emp.address || "",
      contactNumber: emp.contact_number || emp.contactNumber || "",
      createdAt: emp.created_at || emp.createdAt || new Date().toISOString().slice(0, 10),
    };
    setSelectedEmployee(emp);
    setEditData(base);
    setDetailError(null);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCloseDetail = () => {
    if (savingEdit) return;
    setSelectedEmployee(null);
    setEditData(null);
    setDetailError(null);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!selectedEmployee || !editData) return;
    setDetailError(null);

    if (!editData.name || !editData.email || !editData.department || !editData.createdAt) {
      setDetailError("Please fill all required fields before saving.");
      return;
    }

    setSavingEdit(true);
    try {
      const idForUrl = selectedEmployee.id || selectedEmployee.employee_id || selectedEmployee.employeeId;
      const res = await fetch(`${API_BASE}/api/employees/${idForUrl}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role_id: Number(editData.roleId || 4),
          name: editData.name,
          email: editData.email,
          department: editData.department,
          phone: editData.phone,
          address: editData.address,
          contact_number: editData.contactNumber,
          created_at: editData.createdAt,
        }),
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "Failed to update employee");
      }

      const payload = await res.json();
      const updated = payload?.data || payload;

      setEmployees((prev) =>
        prev.map((emp) => {
          const currentId = emp.id || emp.employee_id || emp.employeeId;
          const updatedId = updated.id || updated.employee_id || updated.employeeId;
          return String(currentId) === String(updatedId) ? updated : emp;
        })
      );

      setSelectedEmployee(updated);
      setEditData({
        ...editData,
        roleId: updated.roleId || updated.role_id || editData.roleId,
        name: updated.name,
        email: updated.email,
        department: updated.department,
        phone: updated.phone,
        address: updated.address,
        contactNumber: updated.contactNumber || updated.contact_number || editData.contactNumber,
        createdAt: updated.createdAt || updated.created_at || editData.createdAt,
      });
    } catch (err) {
      setDetailError(err.message || "Unable to update employee");
    } finally {
      setSavingEdit(false);
    }
  };

  return (
    <div className="admin-wrapper">
      <AdminNavbar />
      <main className="admin-main">
        <header className="admin-header">
          <h1>Employee Management</h1>
          <p className="admin-sub">Manage all employees in the system</p>
          <button className="primary-btn" onClick={handleOpenForm}>
            + Add Employee
          </button>
        </header>

        {loading && <div className="notice">Loading employees…</div>}
        {error && <div className="error">Error: {error}</div>}

        {!loading && !error && (
          <section className="action-grid">
            {employees.length === 0 && <div className="muted">No employees found.</div>}
            {employees.map((emp) => (
              <div
                key={getId(emp)}
                className="action-card"
                style={{ cursor: "pointer" }}
                onClick={() => handleCardClick(emp)}
              >
                <h3>{getName(emp)}</h3>
                <p>
                  {getDept(emp)} • {getId(emp)}
                </p>
                <p className="muted">Email: {getEmail(emp)}</p>
                <p className="muted">Status: {getStatus(emp)}</p>
              </div>
            ))}
          </section>
        )}

        {showForm && (
          <div className="modal-backdrop" onClick={handleCloseForm}>
            <div className="modal-card" onClick={(e) => e.stopPropagation()}>
              <div className="modal-head">
                <h2>Add New Employee</h2>
                <button className="close-btn" onClick={handleCloseForm} disabled={submitting}>
                  ×
                </button>
              </div>
              {formError && <div className="error">{formError}</div>}
              <form className="modal-form" onSubmit={handleAddEmployee}>
                <div className="form-grid">
                  <label>
                    Employee ID
                    <input value={formData.employeeId} name="employeeId" readOnly />
                  </label>
                  <label>
                    Role *
                    <select name="roleId" value={formData.roleId} onChange={handleFormChange} required>
                      {roleOptions.map((role) => (
                        <option key={role.id} value={role.id}>
                          {role.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Name *
                    <input name="name" value={formData.name} onChange={handleFormChange} required />
                  </label>
                  <label>
                    Email *
                    <input type="email" name="email" value={formData.email} onChange={handleFormChange} required />
                  </label>
                  <label>
                    Department *
                    <select name="department" value={formData.department} onChange={handleFormChange} required>
                      <option value="">Select department</option>
                      {departmentOptions.map((dept) => (
                        <option key={dept} value={dept}>
                          {dept}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Phone
                    <input name="phone" value={formData.phone} onChange={handleFormChange} placeholder="+91-0000000000" />
                  </label>
                  <label>
                    Joined On *
                    <input type="date" name="joinedOn" value={formData.joinedOn} onChange={handleFormChange} required />
                  </label>
                  <label>
                    Created At
                    <input type="date" name="createdAt" value={formData.createdAt} onChange={handleFormChange} required />
                  </label>
                  <label className="full-row">
                    Address
                    <input name="address" value={formData.address} onChange={handleFormChange} />
                  </label>
                  <label className="full-row">
                    Emergency Contact
                    <input name="contactNumber" value={formData.contactNumber} onChange={handleFormChange} />
                  </label>
                </div>
                <div className="modal-actions">
                  <button type="button" className="ghost-btn" onClick={handleCloseForm} disabled={submitting}>
                    Cancel
                  </button>
                  <button type="submit" className="primary-btn" disabled={submitting}>
                    {submitting ? "Saving..." : "Save Employee"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {selectedEmployee && editData && (
          <div className="modal-backdrop" onClick={handleCloseDetail}>
            <div className="modal-card" onClick={(e) => e.stopPropagation()}>
              <div className="modal-head">
                <h2>Employee Details</h2>
                <button className="close-btn" onClick={handleCloseDetail} disabled={savingEdit}>
                  ×
                </button>
              </div>
              {detailError && <div className="error">{detailError}</div>}
              <form className="modal-form" onSubmit={handleSaveEdit}>
                <div className="form-grid">
                  <label>
                    Employee ID
                    <input value={editData.employeeId} name="employeeId" readOnly />
                  </label>
                  <label>
                    Role *
                    <select name="roleId" value={editData.roleId} onChange={handleEditChange} required>
                      {roleOptions.map((role) => (
                        <option key={role.id} value={role.id}>
                          {role.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Name *
                    <input name="name" value={editData.name} onChange={handleEditChange} required />
                  </label>
                  <label>
                    Email *
                    <input type="email" name="email" value={editData.email} onChange={handleEditChange} required />
                  </label>
                  <label>
                    Department *
                    <select name="department" value={editData.department} onChange={handleEditChange} required>
                      <option value="">Select department</option>
                      {departmentOptions.map((dept) => (
                        <option key={dept} value={dept}>
                          {dept}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Phone
                    <input name="phone" value={editData.phone} onChange={handleEditChange} />
                  </label>
                  <label>
                    Created At *
                    <input type="date" name="createdAt" value={editData.createdAt} onChange={handleEditChange} required />
                  </label>
                  <label className="full-row">
                    Address
                    <input name="address" value={editData.address} onChange={handleEditChange} />
                  </label>
                  <label className="full-row">
                    Emergency Contact
                    <input name="contactNumber" value={editData.contactNumber} onChange={handleEditChange} />
                  </label>
                </div>
                <div className="modal-actions">
                  <button type="button" className="ghost-btn" onClick={handleCloseDetail} disabled={savingEdit}>
                    Close
                  </button>
                  <button type="submit" className="primary-btn" disabled={savingEdit}>
                    {savingEdit ? "Saving…" : "Save changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
