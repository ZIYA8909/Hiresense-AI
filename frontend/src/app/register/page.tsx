'use strict';
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/Providers';
import { Lock, Mail, User, ArrowRight } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { login, user } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [infoMessage, setInfoMessage] = useState('');
  const [loading, setLoading] = useState(false);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setInfoMessage('');
    setLoading(true);

    // 1. Check offline localStorage registers list for duplicate candidate emails
    const localUsersStr = localStorage.getItem('hiresense_registered_users');
    let localUsers: any[] = [];
    if (localUsersStr) {
      try {
        localUsers = JSON.parse(localUsersStr);
      } catch (e) {
        localUsers = [];
      }
    }

    const emailLower = email.toLowerCase();
    const isMockDuplicate = emailLower === 'arjun.mehta@gmail.com' || emailLower === 'ananya.iyer@techcorp.com';
    const isLocalDuplicate = localUsers.some(u => u.email.toLowerCase() === emailLower);

    if (isMockDuplicate || isLocalDuplicate) {
      setError('An account with this email already exists. Please sign in instead.');
      setLoading(false);
      return;
    }

    try {
      // 2. Call Auth Service Gateway
      const res = await fetch('http://localhost:8080/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role: 'CANDIDATE' }),
      });

      if (!res.ok) {
        // Attempt to parse validation errors or duplicate errors
        const errText = await res.text();
        if (errText.toLowerCase().includes('already') || errText.toLowerCase().includes('exists')) {
          throw new Error('An account with this email already exists.');
        }
        throw new Error(errText || 'Registration failed. Check connection.');
      }

      const data = await res.json();
      
      // Save locally as fallback
      localUsers.push({ name, email, role: 'CANDIDATE' });
      localStorage.setItem('hiresense_registered_users', JSON.stringify(localUsers));

      setInfoMessage('Account created successfully! Logging you in...');
      
      setTimeout(() => {
        login({
          email: data.email || email,
          name: data.name || name,
          role: data.role || 'CANDIDATE',
          verified: data.verified || true,
          accessToken: data.accessToken || 'mock-jwt-registered-token',
        });
        router.push('/candidate/dashboard');
      }, 1500);

    } catch (err: any) {
      console.warn('[Register] API Gateway offline or duplicate. Checking fallback error:', err);
      
      if (err.message.includes('already exists')) {
        setError('An account with this email already exists. Please sign in instead.');
        setLoading(false);
        return;
      }

      // If backend is offline, perform simulated fallback registration
      const newCandidate = {
        email,
        name,
        role: 'CANDIDATE' as const,
        verified: true,
        accessToken: 'mock-jwt-token-' + Math.random().toString(36).substring(2),
      };

      // Push to fallback storage
      localUsers.push({ name, email, role: 'CANDIDATE' });
      localStorage.setItem('hiresense_registered_users', JSON.stringify(localUsers));

      setInfoMessage('Mock Registration successful! Redirecting to Candidate portal...');
      
      setTimeout(() => {
        login(newCandidate);
        router.push('/candidate/dashboard');
      }, 1500);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#1B263B] flex items-center justify-center px-4 overflow-hidden">
      
      <div className="w-full max-w-md glass-card rounded-2xl p-8 shadow-2xl relative z-10 text-left">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center justify-center mb-4">
            <img src="/logo.png" alt="HireSense AI Logo" className="h-14 w-14 object-contain" />
          </Link>
          <h2 className="text-2xl font-semibold tracking-tight text-white">Get Started with <span className="brand-font text-3xl text-[#B3AF8F]">HireSense</span></h2>
          <p className="text-[#E0E1DD]/60 text-sm mt-1">Create a new candidate account to search & apply</p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold leading-relaxed">
            ⚠️ {error}
          </div>
        )}

        {infoMessage && (
          <div className="mb-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-semibold">
            ✓ {infoMessage}
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#E0E1DD]/65 uppercase mb-2">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#1B263B] border border-[#415A77] rounded-lg py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#415A77] transition-colors"
                placeholder="e.g. Arjun Mehta"
              />
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
                className="w-full bg-[#1B263B] border border-[#415A77] rounded-lg py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#415A77] transition-colors"
                placeholder="your.email@example.com"
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
                className="w-full bg-[#1B263B] border border-[#415A77] rounded-lg py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#415A77] transition-colors"
                placeholder="Minimum 6 characters"
                minLength={6}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-[#415A77] hover:bg-[#34485f] text-white font-bold transition-all text-sm shadow-lg shadow-[#415A77]/10 flex items-center justify-center gap-2 mt-6"
          >
            {loading ? 'Creating Account...' : 'Sign Up & Get Started'} <ArrowRight className="h-4 w-4" />
          </button>

          <p className="text-[10px] text-center text-[#E0E1DD]/50 mt-4">
            Already have an account?{' '}
            <Link href="/login" className="text-[#B3AF8F] hover:underline font-bold">
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
