'use strict';
'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, 
  User, 
  Briefcase, 
  FileText, 
  HelpCircle, 
  Sparkles, 
  Heart, 
  ShieldCheck, 
  Eye, 
  Check, 
  Loader2, 
  Upload, 
  ArrowRight, 
  ArrowLeft
} from 'lucide-react';

interface QuickApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: any;
  onSuccess: (newApplication: any) => void;
}

export default function QuickApplyModal({ isOpen, onClose, job, onSuccess }: QuickApplyModalProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [appId, setAppId] = useState('');

  // Step 1: Personal Info
  const [personalInfo, setPersonalInfo] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    preferredName: '',
    email: '',
    phone: '',
    countryCode: '+91',
    dob: '',
    gender: '',
    nationality: '',
    city: '',
    state: '',
    country: '',
    postalCode: '',
    linkedin: '',
    github: '',
    portfolio: '',
    personalWebsite: '',
    address: ''
  });

  // Step 2: Professional Info
  const [professionalInfo, setProfessionalInfo] = useState({
    currentTitle: '',
    currentCompany: '',
    expLevel: 'Mid Level',
    yearsOfExp: '',
    highestQual: 'B.Tech',
    university: '',
    gradYear: '',
    currentSalary: '',
    expectedSalary: '',
    noticePeriod: 'Immediate',
    empStatus: 'Employed',
    prefJobType: 'Full-time',
    prefWorkMode: 'Remote',
    prefLocations: '',
    primarySkills: '',
    secondarySkills: '',
    languages: 'English, Hindi',
    certifications: '',
    achievements: '',
    projects: ''
  });

  // Step 3: Resume
  const [resumeName, setResumeName] = useState('');
  const [parsingResume, setParsingResume] = useState(false);
  const [parsedResults, setParsedResults] = useState<any>(null);

  // Step 4: Questions
  const [questions, setQuestions] = useState({
    whyRole: '',
    expSpringBoot: '',
    workedRemotely: 'Yes',
    expectedCTC: '',
    legalAuth: 'Yes',
    requireSponsorship: 'No',
    willingToRelocate: 'Yes'
  });

  // Step 5: AI Assistant Workspace
  const [aiTextToImprove, setAiTextToImprove] = useState('');
  const [improvingAi, setImprovingAi] = useState(false);
  const [aiTargetField, setAiTargetField] = useState<'whyRole' | 'expSpringBoot'>('whyRole');

  // Step 6: Diversity
  const [diversityInfo, setDiversityInfo] = useState({
    gender: '',
    veteranStatus: 'No',
    disabilityStatus: 'No',
    ethnicity: '',
    pronouns: ''
  });

  // Step 7: Work Auth
  const [workAuth, setWorkAuth] = useState({
    visaStatus: 'Citizen',
    citizenship: 'Indian',
    workPermit: 'Yes',
    needSponsorship: 'No',
    passportNumber: ''
  });

  // Load Draft from LocalStorage on mount/job change
  useEffect(() => {
    if (job?.id) {
      const savedDraft = localStorage.getItem(`hiresense_apply_draft_${job.id}`);
      if (savedDraft) {
        try {
          const parsed = JSON.parse(savedDraft);
          if (parsed.personalInfo) setPersonalInfo(parsed.personalInfo);
          if (parsed.professionalInfo) setProfessionalInfo(parsed.professionalInfo);
          if (parsed.questions) setQuestions(parsed.questions);
          if (parsed.diversityInfo) setDiversityInfo(parsed.diversityInfo);
          if (parsed.workAuth) setWorkAuth(parsed.workAuth);
          if (parsed.resumeName) {
            setResumeName(parsed.resumeName);
            setParsedResults(parsed.parsedResults || null);
          }
          if (parsed.step) setStep(parsed.step);
        } catch (e) {
          console.error("Failed to parse draft details", e);
        }
      } else {
        // Reset states
        setStep(1);
        setSuccess(false);
        setResumeName('');
        setParsedResults(null);
      }
    }
  }, [job]);

  // Auto-Save Draft to LocalStorage after step changes or form edits
  const saveDraft = (nextStep: number) => {
    if (!job?.id) return;
    const draftData = {
      personalInfo,
      professionalInfo,
      questions,
      diversityInfo,
      workAuth,
      resumeName,
      parsedResults,
      step: nextStep
    };
    localStorage.setItem(`hiresense_apply_draft_${job.id}`, JSON.stringify(draftData));
  };

  const handleNext = () => {
    const nextStep = step + 1;
    setStep(nextStep);
    saveDraft(nextStep);
  };

  const handleBack = () => {
    const prevStep = step - 1;
    setStep(prevStep);
    saveDraft(prevStep);
  };

  const autofillFromProfile = () => {
    setPersonalInfo({
      firstName: 'Arjun',
      middleName: '',
      lastName: 'Mehta',
      preferredName: 'Arjun',
      email: 'arjun.mehta@gmail.com',
      phone: '98765 43210',
      countryCode: '+91',
      dob: '2001-08-15',
      gender: 'Male',
      nationality: 'Indian',
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'India',
      postalCode: '400001',
      linkedin: 'linkedin.com/in/arjunmehta',
      github: 'github.com/arjunmehta',
      portfolio: 'arjunmehta.dev',
      personalWebsite: 'arjunmehta.dev',
      address: '12, Marine Drive, Mumbai'
    });

    setProfessionalInfo({
      currentTitle: 'Software Engineer Intern',
      currentCompany: 'Tech Corp',
      expLevel: 'Entry Level',
      yearsOfExp: '1',
      highestQual: 'B.Tech in Computer Science',
      university: 'IIT Bombay',
      gradYear: '2024',
      currentSalary: '₹6,0,000',
      expectedSalary: '₹12,0,000',
      noticePeriod: 'Immediate',
      empStatus: 'Completed Intern',
      prefJobType: 'Full-time',
      prefWorkMode: 'Remote',
      prefLocations: 'Bengaluru, Pune, Mumbai',
      primarySkills: 'Java, Spring Boot, Microservices, PostgreSQL',
      secondarySkills: 'Docker, AWS S3, Redis, Next.js, Kafka',
      languages: 'English (Fluent), Hindi (Native)',
      certifications: 'AWS Certified Cloud Practitioner',
      achievements: 'Winner of National Hackathon 2023',
      projects: 'HireSense AI, Docker Sandbox Compiler, pgvector Search Engine'
    });
  };

  const simulateResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setResumeName(file.name);
      setParsingResume(true);
      
      // Simulate AI resume parsing latency
      setTimeout(() => {
        setParsingResume(false);
        setParsedResults({
          matchPercentage: 92,
          atsScore: 88,
          extractedSkills: ['Java', 'Spring Boot', 'Microservices', 'Docker', 'AWS S3', 'Redis'],
          missingSkills: ['Kubernetes', 'Elasticsearch'],
          improvements: [
            'Add architectural metrics: Describe latency reductions achieved in pgvector queries.',
            'Include Kafka stream partition details to boost distributed systems scoring.'
          ]
        });
        // Save draft with parsed results
        const draftData = {
          personalInfo,
          professionalInfo,
          questions,
          diversityInfo,
          workAuth,
          resumeName: file.name,
          parsedResults: {
            matchPercentage: 92,
            atsScore: 88,
            extractedSkills: ['Java', 'Spring Boot', 'Microservices', 'Docker', 'AWS S3', 'Redis'],
            missingSkills: ['Kubernetes', 'Elasticsearch'],
            improvements: [
              'Add architectural metrics: Describe latency reductions achieved in pgvector queries.',
              'Include Kafka stream partition details to boost distributed systems scoring.'
            ]
          },
          step: 3
        };
        localStorage.setItem(`hiresense_apply_draft_${job.id}`, JSON.stringify(draftData));
      }, 1800);
    }
  };

  const handleImproveWithAI = async () => {
    const textToImprove = questions[aiTargetField];
    if (!textToImprove.trim()) return;

    setImprovingAi(true);
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: `Improve this job application answer. Make it sound professional, clean, concise, grammar-perfect, and authentic. Answer: "${textToImprove}"`
      });

      if (response.ok) {
        const polished = await response.text();
        setQuestions(prev => ({
          ...prev,
          [aiTargetField]: polished
        }));
        setAiTextToImprove(polished);
      }
    } catch (e) {
      console.error("AI enhancement failed", e);
    } finally {
      setImprovingAi(false);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    
    // Simulate premium loading animation
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      const generatedId = `APP-${Math.floor(10000 + Math.random() * 90000)}-2026`;
      setAppId(generatedId);

      // Clean draft from local storage upon successful submission
      localStorage.removeItem(`hiresense_apply_draft_${job.id}`);

      // Pass success details up to parent list
      onSuccess({
        id: Date.now(),
        jobTitle: job.title,
        companyName: job.company?.name || 'Tech Corp',
        location: job.location || 'Remote',
        status: 'APPLIED',
        atsScore: parsedResults?.atsScore || 85,
        appliedDate: new Date().toISOString().substring(0, 10)
      });
    }, 2200);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1B263B]/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#1B263B] border border-[#415A77] rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 text-white">
        
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-[#415A77] bg-[#1B263B] shrink-0 text-left">
          <div>
            <h2 className="text-base font-extrabold text-white flex items-center gap-2">
              <span className="h-6 w-6 rounded bg-[#415A77] flex items-center justify-center text-[10px] text-white">★</span>
              Quick Apply — {job?.title}
            </h2>
            <p className="text-[10px] text-[#E0E1DD]/60 font-semibold">{job?.company?.name || 'Tech Corp'} • {job?.location || 'Remote'}</p>
          </div>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-white rounded-lg hover:bg-[#1B263B] transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Wizard Step Progress Tracker */}
        {!success && (
          <div className="px-6 pt-4 shrink-0 bg-[#1B263B]">
            <div className="flex justify-between text-[9px] font-bold text-gray-450 uppercase tracking-wider mb-2">
              <span>Step {step} of 8</span>
              <span>{Math.round((step / 8) * 100)}% Complete</span>
            </div>
            <div className="w-full bg-[#1B263B]/10 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-[#415A77] h-full transition-all duration-300 rounded-full" 
                style={{ width: `${(step / 8) * 100}%` }}
              />
            </div>
            
            {/* Step badges */}
            <div className="flex justify-between mt-3 text-[9px] font-bold text-gray-400 border-b border-[#415A77] pb-3 overflow-x-auto whitespace-nowrap gap-4">
              <span className={step === 1 ? 'text-[#415A77]' : step > 1 ? 'text-[#E0E1DD]/60' : ''}>1. Personal</span>
              <span className={step === 2 ? 'text-[#415A77]' : step > 2 ? 'text-[#E0E1DD]/60' : ''}>2. Professional</span>
              <span className={step === 3 ? 'text-[#415A77]' : step > 3 ? 'text-[#E0E1DD]/60' : ''}>3. Resume</span>
              <span className={step === 4 ? 'text-[#415A77]' : step > 4 ? 'text-[#E0E1DD]/60' : ''}>4. Questions</span>
              <span className={step === 5 ? 'text-[#415A77]' : step > 5 ? 'text-[#E0E1DD]/60' : ''}>5. AI Coach</span>
              <span className={step === 6 ? 'text-[#415A77]' : step > 6 ? 'text-[#E0E1DD]/60' : ''}>6. Diversity</span>
              <span className={step === 7 ? 'text-[#415A77]' : step > 7 ? 'text-[#E0E1DD]/60' : ''}>7. Auth</span>
              <span className={step === 8 ? 'text-[#415A77]' : step > 8 ? 'text-[#E0E1DD]/60' : ''}>8. Review</span>
            </div>
          </div>
        )}

        {/* Content Body */}
        <div className="flex-1 p-6 overflow-y-auto min-h-0 text-left">
          {success ? (
            /* Success Panel */
            <div className="py-8 text-center space-y-6 max-w-2xl mx-auto">
              <div className="h-16 w-16 bg-[#415A77]/15 border border-[#415A77]/35 text-[#415A77] rounded-full flex items-center justify-center text-3xl mx-auto animate-bounce">
                🎉
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-white tracking-tight">Application Submitted Successfully!</h3>
                <p className="text-xs text-[#B3AF8F] font-bold mt-1">Application ID: {appId}</p>
                <p className="text-xs text-gray-400 font-semibold mt-1">Estimated Review Time: 3 - 5 Business Days</p>
              </div>

              {/* AI Resume Insights block */}
              <div className="p-5 rounded-xl border border-[#415A77] bg-[#1B263B]/10 text-left space-y-3">
                <h4 className="text-xs font-bold text-[#B3AF8F] uppercase tracking-wider flex items-center gap-1.5">
                  ★ AI Resume Insights & Matches
                </h4>
                <p className="text-[11px] text-[#E0E1DD]/90 leading-relaxed">
                  Your resume has an **{parsedResults?.atsScore || 85}% ATS compatibility score** for this position. We have indexed your skills and pushed your profile to the Recruiter's top screening matches.
                </p>
              </div>

              <div className="pt-4 flex justify-center gap-3">
                <button 
                  onClick={onClose} 
                  className="px-6 py-2 rounded-lg bg-[#415A77] hover:bg-[#a15666] text-white font-bold text-xs"
                >
                  Go to Dashboard
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
              
              {/* Step 1: Personal Info */}
              {step === 1 && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-[#415A77]">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                      <User className="h-4 w-4 text-[#415A77]" /> Personal Information
                    </h3>
                    <button 
                      type="button" 
                      onClick={autofillFromProfile}
                      className="px-3 py-1 rounded bg-[#415A77]/10 hover:bg-[#415A77]/20 text-[#415A77] border border-[#415A77]/15 font-bold text-[10px] flex items-center gap-1"
                    >
                      ★ Auto-fill from Profile
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-[#E0E1DD]/65 uppercase mb-1">First Name</label>
                      <input 
                        type="text" 
                        value={personalInfo.firstName} 
                        onChange={(e) => setPersonalInfo({...personalInfo, firstName: e.target.value})}
                        className="w-full bg-[#1B263B] border border-[#415A77] rounded p-2 text-xs text-white focus:outline-none focus:border-[#415A77]"
                        required 
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-[#E0E1DD]/65 uppercase mb-1">Middle Name</label>
                      <input 
                        type="text" 
                        value={personalInfo.middleName} 
                        onChange={(e) => setPersonalInfo({...personalInfo, middleName: e.target.value})}
                        className="w-full bg-[#1B263B] border border-[#415A77] rounded p-2 text-xs text-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-[#E0E1DD]/65 uppercase mb-1">Last Name</label>
                      <input 
                        type="text" 
                        value={personalInfo.lastName} 
                        onChange={(e) => setPersonalInfo({...personalInfo, lastName: e.target.value})}
                        className="w-full bg-[#1B263B] border border-[#415A77] rounded p-2 text-xs text-white focus:outline-none focus:border-[#415A77]"
                        required 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-[#E0E1DD]/65 uppercase mb-1">Email Address</label>
                      <input 
                        type="email" 
                        value={personalInfo.email} 
                        onChange={(e) => setPersonalInfo({...personalInfo, email: e.target.value})}
                        className="w-full bg-[#1B263B] border border-[#415A77] rounded p-2 text-xs text-white focus:outline-none focus:border-[#415A77]"
                        required 
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="col-span-1">
                        <label className="block text-[10px] font-bold text-[#E0E1DD]/65 uppercase mb-1">Code</label>
                        <input 
                          type="text" 
                          value={personalInfo.countryCode} 
                          onChange={(e) => setPersonalInfo({...personalInfo, countryCode: e.target.value})}
                          className="w-full bg-[#1B263B] border border-[#415A77] rounded p-2 text-xs text-white focus:outline-none"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-[10px] font-bold text-[#E0E1DD]/65 uppercase mb-1">Phone Number</label>
                        <input 
                          type="text" 
                          value={personalInfo.phone} 
                          onChange={(e) => setPersonalInfo({...personalInfo, phone: e.target.value})}
                          className="w-full bg-[#1B263B] border border-[#415A77] rounded p-2 text-xs text-white focus:outline-none focus:border-[#415A77]"
                          required 
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-[#E0E1DD]/65 uppercase mb-1">City</label>
                      <input 
                        type="text" 
                        value={personalInfo.city} 
                        onChange={(e) => setPersonalInfo({...personalInfo, city: e.target.value})}
                        className="w-full bg-[#1B263B] border border-[#415A77] rounded p-2 text-xs text-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-[#E0E1DD]/65 uppercase mb-1">State / Province</label>
                      <input 
                        type="text" 
                        value={personalInfo.state} 
                        onChange={(e) => setPersonalInfo({...personalInfo, state: e.target.value})}
                        className="w-full bg-[#1B263B] border border-[#415A77] rounded p-2 text-xs text-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-[#E0E1DD]/65 uppercase mb-1">Country</label>
                      <input 
                        type="text" 
                        value={personalInfo.country} 
                        onChange={(e) => setPersonalInfo({...personalInfo, country: e.target.value})}
                        className="w-full bg-[#1B263B] border border-[#415A77] rounded p-2 text-xs text-white focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Professional Info */}
              {step === 2 && (
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider pb-2 border-b border-[#415A77] flex items-center gap-1.5">
                    <Briefcase className="h-4 w-4 text-[#415A77]" /> Professional Experience
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-[#E0E1DD]/65 uppercase mb-1">Current/Last Job Title</label>
                      <input 
                        type="text" 
                        value={professionalInfo.currentTitle} 
                        onChange={(e) => setProfessionalInfo({...professionalInfo, currentTitle: e.target.value})}
                        className="w-full bg-[#1B263B] border border-[#415A77] rounded p-2 text-xs text-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-[#E0E1DD]/65 uppercase mb-1">Current/Last Company</label>
                      <input 
                        type="text" 
                        value={professionalInfo.currentCompany} 
                        onChange={(e) => setProfessionalInfo({...professionalInfo, currentCompany: e.target.value})}
                        className="w-full bg-[#1B263B] border border-[#415A77] rounded p-2 text-xs text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-[#E0E1DD]/65 uppercase mb-1">Primary Skills</label>
                      <input 
                        type="text" 
                        value={professionalInfo.primarySkills} 
                        onChange={(e) => setProfessionalInfo({...professionalInfo, primarySkills: e.target.value})}
                        className="w-full bg-[#1B263B] border border-[#415A77] rounded p-2 text-xs text-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-[#E0E1DD]/65 uppercase mb-1">Secondary Skills</label>
                      <input 
                        type="text" 
                        value={professionalInfo.secondarySkills} 
                        onChange={(e) => setProfessionalInfo({...professionalInfo, secondarySkills: e.target.value})}
                        className="w-full bg-[#1B263B] border border-[#415A77] rounded p-2 text-xs text-white focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Resume Upload */}
              {step === 3 && (
                <div className="space-y-6">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider pb-2 border-b border-[#415A77] flex items-center gap-1.5">
                    <FileText className="h-4 w-4 text-[#415A77]" /> Resume & Documents
                  </h3>

                  <div className="border border-dashed border-[#1B263B] rounded-2xl p-8 bg-[#1B263B]/40 text-center space-y-4 hover:border-[#415A77]/30 transition-all relative">
                    <input 
                      type="file" 
                      onChange={simulateResumeUpload} 
                      accept=".pdf" 
                      className="absolute inset-0 opacity-0 cursor-pointer" 
                    />
                    <Upload className="h-10 w-10 text-[#415A77] mx-auto" />
                    <div>
                      <p className="text-xs font-bold text-white">Drag & drop your primary resume PDF here</p>
                      <p className="text-[10px] text-gray-400 mt-1">Accepts PDF files up to 5MB</p>
                    </div>
                  </div>

                  {parsingResume && (
                    <div className="p-4 rounded-xl border border-[#415A77] bg-[#1B263B] flex items-center justify-center gap-3 text-xs text-gray-400">
                      <Loader2 className="h-4 w-4 text-[#415A77] animate-spin" />
                      <span>★ AI Resume Reader parsing document and mapping candidate skills...</span>
                    </div>
                  )}

                  {parsedResults && !parsingResume && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                      <div className="flex gap-3 items-center justify-between p-4 rounded-xl border border-[#B3AF8F]/20 bg-[#B3AF8F]/5">
                        <div className="flex gap-3 items-center">
                          <div className="h-12 w-12 rounded-full bg-[#B3AF8F]/10 flex items-center justify-center text-[#B3AF8F] font-bold border border-[#B3AF8F]/15">
                            {parsedResults.matchPercentage}%
                          </div>
                          <div>
                            <span className="block text-xs font-bold text-white">Excellent Resume Match!</span>
                            <span className="block text-[10px] text-gray-400 font-semibold">Matched successfully against the requirements</span>
                          </div>
                        </div>
                        <span className="text-[10px] px-3 py-1 rounded bg-[#B3AF8F]/10 text-[#B3AF8F] border border-[#B3AF8F]/10 font-bold uppercase">
                          ATS Grade: Pass
                        </span>
                      </div>
                    </div>
                  )}

                  {resumeName && (
                    <div className="p-3 rounded-lg bg-[#1B263B] border border-[#415A77] flex justify-between items-center text-xs">
                      <span className="font-semibold text-[#415A77]">{resumeName}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Step 4: Questions */}
              {step === 4 && (
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider pb-2 border-b border-[#415A77] flex items-center gap-1.5">
                    <HelpCircle className="h-4 w-4 text-[#415A77]" /> Custom Role Questions
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-350 mb-1">Why do you want this role?</label>
                      <textarea 
                        value={questions.whyRole} 
                        onChange={(e) => setQuestions({...questions, whyRole: e.target.value})}
                        rows={3}
                        className="w-full bg-[#1B263B] border border-[#415A77] rounded p-2 text-xs text-white focus:outline-none focus:border-[#415A77]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 5: AI Coach */}
              {step === 5 && (
                <div className="space-y-4">
                  <div className="pb-2 border-b border-[#415A77]">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="h-4 w-4 text-[#415A77]" /> AI Coach Response Enhancer
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="block text-[10px] font-bold text-gray-450 uppercase mb-1">Your Draft Response:</span>
                      <textarea 
                        value={questions[aiTargetField]}
                        onChange={(e) => setQuestions({ ...questions, [aiTargetField]: e.target.value })}
                        rows={6}
                        className="w-full bg-[#1B263B] border border-[#415A77] rounded p-2.5 text-xs text-white focus:outline-none focus:border-[#415A77]"
                      />
                    </div>
                    <div className="p-4 rounded-xl border border-[#415A77] bg-[#1B263B]/40 flex flex-col justify-between">
                      <button
                        type="button"
                        onClick={handleImproveWithAI}
                        disabled={improvingAi || !questions[aiTargetField]}
                        className="w-full py-2 bg-[#415A77] hover:bg-[#a15666] text-white font-bold text-xs rounded transition-colors flex items-center justify-center gap-1.5"
                      >
                        ✨ Enhance Response with Gemini
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 6: Diversity */}
              {step === 6 && (
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider pb-2 border-b border-[#415A77] flex items-center gap-1.5">
                    <Heart className="h-4 w-4 text-[#415A77]" /> Equal Opportunity Diversity Info
                  </h3>
                </div>
              )}

              {/* Step 7: Auth */}
              {step === 7 && (
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider pb-2 border-b border-[#415A77] flex items-center gap-1.5">
                    <ShieldCheck className="h-4.5 w-4.5 text-[#415A77]" /> Work Authorization
                  </h3>
                </div>
              )}

              {/* Step 8: Review */}
              {step === 8 && (
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider pb-2 border-b border-[#415A77] flex items-center gap-1.5">
                    <Eye className="h-4.5 w-4.5 text-[#415A77]" /> Review Application Details
                  </h3>

                  <div className="space-y-4 divide-y divide-gray-900/60 max-h-[50vh] overflow-y-auto pr-2">
                    <div className="pb-3 text-xs">
                      <span className="block font-bold text-[#415A77] uppercase tracking-widest mb-1.5">1. Personal Information</span>
                      <div className="grid grid-cols-2 gap-y-1.5 text-gray-300">
                        <div>Name: {personalInfo.firstName} {personalInfo.lastName}</div>
                        <div>Email: {personalInfo.email}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </form>
          )}
        </div>

        {/* Footer Navigation bar */}
        {!success && (
          <div className="px-6 py-4 border-t border-[#415A77] bg-[#1B263B] flex justify-between shrink-0">
            <button
              type="button"
              onClick={handleBack}
              disabled={step === 1}
              className="px-4 py-2 rounded-lg bg-[#1B263B] border border-[#415A77] hover:bg-gray-800 text-gray-400 hover:text-white font-bold text-xs disabled:opacity-45 flex items-center gap-1.5"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back
            </button>

            {step < 8 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-5 py-2 rounded-lg bg-[#415A77] hover:bg-[#a15666] text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-[#415A77]/15"
              >
                Continue <ArrowRight className="h-3.5 w-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="px-6 py-2 rounded-lg bg-[#415A77] hover:bg-[#a15666] text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-[#415A77]/20 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" /> Submitting Application...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4" /> Submit Application
                  </>
                )}
              </button>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
