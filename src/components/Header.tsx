import React from 'react';
import { useApp } from '../context/AppContext';
import { BrandLogo } from './BrandLogo';
import { Globe, Search } from 'lucide-react';

interface HeaderProps {
  onSearchClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onSearchClick }) => {
  const { lang, setLang, setActiveTab } = useApp();

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-stone-200/80 shadow-xs">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-1.5 sm:py-2 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand Logo */}
        <div className="flex items-center">
          <BrandLogo size="md" onClick={() => setActiveTab('home')} />
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          {onSearchClick && (
            <button
              onClick={onSearchClick}
              className="p-2 text-stone-600 hover:text-emerald-700 hover:bg-stone-100 rounded-full transition-colors cursor-pointer"
              title="Search"
            >
              <Search className="w-5 h-5" />
            </button>
          )}

          {/* Language Toggle */}
          <button
            onClick={() => setLang(lang === 'te' ? 'en' : 'te')}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-full border border-stone-200 hover:border-emerald-500 bg-stone-50 hover:bg-emerald-50 text-xs font-semibold text-stone-700 hover:text-emerald-800 transition-all cursor-pointer shadow-2xs"
            title="Switch Language / భాషను మార్చుకోండి"
          >
            <Globe className="w-3.5 h-3.5 text-emerald-600" />
            <span>{lang === 'te' ? 'English' : 'తెలుగు'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
