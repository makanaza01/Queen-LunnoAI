export interface Project {
  id: string;
  title: string;
  prompt: string;
  story: string;
  image: string | null;
  lastModified: number;
}

export type ToolType =
  | 'youtubeSEO'
  | 'characterProfiles'
  | 'voiceoverScript'
  | 'soundtrack'
  | 'thumbnailIdeas'
  | 'storyArc'
  | 'communityPolls'
  | 'translations'
  | 'merchIdeas'
  | 'storyBranches';

export interface YouTubeSEO {
  titles: string[];
  description: string;
  tags: string[];
}

export interface CharacterProfile {
  name: string;
  backstory: string;
  motivations: string;
  personality: string;
  quote: string;
}

export interface SoundtrackSuggestion {
  scene: string;
  mood: string;
  sfx: string[];
}

export interface StoryArc {
  exposition: string;
  risingAction: string;
  climax: string;
  fallingAction: string;
  resolution: string;
}

export interface CommunityPoll {
  question: string;
  options: string[];
}

export interface TranslationItem {
    title: string;
    synopsis: string;
}

export interface Translations {
    swahili: TranslationItem;
    yoruba: TranslationItem;
    hausa: TranslationItem;
}
