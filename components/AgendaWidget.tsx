import React, { useState, useEffect } from 'react';
import GlassCard from './GlassCard';
import SkeletonLoader from './SkeletonLoader';
import { ChevronRight, Zap } from 'lucide-react';

interface ProgramItem {
  id: string;
  title: string;
  subtitle: string;
  detail: string;
}

const programs: ProgramItem[] = [
  { id: '1', title: 'Club.', subtitle: 'HYROX', detail: 'Precision endurance for race day readiness' },
  { id: '2', title: '// TRAINING', subtitle: 'PERFORMANCE', detail: 'Strength + tempo work guided by coaches' },
  { id: '3', title: '[ZONE]', subtitle: 'KMAKER', detail: 'Explosive power and metabolic conditioning' },
  { id: '4', title: '.YOGA', subtitle: 'MOBILITY', detail: 'Calm recovery to balance high-intensity work' },
];

interface AgendaWidgetProps {
  id?: string;
}

const AgendaWidget: React.FC<AgendaWidgetProps> = ({ id }) => {
  const [isLoading, setIsLoading] = useState(true);

  // Simular carregamento dos programas
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500); // 1.5 segundos para simular carregamento

    return () => clearTimeout(timer);
  }, []);

  return (
    <GlassCard id={id} span="row-3" className="flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 text-[var(--text-secondary)] mb-0.5">
            <Zap size={12} className="text-punk-gold" />
            <span className="text-[9px] font-black tracking-[0.2em] uppercase text-[var(--text-muted)]">Daily lineup</span>
          </div>
          <h2 className="text-sm font-black text-punk-gold tracking-tighter uppercase italic">PROGRAMS //</h2>
        </div>
        <div className="w-1.5 h-1.5 rounded-full bg-punk-gold animate-pulse shadow-[0_0_8px_rgba(212,175,55,0.6)]" />
      </div>

      <div className="flex flex-col gap-3 flex-grow">
        {isLoading ? (
          // Skeleton loaders para os programas
          Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="p-4 rounded-[1.8rem] bg-[var(--glass-bg-light)] border border-[var(--glass-border-light)]">
              <div className="flex items-center justify-between">
                <div className="flex flex-col space-y-2">
                  <SkeletonLoader className="h-4 w-24" />
                  <SkeletonLoader className="h-3 w-16" />
                </div>
                <SkeletonLoader className="h-3 w-3 rounded-full" />
              </div>
            </div>
          ))
        ) : (
          programs.map((prog) => (
            <div key={prog.id} className="group cursor-pointer">
              <div className="flex flex-col gap-2 p-3 rounded-[1.8rem] bg-[var(--glass-bg-light)] border border-[var(--glass-border-light)] transition-all duration-300 ease-out group-hover:bg-punk-gold/10 group-hover:border-punk-gold/20 group-hover:shadow-[0_8px_20px_-10px_rgba(212,175,55,0.2)] group-active:scale-[0.98]">
                <div className="flex items-start justify-between">
                  <div className="flex flex-col gap-1">
                    <h4 className="text-base font-black uppercase italic text-[var(--text-primary)]">{prog.title}</h4>
                    <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-punk-gold/90">{prog.subtitle}</p>
                  </div>
                  <ChevronRight size={16} className="text-[var(--text-secondary)] transition-all group-hover:text-[var(--text-primary)] group-hover:translate-x-1" />
                </div>
                <p className="text-[11px] uppercase tracking-[0.25em] text-[var(--text-muted)] leading-tight">{prog.detail}</p>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-2 pt-3 border-t border-[var(--border-color)] text-center shrink-0">
        <p className="text-[8px] font-black text-[var(--text-muted)] tracking-[0.3em] uppercase">Training. Strength. Conditioning.</p>
      </div>
    </GlassCard>
  );
};

export default AgendaWidget;