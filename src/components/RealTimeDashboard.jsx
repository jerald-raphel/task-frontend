import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend, ResponsiveContainer } from 'recharts';
import io from 'socket.io-client';
import '../styles/realTimeDashoard.css';

const socket = io('http://localhost:5000');

const RealTimeDashboard = () => {
  const [shipments, setShipments] = useState([]);
  const [contractStats, setContractStats] = useState(null);
  const [statusChartData, setStatusChartData] = useState([]);

  useEffect(() => {
    socket.on('shipmentUpdate', (data) => {
      setShipments((prev) => [data, ...prev.slice(0, 9)]);
    });

    return () => socket.disconnect();
  }, []);

  // ✅ Fetch contracts and calculate counts by status
  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        // Fetch contract status distribution
        const contractRes = await axios.get('http://localhost:5000/api/contracts');
        const allContracts = contractRes.data;
  
        const statusCounts = {
          pending: 0,
          locked: 0,
          completed: 0,
        };
  
        allContracts.forEach(contract => {
          if (statusCounts.hasOwnProperty(contract.status)) {
            statusCounts[contract.status]++;
          }
        });
  
        setStatusChartData([
          { status: 'pending', count: statusCounts.pending },
          { status: 'locked', count: statusCounts.locked },
          { status: 'completed', count: statusCounts.completed },
        ]);
  
        // ✅ Fetch overall shipped vs total device count
        const ratioRes = await axios.get('http://localhost:5000/api/stats/device-to-shipment');
        const { totalDeviceCount, totalShipmentCount } = ratioRes.data;
  
        const percent = (totalShipmentCount / totalDeviceCount) * 100;
  
        setContractStats({
          shipped: totalShipmentCount,
          total: totalDeviceCount,
          percent: percent.toFixed(1),
        });
      } catch (err) {
        console.error('Dashboard stats fetch error:', err);
      }
    };
  
    fetchDashboardStats();
  }, [shipments]);
  

  return (
    <div className="dashboard-container">
      <h2>📦 Real-Time Shipment Monitoring</h2>

      {contractStats && (
        <div className="progress-section">
          <p>Shipped: {contractStats.shipped}/{contractStats.total} ({contractStats.percent}%)</p>
          <div
            className={`progress-bar ${contractStats.percent > 80 ? 'danger' : ''}`}
            style={{ width: `${contractStats.percent}%` }}
          ></div>
        </div>
      )}

      <div className="chart-wrapper">
        <h3>📊 Contract Status Distribution</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={statusChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="status" />
            <YAxis tickCount={6} domain={[0, 'dataMax + 5']} tickFormatter={(value) => `${value}`} />

            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <table>
        {/* <thead>
          <tr>
            <th>Contract ID</th>
            <th>Shipment No</th>
            <th>Count</th>
            <th>User Email</th>
            <th>Status</th>
          </tr>
        </thead> */}
        <tbody>
          {shipments.map((s, i) => (
            <tr key={i}>
              <td>{s.contractId}</td>
              <td>{s.shipmentNo}</td>
              <td>{s.count}</td>
              <td>{s.userEmail}</td>
              <td>{s.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RealTimeDashboard;
