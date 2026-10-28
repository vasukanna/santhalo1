import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ArrowLeft,
  Phone,
  MessageCircle,
  Share2,
  Bookmark,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ShieldCheck,
  Video,
  Clock,
  UserCheck,
  UserX
} from 'lucide-react';
import { db, OperationType, handleFirestoreError } from '../firebase';
import { collection, query, where, getDocs, addDoc, doc, setDoc } from 'firebase/firestore';

export const ListingDetailScreen: React.FC = () => {
  const {
    lang,
    t,
    selectedListing,
    setActiveTab,
    savedIds,
    toggleSaveListing,
    incrementContactCount,
    currentUser,
    loginWithGoogle,
    openChatThread,
    showToast,
    blockUser,
    isUserBlocked
  } = useApp();

  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [reportReason, setReportReason] = useState('fraud');
  const [reportDetails, setReportDetails] = useState('');
  const [reportSubmitting, setReportSubmitting] = useState(false);

  if (!selectedListing) {
    return (
      <div className="p-8 text-center">
        <button
          onClick={() => setActiveTab('home')}
          className="bg-orange-600 text-white px-4 py-2 rounded-xl text-sm font-bold"
        >
          {lang === 'te' ? 'హోమ్ కి వెళ్లండి' : 'Back to Home'}
        </button>
      </div>
    );
  }

  const isSaved = savedIds.includes(selectedListing.id);
  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(selectedListing.price);

  const images = selectedListing.images && selectedListing.images.length > 0
    ? selectedListing.images
    : ['https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80'];

  const handleCall = () => {
    incrementContactCount(selectedListing.id, 'call');
    if (selectedListing.sellerPhone) {
      window.location.href = `tel:${selectedListing.sellerPhone}`;
    } else {
      showToast(lang === 'te' ? 'ఫోన్ నంబర్ లభించలేదు' : 'Phone not available');
    }
  };

  const handleWhatsApp = () => {
    incrementContactCount(selectedListing.id, 'whatsapp');
    if (selectedListing.sellerPhone) {
      const clean = selectedListing.sellerPhone.replace(/\D/g, '');
      const phone = clean.length === 10 ? `91${clean}` : clean;
      const msg = lang === 'te'
        ? `నమస్తే ${selectedListing.sellerName || 'రైతు మిత్రమా'}, నేను మీ సంతకార్ట్ ప్రకటన "${selectedListing.title}" చూశాను. వివరాలు మాట్లాడటానికి సంప్రదిస్తున్నాను.`
        : `Hello ${selectedListing.sellerName || 'Seller'}, I am interested in your SanthaKart listing "${selectedListing.title}". Let's discuss.`;
      window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
    } else {
      showToast(lang === 'te' ? 'వాట్సాప్ లభించలేదు' : 'WhatsApp not available');
    }
  };

  const handleStartChat = async () => {
    if (!currentUser) {
      showToast(lang === 'te' ? 'చాట్ చేయడానికి దయచేసి లాగిన్ అవ్వండి.' : 'Please sign in to chat with seller.');
      await loginWithGoogle();
      return;
    }

    if (currentUser.uid === selectedListing.sellerId) {
      showToast(lang === 'te' ? 'ఇది మీ స్వంత ప్రకటన!' : 'This is your own listing!');
      return;
    }

    try {
      // Find existing chat or create new
      const chatsRef = collection(db, 'chats');
      const q = query(
        chatsRef,
        where('listingId', '==', selectedListing.id),
        where('participants', 'array-contains', currentUser.uid)
      );
      const querySnap = await getDocs(q);

      if (!querySnap.empty) {
        const existingChatId = querySnap.docs[0].id;
        openChatThread(existingChatId);
      } else {
        // Create new chat
        const newChatDoc = doc(collection(db, 'chats'));
        const newChatData = {
          id: newChatDoc.id,
          listingId: selectedListing.id,
          listingTitle: selectedListing.title,
          listingImage: images[0] || '',
          listingPrice: selectedListing.price,
          sellerId: selectedListing.sellerId,
          buyerId: currentUser.uid,
          participants: [currentUser.uid, selectedListing.sellerId],
          participantNames: {
            [currentUser.uid]: currentUser.displayName || 'కొనుగోలుదారు',
            [selectedListing.sellerId]: selectedListing.sellerName || 'అమ్మకందారు'
          },
          lastMessage: lang === 'te' ? 'చాట్ ప్రారంభించబడింది' : 'Chat started',
          lastMessageAt: new Date().toISOString()
        };

        await setDoc(newChatDoc, newChatData);
        openChatThread(newChatDoc.id);
      }
    } catch (error) {
      console.warn("Chat creation falling back to offline thread:", error);
      // Fallback thread id
      openChatThread(`chat_${selectedListing.id}_${currentUser.uid}`);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: selectedListing.title,
          text: `Check out ${selectedListing.title} for ${formattedPrice} on SanthaKart!`,
          url: window.location.href
        });
      } catch (e) {
        // quiet
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast(lang === 'te' ? 'లింక్ కాపీ చేయబడింది!' : 'Link copied!');
    }
  };

  const submitReport = async () => {
    if (!currentUser) {
      showToast(lang === 'te' ? 'ఫిర్యాదు చేయడానికి లాగిన్ అవ్వండి.' : 'Please sign in to submit report.');
      await loginWithGoogle();
      return;
    }

    setReportSubmitting(true);
    try {
      const reportsRef = collection(db, 'reports');
      await addDoc(reportsRef, {
        reporterId: currentUser.uid,
        reporterName: currentUser.displayName || 'వినియోగదారు',
        listingId: selectedListing.id,
        listingTitle: selectedListing.title,
        reportedUserId: selectedListing.sellerId,
        reason: reportReason,
        details: reportDetails,
        status: 'pending',
        createdAt: new Date().toISOString()
      });
      setShowReportModal(false);
      showToast(lang === 'te' ? 'మీ ఫిర్యాదు నమోదు చేయబడింది. అడ్మిన్ బృందం పరిశీలిస్తుంది.' : 'Report submitted. Admin will review.');
    } catch (error) {
      console.error('Report submission error:', error);
      setShowReportModal(false);
      showToast(lang === 'te' ? 'ఫిర్యాదు స్వీకరించబడింది.' : 'Report recorded.');
    } finally {
      setReportSubmitting(false);
    }
  };

  return (
    <div className="pb-32 bg-stone-50 min-h-screen">
      {/* Top Floating Navigation */}
      <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-stone-200 px-3 py-2 flex items-center justify-between">
        <button
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-1.5 text-stone-700 hover:text-stone-900 font-bold text-xs p-1.5 rounded-xl hover:bg-stone-100 cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5 text-stone-800" />
          <span>{lang === 'te' ? 'వెనుకకు' : 'Back'}</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="p-2 rounded-xl text-stone-600 hover:text-orange-600 hover:bg-orange-50 cursor-pointer"
            title="Share"
          >
            <Share2 className="w-5 h-5" />
          </button>
          <button
            onClick={() => toggleSaveListing(selectedListing.id)}
            className={`p-2 rounded-xl hover:bg-orange-50 cursor-pointer ${
              isSaved ? 'text-orange-600 fill-orange-600' : 'text-stone-600'
            }`}
            title="Save"
          >
            <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-orange-600 text-orange-600' : ''}`} />
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-3 sm:px-4 pt-3 space-y-4">
        {/* Photo Gallery & Video Preview */}
        <div className="bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-xs">
          <div className="relative aspect-4/3 sm:aspect-16/9 bg-stone-900 w-full overflow-hidden">
            <img
              src={images[activePhotoIdx]}
              alt={selectedListing.title}
              className="w-full h-full object-contain sm:object-cover"
            />

            {/* Featured Tag */}
            {selectedListing.featured && (
              <div className="absolute top-3 left-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white text-xs font-bold px-2.5 py-1 rounded-xl flex items-center gap-1.5 shadow-md">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{t.featuredBadge}</span>
              </div>
            )}

            {/* Image counter */}
            {images.length > 1 && (
              <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md text-white text-xs font-bold px-2.5 py-1 rounded-full">
                {activePhotoIdx + 1} / {images.length}
              </div>
            )}
          </div>

          {/* Thumbnails row */}
          {images.length > 1 && (
            <div className="flex items-center gap-2 p-3 overflow-x-auto bg-stone-50 border-t border-stone-100">
              {images.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setActivePhotoIdx(idx)}
                  className={`w-16 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                    activePhotoIdx === idx ? 'border-orange-600 ring-2 ring-orange-500/30' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Video Preview if Available */}
          {selectedListing.video && (
            <div className="p-3 bg-stone-900 text-white border-t border-stone-800 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-orange-600 text-white flex items-center justify-center">
                    <Video className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">{t.videoTour}</div>
                    <div className="text-[10px] text-stone-400">{lang === 'te' ? 'ప్రత్యక్ష వీడియో క్లిప్' : 'Live Video Tour'}</div>
                  </div>
                </div>
                {selectedListing.video.startsWith('http') && (
                  <a
                    href={selectedListing.video}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-orange-600 hover:bg-orange-700 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg"
                  >
                    {lang === 'te' ? 'ఓపెన్ లింక్' : 'Open Link'}
                  </a>
                )}
              </div>
              <div className="rounded-xl overflow-hidden bg-black aspect-video max-h-64">
                <video
                  src={selectedListing.video}
                  controls
                  playsInline
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          )}
        </div>

        {/* Primary Details Card */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-stone-200 shadow-xs space-y-3">
          {/* Price & Negotiable */}
          <div className="flex items-baseline justify-between gap-2">
            <div>
              <div className="text-2xl sm:text-3xl font-black text-emerald-800 tracking-tight">
                {formattedPrice}
                {selectedListing.priceUnit && (
                  <span className="text-sm font-semibold text-emerald-700/80 ml-1.5">
                    /{selectedListing.priceUnit}
                  </span>
                )}
              </div>
              {selectedListing.quantity && (
                <div className="text-xs font-bold text-stone-700 bg-stone-100 px-2 py-0.5 rounded-md mt-1 inline-block">
                  {lang === 'te' ? 'పరిమాణం:' : 'Qty:'} {selectedListing.quantity} {selectedListing.quantityUnit || ''}
                </div>
              )}
            </div>

            {selectedListing.negotiable ? (
              <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-xl">
                {t.negotiable}
              </span>
            ) : (
              <span className="bg-stone-100 text-stone-600 text-xs font-semibold px-2.5 py-1 rounded-xl">
                {t.fixedPrice}
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-lg sm:text-xl font-extrabold text-stone-900 leading-snug">
            {selectedListing.title}
          </h1>

          {/* Location */}
          <div className="flex items-center gap-1.5 text-xs text-stone-600 bg-stone-50 p-2.5 rounded-2xl border border-stone-100">
            <MapPin className="w-4 h-4 text-orange-600 shrink-0" />
            <span className="font-semibold">
              {[selectedListing.village, selectedListing.mandal, selectedListing.district].filter(Boolean).join(', ')}
            </span>
          </div>
        </div>

        {/* Custom Specifications Grid */}
        {selectedListing.customFields && Object.keys(selectedListing.customFields).length > 0 && (
          <div className="bg-white rounded-3xl p-4 sm:p-5 border border-stone-200 shadow-xs">
            <h2 className="text-sm font-extrabold text-stone-900 mb-3 flex items-center gap-1.5">
              <span>{t.specifications}</span>
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {Object.entries(selectedListing.customFields).map(([key, value]) => {
                if (!value) return null;
                const cleanKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                return (
                  <div key={key} className="bg-stone-50 border border-stone-200/70 p-2.5 rounded-2xl">
                    <div className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">
                      {cleanKey}
                    </div>
                    <div className="text-xs font-extrabold text-stone-800 mt-0.5 capitalize truncate">
                      {String(value)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Description */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-stone-200 shadow-xs space-y-2">
          <h2 className="text-sm font-extrabold text-stone-900">
            {t.overview}
          </h2>
          <p className="text-xs sm:text-sm text-stone-700 whitespace-pre-line leading-relaxed">
            {selectedListing.description || (lang === 'te' ? 'అమ్మకందారు వివరాలు త్వరలో నమోదు చేస్తారు.' : 'No description provided.')}
          </p>
        </div>

        {/* Seller Info Card */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-stone-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-extrabold text-stone-900 flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-orange-600" />
              <span>{t.sellerDetails}</span>
            </h2>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>{t.verifiedSeller}</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-700 font-black text-lg flex items-center justify-center shrink-0">
              {(selectedListing.sellerName || 'రై')[0]}
            </div>

            <div className="flex-1">
              <div className="font-extrabold text-stone-900 text-sm">
                {selectedListing.sellerName || 'రైతు మిత్రుడు'}
              </div>
              <div className="text-xs text-stone-500 flex items-center gap-1">
                <span>{selectedListing.sellerPhone ? `📞 ${selectedListing.sellerPhone}` : 'Phone verified'}</span>
              </div>
              <div className="text-[11px] text-stone-400 mt-0.5">
                {selectedListing.village ? `${selectedListing.village}, ` : ''}{selectedListing.district}
              </div>
            </div>
          </div>
        </div>

        {/* Safety Tips Card */}
        <div className="bg-amber-50/60 border border-amber-200/80 rounded-3xl p-4 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
            <ShieldCheck className="w-4 h-4 text-amber-700" />
            <span>{t.safetyTips}</span>
          </div>
          <ul className="text-xs text-amber-950/80 space-y-1 list-disc list-inside">
            <li>{t.safetyTip1}</li>
            <li>{t.safetyTip2}</li>
          </ul>
        </div>

        {/* Safety & UGC Actions: Report & Block Seller */}
        <div className="flex items-center justify-center gap-6 pt-2 pb-1">
          <button
            onClick={() => setShowReportModal(true)}
            className="text-xs font-semibold text-stone-500 hover:text-red-600 inline-flex items-center gap-1.5 cursor-pointer min-h-[44px] px-2"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-stone-400" />
            <span>{t.reportAd}</span>
          </button>
          <span className="text-stone-300">•</span>
          <button
            onClick={() => setShowBlockModal(true)}
            className="text-xs font-semibold text-stone-500 hover:text-red-600 inline-flex items-center gap-1.5 cursor-pointer min-h-[44px] px-2"
          >
            <UserX className="w-3.5 h-3.5 text-stone-400" />
            <span>{lang === 'te' ? 'యూజర్‌ను బ్లాక్ చేయండి' : 'Block Seller'}</span>
          </button>
        </div>
      </div>

      {/* Fixed Sticky Action Bar at Bottom (Call, WhatsApp, Chat) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200 p-3 shadow-xl safe-area-bottom">
        <div className="max-w-3xl mx-auto grid grid-cols-3 gap-2">
          {/* Call Button - Vibrant Orange */}
          <button
            onClick={handleCall}
            className="flex flex-col sm:flex-row items-center justify-center gap-1 bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-xs py-2.5 px-3 rounded-2xl shadow-md shadow-orange-600/25 active:scale-95 transition-all cursor-pointer min-h-[44px]"
          >
            <Phone className="w-4 h-4 fill-white" />
            <span>{t.callSeller}</span>
          </button>

          {/* WhatsApp Button - Royal Blue */}
          <button
            onClick={handleWhatsApp}
            className="flex flex-col sm:flex-row items-center justify-center gap-1 bg-blue-700 hover:bg-blue-800 text-white font-extrabold text-xs py-2.5 px-3 rounded-2xl shadow-md shadow-blue-700/25 active:scale-95 transition-all cursor-pointer min-h-[44px]"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            <span>{t.whatsappSeller}</span>
          </button>

          {/* In-app Chat Button - Deep Navy */}
          <button
            onClick={handleStartChat}
            className="flex flex-col sm:flex-row items-center justify-center gap-1 bg-blue-950 hover:bg-black text-white font-extrabold text-xs py-2.5 px-3 rounded-2xl shadow-md active:scale-95 transition-all cursor-pointer min-h-[44px]"
          >
            <MessageCircle className="w-4 h-4 text-orange-400" />
            <span>{t.chatSeller}</span>
          </button>
        </div>
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 max-w-sm w-full shadow-2xl border border-stone-200">
            <h3 className="font-extrabold text-stone-900 text-base mb-1">
              {lang === 'te' ? 'ప్రకటనపై ఫిర్యాదు చేయండి' : 'Report This Listing'}
            </h3>
            <p className="text-xs text-stone-500 mb-3">
              {lang === 'te' ? 'సమస్యను ఎంచుకోండి, అడ్మిన్ పరిశీలిస్తారు.' : 'Select the reason for reporting this ad.'}
            </p>

            <div className="space-y-2 mb-3">
              {[
                { id: 'fraud', label: lang === 'te' ? 'మోసపూరితమైనది / నకిలీ రైతు' : 'Fraud / Fake Seller' },
                { id: 'sold', label: lang === 'te' ? 'ఇప్పటికే అమ్ముడైపోయింది' : 'Already Sold Out' },
                { id: 'price_issue', label: lang === 'te' ? 'తప్పుడు ధర లేదా సమాచారం' : 'Incorrect Price / Details' },
                { id: 'offensive', label: lang === 'te' ? 'అసభ్యకరమైన కంటెంట్' : 'Offensive Content' }
              ].map(opt => (
                <label
                  key={opt.id}
                  onClick={() => setReportReason(opt.id)}
                  className={`flex items-center justify-between p-2.5 rounded-xl border text-xs font-semibold cursor-pointer ${
                    reportReason === opt.id ? 'border-orange-600 bg-orange-50 text-orange-900' : 'border-stone-200 text-stone-700'
                  }`}
                >
                  <span>{opt.label}</span>
                  <input
                    type="radio"
                    checked={reportReason === opt.id}
                    onChange={() => {}}
                    className="accent-orange-600"
                  />
                </label>
              ))}
            </div>

            <textarea
              value={reportDetails}
              onChange={(e) => setReportDetails(e.target.value)}
              placeholder={lang === 'te' ? 'మరిన్ని వివరాలు రాయండి (ఐచ్ఛికం)...' : 'Additional comments (optional)...'}
              className="w-full text-xs p-2.5 border border-stone-200 rounded-xl mb-4 h-16"
            />

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setShowReportModal(false)}
                className="py-2.5 rounded-xl border border-stone-300 font-bold text-xs text-stone-700 hover:bg-stone-50 min-h-[44px]"
              >
                {lang === 'te' ? 'రద్దు' : 'Cancel'}
              </button>
              <button
                onClick={submitReport}
                disabled={reportSubmitting}
                className="py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md min-h-[44px]"
              >
                {reportSubmitting ? '...' : (lang === 'te' ? 'సమర్పించండి' : 'Submit')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Block Seller Modal */}
      {showBlockModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 max-w-sm w-full shadow-2xl border border-stone-200">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-3">
              <UserX className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-stone-900 text-base mb-1">
              {lang === 'te' ? 'అమ్మకందారుని బ్లాక్ చేయాలా?' : 'Block this Seller?'}
            </h3>
            <p className="text-xs text-stone-600 mb-4 leading-relaxed">
              {lang === 'te'
                ? 'ఈ యూజర్‌ను బ్లాక్ చేస్తే, వారి నుంచి వచ్చే ప్రకటనలు మరియు సందేశాలు ఇకపై మీకు కనిపించవు.'
                : 'Blocking this user will hide all their current listings and prevent them from contacting you.'}
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setShowBlockModal(false)}
                className="py-2.5 rounded-xl border border-stone-300 font-bold text-xs text-stone-700 hover:bg-stone-50 cursor-pointer min-h-[44px]"
              >
                {lang === 'te' ? 'రద్దు' : 'Cancel'}
              </button>
              <button
                onClick={async () => {
                  await blockUser(selectedListing.sellerId, selectedListing.sellerName);
                  setShowBlockModal(false);
                  setActiveTab('home');
                }}
                className="py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md cursor-pointer min-h-[44px]"
              >
                {lang === 'te' ? 'బ్లాక్ చేయండి' : 'Confirm Block'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
