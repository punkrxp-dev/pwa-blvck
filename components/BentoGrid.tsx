import React from 'react';
import GlassCard from './GlassCard';
import ErrorBoundary from './ErrorBoundary';
import WeatherWidget from './WeatherWidget';
import TimerWidget from './TimerWidget';
import AgendaWidget from './AgendaWidget';
import ProfileWidget from './ProfileWidget';
import CommunityInstagramWidget from './CommunityInstagramWidget';
import { ArrowUpRight } from 'lucide-react';

const BentoGrid: React.FC = () => {
  return (
    <div className="grid grid-cols-2 auto-rows-[170px] gap-5 pb-16">
      <ErrorBoundary>
        <WeatherWidget />
      </ErrorBoundary>

      <ErrorBoundary>
        <TimerWidget />
      </ErrorBoundary>

      <ErrorBoundary>
        <ProfileWidget />
      </ErrorBoundary>

      <ErrorBoundary>
        <GlassCard span="col-1" className="bg-[#FF5F1F] border-[#FF5F1F]/50 group cursor-pointer overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-30 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">
            <ArrowUpRight size={20} className="text-black" />
          </div>
          <div className="mt-auto p-1">
              <p className="text-black font-black text-xl mb-0.5 leading-[0.9] uppercase italic tracking-tighter">JOIN THE<br/>ELITE</p>
              <span className="text-[8px] tracking-[0.3em] uppercase font-black text-black/50">Membership</span>
          </div>
        </GlassCard>
      </ErrorBoundary>

      <ErrorBoundary>
        <AgendaWidget />
      </ErrorBoundary>

      <ErrorBoundary>
        <CommunityInstagramWidget />
      </ErrorBoundary>
    </div>
  );
};

export default BentoGrid;