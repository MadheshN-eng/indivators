import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ResumeUploader from './ResumeUploader';

function JobCard({ job }) {
  return (
    <article className="card job">
      <div>
        <h4 style={{ margin: 0, fontSize: 'x-large' }}>{job.title}</h4>
        <p className="meta">{job.org} • {job.district} • {job.sector}</p>
        <div className="badge-line">
          {job.tags.map(t => <span className="tag" key={t}>{t}</span>)}
          {job.stipend > 0 && <span className="tag">₹{job.stipend.toLocaleString('en-IN')}/month</span>}
        </div>
        {job.matchPercentage != null && (
          <p style={{ marginTop: '1rem', color: 'var(--accent)', fontWeight: 'bold' }}>
            Match Score: {job.matchPercentage}%
          </p>
        )}
      </div>
    </article>
  );
}

function InternshipsPage() {
  const [internships, setInternships] = useState([]);
  const [title, setTitle] = useState('All Internships');
  const [error, setError] = useState('');

  const fetchInternships = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/internships');
      setInternships(response.data);
      setTitle('All Internships');
      setError('');
    } catch (err) {
      setError('Failed to fetch internships. Please ensure the backend is running.');
    }
  };

  useEffect(() => {
    fetchInternships();
  }, []);

  const handleRecommendations = (recommendations, skills) => {
    if (recommendations.length > 0) {
      setInternships(recommendations);
      setTitle(`Top Matches for You (based on ${skills.length} skills)`);
    } else {
      setError('No matching internships found for the skills in your resume.');
      fetchInternships(); // Show all jobs again if no matches
    }
  };

  return (
    <section className="section">
      <div className="container">
        <ResumeUploader onRecommendations={handleRecommendations} />

        <div style={{ marginTop: '2rem' }}>
          <h3>{title}</h3>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <div id="cards" className="grid">
            {internships.map(job => <JobCard key={job.id} job={job} />)}
          </div>
        </div>
      </div>
    </section>
  );
}

export default InternshipsPage;