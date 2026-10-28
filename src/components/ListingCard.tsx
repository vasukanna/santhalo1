import React from 'react';
import { Listing } from '../types';
import { MapPin, ShieldCheck, Heart, Sparkles, Phone, MessageCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface ListingCardProps {
  listing: Listing;
  onClick: () => void;
}

export const ListingCard: React.FC<ListingCardProps> = ({ listing, onClick }) => {
  const { lang, savedIds, toggleSaveListing, incrementContactCount } = useApp();
  const isSaved = savedIds.includes(listing.id);

  const handleHeartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleSaveListing(listing.id);
  };

  const imageSrc = listing.images && listing.images.length > 0
    ? listing.images[0]
    : '/assets/santha_market_art.png';

  return (
    <div
      onClick={onClick}
      className="group bg-white rounded-2xl border border-gray-100 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden cursor-pointer flex flex-col relative"
    >
      {/* Thumbnail */}
      <div className="relative aspect-4/3 w-full bg-stone-100 overflow-hidden">
        <img
          src={imageSrc}
          alt={listing.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Featured badge */}
        {listing.featured && (
          <div className="absolute top-2 left-2 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
            <Sparkles className="w-3 h-3" />
            <span>{lang === 'te' ? 'ఫీచర్డ్' : 'Featured'}</span>
          </div>
        )}

        {/* Save button */}
        <button
          onClick={handleHeartClick}
          className={`absolute top-2 right-2 p-1.5 rounded-full backdrop-blur-md transition-all ${
            isSaved
              ? 'bg-rose-50 text-rose-500 shadow-sm'
              : 'bg-black/30 text-white hover:bg-black/50'
          }`}
          title={isSaved ? 'Unsave' : 'Save'}
        >
          <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-500 stroke-rose-500' : 'stroke-white'}`} />
        </button>

        {/* Price Tag Overlay */}
        <div className="absolute bottom-2 left-2 bg-black/75 backdrop-blur-xs text-white px-2 py-1 rounded-lg text-xs font-bold flex items-baseline gap-1">
          <span>₹{listing.price.toLocaleString('en-IN')}</span>
          {listing.priceUnit && (
            <span className="text-[10px] text-gray-300 font-normal">/{listing.priceUnit}</span>
          )}
        </div>
      </div>

      {/* Info Body */}
      <div className="p-3 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-semibold text-stone-900 text-sm line-clamp-1 group-hover:text-emerald-700 transition-colors">
            {listing.title}
          </h3>

          {/* Location */}
          <div className="flex items-center gap-1 text-stone-500 text-xs mt-1.5 line-clamp-1">
            <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
            <span>
              {listing.mandal ? `${listing.mandal}, ` : ''}{listing.district}
            </span>
          </div>
        </div>

        {/* Footer Meta */}
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-stone-100 text-[11px] text-stone-500">
          <div className="flex items-center gap-1 font-medium text-stone-700">
            {listing.sellerName && (
              <span className="flex items-center gap-0.5">
                <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0" />
                <span className="truncate max-w-[90px]">{listing.sellerName}</span>
              </span>
            )}
          </div>
          {listing.negotiable && (
            <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded text-[10px] font-medium">
              {lang === 'te' ? 'చర్చించదగినది' : 'Negotiable'}
            </span>
          )}
        </div>

        {/* Quick Contact & Chat Buttons */}
        <div className="flex items-center gap-1.5 mt-2 pt-1.5 border-t border-stone-100">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              incrementContactCount(listing.id, 'call');
              if (listing.sellerPhone) {
                window.location.href = `tel:${listing.sellerPhone}`;
              } else {
                onClick();
              }
            }}
            className="flex-1 py-1.5 px-2 bg-orange-600 hover:bg-orange-700 active:scale-95 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1 shadow-2xs transition-all cursor-pointer"
            title="Call Farmer Directly"
          >
            <Phone className="w-3 h-3 fill-white" />
            <span>{lang === 'te' ? 'కాల్' : 'Call'}</span>
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              incrementContactCount(listing.id, 'chat');
              if (listing.sellerPhone) {
                const clean = listing.sellerPhone.replace(/\D/g, '');
                const phone = clean.length === 10 ? `91${clean}` : clean;
                const msg = lang === 'te'
                  ? `నమస్తే, నేను మీ సంతకార్ట్ ప్రకటన "${listing.title}" చూశాను.`
                  : `Hello, I am interested in your SanthaKart listing "${listing.title}".`;
                window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
              } else {
                onClick();
              }
            }}
            className="flex-1 py-1.5 px-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1 shadow-2xs transition-all cursor-pointer"
            title="Chat / WhatsApp"
          >
            <MessageCircle className="w-3 h-3" />
            <span>{lang === 'te' ? 'చాట్' : 'Chat'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
