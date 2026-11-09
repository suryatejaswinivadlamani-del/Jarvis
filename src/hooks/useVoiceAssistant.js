import { useState, useEffect, useRef, useCallback } from 'react';
import {
  playSciFiSound,
  speakJarvisFemale,
  stopSpeaking,
  getAvailableFemaleVoices,
} from '../utils/audio';

const getBrowserName = () => {
  if (typeof navigator === 'undefined') return 'Unknown';
  const ua = navigator.userAgent;
  if (ua.includes('Edg/')) return 'Microsoft Edge';
  if (ua.includes('Chrome/')) return 'Google Chrome';
  if (ua.includes('Safari/') && !ua.includes('Chrome/')) return 'Apple Safari';
  if (ua.includes('Firefox/')) return 'Mozilla Firefox';
  return 'Browser';
};

export function useVoiceAssistant({ onCommandReceived, soundEnabled = true }) {
  // Visual States: 'idle' | 'listening' | 'thinking' | 'speaking'
  const [visualState, setVisualState] = useState('idle');

  // Transcripts
  const [interimTranscript, setInterimTranscript] = useState('');
  const [finalTranscript, setFinalTranscript] = useState('');
  const [lastHeardSpeech, setLastHeardSpeech] = useState('');

  // Recognition Language (Default: Indian English "en-IN")
  const [recognitionLang, setRecognitionLang] = useState('en-IN');

  // Dual activation states
  const [isMicButtonActive, setIsMicButtonActive] = useState(false);
  const [wakeWordEnabled, setWakeWordEnabled] = useState(false);
  const [wakeWordDetected, setWakeWordDetected] = useState(false);

  // Error & Status Indicators
  const [voiceError, setVoiceError] = useState(null);
  const [permissionState, setPermissionState] = useState('unknown'); // 'granted' | 'prompt' | 'denied' | 'unknown'
  const [isSupported, setIsSupported] = useState(true);

  // Female Voice settings
  const [availableVoices, setAvailableVoices] = useState([]);
  const [selectedVoiceName, setSelectedVoiceName] = useState('');
  const [voiceRate, setVoiceRate] = useState(1.0);
  const [voicePitch, setVoicePitch] = useState(1.05);

  // Diagnostics
  const [diagnostics, setDiagnostics] = useState({
    browser: getBrowserName(),
    hasSpeechRecognition: false,
    hasMediaDevices: false,
    hasSpeechSynthesis: false,
    isSecureContext: true,
  });

  // Internal Synchronization Refs to prevent device collisions
  const isMicInUseRef = useRef(false);
  const isMicStartingRef = useRef(false);
  const wakeWordEnabledRef = useRef(false);
  const recognitionLangRef = useRef('en-IN');
  const micRecognitionRef = useRef(null);
  const wakeWordRecognitionRef = useRef(null);
  const latestCapturedTextRef = useRef('');
  const lastProcessedPhraseRef = useRef('');
  const lastWakeTriggerTimeRef = useRef(0);
  const wakeWordRestartTimeoutRef = useRef(null);

  // Keep refs synchronized
  useEffect(() => {
    wakeWordEnabledRef.current = wakeWordEnabled;
  }, [wakeWordEnabled]);

  useEffect(() => {
    recognitionLangRef.current = recognitionLang;
  }, [recognitionLang]);

  // Initial Diagnostic & Permission Inspection
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const hasMedia =
      typeof navigator !== 'undefined' &&
      !!navigator.mediaDevices &&
      typeof navigator.mediaDevices.getUserMedia === 'function';
    const hasSynth = typeof window !== 'undefined' && !!window.speechSynthesis;
    const isSecure = typeof window !== 'undefined' ? window.isSecureContext : true;

    setDiagnostics({
      browser: getBrowserName(),
      hasSpeechRecognition: !!SpeechRecognition,
      hasMediaDevices: hasMedia,
      hasSpeechSynthesis: hasSynth,
      isSecureContext: isSecure,
    });

    if (!SpeechRecognition) {
      setIsSupported(false);
      setVoiceError(
        `${getBrowserName()} does not support Web Speech Recognition natively. Please use Google Chrome or Microsoft Edge for voice interaction.`
      );
    }

    // Check permission state via Permissions API if available
    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions
        .query({ name: 'microphone' })
        .then((permissionStatus) => {
          setPermissionState(permissionStatus.state);
          permissionStatus.onchange = () => {
            setPermissionState(permissionStatus.state);
            if (permissionStatus.state === 'granted') {
              setVoiceError(null);
            }
          };
        })
        .catch(() => {
          // Permissions query unsupported or blocked in sandbox
        });
    }
  }, []);

  // Load available female voices on mount
  useEffect(() => {
    const updateVoices = () => {
      const voices = getAvailableFemaleVoices();
      setAvailableVoices(voices);
      if (voices.length > 0 && !selectedVoiceName) {
        setSelectedVoiceName(voices[0].name);
      }
    };

    updateVoices();
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  }, [selectedVoiceName]);

  /**
   * Speak response with female voice and manage visual state
   */
  const speakResponse = useCallback(
    (text) => {
      if (!text || !soundEnabled) {
        setVisualState('idle');
        return;
      }

      setVisualState('speaking');

      speakJarvisFemale(text, {
        voiceName: selectedVoiceName,
        rate: voiceRate,
        pitch: voicePitch,
        onStart: () => setVisualState('speaking'),
        onEnd: () => setVisualState('idle'),
      });
    },
    [soundEnabled, selectedVoiceName, voiceRate, voicePitch]
  );

  /**
   * Stop speaking manually
   */
  const handleStopSpeaking = () => {
    stopSpeaking();
    setVisualState('idle');
    if (soundEnabled) playSciFiSound('beep');
  };

  /**
   * 1. MICROPHONE BUTTON ACTIVATION (Single-Turn with en-IN Language)
   * Does NOT call getUserMedia beforehand, preventing audio device lock collisions.
   */
  const startMicListening = () => {
    // Prevent double invocation
    if (isMicStartingRef.current || isMicInUseRef.current) return;
    isMicStartingRef.current = true;

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceError(
        `${getBrowserName()} does not support SpeechRecognition. Please use Google Chrome or Microsoft Edge.`
      );
      isMicStartingRef.current = false;
      return;
    }

    // Stop wake-word recognition completely to release the microphone stream
    if (wakeWordRecognitionRef.current) {
      try {
        wakeWordRecognitionRef.current.abort();
      } catch (e) {
        // ignore
      }
      wakeWordRecognitionRef.current = null;
    }

    // Stop any active speech synthesis so JARVIS doesn't talk over the user
    stopSpeaking();

    // Lock microphone usage flag
    isMicInUseRef.current = true;
    latestCapturedTextRef.current = '';

    try {
      // Abort any existing mic recognition instance
      if (micRecognitionRef.current) {
        try {
          micRecognitionRef.current.abort();
        } catch (e) {
          // ignore
        }
      }

      const recognition = new SpeechRecognition();
      // Configure single-turn capture with interim results
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;
      // Language configured to Indian English ("en-IN")
      recognition.lang = recognitionLangRef.current || 'en-IN';

      recognition.onstart = () => {
        setIsMicButtonActive(true);
        setVisualState('listening');
        setVoiceError(null);
        setInterimTranscript('');
        latestCapturedTextRef.current = '';
        isMicStartingRef.current = false;
        if (soundEnabled) playSciFiSound('pulse');
      };

      recognition.onresult = (event) => {
        let interim = '';
        let final = '';

        // Iterate through all results from index 0 to event.results.length
        for (let i = 0; i < event.results.length; ++i) {
          const item = event.results[i];
          const transcriptChunk = item[0]?.transcript || '';

          if (item.isFinal) {
            final += transcriptChunk + ' ';
          } else {
            interim += transcriptChunk;
          }
        }

        const trimmedFinal = final.trim();
        const trimmedInterim = interim.trim();

        if (trimmedFinal) {
          latestCapturedTextRef.current = trimmedFinal;
          setFinalTranscript(trimmedFinal);
          setLastHeardSpeech(trimmedFinal);
        }

        if (trimmedInterim) {
          setInterimTranscript(trimmedInterim);
          if (!trimmedFinal) {
            latestCapturedTextRef.current = trimmedInterim;
            setLastHeardSpeech(trimmedInterim);
          }
        }
      };

      recognition.onerror = (event) => {
        isMicStartingRef.current = false;
        setIsMicButtonActive(false);

        // Ignore harmless programmatic aborts
        if (event.error === 'aborted') {
          return;
        }

        if (event.error === 'not-allowed') {
          setPermissionState('denied');
          setVoiceError(
            'Microphone access blocked. Click the lock/settings icon in the browser address bar to allow microphone access.'
          );
        } else if (event.error === 'audio-capture') {
          setVoiceError(
            'Audio capture pin busy or no microphone found. Please check your Windows sound settings.'
          );
        } else if (event.error === 'no-speech') {
          setVoiceError('No speech was detected. Please speak closer to your microphone.');
        } else if (event.error === 'network') {
          setVoiceError(
            'Speech recognition network error. (Chrome & Edge require an internet connection for speech recognition).'
          );
        } else if (event.error === 'service-not-allowed') {
          setVoiceError('Speech recognition service disallowed by your browser policy.');
        } else {
          setVoiceError(`Speech recognition error: ${event.error}`);
        }

        setVisualState('idle');
      };

      recognition.onend = () => {
        isMicStartingRef.current = false;
        setIsMicButtonActive(false);
        isMicInUseRef.current = false;

        // Retrieve and clear captured text from ref
        const captured = latestCapturedTextRef.current.trim();
        latestCapturedTextRef.current = '';

        if (captured) {
          setFinalTranscript(captured);
          setInterimTranscript('');
          setVisualState('thinking');
          if (onCommandReceived) {
            onCommandReceived(captured);
          }
        } else {
          setVisualState('idle');
        }

        // Safely resume wake-word detection if enabled
        if (wakeWordEnabledRef.current && !document.hidden) {
          restartWakeWordDebounced();
        }
      };

      micRecognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      isMicStartingRef.current = false;
      isMicInUseRef.current = false;
      setIsMicButtonActive(false);
      setVisualState('idle');
      setVoiceError(`Could not start speech recognition: ${err.message}`);
    }
  };

  const stopMicListening = () => {
    isMicStartingRef.current = false;
    isMicInUseRef.current = false;

    if (micRecognitionRef.current) {
      try {
        micRecognitionRef.current.stop();
      } catch (e) {
        // ignore
      }
    }
    setIsMicButtonActive(false);
  };

  /**
   * 2. WAKE WORD ACTIVATION ("JARVIS" with en-IN Language)
   */
  const startWakeWordService = () => {
    // Do not start wake word if mic button is in use
    if (isMicInUseRef.current || isMicStartingRef.current) return;

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setWakeWordEnabled(false);
      return;
    }

    try {
      if (wakeWordRecognitionRef.current) {
        try {
          wakeWordRecognitionRef.current.abort();
        } catch (e) {
          // ignore
        }
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;
      recognition.lang = recognitionLangRef.current || 'en-IN';

      recognition.onstart = () => {
        // Wake-word active in background
      };

      recognition.onresult = (event) => {
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const result = event.results[i];
          const text = (result[0]?.transcript || '').trim().toLowerCase();

          // Check if wake word "jarvis" is spoken
          if (text.includes('jarvis')) {
            const now = Date.now();
            // Prevent duplicate triggers within 3 seconds for same phrase
            if (
              now - lastWakeTriggerTimeRef.current < 3000 &&
              lastProcessedPhraseRef.current === text
            ) {
              continue;
            }

            lastWakeTriggerTimeRef.current = now;
            lastProcessedPhraseRef.current = text;

            // Trigger Wake Activation!
            setWakeWordDetected(true);
            setTimeout(() => setWakeWordDetected(false), 2000);
            if (soundEnabled) playSciFiSound('wake');

            // Extract command after "jarvis"
            const parts = text.split('jarvis');
            const trailingCommand = parts[parts.length - 1]
              .replace(/^[,\s.!?]+/, '')
              .trim();

            if (trailingCommand.length > 2) {
              setFinalTranscript(trailingCommand);
              setLastHeardSpeech(trailingCommand);
              setVisualState('thinking');
              if (onCommandReceived) {
                onCommandReceived(trailingCommand);
              }
            } else {
              setVisualState('listening');
              setFinalTranscript('Hey JARVIS');
              setLastHeardSpeech('Hey JARVIS');
              speakResponse('Yes, sir? How may I assist you?');
            }
          }
        }
      };

      recognition.onerror = (event) => {
        if (event.error === 'not-allowed') {
          setWakeWordEnabled(false);
          setPermissionState('denied');
          setVoiceError('Wake-word listener stopped: Microphone access blocked.');
        }
      };

      recognition.onend = () => {
        // Auto-restart if toggle is ON, tab is visible, and mic button isn't active
        if (
          wakeWordEnabledRef.current &&
          !document.hidden &&
          !isMicInUseRef.current &&
          !isMicStartingRef.current
        ) {
          restartWakeWordDebounced();
        }
      };

      wakeWordRecognitionRef.current = recognition;
      recognition.start();
    } catch (e) {
      console.warn('Wake word startup failed:', e);
    }
  };

  const stopWakeWordService = () => {
    if (wakeWordRestartTimeoutRef.current) {
      clearTimeout(wakeWordRestartTimeoutRef.current);
    }
    if (wakeWordRecognitionRef.current) {
      try {
        wakeWordRecognitionRef.current.abort();
      } catch (e) {
        // ignore
      }
      wakeWordRecognitionRef.current = null;
    }
  };

  const restartWakeWordDebounced = () => {
    if (wakeWordRestartTimeoutRef.current) {
      clearTimeout(wakeWordRestartTimeoutRef.current);
    }
    wakeWordRestartTimeoutRef.current = setTimeout(() => {
      if (
        wakeWordEnabledRef.current &&
        !document.hidden &&
        !isMicInUseRef.current &&
        !isMicStartingRef.current
      ) {
        startWakeWordService();
      }
    }, 600);
  };

  // Toggle Wake Word Handler
  const toggleWakeWord = () => {
    if (wakeWordEnabled) {
      setWakeWordEnabled(false);
      stopWakeWordService();
      if (soundEnabled) playSciFiSound('beep');
    } else {
      setWakeWordEnabled(true);
      if (soundEnabled) playSciFiSound('wake');
      startWakeWordService();
    }
  };

  // Visibility change listener: suspend wake-word when tab is hidden to save resources
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopWakeWordService();
        stopMicListening();
      } else if (wakeWordEnabledRef.current) {
        restartWakeWordDebounced();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      stopWakeWordService();
    };
  }, []);

  return {
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
  };
}
