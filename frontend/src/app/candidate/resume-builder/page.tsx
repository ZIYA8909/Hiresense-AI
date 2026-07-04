'use strict';
'use client';

import React, { useState } from 'react';
import CandidateLayout from '@/components/CandidateLayout';
import { 
  FileText, 
  Sparkles, 
  Download, 
  Plus, 
  Trash2, 
  GraduationCap, 
  Briefcase, 
  CheckCircle,
  FolderGit2,
  Languages 
} from 'lucide-react';

export default function ResumeBuilder() {
  const [name, setName] = useState('Arjun Mehta');
  const [title, setTitle] = useState('Software Engineer');
  const [email, setEmail] = useState('arjun.mehta@gmail.com');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [about, setAbout] = useState('Passionate software engineer experienced in building scalable Java microservices, pgvector semantic search engines, and Docker sandboxes.');
  
  const [github, setGithub] = useState('github.com/arjunmehta');
  const [linkedin, setLinkedin] = useState('linkedin.com/in/arjunmehta');
  const [portfolio, setPortfolio] = useState('arjunmehta.dev');

  const [skills, setSkills] = useState<string[]>(['Java', 'Spring Boot', 'Microservices', 'Docker', 'AWS S3', 'Redis']);
  const [newSkill, setNewSkill] = useState('');
  
  const [experience, setExperience] = useState([
    {
      company: 'Tech Corp',
      role: 'Software Engineer Intern',
      duration: '6 Months',
      desc: 'Built scalable backend microservices APIs using Spring Boot, JPA, and Docker. Optimized PostgreSQL database queries.'
    }
  ]);
  
  const [education, setEducation] = useState([
    {
      school: 'IIT Bombay',
      degree: 'B.Tech in Computer Science',
      duration: '2020 - 2024',
      desc: 'Specialized in Distributed Systems and software architecture.'
    }
  ]);

  // Languages known
  const [languages, setLanguages] = useState<string[]>(['English (Fluent)', 'Hindi (Native)']);
  const [newLanguage, setNewLanguage] = useState('');

  // Projects list
  const [projects, setProjects] = useState([
    {
      name: 'HireSense AI',
      desc: 'Engineered a multi-service recruitment platform featuring pgvector similarity matches, Kafka asynchronous logs, and secure Docker sandbox execution runtimes.',
      techStack: 'Spring Boot, Next.js, Kafka, Redis, pgvector',
      link: 'github.com/arjunmehta/hiresense'
    }
  ]);

  // Selected template: 'classic' | 'modern' | 'split'
  const [template, setTemplate] = useState<'classic' | 'modern' | 'split'>('classic');
  const [themeColor, setThemeColor] = useState<'emerald' | 'indigo' | 'ruby' | 'slate'>('emerald');

  // Helper to map color theme to tailwind classes
  const getThemeClasses = () => {
    switch (themeColor) {
      case 'indigo':
        return {
          text: 'text-indigo-650',
          bg: 'bg-indigo-50 text-indigo-800 border-indigo-200',
          border: 'border-indigo-500',
          borderLight: 'border-indigo-200',
        };
      case 'ruby':
        return {
          text: 'text-rose-650',
          bg: 'bg-rose-50 text-rose-800 border-rose-200',
          border: 'border-rose-500',
          borderLight: 'border-rose-200',
        };
      case 'slate':
        return {
          text: 'text-gray-700',
          bg: 'bg-gray-150 text-gray-800 border-gray-200',
          border: 'border-gray-500',
          borderLight: 'border-gray-200',
        };
      case 'emerald':
      default:
        return {
          text: 'text-emerald-650',
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          border: 'border-emerald-500',
          borderLight: 'border-emerald-200',
        };
    }
  };

  const theme = getThemeClasses();

  // Form states for new experience
  const [expCompany, setExpCompany] = useState('');
  const [expRole, setExpRole] = useState('');
  const [expDuration, setExpDuration] = useState('');
  const [expDesc, setExpDesc] = useState('');

  // Form states for new education
  const [eduSchool, setEduSchool] = useState('');
  const [eduDegree, setEduDegree] = useState('');
  const [eduDuration, setEduDuration] = useState('');
  const [eduDesc, setEduDesc] = useState('');

  // Form states for new project
  const [projName, setProjName] = useState('');
  const [projDesc, setProjDesc] = useState('');
  const [projTech, setProjTech] = useState('');
  const [projLink, setProjLink] = useState('');

  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [loadingAi, setLoadingAi] = useState(false);

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const removeSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const addLanguage = () => {
    if (newLanguage.trim() && !languages.includes(newLanguage.trim())) {
      setLanguages([...languages, newLanguage.trim()]);
      setNewLanguage('');
    }
  };

  const removeLanguage = (index: number) => {
    setLanguages(languages.filter((_, i) => i !== index));
  };

  const addExperience = () => {
    if (expCompany.trim() && expRole.trim()) {
      setExperience([...experience, {
        company: expCompany.trim(),
        role: expRole.trim(),
        duration: expDuration.trim() || 'Present',
        desc: expDesc.trim()
      }]);
      setExpCompany('');
      setExpRole('');
      setExpDuration('');
      setExpDesc('');
    }
  };

  const removeExperience = (index: number) => {
    setExperience(experience.filter((_, i) => i !== index));
  };

  const addEducation = () => {
    if (eduSchool.trim() && eduDegree.trim()) {
      setEducation([...education, {
        school: eduSchool.trim(),
        degree: eduDegree.trim(),
        duration: eduDuration.trim(),
        desc: eduDesc.trim()
      }]);
      setEduSchool('');
      setEduDegree('');
      setEduDuration('');
      setEduDesc('');
    }
  };

  const removeEducation = (index: number) => {
    setEducation(education.filter((_, i) => i !== index));
  };

  const addProject = () => {
    if (projName.trim() && projDesc.trim()) {
      setProjects([...projects, {
        name: projName.trim(),
        desc: projDesc.trim(),
        techStack: projTech.trim(),
        link: projLink.trim()
      }]);
      setProjName('');
      setProjDesc('');
      setProjTech('');
      setProjLink('');
    }
  };

  const removeProject = (index: number) => {
    setProjects(projects.filter((_, i) => i !== index));
  };

  const handleSuggest = () => {
    setLoadingAi(true);
    setTimeout(() => {
      setAiSuggestions([
        'Highlight database latency metrics inside your HireSense AI project description to impress technical recruiters.',
        'List languages with proficiency tags e.g., "German (Professional Working)" to demonstrate global readiness.',
        'Optimize work descriptions using action-oriented words: "Spearheaded", "Optimized", "Redesigned".'
      ]);
      setLoadingAi(false);
    }, 1500);
  };

  const downloadPdf = () => {
    window.print();
  };

  return (
    <CandidateLayout>
      <div className="max-w-7xl mx-auto h-[calc(100vh-12rem)] flex flex-col">
        {/* Top Header */}
        <div className="mb-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4 shrink-0">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">ATS Resume Builder</h1>
            <p className="text-gray-400 text-xs mt-0.5 font-semibold">Build and export ATS-optimized resumes with real-time preview and AI writing suggestions.</p>
          </div>

          <div className="flex gap-2 items-center">
            {/* Color Theme Selector */}
            <div className="flex bg-[#1B263B] border border-[#415A77] rounded-lg p-1.5 mr-2 gap-2 items-center">
              <button 
                onClick={() => setThemeColor('emerald')}
                className={`h-3.5 w-3.5 rounded-full bg-emerald-500 border transition-all ${themeColor === 'emerald' ? 'border-white scale-110' : 'border-transparent hover:scale-105'}`}
                title="Emerald Theme"
              />
              <button 
                onClick={() => setThemeColor('indigo')}
                className={`h-3.5 w-3.5 rounded-full bg-indigo-500 border transition-all ${themeColor === 'indigo' ? 'border-white scale-110' : 'border-transparent hover:scale-105'}`}
                title="Indigo Theme"
              />
              <button 
                onClick={() => setThemeColor('ruby')}
                className={`h-3.5 w-3.5 rounded-full bg-rose-500 border transition-all ${themeColor === 'ruby' ? 'border-white scale-110' : 'border-transparent hover:scale-105'}`}
                title="Ruby Theme"
              />
              <button 
                onClick={() => setThemeColor('slate')}
                className={`h-3.5 w-3.5 rounded-full bg-gray-500 border transition-all ${themeColor === 'slate' ? 'border-white scale-110' : 'border-transparent hover:scale-105'}`}
                title="Slate Theme"
              />
            </div>

            {/* Template Selector Widget */}
            <div className="flex bg-[#1B263B] border border-[#415A77] rounded-lg p-1 mr-2 text-xs">
              <button 
                onClick={() => setTemplate('classic')}
                className={`px-3 py-1 rounded-md transition-colors ${template === 'classic' ? 'bg-emerald-500 text-black font-bold' : 'text-gray-400 hover:text-white'}`}
              >
                Classic
              </button>
              <button 
                onClick={() => setTemplate('modern')}
                className={`px-3 py-1 rounded-md transition-colors ${template === 'modern' ? 'bg-emerald-500 text-black font-bold' : 'text-gray-400 hover:text-white'}`}
              >
                Modern
              </button>
              <button 
                onClick={() => setTemplate('split')}
                className={`px-3 py-1 rounded-md transition-colors ${template === 'split' ? 'bg-emerald-500 text-black font-bold' : 'text-gray-400 hover:text-white'}`}
              >
                Split
              </button>
            </div>

            <button
              onClick={handleSuggest}
              disabled={loadingAi}
              className="px-4 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center gap-1.5 border border-emerald-500/15"
            >
              <Sparkles className="h-3.5 w-3.5" />
              {loadingAi ? 'Analyzing...' : 'Get AI Suggestions'}
            </button>
            <button
              onClick={downloadPdf}
              className="px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/15"
            >
              <Download className="h-3.5 w-3.5" />
              Download PDF
            </button>
          </div>
        </div>

        {/* Editor and Preview Split */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-hidden min-h-0">
          {/* Form Editor */}
          <div className="flex flex-col gap-4 overflow-y-auto pr-1">
            {/* Contact details & About */}
            <div className="glass-card p-5 rounded-2xl space-y-4">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest pb-2 border-b border-[#415A77] flex items-center gap-1.5">
                <FileText className="h-4 w-4 text-emerald-400" /> Personal Details
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#1B263B] border border-[#415A77] rounded p-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Job Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-[#1B263B] border border-[#415A77] rounded p-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#1B263B] border border-[#415A77] rounded p-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Phone</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#1B263B] border border-[#415A77] rounded p-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">GitHub</label>
                  <input
                    type="text"
                    value={github}
                    onChange={(e) => setGithub(e.target.value)}
                    className="w-full bg-[#1B263B] border border-[#415A77] rounded p-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    placeholder="github.com/username"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">LinkedIn</label>
                  <input
                    type="text"
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                    className="w-full bg-[#1B263B] border border-[#415A77] rounded p-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    placeholder="linkedin.com/in/username"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Portfolio</label>
                  <input
                    type="text"
                    value={portfolio}
                    onChange={(e) => setPortfolio(e.target.value)}
                    className="w-full bg-[#1B263B] border border-[#415A77] rounded p-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    placeholder="portfolio.dev"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Professional Summary / About</label>
                <textarea
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  rows={3}
                  className="w-full bg-[#1B263B] border border-[#415A77] rounded p-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  placeholder="Describe your professional background..."
                />
              </div>
            </div>

            {/* Skills Block */}
            <div className="glass-card p-5 rounded-2xl">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest pb-2 border-b border-[#415A77] mb-4 flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-emerald-400" /> Skills Block
              </h3>
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  className="flex-1 bg-[#1B263B] border border-[#415A77] rounded p-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  placeholder="e.g. Kafka"
                />
                <button
                  type="button"
                  onClick={addSkill}
                  className="px-3 py-2 rounded bg-[#1B263B] border border-[#415A77] hover:bg-gray-800 text-emerald-400 font-bold text-xs"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {skills.map((skill, index) => (
                  <span key={index} className="inline-flex items-center gap-1 px-2 py-1 rounded bg-[#1B263B] border border-[#415A77] text-[10px] font-bold text-gray-300">
                    {skill}
                    <button type="button" onClick={() => removeSkill(index)} className="text-gray-500 hover:text-red-400 ml-1">
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Languages Known Block */}
            <div className="glass-card p-5 rounded-2xl">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest pb-2 border-b border-[#415A77] mb-4 flex items-center gap-1.5">
                <Languages className="h-4 w-4 text-emerald-400" /> Languages Known
              </h3>
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={newLanguage}
                  onChange={(e) => setNewLanguage(e.target.value)}
                  className="flex-1 bg-[#1B263B] border border-[#415A77] rounded p-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  placeholder="e.g. Hindi (Native) or English (Fluent)"
                />
                <button
                  type="button"
                  onClick={addLanguage}
                  className="px-3 py-2 rounded bg-[#1B263B] border border-[#415A77] hover:bg-gray-800 text-emerald-400 font-bold text-xs"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {languages.map((lang, index) => (
                  <span key={index} className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#1B263B] border border-[#415A77] text-[10px] font-bold text-gray-300">
                    {lang}
                    <button type="button" onClick={() => removeLanguage(index)} className="text-gray-500 hover:text-red-400 ml-1">
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Sample Projects Form */}
            <div className="glass-card p-5 rounded-2xl space-y-3">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest pb-2 border-b border-[#415A77] flex items-center gap-1.5">
                <FolderGit2 className="h-4 w-4 text-emerald-400" /> Sample Projects
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Project Name</label>
                  <input
                    type="text"
                    value={projName}
                    onChange={(e) => setProjName(e.target.value)}
                    className="w-full bg-[#1B263B] border border-[#415A77] rounded p-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    placeholder="e.g. HireSense AI"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Project Link / Repo</label>
                  <input
                    type="text"
                    value={projLink}
                    onChange={(e) => setProjLink(e.target.value)}
                    className="w-full bg-[#1B263B] border border-[#415A77] rounded p-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    placeholder="e.g. github.com/username/repo"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Technologies Used</label>
                  <input
                    type="text"
                    value={projTech}
                    onChange={(e) => setProjTech(e.target.value)}
                    className="w-full bg-[#1B263B] border border-[#415A77] rounded p-2 text-xs text-white focus:outline-none"
                    placeholder="e.g. React, Spring Boot, Kafka"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Actions</label>
                  <button
                    onClick={addProject}
                    className="w-full py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs rounded transition-colors flex items-center justify-center gap-1"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add Project
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Project Description</label>
                <textarea
                  value={projDesc}
                  onChange={(e) => setProjDesc(e.target.value)}
                  rows={2}
                  className="w-full bg-[#1B263B] border border-[#415A77] rounded p-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  placeholder="Summarize key features, architectures, and metrics..."
                />
              </div>

              {/* Added projects list */}
              {projects.length > 0 && (
                <div className="pt-2 space-y-1.5 border-t border-[#415A77]">
                  {projects.map((proj, idx) => (
                    <div key={idx} className="flex justify-between items-center p-2 rounded bg-[#1B263B] border border-[#415A77] text-[10px]">
                      <span className="font-semibold text-gray-300">{proj.name} ({proj.techStack})</span>
                      <button onClick={() => removeProject(idx)} className="text-gray-500 hover:text-red-400">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Experience Form */}
            <div className="glass-card p-5 rounded-2xl space-y-3">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest pb-2 border-b border-[#415A77] flex items-center gap-1.5">
                <Briefcase className="h-4 w-4 text-emerald-400" /> Work Experience
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Company</label>
                  <input
                    type="text"
                    value={expCompany}
                    onChange={(e) => setExpCompany(e.target.value)}
                    className="w-full bg-[#1B263B] border border-[#415A77] rounded p-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    placeholder="e.g. Tech Corp"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Role / Job Title</label>
                  <input
                    type="text"
                    value={expRole}
                    onChange={(e) => setExpRole(e.target.value)}
                    className="w-full bg-[#1B263B] border border-[#415A77] rounded p-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    placeholder="e.g. Intern Developer"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Duration</label>
                  <input
                    type="text"
                    value={expDuration}
                    onChange={(e) => setExpDuration(e.target.value)}
                    className="w-full bg-[#1B263B] border border-[#415A77] rounded p-2 text-xs text-white focus:outline-none"
                    placeholder="e.g. 6 Months"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Actions</label>
                  <button
                    onClick={addExperience}
                    className="w-full py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs rounded transition-colors flex items-center justify-center gap-1"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add Experience
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Description</label>
                <textarea
                  value={expDesc}
                  onChange={(e) => setExpDesc(e.target.value)}
                  rows={2}
                  className="w-full bg-[#1B263B] border border-[#415A77] rounded p-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  placeholder="Key contributions and achievements..."
                />
              </div>

              {experience.length > 0 && (
                <div className="pt-2 space-y-1.5 border-t border-[#415A77]">
                  {experience.map((exp, idx) => (
                    <div key={idx} className="flex justify-between items-center p-2 rounded bg-[#1B263B] border border-[#415A77] text-[10px]">
                      <span className="font-semibold text-gray-300">{exp.role} at {exp.company} ({exp.duration})</span>
                      <button onClick={() => removeExperience(idx)} className="text-gray-500 hover:text-red-400">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Education Form */}
            <div className="glass-card p-5 rounded-2xl space-y-3">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest pb-2 border-b border-[#415A77] flex items-center gap-1.5">
                <GraduationCap className="h-4.5 w-4.5 text-emerald-400" /> Education History
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">School / University</label>
                  <input
                    type="text"
                    value={eduSchool}
                    onChange={(e) => setEduSchool(e.target.value)}
                    className="w-full bg-[#1B263B] border border-[#415A77] rounded p-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    placeholder="e.g. IIT Bombay"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Degree / Course</label>
                  <input
                    type="text"
                    value={eduDegree}
                    onChange={(e) => setEduDegree(e.target.value)}
                    className="w-full bg-[#1B263B] border border-[#415A77] rounded p-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    placeholder="e.g. B.Tech in CSE"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Duration</label>
                  <input
                    type="text"
                    value={eduDuration}
                    onChange={(e) => setEduDuration(e.target.value)}
                    className="w-full bg-[#1B263B] border border-[#415A77] rounded p-2 text-xs text-white focus:outline-none"
                    placeholder="e.g. 2020 - 2024"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Actions</label>
                  <button
                    onClick={addEducation}
                    className="w-full py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs rounded transition-colors flex items-center justify-center gap-1"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add Education
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Description / Honors</label>
                <textarea
                  value={eduDesc}
                  onChange={(e) => setEduDesc(e.target.value)}
                  rows={2}
                  className="w-full bg-[#1B263B] border border-[#415A77] rounded p-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  placeholder="e.g. CGPA: 9.2, Specialized in Distributed Systems..."
                />
              </div>

              {education.length > 0 && (
                <div className="pt-2 space-y-1.5 border-t border-[#415A77]">
                  {education.map((edu, idx) => (
                    <div key={idx} className="flex justify-between items-center p-2 rounded bg-[#1B263B] border border-[#415A77] text-[10px]">
                      <span className="font-semibold text-gray-300">{edu.degree} — {edu.school}</span>
                      <button onClick={() => removeEducation(idx)} className="text-gray-500 hover:text-red-400">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* AI Suggestions Box */}
            {aiSuggestions.length > 0 && (
              <div className="glass-card p-5 rounded-2xl border-emerald-500/25 bg-emerald-500/5">
                <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-widest pb-2 border-b border-emerald-500/10 mb-3 flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4" /> AI Rewrite Suggestions
                </h3>
                <div className="space-y-2">
                  {aiSuggestions.map((s, index) => (
                    <div key={index} className="flex gap-2 items-start text-xs text-gray-300 leading-relaxed">
                      <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{s}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Live Preview Paper */}
          <div className="border border-[#415A77] bg-white text-gray-900 rounded-2xl shadow-2xl h-full overflow-y-auto max-w-[800px] mx-auto w-full flex flex-col">
            
            {/* Classic Serif Layout */}
            {template === 'classic' && (
              <div className="p-8 flex flex-col font-serif">
                <div className="text-center pb-4 border-b border-gray-350 mb-4">
                  <h2 className="text-3xl font-bold tracking-tight text-gray-900">{name}</h2>
                  <div className="text-sm font-semibold text-gray-600 mt-1">{title}</div>
                  <div className="text-xs text-gray-500 mt-2 flex justify-center gap-4 font-sans">
                    <span>{email}</span>
                    <span>•</span>
                    <span>{phone}</span>
                  </div>
                  {(github || linkedin || portfolio) && (
                    <div className="text-[10px] text-gray-400 mt-1.5 flex justify-center gap-4 font-sans">
                      {github && <span>github.com/{github.replace(/https?:\/\/(www\.)?github\.com\//, '')}</span>}
                      {linkedin && <span>linkedin.com/in/{linkedin.replace(/https?:\/\/(www\.)?linkedin\.com\/in\//, '')}</span>}
                      {portfolio && <span>{portfolio.replace(/https?:\/\/(www\.)?/, '')}</span>}
                    </div>
                  )}
                </div>

                <div className="space-y-4 text-left">
                  {about.trim() && (
                    <div>
                      <h3 className={`text-xs font-bold uppercase tracking-wider ${theme.text} border-b border-gray-300 pb-1 mb-2`}>Professional Summary</h3>
                      <p className="text-xs text-gray-600 leading-relaxed font-sans">{about}</p>
                    </div>
                  )}

                  {experience.length > 0 && (
                    <div>
                      <h3 className={`text-xs font-bold uppercase tracking-wider ${theme.text} border-b border-gray-300 pb-1 mb-2.5`}>Professional Experience</h3>
                      {experience.map((exp, index) => (
                        <div key={index} className="mb-3">
                          <div className="flex justify-between text-xs font-bold text-gray-900">
                            <span>{exp.role} — {exp.company}</span>
                            <span className="font-normal text-gray-500">{exp.duration}</span>
                          </div>
                          <p className="text-xs text-gray-600 mt-1.5 leading-relaxed font-sans">{exp.desc}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {projects.length > 0 && (
                    <div>
                      <h3 className={`text-xs font-bold uppercase tracking-wider ${theme.text} border-b border-gray-300 pb-1 mb-2.5`}>Key Projects</h3>
                      {projects.map((proj, index) => (
                        <div key={index} className="mb-3">
                          <div className="flex justify-between text-xs font-bold text-gray-900">
                            <span>{proj.name} — <span className="font-normal text-gray-500 text-[10px]">{proj.techStack}</span></span>
                            {proj.link && <span className="font-normal text-gray-500 text-[10px]">{proj.link}</span>}
                          </div>
                          <p className="text-xs text-gray-600 mt-1 leading-relaxed font-sans">{proj.desc}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {education.length > 0 && (
                    <div>
                      <h3 className={`text-xs font-bold uppercase tracking-wider ${theme.text} border-b border-gray-300 pb-1 mb-2.5`}>Education History</h3>
                      {education.map((edu, index) => (
                        <div key={index} className="mb-3">
                          <div className="flex justify-between text-xs font-bold text-gray-900">
                            <span>{edu.degree} — {edu.school}</span>
                            <span className="font-normal text-gray-500">{edu.duration}</span>
                          </div>
                          <p className="text-xs text-gray-600 mt-1 leading-relaxed font-sans">{edu.desc}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {skills.length > 0 && (
                    <div>
                      <h3 className={`text-xs font-bold uppercase tracking-wider ${theme.text} border-b border-gray-300 pb-1 mb-2`}>Core Skills</h3>
                      <div className="flex flex-wrap gap-2 text-xs font-sans text-gray-755 font-semibold">
                        {skills.join(', ')}
                      </div>
                    </div>
                  )}

                  {languages.length > 0 && (
                    <div>
                      <h3 className={`text-xs font-bold uppercase tracking-wider ${theme.text} border-b border-gray-300 pb-1 mb-2`}>Languages Known</h3>
                      <div className="text-xs font-sans text-gray-755 font-semibold">
                        {languages.join(', ')}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Modern Minimalist Layout */}
            {template === 'modern' && (
              <div className="p-8 flex flex-col font-sans">
                <div className={`text-left pb-4 border-l-4 ${theme.border} pl-4 mb-5`}>
                  <h2 className="text-3xl font-black text-gray-900 tracking-tight">{name}</h2>
                  <div className={`text-xs font-bold ${theme.text} uppercase tracking-widest mt-1`}>{title}</div>
                  <div className="text-[10px] text-gray-500 mt-2 flex gap-4">
                    <span>{email}</span>
                    <span>|</span>
                    <span>{phone}</span>
                  </div>
                  {(github || linkedin || portfolio) && (
                    <div className={`text-[9px] ${theme.text} font-medium mt-1 flex gap-3`}>
                      {github && <span>github.com/{github.replace(/https?:\/\/(www\.)?github\.com\//, '')}</span>}
                      {linkedin && <span>linkedin.com/in/{linkedin.replace(/https?:\/\/(www\.)?linkedin\.com\/in\//, '')}</span>}
                      {portfolio && <span>{portfolio.replace(/https?:\/\/(www\.)?/, '')}</span>}
                    </div>
                  )}
                </div>

                <div className="space-y-5 text-left">
                  {about.trim() && (
                    <div>
                      <h3 className={`text-[10px] font-bold uppercase tracking-widest ${theme.text} mb-1.5`}>Profile</h3>
                      <p className="text-xs text-gray-600 leading-relaxed">{about}</p>
                    </div>
                  )}

                  {experience.length > 0 && (
                    <div>
                      <h3 className={`text-[10px] font-bold uppercase tracking-widest ${theme.text} mb-2`}>Experience</h3>
                      <div className="space-y-3">
                        {experience.map((exp, index) => (
                          <div key={index} className="relative pl-4 border-l border-gray-200">
                            <div className="flex justify-between items-center text-xs font-bold text-gray-900">
                              <span>{exp.role} @ <span className="text-gray-700">{exp.company}</span></span>
                              <span className="text-[10px] text-gray-400 font-normal">{exp.duration}</span>
                            </div>
                            <p className="text-xs text-gray-505 mt-1 leading-relaxed">{exp.desc}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {projects.length > 0 && (
                    <div>
                      <h3 className={`text-[10px] font-bold uppercase tracking-widest ${theme.text} mb-2`}>Projects</h3>
                      <div className="space-y-3">
                        {projects.map((proj, index) => (
                          <div key={index} className="relative pl-4 border-l border-gray-200">
                            <div className="flex justify-between items-center text-xs font-bold text-gray-900">
                              <span>{proj.name} — <span className="text-[10px] text-gray-400 font-normal">{proj.techStack}</span></span>
                              {proj.link && <span className="text-[10px] text-gray-400 font-normal">{proj.link}</span>}
                            </div>
                            <p className="text-xs text-gray-505 mt-1 leading-relaxed">{proj.desc}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {education.length > 0 && (
                    <div>
                      <h3 className={`text-[10px] font-bold uppercase tracking-widest ${theme.text} mb-2`}>Education</h3>
                      <div className="space-y-3">
                        {education.map((edu, index) => (
                          <div key={index} className="relative pl-4 border-l border-gray-200">
                            <div className="flex justify-between items-center text-xs font-bold text-gray-900">
                              <span>{edu.degree} — <span className="text-gray-700">{edu.school}</span></span>
                              <span className="text-[10px] text-gray-400 font-normal">{edu.duration}</span>
                            </div>
                            <p className="text-xs text-gray-505 mt-1 leading-relaxed">{edu.desc}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {skills.length > 0 && (
                    <div>
                      <h3 className={`text-[10px] font-bold uppercase tracking-widest ${theme.text} mb-1.5`}>Expertise</h3>
                      <div className="flex flex-wrap gap-1.5">
                        {skills.map((s, i) => (
                          <span key={i} className={`px-2 py-0.5 rounded text-[10px] font-bold ${theme.bg}`}>
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {languages.length > 0 && (
                    <div>
                      <h3 className={`text-[10px] font-bold uppercase tracking-widest ${theme.text} mb-1.5`}>Languages</h3>
                      <div className="flex flex-wrap gap-1.5">
                        {languages.map((l, i) => (
                          <span key={i} className={`px-2 py-0.5 rounded text-[10px] font-bold ${theme.bg}`}>
                            {l}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Two-Column Split Layout */}
            {template === 'split' && (
              <div className="flex-1 grid grid-cols-3 font-sans min-h-full">
                {/* Left Sidebar column (Contact, Skills, Languages, Education) */}
                <div className="col-span-1 bg-gray-50 border-r border-gray-150 p-6 flex flex-col gap-6 text-left">
                  <div className="space-y-1">
                    <h2 className="text-lg font-extrabold text-gray-900 truncate">{name}</h2>
                    <div className="text-[10px] font-bold text-gray-550 truncate uppercase">{title}</div>
                  </div>

                  {/* Contact */}
                  <div className="space-y-2">
                    <h3 className="text-[9px] font-bold uppercase tracking-widest text-gray-400">Contact</h3>
                    <div className="text-[10px] text-gray-600 space-y-1.5 overflow-hidden">
                      <div className="truncate">{email}</div>
                      <div className="truncate">{phone}</div>
                      {github && <div className={`truncate font-semibold ${theme.text}`}>{github}</div>}
                      {linkedin && <div className={`truncate font-semibold ${theme.text}`}>{linkedin}</div>}
                      {portfolio && <div className={`truncate font-semibold ${theme.text}`}>{portfolio}</div>}
                    </div>
                  </div>

                  {/* Skills */}
                  {skills.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="text-[9px] font-bold uppercase tracking-widest text-gray-400">Skills</h3>
                      <div className="flex flex-wrap gap-1">
                        {skills.map((s, idx) => (
                          <span key={idx} className={`px-2 py-0.5 rounded text-[9px] font-bold ${theme.bg}`}>
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Languages */}
                  {languages.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="text-[9px] font-bold uppercase tracking-widest text-gray-400">Languages</h3>
                      <div className="flex flex-wrap gap-1">
                        {languages.map((l, idx) => (
                          <span key={idx} className={`px-2 py-0.5 rounded text-[9px] font-bold ${theme.bg}`}>
                            {l}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Education */}
                  {education.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-[9px] font-bold uppercase tracking-widest text-gray-400">Education</h3>
                      {education.map((edu, idx) => (
                        <div key={idx} className="space-y-0.5 text-[10px]">
                          <div className="font-bold text-gray-800">{edu.school}</div>
                          <div className="text-gray-600">{edu.degree}</div>
                          <div className="text-gray-400 text-[9px]">{edu.duration}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right Body column (Summary, Experience, Projects) */}
                <div className="col-span-2 p-6 flex flex-col gap-6 text-left">
                  {about.trim() && (
                    <div className="space-y-2">
                      <h3 className={`text-[9px] font-bold uppercase tracking-widest border-b border-gray-200 pb-0.5 ${theme.text}`}>Profile</h3>
                      <p className="text-xs text-gray-600 leading-relaxed">{about}</p>
                    </div>
                  )}

                  {experience.length > 0 && (
                    <div className="space-y-3">
                      <h3 className={`text-[9px] font-bold uppercase tracking-widest border-b border-gray-200 pb-0.5 ${theme.text}`}>Experience</h3>
                      <div className="space-y-4">
                        {experience.map((exp, idx) => (
                          <div key={idx} className="space-y-1">
                            <div className="flex justify-between text-xs font-bold text-gray-900">
                              <span>{exp.role}</span>
                              <span className="text-[10px] text-gray-400 font-normal">{exp.duration}</span>
                            </div>
                            <div className="text-[10px] font-semibold text-gray-600">{exp.company}</div>
                            <p className="text-xs text-gray-500 leading-relaxed mt-1">{exp.desc}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {projects.length > 0 && (
                    <div className="space-y-3">
                      <h3 className={`text-[9px] font-bold uppercase tracking-widest border-b border-gray-200 pb-0.5 ${theme.text}`}>Projects</h3>
                      <div className="space-y-4">
                        {projects.map((proj, idx) => (
                          <div key={idx} className="space-y-1">
                            <div className="flex justify-between text-xs font-bold text-gray-900">
                              <span>{proj.name}</span>
                              {proj.link && <span className="text-[10px] text-gray-400 font-normal">{proj.link}</span>}
                            </div>
                            <div className="text-[10px] font-semibold text-gray-600">{proj.techStack}</div>
                            <p className="text-xs text-gray-505 leading-relaxed mt-1">{proj.desc}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </CandidateLayout>
  );
}
