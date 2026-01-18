import React from 'react';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  span?: 'col-1' | 'col-2' | 'row-2' | 'row-3' | 'large';
}

const GlassCard: React.FC<GlassCardProps> = ({ children, className = "", span = "col-1", ...props }) => {
  const spanClasses = {
    'col-1': 'col-span-1 row-span-1',
    'col-2': 'col-span-2 row-span-1',
    'row-2': 'col-span-2 row-span-2',
    'row-3': 'col-span-2 row-span-3',
    'large': 'col-span-2 row-span-2',
  };

  return (
    <div
      className={`glass-noise rounded-[2.2rem] p-4 flex flex-col overflow-hidden relative group transition-all duration-500 ease-out hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] active:scale-[0.98] ${spanClasses[span]} ${className}`}
      {...props}
    >
      <div className="glass-sheen" />
      <div className="relative z-10 h-full flex flex-col">
        {children}
      </div>
    </div>
  );
};

export default GlassCard;