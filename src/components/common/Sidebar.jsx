import React from 'react';
import { useJarvis, MODULES } from '../../context/JarvisContext';
import {
  BrainIcon,
  MicIcon,
  DatabaseIcon,
  SearchIcon,
  EyeIcon,
  CheckSquareIcon,
  SettingsIcon,
  SparklesIcon,
} from './Icons';
import { playSciFiSound } from '../../utils/audio';

const iconMap = {
  Brain: BrainIcon,
  Mic: MicIcon,
  Database: DatabaseIcon,
  Search: SearchIcon,
  Eye: EyeIcon,
  CheckSquare: CheckSquareIcon,
  Settings: SettingsIcon,
};

export default function Sidebar({ mobileMenuOpen, setMobileMenuOpen }) {
  const { activeModule, setActiveModule, soundEnabled, tasks, memories } = useJarvis();

  const handleSelect = (moduleId) => {
    setActiveModule(moduleId);
    if (soundEnabled) playSciFiSound('beep');
    if (setMobileMenuOpen) setMobileMenuOpen(false);
  };

  const getModuleBadge = (id) => {
    if (id === 'tasks') {
      const pendingCount = tasks.filter((t) => t.status !== 'completed').length;
      return `${pendingCount} ACTIVE`;
    }
    if (id === 'memory') {
      return `${memories.length} FACTS`;
    }
    return null;
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div
          className="sidebar-mobile-backdrop"
          onClick={() => setMobileMenuOpen(false)}
        ></div>
      )}

      <aside className={`jarvis-sidebar ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        {/* Sidebar Header */}
        <div className="sidebar-section-title">
          <span>// NAVIGATION CORE</span>
          <span className="sidebar-pill">HUD v2.5</span>
        </div>

        {/* Modules Navigation List */}
        <nav className="sidebar-nav">
          {MODULES.map((mod) => {
            const IconComponent = iconMap[mod.icon] || SparklesIcon;
            const isActive = activeModule === mod.id;
            const dynamicBadge = getModuleBadge(mod.id);

            return (
              <button
                key={mod.id}
                className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
                onClick={() => handleSelect(mod.id)}
              >
                <div className="nav-item-glow"></div>
                <div className="nav-item-icon">
                  <IconComponent />
                </div>
                <div className="nav-item-content">
                  <span className="nav-item-name">{mod.name}</span>
                  <span className="nav-item-desc">{mod.badge}</span>
                </div>

                {dynamicBadge && (
                  <span className={`nav-dynamic-badge ${isActive ? 'active' : ''}`}>
                    {dynamicBadge}
                  </span>
                )}

                {isActive && <div className="active-chevron">▶</div>}
              </button>
            );
          })}
        </nav>

        {/* Telemetry Footer in Sidebar */}
        <div className="sidebar-telemetry-footer">
          <div className="telemetry-row">
            <span className="label">NEURAL SYNC</span>
            <span className="val text-cyan">99.8%</span>
          </div>
          <div className="telemetry-bar">
            <div className="telemetry-fill" style={{ width: '99.8%' }}></div>
          </div>
          <div className="telemetry-row">
            <span className="label">DEFENSE MATRIX</span>
            <span className="val text-green">ARMED</span>
          </div>
          <div className="telemetry-bar">
            <div className="telemetry-fill fill-green" style={{ width: '100%' }}></div>
          </div>
        </div>
      </aside>
    </>
  );
}
