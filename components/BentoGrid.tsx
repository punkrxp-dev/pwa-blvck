import React from 'react';
import GlassCard from './GlassCard';
import ErrorBoundary from './ErrorBoundary';
import WeatherWidget from './WeatherWidget';
import TimerWidget from './TimerWidget';
import AgendaWidget from './AgendaWidget';
import EventsWidget from './EventsWidget';
import CommunityInstagramWidget from './CommunityInstagramWidget';
import { ArrowUpRight } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const BentoGrid: React.FC = () => {
  const { actualTheme } = useTheme();
  const logoUrl = actualTheme === 'light'
    ? "https://res.cloudinary.com/de5jsf8pj/image/upload/v1768721836/blvck_logo_black_jiqz2f.png"
    : "https://res.cloudinary.com/de5jsf8pj/image/upload/v1768721836/blvck_logo_white_h4m0dn.png";

  return (
    <div className="grid grid-cols-2 auto-rows-[180px] gap-5 pb-16 grid-flow-dense">
      <div className="col-span-2 flex flex-col items-center justify-center py-6 px-4">
        <img
          src={logoUrl}
          alt="PUNK | BLVCK"
          className="h-20 w-auto object-contain mb-8 opacity-95"
        />
        <h2 className="text-[12px] font-medium text-center leading-relaxed uppercase text-white/40">
          ONDE PERFORMANCE,<br />
          <span className="text-punk-gold/60">ENCONTRA EXCLUSIVIDADE.</span>
        </h2>
      </div>
      <ErrorBoundary>
        <WeatherWidget />
      </ErrorBoundary>

      <ErrorBoundary>
        <TimerWidget />
      </ErrorBoundary>

      <ErrorBoundary>
        <EventsWidget />
      </ErrorBoundary>

      <ErrorBoundary>
        <GlassCard span="col-1" className="bg-punk-black/80 backdrop-blur-xl gold-border-incomplete border-shine-rotate group cursor-pointer overflow-hidden border-none relative">
          <div className="border-shine-rotate-mask" />
          <div className="absolute top-0 right-0 p-4 opacity-30 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform z-20">
            <ArrowUpRight size={20} className="text-punk-gold" />
          </div>
          <div className="mt-auto p-1 space-y-1 text-left relative z-20">
            <p className="text-punk-white font-black text-xl mb-0.5 leading-[0.9] uppercase italic tracking-tighter">ACESSAR A<br />EXPERIÊNCIA</p>
            <a
              href="https://wa.me/+5562993236427?text=Ol%C3%A1%20cliquei%20no%20webapp%20e%20desejo%20acessar%20a%20experi%C3%AAncia%20BLVCK.%20(Obrigado%20por%20clicar,%20voc%C3%AA%20j%C3%A1%20ser%C3%A1%20atendido)"
              target="_blank"
              rel="noreferrer noopener"
              className="text-[8px] tracking-[0.3em] uppercase font-black text-punk-steel hover:text-punk-gold transition-colors flex items-center gap-1"
            >
              COMO ENTRAR
              <span aria-hidden="true" className="text-punk-gold">↗</span>
            </a>
            <span className="text-[8px] tracking-[0.3em] uppercase font-black text-punk-steel/50">Membership</span>
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