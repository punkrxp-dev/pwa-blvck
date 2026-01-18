import React from 'react';
import GlassCard from './GlassCard';
import SafeImage from './SafeImage';
import { Activity, ShieldCheck } from 'lucide-react';

const ProfileWidget: React.FC = () => {
  return (
    <GlassCard span="col-1" className="bg-gradient-to-br from-white/[0.03] to-transparent">
      <div className="flex flex-col gap-3">
        <div className="relative inline-block w-fit">
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#FF5F1F]/30 p-1 bg-black">
            <SafeImage
              src="https://i.pravatar.cc/150?u=punkblvck"
              alt="Foto de perfil de Alex Silva"
              fallbackSrc="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiMxMjEyMTIiLz4KPHBhdGggZD0iTTIwIDIwQzIyLjc2MTQgMjAgMjUgMTcuNzYxNCAyNSAxNUMyNSAxMi4yMzg2IDIyLjc2MTQgMTAgMjAgMTBDMTcuMjM4NiAxMCAxNSAxMi4yMzg2IDE1IDE1QzE1IDE3Ljc2MTQgMTcgMjAgMjBaIiBmaWxsPSIjZmZmZmZmIiBvcGFjaXR5PSIwLjYiLz4KPHBhdGggZD0iTTMwIDI4QzMwIDI0LjY4NjMgMjYuNDI5MSAyMiAyMiAyMkgxOEMxMy41NzA5IDIyIDEwIDI0LjY4NjMgMTAgMjhWMzBIMzBWMjhaIiBmaWxsPSIjZmZmZmZmIiBvcGFjaXR5PSIwLjYiLz4KPHN2Zz4K"
              className="w-full h-full object-cover rounded-full grayscale hover:grayscale-0 transition-all duration-700"
            />
          </div>
          <div className="absolute -bottom-1 -right-1 bg-[#FF5F1F] rounded-full p-1 border-2 border-black shadow-lg">
            <ShieldCheck size={8} className="text-black" />
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-black tracking-tight leading-none uppercase italic">Alex Silva</h3>
          <div className="flex items-center gap-1.5 mt-1.5">
            <span className="text-[8px] uppercase tracking-[0.25em] text-[#FF5F1F] font-black bg-[#FF5F1F]/10 px-2 py-0.5 rounded-sm">ELITE MEMBER</span>
          </div>
        </div>
      </div>

      <div className="mt-auto pt-4 space-y-2">
        <div className="flex justify-between items-end mb-1">
          <div className="flex items-center gap-1.5 opacity-40">
             <Activity size={10} className="text-[#FF5F1F]" />
             <span className="text-[8px] font-black uppercase tracking-[0.2em]">STRENGTH LVL. 24</span>
          </div>
          <span className="text-[9px] font-black opacity-60">78%</span>
        </div>
        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
          <div className="h-full bg-gradient-to-r from-[#FF5F1F]/60 to-[#FF5F1F] w-[78%] rounded-full shadow-[0_0_10px_rgba(255,95,31,0.4)]" />
        </div>
      </div>
    </GlassCard>
  );
};

export default ProfileWidget;