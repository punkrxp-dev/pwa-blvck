import React, { useMemo } from 'react';
import { useTheme } from '../contexts/ThemeContext';

const Footer: React.FC = () => {
  const currentYear = useMemo(() => new Date().getFullYear(), []);
  const { actualTheme } = useTheme();

  return (
    <footer className="w-full bg-[var(--bg-secondary)] py-12 px-6 border-t border-[var(--border-color)] relative z-10 text-center mb-24">
      <div className="max-w-md mx-auto space-y-6">
        {/* Logo e Tagline */}
        <div className="flex flex-col items-center space-y-3">
          <img
            src={actualTheme === 'light'
              ? "https://res.cloudinary.com/de5jsf8pj/image/upload/v1768721836/blvck_logo_black_jiqz2f.png"
              : "https://res.cloudinary.com/de5jsf8pj/image/upload/v1768721836/blvck_logo_white_h4m0dn.png"
            }
            alt="PUNK | BLVCK"
            className="h-8 w-auto object-contain"
          />
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-punk-gold">
            PRESENCE IS THE NEW POWER
          </p>
        </div>

        {/* Endereço */}
        <div className="text-center">
          <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest">
            Shopping Plaza D'oro, Jardim Eldorado — Goiânia
          </p>
        </div>

        {/* Copyright e Developer Credit */}
        <div className="flex flex-col items-center gap-2 pt-4 border-t border-[var(--border-color)]/30">
          <p className="text-[11px] font-bold uppercase tracking-[0.4em] opacity-40 text-[var(--text-secondary)]">
            © {currentYear} PUNK | BLVCK
          </p>
          <a
            href="https://www.flowoff.xyz/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[9px] font-medium uppercase tracking-[0.2em] text-[var(--text-secondary)] hover:text-punk-gold transition-colors opacity-50 hover:opacity-100"
          >
            Desenvolvido por NEØFlow
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
