import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { HomeScreen } from './screens/HomeScreen';
import { CategoriesScreen } from './screens/CategoriesScreen';
import { SellScreen } from './screens/SellScreen';
import { SavedScreen } from './screens/SavedScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { ListingDetailScreen } from './screens/ListingDetailScreen';
import { ChatScreen } from './screens/ChatScreen';
import { SafetyPolicyScreen } from './screens/SafetyPolicyScreen';
import { DownloadScreen } from './screens/DownloadScreen';
import { GoogleAccountPickerModal } from './components/GoogleAccountPickerModal';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

const AppContent: React.FC = () => {
  const { activeTab, toast, showGoogleAccountPicker, closeGoogleAccountPicker } = useApp();

  const renderScreen = () => {
    switch (activeTab) {
      case 'home':
        return <HomeScreen />;
      case 'categories':
        return <CategoriesScreen />;
      case 'sell':
        return <SellScreen />;
      case 'saved':
        return <SavedScreen />;
      case 'profile':
        return <ProfileScreen />;
      case 'detail':
        return <ListingDetailScreen />;
      case 'chat':
        return <ChatScreen />;
      case 'safety':
        return <SafetyPolicyScreen />;
      case 'download':
        return <DownloadScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col font-sans text-stone-900">
      {/* Header (hidden on listing detail or chat if needed, but clean everywhere) */}
      <Header />

      {/* Main Screen Content */}
      <main className="flex-1">
        {renderScreen()}
      </main>

      {/* Floating Bottom Navigation */}
      <BottomNav />

      {/* Global Google Account Selection Modal */}
      <GoogleAccountPickerModal
        isOpen={showGoogleAccountPicker}
        onClose={closeGoogleAccountPicker}
      />

      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 max-w-sm w-[90%] pointer-events-none animate-in fade-in slide-in-from-top duration-200">
          <div
            className={`px-4 py-3 rounded-2xl shadow-lg border flex items-center gap-2.5 backdrop-blur-md ${
              toast.type === 'error'
                ? 'bg-rose-50/95 border-rose-200 text-rose-800'
                : toast.type === 'info'
                ? 'bg-stone-900/95 border-stone-800 text-white'
                : 'bg-emerald-900/95 border-emerald-800 text-white'
            }`}
          >
            {toast.type === 'error' ? (
              <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
            ) : toast.type === 'info' ? (
              <Info className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            )}
            <span className="text-xs font-semibold">{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
