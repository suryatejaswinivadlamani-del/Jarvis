import assert from 'node:assert/strict';
import { test } from 'node:test';
import { enqueueJarvisFemale, splitSpeechText, stopSpeaking } from '../src/utils/audio.js';

const installSpeechMock = (speak) => {
  const previousWindow = Object.getOwnPropertyDescriptor(globalThis, 'window');
  const previousUtterance = Object.getOwnPropertyDescriptor(globalThis, 'SpeechSynthesisUtterance');
  const voices = [{ name: 'Hazel', lang: 'en-GB' }];
  const speechSynthesis = {
    paused: false,
    getVoices: () => voices,
    resume() {},
    cancel() {},
    speak,
  };

  Object.defineProperty(globalThis, 'window', {
    configurable: true,
    value: { speechSynthesis },
  });
  Object.defineProperty(globalThis, 'SpeechSynthesisUtterance', {
    configurable: true,
    value: class {
      constructor(text) {
        this.text = text;
      }
    },
  });

  return () => {
    stopSpeaking();
    if (previousWindow) Object.defineProperty(globalThis, 'window', previousWindow);
    else delete globalThis.window;
    if (previousUtterance) Object.defineProperty(globalThis, 'SpeechSynthesisUtterance', previousUtterance);
    else delete globalThis.SpeechSynthesisUtterance;
  };
};

test('speech chunks preserve every character and remain within the engine limit', () => {
  const displayedText = `${'A detailed answer with context, examples, and follow-up guidance. '.repeat(15)}\nFinal note.`;
  const chunks = splitSpeechText(displayedText);

  assert.ok(chunks.length > 1);
  assert.ok(chunks.every((chunk) => chunk.length <= 180));
  assert.equal(chunks.join(''), displayedText);
});

test('queued speech delivers complete answers in order using the selected voice', async () => {
  const utterances = [];
  const restore = installSpeechMock((utterance) => {
    utterances.push(utterance);
    setImmediate(() => {
      utterance.onstart?.();
      utterance.onend?.();
    });
  });

  try {
    const firstAnswer = 'First answer. '.repeat(30);
    const secondAnswer = 'A contextual follow-up answer.';
    let startCount = 0;
    let endCount = 0;
    const firstFinished = new Promise((resolve) => {
      enqueueJarvisFemale(firstAnswer, { onStart: () => { startCount += 1; }, onEnd: () => { endCount += 1; resolve(); } });
    });
    const secondFinished = new Promise((resolve) => {
      enqueueJarvisFemale(secondAnswer, { onEnd: () => { endCount += 1; resolve(); } });
    });

    await Promise.all([firstFinished, secondFinished]);

    assert.equal(utterances.map((utterance) => utterance.text).join(''), firstAnswer + secondAnswer);
    assert.ok(utterances.every((utterance) => utterance.voice?.name === 'Hazel'));
    assert.equal(startCount, 1);
    assert.equal(endCount, 2);
  } finally {
    restore();
  }
});

test('explicit stop cancels queued speech and ignores late utterance events', () => {
  const utterances = [];
  let firstEnded = false;
  let secondStarted = false;
  const restore = installSpeechMock((utterance) => utterances.push(utterance));

  try {
    enqueueJarvisFemale('A long answer. '.repeat(30), { onEnd: () => { firstEnded = true; } });
    enqueueJarvisFemale('A queued follow-up.', { onStart: () => { secondStarted = true; } });
    assert.equal(utterances.length, 1);

    const interruptedUtterance = utterances[0];
    stopSpeaking();
    interruptedUtterance.onend?.();

    assert.equal(utterances.length, 1);
    assert.equal(firstEnded, false);
    assert.equal(secondStarted, false);
  } finally {
    restore();
  }
});