import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface ProgramVideoModalProps {
    isOpen: boolean;
    onClose: () => void;
    videoUrl: string;
    title: string;
    subtitle: string;
}

const ProgramVideoModal: React.FC<ProgramVideoModalProps> = ({
    isOpen,
    onClose,
    videoUrl,
    title,
    subtitle
}) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            // Auto-play quando abrir
            if (videoRef.current) {
                videoRef.current.play().catch(() => {
                    // Silently fail if autoplay is blocked
                });
            }
        } else {
            document.body.style.overflow = 'unset';
            // Pause quando fechar
            if (videoRef.current) {
                videoRef.current.pause();
                videoRef.current.currentTime = 0;
            }
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fadeIn"
            onClick={onClose}
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" />

            {/* Modal Content */}
            <div
                className="relative w-full max-w-4xl mx-auto animate-scaleIn"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-4 px-2">
                    <div>
                        <h2 className="text-2xl font-black uppercase italic text-punk-gold tracking-tighter">
                            {title}
                        </h2>
                        <p className="text-xs font-bold tracking-[0.3em] uppercase text-punk-steel mt-1">
                            {subtitle}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full bg-white/5 hover:bg-punk-gold/20 transition-all duration-300 group"
                        aria-label="Fechar modal"
                    >
                        <X size={24} className="text-punk-steel group-hover:text-punk-gold transition-colors" />
                    </button>
                </div>

                {/* Video Container */}
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-punk-gold/20">
                    <video
                        ref={videoRef}
                        src={videoUrl}
                        controls
                        loop
                        playsInline
                        className="w-full h-auto max-h-[70vh] object-contain bg-black"
                        controlsList="nodownload"
                    >
                        <track kind="captions" />
                        Seu navegador não suporta vídeos.
                    </video>

                    {/* Subtle Gradient Overlay */}
                    <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                </div>

                {/* Footer Hint */}
                <p className="text-center text-[10px] font-black tracking-[0.3em] uppercase text-punk-steel/50 mt-4">
                    Clique fora para fechar
                </p>
            </div>
        </div>
    );
};

export default ProgramVideoModal;
