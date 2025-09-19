import React, { useState, useEffect } from 'react';
import { Project } from '../types';
import { generateStory } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';

interface StoryWriterProps {
  project: Project;
  onProjectUpdate: (updates: Partial<Project>) => void;
}

const StoryWriter: React.FC<StoryWriterProps> = ({ project, onProjectUpdate }) => {
  const [title, setTitle] = useState(project.title);
  const [prompt, setPrompt] = useState(project.prompt);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setTitle(project.title);
    setPrompt(project.prompt);
  }, [project]);

  const handleGenerateStory = async () => {
    if (!prompt.trim()) {
      setError("Please enter a prompt for your story.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const story = await generateStory(prompt);
      onProjectUpdate({ title, prompt, story });
    } catch (e) {
      setError(e instanceof Error ? e.message : "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  }

  const handleTitleBlur = () => {
    if (project.title !== title) {
        onProjectUpdate({ title });
    }
  }

  return (
    <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg">
      <div className="mb-6">
        <label htmlFor="story-title" className="block text-sm font-medium text-stone-600 mb-1">
          Story Title
        </label>
        <input
          type="text"
          id="story-title"
          value={title}
          onChange={handleTitleChange}
          onBlur={handleTitleBlur}
          className="w-full p-2 border border-stone-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
          placeholder="e.g., The Little Bear Who Lost His Roar"
        />
      </div>
      
      <div className="mb-4">
        <label htmlFor="story-prompt" className="block text-sm font-medium text-stone-600 mb-1">
          What is your story about?
        </label>
        <textarea
          id="story-prompt"
          rows={3}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="w-full p-2 border border-stone-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
          placeholder="e.g., A shy lion who learns to be brave with the help of a wise old monkey."
        />
      </div>

      <button
        onClick={handleGenerateStory}
        disabled={isLoading}
        className="bg-amber-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-amber-700 transition-colors disabled:bg-stone-400 flex items-center justify-center w-full sm:w-auto"
      >
        {isLoading ? <LoadingSpinner /> : 'Write Story'}
      </button>
      
      {error && <p className="text-red-600 mt-4">{error}</p>}
      
      <div className="mt-6 border-t pt-6">
        <h3 className="text-xl font-bold text-stone-700 font-cinzel mb-4">Your Story</h3>
        <div className="prose prose-stone max-w-none bg-stone-50 p-4 rounded-md min-h-[200px]">
          {project.story ? (
            <p className="whitespace-pre-wrap">{project.story}</p>
          ) : (
            <p className="text-stone-500 italic">Your generated story will appear here.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StoryWriter;
