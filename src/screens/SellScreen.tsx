import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { DEFAULT_CATEGORIES } from '../data/categories';
import { loadApLocations, getLoadedDistricts, DEFAULT_DISTRICT_NAME, getVillagesForMandal } from '../data/locationService';
import { compressImage } from '../firebase';
import { CategoryIcon } from '../components/CategoryIcon';
import { SubCategoryVisual } from '../components/SubCategoryVisual';
import {
  Camera,
  Image as ImageIcon,
  Video,
  X,
  MapPin,
  Tag,
  Check,
  ChevronDown,
  ArrowLeft,
  Send,
  ShieldCheck,
  Leaf,
  Zap,
  Heart,
  Lightbulb,
  Plus,
  IndianRupee,
  Phone,
  LayoutGrid
} from 'lucide-react';

export const SellScreen: React.FC = () => {
  const {
    lang,
    t,
    currentUser,
    userProfile,
    loginWithGoogle,
    createListing,
    setActiveTab,
    showToast
  } = useApp();

  // Step 1: Category & Title (5 main categories: paddy_rice, vegetables_fruits, aqua, livestock, other)
  const [categoryId, setCategoryId] = useState<string>('paddy_rice');
  const [subcategoryId, setSubcategoryId] = useState<string>('paddy_grain');
  const [title, setTitle] = useState<string>('');

  // Step 2: Price, Quantity & Description
  const [price, setPrice] = useState<string>('');
  const [priceUnit, setPriceUnit] = useState<string>('per quintal');
  const [negotiable, setNegotiable] = useState<boolean>(true);
  const [quantity, setQuantity] = useState<string>('');
  const [quantityUnit, setQuantityUnit] = useState<string>('quintals');
  const [description, setDescription] = useState<string>('');

  // Step 3: Location (Default SPSR Nellore)
  const [district, setDistrict] = useState<string>(DEFAULT_DISTRICT_NAME);
  const [mandal, setMandal] = useState<string>('Sangam');
  const [village, setVillage] = useState<string>('Chennavarappadu');
  const [otherVillageText, setOtherVillageText] = useState<string>('');
  const [villageSearch, setVillageSearch] = useState<string>('');

  // Step 4: Media & Phone (initialized with 0/3 photos matching image_0bdbd5c7.png)
  const [images, setImages] = useState<string[]>([]);
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [videoName, setVideoName] = useState<string>('');
  const [sellerPhone, setSellerPhone] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [compressing, setCompressing] = useState<boolean>(false);

  // Hidden file inputs
  const photoInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  // Pre-fill phone from user profile
  useEffect(() => {
    if (userProfile?.phone && !sellerPhone) {
      const p = userProfile.phone.trim();
      if (p !== '9848012345' && p !== '9848098765') {
        setSellerPhone(p);
      }
    }
  }, [userProfile, sellerPhone]);

  // Load AP locations lazily
  useEffect(() => {
    loadApLocations().then(() => {
      const districts = getLoadedDistricts();
      const currentD = districts.find(d => d.name === district) || districts[0];
      if (currentD && currentD.mandals.length > 0) {
        if (!currentD.mandals.some(m => m.name === mandal)) {
          setMandal(currentD.mandals[0].name);
        }
      }
    });
  }, [district]);

  // Current category object
  const currentCategory = useMemo(() => {
    return DEFAULT_CATEGORIES.find(c => c.id === categoryId) || DEFAULT_CATEGORIES[0];
  }, [categoryId]);

  // When category changes, set first subcategory
  const handleCategorySelect = (id: string) => {
    setCategoryId(id);
    const cat = DEFAULT_CATEGORIES.find(c => c.id === id);
    if (cat && cat.subcategories.length > 0) {
      setSubcategoryId(cat.subcategories[0].id);
    }
  };

  // Districts & Mandals from service
  const allDistricts = getLoadedDistricts();
  const currentDistrictObj = allDistricts.find(d => d.name === district) || allDistricts[0];
  const mandalsList = currentDistrictObj ? currentDistrictObj.mandals : [];
  const villagesList = useMemo(() => {
    return getVillagesForMandal(district, mandal);
  }, [district, mandal]);

  // Filtered villages
  const filteredVillages = useMemo(() => {
    if (!villageSearch.trim()) return villagesList;
    const q = villageSearch.toLowerCase().trim();
    return villagesList.filter(v => v.name.toLowerCase().includes(q) || v.te.includes(q));
  }, [villagesList, villageSearch]);

  // Image upload & compress handler (~1000px width, max 5 photos)
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (images.length >= 3) {
      showToast(lang === 'te' ? 'గరిష్టంగా 3 ఫోటోలు మాత్రమే అనుమతించబడతాయి.' : 'Maximum 3 photos allowed.');
      return;
    }

    setCompressing(true);
    const remainingSlots = 3 - images.length;
    const filesToProcess = Array.from(files).slice(0, remainingSlots);

    try {
      const compressedList: string[] = [];
      for (const file of filesToProcess) {
        if (file.type.startsWith('image/')) {
          const compressed = await compressImage(file, 0.85);
          compressedList.push(compressed);
        }
      }
      setImages(prev => [...prev, ...compressedList]);
      showToast(lang === 'te' ? 'ఫోటో జోడించబడింది!' : 'Photo added!');
    } catch (err) {
      console.error('Compression error:', err);
      showToast(lang === 'te' ? 'ఫోటో అప్‌లోడ్ విఫలమైంది.' : 'Photo upload failed.');
    } finally {
      setCompressing(false);
      if (e.target) e.target.value = '';
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  // Video upload (max 30s and 20MB)
  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxSizeBytes = 20 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      showToast(lang === 'te' ? 'వీడియో పరిమాణం 20MB కంటే తక్కువగా ఉండాలి.' : 'Video size must be under 20MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setVideoUrl(dataUrl);
      setVideoName(file.name);
      showToast(lang === 'te' ? 'వీడియో విజయవంతంగా జోడించబడింది!' : 'Video attached successfully!');
    };
    reader.readAsDataURL(file);
    if (e.target) e.target.value = '';
  };

  const removeVideo = () => {
    setVideoUrl('');
    setVideoName('');
  };

  // Status checks for checklist
  const isCategorySelected = Boolean(categoryId);
  const isTitleDescAdded = title.trim().length > 0;
  const isPriceSet = Boolean(price && Number(price) > 0);
  const isLocationChosen = Boolean(district && mandal && (village !== 'Other village' || otherVillageText.trim()));
  const isPhotosUploaded = images.length > 0;

  // Submit Listing with safe defaults and validation
  const handleFinalSubmit = async () => {
    if (submitting) return;

    if (!title.trim()) {
      showToast(lang === 'te' ? 'దయచేసి ప్రకటన శీర్షిక (Title) రాయండి.' : 'Please enter an ad title.', 'error');
      document.getElementById('card-details')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    if (title.length > 60) {
      showToast(lang === 'te' ? 'శీర్షిక 60 అక్షరాల కంటే తక్కువగా ఉండాలి.' : 'Title must be 60 characters or less.', 'error');
      document.getElementById('card-details')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    if (!price || Number(price) <= 0) {
      showToast(lang === 'te' ? 'దయచేసి సరైన ధర రాయండి.' : 'Please enter a valid price.', 'error');
      document.getElementById('card-details')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    if (!district || !mandal) {
      showToast(lang === 'te' ? 'దయచేసి జిల్లా మరియు మండలం ఎంచుకోండి.' : 'Please select District and Mandal.', 'error');
      document.getElementById('card-location')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    const finalPhone = sellerPhone.trim() || userProfile?.phone || '';
    if (!finalPhone) {
      showToast(lang === 'te' ? 'దయచేసి ఫోన్ నంబర్‌ను నమోదు చేయండి.' : 'Please enter contact phone number.', 'error');
      document.getElementById('card-media')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    const finalVillage = (village === 'Other village' ? otherVillageText.trim() : village) || '';
    const locationParts = [finalVillage, mandal, district].filter(Boolean);
    const computedLocation = locationParts.join(', ');

    setSubmitting(true);
    try {
      const sellerId = currentUser?.uid || userProfile?.id || 'user_vasu_1';
      const sellerName = currentUser?.displayName || userProfile?.displayName || userProfile?.name || 'vasu kannaluri';

      const listingPayload = {
        title: title.trim(),
        category: categoryId,
        subcategory: subcategoryId,
        price: Number(price) || 0,
        priceUnit: priceUnit || 'per quintal',
        negotiable: Boolean(negotiable),
        quantity: quantity.trim() ? `${quantity.trim()} ${quantityUnit}` : '',
        quantityUnit: quantityUnit || '',
        description: description.trim() || '',
        district: district || DEFAULT_DISTRICT_NAME,
        mandal: mandal || '',
        village: finalVillage,
        sellerLocation: computedLocation,
        images: images.length > 0 ? images : ['/assets/santha_market_art.png'],
        video: videoUrl || '',
        videoUrl: videoUrl || '',
        sellerPhone: finalPhone,
        sellerName: sellerName,
        sellerId: sellerId,
        status: 'active' as const,
        featured: false,
        customFields: {}
      };

      const res = await createListing(listingPayload);
      if (res && res.success) {
        showToast(lang === 'te' ? 'మీ ప్రకటన విజయవంతంగా పోస్ట్ చేయబడింది!' : 'Ad posted successfully!', 'success');
        // Reset form fields
        setTitle('');
        setPrice('');
        setDescription('');
        setQuantity('');
        setImages([]);
        setVideoUrl('');
        setVideoName('');
        setActiveTab('home');
      } else {
        showToast(lang === 'te' ? 'ప్రకటన పోస్టింగ్ విఫలమైంది.' : (res?.error || 'Failed to post ad.'), 'error');
      }
    } catch (err: any) {
      console.error('Error creating listing:', err);
      showToast(lang === 'te' ? 'ప్రకటనను పోస్ట్ చేయడంలో లోపం తలెత్తింది.' : 'Failed to post listing. Try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pb-36 pt-2 px-3 sm:px-6 max-w-4xl mx-auto space-y-6">
      
      {/* 
        1. HERO HEADER BANNER:
        Attached high-resolution SanthaLo Post Ad banner graphic matching the user's reference image
      */}
      <div className="relative rounded-3xl overflow-hidden shadow-sm border border-stone-200/80 bg-white select-none">
        <img
          src="/assets/aistudio/image_d598501f.png"
          alt="SanthaLo: Everyone Connected. Every Need Met. Post Your Ad - Sell or Rent Directly"
          className="w-full h-auto object-cover block select-none"
        />
      </div>

      {/* 
        2. HORIZONTAL 4-STEP PROGRESS TRACKER:
        All 4 steps clearly visible on one page!
      */}
      <div className="bg-white/80 backdrop-blur-xs rounded-2xl p-3 border border-stone-200/80 shadow-2xs">
        <div className="flex items-center justify-between max-w-lg mx-auto relative">
          {/* Connecting Background Line */}
          <div className="absolute top-4 left-6 right-6 h-0.5 bg-stone-200 pointer-events-none" />

          {/* Step 1 */}
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-[#0f5132] text-white font-black text-xs flex items-center justify-center shadow-xs">
              1
            </div>
            <span className="text-xs font-bold text-[#0f5132] mt-1">
              {lang === 'te' ? 'కేటగిరీ' : 'Category'}
            </span>
          </div>

          {/* Step 2 */}
          <div className="relative z-10 flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full font-black text-xs flex items-center justify-center transition-colors ${
              isTitleDescAdded ? 'bg-[#0f5132] text-white shadow-xs' : 'bg-stone-200 text-stone-600'
            }`}>
              2
            </div>
            <span className={`text-xs font-bold mt-1 ${isTitleDescAdded ? 'text-[#0f5132]' : 'text-stone-500'}`}>
              {lang === 'te' ? 'వివరాలు' : 'Details'}
            </span>
          </div>

          {/* Step 3 */}
          <div className="relative z-10 flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full font-black text-xs flex items-center justify-center transition-colors ${
              isLocationChosen ? 'bg-[#0f5132] text-white shadow-xs' : 'bg-stone-200 text-stone-600'
            }`}>
              3
            </div>
            <span className={`text-xs font-bold mt-1 ${isLocationChosen ? 'text-[#0f5132]' : 'text-stone-500'}`}>
              {lang === 'te' ? 'ప్రాంతం' : 'Location'}
            </span>
          </div>

          {/* Step 4 */}
          <div className="relative z-10 flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full font-black text-xs flex items-center justify-center transition-colors ${
              isPhotosUploaded ? 'bg-[#0f5132] text-white shadow-xs' : 'bg-stone-200 text-stone-600'
            }`}>
              4
            </div>
            <span className={`text-xs font-bold mt-1 ${isPhotosUploaded ? 'text-[#0f5132]' : 'text-stone-500'}`}>
              {lang === 'te' ? 'మీడియా' : 'Media'}
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================
          CARD 1: SELECT CATEGORY
          Matches image_dd8b4b08.png with circular produce badge, 
          category dropdown, and 6 visual category tiles + View All
      ======================================================== */}
      <div id="card-category" className="bg-white rounded-3xl p-5 sm:p-6 border border-emerald-100 shadow-sm transition-all hover:shadow-md">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-5">
          
          {/* Header & Left Dropdown */}
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-3">
              {/* Left circular halo icon with badge 1 */}
              <div className="relative w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200/80 flex items-center justify-center shrink-0">
                <CategoryIcon name={categoryId} className="w-8 h-8 object-contain" />
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#0f5132] text-white text-[11px] font-black flex items-center justify-center shadow-xs">
                  1
                </span>
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-black text-[#0f5132] leading-tight">
                  {lang === 'te' ? 'కేటగిరీని ఎంచుకోండి' : 'Select Category'}
                </h3>
                <p className="text-xs text-stone-500 font-medium">
                  {lang === 'te'
                    ? 'మీ పంట లేదా వస్తువుకు సరిపోయే కేటగిరీని ఎంచుకోండి.'
                    : 'Choose the category that best matches your product or service.'}
                </p>
              </div>
            </div>

            {/* Category Dropdown with Grid Icon */}
            <div className="pt-2">
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                {lang === 'te' ? 'ప్రధాన కేటగిరీ' : 'Category'}
              </label>
              <div className="relative">
                <LayoutGrid className="w-4 h-4 text-stone-500 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select
                  value={categoryId}
                  onChange={(e) => handleCategorySelect(e.target.value)}
                  className="w-full bg-stone-50 hover:bg-stone-100 border border-stone-300 rounded-2xl pl-11 pr-10 py-3 text-xs sm:text-sm font-bold text-stone-800 appearance-none focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-colors cursor-pointer min-h-[48px]"
                >
                  {DEFAULT_CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {lang === 'te' ? `${cat.nameTe} (${cat.nameEn})` : cat.nameEn}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-stone-500 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Subcategory Visual Selection for Selected Category */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-stone-700">
                  {lang === 'te' ? 'ఉప-కేటగిరీ (రకం)' : 'Subcategory'}
                </label>
                <span className="text-[11px] text-emerald-800 font-semibold">
                  {currentCategory.subcategories.length} {lang === 'te' ? 'అందుబాటులో ఉన్నాయి' : 'options'}
                </span>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-1">
                {currentCategory.subcategories.map((sub) => {
                  const isSubSelected = subcategoryId === sub.id;
                  return (
                    <button
                      key={sub.id}
                      type="button"
                      onClick={() => setSubcategoryId(sub.id)}
                      className={`p-2 rounded-2xl border text-left flex items-center gap-2 transition-all cursor-pointer group ${
                        isSubSelected
                          ? 'border-[#0f5132] bg-emerald-50 text-[#0f5132] font-black ring-2 ring-emerald-600/20 shadow-xs'
                          : 'border-stone-200 bg-white hover:border-emerald-300 hover:bg-stone-50 text-stone-700 font-bold'
                      }`}
                    >
                      <SubCategoryVisual
                        id={sub.id}
                        name={sub.nameEn}
                        size="sm"
                        className="w-8 h-8 rounded-lg group-hover:scale-105 transition-transform"
                      />
                      <span className="text-xs truncate flex-1 leading-tight">
                        {lang === 'te' ? sub.nameTe : sub.nameEn.split('(')[0].trim()}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: 5 Visual Category Tiles */}
          <div className="w-full md:w-[320px] lg:w-[360px] shrink-0 border-t md:border-t-0 md:border-l border-stone-100 pt-3 md:pt-0 md:pl-5 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-600">
                {lang === 'te' ? '5 ప్రధాన కేటగిరీలు' : '5 Main Categories'}
              </span>
              <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                {DEFAULT_CATEGORIES.length} {lang === 'te' ? 'కేటగిరీలు' : 'Categories'}
              </span>
            </div>

            {/* Grid of 5 visual category tiles */}
            <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-3 gap-2">
              {DEFAULT_CATEGORIES.map((cat) => {
                const isSelected = categoryId === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleCategorySelect(cat.id)}
                    style={{ backgroundColor: isSelected ? undefined : (cat.bgColor || '#F3F4F6') }}
                    className={`flex flex-col items-center justify-center p-2 rounded-2xl border transition-all cursor-pointer aspect-square text-center ${
                      isSelected
                        ? 'border-2 border-[#0B4626] bg-emerald-50/90 shadow-xs ring-2 ring-emerald-600/20'
                        : 'border-black/5 hover:border-black/15 hover:shadow-xs'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-1">
                      <CategoryIcon name={cat.id} className="w-9 h-9 object-contain" />
                    </div>
                    <span className="text-[10px] sm:text-[11px] font-bold text-stone-800 leading-tight line-clamp-2">
                      {lang === 'te' ? cat.nameTe : cat.nameEn}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      </div>

      {/* ========================================================
          CARD 2: ADD PRODUCT DETAILS
          Matches image_dd8b4b08.png with title, description 0/500,
          Add Price with unit dropdown, Negotiable toggle, and Tip card
      ======================================================== */}
      <div id="card-details" className="bg-white rounded-3xl p-5 sm:p-6 border border-emerald-100 shadow-sm transition-all hover:shadow-md space-y-4">
        
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="relative w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200/80 flex items-center justify-center shrink-0">
            <Tag className="w-7 h-7 text-[#0f5132]" />
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#0f5132] text-white text-[11px] font-black flex items-center justify-center shadow-xs">
              2
            </span>
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-black text-[#0f5132] leading-tight">
              {lang === 'te' ? 'ఉత్పత్తి వివరాలను జోడించండి' : 'Add Product Details'}
            </h3>
            <p className="text-xs text-stone-500 font-medium">
              {lang === 'te'
                ? 'మీ ప్రకటనకు స్పష్టమైన శీర్షిక, వివరాలు మరియు ధర ఇవ్వండి.'
                : 'Give a clear title, description and price for your ad.'}
            </p>
          </div>
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
          
          {/* Left Column: Title & Description */}
          <div className="space-y-4">
            <div>
              <label className="flex items-center gap-1.5 text-xs font-bold text-stone-700 mb-1.5">
                <Tag className="w-3.5 h-3.5 text-stone-400" />
                <span>{lang === 'te' ? 'ప్రకటన శీర్షిక' : 'Ad Title'}</span>
              </label>
              <input
                type="text"
                value={title}
                maxLength={60}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={lang === 'te' ? 'ఉదా: 25 కిలోల నాణ్యమైన వరి ధాన్యం' : 'Ad Title (e.g. 25 kg paddy for sale)'}
                className="w-full bg-white border border-stone-300 rounded-2xl px-4 py-3 text-xs sm:text-sm font-semibold text-stone-900 placeholder:text-stone-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-colors min-h-[48px]"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="flex items-center gap-1.5 text-xs font-bold text-stone-700">
                  <span className="text-xs">✎</span>
                  <span>{lang === 'te' ? 'వివరాలు (ఐచ్ఛికం)' : 'Description (optional)'}</span>
                </label>
                <span className="text-[11px] text-stone-400 font-semibold">
                  {description.length}/500
                </span>
              </div>
              <textarea
                value={description}
                maxLength={500}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder={lang === 'te' ? 'పంట నాణ్యత, రకం, కోత తేదీ లేదా ముఖ్యమైన సమాచారం రాయండి...' : 'Mention crop quality, harvest date, condition or seller notes...'}
                className="w-full bg-white border border-stone-300 rounded-2xl p-3.5 text-xs sm:text-sm font-medium text-stone-900 placeholder:text-stone-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-colors"
              />
            </div>
          </div>

          {/* Right Column: Price Box, Negotiable, Tip Card */}
          <div className="bg-[#fcfdfc] p-4 sm:p-5 rounded-3xl border border-stone-200/80 space-y-4">
            
            {/* Header: Add Price */}
            <div className="flex items-center gap-1.5 text-xs font-black text-[#0f5132] uppercase tracking-wider">
              <span className="w-5 h-5 rounded-full bg-emerald-100 text-[#0f5132] flex items-center justify-center font-bold text-xs">$</span>
              <span>{lang === 'te' ? 'ధర నిర్ణయించండి' : 'Add Price'}</span>
            </div>

            {/* Side-by-side: Enter price input & Select unit dropdown */}
            <div className="grid grid-cols-2 gap-2">
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder={lang === 'te' ? 'ధర నమోదు చేయండి' : 'Enter price'}
                  className="w-full bg-white border border-stone-300 rounded-2xl px-3.5 py-3 text-xs sm:text-sm font-bold text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-colors min-h-[46px]"
                />
              </div>

              <div className="relative">
                <select
                  value={priceUnit}
                  onChange={(e) => setPriceUnit(e.target.value)}
                  className="w-full bg-white border border-stone-300 rounded-2xl px-3 py-3 text-xs font-bold text-stone-800 appearance-none focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-colors cursor-pointer min-h-[46px]"
                >
                  <option value="per quintal">{lang === 'te' ? 'క్వింటాకి (Per quintal)' : 'Per quintal'}</option>
                  <option value="per kg">{lang === 'te' ? 'కేజీకి (Per kg)' : 'Per kg'}</option>
                  <option value="per ton">{lang === 'te' ? 'టన్నుకి (Per ton)' : 'Per ton'}</option>
                  <option value="per bag">{lang === 'te' ? 'బస్తాకి (Per bag)' : 'Per bag'}</option>
                  <option value="per piece">{lang === 'te' ? 'ఒక్కంటికి (Per piece)' : 'Per piece'}</option>
                  <option value="per acre">{lang === 'te' ? 'ఎకరానికి (Per acre)' : 'Per acre'}</option>
                  <option value="per hour">{lang === 'te' ? 'గంటకి (Per hour)' : 'Per hour'}</option>
                  <option value="total">{lang === 'te' ? 'మొత్తం (Total)' : 'Total'}</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Negotiable Toggle Switch */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs font-bold text-stone-700">
                {lang === 'te' ? 'చర్చించదగినది (బేరం)' : 'Negotiable'}
              </span>
              <button
                type="button"
                onClick={() => setNegotiable(!negotiable)}
                className={`w-12 h-6 rounded-full transition-colors relative p-0.5 cursor-pointer ${
                  negotiable ? 'bg-[#0f5132]' : 'bg-stone-300'
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform transform ${
                  negotiable ? 'translate-x-6' : 'translate-x-0'
                }`} />
              </button>
            </div>

            {/* Tip Card matching image_dd8b4b08.png */}
            <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-3 flex items-start gap-2.5 text-xs text-amber-900">
              <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <p className="font-medium leading-relaxed">
                <span className="font-bold">{lang === 'te' ? 'సూచన: ' : 'Tip: '}</span>
                {lang === 'te'
                  ? 'స్పష్టమైన వివరాలు, మంచి ఫోటోలు మరియు సరైన ధర జోడించడం ద్వారా వేగంగా కొనుగోలుదారులను పొందవచ్చు.'
                  : 'Add clear details, good images and correct price to get better response.'}
              </p>
            </div>

          </div>

        </div>
      </div>

      {/* ========================================================
          CARD 3: SELECT LOCATION
          Matches image_dd8b4b08.png with map pin halo badge 3,
          District dropdown, Mandal dropdown, Village, and AP map illustration
      ======================================================== */}
      <div id="card-location" className="bg-white rounded-3xl p-5 sm:p-6 border border-emerald-100 shadow-sm transition-all hover:shadow-md space-y-4">
        
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="relative w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200/80 flex items-center justify-center shrink-0">
            <MapPin className="w-7 h-7 text-[#0f5132]" />
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#0f5132] text-white text-[11px] font-black flex items-center justify-center shadow-xs">
              3
            </span>
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-black text-[#0f5132] leading-tight">
              {lang === 'te' ? 'ప్రాంతాన్ని ఎంచుకోండి' : 'Select Location'}
            </h3>
            <p className="text-xs text-stone-500 font-medium">
              {lang === 'te'
                ? 'దగ్గరి కొనుగోలుదారులను చేరడానికి మీ జిల్లా మరియు మండలాన్ని ఎంచుకోండి.'
                : 'Choose your district and mandal to reach nearby buyers.'}
            </p>
          </div>
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2 items-center">
          
          {/* Left Column: District, Mandal, Village Dropdowns */}
          <div className="space-y-3.5">
            {/* District Dropdown */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                {lang === 'te' ? 'జిల్లా (District)' : 'District'}
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select
                  value={district}
                  onChange={(e) => {
                    const newD = e.target.value;
                    setDistrict(newD);
                    const found = allDistricts.find(d => d.name === newD);
                    if (found && found.mandals.length > 0) {
                      setMandal(found.mandals[0].name);
                    }
                  }}
                  className="w-full bg-white border border-stone-300 rounded-2xl pl-10 pr-9 py-3 text-xs sm:text-sm font-bold text-stone-800 appearance-none focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-colors cursor-pointer min-h-[48px]"
                >
                  {allDistricts.map((d) => (
                    <option key={d.code} value={d.name}>
                      {lang === 'te' ? `${d.name} (${d.te})` : d.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-stone-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Mandal Dropdown */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                {lang === 'te' ? 'మండలం (Mandal)' : 'Mandal'}
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select
                  value={mandal}
                  onChange={(e) => {
                    setMandal(e.target.value);
                    setVillageSearch('');
                  }}
                  className="w-full bg-white border border-stone-300 rounded-2xl pl-10 pr-9 py-3 text-xs sm:text-sm font-bold text-stone-800 appearance-none focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-colors cursor-pointer min-h-[48px]"
                >
                  {mandalsList.map((m) => (
                    <option key={m.name} value={m.name}>
                      {lang === 'te' ? `${m.name} (${m.te})` : m.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-stone-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Village Selector */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                {lang === 'te' ? 'గ్రామం / ఊరు (Village)' : 'Village'}
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  className="w-full bg-white border border-stone-300 rounded-2xl pl-10 pr-9 py-3 text-xs sm:text-sm font-bold text-stone-800 appearance-none focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-colors cursor-pointer min-h-[48px]"
                >
                  {filteredVillages.map((v) => (
                    <option key={v.name} value={v.name}>
                      {lang === 'te' ? `${v.name} (${v.te})` : v.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-stone-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {village === 'Other village' && (
                <div className="mt-2.5">
                  <input
                    type="text"
                    value={otherVillageText}
                    onChange={(e) => setOtherVillageText(e.target.value)}
                    placeholder={lang === 'te' ? 'మీ ఊరు / గ్రామం పేరు ఇక్కడ రాయండి' : 'Type your village name here'}
                    className="w-full bg-white border-2 border-emerald-500 rounded-2xl px-4 py-2.5 text-xs font-bold text-stone-900 focus:outline-hidden"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Right Column: AP Visual Map Note with Orange Pin & Village matching image_dd8b4b08.png */}
          <div className="relative bg-gradient-to-br from-emerald-50/70 via-green-50/40 to-amber-50/50 rounded-3xl p-6 border border-emerald-100 flex flex-col items-center justify-center text-center overflow-hidden min-h-[220px]">
            {/* Visual AP landscape with village and palm trees */}
            <div className="relative w-full max-w-[220px] flex flex-col items-center">
              {/* AP Map Silhouette background */}
              <svg viewBox="0 0 220 120" fill="none" className="w-full opacity-60">
                <path d="M15 65C30 40 70 30 110 35C150 40 180 20 205 45C215 70 190 100 150 110C100 118 45 105 20 85Z" fill="#bbf7d0" />
                <path d="M40 70C60 50 90 45 130 50C160 55 180 40 195 55C200 70 180 90 145 98C105 105 60 95 40 80Z" fill="#86efac" />
              </svg>

              {/* Village cottage, palm tree & orange pin overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative flex flex-col items-center">
                  {/* Glowing Orange Map Pin in center */}
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#f05a22] to-amber-400 text-white flex items-center justify-center shadow-lg shadow-orange-500/35 mb-1.5 animate-bounce">
                    <MapPin className="w-6 h-6 fill-white text-orange-600" />
                  </div>

                  {/* Village houses & palm trees icons */}
                  <div className="text-xl sm:text-2xl select-none filter drop-shadow-xs mb-1">
                    🌴🏡🌴
                  </div>

                  {/* Handwritten style slogan matching image_dd8b4b08.png */}
                  <div className="rotate-[-2deg] select-none">
                    <span className="text-lg sm:text-xl font-black text-[#0f5132] tracking-tight block">Local</span>
                    <span className="text-sm sm:text-base font-black text-[#0f5132] tracking-tight block -mt-1">Reach</span>
                    <span className="text-sm sm:text-base font-black text-[#0f5132] tracking-tight block -mt-1">More</span>
                    <span className="text-lg sm:text-xl font-black text-[#0f5132] tracking-tight block -mt-1">Buyers</span>
                  </div>
                  <div className="w-16 h-1 bg-[#0f5132] rounded-full mt-1" />
                  <div className="w-10 h-0.5 bg-[#0f5132] rounded-full mt-0.5" />
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ========================================================
          CARD 4: STEP 4: MEDIA & CONTACT
          Matches EXACT layout from image_0bdbd5c7.png
      ======================================================== */}
      <div id="card-media" className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-xs transition-all hover:shadow-md space-y-5">
        
        {/* Header matching image_0bdbd5c7.png */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#faecd9] text-[#9a4b08] font-black text-sm flex items-center justify-center shrink-0">
            4
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-black text-stone-900 uppercase tracking-tight leading-tight">
              {lang === 'te' ? 'దశ 4: మీడియా & సంప్రదింపు' : 'STEP 4: MEDIA & CONTACT'}
            </h3>
            <p className="text-xs text-stone-500 font-normal">
              {lang === 'te'
                ? 'Upload photos (max 3), video and verify phone'
                : 'Upload photos (max 3), video and verify phone'}
            </p>
          </div>
        </div>

        <input
          ref={photoInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleImageUpload}
        />
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={handleImageUpload}
        />
        <input
          ref={videoInputRef}
          type="file"
          accept="video/*"
          className="hidden"
          onChange={handleVideoUpload}
        />

        {/* Section 1: PHOTOS (MAXIMUM 3) with 0/3 photos counter */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-stone-900 uppercase tracking-wide">
              {lang === 'te' ? 'ఫోటోలు (గరిష్టంగా 3)' : 'PHOTOS (MAXIMUM 3)'}
            </span>
            <span className="text-xs font-semibold text-stone-500">
              {images.length}/3 photos
            </span>
          </div>

          {/* Action Buttons: Take Photo (dashed orange) & From Gallery (solid border) */}
          <div className="grid grid-cols-2 gap-3">
            {/* Take Photo button */}
            <button
              type="button"
              onClick={() => cameraInputRef.current?.click()}
              disabled={images.length >= 3}
              className={`border-2 border-dashed border-[#ea580c] bg-white hover:bg-orange-50/50 text-[#ea580c] rounded-2xl py-3 sm:py-3.5 px-4 flex items-center justify-center gap-2 font-bold text-xs sm:text-sm transition-all cursor-pointer shadow-2xs active:scale-98 ${
                images.length >= 3 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <Camera className="w-4 h-4 text-[#ea580c] stroke-[2.2]" />
              <span>{lang === 'te' ? 'ఫోటో తీయండి' : 'Take Photo'}</span>
            </button>

            {/* From Gallery button */}
            <button
              type="button"
              onClick={() => photoInputRef.current?.click()}
              disabled={images.length >= 3}
              className={`border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 rounded-2xl py-3 sm:py-3.5 px-4 flex items-center justify-center gap-2 font-bold text-xs sm:text-sm transition-all cursor-pointer shadow-2xs active:scale-98 ${
                images.length >= 3 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <ImageIcon className="w-4 h-4 text-stone-500 stroke-[2.2]" />
              <span>{lang === 'te' ? 'గ్యాలరీ నుండి' : 'From Gallery'}</span>
            </button>
          </div>

          {/* Photo Previews with delete badge (up to 3) */}
          {images.length > 0 && (
            <div className="flex items-center gap-3 pt-1 overflow-x-auto">
              {images.map((imgUrl, idx) => (
                <div key={idx} className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border border-stone-200 shadow-2xs shrink-0 group">
                  <img src={imgUrl} alt={`Upload ${idx + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/70 hover:bg-red-600 text-white flex items-center justify-center transition-colors cursor-pointer shadow-xs"
                    title="Remove photo"
                  >
                    <X className="w-3.5 h-3.5 stroke-[2.5]" />
                  </button>
                  <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                    {idx + 1}/3
                  </span>
                </div>
              ))}
            </div>
          )}

          {compressing && (
            <p className="text-xs text-[#ea580c] font-bold animate-pulse">
              {lang === 'te' ? 'ఫోటో ఆప్టిమైజ్ చేయబడుతోంది...' : 'Optimizing photo for fast viewing...'}
            </p>
          )}
        </div>

        {/* Section 2: VIDEO (OPTIONAL, MAX 30S / 20MB) */}
        <div className="space-y-2">
          <span className="block text-xs font-black text-stone-900 uppercase tracking-wide">
            {lang === 'te' ? 'వీడియో (ఐచ్ఛికం, గరిష్టంగా 30S / 20MB)' : 'VIDEO (OPTIONAL, MAX 30S / 20MB)'}
          </span>

          {!videoUrl ? (
            <button
              type="button"
              onClick={() => videoInputRef.current?.click()}
              className="w-full border border-dashed border-stone-300 hover:border-blue-500 bg-white hover:bg-blue-50/20 rounded-2xl py-3 sm:py-3.5 px-4 flex items-center justify-center gap-2 font-semibold text-xs sm:text-sm text-stone-700 transition-all cursor-pointer shadow-2xs"
            >
              <Video className="w-4 h-4 text-blue-500 stroke-[2.2]" />
              <span>{lang === 'te' ? 'Attach Video (max 20MB)' : 'Attach Video (max 20MB)'}</span>
            </button>
          ) : (
            <div className="flex items-center justify-between p-3 bg-blue-50/60 border border-blue-200 rounded-2xl text-xs font-bold text-blue-950">
              <div className="flex items-center gap-2 truncate">
                <Video className="w-4 h-4 text-blue-600 shrink-0" />
                <span className="truncate">{videoName || 'Attached Video'}</span>
              </div>
              <button
                type="button"
                onClick={removeVideo}
                className="text-stone-400 hover:text-red-600 p-1 rounded-full cursor-pointer"
                title="Remove video"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Section 3: CONTACT PHONE NUMBER * */}
        <div className="space-y-2">
          <label className="block text-xs font-black text-stone-900 uppercase tracking-wide">
            {lang === 'te' ? 'సంప్రదించాల్సిన ఫోన్ నంబర్ *' : 'CONTACT PHONE NUMBER *'}
          </label>
          <div className="relative">
            <Phone className="w-4 h-4 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="tel"
              value={sellerPhone}
              onChange={(e) => setSellerPhone(e.target.value)}
              placeholder="e.g. 9876543210"
              className="w-full bg-stone-50/60 border border-stone-200 hover:border-stone-300 rounded-2xl pl-11 pr-4 py-3 text-xs sm:text-sm font-bold text-stone-900 placeholder:text-stone-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 focus:bg-white transition-all shadow-2xs"
              required
            />
          </div>
        </div>

      </div>

      {/* ========================================================
          BOTTOM ACTION BAR
          Matches image_dd8b4b08.png with < Back button, 
          large orange 🚀 Post Ad button, and verification disclaimer
      ======================================================== */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 pb-8">
        
        {/* Back Button */}
        <button
          type="button"
          onClick={() => setActiveTab('home')}
          className="inline-flex items-center gap-1.5 px-6 py-3 rounded-full bg-white hover:bg-stone-50 text-stone-700 border border-stone-300 font-bold text-xs sm:text-sm shadow-xs transition-all cursor-pointer active:scale-95 shrink-0"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{lang === 'te' ? 'వెనుకకు' : 'Back'}</span>
        </button>

        {/* Large Orange Post Ad Button */}
        <button
          type="button"
          disabled={submitting || compressing}
          onClick={handleFinalSubmit}
          className="w-full sm:w-auto min-w-[240px] px-8 py-3.5 rounded-full bg-[#f05a22] hover:bg-[#e04a14] active:scale-95 disabled:opacity-50 text-white font-extrabold text-sm sm:text-base shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          {submitting ? (
            <span>{lang === 'te' ? 'పోస్ట్ అవుతోంది...' : 'Posting...'}</span>
          ) : (
            <>
              <Send className="w-4 h-4 fill-white" />
              <span>{lang === 'te' ? 'ప్రకటన పోస్ట్ చేయండి' : 'Post Ad'}</span>
            </>
          )}
        </button>

        {/* Team verification notice on right */}
        <div className="flex items-center gap-1.5 text-[11px] text-stone-500 text-center sm:text-right shrink-0">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            {lang === 'te'
              ? 'మీ ప్రకటన మా బృందం ధృవీకరణ తర్వాత ప్రత్యక్ష ప్రసారం చేయబడుతుంది.'
              : 'Your ad will be live after our team verification.'}
          </span>
        </div>

      </div>

      {/* Decorative Corner Leaves matching image_dd8b4b08.png */}
      <div className="fixed bottom-0 left-0 pointer-events-none z-0 opacity-40 sm:opacity-80 select-none">
        <span className="text-4xl sm:text-5xl block transform -rotate-12 translate-y-3 -translate-x-2">🌿</span>
      </div>
      <div className="fixed bottom-0 right-0 pointer-events-none z-0 opacity-40 sm:opacity-80 select-none">
        <span className="text-4xl sm:text-5xl block transform scale-x-[-1] -rotate-12 translate-y-3 translate-x-2">🌿</span>
      </div>

    </div>
  );
};
