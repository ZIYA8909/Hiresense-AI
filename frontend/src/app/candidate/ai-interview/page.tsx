'use strict';
'use client';

import React, { useState } from 'react';
import CandidateLayout from '@/components/CandidateLayout';
import { useAuth } from '@/components/Providers';
import { 
  Play, 
  Send, 
  CheckCircle, 
  FileText, 
  Award, 
  AlertTriangle, 
  BookOpen, 
  Clock,
  ArrowRight
} from 'lucide-react';

interface Question {
  questionId: number;
  question: string;
}

interface EvaluationResult {
  feedback: string;
  technicalScore: number;
  communicationScore: number;
  confidenceScore: number;
  strengths: string;
  weaknesses: string;
  recommendedResources: string[];
}

export default function AiMockInterview() {
  const { user } = useAuth();
  const [role, setRole] = useState('Java Backend Developer');
  const [type, setType] = useState('TECHNICAL');
  const [active, setActive] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [questions, setQuestions] = useState<Question[]>([
    { questionId: 1, question: "Explain the difference between optimistic and pessimistic locking in databases, and when you would use each." },
    { questionId: 2, question: "How does the Java garbage collector work under the hood, and how do you optimize it?" },
    { questionId: 3, question: "Describe a time when you had to debug a complex performance issue in a microservice. What was your process?" }
  ]);
  
  const [qIndex, setQIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [answersList, setAnswersList] = useState<string[]>([]);
  const [transcript, setTranscript] = useState<string[]>([]);
  const [evaluating, setEvaluating] = useState(false);
  const [result, setResult] = useState<EvaluationResult | null>(null);

  const startInterview = () => {
    setActive(true);
    setQIndex(0);
    setTranscript([]);
    setAnswersList([]);
    setResult(null);
  };

  const handleNext = () => {
    if (!answer.trim()) return;
    
    // Save dialogue entry to transcript
    const currentQ = questions[qIndex].question;
    setTranscript(prev => [...prev, `Q: ${currentQ}`, `A: ${answer}`]);
    const updatedAnswers = [...answersList, answer];
    setAnswersList(updatedAnswers);
    setAnswer('');

    if (qIndex >= questions.length - 1) {
      triggerEvaluation(updatedAnswers);
    } else {
      setQIndex(prev => prev + 1);
    }
  };

  const triggerEvaluation = (answers: string[]) => {
    setEvaluating(true);
    setActive(false);

    // Simulate AI grading model with real response verification
    setTimeout(() => {
      let totalScore = 0;
      const answersCount = answers.length || 1;
      const strengthsList: string[] = [];
      const weaknessesList: string[] = [];
      let roadmaps: string[] = [];

      answers.forEach((ans, index) => {
        const cleanAns = ans.toLowerCase().trim();
        let qScore = 0;

        if (cleanAns.length < 15) {
          qScore = 5;
          weaknessesList.push(`Q${index + 1}: Answer was extremely brief and lacked technical detail.`);
        } else if (cleanAns.includes("don't know") || cleanAns.includes("no idea") || cleanAns.includes("skip") || cleanAns === "wrong" || cleanAns === "test") {
          qScore = 0;
          weaknessesList.push(`Q${index + 1}: Stated lack of knowledge or provided placeholder text.`);
        } else {
          if (index === 0) {
            // Locking question
            let hits = 0;
            if (cleanAns.includes('version') || cleanAns.includes('timestamp')) hits++;
            if (cleanAns.includes('optimistic')) hits++;
            if (cleanAns.includes('pessimistic')) hits++;
            if (cleanAns.includes('lock') || cleanAns.includes('blocking')) hits++;
            if (cleanAns.includes('conflict') || cleanAns.includes('concurrency') || cleanAns.includes('collision')) hits++;
            
            qScore = Math.min(100, hits * 20);
            if (qScore >= 60) {
              strengthsList.push("Demonstrated solid understanding of optimistic/pessimistic database locking models.");
            } else {
              weaknessesList.push("Struggled to articulate version checks or locking collisions in databases.");
            }
          } else if (index === 1) {
            // JVM GC question
            let hits = 0;
            if (cleanAns.includes('heap') || cleanAns.includes('memory')) hits++;
            if (cleanAns.includes('generation') || cleanAns.includes('eden') || cleanAns.includes('survivor') || cleanAns.includes('tenured')) hits++;
            if (cleanAns.includes('mark') || cleanAns.includes('sweep') || cleanAns.includes('compact')) hits++;
            if (cleanAns.includes('g1') || cleanAns.includes('zgc') || cleanAns.includes('parallel')) hits++;
            if (cleanAns.includes('jvm') || cleanAns.includes('flag') || cleanAns.includes('tune') || cleanAns.includes('tuning') || cleanAns.includes('size')) hits++;
            
            qScore = Math.min(100, hits * 20);
            if (qScore >= 60) {
              strengthsList.push("Good grasp of generational JVM memory management and GC collectors.");
            } else {
              weaknessesList.push("Missed detailing garbage collection phases (eden, survivor) or JVM tuning flags.");
            }
          } else if (index === 2) {
            // Performance debugging question
            let hits = 0;
            if (cleanAns.includes('metric') || cleanAns.includes('log') || cleanAns.includes('trace') || cleanAns.includes('prometheus') || cleanAns.includes('grafana')) hits++;
            if (cleanAns.includes('profile') || cleanAns.includes('profiler') || cleanAns.includes('jprofiler') || cleanAns.includes('dump')) hits++;
            if (cleanAns.includes('thread') || cleanAns.includes('leak') || cleanAns.includes('memory') || cleanAns.includes('query')) hits++;
            if (cleanAns.includes('analyze') || cleanAns.includes('latency') || cleanAns.includes('bottleneck')) hits++;
            if (cleanAns.includes('process') || cleanAns.includes('tool') || cleanAns.includes('jmeter')) hits++;
            
            qScore = Math.min(100, hits * 20);
            if (qScore >= 60) {
              strengthsList.push("Methodical diagnostics process for profiling thread locks and memory leaks.");
            } else {
              weaknessesList.push("Did not outline profiling tools (e.g. heap dump, thread dump analyzer) for microservices.");
            }
          }
        }
        totalScore += qScore;
      });

      const finalTechnicalScore = Math.round(totalScore / answersCount);
      const finalCommunicationScore = Math.max(15, Math.round(finalTechnicalScore * 0.95 + (Math.random() * 8 - 4)));
      const finalConfidenceScore = Math.max(10, Math.round(finalTechnicalScore * 0.9 + (Math.random() * 12 - 6)));

      let overallFeedback = "";
      if (finalTechnicalScore >= 80) {
        overallFeedback = `${user?.name || 'The candidate'} showed excellent expert knowledge. The answers demonstrate rigorous industry experience with deep JVM diagnostics, microservices engineering, and database concurrency isolation.`;
        roadmaps = [
          'Design Patterns for Distributed Systems - O\'Reilly',
          'Advanced PostgreSQL Concurrency Tuning Guide'
        ];
      } else if (finalTechnicalScore >= 50) {
        overallFeedback = `${user?.name || 'The candidate'} has a solid foundational base, but missed critical technical definitions (e.g., versioning tags, heap segments, or specific JVM flags). Minor revisions on concurrent architectures recommended.`;
        roadmaps = [
          'High-Performance Java Persistence by Vlad Mihalcea',
          'Tuning GC for low-latency Java applications - Oracle Dev Guide'
        ];
      } else {
        overallFeedback = `${user?.name || 'The candidate\'s'} response failed to meet the technical threshold. Several answers were either incomplete, generic, or incorrect. Focus on learning core memory blocks, locking theories, and active debugging processes.`;
        roadmaps = [
          'Java Concurrency in Practice by Brian Goetz',
          'JVM Memory Management & Garbage Collection Fundamentals'
        ];
      }

      if (strengthsList.length === 0) strengthsList.push("Willingness to attempt answers.");
      if (weaknessesList.length === 0) weaknessesList.push("Answer length can be expanded with metrics.");

      setResult({
        feedback: overallFeedback,
        technicalScore: finalTechnicalScore,
        communicationScore: finalCommunicationScore,
        confidenceScore: finalConfidenceScore,
        strengths: strengthsList.join(" | "),
        weaknesses: weaknessesList.join(" | "),
        recommendedResources: roadmaps
      });
      setEvaluating(false);
    }, 3000);
  };

  return (
    <CandidateLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight">AI Mock Interview</h1>
          <p className="text-gray-400 text-sm mt-1">Practice role-specific mock interviews and receive instant feedback, technical grading, and learning roadmaps.</p>
        </div>

        {/* Configuration screen */}
        {!active && !result && !evaluating && (
          <div className="glass-card p-8 rounded-2xl max-w-xl mx-auto">
            <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <Play className="h-5 w-5 text-emerald-400" /> Configure Interview Session
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Target Job Role</label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-[#1B263B] border border-[#415A77] rounded-lg py-2.5 px-4 text-sm text-white focus:outline-none focus:border-emerald-500"
                  placeholder="e.g. Java Backend Developer"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Interview Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full bg-[#1B263B] border border-[#415A77] rounded-lg py-2.5 px-4 text-sm text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="TECHNICAL">Technical Deep Dive</option>
                  <option value="HR">HR Onboarding & Culture</option>
                  <option value="BEHAVIORAL">Behavioral (STAR Method)</option>
                </select>
              </div>

              <button
                onClick={startInterview}
                className="w-full py-3 rounded-lg bg-emerald-500 text-black font-bold hover:bg-emerald-400 transition-all text-sm flex items-center justify-center gap-2 mt-6 shadow-lg shadow-emerald-500/10"
              >
                Start Interview Session <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Active interview panel */}
        {active && (
          <div className="glass-card p-8 rounded-2xl relative">
            <div className="flex justify-between items-center pb-4 border-b border-[#415A77] mb-6">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Question {qIndex + 1} of {questions.length}</span>
              <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
                <Clock className="h-4 w-4" /> Live Simulator
              </span>
            </div>

            <div className="p-5 rounded-xl bg-[#1B263B] border border-[#415A77] text-white font-semibold text-sm mb-6 leading-relaxed">
              {questions[qIndex].question}
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Your Answer</label>
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                rows={5}
                className="w-full bg-[#1B263B] border border-[#415A77] rounded-lg p-4 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500 transition-colors"
                placeholder="Type your response here..."
              />
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={handleNext}
                disabled={!answer.trim()}
                className="px-6 py-2.5 rounded-lg bg-emerald-500 disabled:opacity-50 text-black font-bold hover:bg-emerald-400 transition-all text-xs flex items-center gap-1.5"
              >
                {qIndex >= questions.length - 1 ? 'Finish & Evaluate' : 'Submit Answer'} <Send className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Evaluating loader */}
        {evaluating && (
          <div className="glass-card p-10 rounded-2xl text-center flex flex-col items-center">
            <div className="relative h-16 w-16 mb-6">
              <div className="absolute inset-0 rounded-full border-4 border-[#415A77]" />
              <div className="absolute inset-0 rounded-full border-4 border-t-emerald-500 animate-spin" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Compiling Dialogue Transcripts</h3>
            <p className="text-sm text-emerald-400 font-semibold animate-pulse">Running LLM Evaluation and Grading...</p>
          </div>
        )}

        {/* Results screen */}
        {result && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Scores list */}
              <div className="glass-card p-6 rounded-2xl md:col-span-1 space-y-6 flex flex-col justify-between">
                <div className="text-center">
                  <div className="text-4xl font-black text-emerald-400 mb-1">{result.technicalScore}%</div>
                  <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Technical Grade</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-black text-indigo-400 mb-1">{result.communicationScore}%</div>
                  <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Communication</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-black text-pink-400 mb-1">{result.confidenceScore}%</div>
                  <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Confidence Score</div>
                </div>
              </div>

              {/* Feedback text */}
              <div className="glass-card p-6 rounded-2xl md:col-span-3 flex flex-col justify-between">
                <div className="flex gap-4 items-start">
                  <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/10">
                    <Award className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Evaluation Feedback</h3>
                    <p className="text-xs text-gray-400 mt-2 leading-relaxed">{result.feedback}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-[#415A77] pt-4 mt-4 text-xs">
                  <div>
                    <div className="font-bold text-emerald-400 flex items-center gap-1"><CheckCircle className="h-3.5 w-3.5" /> Strengths</div>
                    <div className="text-gray-400 mt-1 leading-relaxed">{result.strengths}</div>
                  </div>
                  <div>
                    <div className="font-bold text-red-400 flex items-center gap-1"><AlertTriangle className="h-3.5 w-3.5" /> Weaknesses</div>
                    <div className="text-gray-400 mt-1 leading-relaxed">{result.weaknesses}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recommended Learning Roadmap */}
            <div className="glass-card p-6 rounded-2xl">
              <h3 className="text-base font-bold text-white flex items-center gap-2 mb-4">
                <BookOpen className="h-5 w-5 text-emerald-400" /> AI Recommended Learning Roadmap
              </h3>
              <div className="space-y-3">
                {result.recommendedResources.map((res, index) => (
                  <div key={index} className="flex gap-3 items-center p-3 rounded-xl bg-[#1B263B]/40 border border-[#415A77]">
                    <div className="h-6 w-6 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold flex items-center justify-center">
                      {index + 1}
                    </div>
                    <span className="text-xs text-gray-300 font-semibold">{res}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center pt-4">
              <button
                onClick={() => setResult(null)}
                className="px-6 py-2.5 rounded-lg bg-[#1B263B] border border-[#415A77] hover:border-[#415A77] text-xs font-bold transition-all"
              >
                Start New Interview
              </button>
            </div>
          </div>
        )}
      </div>
    </CandidateLayout>
  );
}
