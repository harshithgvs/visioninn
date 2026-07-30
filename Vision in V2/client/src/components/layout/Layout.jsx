import React from 'react';
import { TopNav } from './TopNav';
import { LeftSidebar } from './LeftSidebar';
import { RightSidebar } from './RightSidebar';

export const Layout = ({ children, hideSidebars = false }) => {
  return (
    <div className="min-h-screen bg-[#070B14] text-[#F8FAFC] flex flex-col font-sans">
      <TopNav />

      <main className="w-full max-w-[1128px] mx-auto px-4 sm:px-6 py-6 flex-1">
        {hideSidebars ? (
          <div className="w-full">{children}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-[240px_minmax(0,1fr)] lg:grid-cols-[240px_minmax(0,1fr)_300px] gap-6 items-start">
            <div className="hidden md:block">
              <LeftSidebar />
            </div>
            <div className="min-w-0">{children}</div>
            <div className="hidden lg:block">
              <RightSidebar />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
