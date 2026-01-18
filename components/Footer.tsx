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
            Presence is the new power.
          </p>
        </div>

        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-2 text-[10px] font-bold punk-steel-text uppercase tracking-widest">
            <MapPin size={12} className="text-[#FF5F1F]" />
            Shopping Plaza D’oro — Goiânia
          </div>
        </div>

        <div className="pt-8 opacity-20">
          <p className="text-[9px] font-bold uppercase tracking-[0.4em]">© {currentYear} PUNK | BLVCK</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;