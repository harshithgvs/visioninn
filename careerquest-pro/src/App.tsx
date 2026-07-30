import React, { useState } from 'react';
import { ActiveTab, ResumeData, QuizAttemptResult, UserProfile } from './types';
import { INITIAL_RESUMES, INITIAL_USER_PROFILE } from './data/mockData';
import { ResumeBuilder } from './components/ResumeBuilder';
import { RoadmapExplorer } from './components/RoadmapExplorer';
import { QuizEngine } from './components/QuizEngine';
import { Dashboard } from './components/Dashboard';
import { UserProfileModal } from './components/UserProfileModal';
import { Logo, logoImg } from './components/Logo';
import { Sparkles, FileText, Layers, Award, LayoutDashboard, Zap, ShieldCheck, User } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [resume, setResume] = useState<ResumeData>(INITIAL_RESUMES[0]);
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('autopath_user_profile');
    return saved ? JSON.parse(saved) : INITIAL_USER_PROFILE;
  });
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [quizHistory, setQuizHistory] = useState<QuizAttemptResult[]>([]);
  const [presetTopicToStart, setPresetTopicToStart] = useState<string | null>(null);

  // Save profile updates
  const handleSaveProfile = (updatedProfile: UserProfile) => {
    setProfile(updatedProfile);
    localStorage.setItem('autopath_user_profile', JSON.stringify(updatedProfile));
  };

  // Sync profile data to active resume
  const handleSyncToResume = (updatedProfile: UserProfile) => {
    setResume((prev) => ({
      ...prev,
      fullName: updatedProfile.fullName,
      email: updatedProfile.email || prev.email,
      phone: updatedProfile.phone || prev.phone,
      location: updatedProfile.location || prev.location,
      summary: updatedProfile.bio || prev.summary,
      education: prev.education.map((edu, idx) =>
        idx === 0
          ? {
              ...edu,
              institution: updatedProfile.college,
              degree: updatedProfile.degree,
              year: updatedProfile.year,
            }
          : edu
      ),
    }));
  };

  // Handle Quiz attempt recording
  const handleRecordQuizAttempt = (result: QuizAttemptResult) => {
    setQuizHistory((prev) => [result, ...prev]);
  };

  // Jump from Roadmap to Quiz Engine for a specific topic
  const handleStartQuizForTopic = (topicTitle: string) => {
    setPresetTopicToStart(topicTitle);
    setActiveTab('quizzes');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col selection:bg-indigo-500 selection:text-white print:bg-white relative overflow-x-hidden">
      {/* Ambient Background Watermark Logo */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden print:hidden">
        <div className="absolute -top-16 -right-16 w-96 h-96 opacity-[0.06] select-none transform rotate-12">
          <img
            src={logoImg}
            alt=""
            className="w-full h-full object-contain filter grayscale-0 mix-blend-multiply"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="absolute bottom-12 -left-20 w-[450px] h-[450px] opacity-[0.04] select-none transform -rotate-12">
          <img
            src={logoImg}
            alt=""
            className="w-full h-full object-contain filter mix-blend-multiply"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>

      {/* Top Professional Navbar */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40 print:hidden shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand Logo */}
          <div
            onClick={() => setActiveTab('dashboard')}
            className="cursor-pointer group"
          >
            <Logo size="md" />
          </div>

          {/* Nav Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700/60">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" /> Dashboard
            </button>
            <button
              onClick={() => setActiveTab('resume')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === 'resume'
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <FileText className="w-3.5 h-3.5" /> Resume Generator
            </button>
            <button
              onClick={() => setActiveTab('roadmaps')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === 'roadmaps'
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Layers className="w-3.5 h-3.5" /> Course Roadmaps
            </button>
            <button
              onClick={() => setActiveTab('quizzes')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === 'quizzes'
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Award className="w-3.5 h-3.5" /> Mock Tests
            </button>
          </nav>

          {/* User Profile Pill & Quick Info Badge */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700/90 px-3 py-1.5 rounded-xl border border-slate-700 transition-all text-xs text-white group shadow-2xs"
              title="Click to view & edit your student profile"
            >
              <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white font-bold flex items-center justify-center text-[10px] shadow-2xs">
                {profile.displayName ? profile.displayName.slice(0, 2).toUpperCase() : 'GH'}
              </div>
              <div className="text-left hidden sm:block">
                <span className="font-bold block leading-none text-slate-100">{profile.displayName || 'HARSHI'}</span>
                <span className="text-[9px] text-slate-400 block leading-tight truncate max-w-[120px]">
                  {profile.college ? 'Narayana Eng. College' : 'Student'}
                </span>
              </div>
              <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-500/30 hidden md:inline">
                4th Year
              </span>
            </button>

            <span className="hidden lg:inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-500/30">
              <ShieldCheck className="w-3.5 h-3.5" /> Gemini AI
            </span>
          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="md:hidden flex border-t border-slate-800 bg-slate-900 px-2 py-1.5 justify-around items-center">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-2.5 py-1 rounded text-[11px] font-semibold flex items-center gap-1 ${
              activeTab === 'dashboard' ? 'bg-indigo-600 text-white' : 'text-slate-400'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('resume')}
            className={`px-2.5 py-1 rounded text-[11px] font-semibold flex items-center gap-1 ${
              activeTab === 'resume' ? 'bg-indigo-600 text-white' : 'text-slate-400'
            }`}
          >
            Resume
          </button>
          <button
            onClick={() => setActiveTab('roadmaps')}
            className={`px-2.5 py-1 rounded text-[11px] font-semibold flex items-center gap-1 ${
              activeTab === 'roadmaps' ? 'bg-indigo-600 text-white' : 'text-slate-400'
            }`}
          >
            Roadmaps
          </button>
          <button
            onClick={() => setActiveTab('quizzes')}
            className={`px-2.5 py-1 rounded text-[11px] font-semibold flex items-center gap-1 ${
              activeTab === 'quizzes' ? 'bg-indigo-600 text-white' : 'text-slate-400'
            }`}
          >
            Quizzes
          </button>
          <button
            onClick={() => setIsProfileModalOpen(true)}
            className="px-2 py-1 rounded text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1"
          >
            <User className="w-3 h-3" /> Profile
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {activeTab === 'dashboard' && (
          <Dashboard
            resume={resume}
            profile={profile}
            quizHistory={quizHistory}
            onNavigateTab={setActiveTab}
            onStartQuizForTopic={handleStartQuizForTopic}
            onOpenProfile={() => setIsProfileModalOpen(true)}
          />
        )}

        {activeTab === 'resume' && (
          <ResumeBuilder currentResume={resume} onUpdateResume={setResume} />
        )}

        {activeTab === 'roadmaps' && (
          <RoadmapExplorer onStartQuizForTopic={handleStartQuizForTopic} />
        )}

        {activeTab === 'quizzes' && (
          <QuizEngine
            onRecordQuizAttempt={handleRecordQuizAttempt}
            presetTopicToStart={presetTopicToStart}
            onClearPresetTopic={() => setPresetTopicToStart(null)}
          />
        )}
      </main>

      {/* Profile Modal */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        profile={profile}
        onSaveProfile={handleSaveProfile}
        onSyncToResume={handleSyncToResume}
      />

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500 print:hidden mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>AutoPath AI © 2026 — Auto Resume Builder, Course Roadmaps & Mock Tests</span>
          <span className="text-slate-400">Powered by Gemini 3.6 Flash</span>
        </div>
      </footer>
    </div>
  );
}

