import React, { useState } from 'react';
import HudHeader from './HudHeader';
import JarvisOrb from './JarvisOrb';
import HudPanels from './HudPanels';
import HudChat from './HudChat';
import { speakJarvis } from '../../utils/audio';

export default function JarvisInterface() {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [activeMessage, setActiveMessage] = useState(
    "Good day, sir. All core repulsors and neural nodes are operating at 100% capacity. How may I be of assistance?"
  );

  const handleUserMessage = (userQuery) => {
    const q = userQuery.toLowerCase().trim();
    let reply = "";

    if (q.includes("diagnostic") || q.includes("status")) {
      reply = "All primary and auxiliary systems are optimal, sir. Arc Reactor output is steady at 99.8%, core temperature 42.6 degrees Celsius, and quantum neural latency is under 5 milliseconds.";
    } else if (q.includes("armor") || q.includes("suit") || q.includes("repulsor")) {
      reply = "Mark VII armor telemetry is online. Gold-titanium alloy integrity at 100%, repulsor flight stabilizers calibrated, and micro-munitions armed and ready.";
    } else if (q.includes("protocol") || q.includes("mark")) {
      reply = "Protocol Mark VII activated, sir. Secure tactical link established with Stark satellite network. All defense subroutines stand ready on your command.";
    } else if (q.includes("scan") || q.includes("perimeter")) {
      reply = "Scanning local perimeter... No hostile signatures detected within a 50-mile radius. Malibu airspace remains secure, sir.";
    } else if (q.includes("hello") || q.includes("hi") || q.includes("hey")) {
      reply = "Greetings, sir. It is an absolute pleasure to assist you. What shall we engineer today?";
    } else if (q.includes("who are you") || q.includes("what is jarvis")) {
      reply = "I am J.A.R.V.I.S — Just A Rather Very Intelligent System. Your personal artificial intelligence interface.";
    } else if (q.includes("weather")) {
      reply = "Atmospheric conditions: 72 degrees Fahrenheit, light ocean breeze with optimal visibility across the flight corridor.";
    } else {
      reply = `Instruction received: "${userQuery}". Executing directive through autonomous neural threads. All parameters within safe tolerances, sir.`;
    }

    setActiveMessage(reply);
    setIsSpeaking(true);

    if (soundEnabled) {
      speakJarvis(reply);
    }

    // Reset speaking animation after 4 seconds
    setTimeout(() => {
      setIsSpeaking(false);
    }, 4500);
  };

  return (
    <div className="jarvis-hud-viewport">
      {/* Background Holographic Scanlines & Hex Grid */}
      <div className="hud-hex-grid"></div>
      <div className="hud-scanline-fx"></div>
      <div className="hud-radial-vignette"></div>

      {/* Top HUD Header */}
      <HudHeader 
        soundEnabled={soundEnabled} 
        setSoundEnabled={setSoundEnabled} 
      />

      {/* Center AI Orb + Concentric Animated Rings */}
      <main className="hud-main-core">
        <JarvisOrb
          isListening={isListening}
          isSpeaking={isSpeaking}
          activeMessage={activeMessage}
          soundEnabled={soundEnabled}
        />
      </main>

      {/* Futuristic Side Telemetry Wings & Corner Brackets */}
      <HudPanels />

      {/* Bottom Command Chat & Microphone Bar */}
      <HudChat
        onSendMessage={handleUserMessage}
        isListening={isListening}
        setIsListening={setIsListening}
        soundEnabled={soundEnabled}
      />
    </div>
  );
}
