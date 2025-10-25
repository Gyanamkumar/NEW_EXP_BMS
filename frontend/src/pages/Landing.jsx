import React, { useEffect, useRef } from 'react';
import './Landing.css'; // Import the new CSS

export default function Landing() {
  // Refs for elements that need event listeners
  const perspectiveCardRef = useRef(null);
  const ctaButtonRef = useRef(null);
  
  // Set page title
  useEffect(() => {
    document.title = 'VocalLock - Home';
  }, []);

  // Handle all animations and event listeners
  useEffect(() => {
    // 1. Scroll Animation Logic
    const observerOptions = {
      threshold: 0.15,
      rootMargin: '0px 0px -80px 0px'
    };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, observerOptions);
    
    const scrollElements = document.querySelectorAll('[data-scroll]');
    scrollElements.forEach(el => observer.observe(el));

    // 2. 3D Card Tilt Logic
    const card = perspectiveCardRef.current;
    const handleMouseMove = (e) => {
      if (!card) return;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / 30;
      const rotateY = (centerX - x) / 30;
      // FIXED: Added backticks (`)
      card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    };
    const handleMouseLeave = () => {
      if (!card) return;
      card.style.transform = 'rotateX(0) rotateY(0)';
    };
    
    if (card) {
      card.addEventListener('mousemove', handleMouseMove);
      card.addEventListener('mouseleave', handleMouseLeave);
    }

    // 3. Smooth Scroll Logic
    const ctaButton = ctaButtonRef.current;
    const handleCtaClick = (e) => {
      e.preventDefault();
      const featuresSection = document.querySelector('#features');
      if (featuresSection) {
        featuresSection.scrollIntoView({ behavior: 'smooth' });
      }
    };

    if (ctaButton) {
      ctaButton.addEventListener('click', handleCtaClick);
    }

    // 4. Cleanup Function
    return () => {
      scrollElements.forEach(el => observer.unobserve(el));
      observer.disconnect();
      
      if (card) {
        card.removeEventListener('mousemove', handleMouseMove);
        card.removeEventListener('mouseleave', handleMouseLeave);
      }
      if (ctaButton) {
        ctaButton.removeEventListener('click', handleCtaClick);
      }
    };
  }, []); // Empty array ensures this runs only once

  return (
    <div>
      {/* Note: The <nav>, <footer>, <canvas>, and <gradient-bg>
          are REMOVED because they are now handled globally
          by your App.jsx and index.css */}

      <section className="hero">
        <div className="hero-content">
          <h1>
            Where Security Meets
            <span className="gradient-text">Innovation</span>
          </h1>
          <p>Voice authentication that feels natural, secure, and seamless. Powered by AI, built on trust, and designed to recognize the one thing that can't be faked.</p>
          <a href="#features" className="cta-button" ref={ctaButtonRef}>
            Discover More
          </a>
        </div>
      </section>

      {/* The .container class from your new CSS is renamed to
          .page-container to avoid conflicting with .container 
          from your other pages' CSS. I've updated the CSS above. */}
      <div className="page-container">
        <section>
          <div className="glass-card" data-scroll>
            <h2>Intelligence, Precision, Authenticity</h2>
            <p>VocalLock redefines authentication by combining artificial intelligence with biometric precision. Our system learns the subtle characteristics of your voice—tone, rhythm, and pitch—to create a unique vocal identity that can't be duplicated. Behind every interaction lies cutting-edge technology ensuring both convenience and uncompromised security.</p>
          </div>
        </section>

        <section id="features">
          <div className="feature-grid" data-scroll>
            <div className="feature-item">
              <div className="feature-icon">✦</div>
              <h3>Secure Voiceprint Authentication</h3>
              <p>Uses advanced AI models to analyze unique vocal characteristics such as pitch, tone, cadence, and speech patterns to verify a user's identity.</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">◆</div>
              <h3>Real-Time Spoof Detection</h3>
              <p>Analyzes micro-acoustic cues like breathing patterns, vocal resonance, and liveness detection to ensure the speaker is human and live.</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">◇</div>
              <h3>Seamless Integration</h3>
              <p>Offers SDKs and APIs for quick integration into banking apps, call centers, and IoT devices.</p>
            </div>
          </div>
        </section>

        <section className="quote-section">
          <blockquote data-scroll>
            Security isn't about complexity, it's about authenticity.
            <div className="quote-author">— VocalLock Team</div>
          </blockquote>
        </section>

        <section className="perspective-section" id="about">
          <div className="perspective-card" data-scroll ref={perspectiveCardRef}>
            <div className="perspective-content">
              <h2>AI That Listens, Learns, and Protects</h2>
              <p>VocalLock continuously evolves with every interaction. Using deep learning and neural acoustic models, it differentiates between genuine users and replayed or synthesized voices. Our spoof detection engine captures micro-acoustic patterns—imperceptible to the human ear—to verify real human presence in milliseconds.</p>
            </div>
          </div>
        </section>

        <section>
          <div className="glass-card" data-scroll>
            <h2>Designed for Trust, Built for the Future</h2>
            <p>Every feature in VocalLock serves one mission—secure identity verification with zero friction. The interface is simple, the process seamless, and the results reliable. From real-time voice liveness checks to encrypted storage, every layer is optimized for privacy, performance, and peace of mind.</p>
          </div>
        </section>
      </div>

      {/* The global <footer> from App.jsx will appear here */}
    </div>
  );
}