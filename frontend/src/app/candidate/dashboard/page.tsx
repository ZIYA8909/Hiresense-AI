'use strict';
'use client';

import React, { useState, useEffect } from 'react';
import CandidateLayout from '@/components/CandidateLayout';
import { useAuth } from '@/components/Providers';
import QuickApplyModal from '@/components/QuickApplyModal';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { 
  FileText, 
  Calendar, 
  TrendingUp, 
  Briefcase, 
  MapPin, 
  Zap,
  Check,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface Application {
  id: number;
  jobTitle: string;
  companyName: string;
  location: string;
  status: 'APPLIED' | 'SCREENING' | 'INTERVIEW' | 'OFFER' | 'REJECTED';
  atsScore: number;
  appliedDate: string;
}

export default function CandidateDashboard() {
  const { user } = useAuth();
  
  // Default mock applications
  const [applications, setApplications] = useState<Application[]>([
    {
      id: 1,
      jobTitle: 'Software Engineer',
      companyName: 'Tech Corp',
      location: 'San Francisco, CA (Remote)',
      status: 'SCREENING',
      atsScore: 85,
      appliedDate: '2026-07-01',
    },
    {
      id: 2,
      jobTitle: 'Backend Developer (Java)',
      companyName: 'Finance Solutions',
      location: 'New York, NY (Hybrid)',
      status: 'APPLIED',
      atsScore: 78,
      appliedDate: '2026-07-03',
    }
  ]);

  const [jobs, setJobs] = useState<any[]>([
    {
      id: 1,
      title: 'Fullstack Developer',
      company: { name: 'Tech Corp' },
      location: 'Bengaluru, India (Remote)',
      salaryRange: '₹12L - ₹18L',
      workType: 'REMOTE'
    },
    {
      id: 2,
      title: 'Senior Java Backend Engineer',
      company: { name: 'Fintech Solutions' },
      location: 'Mumbai, India (Hybrid)',
      salaryRange: '₹18L - ₹25L',
      workType: 'HYBRID'
    }
  ]);

  const [wsMessage, setWsMessage] = useState<string>('');
  const [selectedTrackAppId, setSelectedTrackAppId] = useState<number | null>(null);

  // Apply Wizard State
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [selectedJobForApply, setSelectedJobForApply] = useState<any>(null);

  useEffect(() => {
    const loadRealApplications = async () => {
      try {
        const res = await fetch('http://localhost:8080/recruitment/applications/candidate/1');
        if (!res.ok) {
          throw new Error('Database server offline');
        }
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const mapped = data.map((app: any) => ({
            id: app.id,
            jobTitle: app.job?.title || 'Software Engineer',
            companyName: app.job?.company?.name || 'Tech Corp',
            location: app.job?.location || 'Remote',
            status: app.status || 'APPLIED',
            atsScore: app.atsScore || 0,
            appliedDate: app.createdAt ? app.createdAt.substring(0, 10) : '2026-07-04',
          }));
          setApplications(mapped);
        }
      } catch (err) {
        console.warn('[Dashboard] Microservices database offline. Defaulting to local offline mock records.', err);
      }
    };

    const loadRealJobs = async () => {
      try {
        const res = await fetch('http://localhost:8080/recruitment/jobs');
        if (!res.ok) {
          throw new Error('Jobs server offline');
        }
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setJobs(data);
          return;
        }
        throw new Error('Empty jobs list from server');
      } catch (err) {
        console.warn('[Dashboard] Jobs server offline/empty. Trying localStorage custom jobs fallback...', err);
        const savedCustomJobs = localStorage.getItem('hiresense_custom_jobs');
        if (savedCustomJobs) {
          try {
            setJobs(JSON.parse(savedCustomJobs));
          } catch (e) {
            // Keep default mockJobs state
          }
        }
      }
    };

    loadRealApplications();
    loadRealJobs();
  }, []);

  useEffect(() => {
    if (!user) return;

    // Connect to WebSocket gateway / STOMP broker
    try {
      const socket = new SockJS('http://localhost:8080/ws-notifications');
      const stompClient = new Client({
        webSocketFactory: () => socket,
        reconnectDelay: 5000,
        debug: (str) => console.log('[STOMP] ' + str),
      });

      stompClient.onConnect = () => {
        console.log('[STOMP] Connected to notification broker.');
        
        stompClient.subscribe(`/user/${user.email}/queue/notifications`, (message) => {
          try {
            const event = JSON.parse(message.body);
            console.log('[STOMP] Received notification event:', event);
            
            setWsMessage(`Status Updated: Your application for ${event.data.jobTitle} is now in ${event.data.status} stage!`);
            
            setApplications(prev => prev.map(app => {
              if (app.id === Number(event.data.applicationId) || app.jobTitle === event.data.jobTitle) {
                return { ...app, status: event.data.status };
              }
              return app;
            }));
          } catch (e) {
            console.error('Error parsing notification event body:', e);
          }
        });
      };

      stompClient.activate();

      return () => {
        stompClient.deactivate();
      };
    } catch (wsError) {
      console.warn('STOMP broker is offline. Running without live WebSocket notifications.', wsError);
    }
  }, [user]);

  const handleOpenApplyModal = (job: any) => {
    setSelectedJobForApply(job);
    setIsApplyModalOpen(true);
  };

  const handleApplySuccess = (newApp: any) => {
    setApplications(prev => {
      // Check if already in list
      if (prev.some(a => a.jobTitle === newApp.jobTitle && a.companyName === newApp.companyName)) {
        return prev;
      }
      return [newApp, ...prev];
    });
    setIsApplyModalOpen(false);
  };

  const getStageActiveIndex = (status: string) => {
    switch (status) {
      case 'APPLIED': return 0;
      case 'SCREENING': return 1;
      case 'INTERVIEW': return 2;
      case 'OFFER': return 3;
      case 'HIRED': return 4;
      default: return 0;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPLIED': return 'border-[#415A77]/35 text-[#415A77] bg-[#415A77]/5';
      case 'SCREENING': return 'border-[#B3AF8F]/35 text-[#B3AF8F] bg-[#B3AF8F]/5';
      case 'INTERVIEW': return 'border-[#415A77] text-[#1B263B] bg-[#1B263B]/5';
      case 'OFFER': return 'border-[#B3AF8F]/35 text-[#B3AF8F] bg-[#B3AF8F]/5';
      case 'REJECTED': return 'border-[#415A77]/35 text-[#415A77] bg-[#415A77]/5';
      default: return 'border-[#415A77] text-[#1B263B] bg-[#1B263B]/5';
    }
  };

  return (
    <CandidateLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        
        {wsMessage && (
          <div className="p-4 rounded-xl border border-[#415A77]/20 bg-[#415A77]/5 flex gap-3 items-center text-xs text-[#415A77] animate-pulse">
            <Zap className="h-4.5 w-4.5 text-[#415A77] shrink-0" />
            <span>{wsMessage}</span>
            <button onClick={() => setWsMessage('')} className="ml-auto text-[#415A77] font-bold hover:underline">Dismiss</button>
          </div>
        )}

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card p-6 rounded-2xl flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-[#E0E1DD]/50 uppercase tracking-widest mb-1">Active Job Pipelines</div>
              <div className="text-3xl font-black text-white">{applications.length}</div>
            </div>
            <div className="h-12 w-12 rounded-xl bg-[#415A77]/10 flex items-center justify-center text-[#415A77] border border-[#415A77]/10">
              <Briefcase className="h-5 w-5" />
            </div>
          </div>

          <div className="glass-card p-6 rounded-2xl flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-[#E0E1DD]/50 uppercase tracking-widest mb-1">ATS Profile Score</div>
              <div className="text-3xl font-black text-white">85%</div>
            </div>
            <div className="h-12 w-12 rounded-xl bg-[#B3AF8F]/10 flex items-center justify-center text-[#B3AF8F] border border-[#B3AF8F]/10">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>

          <div className="glass-card p-6 rounded-2xl flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-[#E0E1DD]/50 uppercase tracking-widest mb-1">Upcoming Interviews</div>
              <div className="text-3xl font-black text-white">1</div>
            </div>
            <div className="h-12 w-12 rounded-xl bg-[#1B263B]/20 flex items-center justify-center text-[#1B263B] border border-[#415A77]">
              <Calendar className="h-5 w-5" />
            </div>
          </div>
        </div>

        {/* Explore Job Openings Section */}
        <div className="glass-card p-6 rounded-2xl space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-[#415A77]/60">
            <h2 className="text-lg font-bold flex items-center gap-2 text-white">
              <Zap className="h-4.5 w-4.5 text-[#415A77]" /> Explore Job Openings
            </h2>
            <span className="text-xs font-semibold text-[#E0E1DD]/60 uppercase tracking-widest">Active Jobs</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {jobs.map((job) => (
              <div key={job.id} className="p-5 rounded-xl bg-[#1B263B] border border-[#415A77] flex flex-col justify-between gap-4 hover:border-[#415A77]/30 transition-all text-left">
                <div className="space-y-1">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="text-sm font-extrabold text-white tracking-tight">{job.title}</h3>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-[#B3AF8F]/10 text-[#B3AF8F] font-bold border border-[#B3AF8F]/10">
                      {job.workType || 'REMOTE'}
                    </span>
                  </div>
                  <div className="text-xs text-gray-400 font-semibold">{job.company?.name || 'Tech Corp'}</div>
                  <div className="flex items-center gap-4 text-[10px] text-[#E0E1DD]/60 pt-1">
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {job.location || 'Remote'}</span>
                    <span>•</span>
                    <span className="text-[#B3AF8F] font-bold">{job.salaryRange || '₹10L - ₹15L'}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleOpenApplyModal(job)}
                  className="w-full py-1.5 rounded-lg bg-[#415A77] hover:bg-[#a15666] text-white font-bold text-xs transition-colors flex items-center justify-center gap-1 shadow-md shadow-[#415A77]/10"
                >
                  <Zap className="h-3.5 w-3.5 fill-white" />
                  Quick Apply Now
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Applications Section */}
        <div className="glass-card p-6 rounded-2xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-white">Your Applications</h2>
            <span className="text-xs font-semibold text-[#E0E1DD]/50 uppercase tracking-widest">Real-time updates</span>
          </div>

          <div className="space-y-4">
            {applications.map((app) => (
              <div key={app.id} className="p-4 rounded-xl bg-[#1B263B]/40 border border-[#415A77]/60 flex flex-col justify-between gap-4 text-left">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 w-full">
                  <div className="flex gap-4">
                    <div className="h-10 w-10 rounded-lg bg-[#1B263B] border border-[#415A77] flex items-center justify-center font-bold text-[#E0E1DD]/60">
                      {app.companyName.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">{app.jobTitle}</h3>
                      <div className="flex items-center gap-4 text-xs text-gray-400 mt-1">
                        <span className="flex items-center gap-1"><Briefcase className="h-3.5 w-3.5 text-[#B3AF8F]" /> {app.companyName}</span>
                        <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5 text-[#415A77]" /> {app.location}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 justify-between md:justify-end">
                    <div className="text-right hidden md:block">
                      <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">ATS Match</div>
                      <div className="text-xs font-bold text-[#B3AF8F] mt-0.5">{app.atsScore}%</div>
                    </div>
                    <div className="text-right hidden md:block mr-2">
                      <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Applied Date</div>
                      <div className="text-xs font-semibold text-gray-400 mt-0.5">{app.appliedDate}</div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(app.status)}`}>
                      {app.status}
                    </span>
                    <button
                      onClick={() => setSelectedTrackAppId(selectedTrackAppId === app.id ? null : app.id)}
                      className="px-3 py-1 rounded-lg bg-[#1B263B] border border-[#415A77] text-[10px] font-bold text-gray-400 hover:text-white transition-colors flex items-center gap-1"
                    >
                      {selectedTrackAppId === app.id ? 'Hide Stage' : 'Track Pipeline'}
                      {selectedTrackAppId === app.id ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Status Timeline Progress Tracker */}
                {selectedTrackAppId === app.id && (
                  <div className="w-full mt-4 pt-4 border-t border-[#415A77]/60 animate-in fade-in slide-in-from-top-1 duration-200">
                    <div className="flex justify-between items-center text-[10px] font-bold text-gray-500 uppercase tracking-widest pb-3">
                      <span>Recruitment Stages</span>
                      <span className="text-[#415A77] font-extrabold">Current State: {app.status}</span>
                    </div>

                    <div className="relative flex justify-between items-center mt-4 px-6">
                      {/* Bar back */}
                      <div className="absolute left-6 right-6 h-1 bg-[#1B263B] rounded-full -z-10" />
                      {/* Active progress bar indicator */}
                      <div 
                        className="absolute left-6 h-1 bg-[#415A77] rounded-full -z-10 transition-all duration-500"
                        style={{
                          width: `${
                            app.status === 'APPLIED' ? '0%' :
                            app.status === 'SCREENING' ? '25%' :
                            app.status === 'INTERVIEW' ? '50%' :
                            app.status === 'OFFER' ? '75%' : '100%'
                          }`
                        }}
                      />

                      {/* Circles */}
                      {[
                        { name: 'Applied', key: 'APPLIED' },
                        { name: 'Screening', key: 'SCREENING' },
                        { name: 'Interview', key: 'INTERVIEW' },
                        { name: 'Offer', key: 'OFFER' },
                        { name: 'Hired', key: 'HIRED' }
                      ].map((stage, idx) => {
                        const isActive = getStageActiveIndex(app.status) >= idx;
                        const isCurrent = app.status === stage.key;
                        return (
                          <div key={stage.key} className="flex flex-col items-center relative">
                            <div className={`h-6 w-6 rounded-full flex items-center justify-center border transition-all ${
                              isCurrent ? 'bg-[#415A77] border-white scale-110 text-white font-extrabold shadow-md shadow-[#415A77]/20' :
                              isActive ? 'bg-[#1B263B]/25 border-[#415A77] text-[#415A77]' : 'bg-[#1B263B] border-[#415A77] text-gray-650'
                            }`}>
                              {isActive ? <Check className="h-3 w-3" /> : <span className="text-[9px]">{idx + 1}</span>}
                            </div>
                            <span className={`text-[9px] font-bold mt-2 ${isCurrent ? 'text-[#415A77]' : isActive ? 'text-gray-250' : 'text-gray-600'}`}>
                              {stage.name}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Quick Apply Wizard Dialog Modal */}
      <QuickApplyModal 
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        job={selectedJobForApply}
        onSuccess={handleApplySuccess}
      />
    </CandidateLayout>
  );
}
