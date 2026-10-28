import React from 'react';
import { useApp } from '../context/AppContext';
import { ListingCard } from '../components/ListingCard';
import { Heart, Plus } from 'lucide-react';

export const SavedScreen: React.FC = () => {
  const { lang, listings, savedIds, setSelectedListing, setActiveTab } = useApp();

  const savedListings = listings.filter(l => savedIds.includes(l.id));

  return (
    <div className="min-h-screen bg-stone-50 pb-24 pt-3">
      <div className="max-w-6xl mx-auto px-3 sm:px-4">
        {/* Title */}
        <div className="mb-4">
          <h1 className="text-xl font-black text-stone-900 flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
            <span>{lang === 'te' ? 'సేవ్ చేసిన ప్రకటనలు' : 'Saved Listings'}</span>
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            {savedListings.length} {lang === 'te' ? 'ప్రకటనలు సేవ్ చేయబడ్డాయి' : 'saved items'}
          </p>
        </div>

        {savedListings.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {savedListings.map(listing => (
              <ListingCard
                key={listing.id}
                listing={listing}
                onClick={() => {
                  setSelectedListing(listing);
                  setActiveTab('detail');
                }}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-stone-200 p-8 text-center max-w-md mx-auto my-12">
            <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-400 flex items-center justify-center mx-auto mb-3">
              <Heart className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-stone-900 text-sm">
              {lang === 'te' ? 'ఇంకా ప్రకటనలు సేవ్ చేయలేదు' : 'No saved listings yet'}
            </h3>
            <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto">
              {lang === 'te'
                ? 'మీకు నచ్చిన ప్రకటనలను సులభంగా తిరిగి చూడటానికి గుండె గుర్తుపై క్లిక్ చేయండి.'
                : 'Click the heart icon on any listing to bookmark it and find it easily here later.'}
            </p>
            <button
              onClick={() => setActiveTab('home')}
              className="mt-4 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full text-xs font-bold transition-all cursor-pointer shadow-xs"
            >
              {lang === 'te' ? 'మార్కెట్‌ప్లేస్‌లో బ్రౌజ్ చేయండి' : 'Browse Marketplace'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
