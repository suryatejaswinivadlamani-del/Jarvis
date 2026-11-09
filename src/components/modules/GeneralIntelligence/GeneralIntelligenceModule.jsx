import React, { useState } from 'react';
import { useJarvis } from '../../../context/JarvisContext';
import JarvisOrb from '../../common/JarvisOrb';
import { SendIcon, SparklesIcon, BrainIcon } from '../../common/Icons';

export default function GeneralIntelligenceModule() {
  const {
    messages,
    sendMessage,
    visualState,
    conversationMood,
    soundEnabled,
    clearConversation,
    handleStopSpeaking,
  } = useJarvis();
  const [input, setInput] = useState('');
  const [selectedModel, setSelectedModel] = useState('gpt-4o-mini');
  const [systemPersona, setSystemPersona] = useState('jarvis-default');

  const handleSend = (e) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;
    sendMessage(input, selectedModel, systemPersona);
    setInput('');
  };

  const samplePrompts = [
    'What is artificial intelligence?',
    'Explain photosynthesis.',
    'What is 25 multiplied by 48?',
    'Who is the Prime Minister of India?',
    "Tell me today's date.",
  ];

  return (
    <div className="module-view general-intelligence-module">
      <div className="module-header-row">
        <div className="module-title-group">
          <div className="module-icon-wrapper">
            <BrainIcon />
          </div>
          <div>
            <h2 className="module-heading">01 // GENERAL INTELLIGENCE CORE</h2>
            <p className="module-subheading">
              Autonomous reasoning, multi-turn dialog, and genuine AI-generated answers.
            </p>
          </div>
        </div>

        <div className="module-controls-group">
          <div className="control-item">
            <label>ROUTING MODEL</label>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="hud-select"
            >
              <option value="gpt-4o-mini">GPT-4o Mini (Balanced)</option>
              <option value="gpt-4o">GPT-4o (Advanced Reasoning)</option>
              <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
              <option value="claude-3-5-sonnet">Claude 3.5 Sonnet</option>
            </select>
          </div>

          <div className="control-item">
            <label>PERSONA MATRIX</label>
            <select
              value={systemPersona}
              onChange={(e) => setSystemPersona(e.target.value)}
              className="hud-select"
            >
              <option value="jarvis-default">JARVIS Executive Protocol</option>
              <option value="code-architect">Full-Stack Code Architect</option>
              <option value="security-analyst">Cybersecurity Triage Officer</option>
              <option value="concise">Concise Tactical Telemetry</option>
            </select>
          </div>

          <button type="button" className="hud-action-btn secondary" onClick={clearConversation}>
            CLEAR CONVO
          </button>
        </div>
      </div>

      <div className="general-intel-grid">
        <div className="intel-orb-column">
          <div className="orb-card-wrapper">
            <div className="card-top-header">
              <span>// ARC REACTOR TELEMETRY</span>
              <span className="text-cyan">RESONANCE: 99.8%</span>
            </div>

            <JarvisOrb
              size="md"
              visualState={visualState}
              mood={conversationMood}
              soundEnabled={soundEnabled}
              statusLabel={
                visualState === 'speaking'
                  ? 'VOCALIZING RESPONSE'
                  : visualState === 'thinking'
                  ? 'NEURAL SYNAPSE ROUTING'
                  : visualState === 'listening'
                  ? 'ACOUSTIC RECEPTORS ACTIVE'
                  : 'CORE INFERENCE STANDBY'
              }
            />
            <div className={`conversation-mood-readout mood-${conversationMood}`} aria-live="polite">
              TONE // {conversationMood.toUpperCase()}
            </div>

            <div className="quick-suggestions-box">
              <span className="suggestions-title">TACTICAL PROMPTS:</span>
              <div className="suggestions-list">
                {samplePrompts.map((prompt, i) => (
                  <button key={i} className="suggestion-chip" onClick={() => setInput(prompt)}>
                    <SparklesIcon className="chip-icon" />
                    <span>{prompt}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="intel-chat-column">
          <div className="chat-window-card">
            <div className="chat-window-header">
              <div className="terminal-dots">
                <span className="dot red"></span>
                <span className="dot yellow"></span>
                <span className="dot green"></span>
              </div>
              <span className="chat-window-title">JARVIS_NEURAL_SESSION // STREAM_ACTIVE</span>
              <span className="chat-window-badge">{messages.length} TURNS</span>
              {visualState === 'speaking' && (
                <button type="button" className="chat-interrupt-btn" onClick={handleStopSpeaking}>
                  INTERRUPT VOICE
                </button>
              )}
            </div>

            <div className="chat-messages-viewport">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`chat-bubble-row ${msg.sender === 'user' ? 'from-user' : 'from-jarvis'}`}
                >
                  <div className="chat-sender-avatar">{msg.sender === 'user' ? 'YOU' : 'JARVIS'}</div>
                  <div className="chat-bubble-body">
                    <div className="bubble-meta">
                      <span className="bubble-sender-name">
                        {msg.sender === 'user' ? 'OPERATOR' : 'J.A.R.V.I.S (CORE)'}
                      </span>
                      <span className="bubble-time">{msg.timestamp}</span>
                      {msg.isSimulated && <span className="simulated-badge">LOCAL FALLBACK</span>}
                    </div>
                    <div className="bubble-text">{msg.text}</div>
                  </div>
                </div>
              ))}

              {visualState === 'thinking' && (
                <div className="chat-bubble-row from-jarvis" style={{ opacity: 0.9 }}>
                  <div className="chat-sender-avatar">JARVIS</div>
                  <div className="chat-bubble-body">
                    <div className="bubble-meta">
                      <span className="bubble-sender-name">J.A.R.V.I.S (CORE)</span>
                      <span className="bubble-time">NOW</span>
                    </div>
                    <div className="bubble-text" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span>thinking</span>
                      <span style={{ display: 'inline-flex', gap: '4px', alignItems: 'center' }}>
                        <span style={{ width: 6, height: 6, borderRadius: '999px', background: '#67e8f9', display: 'inline-block', animation: 'pulse 1s infinite' }} />
                        <span style={{ width: 6, height: 6, borderRadius: '999px', background: '#67e8f9', display: 'inline-block', animation: 'pulse 1s infinite 0.15s' }} />
                        <span style={{ width: 6, height: 6, borderRadius: '999px', background: '#67e8f9', display: 'inline-block', animation: 'pulse 1s infinite 0.3s' }} />
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={handleSend} className="chat-input-form">
              <div className="input-bracket">[JARVIS://] &gt;</div>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask JARVIS anything..."
                className="chat-text-input"
              />
              <button type="submit" disabled={!input.trim()} className="chat-send-action-btn">
                <span>TRANSMIT</span>
                <SendIcon />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
