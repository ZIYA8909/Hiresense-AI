'use strict';
'use client';

import React, { useState, useEffect } from 'react';
import RecruiterLayout from '@/components/RecruiterLayout';
import { 
  Briefcase, 
  Plus, 
  Sparkles, 
  MapPin, 
  DollarSign, 
  Check, 
  FolderPlus,
  ArrowRight 
} from 'lucide-react';

interface Job {
  id: number;
  title: string;
  location: string;
  salaryRange: string;
  status: 'ACTIVE' | 'ARCHIVED';
  candidatesCount: number;
  description?: string;
  requirements?: string;
}

export default function RecruiterJobs() {
  const defaultJobs: Job[] = [
    { id: 1, title: 'Software Engineer (Java/Cloud)', location: 'San Francisco, CA (Remote)', salaryRange: '$120,000 - $140,000', status: 'ACTIVE', candidatesCount: 15 },
    { id: 2, title: 'Backend Developer (Go)', location: 'New York, NY (Hybrid)', salaryRange: '$130,000 - $150,000', status: 'ACTIVE', candidatesCount: 8 }
  ];

  const [jobs, setJobs] = useState<Job[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('Remote');
  const [salary, setSalary] = useState('$100,000 - $120,000');
  const [skillsKeywords, setSkillsKeywords] = useState('');
  
  const [description, setDescription] = useState('');
  const [requirements, setRequirements] = useState('');
  const [generating, setGenerating] = useState(false);

  // Load custom jobs from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('hiresense_custom_jobs');
    if (saved) {
      try {
        setJobs(JSON.parse(saved));
      } catch (e) {
        setJobs(defaultJobs);
      }
    } else {
      setJobs(defaultJobs);
      localStorage.setItem('hiresense_custom_jobs', JSON.stringify(defaultJobs));
    }
  }, []);

  const handleGenerateJD = () => {
    if (!title) return;
    setGenerating(true);

    // Simulate AI Job Description generation
    setTimeout(() => {
      setDescription(`We are looking for a skilled ${title} to join our growing engineering team. You will lead the design and implementation of highly scalable, distributed backend architectures, ensuring low latency and high availability across services.`);
      setRequirements(`- 3+ years of experience working as a ${title}\n- Strong knowledge of Java, Spring Boot, and Microservices\n- Experience building containerized pipelines using Docker\n- Familiarity with event streams (Kafka) and caching (Redis)`);
      setGenerating(false);
    }, 1500);
  };

  const handleSave = async () => {
    if (!title || !description) return;

    const newJob: Job = {
      id: Date.now(),
      title,
      description,
      requirements,
      location,
      salaryRange: salary,
      status: 'ACTIVE',
      candidatesCount: 0
    };

    const updatedJobs = [newJob, ...jobs];
    setJobs(updatedJobs);
    localStorage.setItem('hiresense_custom_jobs', JSON.stringify(updatedJobs));
    setIsOpen(false);
    
    // Clear inputs
    setTitle('');
    setDescription('');
    setRequirements('');
    setSkillsKeywords('');

    // Fire REST call to Recruitment Service to insert Job and evict popular_jobs Redis cache
    try {
      await fetch('http://localhost:8080/recruitment/jobs?companyId=1', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          requirements,
          salaryRange: salary,
          location,
          workType: 'REMOTE',
          jobType: 'FULL_TIME'
        })
      });
      console.log('[Jobs] Saved job successfully to database.');
    } catch (err) {
      console.warn('[Jobs] API gateway unavailable. Logged job locally.');
    }
  };

  return (
    <RecruiterLayout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Job Openings</h1>
            <p className="text-gray-400 text-sm mt-1">Create and manage job postings and generate descriptions with AI.</p>
          </div>

          <button
            onClick={() => setIsOpen(true)}
            className="px-4 py-2.5 rounded-lg bg-indigo-500 hover:bg-indigo-400 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-indigo-500/10"
          >
            <Plus className="h-4.5 w-4.5" />
            Create Opening
          </button>
        </div>

        {/* Form Modal */}
        {isOpen && (
          <div className="fixed inset-0 z-50 bg-[#1B263B]/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-2xl glass-card rounded-2xl p-8 max-h-[90vh] overflow-y-auto relative">
              <div className="flex justify-between items-center pb-4 border-b border-[#415A77] mb-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <FolderPlus className="h-5 w-5 text-indigo-400" /> Create Job Opening
                </h3>
                <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-white text-xs font-bold">Close</button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Job Title</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full bg-[#1B263B] border border-[#415A77] rounded p-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                      placeholder="e.g. Senior Software Engineer"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Location / Work Type</label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full bg-[#1B263B] border border-[#415A77] rounded p-2 text-xs text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Salary Range</label>
                    <input
                      type="text"
                      value={salary}
                      onChange={(e) => setSalary(e.target.value)}
                      className="w-full bg-[#1B263B] border border-[#415A77] rounded p-2 text-xs text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">AI Skills Keywords</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={skillsKeywords}
                        onChange={(e) => setSkillsKeywords(e.target.value)}
                        className="flex-1 bg-[#1B263B] border border-[#415A77] rounded p-2 text-xs text-white focus:outline-none"
                        placeholder="e.g. Java, Kafka, Redis"
                      />
                      <button
                        onClick={handleGenerateJD}
                        disabled={generating || !title}
                        className="px-3 py-2 rounded bg-indigo-500 hover:bg-indigo-400 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1 shadow-md shadow-indigo-500/10"
                      >
                        <Sparkles className="h-3.5 w-3.5" />
                        {generating ? 'Generating...' : 'AI'}
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Job Description</label>
                  <textarea
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-[#1B263B] border border-[#415A77] rounded p-3 text-xs text-white focus:outline-none"
                    placeholder="Enter details or use AI JD Generator above..."
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Job Requirements</label>
                  <textarea
                    rows={4}
                    value={requirements}
                    onChange={(e) => setRequirements(e.target.value)}
                    className="w-full bg-[#1B263B] border border-[#415A77] rounded p-3 text-xs text-white focus:outline-none"
                    placeholder="List required skills and experience..."
                  />
                </div>

                <button
                  onClick={handleSave}
                  className="w-full py-3 rounded-lg bg-indigo-500 text-white font-bold hover:bg-indigo-400 transition-all text-xs flex items-center justify-center gap-1.5 shadow-md"
                >
                  <Check className="h-4 w-4" /> Save Job Opening
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Jobs List Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {jobs.map((job) => (
            <div key={job.id} className="glass-card p-6 rounded-2xl flex flex-col justify-between hover:border-indigo-500/30 transition-all">
              <div className="flex gap-4">
                <div className="h-10 w-10 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/10 flex items-center justify-center font-bold">
                  <Briefcase className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">{job.title}</h3>
                  <div className="flex items-center gap-4 text-[10px] text-gray-500 mt-1.5">
                    <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {job.location}</span>
                    <span className="flex items-center gap-1"><DollarSign className="h-3.5 w-3.5" /> {job.salaryRange}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-[#415A77] pt-4 mt-6">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{job.candidatesCount} Applicants</span>
                <span className="px-2 py-0.5 rounded-full bg-indigo-500/15 border border-indigo-500/15 text-[10px] font-bold text-indigo-400">
                  {job.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </RecruiterLayout>
  );
}
