import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Lightbulb, Lock, Eye, EyeOff, ShieldCheck, Plus, CheckCircle2, History, Copy, X } from 'lucide-react';

export const IdeaVault = () => {
  const { user } = useAuth();
  const { addToast } = useToast();

  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'private', 'public'
  
  // New Idea Modal
  const [showNewModal, setShowNewModal] = useState(false);
  const [newIdea, setNewIdea] = useState({
    title: '',
    problem: '',
    solution: '',
    targetMarket: '',
    techStack: '',
    isPublic: false
  });
  const [submitting, setSubmitting] = useState(false);

  // Certificate Modal
  const [activeCert, setActiveCert] = useState(null);

  const fetchIdeas = async () => {
    try {
      const res = await API.get(`/ideas?filter=${filter}`);
      if (res.data.success) {
        setIdeas(res.data.ideas);
      }
    } catch (err) {
      console.error('Failed to load ideas:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIdeas();
  }, [filter]);

  const handleCreateIdea = async (e) => {
    e.preventDefault();
    if (!newIdea.title || !newIdea.problem || !newIdea.solution) {
      addToast('Please enter title, problem, and solution.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const res = await API.post('/ideas', newIdea);
      if (res.data.success) {
        setIdeas(prev => [res.data.idea, ...prev]);
        addToast('Idea timestamped and saved to secure vault!', 'success');
        setShowNewModal(false);
        setNewIdea({ title: '', problem: '', solution: '', targetMarket: '', techStack: '', isPublic: false });
      }
    } catch (err) {
      addToast('Failed saving idea', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleVisibility = async (ideaId) => {
    try {
      const res = await API.patch(`/ideas/${ideaId}/visibility`);
      if (res.data.success) {
        setIdeas(prev => prev.map(i => i.id === ideaId ? res.data.idea : i));
        addToast(res.data.message, 'info');
      }
    } catch (err) {
      addToast('Visibility update failed', 'error');
    }
  };

  const copyHash = (hash) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(hash);
      addToast('IP Timestamp Hash copied to clipboard!', 'info');
    }
  };

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#1D4ED8] border border-[#1E293B] rounded-2xl p-6 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl font-bold text-white tracking-tight">Secured Idea Vault & IP Ledger</h2>
          </div>
          <p className="text-slate-300 text-xs max-w-xl leading-relaxed">
            Protect your startup concepts with cryptographic SHA-256 timestamp seals. Log your innovation history before sharing with potential co-founders or investors.
          </p>
        </div>

        <button
          onClick={() => setShowNewModal(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:brightness-110 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-lg shadow-blue-500/25 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" /> Secure New Idea
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between bg-[#0F172A] border border-[#1E293B] rounded-xl p-2">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filter === 'all' ? 'bg-brand text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            All Vault Ideas
          </button>
          <button
            onClick={() => setFilter('private')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filter === 'private' ? 'bg-brand text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Private Drafts
          </button>
          <button
            onClick={() => setFilter('public')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filter === 'public' ? 'bg-brand text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Public Showcases
          </button>
        </div>

        <span className="text-xs text-slate-400 font-medium px-2">
          Total Ideas: {ideas.length}
        </span>
      </div>

      {/* Ideas List */}
      {loading ? (
        <div className="text-center py-8 text-xs text-slate-400">Loading Idea Vault...</div>
      ) : ideas.length === 0 ? (
        <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-12 text-center text-slate-400 text-xs">
          <Lightbulb className="w-8 h-8 text-amber-400/50 mx-auto mb-2" />
          No ideas found in this view. Click "Secure New Idea" to register your first concept.
        </div>
      ) : (
        <div className="space-y-4">
          {ideas.map(idea => (
            <div key={idea.id} className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-5 shadow-sm space-y-3">
              
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-white">{idea.title}</h3>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                      idea.isPublic 
                        ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' 
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}>
                      {idea.isPublic ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      {idea.isPublic ? 'Public Showcase' : 'Private Vault Draft'}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1 font-mono">
                    Timestamp Hash: <span className="text-sky-400">{idea.hash?.substring(0, 24)}...</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleVisibility(idea.id)}
                    className="p-1.5 rounded-lg bg-[#1E293B] hover:bg-[#334155] text-slate-300 text-xs"
                    title="Toggle Privacy"
                  >
                    {idea.isPublic ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={() => setActiveCert(idea)}
                    className="px-3 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-400 text-xs font-semibold flex items-center gap-1"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" /> Certificate
                  </button>
                </div>
              </div>

              {/* Grid detail */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
                <div className="bg-[#1E293B]/40 p-3 rounded-lg border border-[#1E293B]">
                  <span className="font-semibold text-slate-200 block mb-1 text-[11px] uppercase tracking-wider">Problem Statement</span>
                  <p className="text-slate-300 leading-relaxed">{idea.problem}</p>
                </div>
                <div className="bg-[#1E293B]/40 p-3 rounded-lg border border-[#1E293B]">
                  <span className="font-semibold text-slate-200 block mb-1 text-[11px] uppercase tracking-wider">Proposed Solution</span>
                  <p className="text-slate-300 leading-relaxed">{idea.solution}</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-[#1E293B]">
                <div>Target Market: <strong className="text-slate-200">{idea.targetMarket}</strong></div>
                <div className="flex items-center gap-2">
                  <span>Stack: <strong className="text-slate-200">{idea.techStack}</strong></span>
                  <button onClick={() => copyHash(idea.hash)} className="hover:text-white">
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New Idea Creation Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
                Register Startup Concept to IP Ledger
              </h3>
              <button onClick={() => setShowNewModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateIdea} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Startup / Idea Title</label>
                <input
                  type="text"
                  value={newIdea.title}
                  onChange={(e) => setNewIdea({ ...newIdea, title: e.target.value })}
                  placeholder="e.g. Autonomous Crop Health Scanner"
                  required
                  className="w-full bg-[#1E293B] border border-[#1E293B] rounded-xl p-3 text-white outline-none focus:border-brand"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Problem Statement</label>
                <textarea
                  value={newIdea.problem}
                  onChange={(e) => setNewIdea({ ...newIdea, problem: e.target.value })}
                  rows={2}
                  placeholder="What pain point does this solve?"
                  required
                  className="w-full bg-[#1E293B] border border-[#1E293B] rounded-xl p-3 text-white outline-none focus:border-brand resize-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Proposed Solution</label>
                <textarea
                  value={newIdea.solution}
                  onChange={(e) => setNewIdea({ ...newIdea, solution: e.target.value })}
                  rows={2}
                  placeholder="Describe your technical MVP or product feature..."
                  required
                  className="w-full bg-[#1E293B] border border-[#1E293B] rounded-xl p-3 text-white outline-none focus:border-brand resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Target Market</label>
                  <input
                    type="text"
                    value={newIdea.targetMarket}
                    onChange={(e) => setNewIdea({ ...newIdea, targetMarket: e.target.value })}
                    placeholder="e.g. Campus Students, Local Farmers"
                    className="w-full bg-[#1E293B] border border-[#1E293B] rounded-xl p-2.5 text-white outline-none focus:border-brand"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Tech Stack</label>
                  <input
                    type="text"
                    value={newIdea.techStack}
                    onChange={(e) => setNewIdea({ ...newIdea, techStack: e.target.value })}
                    placeholder="e.g. React, Node.js, Python"
                    className="w-full bg-[#1E293B] border border-[#1E293B] rounded-xl p-2.5 text-white outline-none focus:border-brand"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isPublic"
                  checked={newIdea.isPublic}
                  onChange={(e) => setNewIdea({ ...newIdea, isPublic: e.target.checked })}
                  className="accent-brand w-4 h-4 cursor-pointer"
                />
                <label htmlFor="isPublic" className="text-slate-300 cursor-pointer">
                  Make public summary visible on Ecosystem feed (Full IP hash remains timestamped)
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2 rounded-xl font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl font-semibold bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-md hover:brightness-110"
                >
                  {submitting ? 'Generating Hash...' : 'Timestamp & Save to Vault'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* IP Certificate Verification Modal */}
      {activeCert && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0F172A] border border-amber-500/40 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 mx-auto">
              <ShieldCheck className="w-6 h-6" />
            </div>
            
            <div>
              <h3 className="text-lg font-bold text-white">Cryptographic IP Certificate</h3>
              <p className="text-[11px] text-slate-400 mt-1">Official Proof of Priority & Concept Registration</p>
            </div>

            <div className="bg-[#1E293B] border border-[#1E293B] rounded-xl p-4 text-left space-y-2 text-xs font-mono">
              <div>
                <span className="text-slate-400 block text-[10px]">Title:</span>
                <span className="text-white font-bold">{activeCert.title}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Registrant:</span>
                <span className="text-slate-200">{activeCert.authorName || user?.name}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">SHA-256 IP Hash Seal:</span>
                <span className="text-amber-400 break-all text-[11px]">{activeCert.hash}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Registration Timestamp:</span>
                <span className="text-slate-300">{activeCert.timestamp || '2026-07-29 14:00:00 UTC'}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => copyHash(activeCert.hash)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#1E293B] hover:bg-[#334155] text-slate-200"
              >
                Copy Seal
              </button>
              <button
                onClick={() => setActiveCert(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-amber-500 text-black hover:brightness-110 font-bold"
              >
                Close Certificate
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
