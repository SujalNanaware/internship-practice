import React, { useState, useEffect } from 'react';

// Expanded list of 13 GitHub usernames to display directly as cards
const PRESET_USERNAMES = [
  'octocat', 
  'torvalds', 
  'gaearon', 
  'defunkt', 
  'yyx990803', // Evan You (Vue.js creator)
  'sindresorhus', // Sindre Sorhus (Open source prolific contributor)
  'tj', // TJ Holowaychuck (Express.js, Koa creator)
  'addyosmani', // Addy Osmani (Google Chrome team)
  'JakeWharton', // Jake Wharton (Android open source legend)
  'mdo', // Mark Otto (Bootstrap co-creator)
  'paulirish', // Paul Irish (Google Chrome / Web tools legend)
  'kentcdodds' // Kent C. Dodds (Renowned React educator and author)
];

export default function GitHubProfile() {
  const [profiles, setProfiles] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        setLoading(true);
        const requests = PRESET_USERNAMES.map(username =>
          fetch(`https://api.github.com/users/${username}`).then(res => {
            if (!res.ok) throw new Error(`Failed to fetch ${username}`);
            return res.json();
          })
        );
        const results = await Promise.all(requests);
        setProfiles(results);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, []);

  if (loading) return <p style={{ textAlign: 'center', marginTop: '20px' }}>Loading profiles...</p>;
  if (error) return <p style={{ textAlign: 'center', color: 'red', marginTop: '20px' }}>Error: {error}</p>;

  return (
    <div style={{ maxWidth: '850px', margin: '20px auto', padding: '20px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#1f2937' }}>Featured GitHub Profiles</h2>

      {selectedProfile ? (
        <div style={{ background: '#fff', padding: '25px', borderRadius: '10px', border: '1px solid #ccc', textAlign: 'center', maxWidth: '400px', margin: '0 auto', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <button 
            onClick={() => setSelectedProfile(null)}
            style={{ marginBottom: '15px', padding: '6px 14px', background: '#e5e7eb', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: '500' }}
          >
            ← Back to List
          </button>
          <img
            src={selectedProfile.avatar_url}
            alt="Avatar"
            style={{ width: '90px', height: '90px', borderRadius: '50%', marginBottom: '10px', border: '2px solid #2563eb' }}
          />
          <h3>{selectedProfile.name || selectedProfile.login}</h3>
          <p style={{ color: '#666', fontSize: '14px' }}>@{selectedProfile.login}</p>
          <p style={{ fontSize: '14px', margin: '10px 0', color: '#4b5563' }}>{selectedProfile.bio || "No bio available."}</p>

          <div style={{ display: 'flex', justifyContent: 'space-around', background: '#f9f9f9', padding: '10px', borderRadius: '5px', marginBottom: '15px' }}>
            <div><strong style={{ color: '#2563eb' }}>{selectedProfile.public_repos}</strong><br/>Repos</div>
            <div><strong style={{ color: '#2563eb' }}>{selectedProfile.followers}</strong><br/>Followers</div>
            <div><strong style={{ color: '#2563eb' }}>{selectedProfile.following}</strong><br/>Following</div>
          </div>

          <a
            href={selectedProfile.html_url}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'block', background: '#111', color: '#fff', padding: '8px', borderRadius: '5px', textDecoration: 'none' }}
          >
            View on GitHub ↗
          </a>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '15px' }}>
          {profiles.map((profile) => (
            <div
              key={profile.id}
              onClick={() => setSelectedProfile(profile)}
              style={{
                background: '#fff',
                padding: '20px',
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                textAlign: 'center',
                cursor: 'pointer',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                transition: 'transform 0.2s, box-shadow 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
              }}
            >
              <img
                src={profile.avatar_url}
                alt="Avatar"
                style={{ width: '60px', height: '60px', borderRadius: '50%', marginBottom: '10px' }}
              />
              <h4 style={{ margin: '5px 0', fontSize: '14px', color: '#1f2937', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {profile.name || profile.login}
              </h4>
              <p style={{ color: '#666', fontSize: '12px', margin: '0' }}>@{profile.login}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}