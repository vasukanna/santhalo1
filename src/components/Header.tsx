import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { BrandLogo } from './BrandLogo';
import { Globe, Search, Smartphone } from 'lucide-react';

interface HeaderProps {
  onSearchClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onSearchClick }) => {
  const { lang, setLang, setActiveTab, showToast } = useApp();
  const [isStandalone, setIsStandalone] = useState<boolean>(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIosSafari, setIsIosSafari] = useState<boolean>(false);

  useEffect(() => {
    // Check if running in standalone mode (already installed PWA)
    const checkStandalone = () => {
      const standalone =
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as any).standalone === true ||
        document.referrer.includes('android-app://');
      setIsStandalone(Boolean(standalone));
    };

    checkStandalone();

    // Detect iOS Safari
    const ua = window.navigator.userAgent.toLowerCase();
    const isIos = /iphone|ipad|ipod/.test(ua);
    const isSafari = ua.includes('safari') && !ua.includes('crios') && !ua.includes('chrome') && !ua.includes('fxios');
    if (isIos && isSafari) {
      setIsIosSafari(true);
    }

    // Check existing global prompt if captured earlier
    if ((window as any).__pwaPrompt) {
      setDeferredPrompt((window as any).__pwaPrompt);
    }

    // Standard Chromium beforeinstallprompt listener
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      (window as any).__pwaPrompt = e;
      setDeferredPrompt(e);
    };

    const handleAppInstalled = () => {
      setIsStandalone(true);
      setDeferredPrompt(null);
      (window as any).__pwaPrompt = null;
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleUseAppClick = async () => {
    if (isIosSafari) {
      showToast('Tap Share, then Add to Home Screen.', 'info');
      return;
    }

    const promptEvent = deferredPrompt || (window as any).__pwaPrompt;
    if (promptEvent) {
      try {
        await promptEvent.prompt();
        const choice = await promptEvent.userChoice;
        if (choice && choice.outcome === 'accepted') {
          setIsStandalone(true);
        }
        setDeferredPrompt(null);
        (window as any).__pwaPrompt = null;
      } catch (err) {
        console.error('Install prompt error:', err);
      }
    } else {
      showToast(
        lang === 'te'
          ? 'యాప్‌ను ఇన్‌స్టాల్ చేయడానికి బ్రౌజర్ మెనూను ఉపయోగించండి లేదా క్రోమ్ నుండి తెరవండి.'
          : 'To install: Tap browser menu (⋮) and select "Install app".',
        'info'
      );
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-stone-200/80 shadow-xs">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-1.5 sm:py-2 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand Logo */}
        <div className="flex items-center">
          <BrandLogo size="md" onClick={() => setActiveTab('home')} />
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {onSearchClick && (
            <button
              onClick={onSearchClick}
              className="p-1.5 sm:p-2 text-stone-600 hover:text-emerald-700 hover:bg-stone-100 rounded-full transition-colors cursor-pointer"
              title="Search"
            >
              <Search className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          )}

          {/* Use App Button (hidden when standalone/installed) */}
          {!isStandalone && (
            <button
              onClick={handleUseAppClick}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-full border border-orange-200 hover:border-orange-500 bg-orange-50 hover:bg-orange-100 text-xs font-semibold text-orange-700 hover:text-orange-900 transition-all cursor-pointer shadow-2xs whitespace-nowrap"
              title="Use App / Install Mana Santha"
            >
              <Smartphone className="w-3.5 h-3.5 text-orange-600" />
              <span>Use App</span>
            </button>
          )}

          {/* Language Toggle */}
          <button
            onClick={() => setLang(lang === 'te' ? 'en' : 'te')}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-full border border-stone-200 hover:border-emerald-500 bg-stone-50 hover:bg-emerald-50 text-xs font-semibold text-stone-700 hover:text-emerald-800 transition-all cursor-pointer shadow-2xs whitespace-nowrap"
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
