
import React, { useState, useRef, useEffect } from 'react';
import { Project } from '../types';
import { createChat } from '../services/geminiService';
// Corrected: Use a standard import for Chat as per guidelines.
import { Chat } from '@google/genai';
import LoadingSpinner from './LoadingSpinner';

interface StrategyChatProps {
    project: Project;
}

interface Message {
    sender: 'user' | 'bot';
    text: string;
}

const StrategyChat: React.FC<StrategyChatProps> = ({ project }) => {
    const [chat, setChat] = useState<Chat | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setChat(createChat());
        setMessages([
            { sender: 'bot', text: "Hello! I'm here to help you make your story a YouTube hit. What's on your mind?" }
        ]);
    }, []);
    
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    useEffect(scrollToBottom, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userInput.trim() || isLoading || !chat) return;

        const newUserMessage: Message = { sender: 'user', text: userInput };
        setMessages(prev => [...prev, newUserMessage]);
        setUserInput('');
        setIsLoading(true);

        try {
            const fullPrompt = `Here is the story for context: TITLE: "${project.title}" STORY: "${project.story}". Now, here is my question: ${userInput}`;
            const response = await chat.sendMessage({ message: fullPrompt });
            const botMessage: Message = { sender: 'bot', text: response.text };
            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            const errorMessage: Message = { sender: 'bot', text: "Sorry, I encountered an error. Please try again." };
            setMessages(prev => [...prev, errorMessage]);
            console.error("Chat error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg mt-8 flex flex-col h-[600px]">
            <h2 className="text-2xl font-bold text-stone-700 font-cinzel mb-4 border-b pb-3">Strategy Chat</h2>
            <div className="flex-grow overflow-y-auto pr-4 space-y-4">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xl p-3 rounded-lg ${msg.sender === 'user' ? 'bg-amber-100 text-stone-800' : 'bg-stone-100 text-stone-800'}`}>
                            <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                         <div className="max-w-md p-3 rounded-lg bg-stone-100 text-stone-800">
                           <LoadingSpinner />
                        </div>
                    </div>
                )}
                 <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSendMessage} className="mt-4 border-t pt-4">
                <div className="relative">
                    <input
                        type="text"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        placeholder="Ask for ideas, feedback, or strategy..."
                        className="w-full p-3 pr-24 border border-stone-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
                        disabled={isLoading || !project.story}
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !userInput.trim()}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-amber-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-amber-700 disabled:bg-stone-400"
                    >
                        Send
                    </button>
                </div>
                 {!project.story && <p className="text-xs text-stone-500 mt-2">Generate a story first to enable the strategy chat.</p>}
            </form>
        </div>
    );
};

export default StrategyChat;
