import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { DEFAULT_CATEGORIES, normalizeCategoryId } from '../data/categories';
import { AP_DISTRICTS } from '../data/apLocations';
import { getMandalsForDistrict } from '../data/locationService';
import { ListingCard } from '../components/ListingCard';
import { CategoryIcon } from '../components/CategoryIcon';
import { HomeHeroBanner } from '../components/HomeHeroBanner';
import { PWAInstallBanner } from '../components/PWAInstallBanner';
import {
  Search,
  SlidersHorizontal,
  X,
  RotateCw,
  ChevronRight,
  Sprout,
  ChevronLeft,
  Sparkles,
  MapPin,
  Check
} from 'lucide-react';

export const HomeScreen: React.FC = () => {
  const {
    lang,
    setLang,
    t,
    listings,
    listingsLoading,
    refreshListings,
    selectedDistrict,
    setSelectedDistrict,
    selectedMandal,
    setSelectedMandal,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    sortOption,
    setSortOption,
    onlyVerified,
    setOnlyVerified,
    setActiveTab,
    setSelectedListing,
    blockedUserIds
  } = useApp();

  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showSearchBox, setShowSearchBox] = useState(false);
  const [visibleCount, setVisibleCount] = useState<number>(20);

  // Available mandals for current district
  const districtMandals = useMemo(() => {
    return selectedDistrict ? getMandalsForDistrict(selectedDistrict) : [];
  }, [selectedDistrict]);

  // Filter & Sort Logic
  const filteredListings = useMemo(() => {
    return listings
      .filter((listing) => {
        // Exclude blocked users
        if (blockedUserIds && blockedUserIds.includes(listing.sellerId)) {
          return false;
        }

        // Exclude expired listings
        if (listing.status === 'expired') {
          return false;
        }

        // District filter
        if (selectedDistrict && listing.district !== selectedDistrict) {
          if (!listing.district.toLowerCase().includes(selectedDistrict.toLowerCase())) {
            return false;
          }
        }

        // Mandal filter
        if (selectedMandal && listing.mandal !== selectedMandal) {
          if (!listing.mandal.toLowerCase().includes(selectedMandal.toLowerCase())) {
            return false;
          }
        }

        // Category filter
        if (selectedCategory) {
          const normListingCat = normalizeCategoryId(listing.category);
          const normSelectedCat = normalizeCategoryId(selectedCategory);
          if (normListingCat !== normSelectedCat) {
            return false;
          }
        }

        // Verified seller filter
        if (onlyVerified && !listing.sellerName) {
          return false;
        }

        // Text search
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchTitle = listing.title.toLowerCase().includes(q);
          const matchDesc = (listing.description || '').toLowerCase().includes(q);
          const matchLoc = (listing.village + ' ' + listing.mandal + ' ' + listing.district).toLowerCase().includes(q);
          const matchSub = (listing.subcategory || '').toLowerCase().includes(q);
          return matchTitle || matchDesc || matchLoc || matchSub;
        }

        return true;
      })
      .sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;

        if (sortOption === 'price_asc') {
          return a.price - b.price;
        }
        if (sortOption === 'price_desc') {
          return b.price - a.price;
        }
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [listings, selectedDistrict, selectedMandal, selectedCategory, onlyVerified, searchQuery, sortOption, blockedUserIds]);

  // Category-related featured listings (strictly tied to the selected category)
  const categoryFeaturedListings = useMemo(() => {
    if (!selectedCategory) return [];
    return filteredListings.filter(l => l.featured);
  }, [filteredListings, selectedCategory]);

  const displayedListings = useMemo(() => {
    return filteredListings.slice(0, visibleCount);
  }, [filteredListings, visibleCount]);

  const regularCategoryListings = useMemo(() => {
    if (!selectedCategory) return displayedListings;
    return filteredListings.filter(l => !l.featured).slice(0, visibleCount);
  }, [filteredListings, selectedCategory, displayedListings, visibleCount]);

  const listingsToDisplay = selectedCategory && categoryFeaturedListings.length > 0
    ? regularCategoryListings
    : displayedListings;

  const handleCardClick = (listing: any) => {
    setSelectedListing(listing);
    setActiveTab('detail');
  };

  return (
    <div className="min-h-screen bg-stone-50 pb-24">
      {/* Search Header / Trigger */}
      <div className="max-w-6xl mx-auto px-3 sm:px-4 pt-3">
        <div className="relative flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={lang === 'te' ? 'వరి, ఆక్వా, కూరగాయలు, పశువులు శోధించండి...' : 'Search paddy, aqua, vegetables, livestock...'}
              className="w-full pl-10 pr-9 py-2.5 bg-white border border-stone-200 rounded-full text-sm text-stone-900 placeholder:text-stone-400 focus:outline-hidden focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 shadow-2xs transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <button
            onClick={() => setShowFilterModal(true)}
            className={`p-2.5 rounded-full border transition-all cursor-pointer shadow-2xs ${
              selectedDistrict || selectedMandal || selectedCategory || onlyVerified || sortOption !== 'newest'
                ? 'bg-emerald-600 border-emerald-600 text-white'
                : 'bg-white border-stone-200 text-stone-700 hover:border-emerald-500'
            }`}
            title="Filters"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>

        {/* Location Quick Chips */}
        <div className="flex items-center gap-2 overflow-x-auto py-2.5 scrollbar-none text-xs">
          <div className="flex items-center gap-1 text-emerald-800 font-semibold shrink-0 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
            <span>{selectedDistrict}</span>
          </div>

          {selectedMandal && (
            <div className="flex items-center gap-1 text-stone-800 font-medium shrink-0 bg-stone-200/80 px-2.5 py-1 rounded-full">
              <span>{selectedMandal}</span>
              <button onClick={() => setSelectedMandal('')} className="hover:text-stone-900">
                <X className="w-3 h-3" />
              </button>
            </div>
          )}

          {selectedCategory && (
            <div className="flex items-center gap-1 text-orange-800 font-medium shrink-0 bg-orange-50 px-2.5 py-1 rounded-full border border-orange-200">
              <span>{DEFAULT_CATEGORIES.find(c => c.id === selectedCategory)?.name || selectedCategory}</span>
              <button onClick={() => setSelectedCategory('')} className="hover:text-orange-900">
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Reusable HomeHeroBanner with HTML typography, functional buttons & AP market art */}
      <HomeHeroBanner />

      {/* 5 Main Categories Section */}
      <div className="max-w-6xl mx-auto px-3 sm:px-4 mt-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base sm:text-lg font-bold text-stone-900 flex items-center gap-1.5">
            <span className="w-2 h-4.5 bg-emerald-600 rounded-full inline-block" />
            <span>{lang === 'te' ? 'ప్రధాన కేటగిరీలు' : 'Main Categories'}</span>
          </h2>
          <button
            onClick={() => setActiveTab('categories')}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-0.5 cursor-pointer"
          >
            <span>{lang === 'te' ? 'అన్నీ చూడండి' : 'View All'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 5-Column Category Grid matching reference design */}
        <div className="grid grid-cols-5 gap-1.5 sm:gap-3 md:gap-4">
          {DEFAULT_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(isSelected ? '' : cat.id)}
                style={{ backgroundColor: cat.bgColor || '#F3F4F6' }}
                className={`group flex flex-col items-center justify-between p-2 sm:p-3 md:p-4 rounded-2xl sm:rounded-3xl transition-all duration-200 text-center cursor-pointer shadow-2xs ${
                  isSelected
                    ? 'ring-2 ring-[#0B4626] border-2 border-[#0B4626] shadow-sm scale-[1.02]'
                    : 'border border-black/5 hover:border-black/15 hover:shadow-xs hover:scale-[1.02] active:scale-95'
                }`}
                aria-label={lang === 'te' ? cat.nameTe : cat.name}
              >
                <div className="w-full h-11 sm:h-14 md:h-18 lg:h-20 flex items-center justify-center">
                  <img
                    src={cat.imageUrl}
                    alt={cat.name}
                    className="max-h-full max-w-full object-contain transition-transform duration-200 group-hover:scale-105 select-none pointer-events-none"
                    loading="lazy"
                  />
                </div>
                <span className="text-[11px] sm:text-xs md:text-sm font-bold text-[#0B4626] tracking-tight leading-tight line-clamp-1 mt-1 sm:mt-1.5 text-center">
                  {lang === 'te' ? cat.nameTe : cat.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      

      {/* All / Filtered Listings Section */}
      <div id="recent-listings-section" className="max-w-6xl mx-auto px-3 sm:px-4 mt-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-stone-900">
              {selectedCategory
                ? (lang === 'te'
                    ? `${DEFAULT_CATEGORIES.find(c => c.id === selectedCategory)?.nameTe || selectedCategory} ప్రకటనలు`
                    : `${DEFAULT_CATEGORIES.find(c => c.id === selectedCategory)?.name || selectedCategory} Listings`)
                : (lang === 'te' ? 'తాజా ప్రకటనలు' : 'Recent Listings')}
            </h2>
            <p className="text-xs text-stone-500">
              {filteredListings.length} {lang === 'te' ? 'అందుబాటులో ఉన్నాయి' : 'listings available'}
            </p>
          </div>

          <button
            onClick={() => refreshListings()}
            className="p-1.5 text-stone-500 hover:text-emerald-600 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
            title="Refresh"
          >
            <RotateCw className={`w-4 h-4 ${listingsLoading ? 'animate-spin text-emerald-600' : ''}`} />
          </button>
        </div>

        {/* Listings Grid */}
        {displayedListings.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {displayedListings.map(listing => (
              <ListingCard key={listing.id} listing={listing} onClick={() => handleCardClick(listing)} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-stone-200 p-8 text-center max-w-md mx-auto my-6">
            <Sprout className="w-12 h-12 text-stone-300 mx-auto mb-3" />
            <h3 className="font-bold text-stone-800 text-sm">
              {lang === 'te' ? 'ప్రకటనలు ఏవీ దొరకలేదు' : 'No listings found'}
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              {lang === 'te'
                ? 'దయచేసి మీ శోధన లేదా ఫిల్టర్లను మార్చండి.'
                : 'Try adjusting your search filters or check nearby mandals.'}
            </p>
            <button
              onClick={() => {
                setSelectedCategory('');
                setSelectedMandal('');
                setSearchQuery('');
              }}
              className="mt-4 px-4 py-1.5 bg-emerald-600 text-white rounded-full text-xs font-semibold hover:bg-emerald-700 transition-colors cursor-pointer"
            >
              {lang === 'te' ? 'ఫిల్టర్లను క్లియర్ చేయండి' : 'Clear Filters'}
            </button>
          </div>
        )}

        {/* Load More Button */}
        {filteredListings.length > visibleCount && (
          <div className="text-center mt-6">
            <button
              onClick={() => setVisibleCount(prev => prev + 20)}
              className="px-6 py-2.5 bg-white border border-stone-200 hover:border-emerald-500 text-stone-800 text-xs font-bold rounded-full shadow-2xs hover:shadow-xs transition-all cursor-pointer"
            >
              {lang === 'te' ? 'మరిన్ని ప్రకటనలు చూడండి' : 'Load More Listings'}
            </button>
          </div>
        )}
      </div>

      {/* Filter Modal */}
      {showFilterModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
          <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl max-h-[85vh] flex flex-col shadow-xl">
            {/* Modal Header */}
            <div className="p-4 border-b border-stone-200 flex items-center justify-between">
              <h3 className="font-bold text-stone-900 text-base">
                {lang === 'te' ? 'ఫిల్టర్లు & క్రమబద్ధీకరణ' : 'Filters & Sorting'}
              </h3>
              <button
                onClick={() => setShowFilterModal(false)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 overflow-y-auto space-y-4 text-xs">
              {/* District */}
              <div>
                <label className="font-bold text-stone-800 block mb-1">
                  {lang === 'te' ? 'జిల్లా (District)' : 'District'}
                </label>
                <select
                  value={selectedDistrict}
                  onChange={(e) => {
                    setSelectedDistrict(e.target.value);
                    setSelectedMandal('');
                  }}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-medium text-stone-800 focus:outline-hidden focus:border-emerald-600"
                >
                  {AP_DISTRICTS.map(d => (
                    <option key={d.name} value={d.name}>
                      {d.name} {d.te ? `(${d.te})` : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* Mandal */}
              <div>
                <label className="font-bold text-stone-800 block mb-1">
                  {lang === 'te' ? 'మండలం (Mandal)' : 'Mandal'}
                </label>
                <select
                  value={selectedMandal}
                  onChange={(e) => setSelectedMandal(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-medium text-stone-800 focus:outline-hidden focus:border-emerald-600"
                >
                  <option value="">{lang === 'te' ? '-- అన్ని మండలాలు --' : '-- All Mandals --'}</option>
                  {districtMandals.map(m => (
                    <option key={m.name} value={m.name}>
                      {m.name} {m.te ? `(${m.te})` : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort by */}
              <div>
                <label className="font-bold text-stone-800 block mb-1">
                  {lang === 'te' ? 'క్రమబద్ధీకరించు (Sort By)' : 'Sort By'}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'newest', label: lang === 'te' ? 'తాజా' : 'Newest' },
                    { id: 'price_asc', label: lang === 'te' ? 'ధర: తక్కువ-ఎక్కువ' : 'Price: Low' },
                    { id: 'price_desc', label: lang === 'te' ? 'ధర: ఎక్కువ-తక్కువ' : 'Price: High' }
                  ].map(item => (
                    <button
                      key={item.id}
                      onClick={() => setSortOption(item.id)}
                      className={`p-2 rounded-xl border text-center font-semibold transition-all ${
                        sortOption === item.id
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'bg-stone-50 border-stone-200 text-stone-700'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-stone-200 flex items-center gap-2">
              <button
                onClick={() => {
                  setSelectedMandal('');
                  setSelectedCategory('');
                  setSortOption('newest');
                  setShowFilterModal(false);
                }}
                className="flex-1 py-2.5 border border-stone-200 rounded-xl font-bold text-stone-600 hover:bg-stone-50 cursor-pointer"
              >
                {lang === 'te' ? 'రీసెట్' : 'Reset'}
              </button>
              <button
                onClick={() => setShowFilterModal(false)}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold cursor-pointer"
              >
                {lang === 'te' ? 'వర్తించు' : 'Apply'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PWA Install Bottom Banner (shown when eligible) */}
      <PWAInstallBanner />
    </div>
  );
};
