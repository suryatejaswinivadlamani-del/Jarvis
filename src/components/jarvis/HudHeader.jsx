import React, { useState, useEffect } from 'react';
import { playSciFiSound } from '../../utils/audio';

export default function HudHeader({ soundEnabled, setSoundEnabled }) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Compute greeting dynamically based on user's current hour
  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "GOOD MORNING, I'M JARVIS";
    if (hour < 18) return "GOOD AFTERNOON, I'M JARVIS";
    return "GOOD EVENING, I'M JARVIS";
  };

  const formattedTime = currentTime.toLocaleTimeString('en-US', {
    hour12: true,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const formattedDate = currentTime.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  }).toUpperCase();

  const toggleSound = () => {
    const nextState = !soundEnabled;
    setSoundEnabled(nextState);
    if (nextState) playSciFiSound('beep');
  };

  return (
    <header className="hud-header">
      {/* Top Left: System Status & Protocol */}
      <div className="hud-header-left">
        <div className="stark-badge">
          <span className="stark-icon">⬢</span>
          <span className="stark-text">STARK INDUSTRIES</span>
        </div>
        <div className="status-indicator">
          <span className="status-ping">
            <span className="ping-core"></span>
            <span className="ping-wave"></span>
          </span>
          <span className="status-text">SYSTEM ONLINE</span>
          <span className="status-sub">MARK VII • PROTOCOL ACTIVE</span>
        </div>
      </div>

      {/* Center: Dynamic Greeting */}
      <div className="hud-header-center">
        <div className="greeting-wrapper">
          <div className="greeting-decor-line left"></div>
          <h1 className="greeting-title">{getGreeting()}</h1>
          <div className="greeting-decor-line right"></div>
        </div>
        <div className="sub-greeting">AUTONOMOUS ASSISTANT ARCHITECTURE • STAGE 1</div>
      </div>

      {/* Top Right: Digital Clock & Audio Toggle */}
      <div className="hud-header-right">
        <div className="clock-box">
          <div className="digital-clock">{formattedTime}</div>
          <div className="clock-meta">
            <span className="clock-date">{formattedDate}</span>
            <span className="clock-coords">MALIBU // 34.02° N</span>
          </div>
        </div>

        <button
          className={`hud-audio-btn ${soundEnabled ? 'active' : ''}`}
          onClick={toggleSound}
          title={soundEnabled ? 'Audio FX Enabled' : 'Audio FX Muted'}
        >
          {soundEnabled ? '🔊 AUDIO ON' : '🔇 AUDIO OFF'}
        </button>
      </div>
    </header>
  );
}
