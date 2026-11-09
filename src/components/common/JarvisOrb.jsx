import React from 'react';
import { playSciFiSound } from '../../utils/audio';

export default function JarvisOrb({
  size = 'md',
  visualState = 'idle', // 'idle' | 'listening' | 'thinking' | 'speaking'
  mood = 'neutral',
  isListening = false,
  isSpeaking = false,
  interactive = true,
  showWaves = true,
  statusLabel = '',
  soundEnabled = true,
}) {
  // Determine effective visual state
  const currentState =
    visualState !== 'idle'
      ? visualState
      : isSpeaking
      ? 'speaking'
      : isListening
      ? 'listening'
      : 'idle';

  const handleClick = () => {
    if (interactive && soundEnabled) {
      playSciFiSound('pulse');
    }
  };

  return (
    <div className={`orb-modular-container size-${size} state-${currentState} mood-${mood}`}>
      <div
        className={`arc-reactor-core state-${currentState}`}
        onClick={handleClick}
        role="button"
        tabIndex={0}
      >
        {/* Radar Ring */}
        <div className="reactor-ring ring-outer-radar">
          <div className="radar-sweep-beam"></div>
          {size === 'lg' && (
            <>
              <span className="hud-coord-mark top">000° // NORAD</span>
              <span className="hud-coord-mark right">090° // VECTOR</span>
              <span className="hud-coord-mark bottom">180° // FLUX</span>
              <span className="hud-coord-mark left">270° // QUANTUM</span>
            </>
          )}
        </div>

        {/* Segmented Ring */}
        <div className="reactor-ring ring-data-segmented">
          <div className="notch n1"></div>
          <div className="notch n2"></div>
          <div className="notch n3"></div>
          <div className="notch n4"></div>
          <div className="notch n5"></div>
          <div className="notch n6"></div>
        </div>

        {/* Ticked Ring (Clockwise) */}
        <div className="reactor-ring ring-ticked-clockwise">
          <svg className="svg-ring" viewBox="0 0 340 340">
            <circle
              cx="170"
              cy="170"
              r="160"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray="6 14"
            />
            <circle
              cx="170"
              cy="170"
              r="150"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeDasharray="30 20 10 20"
            />
          </svg>
        </div>

        {/* Inner Blade Ring (Counter-Clockwise) */}
        <div className="reactor-ring ring-inner-blades">
          <svg className="svg-ring" viewBox="0 0 240 240">
            <circle
              cx="120"
              cy="120"
              r="110"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeDasharray="40 18"
            />
          </svg>
        </div>

        {/* Central Glowing AI Core Orb */}
        <div className="ai-core-orb">
          <div className="core-glow-ambient"></div>
          <div className="core-energy-plasma"></div>

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

        {/* Dynamic Soundwave Equalizer */}
        {showWaves && (
          <div className={`orb-soundwave-bars ${currentState}`}>
            {[...Array(size === 'sm' ? 8 : 16)].map((_, i) => (
              <span
                key={i}
                className="wave-bar"
                style={{
                  animationDelay: `${(i * 0.08).toFixed(2)}s`,
                  height:
                    currentState === 'speaking' || currentState === 'listening'
                      ? undefined
                      : '4px',
                }}
              ></span>
            ))}
          </div>
        )}
      </div>

      {statusLabel && (
        <div className={`orb-modular-status-pill ${currentState}`}>
          <span className="pill-pulse"></span>
          <span className="pill-label">{statusLabel}</span>
        </div>
      )}
    </div>
  );
}
