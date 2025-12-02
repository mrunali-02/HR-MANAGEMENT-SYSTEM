import React, { useEffect, useState } from 'react';
import './style.css';

const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

const leaveTypes = ['Sick', 'Casual', 'Paid', 'Emergency'];

const Leaves = () => {
  const [employee, setEmployee] = useState(null);
  const [balances, setBalances] = useState({});
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [form, setForm] = useState({
    leaveType: 'Sick',
    startDate: '',
    endDate: '',
    reason: '',
  });

  useEffect(() => {
    fetchEmployee();
  }, []);

  useEffect(() => {
    if (employee) {
      fetchBalances();
      fetchHistory();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employee]);

  useEffect(() => {
    if (form.leaveType && form.startDate && form.endDate) {
      validateBalance();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.leaveType, form.startDate, form.endDate]);

  const fetchEmployee = async () => {
    const res = await fetch(`${API_BASE}/employees/me`, { credentials: 'include' });
    if (res.ok) {
      setEmployee(await res.json());
    }
  };

  const fetchBalances = async () => {
    const res = await fetch(`${API_BASE}/leaves/${employee.employeeId}/balances`);
    if (res.ok) {
      setBalances(await res.json());
    }
  };

  const fetchHistory = async () => {
    setLoading(true);
    const res = await fetch(`${API_BASE}/leaves/${employee.employeeId}`);
    if (res.ok) {
      setHistory(await res.json());
    }
    setLoading(false);
  };

  const numberOfDays = () => {
    if (!form.startDate || !form.endDate) return 0;
    const start = new Date(form.startDate);
    const end = new Date(form.endDate);
    if (end < start) return 0;
    return Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1;
  };

  const validateBalance = async () => {
    const duration = numberOfDays();
    if (!duration) return;
    const res = await fetch(
      `${API_BASE}/leaves/validate?employeeId=${employee.employeeId}&type=${form.leaveType}&days=${duration}`
    );
    if (!res.ok) {
      const { message } = await res.json();
      setToast({ type: 'error', message });
      return false;
    }
    return true;
  };

  const hasOverlap = () => {
    const start = new Date(form.startDate);
    const end = new Date(form.endDate);
    return history.some((record) => {
      const histStart = new Date(record.startDate);
      const histEnd = new Date(record.endDate);
      return start <= histEnd && end >= histStart;
    });
  };

  const durationValid = () => {
    const duration = numberOfDays();
    if (!duration) return false;
    const min = form.leaveType === 'Emergency' ? 1 : 0.5;
    const max = form.leaveType === 'Paid' ? 21 : 7;
    return duration >= min && duration <= max;
  };

  const resetForm = () =>
    setForm({
      leaveType: 'Sick',
      startDate: '',
      endDate: '',
      reason: '',
    });

  const submitLeave = async (payload) => {
    const res = await fetch(`${API_BASE}/leaves`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const { message } = await res.json();
      throw new Error(message || 'Unable to submit leave');
    }
    const saved = await res.json();
    setHistory((prev) => [saved, ...prev]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!employee) return;
    if (!durationValid()) {
      setToast({ type: 'error', message: 'Duration outside allowed range' });
      return;
    }
    if (hasOverlap()) {
      setToast({ type: 'error', message: 'Dates overlap existing leave' });
      return;
    }
    const isBalanceValid = await validateBalance();
    if (!isBalanceValid) return;
    try {
      await submitLeave({
        ...form,
        employeeId: employee.employeeId,
        days: numberOfDays(),
      });
      setToast({ type: 'success', message: 'Leave submitted' });
      resetForm();
    } catch (error) {
      setToast({ type: 'error', message: error.message });
    }
  };

  const handleEmergency = async () => {
    if (!employee) return;
    const today = new Date().toISOString().slice(0, 10);
    try {
      await submitLeave({
        leaveType: 'Emergency',
        startDate: today,
        endDate: today,
        reason: 'Emergency leave auto submission',
        employeeId: employee.employeeId,
        days: 1,
        emergency: true,
      });
      setToast({ type: 'success', message: 'Emergency leave auto-submitted' });
    } catch (error) {
      setToast({ type: 'error', message: error.message });
    }
  };

  return (
    <div className="employee-page">
      {toast && (
        <div className={`toast toast-${toast.type}`} onAnimationEnd={() => setToast(null)}>
          {toast.message}
        </div>
      )}
      <header className="employee-header">
        <div>
          <h1>Leaves</h1>
          <p>Apply, track balances, and monitor approvals.</p>
        </div>
        <button className="warning-btn" onClick={handleEmergency}>
          Emergency Leave
        </button>
      </header>

      <section className="card">
        <h3>Apply Leave</h3>
        <form className="form-grid" onSubmit={handleSubmit}>
          <label>
            Leave Type
            <select
              value={form.leaveType}
              onChange={(e) => setForm({ ...form, leaveType: e.target.value })}
            >
              {leaveTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </label>
          <label>
            Start Date
            <input
              type="date"
              value={form.startDate}
              onChange={(e) => setForm({ ...form, startDate: e.target.value })}
            />
          </label>
          <label>
            End Date
            <input
              type="date"
              value={form.endDate}
              onChange={(e) => setForm({ ...form, endDate: e.target.value })}
            />
          </label>
          <label className="full-width">
            Reason
            <textarea
              rows="3"
              value={form.reason}
              onChange={(e) => setForm({ ...form, reason: e.target.value })}
            />
          </label>
          <div className="form-inline">
            <p>
              Duration: <strong>{numberOfDays()} days</strong>
            </p>
            <p>
              Balance:{' '}
              <strong>
                {balances[form.leaveType]?.remaining ?? '--'} / {balances[form.leaveType]?.total ?? '--'}
              </strong>
            </p>
          </div>
          <button className="primary-btn full-width">Submit Leave</button>
        </form>
      </section>

      <section className="card history-card">
        <h3>Leave History</h3>
        {loading ? (
          <div className="loader inline" />
        ) : (
          <table className="styled-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Dates</th>
                <th>Days</th>
                <th>Status</th>
                <th>Manager Remarks</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item) => (
                <tr key={item.id}>
                  <td>{item.leaveType}</td>
                  <td>
                    {item.startDate} - {item.endDate}
                  </td>
                  <td>{item.days}</td>
                  <td>
                    <span className={`status ${item.status.toLowerCase()}`}>{item.status}</span>
                  </td>
                  <td>{item.managerRemarks || '-'}</td>
                </tr>
              ))}
              {!history.length && (
                <tr>
                  <td colSpan="5" className="muted">
                    No leave records yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
};

export default Leaves;