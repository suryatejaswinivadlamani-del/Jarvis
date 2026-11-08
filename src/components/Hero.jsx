import React, { useState, useEffect } from 'react';
import { ArrowRightIcon, TerminalIcon, ShieldCheckIcon, ZapIcon, CpuIcon } from './Icons';

export default function Hero() {
  const [activeTab, setActiveTab] = useState('telemetry');
  const [latency, setLatency] = useState(8.4);

  // Subtle real-time jitter to make the dashboard feel alive
  useEffect(() => {
    const interval = setInterval(() => {
      setLatency(prev => +(8.2 + Math.random() * 0.8).toFixed(1));
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="hero-section">
      <div className="hero-glow-backdrop"></div>
      
      <div className="hero-container">
        {/* Top Status Pill */}
        <div className="hero-pill">
          <span className="hero-pill-ping">
            <span className="ping-dot"></span>
            <span className="ping-ring"></span>
          </span>
          <span className="hero-pill-text">Autonomous AI Workspace v2.5 Online</span>
          <span className="hero-pill-tag">Ultra Low Latency</span>
        </div>

        {/* Headline */}
        <h1 className="hero-title">
          Architect the Future with{' '}
          <span className="gradient-text">J.A.R.V.I.S</span> Intelligence.
        </h1>

        {/* Subtitle */}
        <p className="hero-subtitle">
          Supercharge your software development life cycle. From automated test generation 
          and multi-file refactoring to zero-downtime deployment orchestration.
        </p>

        {/* Action Buttons */}
        <div className="hero-actions">
          <a href="#console" className="btn-primary hero-btn-large">
            <span>Explore Live Console</span>
            <ArrowRightIcon className="btn-icon" />
          </a>
          <a href="#features" className="btn-secondary hero-btn-large">
            <TerminalIcon className="btn-icon" />
            <span>Discover Features</span>
          </a>
        </div>

        {/* Trust Badges */}
        <div className="hero-trust-row">
          <div className="trust-item">
            <ShieldCheckIcon className="trust-icon text-cyan" />
            <span>Zero Sandbox Leakage</span>
          </div>
          <div className="trust-item">
            <ZapIcon className="trust-icon text-violet" />
            <span>Sub-10ms Inference</span>
          </div>
          <div className="trust-item">
            <CpuIcon className="trust-icon text-emerald" />
            <span>Hardware Accelerated</span>
          </div>
        </div>

        {/* Floating Futuristic Interactive Card */}
        <div className="hero-card-wrapper">
          <div className="hero-terminal-card">
            {/* Terminal Window Header */}
            <div className="terminal-header">
              <div className="terminal-dots">
                <span className="dot red"></span>
                <span className="dot yellow"></span>
                <span className="dot green"></span>
              </div>
              <div className="terminal-title">jarvis-runtime-core // system-monitor</div>
              <div className="terminal-status-badge">
                <span className="status-indicator-live"></span>
                <span>Active</span>
              </div>
            </div>

            {/* Terminal Tabs */}
            <div className="terminal-tabs">
              <button
                className={`terminal-tab ${activeTab === 'telemetry' ? 'active' : ''}`}
                onClick={() => setActiveTab('telemetry')}
              >
                Telemetry Stream
              </button>
              <button
                className={`terminal-tab ${activeTab === 'pipeline' ? 'active' : ''}`}
                onClick={() => setActiveTab('pipeline')}
              >
                Pipeline Build
              </button>
              <button
                className={`terminal-tab ${activeTab === 'agents' ? 'active' : ''}`}
                onClick={() => setActiveTab('agents')}
              >
                Active Subagents (4)
              </button>
            </div>

            {/* Terminal Content Body */}
            <div className="terminal-body">
              {activeTab === 'telemetry' && (
                <div className="telemetry-view">
                  <div className="metrics-grid">
                    <div className="metric-box">
                      <span className="metric-label">Neural Engine Latency</span>
                      <span className="metric-value text-cyan">{latency} ms</span>
                      <div className="metric-bar">
                        <div className="metric-bar-fill" style={{ width: '85%' }}></div>
                      </div>
                    </div>
                    <div className="metric-box">
                      <span className="metric-label">Memory Allocation</span>
                      <span className="metric-value text-violet">1.28 GB / 16 GB</span>
                      <div className="metric-bar">
                        <div className="metric-bar-fill fill-violet" style={{ width: '38%' }}></div>
                      </div>
                    </div>
                    <div className="metric-box">
                      <span className="metric-label">Subagent Concurrency</span>
                      <span className="metric-value text-emerald">12 Threads Idle/Ready</span>
                      <div className="metric-bar">
                        <div className="metric-bar-fill fill-emerald" style={{ width: '92%' }}></div>
                      </div>
                    </div>
                  </div>

                  <div className="log-stream">
                    <div className="log-line">
                      <span className="log-time">[08:24:01]</span>
                      <span className="log-prefix text-cyan">[INIT]</span>
                      <span className="log-text">J.A.R.V.I.S runtime daemon initialized successfully.</span>
                    </div>
                    <div className="log-line">
                      <span className="log-time">[08:24:02]</span>
                      <span className="log-prefix text-violet">[SYNC]</span>
                      <span className="log-text">Workspace tree indexed: 24 packages, 0 vulnerabilities detected.</span>
                    </div>
                    <div className="log-line">
                      <span className="log-time">[08:24:03]</span>
                      <span className="log-prefix text-emerald">[READY]</span>
                      <span className="log-text">Hot module replacement listener standing by on localhost:5173.</span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'pipeline' && (
                <div className="pipeline-view">
                  <div className="pipeline-steps">
                    <div className="step-item completed">
                      <span className="step-icon">✓</span>
                      <div className="step-content">
                        <strong>Static Analysis & Linting</strong>
                        <p>Oxlint & Prettier passed across 42 modules (12ms)</p>
                      </div>
                    </div>
                    <div className="step-item completed">
                      <span className="step-icon">✓</span>
                      <div className="step-content">
                        <strong>Vite Bundle Optimization</strong>
                        <p>Tree-shaking achieved 69.2 kB gzipped bundle footprint</p>
                      </div>
                    </div>
                    <div className="step-item in-progress">
                      <span className="step-icon spin">⟳</span>
                      <div className="step-content">
                        <strong>Neural Unit Verification</strong>
                        <p>Simulating 1,000 edge cases against mock server endpoints...</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'agents' && (
                <div className="agents-view">
                  <div className="agents-grid">
                    <div className="agent-card">
                      <div className="agent-title">
                        <span className="agent-dot green"></span>
                        <strong>Architect Subagent</strong>
                      </div>
                      <p className="agent-desc">Scanning structural conventions & schema validation</p>
                    </div>
                    <div className="agent-card">
                      <div className="agent-title">
                        <span className="agent-dot cyan"></span>
                        <strong>Refactor Subagent</strong>
                      </div>
                      <p className="agent-desc">Optimizing JSX re-render cycles and memoization</p>
                    </div>
                    <div className="agent-card">
                      <div className="agent-title">
                        <span className="agent-dot purple"></span>
                        <strong>DevOps Orchestrator</strong>
                      </div>
                      <p className="agent-desc">Managing background tasks, processes, and port listeners</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
