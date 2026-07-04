'use strict';
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/components/Providers';
import { 
  Home, 
  Briefcase, 
  Columns, 
  LogOut, 
  User, 
  Bell, 
  Compass
} from 'lucide-react';

export default function RecruiterLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const navItems = [
    { name: 'Dashboard', href: '/recruiter/dashboard', icon: Home },
    { name: 'Job Openings', href: '/recruiter/jobs', icon: Briefcase },
    { name: 'Kanban Funnel', href: '/recruiter/kanban', icon: Columns },
  ];

  return (
    <div className="flex h-screen bg-[#1B263B] overflow-hidden text-gray-100 p-4">
      {/* Hover-to-Expand Floating Capsule Sidebar */}
      <aside 
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
        className={`flex flex-col justify-between py-6 rounded-3xl bg-[#1B263B] border border-[#415A77] shadow-2xl shadow-[#0D1B2A]/50 shrink-0 transition-all duration-300 ease-in-out ${
          isExpanded ? 'w-64 px-4 items-start' : 'w-20 px-2 items-center'
        }`}
      >
        
        {/* Top Logo branding */}
        <div className={`flex items-center gap-3 ${isExpanded ? 'px-2' : ''}`}>
          <img src="/logo.png" alt="HireSense AI" className="h-10 w-10 object-contain shrink-0" />
          {isExpanded && (
            <span className="brand-font text-base text-white animate-in fade-in duration-200">
              HireSense <span className="text-[#B3AF8F]">AI</span>
            </span>
          )}
        </div>

        {/* Navigation circle icons / expanded items */}
        <nav className="flex flex-col gap-4 w-full">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                title={item.name}
                className={`flex items-center transition-all ${
                  isExpanded ? 'w-full px-4 py-2.5 rounded-2xl gap-3' : 'h-11 w-11 justify-center rounded-full'
                } ${
                  isActive 
                    ? 'bg-[#B3AF8F] text-black scale-105 shadow-lg shadow-[#B3AF8F]/20' 
                    : 'text-gray-400 hover:text-white hover:bg-[#1B263B]/20'
                }`}
              >
                <Icon className={`h-5 w-5 shrink-0 ${isActive ? 'text-black' : 'text-[#415A77]'}`} />
                {isExpanded && (
                  <span className="text-xs font-extrabold whitespace-nowrap animate-in fade-in duration-200">
                    {item.name}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User profile & Logout footer */}
        <div className={`flex flex-col gap-3 w-full ${isExpanded ? 'px-2' : 'items-center'}`}>
          <div className="flex items-center gap-3 w-full">
            <div className="h-8 w-8 rounded-full bg-[#1B263B] border border-[#415A77] flex items-center justify-center text-[#B3AF8F] shrink-0">
              <User className="h-4 w-4" />
            </div>
            {isExpanded && (
              <div className="overflow-hidden animate-in fade-in duration-200 text-left">
                <div className="text-xs font-bold text-white truncate">{user?.name || 'Ananya Iyer'}</div>
                <div className="text-[10px] text-gray-450 truncate">{user?.email || 'ananya.iyer@techcorp.com'}</div>
              </div>
            )}
          </div>
          
          <button
            onClick={handleLogout}
            title="Sign Out"
            className={`flex items-center transition-all ${
              isExpanded 
                ? 'w-full px-4 py-2.5 rounded-2xl gap-3 bg-red-950/20 hover:bg-red-950/40 text-red-400 border border-red-900/30 font-bold text-xs justify-start' 
                : 'h-10 w-10 rounded-full justify-center bg-red-950/20 hover:bg-red-950/40 text-red-400 border border-red-900/30'
            }`}
          >
            <LogOut className="h-4.5 w-4.5 shrink-0" />
            {isExpanded && <span className="animate-in fade-in duration-200">Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden pl-4">
        {/* Top Header */}
        <header className="h-16 glass-panel border border-[#415A77] rounded-2xl px-6 flex items-center justify-between shrink-0 mb-4 bg-[#1B263B]">
          <div className="text-xs font-bold text-[#415A77] uppercase tracking-widest">
            {navItems.find((item) => item.href === pathname)?.name || 'Recruiter'}
          </div>
          
          {/* Shortcut Buttons */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="px-3.5 py-1.5 rounded-lg border border-[#415A77] bg-[#1B263B] hover:border-[#415A77] text-gray-300 hover:text-white text-[11px] font-bold transition-all flex items-center gap-1.5"
            >
              <Compass className="h-3.5 w-3.5 text-[#B3AF8F]" />
              Landing Page
            </Link>
            
            <Link
              href="/recruiter/dashboard"
              className="px-3.5 py-1.5 rounded-lg bg-[#B3AF8F] hover:bg-[#ab8920] text-black font-bold text-[11px] transition-all flex items-center gap-1.5 shadow-md shadow-[#B3AF8F]/10"
            >
              <Home className="h-3.5 w-3.5 text-black" />
              Home Page
            </Link>
            
            <span className="w-px h-6 bg-[#1B263B] mx-1" />

            <button className="relative p-2 rounded-lg bg-[#1B263B] border border-[#415A77] hover:bg-[#1B263B] transition-all text-gray-400 hover:text-white">
              <Bell className="h-4 w-4 text-[#415A77]" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[#415A77]" />
            </button>
            <div className="px-2.5 py-1 rounded bg-[#415A77]/10 border border-[#415A77]/20 text-[#415A77] text-[10px] font-bold uppercase tracking-wide">
              Recruiter
            </div>
          </div>
        </header>

        {/* Content body */}
        <main className="flex-1 overflow-y-auto p-4 bg-[#1B263B] relative rounded-2xl border border-[#415A77]">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#B3AF8F]/5 blur-[100px] pointer-events-none rounded-full" />
          {children}
        </main>
      </div>
    </div>
  );
}
