import React, { useState, useEffect } from 'react';
import { QuizData, QuizAttemptResult, QuizQuestion } from '../types';
import { INITIAL_QUIZZES } from '../data/mockData';
import { Award, Clock, CheckCircle2, XCircle, HelpCircle, Play, RotateCcw, Wand2, Shield, Sparkles, Check, ChevronRight, AlertCircle, FileCheck } from 'lucide-react';

interface QuizEngineProps {
  onRecordQuizAttempt: (result: QuizAttemptResult) => void;
  presetTopicToStart?: string | null;
  onClearPresetTopic?: () => void;
}

export const QuizEngine: React.FC<QuizEngineProps> = ({
  onRecordQuizAttempt,
  presetTopicToStart,
  onClearPresetTopic,
}) => {
  const [quizzes, setQuizzes] = useState<QuizData[]>(INITIAL_QUIZZES);
  const [selectedQuizId, setSelectedQuizId] = useState<string>(INITIAL_QUIZZES[0].id);

  // Active Test State
  const [isTestActive, setIsTestActive] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<number, boolean>>({});
  const [secondsRemaining, setSecondsRemaining] = useState(600); // 10 minutes default
  const [isCompleted, setIsCompleted] = useState(false);
  const [latestResult, setLatestResult] = useState<QuizAttemptResult | null>(null);

  // AI Quiz Generator modal state
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiTopic, setAiTopic] = useState('');
  const [aiDifficulty, setAiDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [aiQuestionCount, setAiQuestionCount] = useState(5);
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);

  const activeQuiz = quizzes.find((q) => q.id === selectedQuizId) || quizzes[0];

  // Auto start preset topic if navigated from Roadmap
  useEffect(() => {
    if (presetTopicToStart) {
      setAiTopic(presetTopicToStart);
      handleGenerateAiQuiz(presetTopicToStart);
      if (onClearPresetTopic) onClearPresetTopic();
    }
  }, [presetTopicToStart]);

  // Countdown timer effect
  useEffect(() => {
    let timer: any;
    if (isTestActive && !isCompleted && secondsRemaining > 0) {
      timer = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            handleCompleteTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isTestActive, isCompleted, secondsRemaining]);

  // Start Test
  const handleStartTest = (quiz: QuizData) => {
    setSelectedQuizId(quiz.id);
    setIsTestActive(true);
    setIsCompleted(false);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setFlaggedQuestions({});
    setSecondsRemaining((quiz.timeLimitMinutes || 10) * 60);
    setLatestResult(null);
  };

  // Submit Test and Calculate Score
  const handleCompleteTest = () => {
    setIsTestActive(false);
    setIsCompleted(true);

    let correctCount = 0;
    activeQuiz.questions.forEach((q) => {
      const selected = userAnswers[q.id];
      if (selected === q.correctOptionIndex) {
        correctCount += 1;
      }
    });

    const total = activeQuiz.questions.length;
    const scorePct = Math.round((correctCount / (total || 1)) * 100);
    const timeSpent = (activeQuiz.timeLimitMinutes || 10) * 60 - secondsRemaining;

    const result: QuizAttemptResult = {
      id: `attempt-${Date.now()}`,
      quizId: activeQuiz.id,
      quizTitle: activeQuiz.quizTitle,
      topic: activeQuiz.topic,
      scorePercentage: scorePct,
      correctCount,
      totalQuestions: total,
      completedAt: new Date().toISOString(),
      timeSpentSeconds: timeSpent,
      userAnswers,
    };

    setLatestResult(result);
    onRecordQuizAttempt(result);
  };

  // Generate AI Quiz via Gemini
  const handleGenerateAiQuiz = async (topicOverride?: string) => {
    const topicToUse = topicOverride || aiTopic;
    if (!topicToUse.trim()) return;

    setIsGeneratingQuiz(true);
    try {
      const response = await fetch('/api/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseTopic: topicToUse,
          difficulty: aiDifficulty,
          questionCount: aiQuestionCount,
        }),
      });

      const data = await response.json();
      if (data.success && data.quiz) {
        const generated: QuizData = {
          id: `quiz-ai-${Date.now()}`,
          quizTitle: data.quiz.quizTitle || `${topicToUse} Skills Assessment`,
          topic: topicToUse,
          difficulty: aiDifficulty,
          timeLimitMinutes: 10,
          questions: data.quiz.questions || [],
        };

        setQuizzes((prev) => [generated, ...prev]);
        setShowAiModal(false);
        handleStartTest(generated);
      }
    } catch (err) {
      console.error('Failed to generate AI quiz:', err);
    } finally {
      setIsGeneratingQuiz(false);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 text-white p-6 rounded-2xl shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-semibold backdrop-blur-sm mb-2">
            <Award className="w-3.5 h-3.5" /> Skills Verification & Mock Tests
          </span>
          <h1 className="text-2xl font-bold tracking-tight">Course Knowledge Quizzes</h1>
          <p className="text-emerald-100 text-xs mt-1 max-w-xl">
            Test your proficiency across course paths or generate dynamic AI mock exams with detailed explanations.
          </p>
        </div>

        <button
          onClick={() => setShowAiModal(true)}
          className="px-4 py-2.5 rounded-xl bg-white text-emerald-800 hover:bg-emerald-50 font-bold text-xs flex items-center gap-2 shadow-md transition-all shrink-0"
        >
          <Wand2 className="w-4 h-4 text-emerald-600" /> 🤖 Generate AI Custom Test
        </button>
      </div>

      {/* MODE 1: Quiz Selection Dashboard (When no test is actively running) */}
      {!isTestActive && !isCompleted && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quizzes.map((q) => (
            <div
              key={q.id}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:border-emerald-400 hover:shadow-sm transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    {q.difficulty}
                  </span>
                  <span className="text-[11px] text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" /> {q.timeLimitMinutes || 10} mins
                  </span>
                </div>
                <h3 className="font-bold text-sm text-slate-900 mb-1">{q.quizTitle}</h3>
                <p className="text-xs text-slate-500">{q.questions.length} Multiple Choice Questions</p>
              </div>

              <button
                onClick={() => handleStartTest(q)}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-2xs transition-colors"
              >
                <Play className="w-3.5 h-3.5 fill-current" /> Start Mock Test
              </button>
            </div>
          ))}
        </div>
      )}

      {/* MODE 2: Active Test Taking Screen */}
      {isTestActive && activeQuiz && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6 max-w-3xl mx-auto">
          {/* Header Bar */}
          <div className="flex justify-between items-center border-b border-slate-100 pb-4">
            <div>
              <h2 className="font-bold text-base text-slate-900">{activeQuiz.quizTitle}</h2>
              <span className="text-xs text-slate-500">
                Question {currentQuestionIndex + 1} of {activeQuiz.questions.length}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold ${
                  secondsRemaining < 120 ? 'bg-rose-100 text-rose-700 animate-pulse' : 'bg-slate-100 text-slate-800'
                }`}
              >
                <Clock className="w-4 h-4" /> {formatTime(secondsRemaining)}
              </div>

              <button
                onClick={handleCompleteTest}
                className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold"
              >
                Submit Test
              </button>
            </div>
          </div>

          {/* Question Stepper Progress */}
          <div className="flex gap-1.5">
            {activeQuiz.questions.map((q, idx) => {
              const isAns = userAnswers[q.id] !== undefined;
              const isCurrent = idx === currentQuestionIndex;
              const isFlag = flaggedQuestions[q.id];

              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentQuestionIndex(idx)}
                  className={`h-2 flex-1 rounded-full transition-all ${
                    isCurrent
                      ? 'bg-indigo-600 ring-2 ring-indigo-300'
                      : isAns
                      ? 'bg-emerald-500'
                      : isFlag
                      ? 'bg-amber-400'
                      : 'bg-slate-200'
                  }`}
                />
              );
            })}
          </div>

          {/* Current Question */}
          {activeQuiz.questions[currentQuestionIndex] && (
            <div className="space-y-5">
              <div className="flex justify-between items-start gap-4">
                <h3 className="font-bold text-slate-900 text-base leading-snug">
                  {currentQuestionIndex + 1}. {activeQuiz.questions[currentQuestionIndex].questionText}
                </h3>
                <button
                  onClick={() =>
                    setFlaggedQuestions((prev) => ({
                      ...prev,
                      [activeQuiz.questions[currentQuestionIndex].id]: !prev[activeQuiz.questions[currentQuestionIndex].id],
                    }))
                  }
                  className={`text-xs px-2.5 py-1 rounded border font-medium shrink-0 ${
                    flaggedQuestions[activeQuiz.questions[currentQuestionIndex].id]
                      ? 'bg-amber-50 text-amber-700 border-amber-300'
                      : 'text-slate-500 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {flaggedQuestions[activeQuiz.questions[currentQuestionIndex].id] ? '🚩 Flagged' : 'Flag Question'}
                </button>
              </div>

              {/* Options List */}
              <div className="space-y-2.5">
                {activeQuiz.questions[currentQuestionIndex].options.map((opt, optIdx) => {
                  const qId = activeQuiz.questions[currentQuestionIndex].id;
                  const isSelected = userAnswers[qId] === optIdx;

                  return (
                    <button
                      key={optIdx}
                      onClick={() => setUserAnswers((prev) => ({ ...prev, [qId]: optIdx }))}
                      className={`w-full text-left p-3.5 rounded-xl border font-medium text-xs flex items-center gap-3 transition-all ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50/80 ring-2 ring-emerald-500 text-emerald-950 font-bold'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800'
                      }`}
                    >
                      <span
                        className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center shrink-0 ${
                          isSelected ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>

              {/* Next / Previous Controls */}
              <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                <button
                  disabled={currentQuestionIndex === 0}
                  onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold disabled:opacity-40"
                >
                  Previous
                </button>

                {currentQuestionIndex < activeQuiz.questions.length - 1 ? (
                  <button
                    onClick={() => setCurrentQuestionIndex((prev) => Math.min(activeQuiz.questions.length - 1, prev + 1))}
                    className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1"
                  >
                    Next Question <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleCompleteTest}
                    className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-2xs"
                  >
                    Submit Test
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* MODE 3: Completed Results & Explanations Review */}
      {isCompleted && latestResult && activeQuiz && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6 max-w-3xl mx-auto">
          {/* Result Header */}
          <div className="text-center p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <div className="inline-flex p-3 rounded-full bg-emerald-100 text-emerald-700 mb-1">
              <Award className="w-8 h-8" />
            </div>

            <h2 className="text-xl font-bold text-slate-900">Quiz Completed!</h2>
            <p className="text-xs text-slate-600">{latestResult.quizTitle}</p>

            <div className="flex justify-center items-center gap-6 py-3">
              <div>
                <span className="block text-2xl font-black text-slate-900">{latestResult.scorePercentage}%</span>
                <span className="text-[11px] font-semibold text-slate-500">Score</span>
              </div>
              <div className="h-8 w-px bg-slate-200" />
              <div>
                <span className="block text-2xl font-black text-emerald-600">
                  {latestResult.correctCount} / {latestResult.totalQuestions}
                </span>
                <span className="text-[11px] font-semibold text-slate-500">Correct Answers</span>
              </div>
              <div className="h-8 w-px bg-slate-200" />
              <div>
                <span className="block text-2xl font-black text-slate-900">
                  {formatTime(latestResult.timeSpentSeconds)}
                </span>
                <span className="text-[11px] font-semibold text-slate-500">Time Taken</span>
              </div>
            </div>

            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => {
                  setIsCompleted(false);
                  setIsTestActive(false);
                }}
                className="px-4 py-2 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold"
              >
                Back to All Quizzes
              </button>
              <button
                onClick={() => handleStartTest(activeQuiz)}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5"
              >
                <RotateCcw className="w-4 h-4" /> Retake Test
              </button>
            </div>
          </div>

          {/* Detailed Question Review */}
          <div className="space-y-4">
            <h3 className="font-bold text-slate-900 text-sm border-b pb-2">Detailed Answer Review</h3>

            {activeQuiz.questions.map((q, qIdx) => {
              const userSel = latestResult.userAnswers[q.id];
              const isCorrect = userSel === q.correctOptionIndex;

              return (
                <div
                  key={q.id}
                  className={`p-4 rounded-xl border space-y-3 ${
                    isCorrect ? 'bg-emerald-50/50 border-emerald-200' : 'bg-rose-50/50 border-rose-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <h4 className="font-bold text-xs text-slate-900">
                      {qIdx + 1}. {q.questionText}
                    </h4>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 shrink-0 ${
                        isCorrect ? 'bg-emerald-200 text-emerald-900' : 'bg-rose-200 text-rose-900'
                      }`}
                    >
                      {isCorrect ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                      {isCorrect ? 'Correct' : 'Incorrect'}
                    </span>
                  </div>

                  {/* Options List Review */}
                  <div className="space-y-1.5 text-xs">
                    {q.options.map((opt, optIdx) => {
                      const isCorrectOpt = optIdx === q.correctOptionIndex;
                      const isUserChoice = userSel === optIdx;

                      return (
                        <div
                          key={optIdx}
                          className={`p-2 rounded border flex items-center justify-between ${
                            isCorrectOpt
                              ? 'bg-emerald-100 border-emerald-300 text-emerald-950 font-bold'
                              : isUserChoice
                              ? 'bg-rose-100 border-rose-300 text-rose-900 line-through'
                              : 'bg-white border-slate-200 text-slate-600'
                          }`}
                        >
                          <span>
                            {String.fromCharCode(65 + optIdx)}. {opt}
                          </span>
                          {isCorrectOpt && <span className="text-[10px] text-emerald-800 font-bold">✓ Correct Answer</span>}
                          {isUserChoice && !isCorrectOpt && (
                            <span className="text-[10px] text-rose-700 font-bold">Your Choice</span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Explanation */}
                  <div className="p-3 bg-white/80 rounded-lg border border-slate-200 text-xs text-slate-700 space-y-1">
                    <span className="font-bold text-slate-900 flex items-center gap-1">
                      <HelpCircle className="w-3.5 h-3.5 text-indigo-600" /> Explanation:
                    </span>
                    <p className="text-slate-600">{q.explanation}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* AI Quiz Generator Modal */}
      {showAiModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full border border-slate-200 shadow-xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700">
                  <Wand2 className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">Generate Custom AI Mock Test</h3>
              </div>
              <button onClick={() => setShowAiModal(false)} className="text-slate-400 hover:text-slate-600 text-lg">
                ×
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Course Skill / Topic</label>
              <input
                type="text"
                value={aiTopic}
                onChange={(e) => setAiTopic(e.target.value)}
                placeholder="e.g. Next.js Server Components, Docker Containers"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Difficulty Level</label>
              <select
                value={aiDifficulty}
                onChange={(e) => setAiDifficulty(e.target.value as any)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
              >
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Number of Questions</label>
              <input
                type="number"
                min={3}
                max={10}
                value={aiQuestionCount}
                onChange={(e) => setAiQuestionCount(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
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
                onClick={() => handleGenerateAiQuiz()}
                disabled={isGeneratingQuiz || !aiTopic.trim()}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-2xs disabled:opacity-50"
              >
                {isGeneratingQuiz ? 'Building Test...' : 'Generate Test'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
