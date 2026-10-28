import React from 'react';
import { useApp } from '../context/AppContext';
import { Search, ChevronRight } from 'lucide-react';

export const HomeHeroBanner: React.FC = () => {
  const { lang, setActiveTab } = useApp();

  const handlePostAd = () => {
    // Navigate to the existing Post Ad / Sell screen
    setActiveTab('sell');
  };

  const handleExploreListings = () => {
    // Smooth scroll to the listings section on the homepage
    const listingsElement = document.getElementById('recent-listings-section');
    if (listingsElement) {
      listingsElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollTo({ top: 380, behavior: 'smooth' });
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-4 mt-2">
      {/* 
        Unified Single-Artwork Hero Banner matching reference design:
        - Wide rounded rectangle (rounded-2xl sm:rounded-3xl)
        - Subtle green border (border-emerald-600/35)
        - Single seamless background artwork (/assets/santha_home_banner.png) spanning the entire card
        - Real HTML/React typography: "One Santha." in dark green, "Endless Connections." in bright orange
        - Interactive "+ Post an Ad ›" and "Explore Listings" buttons
        - Bottom carousel indicator dots
      */}
      <div className="relative rounded-2xl sm:rounded-3xl border border-emerald-600/35 overflow-hidden shadow-xs bg-[#F7F9F5] min-h-[200px] sm:min-h-[250px] md:min-h-[285px] lg:min-h-[305px] flex items-center">
        {/* Single Seamless Background Artwork */}
        <img
          src="/assets/santha_home_banner.png"
          alt="SanthaLO Rural Andhra Pradesh Agricultural Marketplace"
          width={1891}
          height={831}
          className="absolute inset-0 w-full h-full object-cover object-[78%_center] sm:object-right md:object-right select-none pointer-events-none"
          loading="eager"
          decoding="async"
          onError={(e) => {
            const target = e.currentTarget;
            if (target.src.indexOf('santha_home_banner.png') !== -1) {
              target.src = '/assets/aistudio/image_2c3362bf.png';
            }
          }}
        />

        {/* Mobile contrast layer (soft subtle fade only on small mobile screens to keep typography 100% sharp) */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#FAF8F5]/92 via-[#FAF8F5]/75 to-transparent sm:hidden pointer-events-none" />

        {/* Real HTML & React Typography + CTAs on the left */}
        <div className="relative z-10 w-full sm:max-w-[60%] md:max-w-[55%] lg:max-w-[50%] p-4 sm:p-6 md:p-8 lg:p-10 flex flex-col justify-center">
          {/* Dark Green Heading */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-black text-[#0B4626] tracking-tight leading-[1.08]">
            {lang === 'te' ? 'ఒకే సంత.' : 'One Santha.'}
          </h1>

          {/* Bright Orange Heading */}
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-black text-[#FF4600] tracking-tight leading-[1.08] mt-0.5 sm:mt-1">
            {lang === 'te' ? 'అనంతమైన సంబంధాలు.' : 'Endless Connections.'}
          </h2>

          {/* Subtitle */}
          <p className="text-xs sm:text-[13px] md:text-sm lg:text-[15px] font-semibold text-[#184532] mt-1.5 sm:mt-2.5 leading-snug max-w-md">
            {lang === 'te'
              ? 'పంటలు, పశువులు, కొబ్బరి, కూరగాయలు మరియు వ్యవసాయ యంత్రాలను సులభంగా కొనండి, అమ్మండి.'
              : 'Buy and sell livestock, grains, coconuts, produce and farm machinery near you.'}
          </p>

          {/* Interactive Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3.5 mt-3.5 sm:mt-5 md:mt-6">
            {/* Primary Orange CTA: "+ Post an Ad ›" */}
            <button
              type="button"
              onClick={handlePostAd}
              className="inline-flex items-center justify-center gap-1.5 sm:gap-2 px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-full bg-gradient-to-r from-[#FF4500] to-[#FF2E00] hover:from-[#E63E00] hover:to-[#E02900] active:scale-95 text-white font-black text-xs sm:text-sm shadow-md shadow-orange-600/30 transition-all cursor-pointer min-h-[42px] sm:min-h-[44px]"
              aria-label={lang === 'te' ? 'ఉచిత ప్రకటన ఇవ్వండి' : 'Post an Ad'}
            >
              <span className="w-5 h-5 rounded-full bg-white flex items-center justify-center text-[#FF4500] font-black text-xs leading-none shadow-2xs shrink-0">
                +
              </span>
              <span className="tracking-tight">{lang === 'te' ? 'ప్రకటన ఇవ్వండి' : 'Post an Ad'}</span>
              <ChevronRight className="w-4 h-4 stroke-[3] -ml-0.5" />
            </button>

            {/* Secondary White CTA: "Explore Listings" */}
            <button
              type="button"
              onClick={handleExploreListings}
              className="inline-flex items-center justify-center gap-2 px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-full bg-white/95 hover:bg-white active:scale-95 text-[#0B4626] font-black text-xs sm:text-sm border-2 border-[#0B4626] shadow-2xs hover:shadow-xs transition-all cursor-pointer min-h-[42px] sm:min-h-[44px]"
              aria-label={lang === 'te' ? 'ప్రకటనలు చూడండి' : 'Explore Listings'}
            >
              <Search className="w-4 h-4 text-[#0B4626] stroke-[2.75] shrink-0" />
              <span className="tracking-tight">{lang === 'te' ? 'ప్రకటనలు చూడండి' : 'Explore Listings'}</span>
            </button>
          </div>
        </div>

        {/* Carousel Pagination Indicator Dots matching reference */}
        <div className="absolute bottom-2.5 sm:bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10 pointer-events-none">
          <span className="w-2.5 h-2.5 rounded-full bg-[#0B4626] shadow-2xs" />
          <span className="w-2 h-2 rounded-full bg-[#0B4626]/30" />
          <span className="w-2 h-2 rounded-full bg-[#0B4626]/30" />
        </div>
      </div>
    </div>
  );
};
