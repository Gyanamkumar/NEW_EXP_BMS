// src/components/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import api from '../services/api';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // This '/stats' endpoint must exist on your backend
        const response = await api.get('/stats'); 
        setStats(response.data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch stats:", err);
        setError("Could not load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []); // Empty array means this runs once on mount

  if (loading) return <p>Loading dashboard...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!stats) return null;

  // Assuming stats look like: { totalAttempts: 150, spoofAttempts: 12, avgConfidence: 0.88 }
  return (
    <div style={{ display: 'flex', gap: '20px' }}>
      <div style={{ border: '1px solid #ccc', padding: '20px' }}>
        <h4>Total Attempts</h4>
        <p style={{ fontSize: '2rem' }}>{stats.totalAttempts}</p>
      </div>
      <div style={{ border: '1px solid #ccc', padding: '20px' }}>
        <h4>Spoof Attempts</h4>
        <p style={{ fontSize: '2rem' }}>{stats.spoofAttempts}</p>
      </div>
      <div style={{ border: '1px solid #ccc', padding: '20px' }}>
        <h4>Avg. Confidence</h4>
        <p style={{ fontSize: '2rem' }}>{(stats.avgConfidence * 100).toFixed(1)}%</p>
      </div>
    </div>
  );
}