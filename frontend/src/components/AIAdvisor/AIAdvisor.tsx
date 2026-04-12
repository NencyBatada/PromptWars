import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, Send, Sparkles } from 'lucide-react';
import { fetchAdvisorResponse } from '../../services/api';
import './AIAdvisor.css';

interface ChatMessage {
  role: 'user' | 'ai';
  text: string;
}

const AIAdvisor: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Focus input when drawer opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  // Keyboard trap for drawer (Escape to close)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleSend = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || isTyping) return;

    setMessages(prev => [...prev, { role: 'user', text: trimmed }]);
    setInput('');
    setIsTyping(true);

    try {
      const data = await fetchAdvisorResponse(trimmed, 'general');
      setMessages(prev => [...prev, { role: 'ai', text: data.response }]);
    } catch {
      setMessages(prev => [...prev, { role: 'ai', text: "Sorry, I'm having trouble connecting right now. Please try again." }]);
    } finally {
      setIsTyping(false);
    }
  }, [input, isTyping]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  return (
    <>
      <button
        className="ai-trigger"
        onClick={() => setIsOpen(true)}
        aria-label="Open AI Financial Advisor chat"
        id="aiTriggerBtn"
      >
        <Bot size={24} aria-hidden="true" />
        <span>Ask AI</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={drawerRef}
            initial={{ opacity: 0, x: 400 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 400 }}
            className="ai-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="AI Financial Advisor"
            id="aiAdvisorDrawer"
          >
            <div className="ai-header">
              <div className="ai-title">
                <Sparkles size={20} className="sparkle" aria-hidden="true" />
                <h3 id="aiAdvisorTitle">FinWise AI Advisor</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="close-btn"
                aria-label="Close AI Advisor"
                id="aiCloseBtn"
              >
                <X size={20} aria-hidden="true" />
              </button>
            </div>

            <div
              className="ai-messages"
              role="log"
              aria-live="polite"
              aria-label="Chat messages"
              id="aiMessages"
            >
              {messages.length === 0 && (
                <div className="ai-empty">
                  <p>Hello! I'm your financial advisor. How can I help you today?</p>
                </div>
              )}
              {messages.map((m, i) => (
                <div key={i} className={`msg ${m.role}`}>
                  <div className="msg-bubble" aria-label={m.role === 'user' ? 'Your message' : 'AI response'}>
                    {m.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="typing" aria-live="assertive" role="status">
                  Advisor is typing...
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="ai-input">
              <label htmlFor="aiChatInput" className="sr-only">Type your financial question</label>
              <input
                ref={inputRef}
                id="aiChatInput"
                type="text"
                placeholder="Type your question..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                aria-label="Type your financial question"
                autoComplete="off"
                maxLength={500}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                aria-label="Send message"
                id="aiSendBtn"
              >
                <Send size={18} aria-hidden="true" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIAdvisor;
