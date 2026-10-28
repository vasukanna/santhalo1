import React from 'react';
import { useApp } from '../context/AppContext';
import { Home, LayoutGrid, Plus, Heart, User } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, t, lang } = useApp();

  const navItems = [
    {
      id: 'home',
      label: lang === 'te' ? 'హోమ్' : 'Home',
      icon: Home
    },
    {
      id: 'categories',
      label: lang === 'te' ? 'కేటగిరీలు' : 'Categories',
      icon: LayoutGrid
    },
    {
      id: 'sell',
      label: lang === 'te' ? 'ప్రకటన' : 'Post Ad',
      icon: Plus,
      isPrimary: true
    },
    {
      id: 'saved',
      label: lang === 'te' ? 'సేవ్డ్' : 'Saved',
      icon: Heart
    },
    {
      id: 'profile',
      label: lang === 'te' ? 'ప్రొఫైల్' : 'Profile',
      icon: User
    }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-lg px-2 py-1 safe-area-bottom">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          if (item.isPrimary) {
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab('sell')}
                className="flex flex-col items-center -mt-4 group focus:outline-hidden cursor-pointer min-h-[48px]"
                title={item.label}
              >
                <div className="w-12 h-12 rounded-full bg-[#ea580c] hover:bg-orange-600 text-white flex items-center justify-center shadow-lg shadow-orange-600/35 border-2 border-white group-active:scale-95 transition-all">
                  <Plus className="w-6 h-6 stroke-[3]" />
                </div>
                <span className="text-[10px] font-bold text-stone-700 mt-1 tracking-tight">
                  {item.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all active:scale-95 cursor-pointer min-h-[44px] ${
                isActive
                  ? 'text-[#16a34a] font-bold'
                  : 'text-stone-500 hover:text-stone-800 font-medium'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-105 stroke-[2.4] text-[#16a34a]' : 'stroke-[1.8]'}`} />
              </div>
              <span className={`text-[10px] mt-0.5 tracking-tight ${isActive ? 'font-black text-[#16a34a]' : 'text-stone-600'}`}>
                {item.label}
              </span>
              {isActive && (
                <div className="w-4 h-0.5 rounded-full bg-[#16a34a] mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
