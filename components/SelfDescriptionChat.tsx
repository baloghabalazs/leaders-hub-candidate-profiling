
import React, { useState, useRef, useEffect } from 'react';
import { chatWithAI, ChatMessage } from '../services/chatService';

interface SelfDescriptionChatProps {
    apiKey: string;
    onComplete: (selfDescription: string) => void;
    onClose: () => void;
}

const SelfDescriptionChat: React.FC<SelfDescriptionChatProps> = ({ apiKey, onComplete, onClose }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            role: 'assistant',
            content: 'Szia! 👋 Segítek megfogalmazni, hogy ki vagy és hogyan kommunikálsz. Kezdjük! Hogyan jellemeznéd a kommunikációs stílusodat? (pl. közvetlen, barátságos, professzionális, laza)'
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: ChatMessage = { role: 'user', content: input.trim() };
        const updatedMessages = [...messages, userMessage];
        setMessages(updatedMessages);
        setInput('');
        setIsLoading(true);

        try {
            const aiResponse = await chatWithAI(updatedMessages, apiKey);

            // Check if AI has generated final self-description
            if (aiResponse.startsWith('KÉSZ:')) {
                const finalDescription = aiResponse.replace('KÉSZ:', '').trim();
                onComplete(finalDescription);
            } else {
                setMessages([...updatedMessages, { role: 'assistant', content: aiResponse }]);
            }
        } catch (error: any) {
            setMessages([...updatedMessages, {
                role: 'assistant',
                content: 'Sajnálom, hiba történt. Próbáld újra!'
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade">
            <div className="glass-card rounded-[2rem] w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl">
                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <div>
                        <h3 className="text-2xl font-black text-[#323d5a]">💬 AI Asszisztens</h3>
                        <p className="text-sm text-gray-400 font-medium mt-1">Segítek megfogalmazni magad</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-xl hover:bg-gray-100 flex items-center justify-center transition-all text-gray-400 hover:text-gray-600"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {messages.map((msg, idx) => (
                        <div
                            key={idx}
                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-[80%] px-5 py-3 rounded-2xl ${msg.role === 'user'
                                        ? 'hub-gradient-bg text-white shadow-lg shadow-blue-100'
                                        : 'bg-gray-50 text-gray-800 border border-gray-100'
                                    }`}
                            >
                                <p className="text-sm font-medium whitespace-pre-wrap">{msg.content}</p>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="bg-gray-50 px-5 py-3 rounded-2xl border border-gray-100">
                                <div className="flex gap-1">
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-6 border-t border-gray-100">
                    <div className="flex gap-3">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Írd be a válaszod..."
                            disabled={isLoading}
                            className="flex-1 px-5 py-3 rounded-2xl bg-white border border-gray-200 text-gray-800 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all shadow-sm text-sm font-medium"
                        />
                        <button
                            onClick={handleSend}
                            disabled={!input.trim() || isLoading}
                            className={`px-6 py-3 rounded-2xl font-bold text-sm transition-all ${input.trim() && !isLoading
                                    ? 'hub-gradient-bg text-white shadow-lg shadow-blue-100 hover:scale-105'
                                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                }`}
                        >
                            Küldés
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SelfDescriptionChat;
