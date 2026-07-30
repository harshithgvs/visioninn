import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import { UserPlus, Sparkles, BookOpen, Check } from 'lucide-react';

export const RightSidebar = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [connectedMap, setConnectedMap] = useState({});

  const recommendations = [
    {
      id: "user-3",
      name: "Neha Verma",
      sub: "UI/UX Designer · 3 MVPs shipped",
      avatar: "NV",
      bg: "linear-gradient(135deg, #1D4ED8, #0F172A)"
    },
    {
      id: "user-4",
      name: "Tarun Reddy",
      sub: "Full-Stack Developer · Node & React",
      avatar: "TR",
      bg: "linear-gradient(135deg, #3B82F6, #1D4ED8)"
    }
  ];

  const handleConnect = (rec) => {
    setConnectedMap(prev => ({ ...prev, [rec.id]: true }));
    addToast(`Connection request sent to ${rec.name}!`, 'success');
  };

  return (
    <aside className="sticky top-[84px] flex flex-col gap-4">
      {/* Recommended Co-Founders Card */}
      <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl overflow-hidden shadow-md">
        <div className="p-3.5 px-4 flex items-center justify-between border-b border-[#1E293B]">
          <h4 className="font-semibold text-xs text-white flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" /> Recommended Co-Founders
          </h4>
          <span 
            onClick={() => navigate('/co-founders')}
            className="text-[11px] font-semibold text-brand hover:underline cursor-pointer"
          >
            See all
          </span>
        </div>

        <div className="divide-y divide-[#1E293B]/50">
          {recommendations.map(rec => (
            <div key={rec.id} className="p-3 px-4 flex items-center gap-3 hover:bg-[#1E293B]/40 transition-colors">
              <div 
                style={{ background: rec.bg }}
                className="w-[38px] h-[38px] rounded-lg flex items-center justify-center text-white font-semibold text-xs shrink-0 shadow-sm"
              >
                {rec.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div 
                  onClick={() => navigate(`/profile/${rec.id}`)}
                  className="text-xs font-semibold text-slate-100 truncate cursor-pointer hover:text-blue-400 transition-colors"
                >
                  {rec.name}
                </div>
                <div className="text-[11px] text-slate-400 truncate mt-0.5">{rec.sub}</div>
              </div>
              
              <button
                onClick={() => handleConnect(rec)}
                disabled={connectedMap[rec.id]}
                className={`text-xs font-semibold px-2.5 py-1 rounded-full border transition-all shrink-0 ${
                  connectedMap[rec.id]
                    ? 'bg-blue-500/10 border-blue-500/30 text-blue-400 cursor-default'
                    : 'text-brand border-brand hover:bg-brand/15'
                }`}
              >
                {connectedMap[rec.id] ? (
                  <span className="flex items-center gap-1"><Check className="w-3 h-3" /> Sent</span>
                ) : (
                  'Connect'
                )}
              </button>
            </div>
          ))}
        </div>

        <div 
          onClick={() => navigate('/co-founders')}
          className="p-2.5 text-center border-t border-[#1E293B] text-xs font-semibold text-slate-400 hover:text-white cursor-pointer transition-colors"
        >
          Explore Talent Pool
        </div>
      </div>

      {/* Startup Success Stories Card */}
      <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl overflow-hidden shadow-md">
        <div className="p-3.5 px-4 border-b border-[#1E293B]">
          <h4 className="font-semibold text-xs text-white flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-emerald-400" /> Startup Success Stories
          </h4>
        </div>
        <div className="p-4 text-xs text-slate-400 leading-relaxed">
          <strong className="text-slate-100 block mb-1 font-semibold">
            From College Project to Seed Funding
          </strong>
          Read how CampusEat scaled from a student dormitory room to securing regional angel investment.
          <div 
            onClick={() => navigate('/learning')}
            className="mt-2.5 text-brand hover:underline font-semibold cursor-pointer text-[11px]"
          >
            Read Full Case Study →
          </div>
        </div>
      </div>
    </aside>
  );
};
