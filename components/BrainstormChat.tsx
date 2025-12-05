import React, { useState, useRef, useEffect } from 'react';
import { sendChatMessage } from '../services/geminiService';
import { ChatMessage } from '../types';
import { SendIcon, MusicNoteIcon } from './Icons';

const BrainstormChat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      content: "Hello! I'm myzAI. I can help with chord progressions, theory, or band name ideas. What are we working on?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      // Prepare history for API (excluding the just added message for correct context formatting usually, 
      // but Gemini SDK handles stateless mostly fine in this simple wrapper)
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.content }]
      }));

      const responseText = await sendChatMessage(history, userMsg.content);

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: responseText,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      const errorMsg: ChatMessage = {
        id: Date.now().toString(),
        role: 'model',
        content: "Sorry, I encountered a connection glitch. Try again?",
        timestamp: new Date(),
        isError: true
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-3xl mx-auto bg-studio-800 rounded-xl border border-studio-700 shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-studio-700 bg-studio-900/50 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-violet-600/20 flex items-center justify-center text-violet-400">
           <MusicNoteIcon className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-bold text-white">Studio Assistant</h3>
          <p className="text-xs text-slate-400">Powered by Gemini 2.5</p>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-studio-900">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div 
              className={`max-w-[80%] rounded-2xl p-4 ${
                msg.role === 'user' 
                  ? 'bg-violet-600 text-white rounded-br-none' 
                  : msg.isError 
                    ? 'bg-red-900/50 text-red-200 border border-red-800'
                    : 'bg-studio-800 text-slate-200 border border-studio-700 rounded-bl-none'
              }`}
            >
              <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-studio-800 p-4 rounded-2xl rounded-bl-none border border-studio-700">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-75"></div>
                <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-150"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 bg-studio-800 border-t border-studio-700">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask for chords, scales, or ideas..."
            className="flex-1 bg-studio-900 text-white rounded-xl border border-studio-600 px-4 py-3 focus:outline-none focus:border-violet-500 placeholder-slate-500"
          />
          <button 
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="bg-violet-600 hover:bg-violet-500 disabled:bg-studio-700 disabled:text-slate-500 text-white p-3 rounded-xl transition-colors"
          >
            <SendIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BrainstormChat;
