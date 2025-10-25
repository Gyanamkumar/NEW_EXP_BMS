// src/components/AlertsPanel.jsx
import React, { useState, useEffect } from 'react';
import socket, { connectSocket } from '../services/websocket';

import cardStyles from './Card.module.css';
import styles from './AlertsPanel.module.css';

export default function AlertsPanel() {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    connectSocket(); // Ensure socket is connected

    // Listen for a 'spoof_alert' from the server
    socket.on('spoof_alert', (newAlert) => {
      // newAlert might be: { confidence: 0.15, type: 'DEEPFAKE', timestamp: '...' }
      setAlerts((prevAlerts) => [newAlert, ...prevAlerts]);
    });

    return () => {
      socket.off('spoof_alert');
    };
  }, []);

  if (alerts.length === 0) {
    return null; // Don't show the panel if no alerts
  }

 return (
    <div className={`${cardStyles.card} ${styles.alertCard}`}>
      <h3 className={`${cardStyles.cardTitle} ${styles.alertTitle}`}>
        {/* You can add an icon here later! */}
        ⚠️ Security Alerts
      </h3>
      <ul className={styles.alertList}>
        {alerts.map((alert, index) => (
          <li key={index} className={styles.alertItem}>
            <strong>SPOOF ATTEMPT DETECTED</strong>
            <p>Type: {alert.type} (Confidence: {alert.confidence * 100}%)</p>
            <small>{new Date(alert.timestamp).toLocaleString()}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}