import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Post } from './types';

interface AIContextType {
    currentPost: Post | null;
    setCurrentPost: (post: Post | null) => void;
    highlightedSection: string | null;
    setHighlightedSection: (section: string | null) => void;
}

const AIContext = createContext<AIContextType | undefined>(undefined);

export const AIProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [currentPost, setCurrentPost] = useState<Post | null>(null);
    const [highlightedSection, setHighlightedSection] = useState<string | null>(null);

    return (
        <AIContext.Provider value={{ currentPost, setCurrentPost, highlightedSection, setHighlightedSection }}>
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
