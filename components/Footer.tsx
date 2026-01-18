import React, { useMemo } from 'react';
import { MapPin, MessageCircle, Instagram, Clock } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const Footer: React.FC = () => {
  const currentYear = useMemo(() => new Date().getFullYear(), []);
  const { actualTheme } = useTheme();

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
      href: 'https://wa.me/+5562993236427?text=Gostaria%20de%20saber%20os%20hor%C3%A1rios%20dos%20treinos',
      ariaLabel: 'Consultar horários de funcionamento'
    }
  ];

  return (
    <footer className="w-full bg-[var(--bg-secondary)] py-8 px-6 border-t border-[var(--border-color)] relative z-10">
      <div className="max-w-md mx-auto space-y-8">
        {/* Logo e Tagline */}
        <div className="flex flex-col items-center space-y-3">
          <img
            src={actualTheme === 'light'
              ? "https://res.cloudinary.com/de5jsf8pj/image/upload/v1768703963/web-app-manifest-512x512_W_eirnmc.png"
              : "https://res.cloudinary.com/de5jsf8pj/image/upload/v1767914884/blvck_logo_whofxk.png"
            }
            alt="PUNK | BLVCK"
            className="h-8 w-auto object-contain"
          />
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#FF5F1F]">
            PRESENCE IS THE NEW POWER
          </p>
        </div>

        {/* Bottom Navigation Bar */}
        <nav 
          className="grid grid-cols-4 gap-2 p-3 rounded-3xl bg-[var(--glass-bg-light)] border border-[var(--glass-border-light)] backdrop-blur-xl"
          aria-label="Menu de navegação principal"
        >
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.id}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={item.ariaLabel}
                className="flex flex-col items-center justify-center gap-2 py-3 px-2 rounded-2xl transition-all duration-300 hover:bg-[#FF5F1F]/10 active:scale-95 group"
              >
                <div className="relative">
                  <Icon 
                    size={22} 
                    className="text-[var(--text-secondary)] group-hover:text-[#FF5F1F] transition-colors" 
                    strokeWidth={2.5}
                  />
                  {/* Ping effect on hover */}
                  <span className="absolute inset-0 rounded-full bg-[#FF5F1F]/20 opacity-0 group-hover:opacity-100 group-hover:animate-ping" />
                </div>
                <span className="text-[9px] font-bold uppercase tracking-wider text-[var(--text-secondary)] group-hover:text-[#FF5F1F] transition-colors">
                  {item.label}
                </span>
              </a>
            );
          })}
        </nav>

        {/* Endereço */}
        <div className="text-center">
          <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest">
            Shopping Plaza D'oro, Jardim Eldorado — Goiânia
          </p>
        </div>

        {/* Copyright e Developer Credit */}
        <div className="flex flex-col items-center gap-2 pt-4 border-t border-[var(--border-color)]/30">
          <p className="text-[9px] font-bold uppercase tracking-[0.4em] opacity-30 text-[var(--text-secondary)]">
            © {currentYear} PUNK | BLVCK
          </p>
          <a
            href="https://www.flowoff.xyz/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[9px] font-medium uppercase tracking-[0.2em] text-[var(--text-secondary)] hover:text-[#FF5F1F] transition-colors opacity-50 hover:opacity-100"
          >
            Desenvolvido por NEØFlow
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
