// src/pages/Login.jsx
import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import app from "./Firebase"; 
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import "./Dashboard.css";
/**
 * After successful login, route users to different dashboards depending on the email.
 * Edit this map to add the exact emails and destination routes you need.
 */
const EMAIL_ROUTE_MAP = {
  // example entries — replace with real addresses and routes:
  "yashashree.naik.01@gmail.com": "/admin",
  "admin@vitec.co.in": "/admin",
  "manager@gmail.com": "/manager",
  "manager@vitec.co.in": "/manager",
  "employee@gmail.com": "/employee",
  "employee@vitec.co.in": "/employee",
  "hr@gmail.com": "/hr",
  "hr@vitec.co.in": "/hr"
};

export default function Login() {
  const nav = useNavigate();
  const rEmail = useRef(null);
  const rPass = useRef(null);

  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState(""); // "error" or "success"
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      const auth = getAuth(app);
      const user = auth.currentUser;
      if (user) nav("/"); // redirect to root if already logged in
    } catch (e) {
      // ignore
    }
  }, [nav]);

  const hEmail = (e) => {
    setEmail(e.target.value);
    setMsg("");
    setMsgType("");
  };

  const hPass = (e) => {
    setPass(e.target.value);
    setMsg("");
    setMsgType("");
  };

  const lookupRouteForEmail = (userEmail) => {
    if (!userEmail) return null;
    const key = userEmail.trim().toLowerCase();
    return EMAIL_ROUTE_MAP[key] || null;
  };

  const login = async (e) => {
    e.preventDefault();
    setMsg("");
    setMsgType("");
  
    if (email.trim() === "") {
      setMsg("Email should not be empty");
      setMsgType("error");
      rEmail.current?.focus();
      return;
    }
    if (pass.trim() === "") {
      setMsg("Password should not be empty");
      setMsgType("error");
      rPass.current?.focus();
      return;
    }
  
    setLoading(true);
    const auth = getAuth(app);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, pass);
  
      // get firebase id token (JWT)
      const idToken = await userCredential.user.getIdToken(); // use getIdToken(true) to force refresh if needed
      console.log("Fetched Firebase ID token:", idToken);
      localStorage.setItem("token", idToken);
  
      // store minimal session info
      const signedInEmail = (userCredential?.user?.email || email).toLowerCase();
      localStorage.setItem("email", signedInEmail);
      localStorage.setItem("userId", userCredential.user.uid);
  
      setMsg("Login successful");
      setMsgType("success");
  
      // route
      const route = lookupRouteForEmail(signedInEmail);
      nav(route || "/employee");
    } catch (error) {
      const errMsg = (error && error.message) ? error.message : "Login failed";
      setMsg(`Login failed: ${errMsg}`);
      setMsgType("error");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="login-page">
      <div className="login-blob login-blob-1" aria-hidden />
      <div className="login-blob login-blob-2" aria-hidden />

      <div className="login-card" role="region" aria-labelledby="login-heading">
        <header className="login-header">
          <p className="kicker">Account access</p>
          <h1 id="login-heading">Welcome back</h1>
          <p className="login-sub">Use your work email to sign into the HR workspace.</p>
        </header>

        <form className="login-form" onSubmit={login} noValidate>
          <label className="input-label" htmlFor="email">
            Work email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            ref={rEmail}
            autoComplete="email"
            placeholder="team@company.com"
            value={email}
            onChange={hEmail}
            required
            className="text-input"
            aria-required="true"
          />

          <label className="input-label" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            ref={rPass}
            autoComplete="current-password"
            placeholder="••••••••"
            value={pass}
            onChange={hPass}
            required
            className="text-input"
            aria-required="true"
          />

          <div className="login-meta">
            <label className="checkbox">
              <input type="checkbox" name="remember" /> <span>Keep me signed in</span>
            </label>

            <button type="button" className="ghost-link" onClick={() => alert("Password reset flow placeholder")}>
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            className={`btn btn-primary auth-btn ${loading ? "loading" : ""}`}
            disabled={loading}
            aria-busy={loading}
          >
            {loading ? "Checking..." : "Login"}
          </button>
        </form>

        {msg && (
          <div className={`auth-msg ${msgType === "error" ? "err" : "ok"}`} role="alert">
            {msg}
          </div>
        )}

        <div className="auth-footer">
          <span>Need an account?</span>
          <button type="button" className="ghost-link" onClick={() => alert("Request access placeholder")}>
            Request access
          </button>
        </div>

        <div className="auth-divider" role="separator" aria-label="Back to dashboard" />
        <Link to="/" className="btn btn-ghost back-btn">
          ← Back to dashboard
        </Link>
      </div>
    </div>
  );
}
