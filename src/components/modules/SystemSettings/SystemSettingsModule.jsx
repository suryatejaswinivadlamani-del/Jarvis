import React, { useState } from 'react';
import { useJarvis } from '../../../context/JarvisContext';
import { apiService } from '../../../services/apiService';
import { SettingsIcon, RefreshIcon, SparklesIcon, TrashIcon } from '../../common/Icons';
import { playSciFiSound } from '../../../utils/audio';

export default function SystemSettingsModule() {
  const {
    backendStatus,
    checkHealth,
    soundEnabled,
    setSoundEnabled,
    startupGreetingEnabled,
    setStartupGreetingEnabled,
  } = useJarvis();
  const [proxyUrl, setProxyUrl] = useState(apiService.getBaseUrl());
  const [copiedCode, setCopiedCode] = useState(false);

  const sampleBackendCode = `# J.A.R.V.I.S Secure Backend Proxy (FastAPI)
# Run with: uvicorn main:app --reload --port 8000
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os

app = FastAPI(title="JARVIS Neural Backend")

# Allow your React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str
    model: str = "gemini-1.5-pro"

@app.get("/api/health")
def health():
    return {"status": "online", "version": "2.5.0", "core": "nominal"}

@app.post("/api/chat")
def chat(req: ChatRequest):
    # Place your secret API keys safely here in the backend!
    # gemini_key = os.getenv("GEMINI_API_KEY")
    return {"reply": f"Jarvis backend processed: '{req.message}'"}
`;

  const copyCode = () => {
    navigator.clipboard.writeText(sampleBackendCode);
    setCopiedCode(true);
    if (soundEnabled) playSciFiSound('beep');
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleClearCache = () => {
    if (window.confirm("Reset J.A.R.V.I.S local memories and tasks?")) {
      localStorage.removeItem('jarvis_memories');
      localStorage.removeItem('jarvis_conversation');
      localStorage.removeItem('jarvis_memory_consent');
      localStorage.removeItem('jarvis_tasks');
      if (soundEnabled) playSciFiSound('alert');
      window.location.reload();
    }
  };

  return (
    <div className="module-view system-settings-module">
      <div className="module-header-row">
        <div className="module-title-group">
          <div className="module-icon-wrapper">
            <SettingsIcon />
          </div>
          <div>
            <h2 className="module-heading">07 // SYSTEM SETTINGS & ARCHITECTURE</h2>
            <p className="module-subheading">
              Secure backend proxy gateway, security isolation, and hardware telemetry.
            </p>
          </div>
        </div>

        <div className="settings-health-tag">
          <span className={`health-dot ${backendStatus.online ? 'green' : 'amber'}`}></span>
          <span>
            BACKEND STATUS: {backendStatus.online ? 'ONLINE (ACTIVE)' : 'OFFLINE (LOCAL CLIENT)'}
          </span>
        </div>
      </div>

      <div className="settings-layout-grid">
        {/* Left Column: Backend Connection & Telemetry */}
        <div className="settings-col">
          {/* Backend Proxy Config Card */}
          <div className="hud-card">
            <div className="card-top-header">
              <span>// SECURE BACKEND GATEWAY</span>
              <span className="text-cyan">ZERO-KEY FRONTEND</span>
            </div>

            <div className="settings-form-block">
              <div className="form-field">
                <label>BACKEND PROXY URL (REST / WEBSOCKET)</label>
                <div className="url-input-action-row">
                  <input
                    type="text"
                    value={proxyUrl}
                    onChange={(e) => setProxyUrl(e.target.value)}
                    placeholder="http://localhost:8000/api"
                    className="hud-input"
                  />
                  <button className="hud-action-btn secondary" onClick={checkHealth}>
                    <RefreshIcon className={`refresh-icon ${backendStatus.checking ? 'spin' : ''}`} />
                    <span>TEST LINK</span>
                  </button>
                </div>
                <small className="field-hint">
                  Target address specified in your <code>frontend/.env.example</code>.
                </small>
              </div>

              {/* Status Banner */}
              <div className={`backend-diagnostic-card ${backendStatus.online ? 'ok' : 'pending'}`}>
                <div className="diagnostic-header">
                  <strong>{backendStatus.online ? '✓ PROXY LINK ESTABLISHED' : '⚡ STANDBY MODE'}</strong>
                  <span>{backendStatus.lastChecked ? `Checked ${backendStatus.lastChecked}` : 'Checking...'}</span>
                </div>
                <p className="diagnostic-desc">
                  {backendStatus.online
                    ? 'Connected to your local/cloud backend server. Live streaming LLM inference, search queries, and vision analysis are active.'
                    : 'Backend server is currently offline. The client is running in safe simulated mode. Follow the backend guide on the right to connect your Python/Node server.'}
                </p>
              </div>
            </div>
          </div>

          {/* Audio & UI Preferences */}
          <div className="hud-card">
            <div className="card-top-header">
              <span>// SOUND FX & PREFERENCES</span>
              <span className="text-cyan">SYNTHESIS</span>
            </div>

            <div className="settings-toggles-list">
              <div className="toggle-item-row">
                <div>
                  <strong>Synthesizer Sound Effects</strong>
                  <p>HTML5 Web Audio API futuristic beeps and pulses.</p>
                </div>
                <button
                  className={`toggle-switch ${soundEnabled ? 'on' : 'off'}`}
                  onClick={() => setSoundEnabled(!soundEnabled)}
                >
                  {soundEnabled ? 'ENABLED' : 'MUTED'}
                </button>
              </div>

              <div className="toggle-item-row">
                <div>
                  <strong>Startup Greeting</strong>
                  <p>Speak a short welcome when JARVIS starts. Microphone stays off until you activate it.</p>
                </div>
                <button
                  className={`toggle-switch ${startupGreetingEnabled ? 'on' : 'off'}`}
                  aria-pressed={startupGreetingEnabled}
                  onClick={() => setStartupGreetingEnabled(!startupGreetingEnabled)}
                >
                  {startupGreetingEnabled ? 'ENABLED' : 'DISABLED'}
                </button>
              </div>

              <div className="toggle-item-row">
                <div>
                  <strong>Reset Local Storage</strong>
                  <p>Clear cached memory records and task history.</p>
                </div>
                <button className="hud-danger-btn" onClick={handleClearCache}>
                  <TrashIcon className="trash-icon" />
                  <span>RESET CACHE</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Security Architecture & Sample Backend Code */}
        <div className="settings-col">
          {/* Security Architecture Principle */}
          <div className="hud-card security-principle-card">
            <div className="card-top-header">
              <span>// SECURITY PROTOCOL: KEEPING KEYS SAFE</span>
              <span className="text-emerald">ENTERPRISE GRADE</span>
            </div>

            <div className="security-steps-box">
              <div className="sec-step">
                <span className="step-num">1</span>
                <div>
                  <strong>Never put API keys in React code</strong>
                  <p>Any secret key bundled in Vite or client JavaScript can be extracted by any visitor using browser DevTools.</p>
                </div>
              </div>

              <div className="sec-step">
                <span className="step-num">2</span>
                <div>
                  <strong>Use a Backend Proxy Architecture</strong>
                  <p>Your React frontend sends requests to your private Python or Node server, which safely attaches your private API keys and contacts OpenAI, Gemini, or Claude.</p>
                </div>
              </div>

              <div className="sec-step">
                <span className="step-num">3</span>
                <div>
                  <strong>Rate Limiting & Authentication</strong>
                  <p>Your backend controls quotas, prevents abuse, and validates requests before calling external LLMs.</p>
                </div>
              </div>
            </div>

            {/* Code Snippet Box */}
            <div className="backend-snippet-box">
              <div className="snippet-top-bar">
                <span>python_backend_template.py</span>
                <button className="copy-code-btn" onClick={copyCode}>
                  {copiedCode ? '✓ COPIED!' : 'COPY TEMPLATE'}
                </button>
              </div>
              <pre className="snippet-code-area">{sampleBackendCode}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
