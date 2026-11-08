/**
 * J.A.R.V.I.S Audio Engine
 * Pure Web Audio API & SpeechSynthesis (100% Client-side, No external tracking)
 */

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
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
};

/**
 * Speak text with natural female voice
 */
export const speakJarvisFemale = (text, options = {}) => {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    if (options.onEnd) options.onEnd();
    return;
  }

  try {
    window.speechSynthesis.cancel(); // Stop any pending speech
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = options.rate || 1.0;
    utterance.pitch = options.pitch || 1.05;

    // Pick female voice
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

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    if (options.onStart) {
      utterance.onstart = options.onStart;
    }

    if (options.onEnd) {
      utterance.onend = options.onEnd;
    }

    utterance.onerror = (e) => {
      console.warn('Speech synthesis error', e);
      if (options.onEnd) options.onEnd();
    };

    window.speechSynthesis.speak(utterance);
  } catch (e) {
    console.warn('Speech synthesis failed', e);
    if (options.onEnd) options.onEnd();
  }
};
