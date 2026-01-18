import React from 'react';
import { X, Clock } from 'lucide-react';

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ScheduleModal: React.FC<ScheduleModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const schedules = [
    {
      id: '01',
      title: 'BLVCK .training',
      sessions: [
        {
          days: 'Segunda a sexta',
          hours: '05:00 às 22:00'
        },
        {
          days: 'Sábado e Feriados',
          hours: '07:00 às 14:00'
        }
      ]
    },
    {
      id: '02',
      title: 'BLVCK [zone]',
      sessions: [
        {
          days: 'Segunda a sexta',
          hours: '06:00 (manhã)\n07:00 (manhã)\n17:30 (tarde)\n18:30 (noite)'
        }
      ]
    },
    {
      id: '03',
      title: 'BLVCK .yoga',
      sessions: [
        {
          days: 'Segunda e quarta',
          hours: '16:00 (tarde)'
        },
        {
          days: 'Terça e quinta',
          hours: '09:30 (manhã)'
        }
      ]
    }
  ];

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] animate-in fade-in duration-300"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Modal */}
      <div className="fixed inset-x-0 bottom-0 z-[70] animate-in slide-in-from-bottom duration-300">
        <div className="max-w-md mx-auto px-4 pb-4">
          <div className="bg-[var(--bg-secondary)] rounded-t-3xl border border-[var(--border-color)] shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="relative px-6 py-5 border-b border-[var(--border-color)]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-[#FF5F1F]/10">
                    <Clock size={20} className="text-[#FF5F1F]" strokeWidth={2.5} />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-[var(--text-primary)] uppercase tracking-tight">
                      Horários
                    </h2>
                    <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                      schedule ///
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl hover:bg-[var(--glass-bg-light)] transition-colors group"
                  aria-label="Fechar horários"
                >
                  <X size={20} className="text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="max-h-[60vh] overflow-y-auto px-6 py-4 space-y-4">
              {schedules.map((schedule, index) => (
                <div 
                  key={schedule.id}
                  className="p-4 rounded-2xl bg-[var(--glass-bg-light)] border border-[var(--glass-border-light)]"
                >
                  {/* Schedule Header */}
                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-[10px] font-black text-[#FF5F1F] tracking-wider">
                      {schedule.id}
                    </span>
                    <h3 className="text-sm font-black text-[var(--text-primary)] uppercase tracking-tight">
                      {schedule.title}
                    </h3>
                  </div>

                  {/* Schedule Sessions */}
                  <div className="space-y-3">
                    {schedule.sessions.map((session, sessionIndex) => (
                      <div key={sessionIndex} className="space-y-1">
                        <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest">
                          {session.days}
                        </p>
                        <div className="text-sm font-bold text-[var(--text-primary)] whitespace-pre-line leading-relaxed">
                          {session.hours}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Separator */}
                  {index < schedules.length - 1 && (
                    <div className="mt-3 pt-3 border-t border-[var(--border-color)]/30">
                      <p className="text-[8px] font-black text-[var(--text-muted)] uppercase tracking-[0.3em]">
                        schedule ///
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-[var(--border-color)]">
              <p className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-widest text-center">
                Horários sujeitos a alteração
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ScheduleModal;
