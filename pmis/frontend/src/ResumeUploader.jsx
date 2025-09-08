import React, { useState } from 'react';
import axios from 'axios';

function ResumeUploader({ onRecommendations }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setError('');
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a resume file first.');
      return;
    }

    setIsLoading(true);
    setError('');
    setUploadSuccess(false);

    const formData = new FormData();
    formData.append('resume', selectedFile);

    try {
      // Call your Node.js backend endpoint
      const response = await axios.post('http://localhost:5000/api/recommend-by-resume', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      onRecommendations(response.data.recommendations || [], response.data.skills || []);
      setUploadSuccess(true);
    } catch (err) {
      setError('An error occurred while getting recommendations. Please ensure the backend and ML services are running.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="panel" style={{ marginBottom: '2rem' }}>
      <h2 className="title" style={{ marginTop: 0 }}>Get AI-Powered Recommendations</h2>
      <p>Upload your resume (PDF only) and we'll find the top internships for you.</p>
      <div className="pform-group" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <input type="file" accept=".pdf" onChange={handleFileChange} />
        <button onClick={handleUpload} disabled={isLoading || !selectedFile} className="btn accent">
          {isLoading ? 'Analyzing...' : 'Find My Matches'}
        </button>
      </div>
      {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
      {uploadSuccess && <p style={{ color: 'green', marginTop: '1rem' }}>Success! Displaying your top matches below.</p>}
    </div>
  );
}

export default ResumeUploader;