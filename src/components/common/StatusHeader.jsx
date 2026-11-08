import React, { useState, useEffect } from 'react';
import { useJarvis } from '../../context/JarvisContext';
import { RefreshIcon, MenuIcon, CloseIcon, MicIcon } from './Icons';
import { playSciFiSound } from '../../utils/audio';

export default function StatusHeader({ mobileMenuOpen, setMobileMenuOpen }) {
  const {
    soundEnabled,
    setSoundEnabled,
    backendStatus,
    checkHealth,
    visualState,
    setActiveModule,
  } = useJarvis();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

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

  const handleAudioToggle = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    if (next) playSciFiSound('beep');
  };

  return (
    <header className="jarvis-status-header">
      {/* Left: Brand & System Online Indicator */}
      <div className="header-section-left">
        <button
          className="mobile-sidebar-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Navigation"
        >
          {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>

        <div className="stark-emblem">
          <div className="emblem-hexagon">⬢</div>
          <div className="emblem-text">
            <span className="brand-primary">J.A.R.V.I.S</span>
            <span className="brand-sub">STARK QUANTUM OS</span>
          </div>
        </div>

        <div className="system-status-indicator">
          <span className="status-pulse-dot">
            <span className="dot-core"></span>
            <span className="dot-wave"></span>
          </span>
          <div className="status-text-stack">
            <span className="status-main">SYSTEM ONLINE</span>
            <span className="status-sub">PROTOCOL MARK VII</span>
          </div>
        </div>

        {/* Global Visual State Badge */}
        <div className={`hud-visual-state-pill ${visualState}`}>
          <span className="state-dot"></span>
          <span className="state-label">{visualState.toUpperCase()}</span>
        </div>
      </div>

      {/* Center: Dynamic Greeting */}
      <div className="header-section-center">
        <div className="greeting-box">
          <span className="greeting-decor">///</span>
          <h1 className="greeting-headline">{getGreeting()}</h1>
          <span className="greeting-decor">///</span>
        </div>
      </div>

      {/* Right: Clock, Backend Status & Voice Shortcut */}
      <div className="header-section-right">
        {/* Quick Voice Nav Button */}
        <button
          className="header-voice-btn"
          onClick={() => {
            setActiveModule('voice');
            if (soundEnabled) playSciFiSound('beep');
          }}
          title="Open Voice Assistant & Wake Word Controls"
        >
          <MicIcon className="header-mic-icon" />
          <span>DUAL VOICE</span>
        </button>

        {/* Backend Connectivity Status */}
        <div
          className={`backend-pill ${backendStatus.online ? 'connected' : 'offline'}`}
          title={
            backendStatus.online
              ? 'Backend API proxy connected'
              : 'Backend offline: Running in simulated local mode (Prepare FastAPI/Express proxy)'
          }
        >
          <span className={`backend-indicator-light ${backendStatus.online ? 'online' : 'local'}`}></span>
          <span className="backend-text">
            {backendStatus.online ? 'API PROXY: CONNECTED' : 'LOCAL MODE (PROXY OFFLINE)'}
          </span>
          <button
            className="backend-refresh-btn"
            onClick={checkHealth}
            title="Check backend status"
          >
            <RefreshIcon className={`refresh-icon ${backendStatus.checking ? 'spin' : ''}`} />
          </button>
        </div>

        {/* Live Digital Clock */}
        <div className="hud-clock-widget">
          <div className="time-display">{formattedTime}</div>
          <div className="date-display">{formattedDate}</div>
        </div>

        {/* Audio Toggle */}
        <button
          className={`audio-toggle-btn ${soundEnabled ? 'enabled' : 'disabled'}`}
          onClick={handleAudioToggle}
          title={soundEnabled ? 'Audio FX Enabled' : 'Audio FX Muted'}
        >
          {soundEnabled ? 'AUDIO ON' : 'AUDIO OFF'}
        </button>
      </div>
    </header>
  );
}
