import React from 'react';
import logoImg from '../assets/images/app_bird_logo_1785406504586.jpg';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
}) => {
  const sizeClasses = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className={`${sizeClasses[size]} rounded-xl overflow-hidden shadow-sm bg-white p-0.5 border border-slate-200/50 flex items-center justify-center shrink-0`}>
        <img
          src={logoImg}
          alt="AutoPath AI Logo"
          className="w-full h-full object-cover rounded-lg mix-blend-multiply"
          referrerPolicy="no-referrer"
        />
      </div>
      {showText && (
        <div>
          <span className="text-base font-extrabold tracking-tight text-white flex items-center gap-1 leading-none">
            AutoPath <span className="text-emerald-400 text-xs font-bold px-1.5 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/30">AI</span>
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5 font-medium">Resume • Roadmaps • Mock Tests</span>
        </div>
      )}
    </div>
  );
};

export { logoImg };
