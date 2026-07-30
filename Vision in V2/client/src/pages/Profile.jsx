import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { User, Mail, GraduationCap, Briefcase, Award, Globe, Linkedin, Github, Edit3, Save, Sparkles, FolderGit2 } from 'lucide-react';

export const Profile = () => {
  const { user, updateProfile } = useAuth();
  const { addToast } = useToast();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    headline: user?.headline || '',
    college: user?.college || '',
    role: user?.role || 'founder',
    skills: user?.skills ? user.skills.join(', ') : '',
    bio: user?.bio || '',
    startupName: user?.startupName || '',
    socials: {
      linkedin: user?.socials?.linkedin || '',
      github: user?.socials?.github || '',
      twitter: user?.socials?.twitter || '',
      website: user?.socials?.website || ''
    },
    portfolio: user?.portfolio ? user.portfolio.join(', ') : ''
  });

  const [saving, setSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    const result = await updateProfile(formData);
    setSaving(false);

    if (result.success) {
      addToast('Profile updated successfully!', 'success');
      setIsEditing(false);
    } else {
      addToast(result.message || 'Failed updating profile', 'error');
    }
  };

  if (!user) return null;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Profile Cover & Premium Header Card */}
      <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl overflow-hidden shadow-xl">
        
        {/* Cover Banner Container */}
        <div 
          className="h-36 sm:h-44 relative bg-cover bg-center"
          style={{ background: user.cover || 'linear-gradient(135deg, #1D4ED8 0%, #0F172A 100%)' }}
        >
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="absolute top-4 right-4 bg-[#0F172A]/80 hover:bg-[#0F172A] text-white text-xs font-semibold px-3.5 py-2 rounded-xl backdrop-blur-md border border-white/10 flex items-center gap-2 transition-all shadow-md z-20"
          >
            <Edit3 className="w-4 h-4 text-blue-400" /> {isEditing ? 'Cancel Editing' : 'Edit Profile'}
          </button>
        </div>

        <div className="px-6 sm:px-8 pb-8">
          
          {/* Avatar & Header Info Row (Guaranteed 100% visible, non-clipped z-index layering) */}
          <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between gap-4 -mt-14 sm:-mt-16 mb-6 text-center sm:text-left z-10 relative">
            
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-[#0F172A] bg-gradient-to-br from-[#3B82F6] to-[#1D4ED8] flex items-center justify-center text-white font-extrabold text-2xl sm:text-3xl shadow-2xl shrink-0 overflow-hidden">
              {user.avatar || 'VI'}
            </div>

            {user.startupName && (
              <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center gap-1.5 shadow-sm">
                <Award className="w-4 h-4 text-blue-400" /> {user.startupName}
              </span>
            )}

          </div>

          {!isEditing ? (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-extrabold text-white tracking-tight">{user.name}</h1>
                <p className="text-xs sm:text-sm text-slate-300 font-medium mt-1 leading-normal">{user.headline}</p>
                
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-400 mt-3 pt-3 border-t border-[#1E293B]">
                  <span className="flex items-center gap-1.5"><GraduationCap className="w-4 h-4 text-blue-400" /> {user.college}</span>
                  <span className="flex items-center gap-1.5"><Briefcase className="w-4 h-4 text-sky-400" /> {user.roleLabel || user.role}</span>
                  <span className="flex items-center gap-1.5"><Mail className="w-4 h-4 text-slate-500" /> {user.email}</span>
                </div>
              </div>

              {/* Bio Section */}
              <div className="bg-[#1E293B]/40 p-4 sm:p-5 rounded-xl border border-[#1E293B] space-y-1.5">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" /> About & Vision
                </h4>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">{user.bio || 'No bio added yet.'}</p>
              </div>

              {/* Skills Tags */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Skills & Tech Stack</h4>
                <div className="flex items-center gap-2 flex-wrap">
                  {user.skills?.map((skill, idx) => (
                    <span key={idx} className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-[#1E293B] border border-[#1E293B] text-slate-200 shadow-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Socials & Links */}
              <div className="pt-4 border-t border-[#1E293B] flex items-center gap-4 flex-wrap">
                {user.socials?.linkedin && (
                  <a href={user.socials.linkedin} target="_blank" rel="noreferrer" className="text-xs font-semibold text-blue-400 hover:underline flex items-center gap-1.5">
                    <Linkedin className="w-4 h-4" /> LinkedIn Profile
                  </a>
                )}
                {user.socials?.github && (
                  <a href={user.socials.github} target="_blank" rel="noreferrer" className="text-xs font-semibold text-slate-300 hover:underline flex items-center gap-1.5">
                    <Github className="w-4 h-4" /> GitHub Code Repos
                  </a>
                )}
              </div>
            </div>
          ) : (
            /* Editable Profile Form */
            <form onSubmit={handleSave} className="space-y-4 pt-2 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full bg-[#1E293B] border border-[#1E293B] rounded-xl p-3 text-white outline-none focus:border-brand"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Headline</label>
                  <input
                    type="text"
                    value={formData.headline}
                    onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                    className="w-full bg-[#1E293B] border border-[#1E293B] rounded-xl p-3 text-white outline-none focus:border-brand"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">College / University</label>
                  <input
                    type="text"
                    value={formData.college}
                    onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                    className="w-full bg-[#1E293B] border border-[#1E293B] rounded-xl p-3 text-white outline-none focus:border-brand"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Startup Name</label>
                  <input
                    type="text"
                    value={formData.startupName}
                    onChange={(e) => setFormData({ ...formData, startupName: e.target.value })}
                    className="w-full bg-[#1E293B] border border-[#1E293B] rounded-xl p-3 text-white outline-none focus:border-brand"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">About Bio</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows={3}
                  className="w-full bg-[#1E293B] border border-[#1E293B] rounded-xl p-3 text-white outline-none focus:border-brand resize-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Skills (Comma separated)</label>
                <input
                  type="text"
                  value={formData.skills}
                  onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                  placeholder="AI/ML, React, Python, Product Strategy"
                  className="w-full bg-[#1E293B] border border-[#1E293B] rounded-xl p-3 text-white outline-none focus:border-brand"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-xl font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 rounded-xl font-semibold bg-brand text-white shadow-md hover:bg-blue-600 flex items-center gap-2"
                >
                  <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Profile Changes'}
                </button>
              </div>
            </form>
          )}

        </div>
      </div>

    </div>
  );
};
