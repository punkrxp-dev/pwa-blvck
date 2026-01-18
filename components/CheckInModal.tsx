import React, { useEffect, useState } from 'react';
import { X, QrCode } from 'lucide-react';

interface CheckInModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const CheckInModal: React.FC<CheckInModalProps> = ({ isOpen, onClose }) => {
    const [qrLoaded, setQrLoaded] = useState(false);

    useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(() => setQrLoaded(true), 800);
            return () => clearTimeout(timer);
        } else {
            setQrLoaded(false);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-md animate-in fade-in duration-300"
                onClick={onClose}
            />

            <div className="relative glass-noise rounded-[2.5rem] p-8 w-full max-w-sm flex flex-col items-center gap-6 animate-in slide-in-from-bottom duration-500">
                <div className="glass-sheen" />

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-white/20 hover:text-white transition-colors"
                >
                    <X size={20} />
                </button>

                <div className="flex flex-col items-center text-center">
                    <h2 className="text-xl font-black text-punk-gold uppercase tracking-tighter italic mb-1">CHECK-IN BLVCK</h2>
                    <p className="text-[10px] text-white/40 uppercase tracking-[0.2em]">Aproxime o código do leitor na recepção</p>
                </div>

                <div className="relative w-48 h-48 bg-white/5 rounded-3xl flex items-center justify-center p-6 border border-white/10 group">
                    <div className="absolute inset-0 rounded-3xl bg-punk-gold/5 animate-pulse" />

                    {!qrLoaded ? (
                        <div className="loader">
                            <span className="bg-punk-gold/40" />
                            <span className="bg-punk-gold/40" />
                            <span className="bg-punk-gold/40" />
                        </div>
                    ) : (
                        <div className="relative animate-in zoom-in duration-500">
                            <QrCode size={120} className="text-white opacity-90" strokeWidth={1} />
                            {/* Decorative corners */}
                            <div className="absolute -top-2 -left-2 w-4 h-4 border-t-2 border-l-2 border-punk-gold" />
                            <div className="absolute -top-2 -right-2 w-4 h-4 border-t-2 border-r-2 border-punk-gold" />
                            <div className="absolute -bottom-2 -left-2 w-4 h-4 border-b-2 border-l-2 border-punk-gold" />
                            <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b-2 border-r-2 border-punk-gold" />
                        </div>
                    )}
                </div>

                <div className="flex flex-col items-center gap-2">
                    <div className="flex items-center gap-2 px-3 py-1 bg-punk-gold/10 rounded-full border border-punk-gold/20">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-[9px] font-bold text-punk-gold uppercase tracking-widest">MEMBERSHIP ATIVO</span>
                    </div>
                    <span className="text-[8px] text-white/20 uppercase tracking-[0.3em] font-mono">ID: BLVCK-777-BENTLEY</span>
                </div>

                <button
                    onClick={onClose}
                    className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] text-white/60 transition-all active:scale-95"
                >
                    FECHAR
                </button>
            </div>
        </div>
    );
};

export default CheckInModal;
