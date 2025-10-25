// src/components/LiveFeed.jsx
import React, { useState, useEffect } from 'react';
import socket, { connectSocket } from '../services/websocket';

import cardStyles from './Card.module.css';
import styles from './LiveFeed.module.css';

export default function LiveFeed() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // Connect to the socket when component mounts
    connectSocket();

    // Listen for a 'new_event' from the server
    socket.on('new_event', (newEvent) => {
      // newEvent might be: { type: 'LOGIN_ATTEMPT', user: 'user123', timestamp: '...' }
      setEvents((prevEvents) => [newEvent, ...prevEvents.slice(0, 9)]); // Keep last 10
    });

    // Clean up on component unmount
    return () => {
      socket.off('new_event');
      // You might want to disconnect if no other component is using it
      // disconnectSocket(); 
    };
  }, []); // Empty dependency array means this runs once on mount

  return (
    <div className={cardStyles.card}>
      <h2 className={cardStyles.cardTitle}>Live Event Feed</h2>

      <ul className={styles.feedList}>
        {events.length === 0 && (
          <li className={styles.feedItem}>Waiting for events...</li>
        )}
        {events.map((event, index) => (
          <li key={index} className={styles.feedItem}>
            <small>[{new Date(event.timestamp).toLocaleTimeString()}]</small> 
            <strong>{event.user}</strong> - {event.type}
          </li>
        ))}
      </ul>
    </div>
  );
}