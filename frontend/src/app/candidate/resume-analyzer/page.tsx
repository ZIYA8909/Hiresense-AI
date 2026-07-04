'use strict';
'use client';

import React, { useState } from 'react';
import CandidateLayout from '@/components/CandidateLayout';
import { 
  UploadCloud, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  ArrowRight, 
  TrendingUp, 
  Sparkles, 
  Coins 
} from 'lucide-react';

interface AnalysisResult {
  skills: string[];
  education: string[];
  experience: string[];
  atsScore: number;
  missingKeywords: string[];
  grammarSuggestions: string;
  formattingSuggestions: string;
  salaryEstimate: string;
  improvementRecommendations: string;
}

export default function ResumeAnalyzer() {
  const [file, setFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [step, setStep] = useState(0);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const steps = [
    'Uploading PDF to AWS S3 bucket...',
    'Extracting text content from resume...',
    'Generating 1536-dim vector embedding...',
    'Running semantic comparison against market benchmarks...',
    'Performing LLM-based parsing and ATS optimization checks...'
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResult(null);
    }
  };

  const handleUpload = () => {
    if (!file) return;
    setAnalyzing(true);
    setStep(0);

    // Simulate multi-step pipeline progress
    const interval = setInterval(() => {
      setStep((prev) => {
        if (prev >= steps.length - 1) {
          clearInterval(interval);
          setResult({
            skills: ['Java', 'Spring Boot', 'Microservices', 'Docker', 'AWS S3', 'Redis', 'TypeScript', 'React'],
            education: ['Bachelor of Science in Computer Science, State University (GPA: 3.8)'],
            experience: ['Software Engineer Intern at Tech Corp (6 months) - Built microservices backend using Spring Boot and Docker'],
            atsScore: 85,
            missingKeywords: ['Elasticsearch', 'Kafka', 'Kubernetes'],
            grammarSuggestions: 'No critical errors detected. Replaced active verbs for impact.',
            formattingSuggestions: 'Consider adding a certifications block at the top.',
            salaryEstimate: '$85,000 - $105,000',
            improvementRecommendations: 'Add dynamic project links and list concrete metrics (e.g., "Reduced response latency by 20%").'
          });
          setAnalyzing(false);
          return prev;
        }
        return prev + 1;
      });
    }, 1500);
  };

  return (
    <CandidateLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight">AI Resume Analyzer</h1>
          <p className="text-gray-400 text-sm mt-1">Upload your resume in PDF format to calculate your ATS score, find missing skills, and get salary predictions.</p>
        </div>

        {/* Uploader Card */}
        {!result && !analyzing && (
          <div className="glass-card p-10 rounded-2xl border-dashed border-2 border-[#415A77] text-center flex flex-col items-center justify-center">
            <UploadCloud className="h-12 w-12 text-emerald-400 mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">Drag and drop your PDF resume here</h3>
            <p className="text-gray-500 text-xs mb-6">Support files up to 10MB</p>
            
            <input 
              type="file" 
              accept=".pdf" 
              id="resume-upload" 
              className="hidden" 
              onChange={handleFileChange} 
            />
            
            <label 
              htmlFor="resume-upload" 
              className="px-6 py-2.5 rounded-lg bg-[#1B263B] border border-[#415A77] hover:border-[#415A77] text-sm font-semibold cursor-pointer transition-all mb-4"
            >
              Select PDF File
            </label>

            {file && (
              <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold p-2 bg-emerald-500/5 rounded-lg border border-emerald-500/10">
                <FileText className="h-4 w-4" />
                {file.name}
              </div>
            )}

            {file && (
              <button
                onClick={handleUpload}
                className="mt-6 px-8 py-3 rounded-lg bg-emerald-500 text-black font-bold hover:bg-emerald-400 transition-all text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/15"
              >
                Start AI Analysis <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
        )}

        {/* Analyzing step progression */}
        {analyzing && (
          <div className="glass-card p-10 rounded-2xl text-center flex flex-col items-center">
            <div className="relative h-16 w-16 mb-6">
              <div className="absolute inset-0 rounded-full border-4 border-[#415A77]" />
              <div className="absolute inset-0 rounded-full border-4 border-t-emerald-500 animate-spin" />
            </div>
            <h3 className="text-lg font-bold text-white mb-4">Analyzing Resume</h3>
            
            <div className="w-full max-w-md bg-[#1B263B] rounded-full h-1.5 mb-6 overflow-hidden">
              <div 
                className="bg-emerald-500 h-1.5 transition-all duration-500" 
                style={{ width: `${((step + 1) / steps.length) * 100}%` }}
              />
            </div>
            
            <p className="text-sm text-emerald-400 font-semibold animate-pulse">{steps[step]}</p>
          </div>
        )}

        {/* Results Page */}
        {result && (
          <div className="space-y-6">
            {/* Top Score banner */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="glass-card p-6 rounded-2xl text-center md:col-span-1 flex flex-col justify-center items-center">
                <div className="relative h-28 w-28 flex items-center justify-center mb-4">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="56" cy="56" r="48" stroke="#1f2937" strokeWidth="8" fill="transparent" />
                    <circle cx="56" cy="56" r="48" stroke="#10b981" strokeWidth="8" fill="transparent" 
                            strokeDasharray={2 * Math.PI * 48}
                            strokeDashoffset={2 * Math.PI * 48 * (1 - result.atsScore / 100)} />
                  </svg>
                  <span className="absolute text-2xl font-black text-white">{result.atsScore}%</span>
                </div>
                <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">ATS Match Rating</div>
              </div>

              <div className="glass-card p-6 rounded-2xl md:col-span-2 flex flex-col justify-between">
                <div className="flex gap-4 items-start">
                  <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/10">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">AI Analysis Summary</h3>
                    <p className="text-xs text-gray-400 mt-2 leading-relaxed">{result.improvementRecommendations}</p>
                  </div>
                </div>
                
                <div className="border-t border-[#415A77] pt-4 mt-4 flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 text-gray-500 font-semibold">
                    <Coins className="h-4 w-4 text-emerald-400" /> Salary Estimate:
                  </span>
                  <span className="font-extrabold text-white">{result.salaryEstimate}</span>
                </div>
              </div>
            </div>

            {/* Resume vs Job Diff Box */}
            <div className="glass-card p-6 rounded-2xl">
              <h3 className="text-base font-bold text-white flex items-center gap-2 mb-4">
                <Sparkles className="h-5 w-5 text-emerald-400" /> Resume Skills vs Job Requirements Diff
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-xs font-bold text-emerald-400 mb-2 uppercase tracking-widest">Matched Skills</div>
                  <div className="flex flex-wrap gap-1.5">
                    {result.skills.map(skill => (
                      <span key={skill} className="px-2.5 py-1 rounded-md bg-emerald-500/5 border border-emerald-500/15 text-[10px] font-bold text-emerald-400">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-bold text-red-400 mb-2 uppercase tracking-widest">Missing Keywords</div>
                  <div className="flex flex-wrap gap-1.5">
                    {result.missingKeywords.map(keyword => (
                      <span key={keyword} className="px-2.5 py-1 rounded-md bg-red-500/5 border border-red-500/15 text-[10px] font-bold text-red-400">
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Suggestions details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass-card p-6 rounded-2xl">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Formatting Suggestions</h4>
                <p className="text-xs text-gray-300 leading-relaxed">{result.formattingSuggestions}</p>
              </div>
              <div className="glass-card p-6 rounded-2xl">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Grammar & Structure</h4>
                <p className="text-xs text-gray-300 leading-relaxed">{result.grammarSuggestions}</p>
              </div>
            </div>

            <div className="text-center pt-4">
              <button
                onClick={() => setResult(null)}
                className="px-6 py-2.5 rounded-lg bg-[#1B263B] border border-[#415A77] hover:border-[#415A77] text-xs font-bold transition-all"
              >
                Analyze Another Resume
              </button>
            </div>
          </div>
        )}
      </div>
    </CandidateLayout>
  );
}
