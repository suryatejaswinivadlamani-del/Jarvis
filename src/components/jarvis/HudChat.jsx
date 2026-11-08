import React, { useState, useEffect, useRef } from 'react';
import { playSciFiSound, speakJarvis } from '../../utils/audio';

export default function HudChat({
  onSendMessage,
  isListening,
  setIsListening,
  soundEnabled,
}) {
  const [inputValue, setInputValue] = useState('');
  const recognitionRef = useRef(null);

  // Initialize SpeechRecognition if available in browser
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        if (soundEnabled) playSciFiSound('pulse');
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(transcript);
        handleSend(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, [soundEnabled]);

  const toggleMic = () => {
    if (isListening) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsListening(false);
      if (soundEnabled) playSciFiSound('beep');
    } else {
      if (soundEnabled) playSciFiSound('pulse');
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch (e) {
          setIsListening(true);
        }
      } else {
        // Fallback for browsers without Web Speech API
        setIsListening(true);
        setTimeout(() => {
          const sample = "Run complete system diagnostic, Jarvis";
          setInputValue(sample);
          handleSend(sample);
          setIsListening(false);
        }, 1500);
      }
    }
  };

  const handleSend = (textToSend) => {
    const query = (textToSend || inputValue).trim();
    if (!query) return;

    if (soundEnabled) playSciFiSound('beep');
    onSendMessage(query);
    setInputValue('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  const quickPrompts = [
    'System Diagnostic',
    'Armor & Core Status',
    'Activate Protocol Mark VII',
    'Perimeter Scan',
  ];

  return (
    <div className="hud-chat-bottom-wrapper">
      {/* Quick Prompt Command Chips */}
      <div className="hud-quick-chips">
        <span className="chips-label">COMMAND SHORTCUTS:</span>
        {quickPrompts.map((cmd, i) => (
          <button
            key={i}
            className="chip-btn"
            onClick={() => {
              setInputValue(cmd);
              handleSend(cmd);
            }}
          >
            <span>⟡</span> {cmd}
          </button>
        ))}
      </div>

      {/* Futuristic Command Bar */}
      <div className={`hud-input-bar ${isListening ? 'listening-mode' : ''}`}>
        {/* Terminal Prefix */}
        <div className="input-prefix">
          <span className="prefix-bracket">[</span>
          <span className="prefix-text">JARVIS://PROMPT</span>
          <span className="prefix-bracket">]</span>
          <span className="prefix-arrow">❯</span>
        </div>

        {/* Input Text Box */}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            isListening
              ? 'Listening to your voice command, sir...'
              : "Ask JARVIS or give an instruction (e.g., 'System status')..."
          }
          className="hud-text-input"
        />

        {/* Action Controls: Mic + Send */}
        <div className="hud-input-actions">
          {/* Microphone Button */}
          <button
            type="button"
            className={`hud-mic-button ${isListening ? 'active-pulse' : ''}`}
            onClick={toggleMic}
            title={isListening ? 'Listening (Click to Stop)' : 'Voice Command (Click to Speak)'}
          >
            <svg
              className="mic-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" y1="19" x2="12" y2="22" />
            </svg>
            {isListening && <span className="mic-ripple"></span>}
          </button>

          {/* Send Button */}
          <button
            type="button"
            className="hud-send-button"
            onClick={() => handleSend()}
            disabled={!inputValue.trim()}
          >
            <span className="send-label">TRANSMIT</span>
            <svg
              className="send-arrow"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
