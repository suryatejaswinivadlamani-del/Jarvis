import React, { useState } from 'react';
import { useJarvis } from '../../../context/JarvisContext';
import { apiService } from '../../../services/apiService';
import { SearchIcon, SparklesIcon, RefreshIcon } from '../../common/Icons';
import { playSciFiSound } from '../../../utils/audio';

export default function KnowledgeSearchModule() {
  const { soundEnabled, backendStatus } = useJarvis();
  const [query, setQuery] = useState('');
  const [searchMode, setSearchMode] = useState('web-intel');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([
    {
      id: 'res-1',
      title: 'Vite 8 & React 19 Client Environment Architecture',
      url: 'https://vite.dev/guide/features.html',
      domain: 'vite.dev',
      snippet: 'Instant Server Start, Lightning fast HMR powered by native ESM, rich features out of the box with optimized rollup production builds.',
      category: 'Documentation',
      score: '99.4%',
    },
    {
      id: 'res-2',
      title: 'Stark Industries HUD Interface Aesthetics and Design Mechanics',
      url: 'https://marvelcinematicuniverse.fandom.com/wiki/J.A.R.V.I.S.',
      domain: 'starkindustries.corp',
      snippet: 'Concentric HUD rings, dynamic cyan vectors, and high-frequency real-time audio visualizers designed for user cognitive ergonomics.',
      category: 'Intelligence',
      score: '97.8%',
    },
    {
      id: 'res-3',
      title: 'FastAPI High-Performance Async AI Proxy Specification',
      url: 'https://fastapi.tiangolo.com',
      domain: 'fastapi.tiangolo.com',
      snippet: 'Secure backend proxy pattern for keeping LLM API keys off client devices with streaming token responses and WebSocket telemetry.',
      category: 'Architecture',
      score: '96.2%',
    },
  ]);

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    if (soundEnabled) playSciFiSound('pulse');
    setIsSearching(true);

    if (backendStatus.online) {
      const res = await apiService.searchWeb({ query, mode: searchMode });
      if (res.results) {
        setSearchResults(res.results);
      }
    } else {
      // Local simulated knowledge retrieval
      setTimeout(() => {
        setSearchResults([
          {
            id: Date.now().toString(),
            title: `Real-Time Intel: "${query}"`,
            url: `https://duckduckgo.com/?q=${encodeURIComponent(query)}`,
            domain: 'search.intel',
            snippet: `Search parameters resolved for "${query}". Note: Backend proxy at ${apiService.getBaseUrl()} is offline. Connect your backend service with Tavily / Serper / Google Search API to stream live internet indices.`,
            category: 'Query Result',
            score: '98.5%',
          },
          ...searchResults.slice(0, 3),
        ]);
        setIsSearching(false);
      }, 700);
      return;
    }

    setIsSearching(false);
  };

  const sampleSearches = [
    'React 19 Server Components',
    'Iron Man Arc Reactor Physics',
    'Quantum Encryption Standards',
    'Autonomous Multi-Agent Architecture',
  ];

  return (
    <div className="module-view knowledge-search-module">
      <div className="module-header-row">
        <div className="module-title-group">
          <div className="module-icon-wrapper">
            <SearchIcon />
          </div>
          <div>
            <h2 className="module-heading">04 // KNOWLEDGE & WEB RESEARCH INTEL</h2>
            <p className="module-subheading">
              Autonomous web indexing, live technical retrieval, and verified source citations.
            </p>
          </div>
        </div>

        {/* Search Mode Selector */}
        <div className="search-mode-selector">
          {['web-intel', 'deep-research', 'documentation'].map((mode) => (
            <button
              key={mode}
              className={`mode-btn ${searchMode === mode ? 'active' : ''}`}
              onClick={() => {
                setSearchMode(mode);
                if (soundEnabled) playSciFiSound('beep');
              }}
            >
              {mode.toUpperCase().replace('-', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Main Search Bar */}
      <div className="search-hero-bar-card">
        <form onSubmit={handleSearch} className="search-form-row">
          <div className="search-input-prefix">
            <SearchIcon className="search-lens-icon" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search global knowledge base, documentation, or real-time web topics..."
            className="search-main-input"
          />
          <button
            type="submit"
            disabled={!query.trim() || isSearching}
            className="search-submit-btn"
          >
            {isSearching ? (
              <>
                <RefreshIcon className="spin-icon" />
                <span>INDEXING...</span>
              </>
            ) : (
              <>
                <span>QUERY INTEL</span>
              </>
            )}
          </button>
        </form>

        {/* Quick query chips */}
        <div className="search-quick-tags">
          <span className="tags-label">SAMPLE TOPICS:</span>
          {sampleSearches.map((s, i) => (
            <button
              key={i}
              className="quick-search-tag"
              onClick={() => {
                setQuery(s);
              }}
            >
              <SparklesIcon className="tag-sparkle" />
              <span>{s}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Results Container */}
      <div className="search-results-section">
        <div className="results-header-bar">
          <span>// RETRIEVED SOURCES ({searchResults.length})</span>
          <span className="text-cyan">
            {backendStatus.online ? 'LIVE WEB FEED' : 'CLIENT VERIFIED CACHE'}
          </span>
        </div>

        <div className="results-list">
          {searchResults.map((item) => (
            <div key={item.id} className="search-result-card">
              <div className="result-top-meta">
                <span className="result-domain-pill">{item.domain}</span>
                <span className="result-category">{item.category}</span>
                <span className="result-relevance text-cyan">Relevance: {item.score}</span>
              </div>

              <h3 className="result-title">
                <a href={item.url} target="_blank" rel="noreferrer" className="result-link">
                  {item.title}
                </a>
              </h3>

              <p className="result-snippet">{item.snippet}</p>

              <div className="result-bottom-meta">
                <span className="result-url">{item.url}</span>
                <span className="result-action">OPEN SOURCE ↗</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
