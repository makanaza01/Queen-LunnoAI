import React, { useState } from 'react';
import { useProjects } from '../hooks/useProjects';
import { Project, ToolType } from '../types';
import StoryWriter from './StoryWriter';
import ImageGenerator from './ImageGenerator';
import CreativeToolkit from './CreativeToolkit';
import StrategyChat from './StrategyChat';
import Tabs from './Tabs';
import ToolModal from './ToolModal';
import { runCreativeTool } from '../services/geminiService';
import { renderToolContent, getToolTitle } from './ToolContentRenderer';

interface ProjectWorkspaceProps {
  projectId: string;
  onExit: () => void;
}

const TABS = [
  { id: 'write', label: '1. Write Story' },
  { id: 'image', label: '2. Create Image' },
  { id: 'tools', label: '3. Creative Tools' },
  { id: 'chat', label: '4. Strategy Chat' },
];

const ProjectWorkspace: React.FC<ProjectWorkspaceProps> = ({ projectId, onExit }) => {
  const { getProject, updateProject } = useProjects();
  const [activeTab, setActiveTab] = useState('write');
  
  const [isToolModalOpen, setIsToolModalOpen] = useState(false);
  const [selectedTool, setSelectedTool] = useState<ToolType | null>(null);
  const [toolResult, setToolResult] = useState<any>(null);
  const [isToolLoading, setIsToolLoading] = useState(false);
  const [toolError, setToolError] = useState<string | null>(null);

  const project = getProject(projectId);

  const handleProjectUpdate = (updates: Partial<Omit<Project, 'id'>>) => {
    updateProject(projectId, updates);
  };

  const handleToolSelect = async (tool: ToolType) => {
    if (!project || !project.story) return;
    
    setSelectedTool(tool);
    setIsToolModalOpen(true);
    setIsToolLoading(true);
    setToolError(null);
    setToolResult(null);

    try {
        const result = await runCreativeTool(tool, project.story, project.title);
        setToolResult(result);
    } catch (e) {
        setToolError(e instanceof Error ? e.message : 'An unknown error occurred.');
    } finally {
        setIsToolLoading(false);
    }
  };

  const closeModal = () => {
    setIsToolModalOpen(false);
    setSelectedTool(null);
    setToolResult(null);
    setToolError(null);
  }

  if (!project) {
    return (
      <div className="text-center p-8">
        <h2 className="text-xl font-semibold">Project not found</h2>
        <button onClick={onExit} className="mt-4 bg-amber-600 text-white font-bold py-2 px-4 rounded-lg">
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <button onClick={onExit} className="text-sm text-amber-700 hover:underline mb-4">
        &larr; Back to all projects
      </button>
      <h1 className="text-3xl font-bold font-cinzel text-stone-700 mb-6">{project.title}</h1>
      
      <Tabs tabs={TABS} activeTab={activeTab} onTabClick={setActiveTab} />
      
      <div className="mt-6">
        {activeTab === 'write' && (
          <StoryWriter project={project} onProjectUpdate={handleProjectUpdate} />
        )}
        {activeTab === 'image' && (
          <ImageGenerator project={project} onImageUpdate={(image) => handleProjectUpdate({ image })} />
        )}
        {activeTab === 'tools' && (
          <CreativeToolkit onToolSelect={handleToolSelect} isToolLoading={isToolLoading}/>
        )}
         {activeTab === 'chat' && (
          <StrategyChat project={project} />
        )}
      </div>

      <ToolModal
        isOpen={isToolModalOpen}
        onClose={closeModal}
        title={getToolTitle(selectedTool)}
        isLoading={isToolLoading}
        error={toolError}
      >
        {toolResult && selectedTool && renderToolContent(selectedTool, toolResult)}
      </ToolModal>

    </div>
  );
};

export default ProjectWorkspace;
