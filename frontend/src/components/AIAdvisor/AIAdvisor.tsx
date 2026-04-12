import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, Send, Sparkles } from 'lucide-react';
import './AIAdvisor.css';

const AIAdvisor: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', text: string }[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsTyping(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
      const res = await fetch(`${apiUrl}/advisor`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg, context: { topic: 'general' } })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'ai', text: data.response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', text: "Sorry, I'm having trouble connecting right now." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      <button className="ai-trigger" onClick={() => setIsOpen(true)}>
        <Bot size={24} />
        <span>Ask AI</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, x: 400 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 400 }}
            className="ai-drawer"
          >
            <div className="ai-header">
              <div className="ai-title">
                <Sparkles size={20} className="sparkle" />
                <h3>FinWise AI Advisor</h3>
              </div>
              <button onClick={() => setIsOpen(false)} className="close-btn">
                <X size={20} />
              </button>
            </div>

            <div className="ai-messages">
              {messages.length === 0 && (
                <div className="ai-empty">
                  <p>Hello! I'm your financial advisor. How can I help you today?</p>
                </div>
              )}
              {messages.map((m, i) => (
                <div key={i} className={`msg ${m.role}`}>
                  <div className="msg-bubble">{m.text}</div>
                </div>
              ))}
              {isTyping && <div className="typing">Advisor is typing...</div>}
            </div>

            <div className="ai-input">
              <input 
                type="text" 
                placeholder="Type your question..." 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              />
              <button onClick={handleSend} disabled={!input.trim()}>
                <Send size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIAdvisor;
