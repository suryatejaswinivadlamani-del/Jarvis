import React from 'react';
import { playSciFiSound } from '../../utils/audio';

export default function JarvisOrb({ isListening, isSpeaking, activeMessage, soundEnabled }) {
  const handleOrbClick = () => {
    if (soundEnabled) playSciFiSound('pulse');
  };

  return (
    <div className="orb-center-wrapper">
      {/* Speech Output Hologram Display */}
      <div className={`orb-dialogue-bubble ${activeMessage ? 'visible' : ''}`}>
        <div className="dialogue-header">
          <span className="dialogue-icon">◈</span>
          <span className="dialogue-title">JARVIS NEURAL VOCALIZATION</span>
        </div>
        <p className="dialogue-text">
          {activeMessage || "At your service, sir. All primary systems operational. Standing by for instructions."}
        </p>
      </div>

      {/* Main Orb & HUD Rings Container */}
      <div 
        className={`arc-reactor-stage ${isListening ? 'listening' : ''} ${isSpeaking ? 'speaking' : ''}`}
        onClick={handleOrbClick}
        title="Click to pulse Arc Reactor"
      >
        {/* Outermost Radar Ring */}
        <div className="reactor-ring ring-outer-radar">
          <div className="radar-sweep-beam"></div>
          <span className="hud-coord-mark top">000° // NORAD</span>
          <span className="hud-coord-mark right">090° // VECTOR</span>
          <span className="hud-coord-mark bottom">180° // FLUX</span>
          <span className="hud-coord-mark left">270° // QUANTUM</span>
        </div>

        {/* Ring 3: Segmented Data Ring */}
        <div className="reactor-ring ring-data-segmented">
          <div className="notch n1"></div>
          <div className="notch n2"></div>
          <div className="notch n3"></div>
          <div className="notch n4"></div>
          <div className="notch n5"></div>
          <div className="notch n6"></div>
        </div>

        {/* Ring 2: Rotating Ticked Ring (Clockwise) */}
        <div className="reactor-ring ring-ticked-clockwise">
          <svg className="svg-ring" viewBox="0 0 340 340">
            <circle
              cx="170"
              cy="170"
              r="160"
              fill="none"
              stroke="rgba(0, 240, 255, 0.35)"
              strokeWidth="2"
              strokeDasharray="6 14"
            />
            <circle
              cx="170"
              cy="170"
              r="150"
              fill="none"
              stroke="rgba(0, 140, 255, 0.4)"
              strokeWidth="1.5"
              strokeDasharray="30 20 10 20"
            />
          </svg>
        </div>

        {/* Ring 1: Inner Blade Ring (Counter-Clockwise) */}
        <div className="reactor-ring ring-inner-blades">
          <svg className="svg-ring" viewBox="0 0 240 240">
            <circle
              cx="120"
              cy="120"
              r="110"
              fill="none"
              stroke="rgba(0, 240, 255, 0.6)"
              strokeWidth="2.5"
              strokeDasharray="40 18"
            />
          </svg>
        </div>

        {/* The Central Glowing AI Orb / Arc Reactor Core */}
        <div className="ai-core-orb">
          <div className="core-glow-ambient"></div>
          <div className="core-energy-plasma"></div>
          
          {/* Inner Arc Reactor Geometry */}
          <div className="arc-core-inner">
            <div className="triangle-blade t1"></div>
            <div className="triangle-blade t2"></div>
            <div className="triangle-blade t3"></div>
            <div className="reactor-center-lens">
              <span className="lens-ring"></span>
              <span className="lens-dot"></span>
            </div>
          </div>
        </div>

        {/* Audio Waveform Equalizer (Activates when speaking or listening) */}
        <div className="orb-soundwave-bars">
          {[...Array(16)].map((_, i) => (
            <span
              key={i}
              className="wave-bar"
              style={{
                animationDelay: `${(i * 0.08).toFixed(2)}s`,
                height: isSpeaking || isListening ? undefined : '4px',
              }}
            ></span>
          ))}
        </div>
      </div>

      {/* Mode Status Pill Below Core */}
      <div className="orb-status-pill">
        <span className="pill-pulse"></span>
        <span className="pill-label">
          {isListening ? 'VOICE RECOGNITION ACTIVE' : isSpeaking ? 'JARVIS SPEAKING...' : 'CORE FREQUENCY: 4.82 THz'}
        </span>
      </div>
    </div>
  );
}
