import React, { useState, useEffect } from 'react';
import { Download, Share, X } from 'lucide-react';

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
const DISMISSED_KEY = 'santha_pwa_dismissed';

export const PWAInstallBanner: React.FC = () => {
  const [showBanner, setShowBanner] = useState<boolean>(false);
  const [isIosSafari, setIsIosSafari] = useState<boolean>(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // 1. Check if running in standalone mode or already installed
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true ||
      document.referrer.includes('android-app://');

    if (isStandalone) {
      return;
    }

    // 2. Check 7-day dismissal window
    const dismissedAt = localStorage.getItem(DISMISSED_KEY);
    if (dismissedAt) {
      const elapsed = Date.now() - Number(dismissedAt);
      if (elapsed < SEVEN_DAYS_MS) {
        return;
      }
    }

    // 3. Detect iOS Safari
    const ua = window.navigator.userAgent.toLowerCase();
    const isIos = /iphone|ipad|ipod/.test(ua);
    const isSafari = ua.includes('safari') && !ua.includes('crios') && !ua.includes('chrome') && !ua.includes('fxios');

    if (isIos && isSafari) {
      setIsIosSafari(true);
      setShowBanner(true);
      return;
    }

    // 4. Standard Chromium beforeinstallprompt listener
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      (window as any).__pwaPrompt = e;
      setDeferredPrompt(e);
      setShowBanner(true);
    };

    const handleAppInstalled = () => {
      setShowBanner(false);
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

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    try {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult && choiceResult.outcome === 'accepted') {
        setShowBanner(false);
      }
      setDeferredPrompt(null);
    } catch (err) {
      console.warn('Install prompt error:', err);
    }
  };

  const handleDismiss = () => {
    try {
      localStorage.setItem(DISMISSED_KEY, Date.now().toString());
    } catch {
      // safe fallback
    }
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-16 sm:bottom-4 left-3 right-3 sm:left-auto sm:right-4 z-40 max-w-md sm:w-auto animate-in fade-in slide-in-from-bottom duration-300">
      <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-stone-200/90 shadow-xl p-3 sm:p-3.5 flex items-center justify-between gap-3 text-stone-900">
        
        {/* App Logo */}
        <div className="w-10 h-10 rounded-xl overflow-hidden bg-white border border-stone-100 shadow-2xs shrink-0 flex items-center justify-center p-0.5">
          <img
            src="/pwa-192x192.png"
            alt="Mana Santha"
            className="w-full h-full object-contain"
          />
        </div>

        {/* Message / Tip */}
        <div className="flex-1 min-w-0">
          <p className="text-xs sm:text-sm font-bold text-stone-900 leading-tight">
            Install Mana Santha for faster access
          </p>
          {isIosSafari && (
            <p className="text-[11px] text-stone-500 font-medium flex items-center gap-1 mt-0.5">
              <span>Tap</span>
              <Share className="w-3 h-3 text-blue-600 inline" />
              <span>Share, then &quot;Add to Home Screen&quot;</span>
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          {!isIosSafari && (
            <button
              type="button"
              onClick={handleInstallClick}
              className="px-3.5 py-1.5 bg-[#F26A1B] hover:bg-[#e05910] active:scale-95 text-white text-xs font-black rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1"
            >
              <Download className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Install</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleDismiss}
            className="px-2.5 py-1.5 text-xs font-semibold text-stone-500 hover:text-stone-800 rounded-xl hover:bg-stone-100 transition-colors cursor-pointer"
          >
            Not now
          </button>
        </div>
      </div>
    </div>
  );
};
