import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Users, Search, Filter, UserPlus, Check, Award, Briefcase, GraduationCap, ExternalLink, X } from 'lucide-react';

export const CoFounders = () => {
  const { user } = useAuth();
  const { addToast } = useToast();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [roleFilter, setRoleFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [collegeFilter, setCollegeFilter] = useState('');

  // Connection Request modal/state
  const [selectedUser, setSelectedUser] = useState(null);
  const [connectMessage, setConnectMessage] = useState('');
  const [connectStatusMap, setConnectStatusMap] = useState({});

  const fetchUsers = async () => {
    try {
      let url = `/users?role=${roleFilter}`;
      if (searchQuery) url += `&search=${encodeURIComponent(searchQuery)}`;
      if (collegeFilter) url += `&college=${encodeURIComponent(collegeFilter)}`;
      
      const res = await API.get(url);
      if (res.data.success) {
        // Exclude current user from candidate list
        setUsers(res.data.users.filter(u => u.id !== user?.id));
      }
    } catch (err) {
      console.error('Failed fetching talent pool:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter, collegeFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchUsers();
  };

  const handleSendConnection = async () => {
    if (!selectedUser) return;
    try {
      const res = await API.post('/users/connect', {
        recipientId: selectedUser.id,
        message: connectMessage || 'Would love to connect and discuss building a startup together!'
      });

      if (res.data.success) {
        setConnectStatusMap(prev => ({ ...prev, [selectedUser.id]: true }));
        addToast(res.data.message || `Request sent to ${selectedUser.name}!`, 'success');
        setSelectedUser(null);
        setConnectMessage('');
      }
    } catch (err) {
      addToast('Connection request failed', 'error');
    }
  };

  return (
    <div className="space-y-4">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#1D4ED8] border border-[#1E293B] rounded-2xl p-6 shadow-md">
        <div className="flex items-center gap-2 mb-1">
          <Users className="w-5 h-5 text-blue-400" />
          <h2 className="text-xl font-bold text-white tracking-tight">Co-Founder & Talent Matcher</h2>
        </div>
        <p className="text-slate-300 text-xs max-w-xl leading-relaxed">
          Discover skilled student engineers, UI/UX designers, and business operators across premier university campuses looking for technical or non-technical co-founders.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-4 shadow-sm space-y-3">
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
          <div className="flex-1 bg-[#1E293B] border border-[#1E293B] focus-within:border-brand rounded-xl px-3 py-2 flex items-center gap-2">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, skill (e.g. React, Flutter, Figma)..."
              className="bg-transparent border-none outline-none text-xs w-full text-white placeholder-slate-400"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-brand hover:bg-blue-600 text-white text-xs font-semibold rounded-xl transition-colors shrink-0"
          >
            Find Talent
          </button>
        </form>

        {/* Role Quick Filter Tabs */}
        <div className="flex items-center gap-1.5 flex-wrap pt-1">
          <span className="text-[11px] text-slate-400 font-semibold mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Focus:
          </span>
          {[
            { id: 'all', label: 'All Roles' },
            { id: 'founder', label: 'Student Founders' },
            { id: 'developer', label: 'Developers / Engineers' },
            { id: 'designer', label: 'UI/UX Designers' },
            { id: 'investor', label: 'Mentors / Incubators' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setRoleFilter(tab.id)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                roleFilter === tab.id
                  ? 'bg-brand text-white font-semibold shadow-sm'
                  : 'bg-[#1E293B] text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Talent Cards Grid */}
      {loading ? (
        <div className="text-center py-8 text-xs text-slate-400">Searching matching candidates...</div>
      ) : users.length === 0 ? (
        <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-8 text-center text-slate-400 text-xs">
          No matching co-founders found for your current filter query.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {users.map(candidate => {
            const isConnected = connectStatusMap[candidate.id];

            return (
              <div key={candidate.id} className="bg-[#0F172A] border border-[#1E293B] hover:border-brand/60 rounded-xl p-5 shadow-sm flex flex-col justify-between space-y-4 transition-all">
                
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div 
                      style={{ background: candidate.cover || 'linear-gradient(135deg, #1D4ED8, #0F172A)' }}
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-base shrink-0 shadow-md"
                    >
                      {candidate.avatar || 'VI'}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-sm text-white truncate">{candidate.name}</h3>
                      <div className="text-xs text-slate-400 truncate mt-0.5">{candidate.headline}</div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
                        <span className="flex items-center gap-1"><GraduationCap className="w-3 h-3 text-blue-400" /> {candidate.college}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                    {candidate.bio || 'Building innovative products and looking for passionate team members.'}
                  </p>

                  {/* Skills tags */}
                  {candidate.skills && candidate.skills.length > 0 && (
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {candidate.skills.map((skill, idx) => (
                        <span key={idx} className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#1E293B] border border-[#1E293B] text-slate-300">
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 pt-3 border-t border-[#1E293B]">
                  <button
                    onClick={() => setSelectedUser(candidate)}
                    disabled={isConnected}
                    className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                      isConnected
                        ? 'bg-blue-500/10 border border-blue-500/30 text-blue-400 cursor-default'
                        : 'bg-brand hover:bg-blue-600 text-white shadow-md'
                    }`}
                  >
                    {isConnected ? (
                      <span className="flex items-center gap-1"><Check className="w-3.5 h-3.5" /> Request Sent</span>
                    ) : (
                      <span className="flex items-center gap-1"><UserPlus className="w-3.5 h-3.5" /> Connect</span>
                    )}
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Connect Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            
            <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-blue-400" /> Connect with {selectedUser.name}
              </h3>
              <button onClick={() => setSelectedUser(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs text-slate-300 space-y-2">
              <p>Add a personalized message introducing your startup concept or skills:</p>
              <textarea
                value={connectMessage}
                onChange={(e) => setConnectMessage(e.target.value)}
                rows={4}
                placeholder="Hi! I saw your profile on VisionIn and loved your work in UI/UX design. I'm building AgriSense AI and would love to connect..."
                className="w-full bg-[#1E293B] border border-[#1E293B] rounded-xl p-3 text-xs text-white outline-none focus:border-brand resize-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedUser(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleSendConnection}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-brand text-white shadow-md hover:bg-blue-600"
              >
                Send Request
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
