import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { apiService } from '../services/apiService';
import { enqueueJarvisFemale, playSciFiSound, stopSpeaking } from '../utils/audio';

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

const getWelcomeMessage = () => ({
  id: 'init-1',
  sender: 'jarvis',
  text: "Good day, sir. JARVIS is online, ready to answer questions, speak naturally, and maintain conversation context.",
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  isSimulated: false,
});

const getInitialMessages = () => {
  if (localStorage.getItem('jarvis_memory_consent') === 'true') {
    try {
      const saved = JSON.parse(localStorage.getItem('jarvis_conversation') || '[]');
      if (Array.isArray(saved) && saved.length) return saved;
    } catch {
      localStorage.removeItem('jarvis_conversation');
    }
  }
  return [getWelcomeMessage()];
};

const detectMood = (text) => {
  const message = text.toLowerCase();
  if (/\b(frustrat(?:ed|ing)|angry|annoyed|fed up|ridiculous|doesn't work|not working)\b/.test(message)) return 'frustrated';
  if (/\b(sad|upset|down|lonely|grief|sorry to hear|depressed|heartbroken)\b/.test(message)) return 'sad';
  if (/\b(confus(?:ed|ing)|don't understand|unclear|what do you mean|lost)\b/.test(message)) return 'confused';
  if (/\b(excited|amazing|fantastic|can't wait|thrilled|awesome|wonderful)\b/.test(message)) return 'excited';
  if (/\b(happy|glad|great|thanks|thank you|love it|pleased)\b/.test(message)) return 'happy';
  return 'neutral';
};

const getPersonaInstructions = (persona, mood, memoriesEnabled, memories) => {
  const styles = {
    'jarvis-default': 'Be loyal, composed, intelligent, politely witty, and confident without pretending to be human. Be transparent that you are an AI when relevant. Use light humor only when it suits the moment.',
    'code-architect': 'Keep the JARVIS identity, and prioritize precise engineering reasoning, practical tradeoffs, and clear code guidance.',
    'security-analyst': 'Keep the JARVIS identity, and prioritize defensive security, careful uncertainty, and actionable risk explanations.',
    concise: 'Keep the JARVIS identity, and answer in concise, direct language while preserving empathy and accuracy.',
  };
  const moodGuidance = {
    happy: 'The user sounds happy. Match their positive energy naturally.',
    excited: 'The user sounds excited. Share their enthusiasm without becoming exaggerated.',
    sad: 'The user may be sad. Lead with gentle empathy, avoid forced humor, and offer practical support without claiming to feel emotions.',
    confused: 'The user may be confused. Be patient, clarify the core idea, and explain one step at a time without condescension.',
    frustrated: 'The user may be frustrated. Acknowledge the friction, stay calm, and focus on concrete next steps rather than jokes or defensiveness.',
    neutral: 'Respond to the content and context without assuming an emotion.',
  };
  const memoryContext = memoriesEnabled && memories.length
    ? `User-approved saved memories (treat as preferences/context, not unquestionable facts):\n${memories.map((item) => `- ${item.key}: ${item.value}`).join('\n')}`
    : memoriesEnabled
      ? 'Memory is enabled, but there are no saved memories.'
      : 'Persistent memory is disabled. Do not claim to save or remember information beyond this conversation.';

  return [
    'You are J.A.R.V.I.S., a consistent personal AI assistant: capable, courteous, loyal to the user\'s goals, calm, and occasionally witty.',
    'You are an AI, not a human or fictional character. Never claim to have feelings, consciousness, senses, or actions you did not perform.',
    'Respond with empathy and appropriate encouragement. Use the conversation history to understand references and adjust tone; do not overstate inferred emotions.',
    styles[persona] || styles['jarvis-default'],
    `Likely user mood from a lightweight text cue: ${mood}. This can be wrong; let the actual words and context take precedence. ${moodGuidance[mood] || moodGuidance.neutral}`,
    memoryContext,
    'Answer the actual question directly and accurately. Match the requested depth: explain thoroughly when asked for detail, and stay brief when asked for a short answer or when a simple fact is enough.',
    'Use recent conversation history to understand follow-up questions and references. Avoid repeating prior explanations unless asked, and state uncertainty rather than inventing facts.',
  ].join('\n\n');
};

export function JarvisProvider({ children }) {
  const [activeModule, setActiveModule] = useState('general');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [visualState, setVisualState] = useState('idle');
  const [conversationMood, setConversationMood] = useState('neutral');
  const conversationMoodRef = useRef(conversationMood);
  const startupGreetingPlayedRef = useRef(false);
  const speechEpochRef = useRef(0);
  const conversationEpochRef = useRef(0);

  const [backendStatus, setBackendStatus] = useState({
    online: false,
    checking: true,
    lastChecked: null,
    error: null,
  });

  const [messages, setMessages] = useState(getInitialMessages);

  const [memoryConsent, setMemoryConsent] = useState(() => {
    try {
      return localStorage.getItem('jarvis_memory_consent') === 'true';
    } catch {
      return false;
    }
  });
  const [startupGreetingEnabled, setStartupGreetingEnabled] = useState(() => localStorage.getItem('jarvis_startup_greeting') === 'true');

  const [memories, setMemories] = useState(() => {
    try {
      const saved = localStorage.getItem('jarvis_memories');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const legacyDemoKeys = ['User Title', 'Voice Mode', 'Synthesizer Timbre', 'Security Clearance'];
          return parsed.filter((item) => !(item.timestamp === '2026-11-07' && legacyDemoKeys.includes(item.key)));
        }
      }
    } catch (e) {
      // ignore
    }
    return [];
  });

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

  useEffect(() => {
    localStorage.setItem('jarvis_memories', JSON.stringify(memories));
  }, [memories]);

  useEffect(() => {
    localStorage.setItem('jarvis_memory_consent', String(memoryConsent));
    if (!memoryConsent) localStorage.removeItem('jarvis_conversation');
  }, [memoryConsent]);

  useEffect(() => {
    if (memoryConsent) {
      localStorage.setItem('jarvis_conversation', JSON.stringify(messages.slice(-20)));
    }
  }, [messages, memoryConsent]);

  useEffect(() => {
    localStorage.setItem('jarvis_startup_greeting', String(startupGreetingEnabled));
  }, [startupGreetingEnabled]);

  useEffect(() => {
    conversationMoodRef.current = conversationMood;
  }, [conversationMood]);

  useEffect(() => {
    localStorage.setItem('jarvis_tasks', JSON.stringify(tasks));
  }, [tasks]);

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

  const triggerFemaleSpeech = useCallback(
    (text) => {
      if (!soundEnabled || !text) {
        setVisualState('idle');
        return;
      }

      const vocalStyle = {
        sad: { rate: 0.92, pitch: 1.0 },
        frustrated: { rate: 0.94, pitch: 0.98 },
        confused: { rate: 0.96, pitch: 1.02 },
        happy: { rate: 1.02, pitch: 1.06 },
        excited: { rate: 1.07, pitch: 1.08 },
        neutral: { rate: 1, pitch: 1.04 },
      }[conversationMoodRef.current] || { rate: 1, pitch: 1.04 };

      setVisualState('speaking');
      enqueueJarvisFemale(text, {
        ...vocalStyle,
        onStart: () => setVisualState('speaking'),
        onEnd: () => setVisualState('idle'),
      });
    },
    [soundEnabled]
  );

  useEffect(() => {
    if (!startupGreetingEnabled) {
      startupGreetingPlayedRef.current = false;
      return;
    }
    if (!soundEnabled || startupGreetingPlayedRef.current) return;
    const timer = setTimeout(() => {
      startupGreetingPlayedRef.current = true;
      triggerFemaleSpeech('Good day. JARVIS is ready. I am an AI assistant, and your microphone remains off until you activate it.');
    }, 700);
    return () => clearTimeout(timer);
  }, [startupGreetingEnabled, soundEnabled, triggerFemaleSpeech]);

  const handleStopSpeaking = () => {
    speechEpochRef.current += 1;
    stopSpeaking();
    setVisualState('idle');
    if (soundEnabled) playSciFiSound('beep');
  };

  const clearConversation = useCallback(() => {
    conversationEpochRef.current += 1;
    speechEpochRef.current += 1;
    setMessages([getWelcomeMessage()]);
    setConversationMood('neutral');
    setVisualState('idle');
    stopSpeaking();
  }, []);

  const sendMessage = async (text, customModel = 'gpt-4o-mini', persona = 'jarvis-default') => {
    const safeText = String(text || '').trim();
    if (!safeText) return;
    const conversationEpoch = conversationEpochRef.current;
    const speechEpoch = speechEpochRef.current;

    const mood = detectMood(safeText);
    setConversationMood(mood);

    const rememberMatch = safeText.match(/^remember(?: that)?\s+(.+)/i);
    if (rememberMatch && memoryConsent) {
      const rememberedText = rememberMatch[1].trim().replace(/[.!?]+$/, '');
      const [key, ...valueParts] = rememberedText.split(/\s+(?:is|are|:|=)\s+/i);
      addMemory({
        key: valueParts.length ? key.trim() : 'User note',
        value: valueParts.length ? valueParts.join(' ').trim() : rememberedText,
        category: 'Conversation',
      });
    }

    if (soundEnabled) playSciFiSound('beep');

    const userMsg = {
      id: Date.now().toString(),
      sender: 'user',
      text: safeText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const currentConversation = [...messages, userMsg];
    setMessages(currentConversation);
    setVisualState('thinking');

    try {
      const response = await apiService.sendChat({
        message: safeText,
        model: customModel,
        systemPrompt: getPersonaInstructions(persona, mood, memoryConsent, memories),
        history: currentConversation.slice(0, -1).slice(-8),
      });

      if (conversationEpoch !== conversationEpochRef.current) return;
      const replyText = typeof response?.reply === 'string' && response.reply.trim()
        ? response.reply
        : 'The AI service returned no answer. Please try again.';
      const aiMsg = {
        id: (Date.now() + 1).toString(),
        sender: 'jarvis',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isSimulated: Boolean(response?.isFallback || response?.isSimulated || !response?.success),
      };

      setMessages((prev) => [...prev, aiMsg]);
      if (speechEpoch === speechEpochRef.current) triggerFemaleSpeech(replyText);
    } catch {
      if (conversationEpoch !== conversationEpochRef.current) return;
      const fallbackText = 'I could not retrieve an answer from the AI service. Please check the connection and try again.';
      const aiMsg = {
        id: (Date.now() + 1).toString(),
        sender: 'jarvis',
        text: fallbackText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isSimulated: true,
      };

      setMessages((prev) => [...prev, aiMsg]);
      if (speechEpoch === speechEpochRef.current) triggerFemaleSpeech(fallbackText);
    }
  };

  const addMemory = (memoryItem) => {
    if (!memoryConsent) return;
    const newItem = {
      ...memoryItem,
      id: Date.now().toString(),
      timestamp: new Date().toISOString().split('T')[0],
    };
    setMemories((prev) => [newItem, ...prev]);
    if (soundEnabled) playSciFiSound('pulse');
  };

  const updateMemory = (id, updates) => {
    setMemories((prev) => prev.map((item) => item.id === id ? { ...item, ...updates } : item));
  };

  const deleteMemory = (id) => {
    setMemories((prev) => prev.filter((m) => m.id !== id));
    if (soundEnabled) playSciFiSound('alert');
  };

  const clearMemories = () => {
    setMemories([]);
  };

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
        conversationMood,
        startupGreetingEnabled,
        setStartupGreetingEnabled,
        backendStatus,
        checkHealth,
        messages,
        sendMessage,
        clearConversation,
        triggerFemaleSpeech,
        handleStopSpeaking,
        memories,
        addMemory,
        updateMemory,
        deleteMemory,
        clearMemories,
        memoryConsent,
        setMemoryConsent,
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
