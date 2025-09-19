
import { GoogleGenAI, Type, Chat } from "@google/genai";
import { STORY_MODEL, IMAGE_MODEL } from "../constants";
import { ToolType } from '../types';

// Use process.env.API_KEY which is assumed to be configured.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateStory = async (prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: STORY_MODEL,
      contents: `Write a short, engaging children's story based on this prompt: ${prompt}`,
      config: {
        temperature: 0.8,
        topP: 0.95,
        topK: 40,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Error generating story:", error);
    throw new Error("Failed to generate the story. Please try again.");
  }
};

export const generateImage = async (prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateImages({
      model: IMAGE_MODEL,
      prompt: `A beautiful, whimsical, and vibrant illustration for a children's story. Style: digital painting, fairytale aesthetic. Content: ${prompt}`,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/jpeg',
        aspectRatio: '16:9',
      },
    });

    const base64ImageBytes = response.generatedImages[0].image.imageBytes;
    return base64ImageBytes;
  } catch (error) {
    console.error("Error generating image:", error);
    throw new Error("Failed to generate the image. Please check the prompt and try again.");
  }
};

const getToolPrompt = (tool: ToolType, story: string, title: string): string => {
    switch (tool) {
        case 'youtubeSEO':
            return `Given the story titled "${title}", generate three catchy YouTube titles (under 60 characters), a compelling video description (under 300 characters) with relevant hashtags, and a list of 15-20 relevant keywords/tags. The story is: ${story}`;
        case 'characterProfiles':
            return `Analyze the following story and create detailed character profiles for the main characters. For each character, provide their name, a brief backstory, their primary motivations, key personality traits, and a memorable quote. Story: ${story}`;
        case 'voiceoverScript':
            return `Convert the following story into a voice-over script. Format it with character names followed by their dialogue. Include brief, clear directions for tone and sound effects in parentheses. Story: ${story}`;
        case 'soundtrack':
            return `Based on the following story, suggest soundtrack ideas. Identify 3-5 key scenes, and for each scene, describe the mood and suggest appropriate background music and sound effects (SFX). Story: ${story}`;
        case 'thumbnailIdeas':
            return `Brainstorm 3 distinct and clickable YouTube thumbnail ideas for a video based on this story. Describe each concept visually, focusing on composition, emotion, and text overlays. Story: ${story}`;
        case 'storyArc':
            return `Analyze the narrative structure of the following story and identify its key story arc components: Exposition, Rising Action, Climax, Falling Action, and Resolution. Briefly describe each part. Story: ${story}`;
        case 'communityPolls':
            return `Create 3 engaging community poll questions for a YouTube channel based on this story. Each poll should have a question and 3-4 multiple-choice options to boost audience interaction. Story: ${story}`;
        case 'translations':
            return `Translate the title and a one-paragraph synopsis of the following story into Swahili, Yoruba, and Hausa. Title: "${title}". Story: ${story}`;
        case 'merchIdeas':
            return `Generate 5 creative merchandise ideas inspired by the characters, themes, or key objects from the following story. For each idea, briefly describe the product. Story: ${story}`;
        case 'storyBranches':
            return `Based on the following story, propose 3 interesting "what if?" scenarios or alternative story branches. Briefly describe how each branch would change the plot. Story: ${story}`;
        default:
            throw new Error('Unknown tool type');
    }
};

const getToolResponseSchema = (tool: ToolType) => {
    switch (tool) {
        case 'youtubeSEO':
            return {
                type: Type.OBJECT,
                properties: {
                    titles: { type: Type.ARRAY, items: { type: Type.STRING } },
                    description: { type: Type.STRING },
                    tags: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
            };
        case 'characterProfiles':
            return {
                type: Type.OBJECT,
                properties: {
                    profiles: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                name: { type: Type.STRING },
                                backstory: { type: Type.STRING },
                                motivations: { type: Type.STRING },
                                personality: { type: Type.STRING },
                                quote: { type: Type.STRING },
                            }
                        }
                    }
                }
            };
        case 'storyArc':
             return {
                type: Type.OBJECT,
                properties: {
                    exposition: { type: Type.STRING },
                    risingAction: { type: Type.STRING },
                    climax: { type: Type.STRING },
                    fallingAction: { type: Type.STRING },
                    resolution: { type: Type.STRING },
                },
            };
        case 'soundtrack':
             return {
                type: Type.OBJECT,
                properties: {
                   suggestions: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                scene: { type: Type.STRING },
                                mood: { type: Type.STRING },
                                sfx: { type: Type.ARRAY, items: { type: Type.STRING } },
                            }
                        }
                   }
                }
            };
        case 'communityPolls':
            return {
                type: Type.OBJECT,
                properties: {
                    polls: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                question: { type: Type.STRING },
                                options: { type: Type.ARRAY, items: { type: Type.STRING } },
                            }
                        }
                    }
                }
            };
        case 'translations':
            const translationSchema = {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING },
                    synopsis: { type: Type.STRING },
                }
            };
            return {
                type: Type.OBJECT,
                properties: {
                    swahili: translationSchema,
                    yoruba: translationSchema,
                    hausa: translationSchema,
                },
            };
        case 'thumbnailIdeas':
        case 'merchIdeas':
        case 'storyBranches':
             const key = tool === 'thumbnailIdeas' ? 'ideas' : tool === 'merchIdeas' ? 'ideas' : 'branches';
             return {
                type: Type.OBJECT,
                properties: {
                    [key]: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING }
                    }
                }
            };
        case 'voiceoverScript':
            return null; // Simple string response
        default:
            return null;
    }
};

// FIX: Renamed function from useCreativeTool to runCreativeTool to avoid confusion with React hooks.
export const runCreativeTool = async <T>(tool: ToolType, story: string, title: string): Promise<T> => {
    const prompt = getToolPrompt(tool, story, title);
    const schema = getToolResponseSchema(tool);

    try {
        const response = await ai.models.generateContent({
            model: STORY_MODEL,
            contents: prompt,
            config: {
                ...(schema && {
                    responseMimeType: "application/json",
                    responseSchema: schema,
                }),
            },
        });

        const textResponse = response.text;
        if (schema) {
            return JSON.parse(textResponse) as T;
        }
        return textResponse as T;

    } catch (error) {
        console.error(`Error using tool ${tool}:`, error);
        throw new Error(`Failed to get results for ${tool}.`);
    }
};

export const createChat = (): Chat => {
    return ai.chats.create({
        model: STORY_MODEL,
        config: {
            systemInstruction: 'You are a creative strategist and YouTube expert. Your goal is to help a user refine their children\'s story to maximize engagement and success on YouTube. Be encouraging, insightful, and provide actionable advice.',
        },
    });
};
