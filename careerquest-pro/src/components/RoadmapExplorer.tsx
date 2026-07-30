import React, { useState } from 'react';
import { CourseRoadmap, RoadmapPhase, TopicItem } from '../types';
import { INITIAL_ROADMAPS } from '../data/mockData';
import { Sparkles, Code, Server, Shield, Palette, Wand2, CheckCircle2, Clock, BookOpen, ChevronDown, ChevronUp, PlayCircle, Plus, Layers, ArrowRight } from 'lucide-react';

interface RoadmapExplorerProps {
  onStartQuizForTopic: (topicTitle: string) => void;
}

export const RoadmapExplorer: React.FC<RoadmapExplorerProps> = ({ onStartQuizForTopic }) => {
  const [roadmaps, setRoadmaps] = useState<CourseRoadmap[]>(INITIAL_ROADMAPS);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeRoadmapId, setActiveRoadmapId] = useState<string>(INITIAL_ROADMAPS[0].id);

  // Completion state map: roadmapId -> phaseIndex -> topicIndex -> boolean
  const [completedTopicsMap, setCompletedTopicsMap] = useState<Record<string, boolean>>({});

  // Custom AI Generator state
  const [showAiModal, setShowAiModal] = useState(false);
  const [customCourse, setCustomCourse] = useState('');
  const [customGoal, setCustomGoal] = useState('Job Ready / Professional Level');
  const [customWeeks, setCustomWeeks] = useState(8);
  const [isGenerating, setIsGenerating] = useState(false);

  const activeRoadmap = roadmaps.find((r) => r.id === activeRoadmapId) || roadmaps[0];

  // Toggle topic completion
  const toggleTopicCompletion = (roadmapId: string, phaseIdx: number, topicIdx: number) => {
    const key = `${roadmapId}-${phaseIdx}-${topicIdx}`;
    setCompletedTopicsMap((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Calculate Roadmap completion %
  const calculateProgress = (roadmap: CourseRoadmap) => {
    let total = 0;
    let completed = 0;
    roadmap.phases.forEach((phase, pIdx) => {
      phase.topics.forEach((_, tIdx) => {
        total += 1;
        if (completedTopicsMap[`${roadmap.id}-${pIdx}-${tIdx}`]) {
          completed += 1;
        }
      });
    });
    if (total === 0) return 0;
    return Math.round((completed / total) * 100);
  };

  // Generate AI Roadmap via server
  const handleGenerateAiRoadmap = async () => {
    if (!customCourse.trim()) return;
    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate-roadmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseTitle: customCourse,
          targetGoal: customGoal,
          durationWeeks: customWeeks,
        }),
      });

      const data = await response.json();
      if (data.success && data.roadmap) {
        const newRoadmap: CourseRoadmap = {
          id: `road-custom-${Date.now()}`,
          title: data.roadmap.title || customCourse,
          category: 'custom',
          description: data.roadmap.description || 'AI-generated personalized learning path',
          estimatedWeeks: data.roadmap.estimatedWeeks || customWeeks,
          iconName: 'Sparkles',
          colorTheme: 'violet',
          prerequisites: data.roadmap.prerequisites || ['Basic Knowledge'],
          phases: data.roadmap.phases || [],
          isCustom: true,
        };

        setRoadmaps((prev) => [newRoadmap, ...prev]);
        setActiveRoadmapId(newRoadmap.id);
        setShowAiModal(false);
        setCustomCourse('');
      }
    } catch (err) {
      console.error('Error generating custom roadmap:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const filteredRoadmaps = selectedCategory === 'all'
    ? roadmaps
    : roadmaps.filter((r) => r.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Header Banner & Filter bar */}
      <div className="bg-gradient-to-r from-indigo-700 via-violet-700 to-emerald-600 text-white p-6 rounded-2xl shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-emerald-300 text-xs font-semibold backdrop-blur-sm mb-2">
            <Layers className="w-3.5 h-3.5" /> Structured Career Paths
          </span>
          <h1 className="text-2xl font-bold tracking-tight">Interactive Course Roadmaps</h1>
          <p className="text-indigo-100 text-xs mt-1 max-w-xl">
            Step-by-step career pathways with topic breakdowns, practical projects, and instant skill mock tests.
          </p>
        </div>

        <button
          onClick={() => setShowAiModal(true)}
          className="px-4 py-2.5 rounded-xl bg-white text-indigo-700 hover:bg-indigo-50 font-bold text-xs flex items-center gap-2 shadow-md transition-all shrink-0"
        >
          <Wand2 className="w-4 h-4 text-violet-600" /> ✨ AI Custom Roadmap Generator
        </button>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            selectedCategory === 'all'
              ? 'bg-indigo-600 text-white shadow-2xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          All Pathways ({roadmaps.length})
        </button>
        <button
          onClick={() => setSelectedCategory('web-dev')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            selectedCategory === 'web-dev'
              ? 'bg-indigo-600 text-white shadow-2xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          💻 Full-Stack Web
        </button>
        <button
          onClick={() => setSelectedCategory('ai-ml')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            selectedCategory === 'ai-ml'
              ? 'bg-emerald-600 text-white shadow-2xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          🤖 AI & Data Science
        </button>
        <button
          onClick={() => setSelectedCategory('cloud-devops')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            selectedCategory === 'cloud-devops'
              ? 'bg-cyan-600 text-white shadow-2xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          ☁️ Cloud & DevOps
        </button>
        {roadmaps.some((r) => r.isCustom) && (
          <button
            onClick={() => setSelectedCategory('custom')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              selectedCategory === 'custom'
                ? 'bg-violet-600 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            ✨ Custom AI Paths
          </button>
        )}
      </div>

      {/* Main Grid: Sidebar Course List & Detail View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Roadmaps Selection Cards */}
        <div className="lg:col-span-4 space-y-3">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Select Roadmap</h2>
          {filteredRoadmaps.map((r) => {
            const progress = calculateProgress(r);
            const isSelected = r.id === activeRoadmapId;

            return (
              <div
                key={r.id}
                onClick={() => setActiveRoadmapId(r.id)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-500 shadow-2xs'
                    : 'border-slate-200 bg-white hover:border-indigo-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-indigo-100 text-indigo-700">
                      {r.category === 'ai-ml' ? (
                        <Sparkles className="w-4 h-4" />
                      ) : r.category === 'cloud-devops' ? (
                        <Server className="w-4 h-4" />
                      ) : (
                        <Code className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-xs text-slate-900">{r.title}</h3>
                      <span className="text-[10px] text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" /> {r.estimatedWeeks} Weeks Pathway
                      </span>
                    </div>
                  </div>
                  {r.isCustom && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-violet-100 text-violet-700">
                      AI Generated
                    </span>
                  )}
                </div>

                <p className="text-slate-600 text-[11px] line-clamp-2 mb-3">{r.description}</p>

                {/* Progress Bar */}
                <div>
                  <div className="flex justify-between text-[10px] font-semibold text-slate-600 mb-1">
                    <span>Progress</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Active Roadmap Full Interactive Steps */}
        <div className="lg:col-span-8 space-y-6">
          {activeRoadmap && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-6">
              {/* Active Roadmap Title & Meta */}
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-xl font-bold text-slate-900">{activeRoadmap.title}</h2>
                    {activeRoadmap.isCustom && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-violet-100 text-violet-700">
                        Custom AI Roadmap
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600">{activeRoadmap.description}</p>

                  <div className="flex flex-wrap gap-2 mt-3 text-xs text-slate-500">
                    <span className="bg-slate-100 px-2.5 py-1 rounded-md font-medium text-slate-700 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-indigo-500" /> Duration: {activeRoadmap.estimatedWeeks} Weeks
                    </span>
                    <span className="bg-slate-100 px-2.5 py-1 rounded-md font-medium text-slate-700">
                      Phases: {activeRoadmap.phases.length}
                    </span>
                  </div>
                </div>

                {/* Quick Action: Take Test on this course */}
                <button
                  onClick={() => onStartQuizForTopic(activeRoadmap.title)}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-2xs transition-colors shrink-0"
                >
                  <PlayCircle className="w-4 h-4" /> Practice Mock Test
                </button>
              </div>

              {/* Prerequisites if any */}
              {activeRoadmap.prerequisites && activeRoadmap.prerequisites.length > 0 && (
                <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100 text-xs">
                  <span className="font-bold text-indigo-800">Prerequisites: </span>
                  <span className="text-indigo-900">{activeRoadmap.prerequisites.join(' • ')}</span>
                </div>
              )}

              {/* Phase Nodes Timeline */}
              <div className="space-y-6">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Learning Phases</h3>

                {activeRoadmap.phases.map((phase, pIdx) => (
                  <div key={pIdx} className="relative pl-6 border-l-2 border-indigo-200 space-y-3">
                    {/* Phase Node Marker */}
                    <div className="absolute -left-[11px] top-0 w-5 h-5 rounded-full bg-indigo-600 text-white font-bold text-[10px] flex items-center justify-center ring-4 ring-white">
                      {phase.phaseNumber}
                    </div>

                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                      <div className="flex justify-between items-baseline">
                        <h4 className="font-bold text-slate-900 text-sm">{phase.phaseTitle}</h4>
                        <span className="text-[11px] font-semibold text-indigo-600 bg-indigo-100 px-2 py-0.5 rounded">
                          ~{phase.estimatedHours} Hours
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed">{phase.description}</p>

                      {/* Topic Checklists */}
                      <div className="space-y-2 pt-1">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                          Key Milestone Topics
                        </span>

                        {phase.topics.map((topic, tIdx) => {
                          const isDone = Boolean(completedTopicsMap[`${activeRoadmap.id}-${pIdx}-${tIdx}`]);

                          return (
                            <div
                              key={tIdx}
                              onClick={() => toggleTopicCompletion(activeRoadmap.id, pIdx, tIdx)}
                              className={`p-3 rounded-lg border cursor-pointer transition-all flex items-start gap-3 ${
                                isDone
                                  ? 'bg-emerald-50/80 border-emerald-200 text-slate-800'
                                  : 'bg-white border-slate-200 hover:border-slate-300'
                              }`}
                            >
                              <div className="mt-0.5 shrink-0">
                                <CheckCircle2
                                  className={`w-4 h-4 ${isDone ? 'text-emerald-600 fill-emerald-100' : 'text-slate-300'}`}
                                />
                              </div>
                              <div className="space-y-1 flex-1">
                                <div className="flex justify-between items-baseline">
                                  <span className={`font-semibold text-xs ${isDone ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                                    {topic.topicTitle}
                                  </span>
                                  {topic.resourceType && (
                                    <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                                      {topic.resourceType}
                                    </span>
                                  )}
                                </div>
                                <p className="text-[11px] text-slate-600">{topic.summary}</p>

                                {topic.keyTakeaways && topic.keyTakeaways.length > 0 && (
                                  <div className="flex flex-wrap gap-1 pt-1">
                                    {topic.keyTakeaways.map((k, kIdx) => (
                                      <span key={kIdx} className="text-[10px] bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded">
                                        • {k}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Practical Project Idea */}
                      {phase.projectIdea && (
                        <div className="p-3 bg-amber-50/80 rounded-lg border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                          <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold text-amber-800">Practical Project Build: </span>
                            {phase.projectIdea}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Custom AI Roadmap Modal */}
      {showAiModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full border border-slate-200 shadow-xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-violet-100 text-violet-700">
                  <Wand2 className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">Generate AI Learning Roadmap</h3>
              </div>
              <button onClick={() => setShowAiModal(false)} className="text-slate-400 hover:text-slate-600 text-lg">
                ×
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Course Title or Topic</label>
              <input
                type="text"
                value={customCourse}
                onChange={(e) => setCustomCourse(e.target.value)}
                placeholder="e.g. Cyber Security Ethical Hacking, iOS App Dev with Swift"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Target Skill Goal</label>
              <input
                type="text"
                value={customGoal}
                onChange={(e) => setCustomGoal(e.target.value)}
                placeholder="e.g. Land entry level role, Build portfolio app"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Duration (Weeks)</label>
              <input
                type="number"
                min={2}
                max={24}
                value={customWeeks}
                onChange={(e) => setCustomWeeks(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowAiModal(false)}
                className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleGenerateAiRoadmap}
                disabled={isGenerating || !customCourse.trim()}
                className="px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-2xs disabled:opacity-50"
              >
                {isGenerating ? 'Building AI Path...' : 'Generate Roadmap'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
