import React from 'react';
import { ToolType } from '../types';
import { toolMetadata } from './ToolMetadata';

interface CreativeToolkitProps {
  onToolSelect: (tool: ToolType) => void;
  isToolLoading: boolean;
}

const CreativeToolkit: React.FC<CreativeToolkitProps> = ({ onToolSelect, isToolLoading }) => {
  return (
    <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg animate-fade-in mt-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-stone-700 font-cinzel">
          QUEEN's Creative Toolkit
        </h3>
        <p className="text-stone-600 mt-2 mb-8">
          Your story is written! Now, use these tools to prepare it for YouTube.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {toolMetadata.map((tool) => (
          <button
            key={tool.id}
            onClick={() => onToolSelect(tool.id)}
            disabled={isToolLoading}
            className="flex flex-col items-center justify-center text-center p-4 bg-stone-50 rounded-lg border-2 border-stone-200 hover:border-amber-500 hover:bg-amber-50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-stone-200 disabled:hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <div className="w-10 h-10 mb-3 text-amber-700" dangerouslySetInnerHTML={{ __html: tool.icon }} />
            <h4 className="font-bold text-stone-800">{tool.name}</h4>
            <p className="text-xs text-stone-500 mt-1">{tool.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CreativeToolkit;
