import React from 'react';
import { MapPin, MessageCircle, Instagram, Clock, QrCode } from 'lucide-react';
import ScheduleModal from './ScheduleModal';
import CheckInModal from './CheckInModal';

interface BottomNavProps {
  openCheckInOnLoad?: boolean;
}

const BottomNav: React.FC<BottomNavProps> = ({ openCheckInOnLoad = false }) => {
  const [isScheduleOpen, setIsScheduleOpen] = React.useState(false);
  const [isCheckInOpen, setIsCheckInOpen] = React.useState(openCheckInOnLoad);

  React.useEffect(() => {
    if (openCheckInOnLoad) {
      setIsCheckInOpen(true);
    }
  }, [openCheckInOnLoad]);

  const navigationItems = [
    {
      id: 'location',
      label: 'Local',
      icon: MapPin,
      href: 'https://www.google.com/maps/place/PUNK+BLVCK/@-16.7080078,-49.3284884,17z/data=!3m1!4b1!4m6!3m5!1s0x935ef7b2cd4039e9:0x8e5d1e5babe1aacc!8m2!3d-16.7080078!4d-49.3284884!16s%2Fg%2F11zkh43n9h?entry=ttu&g_ep=EgoyMDI2MDExMy4wIKXMDSoKLDEwMDc5MjA3MUgBUAM%3D',
      ariaLabel: 'Ver localização'
    },
    {
      id: 'contact',
      label: 'Saber Mais',
      icon: MessageCircle,
      href: 'https://wa.me/+5562993236427?text=...%20(Obrigado%20por%20clicar)',
      ariaLabel: 'WhatsApp'
    },
    {
      id: 'checkin',
      label: 'Check-in',
      icon: QrCode,
      onClick: () => setIsCheckInOpen(true),
      ariaLabel: 'Abrir QR Code de Check-in',
      isMain: true
    },
    {
      id: 'instagram',
      label: 'Social',
      icon: Instagram,
      href: 'https://instagram.com/punk.blvck',
      ariaLabel: 'Instagram'
    },
    {
      id: 'schedule',
      label: 'Horários',
      icon: Clock,
      onClick: () => setIsScheduleOpen(true),
      ariaLabel: 'Ver horários'
    }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 pb-safe" aria-label="Navegação">
      <div className="max-w-lg mx-auto px-4 pb-4">
        <div className="grid grid-cols-5 gap-1 p-2 rounded-3xl bg-[var(--bg-secondary)]/95 backdrop-blur-2xl border border-[var(--border-color)] shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.5)]">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isButton = 'onClick' in item;

            return isButton ? (
              <button
                key={item.id}
                onClick={item.onClick}
                className={`flex flex-col items-center justify-center gap-1.5 py-2.5 rounded-2xl transition-all duration-300 group ${item.isMain ? 'bg-punk-gold/10 scale-110 -translate-y-1 shadow-lg shadow-punk-gold/5 border border-punk-gold/20' : 'hover:bg-white/5'}`}
              >
                <Icon size={item.isMain ? 24 : 20} className={`${item.isMain ? 'text-punk-gold' : 'text-[var(--text-secondary)]'} group-hover:text-punk-gold transition-colors`} />
                <span className={`text-[8px] font-black uppercase tracking-widest ${item.isMain ? 'text-punk-gold' : 'text-[var(--text-secondary)]'} group-hover:text-punk-gold`}>{item.label}</span>
              </button>
            ) : (
              <a
                key={item.id}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center gap-1.5 py-2.5 rounded-2xl transition-all duration-300 hover:bg-white/5 group"
              >
                <Icon size={20} className="text-[var(--text-secondary)] group-hover:text-punk-gold transition-colors" />
                <span className="text-[8px] font-black uppercase tracking-widest text-[var(--text-secondary)] group-hover:text-punk-gold">{item.label}</span>
              </a>
            );
          })}
        </div>
      </div>

      <ScheduleModal isOpen={isScheduleOpen} onClose={() => setIsScheduleOpen(false)} />
      <CheckInModal isOpen={isCheckInOpen} onClose={() => setIsCheckInOpen(false)} />
    </nav>
  );
};

export default BottomNav;
