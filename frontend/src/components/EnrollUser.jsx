import React, { useState } from 'react';
import { voiceAuthAPI } from '../../services/voiceAuthAPI';

const EnrollUser = () => {
  const [userId, setUserId] = useState('');
  const [audioFile, setAudioFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAudioFile(file);
      setError('');
    }
  };

  const handleEnroll = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!userId.trim()) {
      setError('Please enter a user ID');
      return;
    }
    if (!audioFile) {
      setError('Please select an audio file');
      return;
    }

    setLoading(true);
    setMessage('');
    setError('');

    try {
      const result = await voiceAuthAPI.enrollUser(userId, audioFile);
      setMessage(result.message);
      
      // Reset form
      setUserId('');
      setAudioFile(null);
      document.getElementById('audioFileInput').value = '';
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="enroll-container">
      <h2>📝 Enroll New User</h2>
      
      <form onSubmit={handleEnroll}>
        <div className="form-group">
          <label htmlFor="userId">User ID:</label>
          <input
            type="text"
            id="userId"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="Enter user ID"
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="audioFileInput">Voice Sample:</label>
          <input
            type="file"
            id="audioFileInput"
            accept="audio/*"
            onChange={handleFileChange}
            disabled={loading}
          />
          {audioFile && <p>Selected: {audioFile.name}</p>}
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Enrolling...' : 'Enroll User'}
        </button>
      </form>

      {message && <div className="success-message">{message}</div>}
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default EnrollUser;