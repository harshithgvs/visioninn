import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Briefcase, Building, MapPin, DollarSign, Plus, CheckCircle2, Search, Filter, X } from 'lucide-react';

export const Careers = () => {
  const { user } = useAuth();
  const { addToast } = useToast();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Apply Modal
  const [selectedJob, setSelectedJob] = useState(null);
  const [resumeLink, setResumeLink] = useState('');
  const [applicantNote, setApplicantNote] = useState('');
  const [applying, setApplying] = useState(false);

  // Post Job Modal
  const [showPostJobModal, setShowPostJobModal] = useState(false);
  const [newJob, setNewJob] = useState({
    title: '',
    companyName: user?.startupName || '',
    location: 'Remote',
    type: 'Internship',
    stipend: '₹15,000 / month + Equity Options',
    tags: 'React, Node.js, AI',
    description: '',
    requirements: ''
  });

  const fetchJobs = async () => {
    try {
      let url = `/jobs?type=${typeFilter}`;
      if (searchQuery) url += `&search=${encodeURIComponent(searchQuery)}`;
      const res = await API.get(url);
      if (res.data.success) {
        setJobs(res.data.jobs);
      }
    } catch (err) {
      console.error('Failed fetching jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [typeFilter]);

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    if (!selectedJob) return;

    setApplying(true);
    try {
      const res = await API.post(`/jobs/${selectedJob.id}/apply`, {
        resumeLink,
        note: applicantNote
      });

      if (res.data.success) {
        addToast(res.data.message, 'success');
        setSelectedJob(null);
        setResumeLink('');
        setApplicantNote('');
        fetchJobs();
      }
    } catch (err) {
      addToast('Application failed', 'error');
    } finally {
      setApplying(false);
    }
  };

  const handleCreateJobSubmit = async (e) => {
    e.preventDefault();
    if (!newJob.title || !newJob.companyName || !newJob.description) {
      addToast('Please fill required job details.', 'error');
      return;
    }

    try {
      const res = await API.post('/jobs', newJob);
      if (res.data.success) {
        setJobs(prev => [res.data.job, ...prev]);
        addToast(res.data.message, 'success');
        setShowPostJobModal(false);
      }
    } catch (err) {
      addToast('Failed posting job', 'error');
    }
  };

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#1D4ED8] border border-[#1E293B] rounded-2xl p-6 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Briefcase className="w-5 h-5 text-sky-400" />
            <h2 className="text-xl font-bold text-white tracking-tight">Startup Careers & Internships</h2>
          </div>
          <p className="text-slate-300 text-xs max-w-xl leading-relaxed">
            Apply for internships, full-time engineering positions, and equity-backed student co-founder roles at top campus startups.
          </p>
        </div>

        <button
          onClick={() => setShowPostJobModal(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:brightness-110 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-lg shadow-blue-500/25 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" /> Post Opportunity
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between bg-[#0F172A] border border-[#1E293B] rounded-xl p-3">
        <div className="flex items-center gap-1.5 flex-wrap">
          {['all', 'internship', 'part-time', 'full-time'].map(t => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                typeFilter === t ? 'bg-brand text-white shadow-sm' : 'bg-[#1E293B] text-slate-400 hover:text-white'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Jobs List */}
      {loading ? (
        <div className="text-center py-8 text-xs text-slate-400">Loading startup opportunities...</div>
      ) : jobs.length === 0 ? (
        <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-8 text-center text-slate-400 text-xs">
          No opportunities found for this filter.
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map(job => (
            <div key={job.id} className="bg-[#0F172A] border border-[#1E293B] hover:border-brand/60 rounded-xl p-5 shadow-sm space-y-4 transition-all">
              
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#3B82F6] to-[#1D4ED8] flex items-center justify-center text-white font-bold text-base shrink-0 shadow-md">
                    {job.companyLogo || 'SC'}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white">{job.title}</h3>
                    <div className="text-xs font-semibold text-blue-400 mt-0.5">{job.companyName}</div>
                    <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-slate-500" /> {job.location}</span>
                      <span className="flex items-center gap-1"><DollarSign className="w-3 h-3 text-emerald-400" /> {job.stipend}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedJob(job)}
                  className="px-4 py-2 bg-brand hover:bg-blue-600 text-white text-xs font-semibold rounded-xl shadow-md transition-all shrink-0"
                >
                  Apply Now
                </button>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">{job.description}</p>

              {/* Requirement tags */}
              {job.tags && job.tags.length > 0 && (
                <div className="flex items-center gap-1.5 flex-wrap pt-1">
                  {job.tags.map((tag, idx) => (
                    <span key={idx} className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-[#1E293B] border border-[#1E293B] text-slate-300">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-[#1E293B]">
                <span>Posted {job.createdAt}</span>
                <span>{job.applicantsCount || 0} student applicants</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Apply Modal */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
              <h3 className="text-base font-bold text-white">Apply to {selectedJob.companyName}</h3>
              <button onClick={() => setSelectedJob(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleApplySubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Resume / GitHub / Portfolio URL</label>
                <input
                  type="url"
                  value={resumeLink}
                  onChange={(e) => setResumeLink(e.target.value)}
                  placeholder="https://github.com/yourusername or drive link"
                  required
                  className="w-full bg-[#1E293B] border border-[#1E293B] rounded-xl p-3 text-white outline-none focus:border-brand"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Cover Note / Why you're a fit</label>
                <textarea
                  value={applicantNote}
                  onChange={(e) => setApplicantNote(e.target.value)}
                  rows={3}
                  placeholder="Highlight your relevant project experience..."
                  className="w-full bg-[#1E293B] border border-[#1E293B] rounded-xl p-3 text-white outline-none focus:border-brand resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedJob(null)}
                  className="px-4 py-2 rounded-xl font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={applying}
                  className="px-5 py-2.5 rounded-xl font-semibold bg-brand text-white shadow-md hover:bg-blue-600"
                >
                  {applying ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Post Job Modal */}
      {showPostJobModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-sky-400" /> Post Startup Opportunity
              </h3>
              <button onClick={() => setShowPostJobModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateJobSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Role Title</label>
                <input
                  type="text"
                  value={newJob.title}
                  onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                  placeholder="e.g. Lead AI Engineering Intern"
                  required
                  className="w-full bg-[#1E293B] border border-[#1E293B] rounded-xl p-3 text-white outline-none focus:border-brand"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Startup / Company Name</label>
                <input
                  type="text"
                  value={newJob.companyName}
                  onChange={(e) => setNewJob({ ...newJob, companyName: e.target.value })}
                  placeholder="e.g. AgriSense AI"
                  required
                  className="w-full bg-[#1E293B] border border-[#1E293B] rounded-xl p-3 text-white outline-none focus:border-brand"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Employment Type</label>
                  <select
                    value={newJob.type}
                    onChange={(e) => setNewJob({ ...newJob, type: e.target.value })}
                    className="w-full bg-[#1E293B] border border-[#1E293B] rounded-xl p-2.5 text-white outline-none focus:border-brand"
                  >
                    <option value="Internship">Internship</option>
                    <option value="Part-Time">Part-Time</option>
                    <option value="Full-Time">Full-Time</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Stipend / Equity</label>
                  <input
                    type="text"
                    value={newJob.stipend}
                    onChange={(e) => setNewJob({ ...newJob, stipend: e.target.value })}
                    placeholder="e.g. ₹15,000 / mo + Equity"
                    className="w-full bg-[#1E293B] border border-[#1E293B] rounded-xl p-2.5 text-white outline-none focus:border-brand"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Description & Responsibilities</label>
                <textarea
                  value={newJob.description}
                  onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                  rows={3}
                  placeholder="Outline key tasks..."
                  required
                  className="w-full bg-[#1E293B] border border-[#1E293B] rounded-xl p-3 text-white outline-none focus:border-brand resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPostJobModal(false)}
                  className="px-4 py-2 rounded-xl font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl font-semibold bg-brand text-white shadow-md hover:bg-blue-600"
                >
                  Publish Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
