
import { useState, useEffect, useCallback } from 'react';
import { Project } from '../types';

const PROJECTS_STORAGE_KEY = 'queen-creative-projects';

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedProjects = localStorage.getItem(PROJECTS_STORAGE_KEY);
      if (storedProjects) {
        setProjects(JSON.parse(storedProjects));
      }
    } catch (error) {
      console.error("Failed to load projects from localStorage", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveProjects = useCallback((updatedProjects: Project[]) => {
    try {
      const sorted = updatedProjects.sort((a, b) => b.lastModified - a.lastModified);
      localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(sorted));
      setProjects(sorted);
    } catch (error) {
      console.error("Failed to save projects to localStorage", error);
    }
  }, []);

  const getProject = useCallback((id: string): Project | undefined => {
    return projects.find(p => p.id === id);
  }, [projects]);

  const addProject = useCallback((newProjectData: Omit<Project, 'id' | 'lastModified'>) => {
    const newProject: Project = {
      ...newProjectData,
      id: `proj_${Date.now()}`,
      lastModified: Date.now(),
    };
    const updatedProjects = [...projects, newProject];
    saveProjects(updatedProjects);
    return newProject;
  }, [projects, saveProjects]);

  const updateProject = useCallback((id: string, updates: Partial<Omit<Project, 'id'>>) => {
    const updatedProjects = projects.map(p =>
      p.id === id ? { ...p, ...updates, lastModified: Date.now() } : p
    );
    saveProjects(updatedProjects);
  }, [projects, saveProjects]);

  const deleteProject = useCallback((id: string) => {
    const updatedProjects = projects.filter(p => p.id !== id);
    saveProjects(updatedProjects);
  }, [projects, saveProjects]);

  return { projects, isLoading, getProject, addProject, updateProject, deleteProject };
};
