import React from 'react';
import { SparklesIcon } from './Icons';

export default function Footer() {
  return (
    <footer className="footer-root">
      <div className="section-container">
        <div className="footer-top">
          {/* Brand Info */}
          <div className="footer-brand-col">
            <div className="footer-brand-header">
              <div className="brand-icon-wrapper small">
                <SparklesIcon className="brand-svg" />
              </div>
              <span className="brand-name">
                J.A.R.V.I.S<span className="brand-accent">.AI</span>
              </span>
            </div>
            <p className="footer-brand-desc">
              Next-generation autonomous AI workspace assistant engineered for developers and teams.
            </p>
            <div className="system-health-pill">
              <span className="health-dot"></span>
              <span>All Systems Operational (Port 5173)</span>
            </div>
          </div>

          {/* Navigation Columns */}
          <div className="footer-links-grid">
            <div className="footer-link-col">
              <h4>Product</h4>
              <ul>
                <li><a href="#features">Features</a></li>
                <li><a href="#console">Interactive Console</a></li>
                <li><a href="#capabilities">Architecture</a></li>
                <li><a href="#telemetry">Telemetry Engine</a></li>
              </ul>
            </div>

            <div className="footer-link-col">
              <h4>Resources</h4>
              <ul>
                <li><a href="https://react.dev" target="_blank" rel="noreferrer">React Documentation</a></li>
                <li><a href="https://vite.dev" target="_blank" rel="noreferrer">Vite Documentation</a></li>
                <li><a href="https://developer.mozilla.org" target="_blank" rel="noreferrer">MDN Web Docs</a></li>
                <li><a href="#console">CLI Reference</a></li>
              </ul>
            </div>

            <div className="footer-link-col">
              <h4>Community</h4>
              <ul>
                <li><a href="https://github.com" target="_blank" rel="noreferrer">GitHub Repository</a></li>
                <li><a href="https://discord.com" target="_blank" rel="noreferrer">Developer Discord</a></li>
                <li><a href="https://twitter.com" target="_blank" rel="noreferrer">Release Updates</a></li>
                <li><a href="#">Security Bulletins</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} J.A.R.V.I.S Workspace. All rights reserved.</p>
          <div className="footer-bottom-badge">
            Powered by <strong>React</strong> + <strong>Vite</strong>
          </div>
        </div>
      </div>
    </footer>
  );
}
