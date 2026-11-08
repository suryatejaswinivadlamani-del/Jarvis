import React from 'react';
import { 
  SparklesIcon, 
  TerminalIcon, 
  ShieldCheckIcon, 
  ZapIcon, 
  CodeIcon, 
  LayersIcon 
} from './Icons';

export default function Features() {
  const featureList = [
    {
      icon: <SparklesIcon />,
      tag: 'Neural Synthesis',
      title: 'Context-Aware Code Generation',
      desc: 'Understands your entire repository topology, typing patterns, and dependencies to produce clean, bug-free components.',
      badgeColor: 'cyan',
    },
    {
      icon: <TerminalIcon />,
      tag: 'CLI & Daemon',
      title: 'Headless Agent Execution',
      desc: 'Runs silently in your terminal background, continuously validating builds, monitoring logs, and resolving broken imports.',
      badgeColor: 'violet',
    },
    {
      icon: <ShieldCheckIcon />,
      tag: 'Security First',
      title: 'Sandboxed Isolation',
      desc: 'All autonomous workflows execute in isolated containers with strict permission checks, preventing data leakage.',
      badgeColor: 'emerald',
    },
    {
      icon: <ZapIcon />,
      tag: 'Performance',
      title: 'Instant Hot Module Reload',
      desc: 'Built ground-up with Vite and esbuild for sub-millisecond feedback loops. Code changes reflect in your browser instantly.',
      badgeColor: 'cyan',
    },
    {
      icon: <LayersIcon />,
      tag: 'Multi-Agent',
      title: 'Specialized Subagent Fleet',
      desc: 'Spawns dedicated subagents for researcher tasks, automated documentation, unit tests, and performance benchmarking.',
      badgeColor: 'violet',
    },
    {
      icon: <CodeIcon />,
      tag: 'Modern Stack',
      title: 'React 19 & Tailwind Ready',
      desc: 'Designed with clean component modularity, modern ES modules, and accessible semantic HTML for top-tier developer UX.',
      badgeColor: 'emerald',
    },
  ];

  return (
    <section id="features" className="features-section">
      <div className="section-container">
        {/* Section Header */}
        <div className="section-header">
          <span className="section-pill">Core Architecture</span>
          <h2 className="section-title">
            Engineered for Developers Who Demand <span className="gradient-text">Excellence</span>
          </h2>
          <p className="section-subtitle">
            Every capability inside J.A.R.V.I.S is crafted to remove friction and accelerate your software delivery.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="features-grid">
          {featureList.map((item, idx) => (
            <div key={idx} className="feature-card">
              <div className="feature-card-glow"></div>
              <div className="feature-top">
                <div className={`feature-icon-box ${item.badgeColor}`}>
                  {item.icon}
                </div>
                <span className={`feature-tag-badge ${item.badgeColor}`}>
                  {item.tag}
                </span>
              </div>
              <h3 className="feature-title">{item.title}</h3>
              <p className="feature-desc">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
