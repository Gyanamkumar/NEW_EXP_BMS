// src/components/LoginVoice.jsx
import React, { useState, useRef } from 'react';
import { verifyUser } from '../services/api';

import styles from './LoginVoice.module.css';
import cardStyles from './Card.module.css';

export default function LoginVoice() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [status, setStatus] = useState('Idle');
  const [userId, setUserId] = useState('');
  const [result, setResult] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        setAudioBlob(blob);
        audioChunksRef.current = [];
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setStatus('Recording...');
    } catch (err) {
      console.error('Error starting recording:', err);
      setStatus('Error: Could not access microphone.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setStatus('Recording stopped. Ready to verify.');
    }
  };

  const handleVerify = async () => {
    if (!audioBlob) {
      setStatus('No audio recorded.');
      return;
    }
    if (!userId) {
      setStatus('Please enter a user ID.');
      return;
    }

    setStatus('Verifying...');
    setResult(null);

    try {
      const data = await verifyUser(userId, audioBlob);
      setResult(data);
      setStatus(`Verification complete.`);
    } catch (error) {
      console.error('Verification failed:', error);
      setStatus(`Verification Failed: ${error.response?.data?.detail || 'Unknown error'}`);
    }
  };

  return (
    <div className={`${cardStyles.card} ${styles.loginCard}`}>
      <h2 className={cardStyles.cardTitle}>Voice Login</h2>
      <p className={styles.status}>
        <strong>Status:</strong> {status}
      </p>

      <div className={styles.inputGroup}>
        <input
          type="text"
          placeholder="Enter User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className={styles.inputField}
        />
      </div>

      <div className={styles.buttonGroup}>
        <button 
          onClick={startRecording} 
          disabled={isRecording}
          className={`${styles.button} ${styles.buttonPrimary}`}
        >
          Start Recording
        </button>

        <button 
          onClick={stopRecording} 
          disabled={!isRecording}
          className={`${styles.button} ${styles.buttonSecondary}`}
        >
          Stop Recording
        </button>

        <button 
          onClick={handleVerify} 
          disabled={isRecording || !audioBlob || !userId}
          className={`${styles.button} ${styles.buttonSecondary}`}
        >
          Verify Voice
        </button>
      </div>

      {audioBlob && (
        <audio 
          src={URL.createObjectURL(audioBlob)} 
          controls 
          className={styles.audioPlayer} 
        />
      )}

      {result && (
        <div className={styles.resultContainer}>
          <h3>Verification Result:</h3>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}