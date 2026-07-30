import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Home, Lightbulb, Users, Compass, FileText, DollarSign, Edit3, Award 
} from 'lucide-react';

export const LeftSidebar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  return (
    <aside className="sticky top-[84px] flex flex-col gap-4">
      {/* User Profile Summary Card */}
      <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl overflow-hidden shadow-md">
        
        {/* Cover Banner */}
        <div 
          className="h-16"
          style={{ background: user.cover || 'linear-gradient(120deg, #1D4ED8, #0F172A)' }}
        ></div>

        {/* Profile Avatar */}
        <div 
          onClick={() => navigate('/profile/me')}
          className="w-[68px] h-[68px] rounded-full -mt-8 mx-auto bg-gradient-to-br from-[#3B82F6] to-[#1D4ED8] border-4 border-[#0F172A] flex items-center justify-center text-white font-bold text-xl cursor-pointer hover:scale-105 transition-transform"
        >
          {user.avatar || 'VI'}
        </div>

        {/* User Profile Information */}
        <div className="p-3 text-center">
          <div 
            onClick={() => navigate('/profile/me')}
            className="font-semibold text-sm text-slate-100 cursor-pointer hover:text-blue-400 transition-colors"
          >
            {user.name}
          </div>
          <div className="text-xs text-slate-400 mt-1 leading-snug">
            {user.headline || `${user.roleLabel || 'Member'} @ ${user.college}`}
          </div>
          {user.startupName && (
            <div className="inline-flex items-center gap-1 mt-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Award className="w-3 h-3" /> {user.startupName}
            </div>
          )}
        </div>

        <div className="border-t border-[#1E293B]"></div>

        {/* Side Navigation Menu Links */}
        <nav className="py-2 flex flex-col">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-4 py-2 text-xs font-medium transition-all ${
                isActive
                  ? 'text-brand bg-[#1E293B] border-l-[3px] border-brand pl-3 font-semibold'
                  : 'text-slate-400 hover:bg-[#1E293B] hover:text-slate-100'
              }`
            }
          >
            <Home className="w-4 h-4 text-slate-400" />
            Ecosystem Feed
          </NavLink>

          <NavLink
            to="/idea-vault"
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-4 py-2 text-xs font-medium transition-all ${
                isActive
                  ? 'text-brand bg-[#1E293B] border-l-[3px] border-brand pl-3 font-semibold'
                  : 'text-slate-400 hover:bg-[#1E293B] hover:text-slate-100'
              }`
            }
          >
            <Lightbulb className="w-4 h-4 text-amber-400" />
            My Idea Vault (Secure)
          </NavLink>

          <NavLink
            to="/co-founders"
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-4 py-2 text-xs font-medium transition-all ${
                isActive
                  ? 'text-brand bg-[#1E293B] border-l-[3px] border-brand pl-3 font-semibold'
                  : 'text-slate-400 hover:bg-[#1E293B] hover:text-slate-100'
              }`
            }
          >
            <Users className="w-4 h-4 text-blue-400" />
            Team Matcher
          </NavLink>

          <NavLink
            to="/learning"
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-4 py-2 text-xs font-medium transition-all ${
                isActive
                  ? 'text-brand bg-[#1E293B] border-l-[3px] border-brand pl-3 font-semibold'
                  : 'text-slate-400 hover:bg-[#1E293B] hover:text-slate-100'
              }`
            }
          >
            <Compass className="w-4 h-4 text-slate-400" />
            Mentorship Roadmaps
          </NavLink>

          <NavLink
            to="/legal"
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-4 py-2 text-xs font-medium transition-all ${
                isActive
                  ? 'text-brand bg-[#1E293B] border-l-[3px] border-brand pl-3 font-semibold'
                  : 'text-slate-400 hover:bg-[#1E293B] hover:text-slate-100'
              }`
            }
          >
            <FileText className="w-4 h-4 text-sky-400" />
            Legal Resources / NDA
          </NavLink>

          <NavLink
            to="/funding"
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-4 py-2 text-xs font-medium transition-all ${
                isActive
                  ? 'text-brand bg-[#1E293B] border-l-[3px] border-brand pl-3 font-semibold'
                  : 'text-slate-400 hover:bg-[#1E293B] hover:text-slate-100'
              }`
            }
          >
            <DollarSign className="w-4 h-4 text-emerald-400" />
            Investor Showcase
          </NavLink>
        </nav>

        <div className="border-t border-[#1E293B] p-3 text-center">
          <button
            onClick={() => navigate('/profile/me')}
            className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-[#1E293B] hover:bg-[#334155] text-xs font-medium text-slate-200 transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5 text-blue-400" /> Edit Profile
          </button>
        </div>
      </div>
    </aside>
  );
};
