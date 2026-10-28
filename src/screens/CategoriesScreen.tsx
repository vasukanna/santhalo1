import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DEFAULT_CATEGORIES } from '../data/categories';
import { CategoryIcon } from '../components/CategoryIcon';
import { ChevronRight, ArrowRight } from 'lucide-react';

export const CategoriesScreen: React.FC = () => {
  const { lang, setSelectedCategory, setActiveTab } = useApp();
  const [expandedCat, setExpandedCat] = useState<string>(DEFAULT_CATEGORIES[0].id);

  const handleSelectSub = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setActiveTab('home');
  };

  return (
    <div className="min-h-screen bg-stone-50 pb-24 pt-3">
      <div className="max-w-4xl mx-auto px-3 sm:px-4">
        {/* Title */}
        <div className="mb-4">
          <h1 className="text-xl font-black text-stone-900">
            {lang === 'te' ? 'అన్ని కేటగిరీలు' : 'All Categories'}
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            {lang === 'te'
              ? 'ఆంధ్రప్రదేశ్ రైతులు, కొనుగోలుదారులు మరియు వ్యాపారుల కోసం 5 ప్రధాన విభాగాలు'
              : '5 main agricultural categories for AP farmers and buyers'}
          </p>
        </div>

        {/* Categories List */}
        <div className="space-y-3">
          {DEFAULT_CATEGORIES.map((cat) => {
            const isExpanded = expandedCat === cat.id;
            return (
              <div
                key={cat.id}
                className="bg-white rounded-2xl border border-stone-200/90 shadow-2xs overflow-hidden transition-all"
              >
                {/* Header */}
                <button
                  onClick={() => setExpandedCat(isExpanded ? '' : cat.id)}
                  className="w-full p-4 flex items-center justify-between text-left hover:bg-stone-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div
                      style={{ backgroundColor: cat.bgColor || '#ECFDF5' }}
                      className="w-12 h-12 rounded-2xl border border-black/5 flex items-center justify-center shrink-0 p-1 shadow-2xs"
                    >
                      <CategoryIcon categoryId={cat.id} className="w-9 h-9 object-contain" />
                    </div>
                    <div>
                      <h3 className="font-bold text-stone-900 text-sm sm:text-base">
                        {lang === 'te' ? cat.nameTe : cat.name}
                      </h3>
                      <p className="text-xs text-stone-500">
                        {cat.subcategories.length} {lang === 'te' ? 'ఉప-విభాగాలు' : 'subcategories'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectSub(cat.id);
                      }}
                      className="text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-full transition-colors hidden sm:inline-flex"
                    >
                      {lang === 'te' ? 'ప్రకటనలు చూడండి' : 'View Ads'}
                    </button>
                    <ChevronRight
                      className={`w-5 h-5 text-stone-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                    />
                  </div>
                </button>

                {/* Subcategories list */}
                {isExpanded && (
                  <div className="p-3 bg-stone-50/70 border-t border-stone-100 grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {cat.subcategories.map((sub) => (
                      <button
                        key={sub.id}
                        onClick={() => handleSelectSub(cat.id)}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-stone-200/80 hover:border-emerald-500 hover:text-emerald-700 text-stone-800 text-xs font-semibold transition-all cursor-pointer shadow-2xs group text-left"
                      >
                        <span>{lang === 'te' ? sub.te : sub.name}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
