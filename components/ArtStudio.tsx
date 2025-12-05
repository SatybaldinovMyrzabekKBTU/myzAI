import React, { useState } from 'react';
import { generateAlbumArt } from '../services/geminiService';
import { SparklesIcon, DownloadIcon } from './Icons';

const ArtStudio: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt) return;
    setLoading(true);
    try {
      const base64Image = await generateAlbumArt(prompt);
      if (base64Image) {
        setImageSrc(base64Image);
      } else {
        alert("Could not generate image. Try a different prompt.");
      }
    } catch (e) {
      alert("Error generating art.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (imageSrc) {
      const link = document.createElement('a');
      link.href = imageSrc;
      link.download = `myzAI-art-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Album Art Generator</h2>
        <p className="text-slate-400">Visualize your music with AI-generated cover art.</p>
      </div>

      <div className="bg-studio-800 p-2 rounded-2xl border border-studio-700 shadow-xl flex gap-2 mb-8">
        <input 
          type="text" 
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
          placeholder="Describe your album cover (e.g., 'Retro vaporwave sunset with a lonely astronaut')"
          className="flex-1 bg-transparent border-none text-white px-4 py-3 focus:outline-none placeholder-slate-500"
        />
        <button 
          onClick={handleGenerate}
          disabled={loading || !prompt}
          className={`px-6 py-2 rounded-xl font-semibold flex items-center gap-2 transition-all
            ${loading || !prompt 
              ? 'bg-studio-700 text-slate-500' 
              : 'bg-violet-600 hover:bg-violet-500 text-white'}`}
        >
          {loading ? (
            <span className="animate-pulse">Rendering...</span>
          ) : (
            <>
              <SparklesIcon className="w-5 h-5" />
              Generate
            </>
          )}
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center bg-studio-900 rounded-xl border-2 border-dashed border-studio-700 relative overflow-hidden group min-h-[400px]">
        {imageSrc ? (
          <>
            <img src={imageSrc} alt="Generated Art" className="w-full h-full object-contain max-h-[600px] shadow-2xl" />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
              <button 
                onClick={handleDownload}
                className="bg-white text-studio-900 px-6 py-3 rounded-full font-bold flex items-center gap-2 transform hover:scale-105 transition-transform"
              >
                <DownloadIcon className="w-5 h-5" />
                Download Artwork
              </button>
            </div>
          </>
        ) : (
          <div className="text-center text-slate-600">
            <div className="w-24 h-24 border-4 border-studio-800 rounded-full mx-auto mb-4 flex items-center justify-center">
              <SparklesIcon className="w-10 h-10 opacity-50" />
            </div>
            <p className="text-lg">Art will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArtStudio;
