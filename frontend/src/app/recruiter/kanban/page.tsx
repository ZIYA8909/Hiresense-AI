'use strict';
'use client';

import React, { useState } from 'react';
import RecruiterLayout from '@/components/RecruiterLayout';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { 
  Search, 
  Sparkles, 
  FileText, 
  User, 
  TrendingUp, 
  Compass, 
  Star,
  CheckCircle,
  X,
  Briefcase,
  GraduationCap,
  HelpCircle,
  AlertTriangle,
  FileCheck
} from 'lucide-react';

interface Candidate {
  id: string;
  name: string;
  email: string;
  atsScore: number;
  aiMatchScore?: number;
  skills: string[];
  secondarySkills?: string[];
  missingSkills?: string[];
  currentCompany?: string;
  currentTitle?: string;
  yearsOfExp?: string;
  education?: string;
  university?: string;
  whyRole?: string;
  expSpringBoot?: string;
  aiRecommendation?: string;
}

interface Column {
  id: string;
  title: string;
  candidates: Candidate[];
}

export default function RecruiterKanban() {
  const [columns, setColumns] = useState<Record<string, Column>>({
    'APPLIED': {
      id: 'APPLIED',
      title: 'Applied',
      candidates: [
        { 
          id: '101', 
          name: 'Karan Patel', 
          email: 'karan.patel@gmail.com', 
          atsScore: 78, 
          skills: ['Python', 'Django', 'PostgreSQL'],
          secondarySkills: ['AWS', 'Git', 'Docker'],
          missingSkills: ['Kafka', 'Redis'],
          currentCompany: 'Freelance Solutions',
          currentTitle: 'Backend Developer',
          yearsOfExp: '3',
          education: 'M.Tech in Software Engineering',
          university: 'DTU Delhi',
          whyRole: 'I want to build highly scalable backend services using database index optimizations.',
          expSpringBoot: 'N/A (Primarily Python Django REST frameworks).',
          aiRecommendation: 'Good programming foundation. Lacks direct Spring Boot concurrency credentials. Recommended for screening.'
        },
        { 
          id: '102', 
          name: 'Priya Sharma', 
          email: 'priya.sharma@yahoo.com', 
          atsScore: 82, 
          skills: ['React', 'TypeScript', 'Tailwind'],
          secondarySkills: ['Next.js', 'Redux Toolkit', 'Jest'],
          missingSkills: ['Java', 'Spring Boot'],
          currentCompany: 'Web Agency',
          currentTitle: 'UI Developer',
          yearsOfExp: '2',
          education: 'B.E in Computer Science',
          university: 'BITS Pilani',
          whyRole: 'I want to lead the UI design system updates at Tech Corp.',
          expSpringBoot: 'Have worked with REST APIs but not implemented microservices in Java.',
          aiRecommendation: 'Excellent front-end architecture knowledge. Recommended to swap role alignment or proceed to UI developer pipelines.'
        }
      ]
    },
    'SCREENING': {
      id: 'SCREENING',
      title: 'Screening',
      candidates: [
        { 
          id: '103', 
          name: 'Arjun Mehta', 
          email: 'arjun.mehta@gmail.com', 
          atsScore: 92, 
          skills: ['Java', 'Spring Boot', 'Docker', 'AWS S3', 'Redis'],
          secondarySkills: ['Next.js', 'pgvector', 'Kafka', 'PostgreSQL'],
          missingSkills: ['Kubernetes', 'Elasticsearch'],
          currentCompany: 'Tech Corp',
          currentTitle: 'Software Engineer Intern',
          yearsOfExp: '1',
          education: 'B.Tech in Computer Science',
          university: 'IIT Bombay',
          whyRole: 'I want to contribute to the event-driven microservices architecture at Tech Corp.',
          expSpringBoot: 'Built scalable backend microservices APIs using Spring Boot, JPA, pgvector, and Docker. Optimized PostgreSQL queries.',
          aiRecommendation: 'Top-tier candidate. Strong knowledge of JVM diagnostics, locking concurrency models, and pgvector embeddings. Highly recommended to advance directly to Technical Round.'
        }
      ]
    },
    'INTERVIEW': {
      id: 'INTERVIEW',
      title: 'Interview',
      candidates: [
        { 
          id: '104', 
          name: 'Rohan Das', 
          email: 'rohan.das@gmail.com', 
          atsScore: 88, 
          skills: ['Java', 'Spring Boot', 'Kafka', 'Kubernetes'],
          secondarySkills: ['MongoDB', 'Docker', 'Jenkins'],
          missingSkills: ['Redis', 'pgvector'],
          currentCompany: 'Enterprise IT Solutions',
          currentTitle: 'Systems Engineer',
          yearsOfExp: '4',
          education: 'B.Tech in CSE',
          university: 'VIT Vellore',
          whyRole: 'Interested in working with microservices log-profiling, message brokers, and container orchestration.',
          expSpringBoot: 'Designed production-grade Spring Boot microservices handling asynchronous events via Kafka.',
          aiRecommendation: 'Experienced engineer with robust devops qualifications. Strongly recommended for technical interviewing.'
        }
      ]
    },
    'OFFER': {
      id: 'OFFER',
      title: 'Offer',
      candidates: []
    },
    'REJECTED': {
      id: 'REJECTED',
      title: 'Rejected',
      candidates: []
    }
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);

  const handleDragEnd = async (result: any) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;

    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return;
    }

    const sourceCol = columns[source.droppableId];
    const destCol = columns[destination.droppableId];
    const sourceCandidates = [...sourceCol.candidates];
    const destCandidates = [...destCol.candidates];

    const [removed] = sourceCandidates.splice(source.index, 1);
    const updatedCandidate = { ...removed };
    
    if (source.droppableId === destination.droppableId) {
      sourceCandidates.splice(destination.index, 0, updatedCandidate);
      setColumns({
        ...columns,
        [source.droppableId]: { ...sourceCol, candidates: sourceCandidates }
      });
    } else {
      destCandidates.splice(destination.index, 0, updatedCandidate);
      setColumns({
        ...columns,
        [source.droppableId]: { ...sourceCol, candidates: sourceCandidates },
        [destination.droppableId]: { ...destCol, candidates: destCandidates }
      });

      // Sync status updates with backend gateway
      try {
        await fetch(`http://localhost:8080/recruitment/applications/${draggableId}/status?status=${destination.droppableId}`, {
          method: 'PUT'
        });
        console.log(`[Kanban] Synced status update for candidate ${draggableId} to ${destination.droppableId}`);
      } catch (err) {
        console.warn('[Kanban] API Gateway unavailable. Handled locally.');
      }
    }
  };

  const handleSemanticSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setSearching(true);
    setTimeout(() => {
      const queryLower = searchQuery.toLowerCase();
      const updatedColumns = { ...columns };
      
      Object.keys(updatedColumns).forEach(colKey => {
        const candidates = updatedColumns[colKey].candidates.map(candidate => {
          let matches = 0;
          candidate.skills.forEach(skill => {
            if (queryLower.includes(skill.toLowerCase())) matches += 1;
          });
          
          let matchScore = 50;
          if (matches > 0) {
            matchScore = 75 + (matches * 8);
            if (matchScore > 98) matchScore = 98;
          } else if (queryLower.includes('java') && candidate.skills.includes('Java')) {
            matchScore = 91;
          }
          
          return {
            ...candidate,
            aiMatchScore: matchScore
          };
        });

        candidates.sort((a, b) => (b.aiMatchScore || 0) - (a.aiMatchScore || 0));
        updatedColumns[colKey] = { ...updatedColumns[colKey], candidates };
      });

      setColumns(updatedColumns);
      setSearching(false);
    }, 1500);
  };

  return (
    <RecruiterLayout>
      <div className="flex flex-col h-full relative">
        {/* Header and Semantic Search bar */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Kanban Funnel</h1>
            <p className="text-gray-400 text-sm mt-1">Manage active candidate lifecycles and run semantic searches.</p>
          </div>

          <form onSubmit={handleSemanticSearch} className="flex gap-2 w-full max-w-md">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-indigo-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#1B263B] border border-[#415A77] rounded-lg py-2 pl-10 pr-4 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                placeholder="Ask AI: 'Find Java devs with Docker & Redis'"
              />
            </div>
            <button
              type="submit"
              disabled={searching}
              className="px-4 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-400 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-indigo-500/10"
            >
              <Sparkles className="h-3.5 w-3.5" />
              {searching ? 'Sorting...' : 'Query AI'}
            </button>
          </form>
        </div>

        {/* Drag and Drop Context */}
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex-1 overflow-x-auto pb-4 flex gap-4 items-start min-h-[500px]">
            {Object.values(columns).map((column) => (
              <div key={column.id} className="w-72 shrink-0 bg-[#0B0F19]/40 border border-[#415A77] rounded-2xl p-4 flex flex-col max-h-[600px] overflow-hidden">
                <div className="flex items-center justify-between pb-3 border-b border-[#415A77] mb-4">
                  <h3 className="text-sm font-bold text-gray-300">{column.title}</h3>
                  <span className="px-2 py-0.5 rounded-full bg-[#1B263B] text-gray-500 text-[10px] font-bold border border-[#415A77]">
                    {column.candidates.length}
                  </span>
                </div>

                <Droppable droppableId={column.id}>
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="flex-1 space-y-3 overflow-y-auto min-h-[100px] pr-1"
                    >
                      {column.candidates.map((candidate, index) => (
                        <Draggable key={candidate.id} draggableId={candidate.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              onClick={() => setSelectedCandidate(candidate)}
                              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                                snapshot.isDragging
                                  ? 'bg-[#1e1b4b]/85 border-indigo-500 shadow-xl'
                                  : 'bg-[#1B263B] border-[#415A77] hover:border-indigo-500/30'
                              }`}
                            >
                              <div className="flex justify-between items-start gap-2 mb-2">
                                <span className="text-xs font-bold text-white leading-tight">{candidate.name}</span>
                                {candidate.aiMatchScore ? (
                                  <span className="px-1.5 py-0.5 rounded bg-[#B3AF8F]/10 text-[#B3AF8F] text-[9px] font-extrabold flex items-center gap-0.5 border border-[#B3AF8F]/15">
                                    <Sparkles className="h-2.5 w-2.5" />
                                    {candidate.aiMatchScore}%
                                  </span>
                                ) : (
                                  <span className="text-[10px] font-semibold text-gray-500">ATS: {candidate.atsScore}%</span>
                                )}
                              </div>
                              <p className="text-[10px] text-gray-500 mb-3 truncate">{candidate.email}</p>
                              
                              <div className="flex flex-wrap gap-1">
                                {candidate.skills.slice(0, 3).map(skill => (
                                  <span key={skill} className="px-1.5 py-0.5 rounded bg-[#1B263B] border border-[#415A77] text-[9px] text-gray-450 font-semibold">
                                    {skill}
                                  </span>
                                ))}
                                {candidate.skills.length > 3 && (
                                  <span className="text-[9px] text-gray-600 font-bold px-1 py-0.5">+{candidate.skills.length - 3}</span>
                                )}
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </DragDropContext>

        {/* Candidate Detail Modal Overlay */}
        {selectedCandidate && (
          <div className="fixed inset-y-0 right-0 z-50 w-full max-w-lg bg-[#1B263B] border-l border-[#415A77] p-6 flex flex-col shadow-2xl justify-between animate-in slide-in-from-right duration-300">
            <div className="flex-1 overflow-y-auto space-y-6 text-left pr-1">
              
              {/* Header */}
              <div className="flex justify-between items-start border-b border-[#415A77] pb-4">
                <div>
                  <h2 className="text-lg font-black text-white">{selectedCandidate.name}</h2>
                  <p className="text-xs text-gray-500 mt-0.5">{selectedCandidate.email}</p>
                  <p className="text-[10px] text-indigo-400 font-bold mt-1 uppercase tracking-widest">{selectedCandidate.currentTitle} • {selectedCandidate.currentCompany}</p>
                </div>
                <button 
                  onClick={() => setSelectedCandidate(null)}
                  className="p-1 text-gray-400 hover:text-white rounded-lg hover:bg-[#1B263B] transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* AI Recommendation Summary */}
              <div className="p-4 rounded-xl border border-indigo-500/20 bg-indigo-500/5 space-y-2.5">
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-1">
                  <Sparkles className="h-3.5 w-3.5 text-indigo-400" /> AI recommendation
                </span>
                <div className="flex justify-between items-center text-xs text-gray-300">
                  <span>ATS Compatbility Score:</span>
                  <span className="font-bold text-[#B3AF8F]">{selectedCandidate.atsScore}%</span>
                </div>
                <p className="text-[11px] text-gray-400 leading-relaxed italic border-t border-indigo-500/10 pt-2">
                  "{selectedCandidate.aiRecommendation}"
                </p>
              </div>

              {/* Skills breakdown */}
              <div className="space-y-2">
                <span className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest">Skill Sets</span>
                <div className="space-y-1.5">
                  <div>
                    <span className="text-[9px] font-semibold text-[#B3AF8F] block mb-1">Primary Match:</span>
                    <div className="flex flex-wrap gap-1">
                      {selectedCandidate.skills.map(s => (
                        <span key={s} className="px-2 py-0.5 rounded bg-[#1B263B] border border-[#415A77] text-[10px] text-gray-300">{s}</span>
                      ))}
                    </div>
                  </div>
                  {selectedCandidate.secondarySkills && (
                    <div>
                      <span className="text-[9px] font-semibold text-indigo-400 block mb-1 mt-1.5">Secondary Match:</span>
                      <div className="flex flex-wrap gap-1">
                        {selectedCandidate.secondarySkills.map(s => (
                          <span key={s} className="px-2 py-0.5 rounded bg-[#1B263B] border border-[#415A77] text-[10px] text-gray-350">{s}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {selectedCandidate.missingSkills && (
                    <div>
                      <span className="text-[9px] font-semibold text-yellow-500 block mb-1 mt-1.5">Missing Skills Gap:</span>
                      <div className="flex flex-wrap gap-1">
                        {selectedCandidate.missingSkills.map(s => (
                          <span key={s} className="px-2 py-0.5 rounded bg-yellow-500/10 border border-yellow-500/10 text-[10px] text-yellow-400">{s}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Work history & Education */}
              <div className="space-y-4">
                <div className="flex gap-2 items-start text-xs">
                  <Briefcase className="h-4 w-4 text-[#B3AF8F] mt-0.5 shrink-0" />
                  <div>
                    <span className="block font-bold text-gray-300 uppercase tracking-wider text-[10px]">Work History</span>
                    <span className="block text-gray-400 font-semibold mt-0.5">{selectedCandidate.currentTitle} at {selectedCandidate.currentCompany}</span>
                    <span className="block text-gray-500 text-[10px]">{selectedCandidate.yearsOfExp} Years of Experience</span>
                  </div>
                </div>

                <div className="flex gap-2 items-start text-xs">
                  <GraduationCap className="h-4.5 w-4.5 text-[#B3AF8F] mt-0.5 shrink-0" />
                  <div>
                    <span className="block font-bold text-gray-300 uppercase tracking-wider text-[10px]">Education</span>
                    <span className="block text-gray-400 font-semibold mt-0.5">{selectedCandidate.education}</span>
                    <span className="block text-gray-500 text-[10px]">{selectedCandidate.university}</span>
                  </div>
                </div>
              </div>

              {/* custom questions answers */}
              <div className="space-y-3 pt-3 border-t border-[#415A77]/60">
                <span className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest">Application Answers</span>
                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-gray-400 font-semibold block mb-0.5">Why are you interested in this role?</span>
                    <p className="pl-3 text-gray-500 italic leading-relaxed">"{selectedCandidate.whyRole || 'Not Answered'}"</p>
                  </div>
                  <div>
                    <span className="text-gray-400 font-semibold block mb-0.5">Describe your experience with Spring Boot & microservices:</span>
                    <p className="pl-3 text-gray-500 italic leading-relaxed">"{selectedCandidate.expSpringBoot || 'Not Answered'}"</p>
                  </div>
                </div>
              </div>

            </div>

            <div className="pt-4 border-t border-[#415A77] bg-[#1B263B] flex gap-2 shrink-0">
              <button 
                onClick={() => setSelectedCandidate(null)}
                className="flex-1 py-2 bg-[#1B263B] border border-[#415A77] hover:bg-gray-800 text-gray-400 hover:text-white font-bold text-xs rounded-lg transition-colors"
              >
                Close View
              </button>
              <button 
                onClick={() => {
                  alert(`Sent technical interview invitation email to ${selectedCandidate.email}.`);
                  setSelectedCandidate(null);
                }}
                className="flex-1 py-2 bg-[#B3AF8F] hover:bg-[#ab8920] text-black font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1"
              >
                <FileCheck className="h-4 w-4" /> Send Invitation
              </button>
            </div>

          </div>
        )}

      </div>
    </RecruiterLayout>
  );
}
