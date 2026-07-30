import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Search, Home, Users, Compass, ShieldCheck, TrendingUp, Briefcase, LogOut, User, Settings, ShieldAlert
} from 'lucide-react';

export const TopNav = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[#0F172A] border-b border-[#1E293B] shadow-lg">
      <nav className="max-w-[1128px] mx-auto px-6 h-[60px] flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <div 
          onClick={() => navigate('/')}
          className="flex items-center gap-2.5 cursor-pointer shrink-0 group"
        >
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#3B82F6] to-[#1D4ED8] flex items-center justify-center font-bold text-base text-white shadow-md shadow-blue-500/30 group-hover:scale-105 transition-transform">
            VI
          </div>
          <div className="text-xl font-bold text-white tracking-wider logo-glow">
            Vision<span className="text-[23px] text-[#93C5FD] font-extrabold highlight-glow">In</span>
          </div>
        </div>

        {/* Global Instant Search */}
        <div className="hidden sm:flex items-center gap-2 bg-[#1E293B] rounded-lg px-3.5 py-2 w-64 focus-within:w-72 focus-within:bg-[#0F172A] focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/20 border border-transparent transition-all">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearchSubmit}
            placeholder="Search ideas, co-founders, jobs..."
            className="bg-transparent border-none outline-none text-xs w-full text-slate-100 placeholder-slate-400"
          />
        </div>

        {/* Navigation Icon Tabs */}
        <div className="flex items-center ml-auto h-full gap-1 sm:gap-2">
          
          <NavLink 
            to="/" 
            end 
            className={({ isActive }) => 
              `flex flex-col items-center justify-center gap-1 px-3 h-full text-[11px] font-medium transition-all relative ${
                isActive ? 'text-brand border-b-2 border-brand font-semibold' : 'text-slate-400 hover:text-white'
              }`
            }
          >
            <Home className="w-5 h-5" />
            <span className="hidden md:inline">Feed</span>
          </NavLink>

          <NavLink 
            to="/co-founders" 
            className={({ isActive }) => 
              `flex flex-col items-center justify-center gap-1 px-3 h-full text-[11px] font-medium transition-all relative ${
                isActive ? 'text-brand border-b-2 border-brand font-semibold' : 'text-slate-400 hover:text-white'
              }`
            }
          >
            <Users className="w-5 h-5" />
            <span className="hidden md:inline">Co-Founders</span>
          </NavLink>

          <NavLink 
            to="/learning" 
            className={({ isActive }) => 
              `flex flex-col items-center justify-center gap-1 px-3 h-full text-[11px] font-medium transition-all relative ${
                isActive ? 'text-brand border-b-2 border-brand font-semibold' : 'text-slate-400 hover:text-white'
              }`
            }
          >
            <Compass className="w-5 h-5" />
            <span className="hidden lg:inline">Mentorship</span>
          </NavLink>

          <NavLink 
            to="/legal" 
            className={({ isActive }) => 
              `flex flex-col items-center justify-center gap-1 px-3 h-full text-[11px] font-medium transition-all relative ${
                isActive ? 'text-brand border-b-2 border-brand font-semibold' : 'text-slate-400 hover:text-white'
              }`
            }
          >
            <ShieldCheck className="w-5 h-5" />
            <span className="hidden lg:inline">Legal & IP</span>
          </NavLink>

          <NavLink 
            to="/funding" 
            className={({ isActive }) => 
              `flex flex-col items-center justify-center gap-1 px-3 h-full text-[11px] font-medium transition-all relative ${
                isActive ? 'text-brand border-b-2 border-brand font-semibold' : 'text-slate-400 hover:text-white'
              }`
            }
          >
            <TrendingUp className="w-5 h-5" />
            <span className="hidden lg:inline">Funding</span>
          </NavLink>

          <NavLink 
            to="/jobs" 
            className={({ isActive }) => 
              `flex flex-col items-center justify-center gap-1 px-3 h-full text-[11px] font-medium transition-all relative ${
                isActive ? 'text-brand border-b-2 border-brand font-semibold' : 'text-slate-400 hover:text-white'
              }`
            }
          >
            <Briefcase className="w-5 h-5" />
            <span className="hidden lg:inline">Jobs</span>
          </NavLink>

          <div className="w-[1px] h-6 bg-[#1E293B] mx-1"></div>

          {/* User Profile Dropdown */}
          {user ? (
            <div className="relative">
              <button 
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex flex-col items-center justify-center gap-1 px-2 text-[11px] font-medium text-slate-400 hover:text-white"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#3B82F6] to-[#1D4ED8] flex items-center justify-center text-white text-xs font-bold border border-blue-500/30">
                  {user.avatar || 'VI'}
                </div>
                <span className="text-[10px]">Me</span>
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-[#0F172A] border border-[#1E293B] rounded-xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 py-3 border-b border-[#1E293B]">
                    <p className="text-xs font-bold text-white truncate">{user.name}</p>
                    <p className="text-[11px] text-slate-400 truncate">{user.headline || user.email}</p>
                  </div>

                  <button 
                    onClick={() => { navigate('/profile/me'); setShowProfileMenu(false); }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-slate-300 hover:bg-[#1E293B] hover:text-white transition-colors"
                  >
                    <User className="w-4 h-4 text-blue-400" /> View Profile
                  </button>

                  <button 
                    onClick={() => { navigate('/idea-vault'); setShowProfileMenu(false); }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-slate-300 hover:bg-[#1E293B] hover:text-white transition-colors"
                  >
                    <ShieldCheck className="w-4 h-4 text-amber-400" /> My Idea Vault
                  </button>

                  {user.isAdmin && (
                    <button 
                      onClick={() => { navigate('/admin'); setShowProfileMenu(false); }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-emerald-400 hover:bg-[#1E293B] transition-colors"
                    >
                      <ShieldAlert className="w-4 h-4" /> Admin Console
                    </button>
                  )}

                  <div className="border-t border-[#1E293B] my-1"></div>

                  <button 
                    onClick={() => { logout(); navigate('/login'); setShowProfileMenu(false); }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-red-400 hover:bg-[#1E293B] transition-colors"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white text-xs font-semibold px-4 py-1.5 rounded-lg shadow-md hover:brightness-110 transition-all"
            >
              Sign In
            </button>
          )}

        </div>
      </nav>
    </header>
  );
};
