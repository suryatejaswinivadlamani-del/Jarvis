import React, { useState, useEffect } from 'react';

export default function HudPanels() {
  const [coreTemp, setCoreTemp] = useState(42.6);
  const [powerOutput, setPowerOutput] = useState(99.8);
  const [neuralSync, setNeuralSync] = useState(99.4);

  // Subtle real-time HUD telemetry fluctuations
  useEffect(() => {
    const interval = setInterval(() => {
      setCoreTemp(+(42.0 + Math.random() * 1.2).toFixed(1));
      setPowerOutput(+(99.5 + Math.random() * 0.4).toFixed(1));
      setNeuralSync(+(99.2 + Math.random() * 0.6).toFixed(1));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Top and Bottom Corner Brackets */}
      <div className="hud-corner-bracket top-left"></div>
      <div className="hud-corner-bracket top-right"></div>
      <div className="hud-corner-bracket bottom-left"></div>
      <div className="hud-corner-bracket bottom-right"></div>

      {/* Left HUD Telemetry Wing */}
      <aside className="hud-wing left-wing">
        <div className="hud-panel-box">
          <div className="panel-header">
            <span className="panel-tag">// TELEMETRY</span>
            <span className="panel-title">SYSTEM DIAGNOSTICS</span>
          </div>

          <div className="telemetry-item">
            <div className="item-meta">
              <span>ARC REACTOR OUTPUT</span>
              <span className="text-cyan">{powerOutput}%</span>
            </div>
            <div className="hud-progress-track">
              <div className="hud-progress-bar" style={{ width: `${powerOutput}%` }}></div>
            </div>
          </div>

          <div className="telemetry-item">
            <div className="item-meta">
              <span>CORE TEMPERATURE</span>
              <span className="text-cyan">{coreTemp}° C</span>
            </div>
            <div className="hud-progress-track">
              <div className="hud-progress-bar temp" style={{ width: '42%' }}></div>
            </div>
          </div>

          <div className="telemetry-item">
            <div className="item-meta">
              <span>NEURAL SYNAPSE LOCK</span>
              <span className="text-cyan">{neuralSync}%</span>
            </div>
            <div className="hud-progress-track">
              <div className="hud-progress-bar neural" style={{ width: `${neuralSync}%` }}></div>
            </div>
          </div>

          {/* Mini Radar Hologram Target */}
          <div className="mini-radar-box">
            <div className="radar-grid">
              <div className="radar-reticle crosshair-h"></div>
              <div className="radar-reticle crosshair-v"></div>
              <div className="radar-blip b1"></div>
              <div className="radar-blip b2"></div>
            </div>
            <div className="radar-label">PERIMETER DEFENSE: SECURE</div>
          </div>
        </div>
      </aside>

      {/* Right HUD Telemetry Wing */}
      <aside className="hud-wing right-wing">
        <div className="hud-panel-box">
          <div className="panel-header">
            <span className="panel-tag">// PROTOCOL</span>
            <span className="panel-title">SUBSYSTEM METRICS</span>
          </div>

          <div className="subsystem-grid">
            <div className="metric-cell">
              <span className="cell-label">DEFENSE MATRIX</span>
              <span className="cell-val text-green">ARMED</span>
            </div>
            <div className="metric-cell">
              <span className="cell-label">CLEARANCE</span>
              <span className="cell-val text-cyan">LEVEL 10</span>
            </div>
            <div className="metric-cell">
              <span className="cell-label">FLUX LINK</span>
              <span className="cell-val text-cyan">14.2 GB/S</span>
            </div>
            <div className="metric-cell">
              <span className="cell-label">SUBAGENTS</span>
              <span className="cell-val text-cyan">12 ACTIVE</span>
            </div>
          </div>

          <div className="hud-code-snippet">
            <div className="code-line">
              <span className="kw">INIT</span> 0x8849F_NEURAL_ROUTING
            </div>
            <div className="code-line">
              <span className="kw">STATUS</span> HANDSHAKE_CONFIRMED
            </div>
            <div className="code-line">
              <span className="kw">LATENCY</span> 0.04ms (SUB-QUANTUM)
            </div>
          </div>

          <div className="mark-version-box">
            <div className="version-title">MARK VII HUD INTERFACE</div>
            <div className="version-sub">STARK QUANTUM OPERATING SYSTEM</div>
          </div>
        </div>
      </aside>
    </>
  );
}
