'use strict';
'use client';

import React from 'react';
import RecruiterLayout from '@/components/RecruiterLayout';
import { 
  Users, 
  Briefcase, 
  Calendar, 
  ChevronRight, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle,
  FileText 
} from 'lucide-react';

export default function RecruiterDashboard() {
  const metrics = [
    { title: 'Active Jobs', value: '4', icon: Briefcase, color: 'text-[#1B263B]' },
    { title: 'Total Applicants', value: '154', icon: Users, color: 'text-[#B3AF8F]' },
    { title: 'Interviews Scheduled', value: '8', icon: Calendar, color: 'text-[#415A77]' },
  ];

  // Funnel Heatmap data
  const funnelStages = [
    { name: 'Applied', count: 154, percentage: 100, color: 'bg-[#1B263B]' },
    { name: 'Screening', count: 48, percentage: 31, color: 'bg-[#415A77]', alert: 'High drop-off rate: 69% of candidates fail screening filters. Consider review of JD requirements.' },
    { name: 'Interview', count: 12, percentage: 8, color: 'bg-[#B3AF8F]' },
    { name: 'Offer', count: 3, percentage: 2, color: 'bg-[#1B263B]' }
  ];

  const recentActivities = [
    { id: 1, action: 'Arjun Mehta', details: 'submitted application for Software Engineer', time: '10 minutes ago' },
    { id: 2, action: 'Priya Sharma', details: 'scheduled a Technical Interview for Tuesday', time: '1 hour ago' },
    { id: 3, action: 'Devendra Patel', details: 'dragged to Offer stage by Ananya Iyer', time: '3 hours ago' }
  ];

  return (
    <RecruiterLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Title */}
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Recruiter Dashboard</h1>
          <p className="text-gray-400 text-sm mt-1">Review active pipelines, conversion funnel heatmaps, and platform insights.</p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {metrics.map((m) => {
            const Icon = m.icon;
            return (
              <div key={m.title} className="glass-card p-6 rounded-2xl flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">{m.title}</div>
                  <div className="text-3xl font-black text-white">{m.value}</div>
                </div>
                <div className={`h-12 w-12 rounded-xl bg-[#1B263B] border border-[#415A77] flex items-center justify-center ${m.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Funnel Heatmap */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="glass-card p-6 rounded-2xl lg:col-span-2">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-base font-bold text-white">Hiring Funnel Heatmap</h2>
              <span className="px-2 py-0.5 rounded bg-[#415A77]/10 text-[#415A77] text-[10px] font-bold">Bottleneck Finder</span>
            </div>

            <div className="space-y-4">
              {funnelStages.map((stage) => (
                <div key={stage.name} className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-gray-300">{stage.name}</span>
                    <span className="font-bold text-white">{stage.count} candidates ({stage.percentage}%)</span>
                  </div>
                  
                  <div className="w-full bg-[#1B263B] rounded-full h-4 overflow-hidden border border-[#415A77] flex">
                    <div 
                      className={`${stage.color} h-full transition-all`} 
                      style={{ width: `${stage.percentage}%` }}
                    />
                  </div>

                  {stage.alert && (
                    <div className="p-3 rounded-lg bg-yellow-500/5 border border-yellow-500/20 text-yellow-500 text-[10px] flex gap-2 items-start leading-relaxed">
                      <AlertTriangle className="h-4 w-4 shrink-0" />
                      <span>{stage.alert}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Activity Log */}
          <div className="glass-card p-6 rounded-2xl lg:col-span-1">
            <h2 className="text-base font-bold text-white mb-6">Recent Activity</h2>
            
            <div className="space-y-4">
              {recentActivities.map((act) => (
                <div key={act.id} className="text-xs border-b border-[#415A77] pb-3 last:border-b-0 last:pb-0">
                  <div className="font-bold text-white">{act.action}</div>
                  <div className="text-gray-400 mt-1">{act.details}</div>
                  <div className="text-[10px] text-gray-600 mt-1">{act.time}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </RecruiterLayout>
  );
}
