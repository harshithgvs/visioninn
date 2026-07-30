import React from 'react';
import { ResumeData, QuizAttemptResult, ActiveTab, UserProfile } from '../types';
import { logoImg } from './Logo';
import { FileText, Layers, Award, Sparkles, TrendingUp, ArrowUpRight, CheckCircle2, Clock, Zap, Target, User, GraduationCap, Building2 } from 'lucide-react';

interface DashboardProps {
  resume: ResumeData;
  profile?: UserProfile;
  quizHistory: QuizAttemptResult[];
  onNavigateTab: (tab: ActiveTab) => void;
  onStartQuizForTopic: (topicTitle: string) => void;
  onOpenProfile?: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  resume,
  profile,
  quizHistory,
  onNavigateTab,
  onStartQuizForTopic,
  onOpenProfile,
}) => {
  const totalQuizzes = quizHistory.length;
  const avgScore =
    totalQuizzes > 0
      ? Math.round(quizHistory.reduce((acc, curr) => acc + curr.scorePercentage, 0) / totalQuizzes)
      : 0;

  const displayName = profile?.displayName || 'HARSHI';
  const fullName = profile?.fullName || resume.fullName || 'G.V.S. Harshith';
  const college = profile?.college || 'Narayana Engineering College Nellore';
  const degree = profile?.degree || 'B.Tech in Computer Science & Engineering';
  const year = profile?.year || '4th Year (2022 - 2026)';

  return (
    <div className="space-y-6">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-700 via-violet-700 to-emerald-600 text-white p-6 md:p-8 rounded-3xl shadow-md">
        {/* Background ambient logo watermark */}
        <div className="absolute right-4 -bottom-10 w-72 h-72 opacity-15 pointer-events-none select-none transform rotate-12">
          <img
            src={logoImg}
            alt=""
            className="w-full h-full object-contain mix-blend-screen"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-indigo-400/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-wrap items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-300 text-xs font-semibold backdrop-blur-md">
                <img src={logoImg} alt="" className="w-4 h-4 rounded-full mix-blend-multiply" referrerPolicy="no-referrer" />
                AI Career Acceleration Command Center
              </span>
              {onOpenProfile && (
                <button
                  onClick={onOpenProfile}
                  className="px-2.5 py-1 rounded-full bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 text-xs font-bold border border-amber-400/30 flex items-center gap-1 transition-colors"
                >
                  <User className="w-3 h-3" /> Profile: {displayName}
                </button>
              )}
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Welcome back, {displayName}!
            </h1>
            <p className="text-indigo-100 text-xs md:text-sm leading-relaxed">
              <span className="font-semibold text-white">{degree}</span> student ({year}) at{' '}
              <span className="font-semibold text-white">{college}</span>. Optimized for{' '}
              <span className="font-semibold text-white">{resume.targetRole}</span>.
            </p>

            {profile?.bio && (
              <p className="text-[11px] text-emerald-100 bg-white/10 p-2.5 rounded-xl border border-white/15 line-clamp-2">
                "{profile.bio}"
              </p>
            )}
          </div>

          {/* Student Profile & Career Readiness Badge */}
          <div className="flex flex-col items-center gap-2">
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-center shrink-0 min-w-[160px]">
              <span className="block text-3xl font-black text-amber-300">
                {totalQuizzes > 0 ? `${Math.min(avgScore + 10, 98)}%` : '85%'}
              </span>
              <span className="text-[11px] font-semibold text-indigo-100 uppercase tracking-wider block mt-0.5">
                Career Readiness Score
              </span>
            </div>

            {onOpenProfile && (
              <button
                onClick={onOpenProfile}
                className="w-full text-center px-3 py-1.5 rounded-xl bg-white text-indigo-900 hover:bg-indigo-50 font-bold text-xs shadow-sm transition-colors flex items-center justify-center gap-1.5"
              >
                <User className="w-3.5 h-3.5" /> Edit Student Profile
              </button>
            )}
          </div>
        </div>
      </div>


      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex justify-between items-center text-indigo-600">
            <div className="p-2.5 rounded-xl bg-indigo-50">
              <FileText className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-800">Ready</span>
          </div>
          <div>
            <span className="block text-2xl font-bold text-slate-900">{resume.title ? 1 : 0}</span>
            <span className="text-xs font-semibold text-slate-500">Active Resume Draft</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex justify-between items-center text-emerald-600">
            <div className="p-2.5 rounded-xl bg-emerald-50">
              <Layers className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">3 Paths</span>
          </div>
          <div>
            <span className="block text-2xl font-bold text-slate-900">3 Courses</span>
            <span className="text-xs font-semibold text-slate-500">Roadmaps In-Progress</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex justify-between items-center text-amber-600">
            <div className="p-2.5 rounded-xl bg-amber-50">
              <Award className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">Quizzes</span>
          </div>
          <div>
            <span className="block text-2xl font-bold text-slate-900">{totalQuizzes}</span>
            <span className="text-xs font-semibold text-slate-500">Mock Tests Taken</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex justify-between items-center text-violet-600">
            <div className="p-2.5 rounded-xl bg-violet-50">
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-violet-100 text-violet-800">Avg Score</span>
          </div>
          <div>
            <span className="block text-2xl font-bold text-slate-900">{avgScore}%</span>
            <span className="text-xs font-semibold text-slate-500">Quiz Accuracy Score</span>
          </div>
        </div>
      </div>

      {/* Quick Action Shortcuts */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => onNavigateTab('resume')}
            className="p-4 rounded-xl border border-indigo-100 bg-indigo-50/50 hover:bg-indigo-100/70 text-left transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-600 text-white shadow-2xs">
                <Sparkles className="w-4 h-4 text-amber-300" />
              </div>
              <div>
                <h3 className="font-bold text-xs text-slate-900">Auto-Generate ATS Resume</h3>
                <p className="text-[11px] text-slate-500">AI build or edit resume</p>
              </div>
            </div>
            <ArrowUpRight className="w-4 h-4 text-indigo-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>

          <button
            onClick={() => onNavigateTab('roadmaps')}
            className="p-4 rounded-xl border border-emerald-100 bg-emerald-50/50 hover:bg-emerald-100/70 text-left transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-600 text-white shadow-2xs">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-xs text-slate-900">Explore Course Roadmaps</h3>
                <p className="text-[11px] text-slate-500">Interactive learning paths</p>
              </div>
            </div>
            <ArrowUpRight className="w-4 h-4 text-emerald-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>

          <button
            onClick={() => onNavigateTab('quizzes')}
            className="p-4 rounded-xl border border-amber-100 bg-amber-50/50 hover:bg-amber-100/70 text-left transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500 text-white shadow-2xs">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-xs text-slate-900">Take Skill Mock Test</h3>
                <p className="text-[11px] text-slate-500">Practice questions with AI</p>
              </div>
            </div>
            <ArrowUpRight className="w-4 h-4 text-amber-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>
      </div>

      {/* Main Grid: Resume Overview & Recent Test Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Active Resume Card */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h2 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-600" /> Current Resume Profile
            </h2>
            <button
              onClick={() => onNavigateTab('resume')}
              className="text-xs font-semibold text-indigo-600 hover:underline"
            >
              Open Builder →
            </button>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            <div>
              <span className="text-[10px] font-bold text-indigo-600 uppercase">Target Position</span>
              <h3 className="font-bold text-slate-900 text-sm">{resume.targetRole}</h3>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase">Candidate Name</span>
              <p className="text-xs text-slate-800 font-medium">{resume.fullName}</p>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase">Skills Count</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {resume.skills.flatMap((s) => s.items).slice(0, 6).map((item, i) => (
                  <span key={i} className="text-[10px] bg-white text-indigo-700 px-2 py-0.5 rounded border border-slate-200">
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <button
              onClick={() => onNavigateTab('resume')}
              className="w-full py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors"
            >
              Edit & Download PDF
            </button>
          </div>
        </div>

        {/* Recent Quiz Attempts */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h2 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-600" /> Recent Mock Test Activity
            </h2>
            <button
              onClick={() => onNavigateTab('quizzes')}
              className="text-xs font-semibold text-emerald-600 hover:underline"
            >
              View All Quizzes →
            </button>
          </div>

          {quizHistory.length === 0 ? (
            <div className="text-center py-8 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <Award className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-xs text-slate-500">No mock test completed yet.</p>
              <button
                onClick={() => onNavigateTab('quizzes')}
                className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-xs font-bold"
              >
                Start First Mock Test
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {quizHistory.slice(0, 4).map((hist) => (
                <div key={hist.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-3 text-xs">
                  <div>
                    <h3 className="font-bold text-slate-900">{hist.quizTitle}</h3>
                    <span className="text-[11px] text-slate-500">{hist.topic}</span>
                  </div>

                  <div className="flex items-center gap-4 text-right">
                    <div>
                      <span className="block font-bold text-emerald-600 text-sm">{hist.scorePercentage}%</span>
                      <span className="text-[10px] text-slate-400">
                        {hist.correctCount}/{hist.totalQuestions} Correct
                      </span>
                    </div>

                    <button
                      onClick={() => onStartQuizForTopic(hist.topic)}
                      className="p-1.5 rounded bg-white hover:bg-slate-100 text-slate-600 border border-slate-200"
                    >
                      Retry
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
