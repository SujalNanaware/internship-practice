import React from 'react';
import GitHubProfile from './components/GitHubProfile';

function App() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6', padding: '40px 20px' }}>
      <h1 style={{ textAlign: 'center', fontSize: '28px', fontWeight: 'bold', marginBottom: '20px', color: '#1f2937' }}>
        Developer Dashboard
      </h1>
      
      {/* GitHub Profile Component */}
      <GitHubProfile />
    </div>
  );
}

export default App;