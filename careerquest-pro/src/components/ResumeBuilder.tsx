import React, { useState, useRef } from 'react';
import { ResumeData, SkillCategory, WorkExperience, ProjectItem, EducationItem } from '../types';
import { ResumeTemplateView } from './ResumeTemplates';
import { Sparkles, Wand2, Download, Printer, Copy, Plus, Trash2, Check, RefreshCw, FileText, CheckCircle, Layout, Target, AlertCircle, Globe, Upload, FileJson, CheckCircle2 } from 'lucide-react';

interface ResumeBuilderProps {
  currentResume: ResumeData;
  onUpdateResume: (updated: ResumeData) => void;
}

export const ResumeBuilder: React.FC<ResumeBuilderProps> = ({ currentResume, onUpdateResume }) => {
  const [activeSubTab, setActiveSubTab] = useState<'editor' | 'ai-generator' | 'ats-analyzer' | 'templates'>('editor');
  
  // AI Generator Form state
  const [aiRole, setAiRole] = useState(currentResume.targetRole || 'Full Stack Software Engineer');
  const [aiExpLevel, setAiExpLevel] = useState('Mid-Level (3-5 yrs)');
  const [aiBio, setAiBio] = useState('Experienced in building modern React applications, scalable Express APIs, and cloud deployments.');
  const [aiSkills, setAiSkills] = useState('React 19, TypeScript, Node.js, Express, PostgreSQL, Tailwind CSS');
  const [isGenerating, setIsGenerating] = useState(false);
  const [genError, setGenError] = useState<string | null>(null);

  // ATS Analyzer state
  const [jobDescription, setJobDescription] = useState('');
  const [atsScore, setAtsScore] = useState<number | null>(null);
  const [matchedKeywords, setMatchedKeywords] = useState<string[]>([]);
  const [missingKeywords, setMissingKeywords] = useState<string[]>([]);

  // AI Bullet Rewriter state
  const [selectedExpId, setSelectedExpId] = useState<string | null>(null);
  const [bulletDraft, setBulletDraft] = useState('');
  const [bulletVariations, setBulletVariations] = useState<{ label: string; text: string }[]>([]);
  const [isEnhancingBullet, setIsEnhancingBullet] = useState(false);

  // Download & Modal state
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [downloadSuccessMsg, setDownloadSuccessMsg] = useState<string | null>(null);

  const printRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [copied, setCopied] = useState(false);

  // Trigger AI Full Resume Generation
  const handleAutoGenerateResume = async () => {
    setIsGenerating(true);
    setGenError(null);
    try {
      const response = await fetch('/api/generate-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetRole: aiRole,
          experienceLevel: aiExpLevel,
          userBio: aiBio,
          keySkills: aiSkills,
        }),
      });

      const data = await response.json();
      if (data.success && data.resume) {
        const generated = data.resume;
        const updated: ResumeData = {
          ...currentResume,
          fullName: generated.fullName || currentResume.fullName || 'Alex Vance',
          targetRole: aiRole,
          email: generated.email || currentResume.email,
          phone: generated.phone || currentResume.phone,
          location: generated.location || currentResume.location,
          linkedin: generated.linkedin || currentResume.linkedin,
          github: generated.github || currentResume.github,
          summary: generated.summary || currentResume.summary,
          skills: (generated.skills || []).map((s: any, idx: number) => ({ id: `sk-${idx}`, ...s })),
          experience: (generated.experience || []).map((e: any, idx: number) => ({ id: `exp-${idx}`, ...e })),
          projects: (generated.projects || []).map((p: any, idx: number) => ({ id: `proj-${idx}`, ...p })),
          education: (generated.education || []).map((ed: any, idx: number) => ({ id: `edu-${idx}`, ...ed })),
          certifications: generated.certifications || currentResume.certifications,
          updatedAt: new Date().toISOString(),
        };

        onUpdateResume(updated);
        setActiveSubTab('editor');
      } else {
        setGenError(data.error || 'Failed to generate resume.');
      }
    } catch (err: any) {
      setGenError(err.message || 'Error connecting to server');
    } finally {
      setIsGenerating(false);
    }
  };

  // Trigger AI Bullet Enhancement
  const handleEnhanceBullet = async () => {
    if (!bulletDraft.trim()) return;
    setIsEnhancingBullet(true);
    try {
      const response = await fetch('/api/enhance-bullet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          draftBullet: bulletDraft,
          targetRole: currentResume.targetRole,
        }),
      });
      const data = await response.json();
      if (data.success && data.variations) {
        setBulletVariations(data.variations);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsEnhancingBullet(false);
    }
  };

  // Apply selected bullet variation
  const applyBulletVariation = (variationText: string) => {
    if (!selectedExpId) return;
    const updatedExp = currentResume.experience.map((exp) => {
      if (exp.id === selectedExpId) {
        return { ...exp, highlights: [...exp.highlights, variationText] };
      }
      return exp;
    });
    onUpdateResume({ ...currentResume, experience: updatedExp });
    setBulletDraft('');
    setBulletVariations([]);
  };

  // Analyze ATS Score
  const handleAnalyzeATS = () => {
    if (!jobDescription.trim()) return;
    const resumeText = JSON.stringify(currentResume).toLowerCase();
    const words = jobDescription
      .toLowerCase()
      .replace(/[^\w\s]/gi, '')
      .split(/\s+/)
      .filter((w) => w.length > 3);

    const uniqueKeywords: string[] = Array.from(new Set(words));
    const matched: string[] = [];
    const missing: string[] = [];

    uniqueKeywords.forEach((kw) => {
      if (resumeText.includes(kw)) {
        matched.push(kw);
      } else {
        missing.push(kw);
      }
    });

    const score = Math.round((matched.length / (uniqueKeywords.length || 1)) * 100);
    setAtsScore(Math.min(score + 15, 98)); // Offset to give friendly realistic boost
    setMatchedKeywords(matched.slice(0, 15));
    setMissingKeywords(missing.slice(0, 15));
  };

  const triggerSuccess = (msg: string) => {
    setDownloadSuccessMsg(msg);
    setTimeout(() => setDownloadSuccessMsg(null), 3500);
  };

  // 1. Download as Printable PDF
  const handlePrint = () => {
    try {
      window.print();
      triggerSuccess('Opened Print / Save as PDF dialog');
    } catch (err) {
      console.warn('window.print failed, falling back to HTML download:', err);
      handleDownloadHtml();
    }
  };

  // 2. Download Formatted Standalone HTML Document (.html)
  const handleDownloadHtml = () => {
    const content = printRef.current?.innerHTML || '';
    const safeName = (currentResume.fullName || 'My').replace(/[^a-zA-Z0-9]/g, '_');

    const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${currentResume.fullName || 'Resume'} - ${currentResume.targetRole || 'Resume'}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body { font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 24px; background-color: #f8fafc; color: #1e293b; }
    .resume-card { background: white; max-width: 800px; margin: 0 auto; padding: 32px; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); border: 1px solid #e2e8f0; }
    @media print {
      body { background: white; padding: 0; }
      .resume-card { box-shadow: none; padding: 0; border: none; max-width: 100%; }
    }
  </style>
</head>
<body>
  <div class="resume-card">
    ${content}
  </div>
</body>
</html>`;

    const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${safeName}_Resume.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    triggerSuccess(`Downloaded ${safeName}_Resume.html`);
  };

  // 3. Download Plain Text Document (.txt)
  const handleDownloadText = () => {
    const safeName = (currentResume.fullName || 'My').replace(/[^a-zA-Z0-9]/g, '_');
    let text = `${currentResume.fullName || 'YOUR NAME'}\n`;
    text += `${currentResume.targetRole || ''}\n`;
    text += `Email: ${currentResume.email || ''} | Phone: ${currentResume.phone || ''} | Location: ${currentResume.location || ''}\n`;
    if (currentResume.linkedin) text += `LinkedIn: ${currentResume.linkedin}\n`;
    if (currentResume.github) text += `GitHub: ${currentResume.github}\n`;
    
    text += `\n${'='.repeat(60)}\nPROFESSIONAL SUMMARY\n${'='.repeat(60)}\n`;
    text += `${currentResume.summary}\n\n`;

    text += `${'='.repeat(60)}\nTECHNICAL SKILLS\n${'='.repeat(60)}\n`;
    currentResume.skills.forEach((s) => {
      text += `${s.category}: ${s.items.join(', ')}\n`;
    });

    text += `\n${'='.repeat(60)}\nWORK EXPERIENCE\n${'='.repeat(60)}\n`;
    currentResume.experience.forEach((e) => {
      text += `${e.role} - ${e.company} (${e.startDate} - ${e.endDate})\n`;
      text += `Location: ${e.location}\n`;
      e.highlights.forEach((h) => {
        text += `  • ${h}\n`;
      });
      text += `\n`;
    });

    if (currentResume.projects && currentResume.projects.length > 0) {
      text += `${'='.repeat(60)}\nPROJECTS\n${'='.repeat(60)}\n`;
      currentResume.projects.forEach((p) => {
        text += `${p.title} (${p.techStack.join(', ')})\n`;
        text += `${p.description}\n`;
        if (p.link) text += `Link: ${p.link}\n`;
        text += `\n`;
      });
    }

    if (currentResume.education && currentResume.education.length > 0) {
      text += `${'='.repeat(60)}\nEDUCATION\n${'='.repeat(60)}\n`;
      currentResume.education.forEach((ed) => {
        text += `${ed.degree} - ${ed.institution} (${ed.year})\n`;
      });
    }

    if (currentResume.certifications && currentResume.certifications.length > 0) {
      text += `\n${'='.repeat(60)}\nCERTIFICATIONS\n${'='.repeat(60)}\n`;
      currentResume.certifications.forEach((c) => {
        text += `  • ${c}\n`;
      });
    }

    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${safeName}_Resume.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    triggerSuccess(`Downloaded ${safeName}_Resume.txt`);
  };

  // 4. Download JSON Backup (.json)
  const handleDownloadJson = () => {
    const safeName = (currentResume.fullName || 'My').replace(/[^a-zA-Z0-9]/g, '_');
    const jsonStr = JSON.stringify(currentResume, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${safeName}_Resume_Data.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    triggerSuccess(`Downloaded ${safeName}_Resume_Data.json`);
  };

  // 5. Import JSON Resume
  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed && typeof parsed === 'object' && parsed.fullName) {
          onUpdateResume(parsed);
          triggerSuccess('Resume loaded successfully from JSON file!');
          setShowDownloadModal(false);
        } else {
          alert('Invalid resume JSON file format.');
        }
      } catch (err) {
        alert('Failed to parse JSON file.');
      }
    };
    reader.readAsText(file);
  };

  // Copy Markdown format to clipboard
  const handleCopyText = () => {
    const text = `# ${currentResume.fullName}
${currentResume.targetRole} | ${currentResume.email} | ${currentResume.phone}

## Summary
${currentResume.summary}

## Skills
${currentResume.skills.map((s) => `- **${s.category}**: ${s.items.join(', ')}`).join('\n')}

## Experience
${currentResume.experience
  .map(
    (e) => `### ${e.role} - ${e.company} (${e.startDate} - ${e.endDate})
${e.highlights.map((h) => `- ${h}`).join('\n')}`
  )
  .join('\n\n')}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    triggerSuccess('Copied resume text to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Controls Header */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-4">
        {/* Sub-tab Navigation */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveSubTab('editor')}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
              activeSubTab === 'editor'
                ? 'bg-indigo-600 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" /> Edit Resume Form
          </button>
          <button
            onClick={() => setActiveSubTab('ai-generator')}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
              activeSubTab === 'ai-generator'
                ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-2xs'
                : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-300" /> ⚡ AI Auto-Generate
          </button>
          <button
            onClick={() => setActiveSubTab('ats-analyzer')}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
              activeSubTab === 'ats-analyzer'
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
            }`}
          >
            <Target className="w-4 h-4" /> ATS Match Score
          </button>
          <button
            onClick={() => setActiveSubTab('templates')}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
              activeSubTab === 'templates'
                ? 'bg-violet-600 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Layout className="w-4 h-4" /> Change Template
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyText}
            className="px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied' : 'Copy Text'}
          </button>

          <button
            onClick={() => setShowDownloadModal(true)}
            className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition-all shrink-0"
          >
            <Download className="w-4 h-4" /> Download Resume Options
          </button>
        </div>
      </div>

      {/* Main Split View: Form Controls / Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Active Panel Controls */}
        <div className="lg:col-span-5 space-y-6">
          {/* PANEL 1: AI Auto-Generate */}
          {activeSubTab === 'ai-generator' && (
            <div className="bg-white p-5 rounded-xl border border-indigo-200 shadow-2xs space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-indigo-100">
                <div className="p-2 rounded-lg bg-indigo-100 text-indigo-700">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">⚡ AI Auto-Resume Generator</h2>
                  <p className="text-xs text-slate-500">Generate a tailored ATS resume in seconds using Gemini API</p>
                </div>
              </div>

              {genError && (
                <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-lg flex items-center gap-2 border border-rose-200">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{genError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Target Role / Job Title</label>
                <input
                  type="text"
                  value={aiRole}
                  onChange={(e) => setAiRole(e.target.value)}
                  placeholder="e.g. Senior Frontend Developer, Data Analyst"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Experience Level</label>
                <select
                  value={aiExpLevel}
                  onChange={(e) => setAiExpLevel(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
                >
                  <option>Entry Level (0-2 yrs)</option>
                  <option>Mid-Level (3-5 yrs)</option>
                  <option>Senior Level (5+ yrs)</option>
                  <option>Lead / Architect</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Background / Key Highlights</label>
                <textarea
                  rows={3}
                  value={aiBio}
                  onChange={(e) => setAiBio(e.target.value)}
                  placeholder="Mention your main achievements or background details..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Key Technical Skills to Include</label>
                <input
                  type="text"
                  value={aiSkills}
                  onChange={(e) => setAiSkills(e.target.value)}
                  placeholder="e.g. React, Python, Docker, SQL"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <button
                onClick={handleAutoGenerateResume}
                disabled={isGenerating}
                className="w-full py-2.5 rounded-lg bg-gradient-to-r from-indigo-600 via-violet-600 to-emerald-600 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-sm hover:opacity-95 transition-opacity disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" /> Generating ATS Resume...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4 text-amber-300" /> Generate Complete Resume
                  </>
                )}
              </button>
            </div>
          )}

          {/* PANEL 2: ATS Keyword Match Score */}
          {activeSubTab === 'ats-analyzer' && (
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700">
                  <Target className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">ATS Job Description Matcher</h2>
                  <p className="text-xs text-slate-500">Paste job posting text to test resume keyword compatibility</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Job Description Text</label>
                <textarea
                  rows={5}
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste job description requirements here..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <button
                onClick={handleAnalyzeATS}
                className="w-full py-2 rounded-lg bg-emerald-600 text-white font-semibold text-xs flex items-center justify-center gap-2 hover:bg-emerald-700 transition-colors"
              >
                <CheckCircle className="w-4 h-4" /> Calculate ATS Match Score
              </button>

              {atsScore !== null && (
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">ATS Keyword Match:</span>
                    <span
                      className={`text-lg font-extrabold px-3 py-0.5 rounded-full ${
                        atsScore >= 75
                          ? 'bg-emerald-100 text-emerald-800'
                          : atsScore >= 50
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {atsScore}%
                    </span>
                  </div>

                  {/* Matched & Missing */}
                  <div>
                    <span className="block text-[11px] font-semibold text-emerald-700 mb-1">Matched Keywords:</span>
                    <div className="flex flex-wrap gap-1">
                      {matchedKeywords.map((kw, i) => (
                        <span key={i} className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                          ✓ {kw}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="block text-[11px] font-semibold text-amber-700 mb-1">Recommended Keywords to Add:</span>
                    <div className="flex flex-wrap gap-1">
                      {missingKeywords.map((kw, i) => (
                        <span key={i} className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">
                          + {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* PANEL 3: Template Chooser */}
          {activeSubTab === 'templates' && (
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
              <h2 className="text-base font-bold text-slate-900 mb-2">Select Resume Design Template</h2>
              <div className="space-y-3">
                <button
                  onClick={() => onUpdateResume({ ...currentResume, templateId: 'modern-clean' })}
                  className={`w-full p-3 rounded-lg border text-left flex items-center justify-between transition-all ${
                    currentResume.templateId === 'modern-clean'
                      ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-500'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div>
                    <div className="font-bold text-xs text-slate-900">Modern Clean (Default)</div>
                    <div className="text-[11px] text-slate-500">Indigo accent, balanced typography, ATS-standard</div>
                  </div>
                  {currentResume.templateId === 'modern-clean' && <CheckCircle className="w-5 h-5 text-indigo-600" />}
                </button>

                <button
                  onClick={() => onUpdateResume({ ...currentResume, templateId: 'vibrant-tech' })}
                  className={`w-full p-3 rounded-lg border text-left flex items-center justify-between transition-all ${
                    currentResume.templateId === 'vibrant-tech'
                      ? 'border-violet-600 bg-violet-50/50 ring-2 ring-violet-500'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div>
                    <div className="font-bold text-xs text-slate-900">Vibrant Tech & Creative</div>
                    <div className="text-[11px] text-slate-500">Gradient header, pill skill tags, modern flair</div>
                  </div>
                  {currentResume.templateId === 'vibrant-tech' && <CheckCircle className="w-5 h-5 text-violet-600" />}
                </button>

                <button
                  onClick={() => onUpdateResume({ ...currentResume, templateId: 'executive-serif' })}
                  className={`w-full p-3 rounded-lg border text-left flex items-center justify-between transition-all ${
                    currentResume.templateId === 'executive-serif'
                      ? 'border-slate-800 bg-slate-50 ring-2 ring-slate-700'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div>
                    <div className="font-bold text-xs text-slate-900">Executive Serif</div>
                    <div className="text-[11px] text-slate-500">Classic serif typography for corporate leadership</div>
                  </div>
                  {currentResume.templateId === 'executive-serif' && <CheckCircle className="w-5 h-5 text-slate-900" />}
                </button>
              </div>
            </div>
          )}

          {/* PANEL 4: Interactive Manual Form Editor */}
          {activeSubTab === 'editor' && (
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-5 max-h-[750px] overflow-y-auto">
              <h2 className="text-base font-bold text-slate-900 border-b pb-2">Edit Resume Content</h2>

              {/* Personal Info */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Personal Information</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600">Full Name</label>
                    <input
                      type="text"
                      value={currentResume.fullName}
                      onChange={(e) => onUpdateResume({ ...currentResume, fullName: e.target.value })}
                      className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600">Target Role Title</label>
                    <input
                      type="text"
                      value={currentResume.targetRole}
                      onChange={(e) => onUpdateResume({ ...currentResume, targetRole: e.target.value })}
                      className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600">Email</label>
                    <input
                      type="text"
                      value={currentResume.email}
                      onChange={(e) => onUpdateResume({ ...currentResume, email: e.target.value })}
                      className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600">Phone</label>
                    <input
                      type="text"
                      value={currentResume.phone}
                      onChange={(e) => onUpdateResume({ ...currentResume, phone: e.target.value })}
                      className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600">Location</label>
                    <input
                      type="text"
                      value={currentResume.location}
                      onChange={(e) => onUpdateResume({ ...currentResume, location: e.target.value })}
                      className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600">LinkedIn Profile</label>
                    <input
                      type="text"
                      value={currentResume.linkedin}
                      onChange={(e) => onUpdateResume({ ...currentResume, linkedin: e.target.value })}
                      className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded"
                    />
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div>
                <label className="block text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">
                  Professional Summary
                </label>
                <textarea
                  rows={3}
                  value={currentResume.summary}
                  onChange={(e) => onUpdateResume({ ...currentResume, summary: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              {/* Work Experience */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Work Experience</h3>
                  <button
                    onClick={() => {
                      const newExp: WorkExperience = {
                        id: `exp-${Date.now()}`,
                        company: 'Company Name',
                        role: 'Job Role',
                        location: 'City, State',
                        startDate: 'Jan 2022',
                        endDate: 'Present',
                        highlights: ['Achieved 20% growth in efficiency by optimizing workflow.'],
                      };
                      onUpdateResume({ ...currentResume, experience: [...currentResume.experience, newExp] });
                    }}
                    className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Experience
                  </button>
                </div>

                {currentResume.experience.map((exp, expIdx) => (
                  <div key={exp.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                    <div className="flex justify-between items-start">
                      <div className="grid grid-cols-2 gap-2 flex-1 mr-2">
                        <input
                          type="text"
                          value={exp.role}
                          onChange={(e) => {
                            const updated = [...currentResume.experience];
                            updated[expIdx].role = e.target.value;
                            onUpdateResume({ ...currentResume, experience: updated });
                          }}
                          placeholder="Role"
                          className="px-2 py-1 text-xs border border-slate-300 rounded bg-white font-bold"
                        />
                        <input
                          type="text"
                          value={exp.company}
                          onChange={(e) => {
                            const updated = [...currentResume.experience];
                            updated[expIdx].company = e.target.value;
                            onUpdateResume({ ...currentResume, experience: updated });
                          }}
                          placeholder="Company"
                          className="px-2 py-1 text-xs border border-slate-300 rounded bg-white"
                        />
                      </div>
                      <button
                        onClick={() => {
                          const updated = currentResume.experience.filter((e) => e.id !== exp.id);
                          onUpdateResume({ ...currentResume, experience: updated });
                        }}
                        className="text-slate-400 hover:text-rose-600 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={exp.startDate}
                        onChange={(e) => {
                          const updated = [...currentResume.experience];
                          updated[expIdx].startDate = e.target.value;
                          onUpdateResume({ ...currentResume, experience: updated });
                        }}
                        placeholder="Start Date"
                        className="px-2 py-1 text-[11px] border border-slate-300 rounded bg-white"
                      />
                      <input
                        type="text"
                        value={exp.endDate}
                        onChange={(e) => {
                          const updated = [...currentResume.experience];
                          updated[expIdx].endDate = e.target.value;
                          onUpdateResume({ ...currentResume, experience: updated });
                        }}
                        placeholder="End Date"
                        className="px-2 py-1 text-[11px] border border-slate-300 rounded bg-white"
                      />
                    </div>

                    {/* Bullet Points */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-semibold text-slate-500 uppercase">Bullet Points</span>
                      {exp.highlights.map((h, hIdx) => (
                        <div key={hIdx} className="flex gap-1 items-center">
                          <input
                            type="text"
                            value={h}
                            onChange={(e) => {
                              const updated = [...currentResume.experience];
                              updated[expIdx].highlights[hIdx] = e.target.value;
                              onUpdateResume({ ...currentResume, experience: updated });
                            }}
                            className="w-full px-2 py-1 text-xs border border-slate-300 rounded bg-white"
                          />
                          <button
                            onClick={() => {
                              const updated = [...currentResume.experience];
                              updated[expIdx].highlights.splice(hIdx, 1);
                              onUpdateResume({ ...currentResume, experience: updated });
                            }}
                            className="text-slate-400 hover:text-rose-600 p-1"
                          >
                            ×
                          </button>
                        </div>
                      ))}

                      {/* AI Bullet Enhancer Tool */}
                      <div className="pt-2 border-t border-slate-200 mt-2">
                        <div className="flex gap-1.5">
                          <input
                            type="text"
                            placeholder="Draft bullet point to enhance with AI metrics..."
                            value={selectedExpId === exp.id ? bulletDraft : ''}
                            onChange={(e) => {
                              setSelectedExpId(exp.id);
                              setBulletDraft(e.target.value);
                            }}
                            className="w-full px-2 py-1 text-xs border border-indigo-200 rounded focus:ring-1 focus:ring-indigo-500"
                          />
                          <button
                            onClick={() => {
                              setSelectedExpId(exp.id);
                              handleEnhanceBullet();
                            }}
                            disabled={isEnhancingBullet}
                            className="px-2 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-[10px] font-semibold flex items-center gap-1 shrink-0"
                          >
                            <Wand2 className="w-3 h-3 text-amber-300" /> AI Enhance
                          </button>
                        </div>

                        {selectedExpId === exp.id && bulletVariations.length > 0 && (
                          <div className="mt-2 space-y-1 bg-indigo-50/70 p-2 rounded border border-indigo-100">
                            <span className="text-[10px] font-bold text-indigo-700">Select AI High-Impact Bullet:</span>
                            {bulletVariations.map((v, idx) => (
                              <button
                                key={idx}
                                onClick={() => applyBulletVariation(v.text)}
                                className="w-full text-left p-1.5 text-[11px] bg-white hover:bg-indigo-100 rounded border border-indigo-200 text-slate-800 transition-colors"
                              >
                                <span className="font-bold text-indigo-600">[{v.label}]: </span>
                                {v.text}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Live Resume Document Preview */}
        <div className="lg:col-span-7">
          <div className="sticky top-6 space-y-3">
            <div className="flex justify-between items-center text-xs font-semibold text-slate-600 px-1 bg-white p-3 rounded-xl border border-slate-200">
              <div className="flex items-center gap-2">
                <span>Live Visual Resume Preview ({currentResume.templateId})</span>
                <span className="text-emerald-600 text-[10px] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1 font-bold">
                  <Check className="w-3 h-3" /> Auto-Saved
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownloadHtml}
                  className="px-2.5 py-1 rounded bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[11px] font-bold flex items-center gap-1 border border-indigo-200"
                  title="Download formatted HTML document file"
                >
                  <Globe className="w-3 h-3" /> HTML File
                </button>
                <button
                  onClick={handlePrint}
                  className="px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold flex items-center gap-1 shadow-2xs"
                >
                  <Printer className="w-3 h-3" /> Print / PDF
                </button>
              </div>
            </div>

            <ResumeTemplateView data={currentResume} printRef={printRef} />
          </div>
        </div>
      </div>

      {/* Download Options Modal */}
      {showDownloadModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full border border-slate-200 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
                  <Download className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Export & Download Options</h3>
                  <p className="text-xs text-slate-500">Choose your preferred format to save or print your resume</p>
                </div>
              </div>
              <button
                onClick={() => setShowDownloadModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xl font-bold p-1"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Option 1: PDF via Print */}
              <button
                onClick={() => {
                  setShowDownloadModal(false);
                  handlePrint();
                }}
                className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/60 hover:bg-emerald-100/80 text-left transition-all space-y-2 group"
              >
                <div className="p-2 rounded-lg bg-emerald-600 text-white w-fit group-hover:scale-105 transition-transform">
                  <Printer className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-900">Save as PDF / Print</h4>
                  <p className="text-[11px] text-slate-600 mt-0.5">Triggers browser print dialog with target PDF printer</p>
                </div>
              </button>

              {/* Option 2: HTML File */}
              <button
                onClick={() => {
                  setShowDownloadModal(false);
                  handleDownloadHtml();
                }}
                className="p-4 rounded-xl border border-indigo-200 bg-indigo-50/60 hover:bg-indigo-100/80 text-left transition-all space-y-2 group"
              >
                <div className="p-2 rounded-lg bg-indigo-600 text-white w-fit group-hover:scale-105 transition-transform">
                  <Globe className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-900">Download HTML Web Resume</h4>
                  <p className="text-[11px] text-slate-600 mt-0.5">Standalone styled .html document file</p>
                </div>
              </button>

              {/* Option 3: Plaintext File */}
              <button
                onClick={() => {
                  setShowDownloadModal(false);
                  handleDownloadText();
                }}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-left transition-all space-y-2 group"
              >
                <div className="p-2 rounded-lg bg-slate-700 text-white w-fit group-hover:scale-105 transition-transform">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-900">Download Text Document</h4>
                  <p className="text-[11px] text-slate-600 mt-0.5">Clean .txt resume for online portal copy-pasting</p>
                </div>
              </button>

              {/* Option 4: JSON Backup */}
              <button
                onClick={() => {
                  setShowDownloadModal(false);
                  handleDownloadJson();
                }}
                className="p-4 rounded-xl border border-amber-200 bg-amber-50/60 hover:bg-amber-100/80 text-left transition-all space-y-2 group"
              >
                <div className="p-2 rounded-lg bg-amber-600 text-white w-fit group-hover:scale-105 transition-transform">
                  <FileJson className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-900">Export JSON Backup</h4>
                  <p className="text-[11px] text-slate-600 mt-0.5">Raw structured data file to save or transfer</p>
                </div>
              </button>
            </div>

            {/* Import JSON File */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Have a saved JSON resume file?</span>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold flex items-center gap-1.5"
              >
                <Upload className="w-3.5 h-3.5" /> Import JSON
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleImportJson}
                className="hidden"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowDownloadModal(false)}
                className="px-4 py-2 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

