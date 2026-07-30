import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, AlertCircle } from 'lucide-react';

export const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 space-y-4">
      <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-brand shadow-lg">
        <AlertCircle className="w-8 h-8" />
      </div>
      
      <div>
        <h1 className="text-3xl font-extrabold text-white">404 - Page Not Found</h1>
        <p className="text-slate-400 text-xs mt-1 max-w-sm">
          The requested VisionIn page or resource could not be located in our ecosystem directory.
        </p>
      </div>

      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-2 bg-gradient-to-r from-[#3B82F6] to-[#1D4ED8] hover:opacity-95 text-white font-semibold text-xs px-5 py-2.5 rounded-xl shadow-md transition-all"
      >
        <Home className="w-4 h-4" /> Return to Ecosystem Feed
      </button>
    </div>
  );
};
