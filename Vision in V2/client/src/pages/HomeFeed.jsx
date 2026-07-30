import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { 
  Compass, ShieldCheck, TrendingUp, Briefcase, Lightbulb, UserPlus, Scale, 
  ThumbsUp, MessageSquare, Bookmark, Share2, Globe, Lock, MoreHorizontal, Send, Plus, X 
} from 'lucide-react';

export const HomeFeed = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToast } = useToast();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Composer Modal state
  const [showComposer, setShowComposer] = useState(false);
  const [composerType, setComposerType] = useState('idea'); // 'idea', 'team', 'legal'
  const [postTitle, setPostTitle] = useState('');
  const [postBody, setPostBody] = useState('');
  const [roleTags, setRoleTags] = useState('');
  const [isSecureIdea, setIsSecureIdea] = useState(true);
  const [publishing, setPublishing] = useState(false);

  // Comment section toggle per post
  const [activeCommentsPostId, setActiveCommentsPostId] = useState(null);
  const [commentInput, setCommentInput] = useState('');

  const fetchPosts = async () => {
    try {
      const res = await API.get('/posts');
      if (res.data.success) {
        setPosts(res.data.posts);
      }
    } catch (err) {
      console.error('Error loading feed posts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleCreatePostSubmit = async (e) => {
    e.preventDefault();
    if (!postBody.trim()) {
      addToast('Please enter content for your post.', 'error');
      return;
    }

    setPublishing(true);
    try {
      const tagArray = roleTags ? roleTags.split(',').map(t => t.trim()) : [];
      const res = await API.post('/posts', {
        title: postTitle || `${user?.name}'s Update`,
        body: postBody,
        roleTags: tagArray,
        isSecureIdea,
        category: composerType === 'idea' ? 'Idea Vault' : composerType === 'team' ? 'Co-Founder Request' : 'Ecosystem Update'
      });

      if (res.data.success) {
        setPosts(prev => [res.data.post, ...prev]);
        addToast(res.data.message || 'Post published to ecosystem!', 'success');
        setShowComposer(false);
        setPostTitle('');
        setPostBody('');
        setRoleTags('');
      }
    } catch (err) {
      addToast('Failed to create post', 'error');
    } finally {
      setPublishing(false);
    }
  };

  const handleLike = async (postId) => {
    try {
      const res = await API.post(`/posts/${postId}/like`);
      if (res.data.success) {
        setPosts(prev => prev.map(p => p.id === postId ? res.data.post : p));
      }
    } catch (err) {
      addToast('Like action failed', 'error');
    }
  };

  const handleSave = async (postId) => {
    try {
      const res = await API.post(`/posts/${postId}/save`);
      if (res.data.success) {
        setPosts(prev => prev.map(p => p.id === postId ? res.data.post : p));
        addToast(res.data.isSaved ? 'Saved to your bookmarks!' : 'Removed from bookmarks', 'info');
      }
    } catch (err) {
      addToast('Save action failed', 'error');
    }
  };

  const handleAddComment = async (postId) => {
    if (!commentInput.trim()) return;
    try {
      const res = await API.post(`/posts/${postId}/comment`, { text: commentInput.trim() });
      if (res.data.success) {
        setPosts(prev => prev.map(p => p.id === postId ? res.data.post : p));
        setCommentInput('');
        addToast('Comment posted!', 'success');
      }
    } catch (err) {
      addToast('Comment failed', 'error');
    }
  };

  const handleShare = (post) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${window.location.origin}/post/${post.id}`);
      addToast('Post link copied to clipboard!', 'info');
    }
  };

  return (
    <div className="space-y-4">

      {/* Ecosystem Feature Hub Quick Access Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div 
          onClick={() => navigate('/learning')}
          className="bg-[#0F172A] border border-[#1E293B] hover:border-brand rounded-xl p-3.5 cursor-pointer transition-all hover:-translate-y-0.5 shadow-sm"
        >
          <div className="w-8 h-8 rounded-lg bg-blue-500/15 flex items-center justify-center text-brand mb-2">
            <Compass className="w-4 h-4" />
          </div>
          <div className="text-xs font-semibold text-white">Mentorship</div>
          <div className="text-[11px] text-slate-400 mt-0.5">1-on-1 sessions with experienced founders</div>
        </div>

        <div 
          onClick={() => navigate('/idea-vault')}
          className="bg-[#0F172A] border border-[#1E293B] hover:border-brand rounded-xl p-3.5 cursor-pointer transition-all hover:-translate-y-0.5 shadow-sm"
        >
          <div className="w-8 h-8 rounded-lg bg-amber-500/15 flex items-center justify-center text-amber-400 mb-2">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="text-xs font-semibold text-white">Idea Protection & IP</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Secure timestamps & NDA resources</div>
        </div>

        <div 
          onClick={() => navigate('/funding')}
          className="bg-[#0F172A] border border-[#1E293B] hover:border-brand rounded-xl p-3.5 cursor-pointer transition-all hover:-translate-y-0.5 shadow-sm"
        >
          <div className="w-8 h-8 rounded-lg bg-emerald-500/15 flex items-center justify-center text-emerald-400 mb-2">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div className="text-xs font-semibold text-white">Funding & Incubators</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Connect with angel investors & accelerators</div>
        </div>

        <div 
          onClick={() => navigate('/jobs')}
          className="bg-[#0F172A] border border-[#1E293B] hover:border-brand rounded-xl p-3.5 cursor-pointer transition-all hover:-translate-y-0.5 shadow-sm"
        >
          <div className="w-8 h-8 rounded-lg bg-sky-500/15 flex items-center justify-center text-sky-400 mb-2">
            <Briefcase className="w-4 h-4" />
          </div>
          <div className="text-xs font-semibold text-white">Startup Careers</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Internships & equity roles in early-stage startups</div>
        </div>
      </div>

      {/* Composer Input Trigger Card */}
      <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#3B82F6] to-[#1D4ED8] flex items-center justify-center text-white font-bold text-sm shrink-0">
            {user?.avatar || 'VI'}
          </div>
          <input
            type="text"
            readOnly
            onClick={() => { setComposerType('idea'); setShowComposer(true); }}
            placeholder="Share a startup idea, request a co-founder, or log a milestone..."
            className="flex-1 bg-[#1E293B] hover:bg-[#334155] border border-[#1E293B] rounded-full px-4 py-3 text-slate-400 hover:text-white text-xs font-medium cursor-pointer transition-colors outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 mt-3 pt-2 border-t border-[#1E293B]">
          <button
            onClick={() => { setComposerType('idea'); setShowComposer(true); }}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-[#1E293B] text-xs font-semibold transition-colors"
          >
            <Lightbulb className="w-4 h-4 text-amber-400" /> Post Idea (Secured)
          </button>
          <button
            onClick={() => { setComposerType('team'); setShowComposer(true); }}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-[#1E293B] text-xs font-semibold transition-colors"
          >
            <UserPlus className="w-4 h-4 text-blue-400" /> Find Co-Founder
          </button>
          <button
            onClick={() => navigate('/legal')}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-[#1E293B] text-xs font-semibold transition-colors"
          >
            <Scale className="w-4 h-4 text-sky-400" /> Legal Guidance
          </button>
        </div>
      </div>

      {/* Posts List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2].map(n => (
            <div key={n} className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-4 animate-pulse space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#1E293B]"></div>
                <div className="space-y-1.5 flex-1">
                  <div className="h-3 w-1/3 bg-[#1E293B] rounded"></div>
                  <div className="h-2 w-1/2 bg-[#1E293B] rounded"></div>
                </div>
              </div>
              <div className="h-12 bg-[#1E293B] rounded"></div>
            </div>
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-8 text-center text-slate-400 text-xs">
          No posts yet. Be the first to share an idea or startup opportunity!
        </div>
      ) : (
        posts.map(post => {
          const isLiked = user && post.likes?.includes(user.id);
          const isSaved = user && post.savedBy?.includes(user.id);

          return (
            <article key={post.id} className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-4 shadow-sm space-y-3">
              
              {/* Post Header */}
              <div className="flex items-start gap-3">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#1D4ED8] to-[#0F172A] flex items-center justify-center text-white font-bold text-sm shrink-0 border border-blue-500/20">
                  {post.authorAvatar || 'VI'}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-sm text-slate-100">{post.authorName}</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-500/15 text-blue-400 border border-blue-500/20">
                      {post.authorRole || 'Founder'}
                    </span>
                    {post.isSecureIdea && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">
                        <Lock className="w-2.5 h-2.5" /> {post.timestampBadge || 'Timestamped'}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">{post.headline}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
                    <span>{post.createdAt}</span> · <Globe className="w-2.5 h-2.5 inline" /> Public Summary
                  </div>
                </div>

                <button className="text-slate-500 hover:text-white">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>

              {/* Post Content */}
              <div className="text-xs leading-relaxed text-slate-200 whitespace-pre-line pt-1">
                {post.body}
              </div>

              {/* Role / Tech Tags */}
              {post.roleTags && post.roleTags.length > 0 && (
                <div className="flex items-center gap-1.5 flex-wrap pt-1">
                  {post.roleTags.map((tag, idx) => (
                    <span key={idx} className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-[#1E293B] border border-[#1E293B] text-slate-300">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Engagement Stats */}
              <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-[#1E293B]">
                <div>👍 {post.likeCount || 0} supporters · {post.comments?.length || 0} discussions</div>
                <span className="text-[11px] text-slate-500">incubator-track</span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center border-t border-[#1E293B] pt-1">
                <button
                  onClick={() => handleLike(post.id)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-lg transition-colors ${
                    isLiked ? 'text-blue-400 bg-blue-500/10' : 'text-slate-400 hover:text-white hover:bg-[#1E293B]'
                  }`}
                >
                  <ThumbsUp className="w-4 h-4" /> {isLiked ? 'Supported' : 'Support'}
                </button>

                <button
                  onClick={() => setActiveCommentsPostId(activeCommentsPostId === post.id ? null : post.id)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-slate-400 hover:text-white hover:bg-[#1E293B] rounded-lg transition-colors"
                >
                  <MessageSquare className="w-4 h-4" /> Discuss ({post.comments?.length || 0})
                </button>

                <button
                  onClick={() => navigate('/co-founders')}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-brand hover:bg-[#1E293B] rounded-lg transition-colors"
                >
                  <UserPlus className="w-4 h-4" /> Join Team
                </button>

                <button
                  onClick={() => handleSave(post.id)}
                  className={`p-2 rounded-lg text-slate-400 hover:text-white hover:bg-[#1E293B] ${isSaved ? 'text-amber-400' : ''}`}
                >
                  <Bookmark className="w-4 h-4" />
                </button>
              </div>

              {/* Comments Section Drawer */}
              {activeCommentsPostId === post.id && (
                <div className="pt-3 border-t border-[#1E293B] space-y-3">
                  
                  {/* Existing Comments */}
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {post.comments?.length === 0 ? (
                      <div className="text-[11px] text-slate-500 italic text-center py-2">No discussions yet. Start the conversation!</div>
                    ) : (
                      post.comments?.map(comment => (
                        <div key={comment.id} className="bg-[#1E293B]/50 p-2.5 rounded-lg text-xs space-y-1">
                          <div className="flex items-center justify-between font-semibold text-slate-200">
                            <span>{comment.authorName}</span>
                            <span className="text-[10px] text-slate-500">{comment.createdAt}</span>
                          </div>
                          <p className="text-slate-300 text-[11px]">{comment.text}</p>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Add Comment Input */}
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={commentInput}
                      onChange={(e) => setCommentInput(e.target.value)}
                      placeholder="Write a constructive response..."
                      onKeyDown={(e) => e.key === 'Enter' && handleAddComment(post.id)}
                      className="flex-1 bg-[#1E293B] border border-[#1E293B] focus:border-brand rounded-lg px-3 py-1.5 text-xs text-white outline-none"
                    />
                    <button
                      onClick={() => handleAddComment(post.id)}
                      className="p-2 bg-brand text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

            </article>
          );
        })
      )}

      {/* Post Creator Modal */}
      {showComposer && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            
            <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                {composerType === 'idea' ? <Lightbulb className="w-5 h-5 text-amber-400" /> : <UserPlus className="w-5 h-5 text-blue-400" />}
                {composerType === 'idea' ? 'Publish & Timestamp Startup Idea' : 'Post Co-Founder Opportunity'}
              </h3>
              <button onClick={() => setShowComposer(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePostSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Project / Post Title</label>
                <input
                  type="text"
                  value={postTitle}
                  onChange={(e) => setPostTitle(e.target.value)}
                  placeholder="e.g. GreenCart - Hyperlocal Farm Produce Marketplace"
                  required
                  className="w-full bg-[#1E293B] border border-[#1E293B] rounded-xl p-3 text-xs text-white outline-none focus:border-brand"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Detailed Overview</label>
                <textarea
                  value={postBody}
                  onChange={(e) => setPostBody(e.target.value)}
                  rows={4}
                  placeholder="Describe your MVP progress, traction, problem solved, or co-founder requirements..."
                  required
                  className="w-full bg-[#1E293B] border border-[#1E293B] rounded-xl p-3 text-xs text-white outline-none focus:border-brand resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Roles / Tech Stack Needed (Comma separated)</label>
                <input
                  type="text"
                  value={roleTags}
                  onChange={(e) => setRoleTags(e.target.value)}
                  placeholder="Flutter Developer, UI/UX Designer, AI Engineer"
                  className="w-full bg-[#1E293B] border border-[#1E293B] rounded-xl p-3 text-xs text-white outline-none focus:border-brand"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-[#1E293B]/60 border border-[#1E293B]">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-sky-400" />
                  <div>
                    <div className="text-xs font-semibold text-white">Generate Cryptographic IP Timestamp</div>
                    <div className="text-[10px] text-slate-400">Protects your priority of creation on VisionIn IP Ledger</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={isSecureIdea}
                  onChange={(e) => setIsSecureIdea(e.target.checked)}
                  className="accent-brand w-4 h-4 cursor-pointer"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowComposer(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={publishing}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md hover:brightness-110"
                >
                  {publishing ? 'Publishing...' : 'Publish to Ecosystem'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
