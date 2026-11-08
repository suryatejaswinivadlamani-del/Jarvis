import React, { useState } from 'react';
import { useJarvis } from '../../../context/JarvisContext';
import { DatabaseIcon, TrashIcon, PlusIcon, SearchIcon, SparklesIcon } from '../../common/Icons';

export default function MemoryCentreModule() {
  const { memories, addMemory, deleteMemory } = useJarvis();
  const [searchFilter, setSearchFilter] = useState('');
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');
  const [newCategory, setNewCategory] = useState('Preferences');

  const handleCreate = (e) => {
    e.preventDefault();
    if (!newKey.trim() || !newValue.trim()) return;

    addMemory({
      key: newKey.trim(),
      value: newValue.trim(),
      category: newCategory,
    });

    setNewKey('');
    setNewValue('');
  };

  const filtered = memories.filter(
    (m) =>
      m.key.toLowerCase().includes(searchFilter.toLowerCase()) ||
      m.value.toLowerCase().includes(searchFilter.toLowerCase()) ||
      m.category.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="module-view memory-centre-module">
      <div className="module-header-row">
        <div className="module-title-group">
          <div className="module-icon-wrapper">
            <DatabaseIcon />
          </div>
          <div>
            <h2 className="module-heading">03 // PERSISTENT MEMORY CENTRE</h2>
            <p className="module-subheading">
              Episodic recall, user context preferences, and semantic vector store indexing.
            </p>
          </div>
        </div>

        <div className="memory-stats-pills">
          <div className="stat-pill">
            <span className="pill-number text-cyan">{memories.length}</span>
            <span className="pill-name">INDEXED FACTS</span>
          </div>
          <div className="stat-pill">
            <span className="pill-number text-emerald">100%</span>
            <span className="pill-name">RECALL INTEGRITY</span>
          </div>
        </div>
      </div>

      <div className="memory-layout-grid">
        {/* Left Column: Memory List & Search */}
        <div className="memory-list-column">
          <div className="hud-card">
            <div className="card-top-header">
              <div className="search-input-box">
                <SearchIcon className="search-icon" />
                <input
                  type="text"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  placeholder="Search stored facts, directives, preferences..."
                  className="hud-search-input"
                />
              </div>
              <span className="text-cyan">{filtered.length} RECORDS</span>
            </div>

            <div className="memories-container">
              {filtered.length === 0 ? (
                <div className="empty-memory-state">
                  <DatabaseIcon className="empty-icon" />
                  <p>No matching memory records found.</p>
                </div>
              ) : (
                filtered.map((item) => (
                  <div key={item.id} className="memory-item-card">
                    <div className="item-badge-row">
                      <span className="item-category-tag">{item.category}</span>
                      <span className="item-timestamp">{item.timestamp}</span>
                      <button
                        className="delete-memory-btn"
                        onClick={() => deleteMemory(item.id)}
                        title="Delete memory record"
                      >
                        <TrashIcon className="trash-icon" />
                      </button>
                    </div>

                    <div className="memory-key-row">
                      <strong>KEY:</strong> {item.key}
                    </div>
                    <div className="memory-value-row">
                      <strong>VALUE:</strong> {item.value}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Add Memory & Vector Database Status */}
        <div className="memory-actions-column">
          {/* Add New Memory Form */}
          <div className="hud-card">
            <div className="card-top-header">
              <span>// INJECT NEW MEMORY RECORD</span>
              <span className="text-cyan">WRITE ACCESS</span>
            </div>

            <form onSubmit={handleCreate} className="memory-form">
              <div className="form-field">
                <label>FACT / DIRECTIVE KEY</label>
                <input
                  type="text"
                  value={newKey}
                  onChange={(e) => setNewKey(e.target.value)}
                  placeholder="e.g., Preferred Styling Library"
                  className="hud-input"
                  required
                />
              </div>

              <div className="form-field">
                <label>MEMORY VALUE / DETAILS</label>
                <textarea
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  placeholder="e.g., Prefers modern CSS variables and zero bloated external libraries."
                  className="hud-textarea"
                  rows="3"
                  required
                />
              </div>

              <div className="form-field">
                <label>CATEGORY CLASSIFICATION</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="hud-select"
                >
                  <option value="Preferences">Preferences</option>
                  <option value="Identity">Identity</option>
                  <option value="Tech Preferences">Tech Preferences</option>
                  <option value="Security">Security</option>
                  <option value="Workflows">Workflows</option>
                </select>
              </div>

              <button type="submit" className="hud-action-btn primary full-width">
                <PlusIcon />
                <span>COMMIT TO MEMORY STORE</span>
              </button>
            </form>
          </div>

          {/* Semantic Vector Store Readiness */}
          <div className="hud-card">
            <div className="card-top-header">
              <span>// VECTOR DATABASE EMBEDDINGS</span>
              <span className="text-cyan">RAG PIPELINE</span>
            </div>

            <div className="vector-store-status">
              <div className="vector-row">
                <span>VECTOR INDEX</span>
                <span className="text-emerald">STANDBY (CHROMA / PINECONE READY)</span>
              </div>
              <div className="vector-row">
                <span>EMBEDDING MODEL</span>
                <span className="text-cyan">text-embedding-3-small (via Backend)</span>
              </div>
              <div className="vector-row">
                <span>LOCAL CACHE</span>
                <span className="text-cyan">{memories.length * 0.4} KB LocalStorage</span>
              </div>
              <div className="vector-row">
                <span>BACKEND SYNC</span>
                <span className="text-muted">Awaiting API Proxy</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
