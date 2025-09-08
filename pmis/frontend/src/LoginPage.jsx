import React from 'react';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // In a real app, you'd handle authentication here.
    // For this prototype, we'll just navigate to the main page.
    navigate('/');
  };

  return (
    <section className="section">
      <div className="auth-card">
        <h2 className="title">Login</h2>
        <form className="auth-form" onSubmit={handleLogin}>
          <label>
            Email ID
            <input type="email" name="email" required />
          </label>
          <label>
            Password
            <input type="password" name="password" required />
          </label>
          <button type="submit" className="btn accent full">Login</button>
        </form>
      </div>
    </section>
  );
}

export default LoginPage;