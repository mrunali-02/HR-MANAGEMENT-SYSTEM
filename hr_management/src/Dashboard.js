import React, { useState } from 'react';
import "./Dashboard.css";

// Data structures based on the video content
const NAV_LINKS = ["Home", "Features", "About", "Contact"];

const HERO_CARD_FEATURES = [
  { title: "Employee Management", icon: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 17H12M19 14l3 3-3 3"/></svg>
  )},
  { title: "Attendance Tracking", icon: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
  )},
  { title: "Leave Management", icon: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
  )}
];

const POWERFUL_FEATURES = [
  { title: "Smart Attendance", text: "Track employee attendance with GPS verification, real-time monitoring, and automated reporting.", icon: "M10 10l-6 6M14 14l6 6M10 14l-6-6M14 10l6-6M8 8l8 8M8 16l8-8" },
  { title: "Leave Management", text: "Streamlined leave application process with automated approvals and balance tracking.", icon: "M20 7L4 7M4 11H20M4 15H20M4 19H20" },
  { title: "Analytics Dashboard", text: "Comprehensive insights into workforce performance, attendance patterns, and productivity metrics.", icon: "M3 3v18h18M18 17V7M13 17v-4M8 17v-8" },
  { title: "Role-Based Access", text: "Secure access control with different permission levels for employees, managers, and administrators.", icon: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c2.76 0 5 2.24 5 5v2H7v-2c0-2.76 2.24-5 5-5zm0 14c-3.13 0-6.19-1.25-8.49-3.51L12 16l-3-3H6.5c2.42 2.76 5.86 4.5 9.5 4.5 1.54 0 3.01-.28 4.38-.8L12 19z" },
  { title: "Mobile Responsive", text: "Access your HR system from anywhere with our fully responsive mobile-friendly interface.", icon: "M17 19H7c-1.1 0-1.99-.9-1.99-2L5 7c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2v10c0 1.1-.9 2-2 2zM7 7h10v10H7V7z" },
  { title: "Data Security", text: "Enterprise-grade security with encrypted data transmission and secure authentication.", icon: "M12 1.998c-4.42 0-8 3.58-8 8v4.71c0 4.41 3.58 8 8 8s8-3.59 8-8v-4.71c0-4.42-3.58-8-8-8zM12 17c-1.1 0-2-.9-2-2v-2h4v2c0 1.1-.9 2-2 2zm2.08-9.74l1.44-1.44C14.78 4.67 13.43 4 12 4c-3.31 0-6 2.69-6 6v2h12v-2c0-2.48-1.84-4.51-4.32-4.94z" }
];

const TECH_STACK = ["Laravel", "JavaScript", "Bootstrap", "REST API"];

const SVGIcon = ({ d }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d={d} />
    </svg>
);


const Dashboard = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would send data to a backend.
    console.log('Contact form submitted:', formData);
    // Use a custom message box instead of alert()
    document.getElementById('contact-message').textContent = 'Thank you! Your message has been sent.';
    setFormData({ name: '', email: '', message: '' });
    setTimeout(() => {
        document.getElementById('contact-message').textContent = '';
    }, 4000);
  };

  return (
    <div className="page-wrap">
        
        {/* --- TOPBAR / HEADER --- */}
        <header className="topbar">
            <div className="brand">
                <div className="logo">VT</div>
                <div className="brand-name">Vivekananda Technologies</div>
            </div>
            <nav>
                {NAV_LINKS.map(link => (
                    <a key={link} href={`#${link.toLowerCase()}`}>{link}</a>
                ))}
                <a href="./Login" className="btn btn-primary-gradient login-btn">Login</a>
            </nav>
        </header>

        {/* --- MAIN CONTENT SHELL --- */}
        <main className="content-shell">
            
            {/* --- HERO SECTION --- */}
            <section className="hero-section" id="home" aria-labelledby="hero-title">
                <div className="hero-left">
                    <h1 id="hero-title" className="hero-title">
                        Modern HR <span className="system-word">Management System</span>
                    </h1>
                    <p className="hero-sub">
                        Streamline your workforce management with our comprehensive HR solution. Track attendance, manage leaves, and boost productivity with real-time insights.
                    </p>
                    <div className="hero-cta">
                        <a href="./Login" className="btn btn-primary-gradient">
                            <SVGIcon d="M5 12h14M12 5l7 7-7 7" /> Get Started
                        </a>
                        <a href="#features" className="btn btn-ghost-light">
                            Learn More
                        </a>
                    </div>
                </div>

                <div className="hero-right">
                    <div className="glass-card">
                        <div className="glass-card-title">Quick Access</div>
                        {HERO_CARD_FEATURES.map((f, index) => (
                            <div key={f.title} className="glass-feature-item">
                                <div className={`glass-dot ${index === 0 ? 'dot-blue' : index === 1 ? 'dot-pink' : 'dot-yellow'}`} />
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    {f.icon}
                                    {f.title}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- POWERFUL FEATURES SECTION --- */}
            <section className="features-section" id="features" aria-labelledby="features-title">
                <div className="section-heading">
                    <h2 id="features-title">Powerful Features</h2>
                    <p>Everything you need to manage your workforce efficiently.</p>
                </div>
                <div className="features-grid">
                    {POWERFUL_FEATURES.map((f) => (
                        <article key={f.title} className="feature-card">
                            <div className="icon-container">
                                <SVGIcon d={f.icon} />
                            </div>
                            <h3>{f.title}</h3>
                            <p>{f.text}</p>
                        </article>
                    ))}
                </div>
            </section>
            
            {/* --- ABOUT OUR SYSTEM SECTION --- */}
            <section className="about-section" id="about" aria-labelledby="about-title">
                <div className="about-content">
                    <div className="section-heading" style={{ textAlign: 'left', marginBottom: '20px' }}>
                        <h2 id="about-title" style={{ fontSize: '2rem' }}>About Our System</h2>
                        <p style={{ fontSize: '1rem', color: 'var(--color-text-dark)' }}>Built with modern technologies and designed for the future of work</p>
                    </div>
                    <p style={{ maxWidth: '800px', marginBottom: '20px' }}>
                        Our HR Management System is designed to simplify complex workforce management tasks. With intuitive interfaces and powerful backend APIs, we provide a seamless experience for both employees and administrators.
                    </p>
                    <div className="tech-pills">
                        {TECH_STACK.map(tech => (
                            <span key={tech} className="tech-pill">{tech}</span>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- GET IN TOUCH / CONTACT SECTION --- */}
            <section className="contact-section" id="contact" aria-labelledby="contact-title">
                <div className="section-heading">
                    <h2 id="contact-title">Get In Touch</h2>
                    <p>Ready to transform your HR management? Contact us today!</p>
                </div>
                <div className="contact-container">
                    <div className="contact-info">
                        <h3>Contact Information</h3>
                        <div className="contact-info-item">
                            <SVGIcon d="M20 10c0 4.42-4.5 9.74-8 12.01C8.5 19.74 4 14.42 4 10a8 8 0 0 1 16 0zM12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
                            <div>
                                <p>Mumbai, Maharashtra, India</p>
                            </div>
                        </div>
                        <div className="contact-info-item">
                            <SVGIcon d="M22 16.92v3H2v-3c0-1.1.9-2 2-2h16c1.1 0 2 .9 2 2zM12 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
                            <div>
                                <p>+91 123 456 7890</p>
                            </div>
                        </div>
                        <div className="contact-info-item">
                            <SVGIcon d="M2 4h20v16H2V4zm18 2L12 11 4 6v12h16V6z" />
                            <div>
                                <p>info@vivekanandtech.com</p>
                            </div>
                        </div>
                    </div>

                    <form className="contact-form" onSubmit={handleSubmit}>
                        <h3>Send Us a Message</h3>
                        <input
                            type="text"
                            name="name"
                            placeholder="Your Name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder="Your Email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                        <textarea
                            name="message"
                            placeholder="Your Message"
                            value={formData.message}
                            onChange={handleChange}
                            required
                        />
                        <div id="contact-message" style={{ color: 'var(--color-primary)', marginBottom: '15px' }}></div>
                        <button type="submit" className="btn btn-submit-gradient">
                            Send Message
                        </button>
                    </form>
                </div>
            </section>
        </main>

        {/* --- FOOTER --- */}
        <footer className="site-footer">
            &copy; {new Date().getFullYear()} Vivekananda Technologies. All rights reserved.
        </footer>
    </div>
  );
};

export default Dashboard;