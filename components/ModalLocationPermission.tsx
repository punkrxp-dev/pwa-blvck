import React from 'react';
import GlassCard from './GlassCard';
import { MapPin, Shield, X, Navigation } from 'lucide-react';

interface ModalLocationPermissionProps {
  isOpen: boolean;
  onAllow: () => void;
  onDeny: () => void;
  onClose: () => void;
}

const ModalLocationPermission: React.FC<ModalLocationPermissionProps> = ({
  isOpen,
  onAllow,
  onDeny,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <GlassCard className="max-w-sm w-full relative">
        {/* Botão fechar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full hover:bg-[var(--glass-bg-light)] transition-colors"
          aria-label="Fechar modal"
        >
          <X size={16} />
        </button>

        {/* Ícone principal */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-[#FF5F1F]/10 flex items-center justify-center">
            <Navigation size={32} className="text-[#FF5F1F]" />
          </div>
        </div>

        {/* Título */}
        <h2 className="text-xl font-black text-[var(--text-primary)] uppercase tracking-wider text-center mb-3">
          Permitir Localização
        </h2>

        {/* Explicação */}
        <div className="space-y-3 mb-6">
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed text-center">
            Para fornecer dados climáticos <strong className="text-[#FF5F1F]">mais precisos</strong> e personalizados para sua região.
          </p>

          {/* Benefícios */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
              <MapPin size={12} className="text-[#FF5F1F] flex-shrink-0" />
              <span>Dados climáticos da sua localização atual</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
              <Shield size={12} className="text-[#FF5F1F] flex-shrink-0" />
              <span>Seus dados ficam apenas no seu dispositivo</span>
            </div>
          </div>

          {/* Aviso */}
          <div className="p-3 bg-[var(--glass-bg-light)] border border-[var(--glass-border-light)] rounded-lg">
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Você pode alterar essa permissão nas configurações do navegador a qualquer momento.
            </p>
          </div>
        </div>

        {/* Botões de ação */}
        <div className="flex gap-3">
          <button
            onClick={onDeny}
            className="flex-1 px-4 py-3 bg-[var(--glass-bg-light)] border border-[var(--glass-border-light)] text-[var(--text-primary)] rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-[var(--bg-secondary)] transition-colors"
          >
            Agora Não
          </button>
          <button
            onClick={onAllow}
            className="flex-1 px-4 py-3 bg-[#FF5F1F] text-white rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-[#FF5F1F]/90 transition-colors"
          >
            Permitir
          </button>
        </div>
      </GlassCard>
    </div>
  );
};

export default ModalLocationPermission;