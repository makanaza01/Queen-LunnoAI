import React from 'react';
import { ToolType, CharacterProfile, CommunityPoll, SoundtrackSuggestion, StoryArc, Translations, YouTubeSEO } from '../types';
import { toolMetadata } from './ToolMetadata';

// Helper to get a nicely formatted title for the modal
export const getToolTitle = (toolType: ToolType | null): string => {
    if (!toolType) return '';
    const meta = toolMetadata.find(t => t.id === toolType);
    return meta ? meta.name : 'Tool';
};

// Simple hook for copy-to-clipboard functionality
const useCopyToClipboard = (): (text: string) => Promise<void> => {
    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            // Optionally, show a toast or message indicating success
        } catch (err) {
            console.error('Failed to copy text: ', err);
            // Optionally, show an error message
        }
    };
    return copyToClipboard;
};

// A reusable component for rendering a block of content with a copy button
const CopyableContent: React.FC<{ title: string; content: string; isCode?: boolean }> = ({ title, content, isCode = false }) => {
    const copy = useCopyToClipboard();
    return (
        <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
                <h4 className="text-md font-bold text-stone-700">{title}</h4>
                <button
                    onClick={() => copy(content)}
                    className="text-sm bg-stone-200 hover:bg-stone-300 text-stone-700 font-semibold py-1 px-3 rounded-md transition-colors"
                >
                    Copy
                </button>
            </div>
            {isCode ? (
                <pre className="bg-stone-100 p-3 rounded-md text-sm text-stone-800 whitespace-pre-wrap overflow-x-auto">{content}</pre>
            ) : (
                <p className="bg-stone-100 p-3 rounded-md text-sm text-stone-800">{content}</p>
            )}
        </div>
    );
};


// Main renderer function
export const renderToolContent = (tool: ToolType, data: any): React.ReactNode => {
    switch (tool) {
        case 'youtubeSEO': {
            const seoData = data as YouTubeSEO;
            return (
                <div>
                    <CopyableContent title="Generated Titles" content={seoData.titles.map((t, i) => `${i + 1}. ${t}`).join('\n')} />
                    <CopyableContent title="Video Description" content={seoData.description} />
                    <CopyableContent title="Keywords & Tags" content={seoData.tags.join(', ')} />
                </div>
            );
        }
        case 'characterProfiles': {
            const { profiles } = data as { profiles: CharacterProfile[] };
            return (
                <div>
                    {profiles.map((p, i) => (
                        <div key={i} className="mb-6 pb-4 border-b last:border-b-0">
                            <h4 className="text-lg font-bold text-amber-800 font-cinzel mb-2">{p.name}</h4>
                            <p className="text-sm mb-1"><strong className="text-stone-600">Backstory:</strong> {p.backstory}</p>
                            <p className="text-sm mb-1"><strong className="text-stone-600">Motivations:</strong> {p.motivations}</p>
                            <p className="text-sm mb-1"><strong className="text-stone-600">Personality:</strong> {p.personality}</p>
                            <p className="text-sm italic mt-2">"{p.quote}"</p>
                        </div>
                    ))}
                </div>
            );
        }
        case 'voiceoverScript':
            return <CopyableContent title="Voice-Over Script" content={data as string} isCode />;

        case 'soundtrack': {
            const { suggestions } = data as { suggestions: SoundtrackSuggestion[] };
            return (
                 <ul className="space-y-4">
                    {suggestions.map((s, i) => (
                        <li key={i} className="p-3 bg-stone-50 rounded-lg">
                            <p className="font-bold text-stone-800">{s.scene}</p>
                            <p className="text-sm"><strong className="text-stone-600">Mood:</strong> {s.mood}</p>
                            <p className="text-sm"><strong className="text-stone-600">SFX:</strong> {s.sfx.join(', ')}</p>
                        </li>
                    ))}
                </ul>
            );
        }
        case 'thumbnailIdeas':
        case 'merchIdeas':
        case 'storyBranches': {
             const key = tool === 'thumbnailIdeas' ? 'ideas' : tool === 'merchIdeas' ? 'ideas' : 'branches';
             const { [key]: items } = data as { [key: string]: string[] };
             return (
                <ul className="space-y-4">
                    {items.map((idea, i) => (
                        <li key={i} className="p-4 bg-stone-50 rounded-lg border-l-4 border-amber-500 text-stone-700">{idea}</li>
                    ))}
                </ul>
             );
        }
        case 'storyArc': {
            const arc = data as StoryArc;
            return (
                <div className="space-y-3">
                    <div><strong className="text-stone-600">Exposition:</strong> {arc.exposition}</div>
                    <div><strong className="text-stone-600">Rising Action:</strong> {arc.risingAction}</div>
                    <div><strong className="text-stone-600">Climax:</strong> {arc.climax}</div>
                    <div><strong className="text-stone-600">Falling Action:</strong> {arc.fallingAction}</div>
                    <div><strong className="text-stone-600">Resolution:</strong> {arc.resolution}</div>
                </div>
            );
        }
        case 'communityPolls': {
            const { polls } = data as { polls: CommunityPoll[] };
            return (
                <div className="space-y-6">
                    {polls.map((poll, i) => (
                        <div key={i} className="p-4 bg-stone-50 rounded-lg">
                            <p className="font-bold text-stone-800 mb-2">{poll.question}</p>
                            <ul className="list-disc list-inside space-y-1 text-sm text-stone-700">
                                {poll.options.map((opt, j) => <li key={j}>{opt}</li>)}
                            </ul>
                        </div>
                    ))}
                </div>
            );
        }
        case 'translations': {
             const { swahili, yoruba, hausa } = data as Translations;
             return (
                <div className="space-y-4">
                    <div>
                        <h4 className="font-bold text-lg text-stone-800">Swahili</h4>
                        <p><strong>Title:</strong> {swahili.title}</p>
                        <p><strong>Synopsis:</strong> {swahili.synopsis}</p>
                    </div>
                     <div>
                        <h4 className="font-bold text-lg text-stone-800">Yoruba</h4>
                        <p><strong>Title:</strong> {yoruba.title}</p>
                        <p><strong>Synopsis:</strong> {yoruba.synopsis}</p>
                    </div>
                     <div>
                        <h4 className="font-bold text-lg text-stone-800">Hausa</h4>
                        <p><strong>Title:</strong> {hausa.title}</p>
                        <p><strong>Synopsis:</strong> {hausa.synopsis}</p>
                    </div>
                </div>
             );
        }
        default:
            return <p>Could not render content for this tool.</p>;
    }
};
