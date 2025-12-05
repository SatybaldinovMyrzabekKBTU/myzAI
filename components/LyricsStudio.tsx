import React, { useState } from 'react';
import { generateLyrics } from '../services/geminiService';
import { LyricsConfig } from '../types';
import { SparklesIcon, CopyIcon } from './Icons';

const LyricsStudio: React.FC = () => {
  const [config, setConfig] = useState<LyricsConfig>({
    topic: '',
    genre: 'Pop',
    mood: 'Energetic',
    structure: 'Verse-Chorus-Verse-Chorus-Bridge-Chorus'
  });
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!config.topic) return;
    setLoading(true);
    try {
      const lyrics = await generateLyrics(config.topic, config.genre, config.mood, config.structure);
      setResult(lyrics);
    } catch (e) {
      alert("Failed to generate lyrics. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (result) {
      navigator.clipboard.writeText(result);
      alert("Copied to clipboard!");
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-full gap-6">
      {/* Controls Panel */}
      <div className="w-full md:w-1/3 bg-studio-800 p-6 rounded-xl border border-studio-700 shadow-xl overflow-y-auto">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-violet-400">
          <SparklesIcon className="w-5 h-5" />
          Composition Settings
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Song Topic</label>
            <input 
              type="text" 
              value={config.topic}
              onChange={(e) => setConfig({...config, topic: e.target.value})}
              placeholder="e.g. A neon cyberpunk romance"
              className="w-full bg-studio-900 border border-studio-700 rounded-lg p-3 focus:outline-none focus:border-violet-500 transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Genre</label>
              <select 
                value={config.genre}
                onChange={(e) => setConfig({...config, genre: e.target.value})}
                className="w-full bg-studio-900 border border-studio-700 rounded-lg p-3 focus:outline-none focus:border-violet-500"
              >
                {['Pop', 'Rock', 'Hip Hop', 'R&B', 'Country', 'Electronic', 'Jazz', 'Metal', 'Cyberpunk'].map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Mood</label>
              <select 
                value={config.mood}
                onChange={(e) => setConfig({...config, mood: e.target.value})}
                className="w-full bg-studio-900 border border-studio-700 rounded-lg p-3 focus:outline-none focus:border-violet-500"
              >
                {['Happy', 'Sad', 'Energetic', 'Chill', 'Dark', 'Romantic', 'Aggressive', 'Melancholic'].map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Structure</label>
            <input 
              type="text" 
              value={config.structure}
              onChange={(e) => setConfig({...config, structure: e.target.value})}
              className="w-full bg-studio-900 border border-studio-700 rounded-lg p-3 focus:outline-none focus:border-violet-500 text-sm"
            />
          </div>

          <button 
            onClick={handleGenerate}
            disabled={loading || !config.topic}
            className={`w-full py-3 rounded-lg font-bold mt-4 transition-all flex justify-center items-center gap-2
              ${loading || !config.topic 
                ? 'bg-studio-700 text-slate-500 cursor-not-allowed' 
                : 'bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-900/20'}`}
          >
            {loading ? 'Composing...' : 'Generate Lyrics'}
          </button>
        </div>
      </div>

      {/* Output Panel */}
      <div className="flex-1 bg-studio-900 rounded-xl border border-studio-700 shadow-inner p-6 relative flex flex-col">
        <div className="absolute top-4 right-4">
           <button onClick={copyToClipboard} className="p-2 hover:bg-studio-800 rounded-full text-slate-400 hover:text-white transition-colors">
             <CopyIcon className="w-5 h-5" />
           </button>
        </div>
        
        {result ? (
          <div className="overflow-y-auto pr-4 h-full">
            <h3 className="text-2xl font-bold text-white mb-4 border-b border-studio-800 pb-2">{config.topic || 'Untitled Song'}</h3>
            <pre className="font-mono text-slate-300 whitespace-pre-wrap leading-relaxed">
              {result}
            </pre>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-600">
             <SparklesIcon className="w-16 h-16 mb-4 opacity-20" />
             <p>Enter details and hit generate to start writing.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LyricsStudio;
