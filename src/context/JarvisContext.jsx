import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiService } from '../services/apiService';
import { playSciFiSound, speakJarvisFemale, stopSpeaking } from '../utils/audio';

const JarvisContext = createContext(null);

export const MODULES = [
  { id: 'general', name: 'GENERAL INTELLIGENCE', icon: 'Brain', badge: 'GPT/Claude/Llama' },
  { id: 'voice', name: 'VOICE ASSISTANT', icon: 'Mic', badge: 'Dual Voice Stage 2' },
  { id: 'memory', name: 'MEMORY CENTRE', icon: 'Database', badge: 'Vector Store' },
  { id: 'search', name: 'KNOWLEDGE & SEARCH', icon: 'Search', badge: 'Web Intel' },
  { id: 'vision', name: 'VISION & IMAGE UNDERSTANDING', icon: 'Eye', badge: 'Multimodal' },
  { id: 'tasks', name: 'TASK MANAGEMENT', icon: 'CheckSquare', badge: 'Subagents' },
  { id: 'settings', name: 'SYSTEM SETTINGS', icon: 'Settings', badge: 'Proxy & Core' },
];

export function JarvisProvider({ children }) {
  const [activeModule, setActiveModule] = useState('general');
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Stage 2 Visual State: 'idle' | 'listening' | 'thinking' | 'speaking'
  const [visualState, setVisualState] = useState('idle');

  // Backend link state
  const [backendStatus, setBackendStatus] = useState({
    online: false,
    checking: true,
    lastChecked: null,
    error: null,
  });

  // Global Chat Messages
  const [messages, setMessages] = useState([
    {
      id: 'init-1',
      sender: 'jarvis',
      text: "Good day, sir. Dual voice activation is online. You may press the microphone button or say 'JARVIS' to issue commands.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isSimulated: false,
    },
  ]);

  // Persistent Memories Store
  const [memories, setMemories] = useState(() => {
    try {
      const saved = localStorage.getItem('jarvis_memories');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // ignore
    }
    return [
      { id: 'm1', key: 'User Title', value: 'Sir / Engineer', category: 'Identity', timestamp: '2026-11-07' },
      { id: 'm2', key: 'Voice Mode', value: 'Stage 2 Dual Activation (Mic + Wake Word)', category: 'Audio', timestamp: '2026-11-07' },
      { id: 'm3', key: 'Synthesizer Timbre', value: 'Natural British / US Female Voice', category: 'Audio', timestamp: '2026-11-07' },
      { id: 'm4', key: 'Security Clearance', value: 'Level 10 (Stark Executive)', category: 'Security', timestamp: '2026-11-07' },
    ];
  });

  // Autonomous Tasks Queue
  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem('jarvis_tasks');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // ignore
    }
    return [
      {
        id: 't1',
        title: 'Calibrate Dual Voice Acoustic Sensors',
        description: 'Verify microphone single-turn capture and wake-word continuous filter stability.',
        status: 'completed',
        priority: 'high',
        progress: 100,
        subagent: 'Acoustics Subagent',
      },
      {
        id: 't2',
        title: 'Female SpeechSynthesis Intonation Tuning',
        description: 'Verify natural female English timbre playback across browser engines.',
        status: 'in-progress',
        priority: 'medium',
        progress: 85,
        subagent: 'Vocal Synthesizer',
      },
    ];
  });

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('jarvis_memories', JSON.stringify(memories));
  }, [memories]);

  useEffect(() => {
    localStorage.setItem('jarvis_tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Periodic Backend Health Check
  const checkHealth = async () => {
    setBackendStatus((prev) => ({ ...prev, checking: true }));
    const result = await apiService.checkHealth();
    setBackendStatus({
      online: result.online,
      checking: false,
      lastChecked: new Date().toLocaleTimeString(),
      error: result.error || null,
    });
  };

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  // Female voice response trigger
  const triggerFemaleSpeech = useCallback(
    (text) => {
      if (!soundEnabled) {
        setVisualState('idle');
        return;
      }

      setVisualState('speaking');
      speakJarvisFemale(text, {
        onStart: () => setVisualState('speaking'),
        onEnd: () => setVisualState('idle'),
      });
    },
    [soundEnabled]
  );

  // Manual stop speaking
  const handleStopSpeaking = () => {
    stopSpeaking();
    setVisualState('idle');
    if (soundEnabled) playSciFiSound('beep');
  };

  // Central send message handler
  const sendMessage = async (text, customModel = 'gemini-1.5-pro') => {
    if (!text.trim()) return;

    if (soundEnabled) playSciFiSound('beep');

    const userMsg = {
      id: Date.now().toString(),
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setVisualState('thinking');

    // Check if backend proxy is available
    if (backendStatus.online) {
      const resp = await apiService.sendChat({
        message: text,
        model: customModel,
        systemPrompt: "You are JARVIS, an autonomous AI assistant inspired by Iron Man.",
        history: messages.slice(-6),
      });

      const replyText = resp.reply || "Directive acknowledged, sir.";
      const aiMsg = {
        id: (Date.now() + 1).toString(),
        sender: 'jarvis',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isSimulated: false,
      };

      setMessages((prev) => [...prev, aiMsg]);
      triggerFemaleSpeech(replyText);
    } else {
      // Local client response with honest backend readiness notice
      let replyText = "";
      const q = text.toLowerCase();
      if (q.includes("status") || q.includes("diagnostic")) {
        replyText = "All local telemetry modules are nominal, sir. Dual voice activation is online. Backend API proxy is currently standing by.";
      } else if (q.includes("protocol") || q.includes("mark")) {
        replyText = "Protocol Mark VII standby. Repulsor optics and acoustic sensors calibrated. Ready to route commands upon your directive.";
      } else if (q.includes("who are you")) {
        replyText = "I am J.A.R.V.I.S — Just A Rather Very Intelligent System. Operating Stage 2 Dual Voice Activation interface.";
      } else if (q.includes("hello") || q.includes("hey jarvis") || q.includes("hi")) {
        replyText = "Greetings, sir. All acoustic sensors and repulsors are online. How may I be of service?";
      } else {
        replyText = `Directive received: "${text}". Processing command through neural subroutines. All parameters within safe tolerances, sir.`;
      }

      const aiMsg = {
        id: (Date.now() + 1).toString(),
        sender: 'jarvis',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isSimulated: true,
      };

      setTimeout(() => {
        setMessages((prev) => [...prev, aiMsg]);
        triggerFemaleSpeech(replyText);
      }, 500);
    }
  };

  // Memory helpers
  const addMemory = (memoryItem) => {
    const newItem = {
      ...memoryItem,
      id: Date.now().toString(),
      timestamp: new Date().toISOString().split('T')[0],
    };
    setMemories((prev) => [newItem, ...prev]);
    if (soundEnabled) playSciFiSound('pulse');
  };

  const deleteMemory = (id) => {
    setMemories((prev) => prev.filter((m) => m.id !== id));
    if (soundEnabled) playSciFiSound('alert');
  };

  // Task helpers
  const addTask = (taskItem) => {
    const newTask = {
      ...taskItem,
      id: Date.now().toString(),
      status: 'pending',
      progress: 0,
    };
    setTasks((prev) => [newTask, ...prev]);
    if (soundEnabled) playSciFiSound('pulse');
  };

  const updateTaskStatus = (id, newStatus) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              status: newStatus,
              progress: newStatus === 'completed' ? 100 : newStatus === 'in-progress' ? 50 : 0,
            }
          : t
      )
    );
    if (soundEnabled) playSciFiSound('beep');
  };

  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    if (soundEnabled) playSciFiSound('alert');
  };

  return (
    <JarvisContext.Provider
      value={{
        activeModule,
        setActiveModule,
        soundEnabled,
        setSoundEnabled,
        visualState,
        setVisualState,
        backendStatus,
        checkHealth,
        messages,
        sendMessage,
        triggerFemaleSpeech,
        handleStopSpeaking,
        memories,
        addMemory,
        deleteMemory,
        tasks,
        addTask,
        updateTaskStatus,
        deleteTask,
      }}
    >
      {children}
    </JarvisContext.Provider>
  );
}

export function useJarvis() {
  const context = useContext(JarvisContext);
  if (!context) {
    throw new Error('useJarvis must be used within a JarvisProvider');
  }
  return context;
}
