import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAI } from '../AIContext';
import './AIAssistant.css';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
}

const AIAssistant: React.FC = () => {
    const { currentPost, setHighlightedSection } = useAI();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', role: 'assistant', content: 'こんにちは！統計学やPythonについて何かお手伝いできることはありますか？' }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg: Message = { id: Date.now().toString(), role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        // AI Response Simulation
        setTimeout(() => {
            let response = 'すみません、その点については現在の私の知識では詳しくお答えできませんが、記事の要約や関連用語の解説ならお手伝いできます！';

            const lowerInput = input.toLowerCase();
            if (currentPost) {
                if (lowerInput.includes('要約') || lowerInput.includes('まとめて')) {
                    response = `${currentPost.title}の内容をスキャニングして要約しました。重要なポイントは「${currentPost.excerpt}」です。`;
                    setHighlightedSection('header');
                } else if (lowerInput.includes('コード') || lowerInput.includes('実装') || lowerInput.includes('python') || lowerInput.includes('r')) {
                    response = '実装方法についてですね。この記事に含まれるコード部分を強調表示しました。この箇所を重点的に確認してみてください。';
                    setHighlightedSection('code');
                } else if (lowerInput.includes('難しい') || lowerInput.includes('仕組み') || lowerInput.includes('概要')) {
                    response = 'この概念を理解するために、記事の構成を見直してみましょう。主要なセクションをハイライトしました。';
                    setHighlightedSection('content');
                }
            }

            const assistantMsg: Message = { id: (Date.now() + 1).toString(), role: 'assistant', content: response };
            setMessages(prev => [...prev, assistantMsg]);
            setIsTyping(false);
        }, 1200);
    };

    return (
        <>
            <button className={`ai-fab ${isOpen ? 'active' : ''}`} onClick={() => setIsOpen(!isOpen)}>
                <span className="ai-fab-icon">🧠</span>
                <span className="ai-fab-glow"></span>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="ai-chat-drawer"
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    >
                        <div className="ai-chat-header">
                            <div className="ai-status">
                                <span className="pulse-dot"></span>
                                AI Assistant Online
                            </div>
                            <button className="close-btn" onClick={() => setIsOpen(false)}>&times;</button>
                        </div>

                        <div className="ai-messages">
                            {messages.map(msg => (
                                <div key={msg.id} className={`message-bubble ${msg.role}`}>
                                    {msg.content}
                                </div>
                            ))}
                            {isTyping && <div className="message-bubble assistant typing">...</div>}
                            <div ref={messagesEndRef} />
                        </div>

                        <div className="ai-input-area">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="質問を入力..."
                                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            />
                            <button onClick={handleSend}>送信</button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default AIAssistant;
