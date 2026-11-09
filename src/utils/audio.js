/**
 * J.A.R.V.I.S Audio Engine
 * Pure Web Audio API & SpeechSynthesis (100% Client-side, No external tracking)
 */

const MAX_SPEECH_CHUNK_LENGTH = 180;
let activeSpeechId = 0;
let speechQueue = [];
let isSpeechActive = false;

export const splitSpeechText = (text, maxLength = MAX_SPEECH_CHUNK_LENGTH) => {
  const source = String(text || '');
  if (!source) return [];

  const chunks = [];
  let start = 0;
  while (start < source.length) {
    let end = Math.min(start + maxLength, source.length);
    if (end < source.length) {
      const segment = source.slice(start, end);
      const sentenceBoundary = Math.max(
        segment.lastIndexOf('. '),
        segment.lastIndexOf('! '),
        segment.lastIndexOf('? '),
        segment.lastIndexOf('; '),
        segment.lastIndexOf(': ')
      );
      const whitespaceBoundary = Math.max(
        segment.lastIndexOf(' '),
        segment.lastIndexOf('\n'),
        segment.lastIndexOf('\t')
      );

      if (sentenceBoundary >= maxLength * 0.55) {
        end = start + sentenceBoundary + 1;
      } else if (whitespaceBoundary > 0) {
        end = start + whitespaceBoundary;
      }
    }

    chunks.push(source.slice(start, end));
    start = end;
  }
  return chunks;
};

export const playSciFiSound = (type = 'beep') => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;

    if (type === 'beep') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(1400, now + 0.08);
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      osc.start(now);
      osc.stop(now + 0.1);
    } else if (type === 'pulse') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(640, now + 0.15);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      osc.start(now);
      osc.stop(now + 0.2);
    } else if (type === 'wake') {
      // Dual-tone high-tech wake word chime (Iron Man JARVIS alert)
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.setValueAtTime(880, now + 0.08); // A5
      osc.frequency.exponentialRampToValueAtTime(1174.66, now + 0.18); // D6
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      osc.start(now);
      osc.stop(now + 0.3);
    } else if (type === 'alert') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.setValueAtTime(880, now + 0.1);
      gain.gain.setValueAtTime(0.03, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc.start(now);
      osc.stop(now + 0.25);
    }
  } catch (err) {
    // Audio restrictions
  }
};

/**
 * Find natural-sounding female English voices available on system
 * Supports Indian English (en-IN), UK (en-GB), and US (en-US)
 */
export const getAvailableFemaleVoices = () => {
  if (typeof window === 'undefined' || !window.speechSynthesis) return [];
  const voices = window.speechSynthesis.getVoices();

  // Known natural female voice keywords across Windows, macOS, Android, Chrome, and iOS
  const femaleKeywords = [
    'heera',
    'neerja',
    'kalpana',
    'en-in',
    'en_in',
    'female',
    'zira',
    'samantha',
    'victoria',
    'karen',
    'hazel',
    'siri',
    'fiona',
    'moira',
    'jenny',
    'aria',
    'google uk english female',
    'google us english female',
  ];

  const matched = voices.filter((v) => {
    const nameLower = v.name.toLowerCase();
    const langLower = v.lang.toLowerCase();
    const isEnglish = langLower.startsWith('en');
    const isFemale = femaleKeywords.some(
      (k) => nameLower.includes(k) || langLower.includes(k)
    );
    return isEnglish && isFemale;
  });

  if (matched.length > 0) return matched;

  // Fallback to any English voice
  return voices.filter((v) => v.lang.startsWith('en'));
};

/**
 * Cancel/stop speaking immediately
 */
export const stopSpeaking = () => {
  activeSpeechId += 1;
  speechQueue = [];
  isSpeechActive = false;
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
};

const startSpeech = (text, options = {}) => {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    isSpeechActive = false;
    options.onEnd?.();
    processSpeechQueue();
    return;
  }

  try {
    const speechId = activeSpeechId;
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }

    const chunks = splitSpeechText(text);
    if (chunks.length === 0) {
      isSpeechActive = false;
      options.onEnd?.();
      processSpeechQueue();
      return;
    }

    const femaleVoices = getAvailableFemaleVoices();
    let selectedVoice = null;

    if (options.voiceName) {
      selectedVoice = femaleVoices.find((v) => v.name === options.voiceName);
    }

    if (!selectedVoice && femaleVoices.length > 0) {
      // Prefer en-IN voice if available, else first matched female voice
      const indianVoice = femaleVoices.find((v) =>
        v.lang.toLowerCase().includes('in')
      );
      selectedVoice = indianVoice || femaleVoices[0];
    }

    let chunkIndex = 0;
    let hasStarted = false;
    let hasEnded = false;
    const finish = () => {
      if (hasEnded || speechId !== activeSpeechId) return;
      hasEnded = true;
      isSpeechActive = false;
      options.onEnd?.();
      processSpeechQueue();
    };

    const speakNextChunk = () => {
      if (speechId !== activeSpeechId) return;
      if (chunkIndex >= chunks.length) {
        finish();
        return;
      }

      const utterance = new SpeechSynthesisUtterance(chunks[chunkIndex]);
      chunkIndex += 1;
      utterance.rate = options.rate || 1.0;
      utterance.pitch = options.pitch || 1.05;
      if (selectedVoice) utterance.voice = selectedVoice;

      utterance.onstart = () => {
        if (speechId !== activeSpeechId) return;
        if (!hasStarted) {
          hasStarted = true;
          options.onStart?.();
        }
      };
      utterance.onend = speakNextChunk;
      utterance.onerror = (event) => {
        if (speechId !== activeSpeechId) return;
        if (event.error !== 'canceled' && event.error !== 'interrupted') {
          console.warn('Speech synthesis error', event);
        }
        finish();
      };

      window.speechSynthesis.speak(utterance);
    };

    speakNextChunk();
  } catch (e) {
    console.warn('Speech synthesis failed', e);
    isSpeechActive = false;
    options.onEnd?.();
    processSpeechQueue();
  }
};

const processSpeechQueue = () => {
  if (isSpeechActive || speechQueue.length === 0) return;
  const next = speechQueue.shift();
  isSpeechActive = true;
  startSpeech(next.text, next.options);
};

export const enqueueJarvisFemale = (text, options = {}) => {
  if (!text) {
    options.onEnd?.();
    return;
  }
  speechQueue.push({ text: String(text), options });
  processSpeechQueue();
};

/** Speak immediately, replacing current and pending speech. */
export const speakJarvisFemale = (text, options = {}) => {
  stopSpeaking();
  if (!text) {
    options.onEnd?.();
    return;
  }
  isSpeechActive = true;
  startSpeech(String(text), options);
};
