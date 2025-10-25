// src/App.jsx
import React, { useEffect, useRef } from 'react'; // Import useEffect and useRef
import { Routes, Route, Link } from 'react-router-dom';
import Landing from './pages/Landing';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import Contact from './pages/Contact';
import LiveDashboard from './pages/LiveDashboard';
import styles from './App.module.css';

function App() {
  // Ref for the background canvas
  const bgCanvasRef = useRef(null);
  
  // Logic for Theme Toggling
  useEffect(() => {
    const body = document.body;
    const currentTheme = localStorage.getItem('theme') || 'light';
    if (currentTheme === 'dark') {
      body.classList.add('dark-mode');
    }

    const handleThemeToggle = () => {
      body.classList.toggle('dark-mode');
      const theme = body.classList.contains('dark-mode') ? 'dark' : 'light';
      localStorage.setItem('theme', theme);
    };

    const toggleButton = document.getElementById('themeToggle');
    toggleButton.addEventListener('click', handleThemeToggle);

    return () => {
      toggleButton.removeEventListener('click', handleThemeToggle);
    };
  }, []); // Runs once on mount

  // Logic for Background Canvas Animation
  useEffect(() => {
    const canvas = bgCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = Math.random() * 2 + 1;
        this.color = `rgba(${Math.floor(Math.random() * 100) + 100}, ${Math.floor(Math.random() * 100) + 80}, ${Math.floor(Math.random() * 100) + 180}, 0.6)`;
      }
      update() {
        this.x += this.vx; this.y += this.vy;
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
    }
    const particles = Array.from({ length: 120 }, () => new Particle());

    let animationFrameId;
    function animateBackground() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => { p.update(); p.draw(); });
      particles.forEach((p1, i) => {
        particles.slice(i + 1).forEach(p2 => {
          const dist = Math.sqrt((p1.x - p2.x)**2 + (p1.y - p2.y)**2);
          if (dist < 150) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(139, 92, 246, ${0.15 * (1 - dist / 150)})`;
            ctx.lineWidth = 0.8;
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        });
      });
      animationFrameId = requestAnimationFrame(animateBackground);
    }
    animateBackground();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []); // Runs once on mount


  return (
    <> {/* Use React.Fragment */}
      {/* Global Backgrounds */}
      <canvas className="bg-canvas" id="bgCanvas" ref={bgCanvasRef}></canvas>
      <div className="gradient-bg">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
      </div>

      {/* Main App Content */}
      <div className={styles.appContainer}>
        <nav className={styles.navbar}>
          
          {/* 1. ADD THIS LOGO LINK */}
          <Link to="/" className={styles.logo}>
            VocalLock
          </Link>

          <div className={styles.navLinksContainer}> 
            <Link to="/" className={styles.navLink}>Home</Link>
            <Link to="/analytics" className={styles.navLink}>Analytics</Link>
            <Link to="/app" className={styles.navLink}>App</Link>
            <Link to="/settings" className={styles.navLink}>Settings</Link>
            <Link to="/contact" className={styles.navLink}>Contact</Link>
            <Link to="/dashboard" className={styles.navLink}>Dashboard</Link>
          </div>
          
          <div className="theme-toggle" id="themeToggle">
            <div className="theme-toggle-slider">
              <span className="sun-icon">☀</span>
              <span className="moon-icon">🌙</span>
            </div>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/dashboard" element={<LiveDashboard />} />
          <Route path="/app" element={<LiveDashboard />} />
        </Routes>
      </div>
    </>
  );
}

export default App;