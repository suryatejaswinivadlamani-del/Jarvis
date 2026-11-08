import React, { useState } from 'react';
import { useJarvis } from '../../../context/JarvisContext';
import { apiService } from '../../../services/apiService';
import { EyeIcon, SparklesIcon, RefreshIcon } from '../../common/Icons';
import { playSciFiSound } from '../../../utils/audio';

export default function VisionUnderstandingModule() {
  const { soundEnabled, backendStatus } = useJarvis();
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(
    'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80'
  );
  const [prompt, setPrompt] = useState('Inspect this hardware microarchitecture and identify structural components.');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState({
    title: 'Integrated Circuit & Neural Microprocessor Array',
    confidence: '99.2%',
    tags: ['Semiconductor', 'Silicon Substrate', 'SMD Capacitors', 'PCB Traces', 'Optical Bus'],
    breakdown:
      'High-density surface mount circuitry with multi-layer interconnects. Thermal distribution indicates active quantum flux routing through central processing unit.',
    metrics: {
      resolution: '1920x1080 Native',
      contrast: 'Optimal',
      entropy: 'High Information Density',
    },
  });

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      if (soundEnabled) playSciFiSound('pulse');
    }
  };

  const samplePresets = [
    {
      name: 'Microprocessor Chip',
      url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
      prompt: 'Inspect this hardware microarchitecture and identify structural components.',
    },
    {
      name: 'Server Cluster Rack',
      url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
      prompt: 'Analyze network cabling, switch topology, and datacenter cooling efficiency.',
    },
    {
      name: 'Cyberpunk HUD UI',
      url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
      prompt: 'Deconstruct HUD telemetry overlay, font hierarchy, and color palette contrast.',
    },
  ];

  const handleAnalyze = async () => {
    if (soundEnabled) playSciFiSound('pulse');
    setIsAnalyzing(true);

    if (backendStatus.online) {
      const res = await apiService.analyzeImage({
        imageFile: selectedImage,
        imageUrl: previewUrl,
        prompt,
      });
      if (res.analysis) setAnalysisResult(res.analysis);
    } else {
      // Client simulated response
      setTimeout(() => {
        setAnalysisResult({
          title: `Multimodal Visual Analysis: "${prompt.slice(0, 40)}..."`,
          confidence: '98.7%',
          tags: ['Visual Feature Extraction', 'Edge Detection', 'Color Histogram', 'Geometric Alignment'],
          breakdown: `Visual processing pipeline executed. Note: Backend proxy is currently offline. Connect your backend service with Gemini 1.5 Pro / GPT-4o Vision API to stream live deep-learning visual tokens.`,
          metrics: {
            resolution: 'High Definition',
            contrast: 'Pass',
            entropy: 'Normalized',
          },
        });
        setIsAnalyzing(false);
      }, 1000);
      return;
    }

    setIsAnalyzing(false);
  };

  return (
    <div className="module-view vision-module">
      <div className="module-header-row">
        <div className="module-title-group">
          <div className="module-icon-wrapper">
            <EyeIcon />
          </div>
          <div>
            <h2 className="module-heading">05 // VISION & MULTIMODAL UNDERSTANDING</h2>
            <p className="module-subheading">
              Computer vision, optical character recognition (OCR), and visual scene reasoning.
            </p>
          </div>
        </div>

        {/* Preset Selector */}
        <div className="sample-presets-group">
          <span className="presets-label">TEST SAMPLES:</span>
          {samplePresets.map((p, idx) => (
            <button
              key={idx}
              className="preset-btn"
              onClick={() => {
                setPreviewUrl(p.url);
                setSelectedImage(null);
                setPrompt(p.prompt);
                if (soundEnabled) playSciFiSound('beep');
              }}
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      <div className="vision-layout-grid">
        {/* Left Column: Image Canvas & Scanning HUD Reticle */}
        <div className="vision-canvas-column">
          <div className="hud-card canvas-card">
            <div className="card-top-header">
              <span>// OPTICAL SENSOR FEED</span>
              <span className="text-cyan">LIVE TARGET RETICLE</span>
            </div>

            <div className="vision-reticle-stage">
              {/* Corner Brackets */}
              <div className="reticle-bracket tl"></div>
              <div className="reticle-bracket tr"></div>
              <div className="reticle-bracket bl"></div>
              <div className="reticle-bracket br"></div>

              {/* Scanning Laser Beam */}
              {isAnalyzing && <div className="scanning-laser-beam"></div>}

              {/* Image Preview */}
              <img
                src={previewUrl}
                alt="Vision target preview"
                className="vision-target-image"
              />

              {/* Holographic Overlay Markings */}
              <div className="reticle-center-cross"></div>
              <div className="reticle-coords">X: 192.42 // Y: 840.11 // Z: 0.99</div>
            </div>

            {/* Upload or URL Controls */}
            <div className="canvas-upload-bar">
              <label className="upload-file-btn">
                <span>UPLOAD CUSTOM IMAGE</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                />
              </label>

              <span className="or-text">OR</span>

              <input
                type="text"
                value={previewUrl}
                onChange={(e) => setPreviewUrl(e.target.value)}
                placeholder="Paste external image URL..."
                className="hud-url-input"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Prompt & Multimodal Intelligence Breakdown */}
        <div className="vision-intel-column">
          {/* Prompt Box */}
          <div className="hud-card">
            <div className="card-top-header">
              <span>// MULTIMODAL INSTRUCTION</span>
              <span className="text-cyan">PROMPT BUFFER</span>
            </div>

            <div className="vision-prompt-form">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="What would you like JARVIS to analyze in this image?"
                className="hud-textarea"
                rows="3"
              />

              <button
                className="hud-action-btn primary full-width"
                onClick={handleAnalyze}
                disabled={isAnalyzing || !previewUrl}
              >
                {isAnalyzing ? (
                  <>
                    <RefreshIcon className="spin-icon" />
                    <span>RUNNING OPTICAL INFERENCE...</span>
                  </>
                ) : (
                  <>
                    <SparklesIcon />
                    <span>ANALYZE IMAGE WITH JARVIS</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Analysis Findings */}
          <div className="hud-card">
            <div className="card-top-header">
              <span>// REASONING & FEATURE EXTRACTION</span>
              <span className="text-emerald">CONFIDENCE: {analysisResult.confidence}</span>
            </div>

            <div className="analysis-body">
              <h4 className="analysis-title">{analysisResult.title}</h4>
              <p className="analysis-summary">{analysisResult.breakdown}</p>

              {/* Detected Feature Tags */}
              <div className="analysis-tags-list">
                {analysisResult.tags.map((tag, i) => (
                  <span key={i} className="feature-tag">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Technical Metrics Table */}
              <div className="analysis-metrics-row">
                <div className="metric-item">
                  <span className="lbl">RESOLUTION</span>
                  <span className="val text-cyan">{analysisResult.metrics.resolution}</span>
                </div>
                <div className="metric-item">
                  <span className="lbl">CONTRAST</span>
                  <span className="val text-emerald">{analysisResult.metrics.contrast}</span>
                </div>
                <div className="metric-item">
                  <span className="lbl">ENTROPY</span>
                  <span className="val text-cyan">{analysisResult.metrics.entropy}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
