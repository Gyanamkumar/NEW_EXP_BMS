// src/pages/Home.jsx
import React from 'react';
import LoginVoice from '../components/LoginVoice';
import LiveFeed from '../components/LiveFeed';
import AlertsPanel from '../components/AlertsPanel';
import styles from './Home.module.css';

const homeStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '20px',
};

export default function Home() {
 return (
    <div>
      {/* Remove the h1 from here, we'll add it back with styling */}
      <div className={styles.homeContainer}>
        <h1 className={styles.mainTitle}>Voice Authentication Dashboard</h1>

        {/* Column 1 */}
        <LoginVoice />

        {/* Column 2 */}
        <div className={styles.rightColumn}>
          <AlertsPanel />
          <LiveFeed />
        </div>
      </div>
    </div>
  );
}