import React, { useState, useEffect } from 'react';
import GlassCard from './GlassCard';
import SkeletonLoader from './SkeletonLoader';
import { ChevronLeft, ChevronRight, Instagram, Heart, MessageCircle, Share } from 'lucide-react';

// URLs de imagens do Instagram (posts públicos podem ser acessados diretamente)
// Nota: Estes são links de exemplo - em produção, use posts reais do @punk.blvck
const instagramPosts = [
  {
    id: 1,
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=800&h=600',
    likes: 247,
    comments: 12,
    caption: 'FORÇA COM MÉTODO',
    alt: 'Treino intenso na academia PUNK BLVCK'
  },
  {
    id: 2,
    imageUrl: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?auto=format&fit=crop&q=80&w=800&h=600',
    likes: 189,
    comments: 8,
    caption: 'PRESENCE IS POWER',
    alt: 'Equipe PUNK BLVCK em ação'
  },
  {
    id: 3,
    imageUrl: 'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?auto=format&fit=crop&q=80&w=800&h=600',
    likes: 312,
    comments: 15,
    caption: 'FORGE THE ELITE',
    alt: 'Transformação física impressionante'
  },
  {
    id: 4,
    imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800&h=600',
    likes: 198,
    comments: 6,
    caption: 'LUXURY FITNESS',
    alt: 'Ambiente premium da academia'
  }
];

const CommunityInstagramWidget: React.FC = () => {
  const [currentPostIndex, setCurrentPostIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Simular carregamento inicial das imagens
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // 2 segundos para simular carregamento das imagens

    return () => clearTimeout(timer);
  }, []);

  // Auto-rotate das imagens a cada 6 segundos
  useEffect(() => {
    if (isHovered || isLoading) return; // Pausa quando o mouse está sobre ou carregando

    const interval = setInterval(() => {
      setCurrentPostIndex((prev) => (prev + 1) % instagramPosts.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [isHovered, isLoading]);

  const nextPost = () => {
    setCurrentPostIndex((prev) => (prev + 1) % instagramPosts.length);
  };

  const prevPost = () => {
    setCurrentPostIndex((prev) => (prev - 1 + instagramPosts.length) % instagramPosts.length);
  };

  const goToPost = (index: number) => {
    setCurrentPostIndex(index);
  };

  const currentPost = instagramPosts[currentPostIndex];

  return (
    <GlassCard
      span="col-2"
      className="relative overflow-hidden bg-[var(--bg-secondary)] border-[var(--border-color)] group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Carrossel de imagens ou skeleton loader */}
      {isLoading ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center space-y-4">
            <SkeletonLoader className="w-full h-full absolute inset-0" />
            <div className="relative z-10">
              <SkeletonLoader variant="circle" className="w-8 h-8 mx-auto" />
              <SkeletonLoader className="h-4 w-24 mx-auto mt-2" />
            </div>
          </div>
        </div>
      ) : (
        <div className="absolute inset-0">
          {instagramPosts.map((post, index) => (
            <div
              key={post.id}
              className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                index === currentPostIndex
                  ? 'opacity-100 scale-100'
                  : 'opacity-0 scale-105'
              }`}
            >
              <img
                src={post.imageUrl}
                alt={post.alt}
                className="w-full h-full object-cover"
                loading="lazy"
                onError={(e) => {
                  // Fallback para uma imagem padrão se a URL falhar
                  console.warn('Imagem do Instagram não carregou:', post.imageUrl);
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800&h=600';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
            </div>
          ))}
        </div>
      )}

      {/* Controles de navegação */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          prevPost();
        }}
        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-[var(--bg-secondary)]/80 text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)] transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 backdrop-blur-sm"
        aria-label="Post anterior"
      >
        <ChevronLeft size={16} />
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation();
          nextPost();
        }}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-[var(--bg-secondary)]/80 text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)] transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 backdrop-blur-sm"
        aria-label="Próximo post"
      >
        <ChevronRight size={16} />
      </button>

      {/* Indicadores */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
        {instagramPosts.map((_, index) => (
          <button
            key={index}
            onClick={(e) => {
              e.stopPropagation();
              goToPost(index);
            }}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentPostIndex
                ? 'bg-[#FF5F1F] scale-125 shadow-lg'
                : 'bg-[var(--glass-bg-light)] hover:bg-[var(--bg-primary)]/70'
            }`}
            aria-label={`Ir para post ${index + 1}`}
          />
        ))}
      </div>

      {/* Overlay com informações do Instagram */}
      <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between">
        {/* Logo do Instagram */}
        <div className="flex items-center gap-2 bg-[var(--bg-secondary)]/60 backdrop-blur-sm rounded-full px-3 py-1.5">
          <Instagram size={14} className="text-[var(--text-primary)]" />
          <span className="text-xs font-bold text-[var(--text-primary)]">@PUNK.BLVCK</span>
        </div>

        {/* Contador de posts */}
        <div className="bg-[var(--bg-secondary)]/60 backdrop-blur-sm rounded-full px-2 py-1">
          <span className="text-xs text-[var(--text-secondary)] font-medium">
            {currentPostIndex + 1}/{instagramPosts.length}
          </span>
        </div>
      </div>

      {/* Estatísticas do post (curtidas, comentários) */}
      <div className="absolute bottom-16 left-4 right-4 z-20">
        <div className="flex items-center gap-4 text-[var(--text-primary)]/90">
          <div className="flex items-center gap-1">
            <Heart size={14} className="text-red-500" />
            <span className="text-xs font-medium">{currentPost.likes.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageCircle size={14} />
            <span className="text-xs font-medium">{currentPost.comments}</span>
          </div>
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="relative z-10 p-6 w-full h-full flex flex-col justify-end items-start text-left">
        {/* Caption do post atual */}
        <div className="mb-4">
          <p className="text-sm font-black text-[#FF5F1F] uppercase tracking-wider leading-tight">
            {currentPost.caption}
          </p>
        </div>

        {/* Título da comunidade */}
        <div>
          <h3 className="text-2xl font-black italic tracking-tighter leading-none uppercase group-hover:tracking-normal transition-all duration-500 mb-1">
            COMMUNITY
          </h3>
          <p className="text-[10px] text-[var(--text-muted)] uppercase font-medium tracking-[0.2em]">
            @PUNK.BLVCK
          </p>
          <p className="text-[9px] text-[var(--text-muted)] mt-1 uppercase font-medium tracking-[0.15em]">
            The lifestyle of the new power
          </p>
        </div>

        {/* Call to action */}
        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex items-center gap-1 bg-[#FF5F1F]/20 backdrop-blur-sm rounded-full px-3 py-1.5">
            <Share size={12} className="text-[#FF5F1F]" />
            <span className="text-xs font-bold text-[#FF5F1F]">FOLLOW</span>
          </div>
        </div>
      </div>
    </GlassCard>
  );
};

export default CommunityInstagramWidget;