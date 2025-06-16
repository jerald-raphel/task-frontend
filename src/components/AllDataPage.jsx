import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/allDataPage.css';

const AllDataPage = () => {
  const [contracts, setContracts] = useState([]);
  const [shipments, setShipments] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const contractRes = await axios.get('https://task-server-1-vfdn.onrender.com/api/contracts');
        const shipmentRes = await axios.get('https://task-server-1-vfdn.onrender.com/api/shipments');
        setContracts(contractRes.data);
        setShipments(shipmentRes.data);
      } catch (err) {
        console.error('Error loading contract or shipment data:', err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="data-page-container">
      <h2>📃 All Contracts</h2>
      <table>
        <thead>
          <tr>
            <th>Contract ID</th>
            <th>Device Count</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {contracts.map((contract, index) => (
            <tr key={index}>
              <td>{contract.contractId}</td>
              <td>{contract.deviceCount}</td>
              <td>{contract.status}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>🚚 All Shipments</h2>
      <table>
        <thead>
          <tr>
            <th>Contract ID</th>
            <th>Shipment No</th>
            <th>Count</th>
            <th>User Email</th>
            <th>Status</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          {shipments.map((s, index) => (
            <tr key={index}>
              <td>{s.contractId}</td>
              <td>{s.shipmentNo}</td>
              <td>{s.count}</td>
              <td>{s.userEmail}</td>
              <td>{s.status}</td>
              <td>{new Date(s.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AllDataPage;
