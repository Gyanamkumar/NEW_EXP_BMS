import React, { useState } from 'react';
import { voiceAuthAPI } from '../../services/voiceAuthAPI';

const VerifyUser = () => {
 const [userId, setUserId] = useState('');
 const [audioFile, setAudioFile] = useState(null);
 const [loading, setLoading] = useState(false);
 const [result, setResult] = useState(null);
 const [error, setError] = useState('');
 const handleFileChange = (e) => {
  const file = e.target.files[0];
  if (file) {
  setAudioFile(file);
  setError('');
  }
 };
 const handleVerify = async (e) => {
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
   setResult(null);
   setError('');
   try {
     const verificationResult = await voiceAuthAPI.verifyUser(userId, audioFile);
     setResult(verificationResult);
     
     // Log alert if verification failed
     if (verificationResult.decision !== 'ALLOW') {
       await voiceAuthAPI.logAlert(
         userId, 
         'failed_verification',
         `Decision: ${verificationResult.decision}` // <-- FIX: Added backticks
       );
     }
   } catch (err) {
     setError(err.message);
   } finally {
     setLoading(false);
   }
 };
 const getDecisionColor = (decision) => {
   if (decision === 'ALLOW') return 'green';
   if (decision?.includes('Spoof')) return 'red';
   return 'orange';
 };
 return (
   <div className="verify-container">
     <h2>🔐 Verify User</h2>
     
     <form onSubmit={handleVerify}>
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
          {loading ? 'Verifying...' : 'Verify User'}
        </button>
      </form>

      {result && (
        <div className="result-container">
          <h3>Verification Result:</h3>
          <div 
            className="decision" 
            style={{ color: getDecisionColor(result.decision) }}
          >
            <strong>Decision:</strong> {result.decision}
          </div>
          <div className="metrics">
            <p>
              <strong>Cosine Similarity:</strong> 
              {' '}{(result.cosine_similarity * 100).toFixed(1)}%
            </p>
            <p>
              <strong>Spoof Probability:</strong> 
              {' '}{(result.spoof_probability * 100).toFixed(1)}%
            </p>
          </div>
        </div>
      )}

      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default VerifyUser;