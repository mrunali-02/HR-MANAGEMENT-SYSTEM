import {
    getAuth,
    GoogleAuthProvider,
    onAuthStateChanged,
    sendEmailVerification,
    signInWithPopup,
    signOut,
    updateProfile,
  } from 'firebase/auth';
  import React, { useEffect, useState } from 'react';
  import '../Firebase';
  import './style.css';
  
  const auth = getAuth();
  const provider = new GoogleAuthProvider();
  const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';
  
  const Settings = () => {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState({
      name: '',
      employeeId: '',
      department: '',
      email: '',
      address: '',
      contactNumber: '',
    });
    const [deviceLogins, setDeviceLogins] = useState([]);
    const [security, setSecurity] = useState({ twoFactor: false, loginAlerts: false });
    const [photoPreview, setPhotoPreview] = useState('');
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState(null);
  
    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, async (current) => {
        if (current) {
          setUser(current);
          await bootstrapProfile(current);
        } else {
          setUser(null);
          setProfile((prev) => ({ ...prev, name: '', email: '' }));
          setLoading(false);
        }
      });
      return () => unsubscribe();
    }, []);
  
    const bootstrapProfile = async (current) => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/employees/${current.uid}/profile`);
        if (!res.ok) {
          throw new Error('Unable to load profile');
        }
        const data = await res.json();
        setProfile({
          ...profile,
          ...data,
          email: current.email,
          name: data.name || current.displayName,
        });
        setPhotoPreview(current.photoURL || data.photoURL || '');
        setSecurity({
          twoFactor: data.security?.twoFactor || false,
          loginAlerts: data.security?.loginAlerts || false,
        });
        await fetchDeviceLogins(current.uid);
      } catch (error) {
        setToast({ type: 'error', message: error.message });
      } finally {
        setLoading(false);
      }
    };
  
    const fetchDeviceLogins = async (uid) => {
      const res = await fetch(`${API_BASE}/employees/${uid}/devices`);
      if (res.ok) {
        const history = await res.json();
        setDeviceLogins(history);
      }
    };
  
    const handleLogin = async () => {
      try {
        await signInWithPopup(auth, provider);
      } catch (error) {
        setToast({ type: 'error', message: error.message });
      }
    };
  
    const handleLogout = async () => {
      await signOut(auth);
      setUser(null);
      setToast({ type: 'success', message: 'Logged out' });
    };
  
    const handlePhoto = async (event) => {
      if (!event.target.files.length) return;
      const file = event.target.files[0];
      const formData = new FormData();
      formData.append('photo', file);
      setSaving(true);
      try {
        const res = await fetch(`${API_BASE}/employees/${user.uid}/photo`, {
          method: 'POST',
          body: formData,
        });
        if (!res.ok) {
          throw new Error('Photo upload failed');
        }
        const { photoURL } = await res.json();
        await updateProfile(user, { photoURL });
        setPhotoPreview(photoURL);
        setToast({ type: 'success', message: 'Photo updated' });
      } catch (error) {
        setToast({ type: 'error', message: error.message });
      } finally {
        setSaving(false);
      }
    };
  
    const handleProfileSave = async (event) => {
      event.preventDefault();
      if (!user) {
        setToast({ type: 'error', message: 'Login required' });
        return;
      }
      setSaving(true);
      try {
        const res = await fetch(`${API_BASE}/employees/${user.uid}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ profile, security }),
        });
        if (!res.ok) {
          throw new Error('Unable to save settings');
        }
        setToast({ type: 'success', message: 'Profile updated' });
      } catch (error) {
        setToast({ type: 'error', message: error.message });
      } finally {
        setSaving(false);
      }
    };
  
    const triggerVerification = async () => {
      if (!user) return;
      try {
        await sendEmailVerification(user);
        setToast({ type: 'success', message: 'Verification email sent' });
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
            <h1>Employee Settings</h1>
            <p>Manage your profile, devices, and account security.</p>
          </div>
          <div>
            {user ? (
              <button className="secondary-btn" onClick={handleLogout}>
                Logout
              </button>
            ) : (
              <button className="primary-btn" onClick={handleLogin}>
                Login with Google
              </button>
            )}
          </div>
        </header>
  
        {!user && (
          <div className="card empty-state">
            <p>Sign in to manage your HRMS settings.</p>
          </div>
        )}
  
        {user && (
          <form className="settings-grid" onSubmit={handleProfileSave}>
            <section className="card settings-card">
              <h3>Profile Information</h3>
              {loading && <div className="loader inline" />}
              {!loading && (
                <>
                  <div className="photo-upload">
                    <img src={photoPreview} alt="Employee" />
                    <label className="secondary-btn">
                      Upload Photo
                      <input type="file" accept="image/*" onChange={handlePhoto} hidden />
                    </label>
                  </div>
                  <label>
                    Full Name
                    <input
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    />
                  </label>
                  <label>
                    Employee ID
                    <input
                      value={profile.employeeId}
                      onChange={(e) => setProfile({ ...profile, employeeId: e.target.value })}
                    />
                  </label>
                  <label>
                    Department
                    <input
                      value={profile.department}
                      onChange={(e) => setProfile({ ...profile, department: e.target.value })}
                    />
                  </label>
                  <label>
                    Email
                    <input value={profile.email} disabled />
                  </label>
                  <div className="verification-row">
                    <span>
                      Email verification:{' '}
                      <strong className={user.emailVerified ? 'status success' : 'status danger'}>
                        {user.emailVerified ? 'Verified' : 'Pending'}
                      </strong>
                    </span>
                    {!user.emailVerified && (
                      <button type="button" className="link-btn" onClick={triggerVerification}>
                        Send verification
                      </button>
                    )}
                  </div>
                </>
              )}
            </section>
  
            <section className="card settings-card">
              <h3>Contact & Address</h3>
              <label>
                Address
                <textarea
                  rows="3"
                  value={profile.address}
                  onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                />
              </label>
              <label>
                Contact Number
                <input
                  value={profile.contactNumber}
                  onChange={(e) => setProfile({ ...profile, contactNumber: e.target.value })}
                />
              </label>
            </section>
  
            <section className="card settings-card">
              <h3>Account Security</h3>
              <label className="switch-row">
                <input
                  type="checkbox"
                  checked={security.twoFactor}
                  onChange={(e) => setSecurity({ ...security, twoFactor: e.target.checked })}
                />
                <span>Enable two-factor authentication</span>
              </label>
              <label className="switch-row">
                <input
                  type="checkbox"
                  checked={security.loginAlerts}
                  onChange={(e) => setSecurity({ ...security, loginAlerts: e.target.checked })}
                />
                <span>Send alerts for new device logins</span>
              </label>
            </section>
  
            <section className="card settings-card">
              <h3>Device Login History</h3>
              <div className="device-list">
                {deviceLogins.map((device) => (
                  <article key={device.id} className="device-row">
                    <div>
                      <p>{device.device}</p>
                      <small>{device.location}</small>
                    </div>
                    <small>{new Date(device.loggedInAt).toLocaleString()}</small>
                  </article>
                ))}
                {!deviceLogins.length && <p className="muted">No device logins recorded.</p>}
              </div>
            </section>
  
            <div className="settings-actions">
              <button className="primary-btn" type="submit" disabled={saving}>
                {saving ? 'Saving...' : 'Save Settings'}
              </button>
            </div>
          </form>
        )}
      </div>
    );
  };
  
  export default Settings;