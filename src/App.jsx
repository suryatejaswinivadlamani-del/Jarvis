import React, { useState } from 'react';
import { JarvisProvider, useJarvis } from './context/JarvisContext';
import StatusHeader from './components/common/StatusHeader';
import Sidebar from './components/common/Sidebar';

// 7 Dedicated Modules
import GeneralIntelligenceModule from './components/modules/GeneralIntelligence/GeneralIntelligenceModule';
import VoiceAssistantModule from './components/modules/VoiceAssistant/VoiceAssistantModule';
import MemoryCentreModule from './components/modules/MemoryCentre/MemoryCentreModule';
import KnowledgeSearchModule from './components/modules/KnowledgeSearch/KnowledgeSearchModule';
import VisionUnderstandingModule from './components/modules/VisionUnderstanding/VisionUnderstandingModule';
import TaskManagementModule from './components/modules/TaskManagement/TaskManagementModule';
import SystemSettingsModule from './components/modules/SystemSettings/SystemSettingsModule';

import './styles/jarvis-theme.css';

function DashboardContent() {
  const { activeModule } = useJarvis();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Router for the 7 dashboard modules
  const renderActiveModule = () => {
    switch (activeModule) {
      case 'general':
        return <GeneralIntelligenceModule />;
      case 'voice':
        return <VoiceAssistantModule />;
      case 'memory':
        return <MemoryCentreModule />;
      case 'search':
        return <KnowledgeSearchModule />;
      case 'vision':
        return <VisionUnderstandingModule />;
      case 'tasks':
        return <TaskManagementModule />;
      case 'settings':
        return <SystemSettingsModule />;
      default:
        return <GeneralIntelligenceModule />;
    }
  };

  return (
    <div className="jarvis-dashboard-shell">
      {/* Top HUD Status Bar */}
      <StatusHeader
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      {/* Main Body Row: Sidebar + Active Module Viewport */}
      <div className="dashboard-body-row">
        <Sidebar
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
        />

        <main className="dashboard-main-viewport">
          {renderActiveModule()}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <JarvisProvider>
      <DashboardContent />
    </JarvisProvider>
  );
}
