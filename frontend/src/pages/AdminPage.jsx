import React, { useState, useEffect } from 'react';

function AdminPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/analytics/stats', {
        headers: {
          'Authorization': 'Bearer mock-token' // In real app, get from localStorage
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading...</div>;
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <h1>Admin Dashboard</h1>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '20px',
        marginTop: '20px'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <h3>Total Chats</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#007bff' }}>
            {stats?.totalChats || 0}
          </p>
        </div>
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <h3>Active Users</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#28a745' }}>
            {stats?.activeUsers || 0}
          </p>
        </div>
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <h3>Business Types</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#ffc107' }}>
            {stats?.businessTypes || 0}
          </p>
        </div>
      </div>
    </div>
  );
}

export default AdminPage; 