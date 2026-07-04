'use strict';
'use client';

import React, { useState, useRef, useEffect } from 'react';
import CandidateLayout from '@/components/CandidateLayout';
import { 
  MessageSquare, 
  Send, 
  Sparkles, 
  Cpu,
  User, 
  BookOpen, 
  HelpCircle 
} from 'lucide-react';

interface ChatMessage {
  id: number;
  sender: 'COACH' | 'CANDIDATE';
  text: string;
}

export default function CareerCoach() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      sender: 'COACH',
      text: 'Hello! I am your HireSense Career Coach. Ask me anything about resume reviews, target job search suggestions, learning roadmaps, or interview tips!'
    }
  ]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    { text: 'Create a learning roadmap to transition from Java to Cloud Architecture.', icon: BookOpen },
    { text: 'How do I explain microservice process isolation using Docker in an interview?', icon: HelpCircle },
    { text: 'Show me projects showcasing event-driven architecture using Kafka.', icon: Sparkles }
  ];

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (textToSend: string) => {
    const prompt = textToSend.trim();
    if (!prompt) return;

    // Add user message
    const userMsgId = Date.now();
    setMessages(prev => [...prev, { id: userMsgId, sender: 'CANDIDATE', text: prompt }]);
    setInput('');
    setSending(true);

    try {
      // Connect to ai-service /ai/chat/coach via gateway (port 8080)
      const res = await fetch('http://localhost:8080/ai/chat/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: prompt
      });

      if (!res.ok) {
        throw new Error('API down');
      }

      const responseText = await res.text();
      setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'COACH', text: responseText }]);
    } catch (err) {
      console.warn('[Coach] Spring Boot gateway offline. Trying Next.js direct Gemini route...');
      try {
        const localRes = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain' },
          body: prompt
        });

        if (!localRes.ok) {
          throw new Error('Local API failed');
        }

        const localReply = await localRes.text();
        setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'COACH', text: localReply }]);
      } catch (localErr) {
        console.warn('[Coach] Offline fallback simulation activated.');
        setTimeout(() => {
          let reply = "That is a great question! To demonstrate that, I recommend building a project containing individual services talking via a Kafka broker. Run them inside CPU/RAM restricted Docker containers to show isolation.";
          if (prompt.toLowerCase().includes('roadmap')) {
            reply = "Here is a personalized roadmap:\n\n1. **Docker Runtimes** (1 week): Practice creating multi-stage Dockerfiles and container memory configurations.\n2. **Cloud Orchestration** (2 weeks): Learn AWS S3 file streaming and PGVector integration.\n3. **Event Streaming** (2 weeks): Build event-driven loggers with Apache Kafka.";
          }
          setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'COACH', text: reply }]);
        }, 1000);
      }
    } finally {
      setSending(false);
    }
  };

  return (
    <CandidateLayout>
      <div className="max-w-6xl mx-auto h-[calc(100vh-12rem)] flex gap-6 overflow-hidden">
        {/* Chat box */}
        <div className="flex-1 flex flex-col border border-[#415A77] bg-[#0B0F19]/40 rounded-2xl overflow-hidden min-h-0">
          {/* Header */}
          <div className="flex items-center gap-2 px-6 py-4 border-b border-[#415A77] bg-[#1B263B]/40 text-xs font-bold text-gray-500 uppercase tracking-widest shrink-0">
            <Cpu className="h-4.5 w-4.5 text-emerald-400" />
            Active Coaching Session
          </div>

          {/* Dialogue display */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4 min-h-0">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex gap-3 max-w-[80%] ${msg.sender === 'CANDIDATE' ? 'ml-auto flex-row-reverse' : ''}`}
              >
                <div className={`h-8 w-8 rounded-lg shrink-0 flex items-center justify-center border text-xs ${
                  msg.sender === 'CANDIDATE' 
                    ? 'bg-emerald-500/10 border-emerald-500/15 text-emerald-400' 
                    : 'bg-[#1B263B] border-[#415A77] text-indigo-400'
                }`}>
                  {msg.sender === 'CANDIDATE' ? <User className="h-4 w-4" /> : <MessageSquare className="h-4 w-4" />}
                </div>

                <div className={`p-4 rounded-2xl text-xs leading-relaxed whitespace-pre-line ${
                  msg.sender === 'CANDIDATE'
                    ? 'bg-emerald-500 text-black font-semibold'
                    : 'bg-[#1B263B] border border-[#415A77]/60 text-gray-300'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {sending && (
              <div className="flex gap-3 max-w-[80%]">
                <div className="h-8 w-8 rounded-lg bg-[#1B263B] border border-[#415A77] flex items-center justify-center text-indigo-400">
                  <MessageSquare className="h-4 w-4" />
                </div>
                <div className="p-4 rounded-2xl bg-[#1B263B]/50 border border-[#415A77] text-xs text-gray-600 animate-pulse">
                  Coach is typing...
                </div>
              </div>
            )}
            <div ref={scrollRef} />
          </div>

          {/* Text Input */}
          <div className="p-4 border-t border-[#415A77] bg-[#1B263B]/20 shrink-0">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
                className="flex-1 bg-[#1B263B] border border-[#415A77] rounded-xl py-3 px-4 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500 transition-colors"
                placeholder="Ask me anything..."
              />
              <button
                onClick={() => handleSend(input)}
                disabled={sending || !input.trim()}
                className="px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black font-bold text-xs flex items-center justify-center gap-1 shadow-md shadow-emerald-500/10"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Quick Prompts Panel */}
        <div className="w-80 shrink-0 flex flex-col gap-4 overflow-y-auto max-h-full">
          <div className="glass-card p-5 rounded-2xl">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-1.5">
              <Sparkles className="h-4.5 w-4.5 text-emerald-400 animate-pulse" />
              Quick Prompts
            </h3>
            
            <div className="space-y-2.5">
              {quickPrompts.map((p, index) => {
                const Icon = p.icon;
                return (
                  <button
                    key={index}
                    onClick={() => handleSend(p.text)}
                    disabled={sending}
                    className="w-full p-4 rounded-xl border border-[#415A77] bg-[#1B263B]/20 text-left text-xs text-gray-400 hover:text-white hover:border-emerald-500/20 hover:bg-emerald-500/5 transition-all flex gap-3 items-start leading-relaxed"
                  >
                    <Icon className="h-4.5 w-4.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{p.text}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </CandidateLayout>
  );
}
