'use strict';
'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/Providers';
import { Lock, Mail, ArrowRight } from 'lucide-react';

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, user } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'CANDIDATE' | 'RECRUITER' | 'ADMIN'>('CANDIDATE');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Sync role from query parameters if present
  useEffect(() => {
    const roleParam = searchParams.get('role');
    if (roleParam === 'CANDIDATE' || roleParam === 'RECRUITER' || roleParam === 'ADMIN') {
      setRole(roleParam as any);
    }
  }, [searchParams]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Connect to auth-service /auth/login via gateway (port 8080)
      const res = await fetch('http://localhost:8080/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        throw new Error('Authentication failed. Check your credentials.');
      }

      const data = await res.json();
      login({
        email: data.email,
        name: data.name,
        role: data.role,
        verified: data.verified,
        accessToken: data.accessToken,
      });
    } catch (err: any) {
      console.warn('[Login] API Gateway offline. Trying local mock credentials...');
      
      // Fallback check to let user enter the dashboard offline
      if (email === 'arjun.mehta@gmail.com' && password === 'password123') {
        login({
          email: 'arjun.mehta@gmail.com',
          name: 'Arjun Mehta',
          role: 'CANDIDATE',
          verified: true,
          accessToken: 'mock-jwt-token-arjun-mehta',
        });
        router.push('/candidate/dashboard');
      } else if (email === 'ananya.iyer@techcorp.com' && password === 'password123') {
        login({
          email: 'ananya.iyer@techcorp.com',
          name: 'Ananya Iyer',
          role: 'RECRUITER',
          verified: true,
          accessToken: 'mock-jwt-token-ananya-iyer',
        });
        router.push('/recruiter/dashboard');
      } else {
        setError('Authentication failed. Please verify credentials.');
        setLoading(false);
      }
    }
  };

  return (
    <div className="relative min-h-screen bg-[#1B263B] flex items-center justify-center px-4 overflow-hidden">

      <div className="w-full max-w-md glass-card rounded-2xl p-8 shadow-2xl relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center justify-center mb-4">
            <img src="/logo.png" alt="HireSense AI Logo" className="h-14 w-14 object-contain" />
          </Link>
          <h2 className="text-2xl font-semibold tracking-tight text-white">Sign in to <span className="brand-font text-3xl text-[#B3AF8F]">HireSense</span></h2>
          <p className="text-[#E0E1DD]/60 text-sm mt-1">Enter your details or select a quick login</p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium">
            {error}
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div>
            <label className="block text-xs font-bold text-[#E0E1DD]/65 uppercase mb-2">Role Mode</label>
            <div className="grid grid-cols-2 gap-2 bg-[#1B263B] p-1 rounded-lg border border-[#415A77]">
              <button
                type="button"
                onClick={() => setRole('CANDIDATE')}
                className={`py-1.5 text-xs font-bold rounded-md transition-all ${role === 'CANDIDATE' ? 'bg-[#415A77] text-white shadow-sm' : 'text-gray-400 hover:text-white'}`}
              >
                Candidate
              </button>
              <button
                type="button"
                onClick={() => setRole('RECRUITER')}
                className={`py-1.5 text-xs font-bold rounded-md transition-all ${role === 'RECRUITER' ? 'bg-[#B3AF8F] text-black shadow-sm' : 'text-gray-400 hover:text-white'}`}
              >
                Recruiter
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#E0E1DD]/65 uppercase mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full bg-[#1B263B] border border-[#415A77] rounded-lg py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-600 focus:outline-none transition-colors ${role === 'CANDIDATE' ? 'focus:border-[#415A77]' : 'focus:border-[#B3AF8F]'}`}
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#E0E1DD]/65 uppercase mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full bg-[#1B263B] border border-[#415A77] rounded-lg py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-600 focus:outline-none transition-colors ${role === 'CANDIDATE' ? 'focus:border-[#415A77]' : 'focus:border-[#B3AF8F]'}`}
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-bold transition-all text-sm flex items-center justify-center gap-2 mt-6 ${role === 'CANDIDATE' ? 'bg-[#415A77] hover:bg-[#a15666] text-white shadow-lg shadow-[#415A77]/10' : 'bg-[#B3AF8F] hover:bg-[#ab8920] text-black shadow-lg shadow-[#B3AF8F]/10'}`}
          >
            {loading ? 'Signing in...' : 'Sign In'} <ArrowRight className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginPageContent />
    </Suspense>
  );
}
