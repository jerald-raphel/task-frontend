import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import LoginForm from './components/LoginForm';
import SetAdminForm from './components/SetAdminForm';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import RealTimeDashboard from './components/RealTimeDashboard';
import AllDataPage from './components/AllDataPage';
//import './App.css';
function App() {
  const [adminExists, setAdminExists] = useState(null);

  useEffect(() => {
    axios.get('https://task-server-1-vfdn.onrender.com/admin/exists')
      .then(res => setAdminExists(res.data.exists))
      .catch(() => setAdminExists(false));
  }, []);

  if (adminExists === null) return <h3>Loading...</h3>;

  return (
    <Router>
      <Routes>
        {adminExists ? (
          <>
            <Route path="/" element={<LoginForm />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/user" element={<UserDashboard />} />
            <Route path="*" element={<Navigate to="/" />} />
            <Route path="/graph" element={<RealTimeDashboard />} />
            <Route path="/data" element={<AllDataPage />} />
          </>
        ) : (
          <Route path="/" element={<SetAdminForm />} />
        )}
      </Routes>
    </Router>
  );
}

export default App;
