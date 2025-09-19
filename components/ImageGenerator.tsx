
import React, { useState } from 'react';
import { Project } from '../types';
import { generateImage } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';

interface ImageGeneratorProps {
  project: Project;
  onImageUpdate: (base64Image: string) => void;
}

const ImageGenerator: React.FC<ImageGeneratorProps> = ({ project, onImageUpdate }) => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateImage = async () => {
    const imagePrompt = prompt.trim() || `A key scene from the story: ${project.title}`;
    if (!project.story && !prompt.trim()) {
        setError("Please write a story or provide a specific prompt for the image.");
        return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const base64Image = await generateImage(imagePrompt);
      onImageUpdate(base64Image);
    } catch (e) {
      setError(e instanceof Error ? e.message : "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg h-full flex flex-col">
      <h2 className="text-2xl font-bold text-stone-700 font-cinzel mb-4">Image Generator</h2>
      
      <div className="mb-4">
        <label htmlFor="image-prompt" className="block text-sm font-medium text-stone-600 mb-1">
          Image Prompt (optional)
        </label>
        <textarea
          id="image-prompt"
          rows={2}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="w-full p-2 border border-stone-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
          placeholder={`Describe an image, or leave blank to use the story: "${project.title}"`}
        />
      </div>

       <button
        onClick={handleGenerateImage}
        disabled={isLoading || !project.story}
        className="bg-sky-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-sky-700 transition-colors disabled:bg-stone-400 flex items-center justify-center"
      >
        {isLoading ? <LoadingSpinner /> : 'Create Thumbnail Image'}
      </button>
      
      {!project.story && <p className="text-xs text-stone-500 mt-2">You need to generate a story before you can create an image.</p>}
      {error && <p className="text-red-600 mt-4">{error}</p>}

      <div className="mt-6 border-t pt-4 flex-grow flex items-center justify-center bg-stone-100 rounded-md min-h-[200px]">
        {project.image ? (
          <img
            src={`data:image/jpeg;base64,${project.image}`}
            alt={project.title}
            className="rounded-md object-contain max-h-full max-w-full"
          />
        ) : (
          <div className="text-center text-stone-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            <p className="mt-2">Your generated image will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageGenerator;
