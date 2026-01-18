import React from 'react';
import GlassCard from './GlassCard';
import { Calendar, MapPin, Ticket } from 'lucide-react';
import SafeImage from './SafeImage';

const EventsWidget: React.FC = () => {
    return (
        <GlassCard span="col-1" className="bg-gradient-to-br from-punk-black to-zinc-900/50 flex flex-col p-4 overflow-hidden relative">
            <div className="filter blur-sm grayscale opacity-30 select-none pointer-events-none flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-punk-gold/20 rounded-lg">
                            <Calendar size={14} className="text-punk-gold" />
                        </div>
                        <span className="text-[10px] font-black tracking-[0.2em] uppercase text-white/40">Próximo Evento</span>
                    </div>
                    <div className="h-1.5 w-1.5 rounded-full bg-white/20" />
                </div>

                {/* Teaser Area */}
                <div className="relative h-24 w-full rounded-xl overflow-hidden border border-white/5 mb-3">
                    <SafeImage
                        src="/event_teaser_2026.png"
                        fallbackSrc="/next_event_teaser_1768724552312.png"
                        alt="Evento em Breve"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-punk-black via-transparent to-transparent opacity-60" />
                    <div className="absolute bottom-2 left-3">
                        <span className="text-[8px] font-black uppercase tracking-[0.3em] text-punk-gold bg-black/40 backdrop-blur-md px-2 py-0.5 rounded">Special Edition</span>
                    </div>
                </div>

                {/* Details */}
                <div className="space-y-2">
                    <h3 className="text-xs font-black uppercase tracking-tight italic text-white/90">
                        SEASON FINALE // 2026
                    </h3>
                    <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-2 opacity-40">
                            <MapPin size={10} className="text-punk-gold" />
                            <span className="text-[9px] font-bold uppercase tracking-widest">Goiânia - Arena Blvck</span>
                        </div>
                    </div>
                </div>

                {/* Action */}
                <div className="mt-auto pt-3">
                    <div className="w-full py-2 rounded-lg bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-[0.3em] text-white/40 flex justify-center">
                        Indisponível
                    </div>
                </div>
            </div>

            {/* Overlay Status */}
            <div className="absolute inset-0 flex items-center justify-center p-6 text-center z-10">
                <div className="flex flex-col items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-punk-gold shadow-lg">EM BREVE</span>
                    <p className="text-[8px] font-medium uppercase tracking-[0.2em] text-white/40 leading-tight">
                        PROGRAMAÇÃO<br />EM ANALISE
                    </p>
                </div>
            </div>
        </GlassCard>
    );
};

export default EventsWidget;
