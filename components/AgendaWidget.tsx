import React from 'react';
import GlassCard from './GlassCard';
import { ChevronRight, Zap } from 'lucide-react';

interface ProgramItem {
  id: string;
  title: string;
  subtitle: string;
}

const programs: ProgramItem[] = [
  { id: '1', title: 'Club.', subtitle: 'HYROX' },
  { id: '2', title: '// TRAINING', subtitle: 'PERFORMANCE' },
  { id: '3', title: '[ZONE]', subtitle: 'KMAKER' },
  { id: '4', title: '.YOGA', subtitle: 'MOBILITY' },
];

const AgendaWidget: React.FC = () => {
  return (
    <GlassCard span="row-2" className="flex flex-col">
      <div className="flex items-center justify-between mb-5">
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 text-[var(--text-secondary)] mb-0.5">
            <Zap size={12} className="text-[#FF5F1F]" />
            <span className="text-[9px] font-black tracking-[0.2em] uppercase text-[var(--text-muted)]">Daily lineup</span>
          </div>
          <h2 className="text-sm font-black text-[#FF5F1F] tracking-tighter uppercase italic">PROGRAMS //</h2>
        </div>
        <div className="w-1.5 h-1.5 rounded-full bg-[#FF5F1F] animate-pulse shadow-[0_0_8px_rgba(255,95,31,0.6)]" />
      </div>

      <div className="space-y-3 flex-grow overflow-y-auto no-scrollbar pr-1">
        {programs.map((prog) => (
          <div key={prog.id} className="group cursor-pointer">
            <div className="flex items-center justify-between p-4 rounded-[1.8rem] bg-[var(--glass-bg-light)] border border-[var(--glass-border-light)] transition-all duration-300 ease-out group-hover:bg-[#FF5F1F]/10 group-hover:border-[#FF5F1F]/20 group-hover:scale-[1.02] group-hover:shadow-[0_8px_20px_-10px_rgba(255,95,31,0.2)] group-active:scale-[0.98]">
               <div className="flex flex-col">
                  <h4 className="text-sm font-black tracking-tight leading-none uppercase italic transition-colors group-hover:text-[var(--text-primary)]">{prog.title}</h4>
                  <p className="text-[11px] font-thin tracking-[0.2em] uppercase text-[var(--text-secondary)] leading-tight mt-1.5 group-hover:text-[var(--text-primary)]/70">{prog.subtitle}</p>
               </div>
               <ChevronRight size={14} className="text-[var(--text-muted)] shrink-0 transition-all group-hover:text-[#FF5F1F] group-hover:translate-x-1" />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-3 border-t border-[var(--border-color)] text-center shrink-0">
         <p className="text-[8px] font-black text-[var(--text-muted)] tracking-[0.3em] uppercase">Forging the elite 24/7</p>
      </div>
    </GlassCard>
  );
};

export default AgendaWidget;