import React from 'react';
import { useNavigate } from 'react-router-dom';

function RegisterPage() {
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    // In a real app, you'd handle registration here.
    // For this prototype, we'll just navigate to the main page.
    navigate('/');
  };

  return (
    <section className="section">
      <div className="pcontainer">
        <h1>Create Your Profile</h1>
        <form className="pprofile-form" onSubmit={handleRegister}>
          <div className="pform-group">
            <label htmlFor="fullname">Full Name</label>
            <input type="text" id="fullname" placeholder="Enter your full name" required />
          </div>
          <div className="pform-group">
            <label htmlFor="email">Email ID</label>
            <input type="email" id="email" placeholder="Enter your email" required />
          </div>
          <div className="pform-group">
            <label htmlFor="phone">Mobile Number</label>
            <input type="tel" id="phone" placeholder="Enter your phone number" required />
          </div>
          <div className="pform-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" placeholder="Create a password" required />
          </div>
          <button type="submit">Create Account</button>
        </form>
      </div>
    </section>
  );
}

export default RegisterPage;