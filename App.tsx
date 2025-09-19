
import React, { useState } from 'react';
import Header from './components/Header';
import ProjectDashboard from './components/ProjectDashboard';
import ProjectWorkspace from './components/ProjectWorkspace';

const App: React.FC = () => {
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);

  const handleSelectProject = (projectId: string) => {
    setActiveProjectId(projectId);
  };

  const handleExitWorkspace = () => {
    setActiveProjectId(null);
  };
  
  const handleCreateNewProject = (newProjectId: string) => {
    setActiveProjectId(newProjectId);
  }

  return (
    <div className="bg-stone-50 min-h-screen font-sans text-stone-900">
      <Header />
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        {activeProjectId ? (
          <ProjectWorkspace
            projectId={activeProjectId}
            onExit={handleExitWorkspace}
          />
        ) : (
          <ProjectDashboard
            onSelectProject={handleSelectProject}
            onCreateNew={handleCreateNewProject}
          />
        )}
      </main>
    </div>
  );
};

export default App;
