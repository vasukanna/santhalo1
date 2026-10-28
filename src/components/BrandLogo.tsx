import React from 'react';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  onClick?: () => void;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ className = '', size = 'md', onClick }) => {
  const heightClasses = {
    sm: 'h-10 sm:h-12',
    md: 'h-14 sm:h-16 md:h-18',
    lg: 'h-18 sm:h-22 md:h-26',
    xl: 'h-24 sm:h-28 md:h-32'
  };

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-2 select-none cursor-pointer group ${className}`}
      title="SanthaLO - Everyone Connected. Every Need Met."
    >
      <img
        src="/assets/aistudio/image_2a4f8a8e.png"
        srcSet="/assets/aistudio/image_2a4f8a8e.png 1x, /assets/aistudio/image_2a4f8a8e.png 2x"
        alt="SanthaLO - Everyone Connected. Every Need Met."
        className={`${heightClasses[size]} w-auto object-contain transition-transform duration-200 group-hover:scale-102 drop-shadow-2xs`}
        style={{
          imageRendering: 'auto',
          maxWidth: '100%'
        }}
        loading="eager"
        decoding="sync"
      />
    </div>
  );
};
