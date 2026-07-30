import React, { useState } from 'react';
import { useToast } from '../context/ToastContext';
import { Compass, CheckCircle2, Bookmark, ArrowRight, PlayCircle, FileText, Layers, Award } from 'lucide-react';

export const LearningHub = () => {
  const { addToast } = useToast();
  const [activeRoadmap, setActiveRoadmap] = useState('mvp');
  const [completedSteps, setCompletedSteps] = useState({
    'step-1': true,
    'step-2': true
  });

  const roadmaps = {
    mvp: {
      title: "0 to 1 Startup MVP Roadmap",
      desc: "Step-by-step guide for student founders building their initial validated product.",
      steps: [
        { id: 'step-1', title: 'Problem Validation & Customer Interviews', desc: 'Conduct 20 user interviews to validate core pain point before writing code.' },
        { id: 'step-2', title: 'Scope Wireframes & Core Features', desc: 'Map maximum 3 essential features that solve the core problem.' },
        { id: 'step-3', title: 'Build No-Code or Fast Code MVP', desc: 'Use React, Tailwind, and Node.js to launch within 14 days.' },
        { id: 'step-4', title: 'Initial Pilot Deployment', desc: 'Deploy to Vercel/Render and onboard 50 beta student testers.' }
      ]
    },
    pitch: {
      title: "Winning Incubator Pitch Deck Roadmap",
      desc: "Framework used by student founders to secure seed funding and accelerator spots.",
      steps: [
        { id: 'pitch-1', title: 'The Hook & Problem Slide', desc: 'State the urgent market gap with quantifiable data metrics.' },
        { id: 'pitch-2', title: 'Solution Demo & Traction Proof', desc: 'Show working product screenshots or early user growth charts.' },
        { id: 'pitch-3', title: 'Market Size (TAM/SAM/SOM)', desc: 'Demonstrate total addressable market potential.' },
        { id: 'pitch-4', title: 'Ask & Milestone Allocation', desc: 'Specify exact grant/capital needs for the next 12 months.' }
      ]
    }
  };

  const toggleStep = (stepId) => {
    setCompletedSteps(prev => {
      const nextState = { ...prev, [stepId]: !prev[stepId] };
      addToast(nextState[stepId] ? 'Step marked as completed!' : 'Step marked as pending', 'info');
      return nextState;
    });
  };

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#1D4ED8] border border-[#1E293B] rounded-2xl p-6 shadow-md">
        <div className="flex items-center gap-2 mb-1">
          <Compass className="w-5 h-5 text-blue-400" />
          <h2 className="text-xl font-bold text-white tracking-tight">Mentorship & Startup Roadmaps</h2>
        </div>
        <p className="text-slate-300 text-xs max-w-xl leading-relaxed">
          Access curated execution playbooks, legal cheat sheets, and incubator pitch guides created by experienced founders and mentors.
        </p>
      </div>

      {/* Roadmap Selector Tabs */}
      <div className="flex items-center gap-2 bg-[#0F172A] border border-[#1E293B] rounded-xl p-2">
        <button
          onClick={() => setActiveRoadmap('mvp')}
          className={`flex-1 py-2 px-4 rounded-lg text-xs font-semibold transition-all ${
            activeRoadmap === 'mvp' ? 'bg-brand text-white shadow-sm' : 'text-slate-400 hover:text-white'
          }`}
        >
          🚀 0 to 1 MVP Execution
        </button>
        <button
          onClick={() => setActiveRoadmap('pitch')}
          className={`flex-1 py-2 px-4 rounded-lg text-xs font-semibold transition-all ${
            activeRoadmap === 'pitch' ? 'bg-brand text-white shadow-sm' : 'text-slate-400 hover:text-white'
          }`}
        >
          📊 Pitch Deck & Incubator Track
        </button>
      </div>

      {/* Interactive Roadmap Stepper */}
      <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-6 shadow-sm space-y-6">
        <div>
          <h3 className="text-base font-bold text-white">{roadmaps[activeRoadmap].title}</h3>
          <p className="text-xs text-slate-400 mt-1">{roadmaps[activeRoadmap].desc}</p>
        </div>

        <div className="space-y-4">
          {roadmaps[activeRoadmap].steps.map((step, idx) => {
            const isDone = completedSteps[step.id];

            return (
              <div 
                key={step.id} 
                onClick={() => toggleStep(step.id)}
                className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-4 ${
                  isDone 
                    ? 'bg-blue-500/10 border-blue-500/30' 
                    : 'bg-[#1E293B]/40 border-[#1E293B] hover:border-slate-600'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                  isDone ? 'bg-brand text-white' : 'bg-[#1E293B] text-slate-400 border border-[#1E293B]'
                }`}>
                  {isDone ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                </div>

                <div className="flex-1">
                  <h4 className={`text-xs font-bold ${isDone ? 'text-blue-300 line-through' : 'text-white'}`}>
                    {step.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{step.desc}</p>
                </div>

                <span className="text-[10px] font-semibold px-2 py-1 rounded bg-[#1E293B] text-slate-300">
                  {isDone ? 'Completed' : 'Pending'}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
