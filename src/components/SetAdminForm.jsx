import React, { useState } from 'react';
import axios from 'axios';
import "../styles/login.css"; // Ensure this has the latest styles we discussed

function SetAdminForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/admin/register', { email, password });
      alert('Admin created! Please login.');
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert('Failed to create admin. Please check the details or try again later.');
    }
  };

  return (
    <div className="page-wrapper">
      <form className="card" onSubmit={handleCreateAdmin}>
        <h2>Set Admin</h2>
        <input
          type="email"
          placeholder="Admin Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button type="submit">Create Admin</button>
      </form>
    </div>
  );
}

export default SetAdminForm;
