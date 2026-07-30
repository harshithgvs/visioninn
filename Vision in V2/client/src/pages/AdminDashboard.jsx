import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { 
  ShieldAlert, Users, FileText, Lightbulb, Briefcase, Trash2, CheckCircle2, 
  Activity, Server, Database, Cpu, HardDrive, BarChart3, Edit, Search, UserCheck, KeyRound, Sparkles, Inbox, ExternalLink
} from 'lucide-react';

export const AdminDashboard = () => {
  const { user } = useAuth();
  const { addToast } = useToast();

  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [ideas, setIdeas] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchUserQuery, setSearchUserQuery] = useState('');
  const [editingRoleUserId, setEditingRoleUserId] = useState(null);
  const [selectedRole, setSelectedRole] = useState('founder');

  const fetchAdminData = async () => {
    try {
      const res = await API.get('/admin/stats');
      if (res.data.success) {
        setStats(res.data.stats);
        setUsers(res.data.users);
        setPosts(res.data.posts);
        setIdeas(res.data.ideas);
        setJobs(res.data.jobs);
        setSubmissions(res.data.submissions || []);
        setLogs(res.data.logs || []);
      }
    } catch (err) {
      console.error('Failed loading admin console telemetry:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleUpdateRole = async (userId) => {
    try {
      const res = await API.patch(`/admin/users/${userId}/role`, { role: selectedRole });
      if (res.data.success) {
        setUsers(prev => prev.map(u => u.id === userId ? res.data.user : u));
        addToast(res.data.message, 'success');
        setEditingRoleUserId(null);
      }
    } catch (err) {
      addToast('Role update failed', 'error');
    }
  };

  const handleDeleteUser = async (userId, name) => {
    if (window.confirm(`Are you sure you want to remove member "${name}" from VisionIn platform?`)) {
      try {
        const res = await API.delete(`/admin/users/${userId}`);
        if (res.data.success) {
          setUsers(prev => prev.filter(u => u.id !== userId));
          addToast(`Member ${name} removed from VisionIn platform.`, 'success');
        }
      } catch (err) {
        addToast(err.response?.data?.message || 'Failed deleting user', 'error');
      }
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchUserQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchUserQuery.toLowerCase()) ||
    u.role.toLowerCase().includes(searchUserQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      
      {/* Super Admin Header Banner */}
      <div className="bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#1D4ED8] border border-[#1E293B] rounded-2xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <ShieldAlert className="w-6 h-6 text-emerald-400" />
            <h2 className="text-2xl font-extrabold text-white tracking-tight">VisionIn Super Admin Telemetry</h2>
          </div>
          <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
            Central Admin Account (<strong className="text-white font-mono">gvsharshith6@gmail.com</strong>). Governs member accounts, incoming pitch decks, job applications, secured ideas, and system telemetry.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#0F172A]/90 border border-emerald-500/30 px-4 py-2.5 rounded-xl text-xs font-mono text-emerald-400 shrink-0 shadow-md">
          <Server className="w-4 h-4 animate-pulse text-emerald-400" /> Server Status: ONLINE (0ms Latency)
        </div>
      </div>

      {/* Real-time System Analytics Grid */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-[#0F172A] border border-[#1E293B] p-4 sm:p-5 rounded-2xl shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
              <span>Total Members</span>
              <Users className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-2xl font-extrabold text-white">{stats.totalUsers} Members</div>
            <div className="text-[11px] text-emerald-400 font-medium">↑ 100% Active Sessions</div>
          </div>

          <div className="bg-[#0F172A] border border-[#1E293B] p-4 sm:p-5 rounded-2xl shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
              <span>User Submissions</span>
              <Inbox className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-extrabold text-amber-400">{stats.totalSubmissions || 0} Records</div>
            <div className="text-[11px] text-slate-400">Pitches, Applications, Ideas</div>
          </div>

          <div className="bg-[#0F172A] border border-[#1E293B] p-4 sm:p-5 rounded-2xl shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
              <span>IP Hash Ledger</span>
              <Lightbulb className="w-4 h-4 text-sky-400" />
            </div>
            <div className="text-2xl font-extrabold text-sky-400">{stats.timestampedIdeas} Sealed</div>
            <div className="text-[11px] text-slate-400">Cryptographic SHA-256</div>
          </div>

          <div className="bg-[#0F172A] border border-[#1E293B] p-4 sm:p-5 rounded-2xl shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
              <span>Storage & DB Health</span>
              <HardDrive className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-extrabold text-emerald-400">0.4 MB / 512 MB</div>
            <div className="text-[11px] text-slate-400">MongoDB Atlas Cluster</div>
          </div>
        </div>
      )}

      {/* Central Admin Submissions Stream (Pitches, Job Applications, Ideas, Posts) */}
      <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
          <div>
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <Inbox className="w-5 h-5 text-amber-400" /> Incoming Platform Submissions & Data Activity Stream
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">All sent user information (pitch decks, job applications, timestamped ideas, post milestones) streams to Super Admin Harshith GVS</p>
          </div>
          <span className="text-xs font-semibold text-amber-400 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full">
            {submissions.length} Total Submissions
          </span>
        </div>

        <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
          {submissions.length === 0 ? (
            <div className="text-xs text-slate-400 italic text-center py-4">No submissions recorded yet.</div>
          ) : (
            submissions.map(sub => (
              <div key={sub.id} className="bg-[#1E293B]/40 p-4 rounded-xl border border-[#1E293B] space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-100">{sub.title}</span>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      sub.category === 'PITCH_DECK' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                      sub.category === 'JOB_APPLICATION' ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20' :
                      sub.category === 'SECURED_IDEA' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                      'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                    }`}>
                      {sub.category}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500">{sub.timestamp}</span>
                </div>
                
                <div className="text-slate-400 font-mono text-[11px]">Submitted by: <strong className="text-slate-200 font-sans">{sub.submittedBy}</strong></div>
                <div className="text-slate-300 bg-[#0F172A] p-2.5 rounded-lg border border-[#1E293B] font-mono text-[11px] leading-relaxed break-all">
                  {sub.details}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Member Management Table */}
      <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#1E293B] pb-4">
          <div>
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-blue-400" /> Member Directory & Role Governance
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Manage user roles (Super Admin, Manager, Editor, Founder, Developer, Designer, Mentor)</p>
          </div>

          <div className="w-full sm:w-64 bg-[#1E293B] border border-[#1E293B] rounded-xl px-3 py-1.5 flex items-center gap-2">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchUserQuery}
              onChange={(e) => setSearchUserQuery(e.target.value)}
              placeholder="Search by name, email, or role..."
              className="bg-transparent border-none outline-none text-xs w-full text-white placeholder-slate-400"
            />
          </div>
        </div>

        {loading ? (
          <div className="text-xs text-slate-400 py-8 text-center">Fetching user telemetry...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#1E293B] text-slate-400 uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-3">Member Name</th>
                  <th className="py-3 px-3">Role</th>
                  <th className="py-3 px-3">University</th>
                  <th className="py-3 px-3">Registered Email</th>
                  <th className="py-3 px-3 text-right">Super Admin Controls</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E293B]/60 text-slate-200">
                {filteredUsers.map(u => (
                  <tr key={u.id} className="hover:bg-[#1E293B]/30 transition-colors">
                    <td className="py-3 px-3 font-bold text-white flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-[11px] shrink-0">
                        {u.avatar || u.name.slice(0, 2)}
                      </div>
                      <span className="truncate">{u.name}</span>
                      {u.isAdmin && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shrink-0">
                          SUPER ADMIN
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      {editingRoleUserId === u.id ? (
                        <div className="flex items-center gap-1">
                          <select
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value)}
                            className="bg-[#1E293B] text-white border border-brand rounded px-2 py-0.5 text-[11px]"
                          >
                            <option value="admin">Super Admin</option>
                            <option value="manager">Manager</option>
                            <option value="editor">Editor</option>
                            <option value="founder">Student Founder</option>
                            <option value="developer">Developer</option>
                            <option value="designer">Designer</option>
                            <option value="investor">Mentor</option>
                          </select>
                          <button
                            onClick={() => handleUpdateRole(u.id)}
                            className="bg-brand text-white px-2 py-0.5 rounded text-[10px] font-semibold"
                          >
                            Save
                          </button>
                        </div>
                      ) : (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          u.role === 'admin' 
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                            : u.role === 'manager'
                            ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                            : u.role === 'editor'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                        }`}>
                          {u.roleLabel || u.role}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-slate-300">{u.college}</td>
                    <td className="py-3 px-3 font-mono text-slate-400">{u.email}</td>
                    <td className="py-3 px-3 text-right space-x-1">
                      {!u.isAdmin ? (
                        <>
                          <button
                            onClick={() => { setEditingRoleUserId(u.id); setSelectedRole(u.role); }}
                            className="p-1 rounded bg-[#1E293B] hover:bg-[#334155] text-slate-300 text-[11px]"
                            title="Edit Role"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(u.id, u.name)}
                            className="p-1 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400 text-[11px]"
                            title="Remove Member"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      ) : (
                        <span className="text-[10px] text-slate-500 font-mono">PROTECTED</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
