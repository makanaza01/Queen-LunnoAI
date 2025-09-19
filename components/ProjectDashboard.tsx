
import React from 'react';
import { useProjects } from '../hooks/useProjects';

interface ProjectDashboardProps {
  onSelectProject: (projectId: string) => void;
  onCreateNew: (newProjectId: string) => void;
}

const ProjectDashboard: React.FC<ProjectDashboardProps> = ({ onSelectProject, onCreateNew }) => {
  const { projects, addProject, deleteProject, isLoading } = useProjects();

  const handleCreateProject = () => {
    const newProject = addProject({
      title: "Untitled Story",
      prompt: "",
      story: "",
      image: null,
    });
    onCreateNew(newProject.id);
  };

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold font-cinzel text-stone-700">My Projects</h1>
        <button
          onClick={handleCreateProject}
          className="bg-amber-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-amber-700 transition-colors shadow-sm"
        >
          + New Story
        </button>
      </div>
      {isLoading ? (
        <p>Loading projects...</p>
      ) : projects.length === 0 ? (
        <div className="text-center py-16 px-6 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold text-stone-700">Welcome to QUEEN!</h2>
          <p className="text-stone-500 mt-2">You haven't created any stories yet.</p>
          <button
            onClick={handleCreateProject}
            className="mt-6 bg-amber-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-amber-700 transition-colors shadow-md"
          >
            Create Your First Story
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-lg shadow-md p-5 flex flex-col justify-between hover:shadow-xl transition-shadow cursor-pointer"
              onClick={() => onSelectProject(project.id)}
            >
              <div>
                <h3 className="text-lg font-bold text-stone-800 truncate">{project.title}</h3>
                <p className="text-sm text-stone-500 mt-2 h-10 overflow-hidden">
                  {project.story || "No story generated yet."}
                </p>
              </div>
              <div className="text-xs text-stone-400 mt-4 flex justify-between items-center">
                <span>
                  Last modified: {new Date(project.lastModified).toLocaleDateString()}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm(`Are you sure you want to delete "${project.title}"?`)) {
                      deleteProject(project.id);
                    }
                  }}
                  className="text-red-400 hover:text-red-600 font-semibold"
                  aria-label={`Delete ${project.title}`}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectDashboard;
