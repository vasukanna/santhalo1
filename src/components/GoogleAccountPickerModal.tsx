import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Shield, User, Plus, Sparkles, ExternalLink, Mail } from 'lucide-react';

interface GoogleAccountPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GoogleAccountPickerModal: React.FC<GoogleAccountPickerModalProps> = ({
  isOpen,
  onClose
}) => {
  const { loginWithGoogle, triggerGooglePopupOAuth } = useApp();
  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [loadingEmail, setLoadingEmail] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSelect = async (email: string) => {
    setLoadingEmail(email);
    try {
      await loginWithGoogle(email);
      onClose();
    } finally {
      setLoadingEmail(null);
    }
  };

  const handleCustomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmail.trim()) return;
    setLoadingEmail(customEmail.trim());
    try {
      await loginWithGoogle(customEmail.trim(), customName.trim() || undefined);
      onClose();
    } finally {
      setLoadingEmail(null);
    }
  };

  const handleBrowserPopup = async () => {
    setLoadingEmail('popup');
    try {
      await triggerGooglePopupOAuth();
      onClose();
    } catch {
      // Handled in context
    } finally {
      setLoadingEmail(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div 
        className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-stone-200 overflow-hidden text-stone-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 pb-3 border-b border-stone-100 flex items-start justify-between">
          <div className="flex items-center gap-3">
            {/* Google "G" Logo */}
            <div className="w-10 h-10 rounded-2xl bg-white border border-stone-200 shadow-2xs flex items-center justify-center shrink-0">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
            </div>
            <div>
              <h2 className="text-base font-extrabold text-stone-900 leading-tight">
                Sign in with Google
              </h2>
              <p className="text-xs text-stone-500 font-medium">
                Choose an account to continue to SanthaLO
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Account Selection List */}
        <div className="p-4 space-y-2 max-h-[65vh] overflow-y-auto">
          {/* Account 1: Vasu Kannaluri (Admin) */}
          <button
            type="button"
            disabled={Boolean(loadingEmail)}
            onClick={() => handleSelect('vasu.kannaluri@gmail.com')}
            className="w-full p-3 rounded-2xl border border-stone-200 hover:border-orange-500 hover:bg-orange-50/50 flex items-center justify-between text-left transition-all cursor-pointer group shadow-2xs disabled:opacity-50"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-11 h-11 rounded-2xl bg-purple-600 text-white font-black text-lg flex items-center justify-center shrink-0 shadow-xs">
                V
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-sm text-stone-900 group-hover:text-orange-700 truncate">
                    Vasu Kannaluri
                  </span>
                  <span className="bg-amber-100 text-amber-800 text-[10px] font-black px-2 py-0.5 rounded-full border border-amber-300 flex items-center gap-1 shrink-0">
                    <Shield className="w-3 h-3 text-amber-700" />
                    <span>Admin</span>
                  </span>
                </div>
                <div className="text-xs text-stone-500 truncate font-medium">
                  vasu.kannaluri@gmail.com
                </div>
              </div>
            </div>
            {loadingEmail === 'vasu.kannaluri@gmail.com' && (
              <span className="text-xs font-bold text-orange-600 animate-pulse">
                Signing in...
              </span>
            )}
          </button>

          {/* Account 2: Naren Papanaboina (Admin) */}
          <button
            type="button"
            disabled={Boolean(loadingEmail)}
            onClick={() => handleSelect('naren.papanaboina@gmail.com')}
            className="w-full p-3 rounded-2xl border border-stone-200 hover:border-emerald-500 hover:bg-emerald-50/50 flex items-center justify-between text-left transition-all cursor-pointer group shadow-2xs disabled:opacity-50"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-11 h-11 rounded-2xl bg-indigo-600 text-white font-black text-lg flex items-center justify-center shrink-0 shadow-xs">
                N
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-sm text-stone-900 group-hover:text-emerald-700 truncate">
                    Naren Papanaboina
                  </span>
                  <span className="bg-amber-100 text-amber-800 text-[10px] font-black px-2 py-0.5 rounded-full border border-amber-300 flex items-center gap-1 shrink-0">
                    <Shield className="w-3 h-3 text-amber-700" />
                    <span>Admin</span>
                  </span>
                </div>
                <div className="text-xs text-stone-500 truncate font-medium">
                  naren.papanaboina@gmail.com
                </div>
              </div>
            </div>
            {loadingEmail === 'naren.papanaboina@gmail.com' && (
              <span className="text-xs font-bold text-emerald-600 animate-pulse">
                Signing in...
              </span>
            )}
          </button>

          {/* Option 3: Browser Google OAuth Popup */}
          <button
            type="button"
            disabled={Boolean(loadingEmail)}
            onClick={handleBrowserPopup}
            className="w-full p-3 rounded-2xl border border-stone-200 hover:border-blue-500 hover:bg-blue-50/40 flex items-center justify-between text-left transition-all cursor-pointer group shadow-2xs disabled:opacity-50"
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-stone-100 border border-stone-200 text-stone-700 flex items-center justify-center shrink-0">
                <ExternalLink className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="font-bold text-xs sm:text-sm text-stone-900 group-hover:text-blue-700">
                  Open Google Account Popup
                </div>
                <div className="text-[11px] text-stone-500">
                  Prompts Google account selector directly
                </div>
              </div>
            </div>
            {loadingEmail === 'popup' && (
              <span className="text-xs font-bold text-blue-600 animate-pulse">
                Opening...
              </span>
            )}
          </button>

          {/* Option 4: Use another account toggle */}
          {!showCustomInput ? (
            <button
              type="button"
              onClick={() => setShowCustomInput(true)}
              className="w-full p-3 rounded-2xl border border-dashed border-stone-300 hover:border-stone-400 hover:bg-stone-50 flex items-center gap-3 text-left transition-all cursor-pointer text-stone-700"
            >
              <div className="w-11 h-11 rounded-2xl bg-stone-100 flex items-center justify-center shrink-0">
                <User className="w-5 h-5 text-stone-500" />
              </div>
              <div>
                <div className="font-bold text-xs sm:text-sm text-stone-800">
                  Use another Google account...
                </div>
                <div className="text-[11px] text-stone-500">
                  Enter custom email address
                </div>
              </div>
            </button>
          ) : (
            <form onSubmit={handleCustomSubmit} className="p-3 bg-stone-50 rounded-2xl border border-stone-200 space-y-2.5">
              <div className="text-xs font-bold text-stone-800 flex items-center justify-between">
                <span>Enter Google Account Details</span>
                <button
                  type="button"
                  onClick={() => setShowCustomInput(false)}
                  className="text-stone-400 hover:text-stone-700 text-[11px]"
                >
                  Cancel
                </button>
              </div>
              <input
                type="email"
                required
                value={customEmail}
                onChange={(e) => setCustomEmail(e.target.value)}
                placeholder="name@gmail.com"
                className="w-full p-2.5 bg-white border border-stone-200 rounded-xl text-xs font-medium focus:outline-hidden focus:border-orange-500"
              />
              <input
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="Your Name (Optional)"
                className="w-full p-2.5 bg-white border border-stone-200 rounded-xl text-xs font-medium focus:outline-hidden focus:border-orange-500"
              />
              <button
                type="submit"
                disabled={Boolean(loadingEmail)}
                className="w-full py-2.5 bg-stone-900 hover:bg-black text-white text-xs font-black rounded-xl cursor-pointer transition-colors shadow-xs"
              >
                Sign In with This Account
              </button>
            </form>
          )}
        </div>

        {/* Footer info note */}
        <div className="p-4 bg-stone-50 border-t border-stone-100 text-[11px] text-stone-500 text-center leading-relaxed">
          SanthaLO will share your name, email address, and profile picture with your account session.
        </div>
      </div>
    </div>
  );
};
