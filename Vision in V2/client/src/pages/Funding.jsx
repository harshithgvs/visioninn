import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { TrendingUp, DollarSign, Calendar, Award, Send, CheckCircle2, X } from 'lucide-react';

export const Funding = () => {
  const { user } = useAuth();
  const { addToast } = useToast();

  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProgram, setSelectedProgram] = useState(null);
  
  // Pitch form state
  const [pitchDeckLink, setPitchDeckLink] = useState('');
  const [pitchSummary, setPitchSummary] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchFunding = async () => {
    try {
      const res = await API.get('/funding');
      if (res.data.success) {
        setPrograms(res.data.funding);
      }
    } catch (err) {
      console.error('Failed fetching funding programs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFunding();
  }, []);

  const handlePitchSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProgram || !pitchDeckLink) {
      addToast('Please enter your pitch deck link.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const res = await API.post('/funding/pitch', {
        programId: selectedProgram.id,
        pitchDeckLink,
        summary: pitchSummary,
        startupName: user?.startupName || 'Student Startup'
      });

      if (res.data.success) {
        addToast(res.data.message, 'success');
        setSelectedProgram(null);
        setPitchDeckLink('');
        setPitchSummary('');
      }
    } catch (err) {
      addToast('Pitch submission failed', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#1D4ED8] border border-[#1E293B] rounded-2xl p-6 shadow-md">
        <div className="flex items-center gap-2 mb-1">
          <TrendingUp className="w-5 h-5 text-emerald-400" />
          <h2 className="text-xl font-bold text-white tracking-tight">Funding, Incubators & Micro-Grants</h2>
        </div>
        <p className="text-slate-300 text-xs max-w-xl leading-relaxed">
          Submit pitch decks to government innovation grants, university accelerators, and student-focused angel networks.
        </p>
      </div>

      {/* Program Listings */}
      {loading ? (
        <div className="text-center py-8 text-xs text-slate-400">Loading funding opportunities...</div>
      ) : programs.length === 0 ? (
        <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-8 text-center text-slate-400 text-xs">
          No funding programs active.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {programs.map(prog => (
            <div key={prog.id} className="bg-[#0F172A] border border-[#1E293B] hover:border-emerald-500/50 rounded-xl p-5 shadow-sm space-y-4 flex flex-col justify-between transition-all">
              
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white font-extrabold text-base shrink-0 shadow-md">
                      {prog.logo || 'FN'}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-white">{prog.programName}</h3>
                      <div className="text-xs text-slate-400 mt-0.5">{prog.organization}</div>
                    </div>
                  </div>

                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {prog.type}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{prog.description}</p>

                <div className="bg-[#1E293B]/50 p-3 rounded-xl border border-[#1E293B] space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Funding Pool:</span>
                    <span className="text-emerald-400 font-bold">{prog.fundingAmount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Equity Terms:</span>
                    <span className="text-slate-200 font-semibold">{prog.equity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Application Deadline:</span>
                    <span className="text-amber-400 font-semibold">{prog.deadline}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedProgram(prog)}
                className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-110 text-white text-xs font-semibold rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" /> Submit Pitch Deck
              </button>

            </div>
          ))}
        </div>
      )}

      {/* Pitch Submission Modal */}
      {selectedProgram && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
              <h3 className="text-base font-bold text-white">Pitch to {selectedProgram.programName}</h3>
              <button onClick={() => setSelectedProgram(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePitchSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Pitch Deck URL (Google Drive / Canva / PDF)</label>
                <input
                  type="url"
                  value={pitchDeckLink}
                  onChange={(e) => setPitchDeckLink(e.target.value)}
                  placeholder="https://canva.com/design/... or drive link"
                  required
                  className="w-full bg-[#1E293B] border border-[#1E293B] rounded-xl p-3 text-white outline-none focus:border-brand"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Startup Executive Summary</label>
                <textarea
                  value={pitchSummary}
                  onChange={(e) => setPitchSummary(e.target.value)}
                  rows={3}
                  placeholder="Summarize product traction, user numbers, and funding requirements..."
                  className="w-full bg-[#1E293B] border border-[#1E293B] rounded-xl p-3 text-white outline-none focus:border-brand resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedProgram(null)}
                  className="px-4 py-2 rounded-xl font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md"
                >
                  {submitting ? 'Submitting...' : 'Submit Pitch Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
