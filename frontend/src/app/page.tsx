'use strict';
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Cpu, 
  Terminal, 
  Users, 
  Activity, 
  Search, 
  Layers, 
  Briefcase, 
  ArrowRight,
  Compass
} from 'lucide-react';

export default function ElegantLandingPage() {
  const [sliderValue, setSliderValue] = useState(0);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSliderValue(parseInt(e.target.value));
  };

  // Sync scroll positioning with slider value
  useEffect(() => {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollToY = (sliderValue / 100) * scrollHeight;
    window.scrollTo({ top: scrollToY, behavior: 'auto' });
  }, [sliderValue]);

  // Sync slider value with scroll position
  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight > 0) {
        const val = Math.min(100, Math.max(0, (window.scrollY / scrollHeight) * 100));
        setSliderValue(val);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative min-h-screen w-full bg-[#1B263B] text-[#E0E1DD] flex flex-col items-center justify-between overflow-x-hidden font-sans select-none pb-8">
      
      {/* 1. Header Navigation Bar */}
      <header className="w-full sticky top-0 z-50 px-8 py-4 flex items-center justify-between border-b border-[#415A77] bg-[#0D1B2A] backdrop-blur-md">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="HireSense AI Logo" className="h-9 w-9 object-contain" />
          <span className="brand-font text-xl text-white">
            HireSense <span className="text-[#B3AF8F]">AI</span>
          </span>
        </div>
        <div className="border border-[#415A77] bg-[#1B263B] rounded-full px-4 py-1 text-[9px] tracking-[0.25em] uppercase font-mono text-[#B3AF8F]">
          Now in Beta
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-xs font-semibold text-[#E0E1DD]/70 hover:text-white transition-colors">
            Sign In
          </Link>
          <Link href="/register" className="px-4 py-1.5 rounded-lg bg-[#415A77] text-white text-xs font-bold hover:bg-[#34485f] transition-colors shadow-lg">
            Get Started
          </Link>
        </div>
      </header>

      {/* 2. Hero Content Section */}
      <main className="relative max-w-7xl mx-auto px-6 pt-24 pb-20 flex flex-col items-center text-center z-10 w-full">
        {/* Top Mini pill */}
        <div className="border border-[#415A77] bg-[#1B263B] backdrop-blur-md rounded-full px-4 py-1 text-[10px] tracking-[0.2em] uppercase font-mono text-[#415A77] mb-8 inline-flex items-center gap-2 font-bold">
          <Cpu className="h-3.5 w-3.5 text-[#415A77]" /> Introducing HireSense 2.0
        </div>

        {/* Large Typography */}
        <div className="relative max-w-4xl mb-6">
          <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-tight select-none text-[#E0E1DD]">
            The Next Generation
          </h1>
          <h2 className="text-5xl md:text-7xl font-black tracking-tight leading-tight select-none text-[#E0E1DD] mt-4">
            AI-Powered Recruitment
          </h2>
        </div>

        <p className="text-[#1B263B] font-semibold text-sm md:text-base max-w-2xl mb-12 leading-relaxed">
          Smarter parsing, real-time candidate Kanbans, secure multi-language code playground runtimes, and automated AI interview voice transcripts.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full max-w-md mb-28">
          <Link href="/login?role=CANDIDATE" className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#415A77] text-white font-bold hover:bg-[#a15666] transition-colors shadow-xl flex items-center justify-center gap-2 text-xs">
            Join as Candidate <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/login?role=RECRUITER" className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#1B263B] border border-[#415A77] text-white font-bold hover:bg-[#3b3d54] transition-all flex items-center justify-center gap-2 text-xs">
            Recruiter Portal <Briefcase className="h-4 w-4 text-[#B3AF8F]" />
          </Link>
        </div>

        {/* 3. Dashboard Preview Mockup (Slate Blue box on Warm Sand Canvas) */}
        <div className="w-full max-w-5xl rounded-2xl border border-[#415A77] bg-[#1B263B] p-6 shadow-2xl backdrop-blur-xl mb-24 text-white">
          <div className="flex items-center justify-between pb-4 border-b border-[#415A77] mb-4">
            <div className="flex gap-2">
              <span className="w-3 h-3 rounded-full bg-[#1B263B]" />
              <span className="w-3 h-3 rounded-full bg-[#1B263B]" />
              <span className="w-3 h-3 rounded-full bg-[#1B263B]" />
            </div>
            <div className="text-[10px] font-mono text-[#B3AF8F] px-3 py-1 rounded bg-[#1B263B]/60 border border-[#415A77]">
              dashboard.hiresense.ai
            </div>
            <div className="w-12" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-left">
            <div className="bg-[#1B263B] border border-[#415A77] rounded-xl p-4 md:col-span-1">
              <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">AI Candidate Search</div>
              <div className="h-8 rounded bg-[#1B263B] flex items-center px-2 text-xs text-gray-400 border border-[#415A77] mb-4 gap-2">
                <Search className="h-3.5 w-3.5 text-[#B3AF8F]" />
                "Find Java devs with Docker"
              </div>
              <div className="space-y-2">
                <div className="p-2 rounded bg-[#B3AF8F]/5 border border-[#B3AF8F]/15 flex justify-between items-center text-[10px]">
                  <span>Candidate A (Java/AWS)</span>
                  <span className="text-[#B3AF8F] font-bold">96%</span>
                </div>
                <div className="p-2 rounded bg-[#1B263B] border border-[#415A77] flex justify-between items-center text-[10px] opacity-80">
                  <span>Candidate B (Python/Docker)</span>
                  <span className="text-gray-455 font-bold">84%</span>
                </div>
              </div>
            </div>
            <div className="bg-[#1B263B] border border-[#415A77] rounded-xl p-4 md:col-span-3">
              <div className="flex justify-between items-center mb-6">
                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Active Kanban Funnel</div>
                <span className="px-2 py-0.5 rounded bg-[#415A77]/10 text-[#415A77] text-[9px] font-bold">Real-time STOMP</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-[#1B263B] p-2 rounded-lg border border-[#415A77] text-[10px]">
                  <div className="font-semibold text-gray-400 mb-2">Screening (2)</div>
                  <div className="p-2 rounded bg-[#1B263B] border border-[#415A77] mb-2">Sarah Connor</div>
                  <div className="p-2 rounded bg-[#1B263B] border border-[#415A77]">John Doe</div>
                </div>
                <div className="bg-[#1B263B] p-2 rounded-lg border border-[#415A77] text-[10px]">
                  <div className="font-semibold text-gray-400 mb-2">Interview (1)</div>
                  <div className="p-2 rounded bg-[#B3AF8F]/5 border border-[#B3AF8F]/15 text-[#B3AF8F]">Alex Mercer</div>
                </div>
                <div className="bg-[#1B263B] p-2 rounded-lg border border-[#415A77] text-[10px]">
                  <div className="font-semibold text-gray-400 mb-2">Offered (1)</div>
                  <div className="p-2 rounded bg-[#415A77]/5 border border-[#415A77]/15 text-[#415A77]">Elena Fisher</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Features Section */}
        <section id="features" className="w-full py-16 border-t border-[#415A77]">
          <h2 className="text-center text-[10px] font-bold text-[#415A77] uppercase tracking-widest mb-4">Enterprise Capabilities</h2>
          <h3 className="text-center text-3xl font-extrabold mb-16 text-[#E0E1DD]">Features Built to Impress</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="glass-card p-6 rounded-2xl">
              <Cpu className="h-8 w-8 text-[#B3AF8F] mb-6" />
              <h4 className="text-sm font-bold mb-2">AI Resume & Job Diff</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Compare resumes side-by-side with job descriptions using custom algorithms. Instantly list missing skills, grammar suggestions, and match metrics.
              </p>
            </div>
            <div className="glass-card p-6 rounded-2xl">
              <Layers className="h-8 w-8 text-[#B3AF8F] mb-6" />
              <h4 className="text-sm font-bold mb-2">pgvector Semantic Match</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Ditch regular keyword searches. Store high-dimensional embeddings in PostgreSQL and perform semantic matches with cosine similarity scores.
              </p>
            </div>
            <div className="glass-card p-6 rounded-2xl">
              <Terminal className="h-8 w-8 text-[#B3AF8F] mb-6" />
              <h4 className="text-sm font-bold mb-2">Docker Code Sandbox</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Execute user solutions safely inside isolated Docker containers (Java, Python, JS, C++). Configure strict limits on memory, CPU, and running time.
              </p>
            </div>
            <div className="glass-card p-6 rounded-2xl">
              <Activity className="h-8 w-8 text-[#B3AF8F] mb-6" />
              <h4 className="text-sm font-bold mb-2">AI Interview Replay</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Simulate HR and Technical interviews. Capture answers, compile transcripts, and evaluate communication, confidence, and weaknesses.
              </p>
            </div>
            <div className="glass-card p-6 rounded-2xl">
              <Users className="h-8 w-8 text-[#B3AF8F] mb-6" />
              <h4 className="text-sm font-bold mb-2">Real-Time Kanban</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Drag candidates across hiring pipeline stages. Action triggers Kafka events, pushing WebSocket updates to candidate profiles instantly.
              </p>
            </div>
            <div className="glass-card p-6 rounded-2xl">
              <Search className="h-8 w-8 text-[#B3AF8F] mb-6" />
              <h4 className="text-sm font-bold mb-2">Elasticsearch Indexing</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Index job postings, skills, and candidates in Elasticsearch for fast, full-text fuzzy queries, keeping system performance high.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* 5. Bottom Scroll indicator */}
      <div className="w-full max-w-xl text-center space-y-6 z-10 shrink-0 pb-12 px-4">
        <div className="space-y-1">
          <p className="text-[9px] tracking-[0.2em] font-bold text-gray-500 uppercase">
            THE NEXT GENERATION RECRUITMENT PLATFORM.
          </p>
          <p className="text-[9px] tracking-[0.15em] font-bold text-[#1B263B] uppercase">
            PERHAPS IT'S TIME TO SIGN{' '}
            <Link href="/login" className="underline text-[#E0E1DD] hover:text-[#B3AF8F] transition-colors">
              IN
            </Link>
            ?
          </p>
        </div>

        {/* Progress range bar */}
        <div className="relative w-full flex flex-col items-center gap-1.5 px-4">
          <div className="relative w-full h-1 bg-[#1B263B]/20 rounded-full">
            <div 
              className="absolute left-0 top-0 h-full bg-[#B3AF8F] rounded-full transition-all duration-75"
              style={{ width: `${sliderValue}%` }}
            />
            
            <input
              type="range"
              min="0"
              max="100"
              value={sliderValue}
              onChange={handleSliderChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            
            {/* Range Thumb knob */}
            <div 
              className="absolute top-1/2 -translate-y-1/2 h-4 w-4 rounded-full bg-[#B3AF8F] border border-[#415A77] shadow-md flex items-center justify-center transition-all duration-75 pointer-events-none"
              style={{ left: `calc(${sliderValue}% - 8px)` }}
            >
              <div className="h-1.5 w-1.5 rounded-full bg-white" />
            </div>
          </div>
          
          <div className="text-[8px] font-bold text-gray-550 tracking-widest uppercase">
            Drag to scroll page contents
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-[#415A77] w-full py-8 text-center text-[10px] text-gray-500 z-10">
        <div>&copy; {new Date().getFullYear()} HireSense AI. All rights reserved. Designed for Modern Teams.</div>
      </footer>
    </div>
  );
}
