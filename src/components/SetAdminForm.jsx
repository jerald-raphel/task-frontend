import React, { useState } from 'react';
import axios from 'axios';
import "../styles/login.css"

function SetAdminForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleCreateAdmin = async () => {
    try {
      await axios.post('http://localhost:5000/api/admin/register', { email, password });
      alert('Admin created! Please login.');
      window.location.reload();
    } catch (err) {
      alert('Failed to create admin');
    }
  };

  return (
    <div className="container">
      <h2>Set Admin</h2>
      <input type="email" placeholder="Admin Email" value={email} onChange={e => setEmail(e.target.value)} /><br />
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} /><br />
      <button onClick={handleCreateAdmin}>Create Admin</button>
    </div>
  );
}

export default SetAdminForm;
