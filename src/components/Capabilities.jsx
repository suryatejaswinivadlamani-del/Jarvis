import React from 'react';
import { LayersIcon, CpuIcon, CheckIcon } from './Icons';

export default function Capabilities() {
  const steps = [
    {
      num: '01',
      title: 'Repository Ingestion & Context Indexing',
      desc: 'J.A.R.V.I.S reads your codebase structure, understands framework conventions, and builds an in-memory graph of component interactions.',
      features: ['Full AST Code Parsing', 'Type-safety validation', 'Dependency vulnerability scanning'],
    },
    {
      num: '02',
      title: 'Autonomous Planning & Subagent Delegation',
      desc: 'Complex tasks are decomposed into focused subtasks. Parallel worker agents handle linting, styling, and business logic simultaneously.',
      features: ['Parallel agent execution', 'Sandboxed verification', 'Rollback protection'],
    },
    {
      num: '03',
      title: 'Sub-Millisecond Hot Module Execution',
      desc: 'Code updates are written cleanly with documentation intact and refreshed immediately via Vite HMR for zero development interruption.',
      features: ['Instant browser HMR', 'Production-ready build verification', 'Automated bundle reporting'],
    },
  ];

  return (
    <section id="capabilities" className="capabilities-section">
      <div className="section-container">
        <div className="section-header">
          <span className="section-pill">Workflow Engine</span>
          <h2 className="section-title">
            How <span className="gradient-text">J.A.R.V.I.S</span> Operates
          </h2>
          <p className="section-subtitle">
            A three-tier autonomous pipeline designed for seamless software evolution.
          </p>
        </div>

        <div className="capabilities-grid">
          {steps.map((step, index) => (
            <div key={index} className="step-card">
              <div className="step-number-tag">{step.num}</div>
              <h3 className="step-card-title">{step.title}</h3>
              <p className="step-card-desc">{step.desc}</p>
              <ul className="step-features-list">
                {step.features.map((feat, fIdx) => (
                  <li key={fIdx}>
                    <CheckIcon className="step-check-icon text-cyan" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
