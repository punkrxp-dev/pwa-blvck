import React, { useState } from 'react';
import { MapPin, MessageCircle, Instagram, Clock } from 'lucide-react';
import ScheduleModal from './ScheduleModal';

const BottomNav: React.FC = () => {
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const navigationItems = [
    {
      id: 'location',
      label: 'Localização',
      icon: MapPin,
      href: 'https://www.google.com/maps/place/PUNK+BLVCK/@-16.7080078,-49.3284884,17z/data=!3m1!4b1!4m6!3m5!1s0x935ef7b2cd4039e9:0x8e5d1e5babe1aacc!8m2!3d-16.7080078!4d-49.3284884!16s%2Fg%2F11zkh43n9h?entry=ttu&g_ep=EgoyMDI2MDExMy4wIKXMDSoKLDEwMDc5MjA3MUgBUAM%3D',
      ariaLabel: 'Ver localização no Google Maps'
    },
    {
      id: 'contact',
      label: 'Saber Mais',
      icon: MessageCircle,
      href: 'https://wa.me/+5562993236427?text=Ol%C3%A1%20cliquei%20no%20webapp%20e%20desejo%20acessar%20a%20experi%C3%AAncia%20BLVCK.%20(Obrigado%20por%20clicar,%20voc%C3%AA%20j%C3%A1%20ser%C3%A1%20atendido)',
      ariaLabel: 'Entrar em contato via WhatsApp'
    },
    {
      id: 'instagram',
      label: 'Instagram',
      icon: Instagram,
      href: 'https://instagram.com/punk.blvck',
      ariaLabel: 'Visitar perfil no Instagram @punk.blvck'
    },
    {
      id: 'schedule',
      label: 'Horários',
      icon: Clock,
      onClick: () => setIsScheduleOpen(true),
      ariaLabel: 'Ver horários de funcionamento'
    }
  ];

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 z-50 pb-safe"
      aria-label="Menu de navegação principal"
    >
      <div className="max-w-md mx-auto px-4 pb-4">
        <div className="grid grid-cols-4 gap-2 p-3 rounded-3xl bg-[var(--bg-secondary)]/95 backdrop-blur-2xl border border-[var(--border-color)] shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.3)]">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isButton = 'onClick' in item;
            
            const content = (
              <>
                <div className="relative">
                  <Icon 
                    size={22} 
                    className="text-[var(--text-secondary)] group-hover:text-[#FF5F1F] group-active:text-[#FF5F1F] transition-colors" 
                    strokeWidth={2.5}
                  />
                  {/* Ping effect on active */}
                  <span className="absolute inset-0 rounded-full bg-[#FF5F1F]/20 opacity-0 group-active:opacity-100 group-active:animate-ping" />
                </div>
                <span className="text-[9px] font-bold uppercase tracking-wider text-[var(--text-secondary)] group-hover:text-[#FF5F1F] group-active:text-[#FF5F1F] transition-colors leading-tight text-center">
                  {item.label}
                </span>
              </>
            );

            const className = "flex flex-col items-center justify-center gap-2 py-3 px-2 rounded-2xl transition-all duration-300 hover:bg-[#FF5F1F]/10 active:scale-95 group";

            if (isButton) {
              return (
                <button
                  key={item.id}
                  onClick={item.onClick}
                  aria-label={item.ariaLabel}
                  className={className}
                >
                  {content}
                </button>
              );
            }

            return (
              <a
                key={item.id}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={item.ariaLabel}
                className={className}
              >
                {content}
              </a>
            );
          })}
        </div>
      </div>

      <ScheduleModal 
        isOpen={isScheduleOpen} 
        onClose={() => setIsScheduleOpen(false)} 
      />
    </nav>
  );
};

export default BottomNav;
