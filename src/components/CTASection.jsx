import React from 'react';
import { ArrowRightIcon, SparklesIcon } from './Icons';

export default function CTASection() {
  return (
    <section className="cta-section">
      <div className="section-container">
        <div className="cta-card">
          <div className="cta-glow-circle"></div>
          
          <div className="cta-content">
            <div className="cta-badge">
              <SparklesIcon className="cta-badge-icon" />
              <span>Get Started in Under 60 Seconds</span>
            </div>

            <h2 className="cta-title">
              Ready to Activate Your <span className="gradient-text">Autonomous AI</span> Workspace?
            </h2>

            <p className="cta-subtitle">
              Join thousands of developers turning ambitious engineering roadmaps into production reality with J.A.R.V.I.S.
            </p>

            <div className="cta-buttons">
              <a href="#console" className="btn-primary cta-btn">
                <span>Launch Interactive Console</span>
                <ArrowRightIcon className="btn-icon" />
              </a>
              <a href="#features" className="btn-secondary cta-btn">
                <span>View Documentation</span>
              </a>
            </div>

            <div className="cta-perks">
              <span>✓ Instant Vite HMR</span>
              <span className="dot-separator">•</span>
              <span>✓ Pure React 19 Ecosystem</span>
              <span className="dot-separator">•</span>
              <span>✓ Fully Responsive</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
