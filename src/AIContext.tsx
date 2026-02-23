import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Post } from './types';

export interface AINote {
    id: string;
    content: string;
    date: string;
    target?: string; // e.g., 'code', 'header'
}

interface AIContextType {
    currentPost: Post | null;
    setCurrentPost: (post: Post | null) => void;
    highlightedSection: string | null;
    setHighlightedSection: (section: string | null) => void;
    notes: AINote[];
    addNote: (note: AINote) => void;
    clearNotes: () => void;
}

const AIContext = createContext<AIContextType | undefined>(undefined);

export const AIProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [currentPost, setCurrentPost] = useState<Post | null>(null);
    const [highlightedSection, setHighlightedSection] = useState<string | null>(null);
    const [notes, setNotes] = useState<AINote[]>([]);

    const addNote = (note: AINote) => setNotes(prev => [...prev, note]);
    const clearNotes = () => setNotes([]);

    return (
        <AIContext.Provider value={{
            currentPost, setCurrentPost,
            highlightedSection, setHighlightedSection,
            notes, addNote, clearNotes
        }}>
            {children}
        </AIContext.Provider>
    );
};

export const useAI = () => {
    const context = useContext(AIContext);
    if (context === undefined) {
        throw new Error('useAI must be used within an AIProvider');
    }
    return context;
};
