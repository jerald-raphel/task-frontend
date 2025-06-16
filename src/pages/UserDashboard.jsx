import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/userdashboard.css';

const UserDashboard = () => {
  const [contracts, setContracts] = useState([]);
  const [selectedContractId, setSelectedContractId] = useState('');
  const [deviceCount, setDeviceCount] = useState(0);
  const [segments, setSegments] = useState([]);
  const [segmentInput, setSegmentInput] = useState('');
  const [countInput, setCountInput] = useState('');
  const userEmail = localStorage.getItem('userEmail');

  useEffect(() => {
    axios.get('http://localhost:5000/api/contracts')
      .then(res => {
        const pending = res.data.filter(c => c.status === 'pending');
        setContracts(pending);
      });
  }, []);

  useEffect(() => {
    const contract = contracts.find(c => c.contractId === selectedContractId);
    if (contract) setDeviceCount(contract.deviceCount);
  }, [selectedContractId, contracts]);

  const handleAddSegment = () => {
    if (!segmentInput || !countInput) return alert('Please fill all fields');
    setSegments(prev => [...prev, { segment: segmentInput, count: Number(countInput) }]);
    setSegmentInput('');
    setCountInput('');
  };

  const total = segments.reduce((acc, cur) => acc + cur.count, 0);

  const handleSubmit = async () => {
    if (!selectedContractId || total === 0) return alert('Invalid submission');

    try {
      const shipmentRes = await axios.post('http://localhost:5000/api/shipments', {
        contractId: selectedContractId,
        shipmentNo: `S${segments.length}-${Date.now()}`,
        count: total,
        userEmail
      });

      alert(shipmentRes.data.message || 'Shipment submitted successfully.');

      const contract = contracts.find(c => c.contractId === selectedContractId);
      if (!contract) throw new Error("Contract not found for email alert");

      const emailPayload = {
        contractId: contract.contractId,
        deviceCount: contract.deviceCount,
        batteriesShipped: total,
        threshold: contract.deviceCount,
        isLocked: true,
        lastUpdated: new Date(),
        shipmentId: `S-${Date.now()}`,
        adminEmail: contract.adminEmail || 'admin@example.com'
      };

      try {
        await axios.post('http://localhost:5000/api/contract-alert', emailPayload);
        alert("Admin has been notified via email.");
      } catch (emailErr) {
        console.error("Email sending failed:", emailErr);
        alert("Shipment saved, but failed to send email to admin.");
      }

    } catch (err) {
      const msg = err.response?.data?.message || 'Shipment submission failed.';
      alert(msg);
    }
  };

  return (
    <div className="dashboard-container">
      <h2>User Dashboard</h2>
      <form className="form-box">
        <label>Select Contract</label>
        <select value={selectedContractId} onChange={e => setSelectedContractId(e.target.value)}>
          <option value="">-- Select Contract --</option>
          {contracts.map((c, i) => (
            <option key={i} value={c.contractId}>{c.contractId}</option>
          ))}
        </select>

        {selectedContractId && (
          <>
            <p><strong>Device Count:</strong> {deviceCount}</p>

            <div className="segment-inputs">
              <div>
                <label>Segment No</label>
                <input
                  type="text"
                  value={segmentInput}
                  onChange={e => setSegmentInput(e.target.value)}
                  placeholder="e.g. A1"
                />
              </div>
              <div>
                <label>Count</label>
                <input
                  type="number"
                  value={countInput}
                  onChange={e => setCountInput(e.target.value)}
                  placeholder="e.g. 10"
                />
              </div>
              <button type="button" onClick={handleAddSegment}>+ Add Segment</button>
            </div>

            <h4>Added Segments</h4>
            <ul className="segment-list">
              {segments.map((seg, i) => (
                <li key={i}>{seg.segment} - {seg.count}</li>
              ))}
            </ul>

            <p><strong>Total Count:</strong> {total}</p>
            <p><strong>User:</strong> {userEmail}</p>

            <button type="button" className="submit-btn" onClick={handleSubmit}>Submit Shipment</button>
          </>
        )}
      </form>
    </div>
  );
};

export default UserDashboard;
