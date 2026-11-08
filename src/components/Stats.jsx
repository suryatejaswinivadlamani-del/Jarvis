import React from 'react';

export default function Stats() {
  const stats = [
    { value: '99.99%', label: 'Cluster Uptime', caption: 'Continuous autonomous runtime' },
    { value: '< 10ms', label: 'Inference Speed', caption: 'Instant code generation' },
    { value: '500K+', label: 'Commits Automated', caption: 'Across thousands of developers' },
    { value: '0-Config', label: 'Instant Launch', caption: 'Works out of the box with Vite' },
  ];

  return (
    <section className="stats-section">
      <div className="stats-container">
        <div className="stats-grid">
          {stats.map((item, index) => (
            <div key={index} className="stat-card">
              <div className="stat-value gradient-text">{item.value}</div>
              <div className="stat-label">{item.label}</div>
              <div className="stat-caption">{item.caption}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
