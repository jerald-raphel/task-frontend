import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../styles/login.css";

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:5000/api/admin/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userEmail', email);
      navigate('/admin');
      return;
    } catch (adminErr) {
      console.warn('Admin login failed, trying user login...');
    }

    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userEmail', email);
      navigate('/user');
    } catch (err) {
      alert('Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="page-wrapper">
      <form className="card" onSubmit={handleLogin}>
        <h2>Login</h2>
        <div className="form-group">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <button type="submit">Login</button>
        </div>
      </form>
    </div>
  );
}

export default LoginForm;
