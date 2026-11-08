import React, { useState } from 'react';
import { TerminalIcon, ZapIcon, CheckIcon } from './Icons';

export default function InteractiveConsole() {
  const [inputVal, setInputVal] = useState('');
  const [outputHistory, setOutputHistory] = useState([
    {
      type: 'system',
      text: 'J.A.R.V.I.S Autonomous Terminal v2.5.0 connected to ws://localhost:5173',
    },
    {
      type: 'info',
      text: 'Type a command or click a quick shortcut below to interact with J.A.R.V.I.S in real-time.',
    },
  ]);

  const presetCommands = [
    { label: 'System Status', cmd: 'jarvis --status' },
    { label: 'Optimize Bundle', cmd: 'jarvis --optimize' },
    { label: 'Run Test Suite', cmd: 'jarvis --test' },
    { label: 'Clear Console', cmd: 'clear' },
  ];

  const handleCommand = (cmdText) => {
    const trimmed = cmdText.trim().toLowerCase();
    if (!trimmed) return;

    if (trimmed === 'clear') {
      setOutputHistory([
        { type: 'system', text: 'Console cleared. Ready for next instruction.' },
      ]);
      setInputVal('');
      return;
    }

    const newLogs = [
      ...outputHistory,
      { type: 'command', text: `$ ${cmdText}` },
    ];

    if (trimmed.includes('status')) {
      newLogs.push({
        type: 'response',
        text: '🟢 SYSTEM STATUS: Optimal\n• Active Port: 5173 (Vite HMR ready)\n• Runtime Engine: Node.js v26.13.0\n• Memory Footprint: 32MB / 512MB limit\n• Subagents: 4/4 operational',
      });
    } else if (trimmed.includes('optimize')) {
      newLogs.push({
        type: 'response',
        text: '⚡ ASSET OPTIMIZER:\n• CSS gzip: 1.47 kB (-22% reduced)\n• JS chunks: 69.28 kB (tree-shaking verified)\n• Zero unused CSS selectors found.\n✓ Build pipeline optimal for deployment.',
      });
    } else if (trimmed.includes('test')) {
      newLogs.push({
        type: 'response',
        text: '🧪 TEST SUITE RESULTS:\n✓ App.test.jsx (3 tests passed in 14ms)\n✓ Navbar.test.jsx (4 tests passed in 21ms)\n✓ Terminal.test.jsx (5 tests passed in 18ms)\nAll 12 unit tests passing (100% coverage).',
      });
    } else {
      newLogs.push({
        type: 'response',
        text: `🤖 J.A.R.V.I.S: Executed "${cmdText}". Task completed in 8.6ms. All dependencies synchronized.`,
      });
    }

    setOutputHistory(newLogs);
    setInputVal('');
  };

  const onSubmit = (e) => {
    e.preventDefault();
    handleCommand(inputVal);
  };

  return (
    <section id="console" className="interactive-console-section">
      <div className="section-container">
        <div className="section-header">
          <span className="section-pill">Interactive Playground</span>
          <h2 className="section-title">
            Test <span className="gradient-text">J.A.R.V.I.S</span> in Real Time
          </h2>
          <p className="section-subtitle">
            Experience our instant agentic response engine. Click a quick command below or type your own instruction.
          </p>
        </div>

        {/* Quick Command Pills */}
        <div className="console-shortcuts">
          <span className="shortcuts-label">Quick Commands:</span>
          {presetCommands.map((item, idx) => (
            <button
              key={idx}
              className="shortcut-pill"
              onClick={() => handleCommand(item.cmd)}
            >
              <ZapIcon className="shortcut-icon" />
              <span>{item.label}</span>
              <code>({item.cmd})</code>
            </button>
          ))}
        </div>

        {/* The Live Interactive Terminal */}
        <div className="interactive-terminal-card">
          <div className="interactive-terminal-bar">
            <div className="terminal-dots">
              <span className="dot red"></span>
              <span className="dot yellow"></span>
              <span className="dot green"></span>
            </div>
            <div className="interactive-terminal-title">
              <TerminalIcon className="inline-icon" />
              <span>jarvis@workspace: ~/frontend $</span>
            </div>
            <div className="terminal-mode">Interactive Mode</div>
          </div>

          <div className="interactive-screen">
            {outputHistory.map((line, i) => (
              <div key={i} className={`console-line line-${line.type}`}>
                <pre>{line.text}</pre>
              </div>
            ))}

            {/* Prompt input row */}
            <form onSubmit={onSubmit} className="console-input-row">
              <span className="prompt-arrow">❯</span>
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Type 'jarvis --status' or any command and press Enter..."
                className="console-input"
              />
              <button type="submit" className="console-send-btn">
                Run
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
