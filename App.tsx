import React, { useState } from 'react';
import { AppMode } from './types';
import LyricsStudio from './components/LyricsStudio';
import ArtStudio from './components/ArtStudio';
import BrainstormChat from './components/BrainstormChat';
import { MusicNoteIcon, ImageIcon, MessageSquareIcon, MicIcon } from './components/Icons';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>(AppMode.LYRICS);

  return (
    <div className="min-h-screen bg-studio-900 text-slate-200 font-sans selection:bg-violet-500/30">
      {/* Sidebar Navigation */}
      <nav className="fixed left-0 top-0 h-full w-20 md:w-64 bg-studio-900 border-r border-studio-800 z-50 hidden md:flex flex-col">
        <div className="p-6 border-b border-studio-800">
          <h1 className="text-2xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400 flex items-center gap-2">
            <MusicNoteIcon className="w-6 h-6 text-violet-500" />
            <span className="hidden md:inline">myzAI</span>
          </h1>
          <p className="text-xs text-slate-500 mt-2 hidden md:block">AI Creative Suite</p>
        </div>

        <div className="flex-1 p-4 space-y-2">
          <NavButton 
            active={mode === AppMode.LYRICS} 
            onClick={() => setMode(AppMode.LYRICS)}
            icon={<MicIcon />}
            label="Lyrics Studio"
          />
          <NavButton 
            active={mode === AppMode.ART} 
            onClick={() => setMode(AppMode.ART)}
            icon={<ImageIcon />}
            label="Album Art"
          />
          <NavButton 
            active={mode === AppMode.CHAT} 
            onClick={() => setMode(AppMode.CHAT)}
            icon={<MessageSquareIcon />}
            label="Assistant"
          />
        </div>

        <div className="p-4 text-xs text-slate-600 text-center border-t border-studio-800">
          <span className="hidden md:inline">v1.0.0 • Gemini Inside</span>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-studio-800 border-t border-studio-700 z-50 flex justify-around p-3 pb-safe">
        <MobileNavButton active={mode === AppMode.LYRICS} onClick={() => setMode(AppMode.LYRICS)} icon={<MicIcon />} />
        <MobileNavButton active={mode === AppMode.ART} onClick={() => setMode(AppMode.ART)} icon={<ImageIcon />} />
        <MobileNavButton active={mode === AppMode.CHAT} onClick={() => setMode(AppMode.CHAT)} icon={<MessageSquareIcon />} />
      </div>

      {/* Main Content */}
      <main className="md:ml-64 p-4 md:p-8 h-screen overflow-hidden flex flex-col">
        <header className="md:hidden mb-6 flex justify-between items-center">
           <h1 className="text-xl font-bold text-white">myzAI</h1>
        </header>

        <div className="flex-1 relative">
          {mode === AppMode.LYRICS && <LyricsStudio />}
          {mode === AppMode.ART && <ArtStudio />}
          {mode === AppMode.CHAT && <BrainstormChat />}
        </div>
      </main>
    </div>
  );
};

// Sub-components for cleaner App.tsx
const NavButton = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
      ${active 
        ? 'bg-violet-600 text-white shadow-lg shadow-violet-900/20' 
        : 'text-slate-400 hover:bg-studio-800 hover:text-slate-200'}`}
  >
    <span className={`${active ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'}`}>
      {icon}
    </span>
    <span className="hidden md:inline font-medium">{label}</span>
  </button>
);

const MobileNavButton = ({ active, onClick, icon }: { active: boolean, onClick: () => void, icon: React.ReactNode }) => (
  <button 
    onClick={onClick}
    className={`p-3 rounded-full transition-all ${active ? 'bg-violet-600 text-white' : 'text-slate-400'}`}
  >
    {icon}
  </button>
);

export default App;
