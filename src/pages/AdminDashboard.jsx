import React, { useEffect, useState } from 'react';
import axios from 'axios';
import RealTimeDashboard from '../components/RealTimeDashboard';
import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [contractId, setContractId] = useState('');
  const [deviceCount, setDeviceCount] = useState('');
  const [status, setStatus] = useState('pending');
  const [activeTab, setActiveTab] = useState('');

  const [contracts, setContracts] = useState([]);
  const [shipments, setShipments] = useState([]);
  const [showContracts, setShowContracts] = useState(false);
  const [showShipments, setShowShipments] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/auth/users');
      setUsers(res.data);
    } catch {
      alert('Failed to fetch users');
    }
  };

  const handleAddUser = async () => {
    try {
      await axios.post('http://localhost:5000/api/auth/register', {
        name, email, password
      });
      alert('User added');
      fetchUsers();
    } catch {
      alert('Failed to add user');
    }
  };

  const handleAddContract = async () => {
    try {
      await axios.post('http://localhost:5000/api/contracts', {
        contractId,
        deviceCount,
        status
      });
      alert('Contract added');
    } catch {
      alert('Failed to add contract');
    }
  };

  const fetchAllData = async () => {
    try {
      const contractsRes = await axios.get('http://localhost:5000/api/contracts');
      setContracts(contractsRes.data);

      const shipmentsRes = await axios.get('http://localhost:5000/api/shipments');
      setShipments(shipmentsRes.data);
    } catch {
      alert('Failed to load data');
    }
  };

  const filteredContracts = selectedStatus
    ? contracts.filter(c => c.status === selectedStatus)
    : [];

  return (
    <div className="admin-wrapper">
      <div className="sidebar">
        <button onClick={() => setActiveTab('addUser')}>Add User</button>
        <button onClick={() => { setActiveTab('getUsers'); fetchUsers(); }}>Get Users</button>
        <button onClick={() => setActiveTab('addContract')}>Add Contract</button>
        <button onClick={() => setActiveTab('realtime')}>Realtime Dashboard</button>
        <button onClick={() => setActiveTab('allData')}>View All Data</button>
        <button onClick={() => { setActiveTab('byStatus'); fetchAllData(); }}>Filter by Status</button>
      </div>

      <div className="container">
        {activeTab === 'addUser' && (
          <div>
            <h3>Add User</h3>
            <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} /><br />
            <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} /><br />
            <input placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} /><br />
            <button onClick={handleAddUser}>Add User</button>
          </div>
        )}

        {activeTab === 'getUsers' && (
          <div>
            <h3>All Users</h3>
            {users.length > 0 ? (
              <ul>
                {users.map((user, i) => (
                  <li key={i}><strong>{user.name}</strong> - {user.email}</li>
                ))}
              </ul>
            ) : <p>No users found</p>}
          </div>
        )}

        {activeTab === 'addContract' && (
          <div>
            <h3>Add Contract</h3>
            <input placeholder="Contract ID" value={contractId} onChange={e => setContractId(e.target.value)} /><br />
            <input type="number" placeholder="Device Count" value={deviceCount} onChange={e => setDeviceCount(e.target.value)} /><br />
            <select onChange={e => setStatus(e.target.value)} defaultValue="pending">
              <option value="pending">Pending</option>
              <option value="locked">Locked</option>
              <option value="completed">Completed</option>
            </select><br />
            <button onClick={handleAddContract}>Add Contract</button>
          </div>
        )}

        {activeTab === 'realtime' && (
          <RealTimeDashboard />
        )}

        {activeTab === 'allData' && (
          <div>
            <h2>📊 View All Data</h2>

            <button onClick={async () => {
              await fetchAllData();
              setShowContracts(true);
              setShowShipments(false);
            }}>
              View All Contracts
            </button>

            <button onClick={async () => {
              await fetchAllData();
              setShowContracts(false);
              setShowShipments(true);
            }}>
              View All Shipments
            </button>

            {showContracts && (
              <>
                <h3>📄 All Contracts</h3>
                {contracts.length > 0 ? (
                  <table border="1" cellPadding="5">
                    <thead>
                      <tr>
                        <th>Contract ID</th>
                        <th>Device Count</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {contracts.map((c, i) => (
                        <tr key={i}>
                          <td>{c.contractId}</td>
                          <td>{c.deviceCount}</td>
                          <td>{c.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : <p>No contracts found.</p>}
              </>
            )}

            {showShipments && (
              <>
                <h3>🚚 All Shipments</h3>
                {shipments.length > 0 ? (
                  <div className="table-wrapper">
                    <table>
                      <thead>
                        <tr>
                          <th>Contract ID</th>
                          <th>Shipment No</th>
                          <th>Count</th>
                          <th>User Email</th>
                          <th>Created At</th>
                        </tr>
                      </thead>
                      <tbody>
                        {shipments.map((s, i) => (
                          <tr key={i}>
                            <td>{s.contractId}</td>
                            <td>{s.shipmentNo}</td>
                            <td>{s.count}</td>
                            <td>{s.userEmail}</td>
                            <td>{new Date(s.createdAt).toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : <p>No shipments found.</p>}
              </>
            )}
          </div>
        )}

        {activeTab === 'byStatus' && (
          <div>
            <h2>🔍 Filter Contracts by Status</h2>
            <select value={selectedStatus} onChange={e => setSelectedStatus(e.target.value)}>
              <option value="">Select Status</option>
              <option value="pending">Pending</option>
              <option value="locked">Locked</option>
              <option value="completed">Completed</option>
            </select>

            {selectedStatus && (
              <>
                <h3>Contracts - {selectedStatus.toUpperCase()}</h3>
                {filteredContracts.length > 0 ? (
                  <table className="status-table">
                    <thead>
                      <tr>
                        <th>Contract ID</th>
                        <th>Device Count</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredContracts.map((c, i) => (
                        <tr key={i}>
                          <td>{c.contractId}</td>
                          <td>{c.deviceCount}</td>
                          <td>{c.status}</td>
                          <td>
                            {c.status === 'locked' && (
                              <button
                                className="unlock-btn"
                                onClick={async () => {
                                  try {
                                    await axios.put(`http://localhost:5000/api/contracts/${c.contractId}/unlock`);
                                    alert('Contract unlocked successfully!');
                                    fetchAllData();
                                  } catch {
                                    alert('Failed to unlock contract');
                                  }
                                }}
                              >
                                Unlock
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : <p>No contracts found for selected status.</p>}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;