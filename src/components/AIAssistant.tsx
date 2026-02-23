import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAI } from '../AIContext';
import './AIAssistant.css';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
}

const KNOWLEDGE_BASE: Record<string, string> = {
    'ホワイトノイズ': 'ホワイトノイズ（White Noise）は、統計学や時系列解析において非常に重要な概念です。\n\n1. **期待値が0**: $E[\\epsilon_t] = 0$\n2. **分散が一定**: $Var(\\epsilon_t) = \\sigma^2$\n3. **自己相関が0**: 異なる時点間での相関がありません ($Cov(\\epsilon_t, \\epsilon_s) = 0$ for $t \\neq s$)\n\nつまり、過去の情報から未来を予測できない「完全なランダム」な状態を指します。',
    'p値': 'P値（p-value）は、帰無仮説が正しいと仮定したとき、観察されたデータ（またはそれ以上に極端なデータ）が得られる確率のことです。一般的に0.05（5%）を下回ると「統計的に有意である」と判断されます。',
    '有意': '統計的に有意とは、観察された差が単なる偶然（誤差）ではなく、何らかの背景要因によって生じた可能性が高いと判断される状態です。通常P値を用いて判定します。',
    '期待値': '期待値（Expected Value）は、確率変数が取る値の「平均的な見込み値」です。各値にその発生確率を掛けて合計したもので、サイコロであれば3.5になります。',
    '分散': '分散（Variance）は、データの「バラツキ」を表す指標です。各データと平均値の差（偏差）を2乗し、その平均を取ることで計算されます。分散が大きいほど、データが広く散らばっていることを意味します。',
    '中心極限定理': '中心極限定理は、「どんな分布からサンプリングしても、サンプルサイズが十分に大きければ、標本平均の分布は正規分布に近づく」という魔法のような定理です。これが統計学の推論の基盤になっています。',
    'ベイズ': 'ベイズ統計は、データが得られる前に設定した「事前確率」を、新しいデータを得るたびに「事後確率」として更新していく考え方です。',
};

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
            let response = '';

            const lowerInput = input.toLowerCase();

            // 1. Check Knowledge Base first
            const matchedKey = Object.keys(KNOWLEDGE_BASE).find(key =>
                lowerInput.includes(key.toLowerCase())
            );

            if (matchedKey) {
                response = KNOWLEDGE_BASE[matchedKey];
            }
            // 2. Check current post context
            else if (currentPost) {
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

            if (!response) {
                response = 'すみません、その点については現在の私の知識では詳しくお答えできませんが、ホワイトノイズや分散、P値などの統計用語についてなら詳しく解説できます！';
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
