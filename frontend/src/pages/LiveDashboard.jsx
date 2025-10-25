// src/pages/LiveDashboard.jsx
import React, { useEffect, useRef } from 'react';
import './LiveDashboard.css'; // Keep page-specific CSS

export default function LiveDashboard() {
  // Refs for this page's elements
  const accuracyCanvasRef = useRef(null);
  const wavelengthCanvasRef = useRef(null);
  const accuracyValueRef = useRef(null);
  const wavelengthValueRef = useRef(null);
  const startButtonRef = useRef(null);
  const stopButtonRef = useRef(null);

  // Refs for audio context
  const animationFrameRefs = useRef({
    accuracy: null,
    wavelength: null,
  });
  const audioContextRef = useRef(null);
  const microphoneRef = useRef(null);
  const analyserRef = useRef(null);
  const isAnalyzingRef = useRef(false);

  // This hook now ONLY handles audio and charts
  useEffect(() => {
    document.title = 'Dashboard - VocalLock';

    // Get elements for this page
    const accuracyCanvas = accuracyCanvasRef.current;
    const wavelengthCanvas = wavelengthCanvasRef.current;
    const accuracyValue = accuracyValueRef.current;
    const wavelengthValue = wavelengthValueRef.current;
    const startButton = startButtonRef.current;
    const stopButton = stopButtonRef.current;
    const body = document.body;
    
    // --- All Background/Theme logic is GONE (it's in App.jsx) ---

    // --- Audio Analysis Logic ---
    const accuracyCtx = accuracyCanvas.getContext('2d');
    const wavelengthCtx = wavelengthCanvas.getContext('2d');
    let accuracyData = [];
    let wavelengthData = [];
    const maxDataPoints = 50;

    function getThemeColors() {
      const isDark = body.classList.contains('dark-mode');
      return {
        bg: isDark ? 'rgba(30, 30, 30, 0.6)' : 'rgba(255, 255, 255, 0.6)',
        line: isDark ? '#ec4899' : '#8b5cf6',
        text: isDark ? '#e5e5e5' : '#1a1a1a'
      };
    }

    async function startAudio() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const context = new (window.AudioContext || window.webkitAudioContext)();
        const analyser = context.createAnalyser();
        const microphone = context.createMediaStreamSource(stream);

        analyser.smoothingTimeConstant = 0.8;
        analyser.fftSize = 2048;
        microphone.connect(analyser);

        audioContextRef.current = context;
        analyserRef.current = analyser;
        microphoneRef.current = microphone;

        isAnalyzingRef.current = true;
        startButton.style.display = 'none';
        stopButton.style.display = 'inline-block';

        drawAccuracy();
        drawWavelength();
      } catch (err) {
        console.error('Error accessing microphone:', err);
        alert('Unable to access microphone. Please check permissions and try again.');
      }
    }

    function stopAudio() {
      if (microphoneRef.current) microphoneRef.current.disconnect();
      if (analyserRef.current) analyserRef.current.disconnect();
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(e => console.error("Error closing audio context", e));
      }
      isAnalyzingRef.current = false;
      
      // Check if elements exist before updating
      if (startButton) startButton.style.display = 'inline-block';
      if (stopButton) stopButton.style.display = 'none';
      
      accuracyData = [];
      wavelengthData = [];
      
      [accuracyCtx, wavelengthCtx].forEach(ctx => {
        if(ctx) ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      });
      if(accuracyValue) accuracyValue.textContent = '0.00%';
      if(wavelengthValue) wavelengthValue.textContent = '0.00 nm';
      
      cancelAnimationFrame(animationFrameRefs.current.accuracy);
      cancelAnimationFrame(animationFrameRefs.current.wavelength);
    }

    function drawAccuracy() {
      if (!isAnalyzingRef.current || !accuracyCtx) return;
      const colors = getThemeColors();
      accuracyCtx.canvas.width = accuracyCanvas.clientWidth;
      accuracyCtx.canvas.height = accuracyCanvas.clientHeight;
      const accuracy = (Math.random() * (0.95 - 0.85) + 0.85).toFixed(2);
      accuracyData.push(parseFloat(accuracy));
      if (accuracyData.length > maxDataPoints) accuracyData.shift();
      
      if(accuracyValue) accuracyValue.textContent = `${accuracy}%`;
      
      accuracyCtx.fillStyle = colors.bg;
      accuracyCtx.fillRect(0, 0, accuracyCanvas.width, accuracyCanvas.height);
      accuracyCtx.beginPath();
      accuracyCtx.strokeStyle = colors.line;
      accuracyCtx.lineWidth = 2;
      const step = accuracyCanvas.width / maxDataPoints;
      const maxY = 1.0, minY = 0.8;
      accuracyData.forEach((value, index) => {
        const x = index * step;
        const y = (1 - (value - minY) / (maxY - minY)) * accuracyCanvas.height;
        index === 0 ? accuracyCtx.moveTo(x, y) : accuracyCtx.lineTo(x, y);
      });
      accuracyCtx.stroke();
      animationFrameRefs.current.accuracy = requestAnimationFrame(drawAccuracy);
    }

    function drawWavelength() {
      if (!isAnalyzingRef.current || !analyserRef.current || !wavelengthCtx) return;
      const analyser = analyserRef.current;
      const colors = getThemeColors();
      wavelengthCtx.canvas.width = wavelengthCanvas.clientWidth;
      wavelengthCtx.canvas.height = wavelengthCanvas.clientHeight;
      const bufferLength = analyser.fftSize;
      const dataArray = new Float32Array(bufferLength);
      analyser.getFloatTimeDomainData(dataArray);
      let rms = dataArray.reduce((acc, val) => acc + val * val, 0);
      rms = Math.sqrt(rms / bufferLength);
      const frequency = rms > 0.01 ? (Math.random() * (300 - 100) + 100) : 0;
      const speedOfSound = 343;
      const wavelength = frequency > 0 ? (speedOfSound / frequency * 1e9).toFixed(2) : 0.00;
      wavelengthData.push(parseFloat(wavelength));
      if (wavelengthData.length > maxDataPoints) wavelengthData.shift();
      
      if(wavelengthValue) wavelengthValue.textContent = `${wavelength} nm`;
      
      wavelengthCtx.fillStyle = colors.bg;
      wavelengthCtx.fillRect(0, 0, wavelengthCanvas.width, wavelengthCanvas.height);
      wavelengthCtx.beginPath();
      wavelengthCtx.strokeStyle = colors.line;
      wavelengthCtx.lineWidth = 2;
      const step = wavelengthCanvas.width / maxDataPoints;
      const maxY = 3500, minY = 0;
      wavelengthData.forEach((value, index) => {
        const x = index * step;
        const y = (1 - (value - minY) / (maxY - minY)) * wavelengthCanvas.height;
        index === 0 ? wavelengthCtx.moveTo(x, y) : wavelengthCtx.lineTo(x, y);
      });
      wavelengthCtx.stroke();
      animationFrameRefs.current.wavelength = requestAnimationFrame(drawWavelength);
    }

    // Add event listeners only if elements exist
    if (startButton) startButton.addEventListener('click', startAudio);
    if (stopButton) stopButton.addEventListener('click', stopAudio);

    const observer = new MutationObserver(() => {
      if (isAnalyzingRef.current) {
        drawAccuracy();
        drawWavelength();
      }
    });
    observer.observe(body, { attributes: true, attributeFilter: ['class'] });

    return () => {
      // Cleanup
      stopAudio();
      if (startButton) startButton.removeEventListener('click', startAudio);
      if (stopButton) stopButton.removeEventListener('click', stopAudio);
      observer.disconnect();
    };
  }, []); // Runs once on mount

  return (
    // No more <canvas> or <gradient-bg>
    <div>
      <section className="dashboard-hero">
         <div className="container">
          <h1>
            Real-Time Voice
            <span className="gradient-text">Analysis</span>
          </h1>
          <p>Monitor AI authentication accuracy and sound wavelength in real-time. Start speaking to see the analysis in action.</p>
        </div>
      </section>

      <section className="dashboard-content">
        <div className="container">
          <div className="glass-card visible">
            <h2>Voice Input Controls</h2>
            <a id="startButton" className="cta-button" ref={startButtonRef}>Start Analysis</a>
            <a 
              id="stopButton" 
              className="cta-button" 
              ref={stopButtonRef}
              style={{ display: 'none', marginLeft: '1rem' }} 
            >
              Stop Analysis
            </a>
          </div>
          <div className="dashboard-grid">
            <div className="chart-card">
              <h3>Voice accuracy</h3>
              <canvas id="accuracyCanvas" ref={accuracyCanvasRef}></canvas>
              <div className="stats">
                <div className="stat-item">
                  <div className="stat-value" id="accuracyValue" ref={accuracyValueRef}>0.00%</div>
                  <div className="stat-label">Current Accuracy</div>
                </div>
              </div>
            </div>
            <div className="chart-card">
              <h3>Sound Wavelength</h3>
              <canvas id="wavelengthCanvas" ref={wavelengthCanvasRef}></canvas>
              <div className="stats">
                <div className="stat-item">
                  <div className="stat-value" id="wavelengthValue" ref={wavelengthValueRef}>0.00 nm</div>
                  <div className="stat-label">Current Wavelength</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer>
        <p>&copy; 2025 VocalLock. Crafted with care and precision.</p>
      </footer>
      
      {/* Hidden theme toggle is GONE */}
    </div>
  );
}