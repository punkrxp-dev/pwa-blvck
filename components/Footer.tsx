import React, { useMemo } from 'react';
import { Instagram, MapPin, ExternalLink } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const Footer: React.FC = () => {
  const currentYear = useMemo(() => new Date().getFullYear(), []);
  const { actualTheme } = useTheme();

  return (
    <footer className="w-full bg-[var(--bg-secondary)] py-12 px-6 border-t border-[var(--border-color)] relative z-10 text-center">
      <div className="max-w-md mx-auto space-y-8">
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

        <div className="flex flex-col items-center gap-3">
          <a
            href="https://www.google.com/maps/place/PUNK+BLVCK/@-16.7080078,-49.3284884,17z/data=!3m1!4b1!4m6!3m5!1s0x935ef7b2cd4039e9:0x8e5d1e5babe1aacc!8m2!3d-16.7080078!4d-49.3284884!16s%2Fg%2F11zkh43n9h?entry=ttu&g_ep=EgoyMDI2MDExMy4wIKXMDSoKLDEwMDc5MjA3MUgBUAM%3D"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-[10px] font-bold text-[var(--text-secondary)] hover:text-[#FF5F1F] uppercase tracking-widest transition-colors group"
          >
            <MapPin size={12} className="text-[#FF5F1F] group-hover:scale-110 transition-transform" />
            <span>Shopping Plaza D'oro, Jardim Eldorado — Goiânia</span>
            <ExternalLink size={14} className="text-[#FF5F1F]" />
          </a>
          
          <p className="text-[9px] font-bold uppercase tracking-[0.4em] opacity-30 text-[var(--text-secondary)]">
            © {currentYear} PUNK | BLVCK
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
