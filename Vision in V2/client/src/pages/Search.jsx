import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { Search as SearchIcon, Users, Lightbulb, Briefcase, FileText } from 'lucide-react';

export const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('all');
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [ideas, setIdeas] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query) return;
      setLoading(true);
      try {
        const [uRes, pRes, iRes, jRes] = await Promise.all([
          API.get(`/users?search=${encodeURIComponent(query)}`),
          API.get(`/posts?search=${encodeURIComponent(query)}`),
          API.get(`/ideas?search=${encodeURIComponent(query)}`),
          API.get(`/jobs?search=${encodeURIComponent(query)}`)
        ]);

        if (uRes.data.success) setUsers(uRes.data.users);
        if (pRes.data.success) setPosts(pRes.data.posts);
        if (iRes.data.success) setIdeas(iRes.data.ideas);
        if (jRes.data.success) setJobs(jRes.data.jobs);
      } catch (err) {
        console.error('Search failed:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]);

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-5 shadow-sm">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <SearchIcon className="w-5 h-5 text-brand" /> Search Results for "{query}"
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Showing matched profiles, feed posts, secured ideas, and startup job opportunities.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 bg-[#0F172A] border border-[#1E293B] rounded-xl p-2">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
            activeTab === 'all' ? 'bg-brand text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          All Results
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
            activeTab === 'users' ? 'bg-brand text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          People ({users.length})
        </button>
        <button
          onClick={() => setActiveTab('posts')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
            activeTab === 'posts' ? 'bg-brand text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          Posts ({posts.length})
        </button>
        <button
          onClick={() => setActiveTab('ideas')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
            activeTab === 'ideas' ? 'bg-brand text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          Ideas ({ideas.length})
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="text-center py-8 text-xs text-slate-400">Searching ecosystem database...</div>
      ) : (
        <div className="space-y-4">
          
          {/* Users Section */}
          {(activeTab === 'all' || activeTab === 'users') && users.length > 0 && (
            <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-4 space-y-3">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-4 h-4 text-blue-400" /> Matching Candidates
              </h3>
              <div className="divide-y divide-[#1E293B]">
                {users.map(u => (
                  <div key={u.id} className="py-2.5 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-white">{u.name}</div>
                      <div className="text-[11px] text-slate-400">{u.headline}</div>
                    </div>
                    <button
                      onClick={() => navigate('/co-founders')}
                      className="text-xs font-semibold text-brand hover:underline"
                    >
                      View Profile
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Posts Section */}
          {(activeTab === 'all' || activeTab === 'posts') && posts.length > 0 && (
            <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-4 space-y-3">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-amber-400" /> Matching Feed Posts
              </h3>
              <div className="space-y-2">
                {posts.map(p => (
                  <div key={p.id} className="bg-[#1E293B]/40 p-3 rounded-lg border border-[#1E293B] text-xs">
                    <div className="font-semibold text-white">{p.title || p.authorName}</div>
                    <div className="text-slate-300 mt-1 line-clamp-2">{p.body}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
};
