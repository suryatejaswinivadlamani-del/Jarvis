import React from 'react';
import { useJarvis } from '../../../context/JarvisContext';
import { useVoiceAssistant } from '../../../hooks/useVoiceAssistant';
import JarvisOrb from '../../common/JarvisOrb';
import { MicIcon, SparklesIcon, RefreshIcon } from '../../common/Icons';

export default function VoiceAssistantModule() {
  const { soundEnabled, sendMessage, messages } = useJarvis();

  // Voice Assistant Hook for Dual Voice Activation
  const {
    visualState,
    setVisualState,
    interimTranscript,
    finalTranscript,
    setFinalTranscript,
    lastHeardSpeech,
    recognitionLang,
    setRecognitionLang,
    isMicButtonActive,
    startMicListening,
    stopMicListening,
    wakeWordEnabled,
    wakeWordDetected,
    toggleWakeWord,
    voiceError,
    setVoiceError,
    isSupported,
    permissionState,
    diagnostics,
    speakResponse,
    handleStopSpeaking,
    availableVoices,
    selectedVoiceName,
    setSelectedVoiceName,
    voiceRate,
    setVoiceRate,
    voicePitch,
    setVoicePitch,
  } = useVoiceAssistant({
    onCommandReceived: (command) => {
      sendMessage(command);
    },
    soundEnabled,
  });

  const handleMicButtonClick = () => {
    if (isMicButtonActive) {
      stopMicListening();
    } else {
      startMicListening();
    }
  };

  const testFemaleSpeech = () => {
    speakResponse(
      'Good day, sir. Dual voice activation is operational in Indian English. Standing by for your instructions.'
    );
  };

  // State display text
  const getVisualStateLabel = () => {
    switch (visualState) {
      case 'listening':
        return `LISTENING (LANGUAGE: ${recognitionLang})...`;
      case 'thinking':
        return 'THINKING & PROCESSING DIRECTIVE...';
      case 'speaking':
        return 'JARVIS VOCALIZING (FEMALE VOICE)...';
      case 'idle':
      default:
        return 'ACOUSTIC RECEPTORS IDLE';
    }
  };

  const sampleDirectives = [
    'System status report',
    'Armor diagnostics and repulsor calibration',
    'Activate defense protocol Mark VII',
    'Who are you, Jarvis?',
  ];

  return (
    <div className="module-view voice-assistant-module">
      {/* Module Title Row */}
      <div className="module-header-row">
        <div className="module-title-group">
          <div className="module-icon-wrapper">
            <MicIcon />
          </div>
          <div>
            <h2 className="module-heading">02 // DUAL VOICE ACTIVATION (STAGE 2)</h2>
            <p className="module-subheading">
              Indian English (en-IN) recognition with on-demand microphone and continuous wake-word.
            </p>
          </div>
        </div>

        {/* Visual State & Wake Word Status Pills */}
        <div className="voice-header-badges">
          {/* Recognition Language Pill */}
          <div className="lang-hud-pill">
            <span className="lang-tag">LANG:</span>
            <select
              value={recognitionLang}
              onChange={(e) => setRecognitionLang(e.target.value)}
              className="lang-select-dropdown"
            >
              <option value="en-IN">en-IN (English - India)</option>
              <option value="en-US">en-US (English - US)</option>
              <option value="en-GB">en-GB (English - UK)</option>
            </select>
          </div>

          <div className={`visual-state-pill ${visualState}`}>
            <span className="state-pulse-dot"></span>
            <span>STATE: {visualState.toUpperCase()}</span>
          </div>

          <div
            className={`wake-word-hud-pill ${
              wakeWordEnabled ? 'active' : 'inactive'
            } ${wakeWordDetected ? 'triggered' : ''}`}
          >
            <span className="wake-hud-dot"></span>
            <span>
              {wakeWordDetected
                ? 'WAKE WORD TRIGGERED: "JARVIS"!'
                : wakeWordEnabled
                ? 'WAKE-WORD ACTIVE: "JARVIS"'
                : 'WAKE-WORD: DISARMED'}
            </span>
          </div>
        </div>
      </div>

      {/* Error / Permission Banner */}
      {voiceError && (
        <div className="voice-alert-banner">
          <div className="alert-content-group">
            <span className="alert-icon">⚠</span>
            <div className="alert-text-stack">
              <strong>Voice Sensor Notice:</strong>
              <span className="alert-msg">{voiceError}</span>
            </div>
          </div>
          <div className="alert-action-group">
            <button
              className="alert-dismiss-btn"
              onClick={() => setVoiceError(null)}
            >
              DISMISS
            </button>
          </div>
        </div>
      )}

      {/* Main Grid: Centerpiece Orb vs Controls & Transcripts */}
      <div className="voice-stage-grid">
        {/* Left Column: Centerpiece AI Orb with 4 Visual States */}
        <div className="voice-orb-display-card">
          {/* Top Orb State Tag */}
          <div className="card-top-header">
            <span>// QUANTUM ARC CORE TELEMETRY</span>
            <span className={`state-tag ${visualState}`}>
              {visualState === 'idle' && '● IDLE: BLUE ORB'}
              {visualState === 'listening' && '● LISTENING: ANIMATED CYAN ORB'}
              {visualState === 'thinking' && '● THINKING: ROTATING RINGS'}
              {visualState === 'speaking' && '● SPEAKING: SOUND WAVES'}
            </span>
          </div>

          {/* Central AI Orb */}
          <div className="voice-orb-stage">
            <JarvisOrb
              size="lg"
              visualState={visualState}
              soundEnabled={soundEnabled}
              statusLabel={getVisualStateLabel()}
            />
          </div>

          {/* Dual Voice Action Hub */}
          <div className="dual-voice-controls-panel">
            {/* 1. Large Glowing Microphone Button */}
            <div className="mic-activation-block">
              <button
                className={`giant-mic-button ${
                  isMicButtonActive ? 'listening' : ''
                } ${visualState === 'thinking' ? 'thinking' : ''}`}
                onClick={handleMicButtonClick}
                disabled={!isSupported}
                title={
                  isMicButtonActive
                    ? 'Click to stop listening and transmit'
                    : 'Click to speak to JARVIS (en-IN)'
                }
              >
                <MicIcon className="giant-mic-icon" />
                {isMicButtonActive && <div className="mic-wave-pulse"></div>}
              </button>
              <div className="mic-status-label">
                {isMicButtonActive
                  ? 'LISTENING IN EN-IN... CLICK TO SEND'
                  : 'TAP MICROPHONE TO SPEAK (en-IN)'}
              </div>
            </div>

            {/* Live Recognized Speech Display */}
            <div className="live-transcript-box">
              <div className="transcript-header">
                <span>SPEECH RECOGNITION DISPLAY ({recognitionLang})</span>
                {(finalTranscript || interimTranscript) && (
                  <button
                    className="clear-transcript-btn"
                    onClick={() => {
                      setFinalTranscript('');
                    }}
                  >
                    CLEAR
                  </button>
                )}
              </div>
              <div className="transcript-text">
                {finalTranscript || interimTranscript ? (
                  <>
                    <span className="transcript-final">{finalTranscript} </span>
                    <span className="transcript-interim">{interimTranscript}</span>
                  </>
                ) : (
                  <span className="transcript-placeholder">
                    {isMicButtonActive
                      ? 'Listening... Speak now...'
                      : lastHeardSpeech
                      ? `Last recognized: "${lastHeardSpeech}"`
                      : 'Speak via microphone or say "JARVIS" to transcribe speech here...'}
                  </span>
                )}
              </div>
            </div>

            {/* 2. Wake-Word Toggle Switch */}
            <div className="wake-word-toggle-block">
              <div className="toggle-info">
                <strong>Wake-Word Sensor ("JARVIS")</strong>
                <p>Continuously detects "JARVIS" in {recognitionLang} hands-free.</p>
              </div>
              <button
                className={`hud-toggle-btn ${wakeWordEnabled ? 'active' : ''}`}
                onClick={toggleWakeWord}
                disabled={!isSupported}
              >
                {wakeWordEnabled ? 'WAKE WORD ON' : 'WAKE WORD OFF'}
              </button>
            </div>

            {/* 3. Stop Speaking Button (Shown when JARVIS is vocalizing) */}
            {visualState === 'speaking' && (
              <div className="stop-speech-block">
                <button
                  className="hud-danger-btn stop-speech-btn"
                  onClick={handleStopSpeaking}
                >
                  <span>⏹ STOP JARVIS SPEAKING</span>
                </button>
              </div>
            )}

            {/* Quick Test Directives (Fallback simulator) */}
            <div className="fallback-directives-box">
              <span className="fallback-label">TEST VOICE DIRECTIVES (SIMULATOR):</span>
              <div className="fallback-chips-row">
                {sampleDirectives.map((cmd, i) => (
                  <button
                    key={i}
                    className="fallback-chip"
                    onClick={() => {
                      setFinalTranscript(cmd);
                      sendMessage(cmd);
                    }}
                  >
                    <SparklesIcon className="chip-sparkle" />
                    <span>{cmd}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Female Voice Synthesizer & Speech Logs */}
        <div className="voice-settings-column">
          {/* Female Voice Synthesizer Tuning */}
          <div className="hud-card">
            <div className="card-top-header">
              <span>// FEMALE SPEECH SYNTHESIS MATRIX</span>
              <span className="text-cyan">NATURAL TIMBRE</span>
            </div>

            <div className="voice-sliders">
              {/* Voice Selector */}
              <div className="form-field">
                <label>SELECTED FEMALE ENGLISH VOICE</label>
                <select
                  value={selectedVoiceName}
                  onChange={(e) => setSelectedVoiceName(e.target.value)}
                  className="hud-select"
                >
                  {availableVoices.length === 0 ? (
                    <option value="">Default Browser Voice</option>
                  ) : (
                    availableVoices.map((v) => (
                      <option key={v.name} value={v.name}>
                        {v.name} ({v.lang})
                      </option>
                    ))
                  )}
                </select>
                <small className="field-hint">
                  Supports Indian English (en-IN), UK, and US natural female voices.
                </small>
              </div>

              {/* Vocal Speed */}
              <div className="slider-group">
                <div className="slider-header">
                  <span>SPEECH CADENCE / RATE</span>
                  <span className="val text-cyan">{voiceRate}x</span>
                </div>
                <input
                  type="range"
                  min="0.8"
                  max="1.3"
                  step="0.05"
                  value={voiceRate}
                  onChange={(e) => setVoiceRate(parseFloat(e.target.value))}
                  className="hud-slider"
                />
              </div>

              {/* Vocal Pitch */}
              <div className="slider-group">
                <div className="slider-header">
                  <span>PITCH MODULATION</span>
                  <span className="val text-cyan">{voicePitch}</span>
                </div>
                <input
                  type="range"
                  min="0.8"
                  max="1.4"
                  step="0.05"
                  value={voicePitch}
                  onChange={(e) => setVoicePitch(parseFloat(e.target.value))}
                  className="hud-slider"
                />
              </div>

              {/* Test Button & Stop Button */}
              <div className="voice-action-buttons-row">
                <button
                  className="hud-action-btn secondary flex-1"
                  onClick={testFemaleSpeech}
                >
                  <SparklesIcon className="btn-icon" />
                  <span>TEST FEMALE VOICE</span>
                </button>
                <button
                  className="hud-action-btn secondary"
                  onClick={handleStopSpeaking}
                >
                  <span>MUTE / STOP</span>
                </button>
              </div>
            </div>
          </div>

          {/* Acoustic Hardware & Browser Diagnostics */}
          <div className="hud-card">
            <div className="card-top-header">
              <span>// BROWSER & ACOUSTIC COMPATIBILITY</span>
              <span className="text-cyan">HARDWARE CHECK</span>
            </div>

            <div className="diagnostics-grid-list">
              <div className="diag-item">
                <span className="diag-lbl">ACTIVE BROWSER</span>
                <span className="diag-val text-cyan">{diagnostics.browser}</span>
              </div>
              <div className="diag-item">
                <span className="diag-lbl">RECOGNITION LANG</span>
                <span className="diag-val text-cyan">{recognitionLang} (Indian English)</span>
              </div>
              <div className="diag-item">
                <span className="diag-lbl">SPEECH RECOGNITION</span>
                <span
                  className={`diag-val ${
                    diagnostics.hasSpeechRecognition ? 'text-emerald' : 'text-amber'
                  }`}
                >
                  {diagnostics.hasSpeechRecognition
                    ? 'NATIVE SUPPORTED'
                    : 'UNSUPPORTED'}
                </span>
              </div>
              <div className="diag-item">
                <span className="diag-lbl">MIC PERMISSION</span>
                <span
                  className={`diag-val ${
                    permissionState === 'granted'
                      ? 'text-emerald'
                      : permissionState === 'denied'
                      ? 'text-red'
                      : 'text-amber'
                  }`}
                >
                  {permissionState.toUpperCase()}
                </span>
              </div>
              <div className="diag-item">
                <span className="diag-lbl">SPEECH SYNTHESIS</span>
                <span
                  className={`diag-val ${
                    diagnostics.hasSpeechSynthesis ? 'text-emerald' : 'text-amber'
                  }`}
                >
                  {diagnostics.hasSpeechSynthesis ? 'READY' : 'UNAVAILABLE'}
                </span>
              </div>
              <div className="diag-item">
                <span className="diag-lbl">SECURE CONTEXT</span>
                <span
                  className={`diag-val ${
                    diagnostics.isSecureContext ? 'text-emerald' : 'text-red'
                  }`}
                >
                  {diagnostics.isSecureContext ? 'HTTPS / LOCALHOST' : 'INSECURE HTTP'}
                </span>
              </div>
            </div>
          </div>

          {/* Visual State Preview Controls */}
          <div className="hud-card">
            <div className="card-top-header">
              <span>// 4-STAGE VISUAL STATE MONITOR</span>
              <span className="text-cyan">HUD OVERRIDE</span>
            </div>

            <div className="state-preview-buttons-grid">
              <button
                className={`state-select-btn ${
                  visualState === 'idle' ? 'active' : ''
                }`}
                onClick={() => setVisualState('idle')}
              >
                <span className="state-btn-dot blue"></span>
                <span>1. IDLE (BLUE ORB)</span>
              </button>
              <button
                className={`state-select-btn ${
                  visualState === 'listening' ? 'active' : ''
                }`}
                onClick={() => setVisualState('listening')}
              >
                <span className="state-btn-dot cyan"></span>
                <span>2. LISTENING (CYAN)</span>
              </button>
              <button
                className={`state-select-btn ${
                  visualState === 'thinking' ? 'active' : ''
                }`}
                onClick={() => setVisualState('thinking')}
              >
                <span className="state-btn-dot yellow"></span>
                <span>3. THINKING (RINGS)</span>
              </button>
              <button
                className={`state-select-btn ${
                  visualState === 'speaking' ? 'active' : ''
                }`}
                onClick={() => setVisualState('speaking')}
              >
                <span className="state-btn-dot purple"></span>
                <span>4. SPEAKING (WAVES)</span>
              </button>
            </div>
          </div>

          {/* Recent Vocal Dialogues */}
          <div className="hud-card">
            <div className="card-top-header">
              <span>// RECENT ACOUSTIC TRANSCRIPT</span>
              <span className="text-cyan">{messages.length} LOGS</span>
            </div>
            <div className="voice-history-feed">
              {messages.slice(-4).map((m) => (
                <div key={m.id} className={`voice-log-item ${m.sender}`}>
                  <span className="log-sender">
                    {m.sender === 'user' ? 'OPERATOR' : 'JARVIS'}:
                  </span>
                  <p className="log-text">{m.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
