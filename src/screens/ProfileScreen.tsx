import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Listing } from '../types';
import { AP_DISTRICTS } from '../data/apLocations';
import { getMandalsForDistrict, getVillagesForMandal } from '../data/locationService';
import { ListingCard } from '../components/ListingCard';
import {
  User,
  Phone,
  Save,
  CheckCircle2,
  AlertCircle,
  Package,
  ShieldCheck,
  MapPin,
  Mail,
  Flame,
  Plus,
  Store,
  Sparkles,
  Globe,
  Download,
  Shield,
  Edit3,
  Trash2,
  Star,
  Search,
  Filter,
  Check,
  Eye,
  Sliders,
  Settings,
  UserCheck,
  Ban,
  LogOut,
  FileText,
  ShoppingBag,
  X
} from 'lucide-react';

export const ProfileScreen: React.FC = () => {
  const {
    lang,
    setLang,
    userProfile,
    currentUser,
    authLoading,
    loginWithGoogle,
    logout,
    saveUserProfile,
    listings,
    setSelectedListing,
    setActiveTab,
    showToast,
    isAdmin,
    deleteListing,
    toggleFeatureListing,
    updateListingStatus,
    blockedUserIds,
    blockUser,
    createListing
  } = useApp();

  const [activeTabName, setActiveTabName] = useState<'seller' | 'buyer' | 'admin' | 'edit'>('seller');

  // Ensure unauthorized users cannot access admin subtab
  useEffect(() => {
    if (activeTabName === 'admin' && !isAdmin) {
      setActiveTabName('seller');
    }
  }, [activeTabName, isAdmin]);

  // Admin preview mode (toggle to see what a regular farmer sees)
  const [previewAsUser, setPreviewAsUser] = useState<boolean>(false);

  // Form State - Starts empty with placeholders for new users, preserving real user values
  const [displayName, setDisplayName] = useState<string>(() => userProfile?.displayName || currentUser?.displayName || '');
  const [email, setEmail] = useState<string>(() => userProfile?.email || currentUser?.email || '');
  const [phone, setPhone] = useState<string>(() => {
    const p = userProfile?.phone || '';
    return (p === '9848012345' || p === '9848098765') ? '' : p;
  });
  const [district, setDistrict] = useState<string>(() => userProfile?.district || '');
  const [mandal, setMandal] = useState<string>(() => userProfile?.mandal || '');
  const [village, setVillage] = useState<string>(() => userProfile?.village || '');
  const [role, setRole] = useState<'seller' | 'buyer' | 'both'>(userProfile?.role || 'both');

  const [saving, setSaving] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  // Admin listing management filters
  const [adminSearch, setAdminSearch] = useState<string>('');
  const [adminCategoryFilter, setAdminCategoryFilter] = useState<string>('all');
  const [adminStatusFilter, setAdminStatusFilter] = useState<string>('all');

  // In-app Delete Confirmation Modal (avoids window.confirm blocks)
  const [listingToDelete, setListingToDelete] = useState<Listing | null>(null);
  const [deleting, setDeleting] = useState<boolean>(false);

  // Quick Add Listing Modal for Admin
  const [showQuickAddModal, setShowQuickAddModal] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('paddy_rice');
  const [newPrice, setNewPrice] = useState('');
  const [newPriceUnit, setNewPriceUnit] = useState('quintal');
  const [newDistrict, setNewDistrict] = useState('Nellore (SPSR Nellore)');
  const [newMandal, setNewMandal] = useState('Kavali');
  const [newSellerName, setNewSellerName] = useState('');
  const [newSellerPhone, setNewSellerPhone] = useState('');
  const [newQuantity, setNewQuantity] = useState('100');
  const [newQuantityUnit, setNewQuantityUnit] = useState('bags');
  const [creatingListing, setCreatingListing] = useState<boolean>(false);

  // Sync state when userProfile updates
  useEffect(() => {
    if (userProfile) {
      if (userProfile.displayName) setDisplayName(userProfile.displayName);
      if (userProfile.email) setEmail(userProfile.email);
      const cleanPhone = (userProfile.phone === '9848012345' || userProfile.phone === '9848098765') ? '' : (userProfile.phone || '');
      setPhone(cleanPhone);
      setDistrict(userProfile.district || '');
      setMandal(userProfile.mandal || '');
      setVillage(userProfile.village || '');
      if (userProfile.role) setRole(userProfile.role);
    }
  }, [userProfile]);

  // Mandals for selected district
  const mandals = useMemo(() => {
    return district ? getMandalsForDistrict(district) : [];
  }, [district]);

  // Villages for selected mandal
  const villages = useMemo(() => {
    return (district && mandal) ? getVillagesForMandal(district, mandal) : [];
  }, [district, mandal]);

  // Computed card location string
  const cardLocation = useMemo(() => {
    const v = (userProfile?.village !== undefined ? userProfile.village : village).trim();
    const m = (userProfile?.mandal !== undefined ? userProfile.mandal : mandal).trim();
    const d = (userProfile?.district !== undefined ? userProfile.district : district).trim();
    const parts = [v, m, d].filter(Boolean);
    if (parts.length > 0) return parts.join(', ');
    if (userProfile?.location) return userProfile.location;
    return '';
  }, [userProfile, village, mandal, district]);

  // User's own listings (matches across UID, sellerId, or sellerName)
  const currentUserId = currentUser?.uid || userProfile?.id || 'user_vasu_1';
  const myListings = useMemo(() => {
    const userIds = new Set([currentUser?.uid, userProfile?.id, currentUserId].filter(Boolean) as string[]);
    const userNames = new Set([
      displayName,
      currentUser?.displayName,
      userProfile?.displayName,
      userProfile?.name
    ].filter(Boolean).map(n => n!.toLowerCase().trim()));

    return listings.filter(l => {
      if (l.sellerId && userIds.has(l.sellerId)) return true;
      if (l.sellerName && userNames.has(l.sellerName.toLowerCase().trim())) return true;
      return false;
    });
  }, [listings, currentUserId, currentUser?.uid, currentUser?.displayName, userProfile?.id, userProfile?.displayName, userProfile?.name, displayName]);

  // Metrics
  const activeAdsCount = myListings.length;
  const totalViewsCount = myListings.reduce((sum, item) => sum + (item.views || 0), 0);
  const totalInquiriesCount = myListings.reduce((sum, item) => sum + (item.contactsCount || 0), 0);

  // Admin: Filtered platform listings for management
  const adminFilteredListings = useMemo(() => {
    return listings.filter(l => {
      if (adminCategoryFilter !== 'all' && l.category !== adminCategoryFilter) {
        return false;
      }
      if (adminStatusFilter !== 'all' && (l.status || 'active') !== adminStatusFilter) {
        return false;
      }
      if (adminSearch.trim()) {
        const q = adminSearch.toLowerCase().trim();
        const matchTitle = l.title.toLowerCase().includes(q);
        const matchSeller = (l.sellerName || '').toLowerCase().includes(q);
        const matchDistrict = (l.district || '').toLowerCase().includes(q);
        const matchMandal = (l.mandal || '').toLowerCase().includes(q);
        return matchTitle || matchSeller || matchDistrict || matchMandal;
      }
      return true;
    });
  }, [listings, adminCategoryFilter, adminStatusFilter, adminSearch]);

  // Quick switch role
  const handleSelectRole = async (newRole: 'seller' | 'buyer' | 'both') => {
    setRole(newRole);
    try {
      await saveUserProfile({ role: newRole });
    } catch {
      // safe fallback
    }
  };

  // Handle Save Profile Form
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!displayName.trim()) {
      setErrorMessage(lang === 'te' ? 'దయచేసి మీ పేరును నమోదు చేయండి.' : 'Please enter your name.');
      return;
    }

    if (phone.trim() && !/^\d{10}$/.test(phone.replace(/\D/g, ''))) {
      setErrorMessage(
        lang === 'te'
          ? 'దయచేసి సరైన 10 అంకెల ఫోన్ నంబర్‌ను నమోదు చేయండి.'
          : 'Please enter a valid 10-digit phone number.'
      );
      return;
    }

    setSaving(true);
    try {
      const trimmedVillage = village.trim();
      const locationParts = [trimmedVillage, mandal, district].filter(Boolean);
      const computedLocation = locationParts.join(', ');

      const updatedProfile = {
        displayName: displayName.trim(),
        name: displayName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        district: district || '',
        mandal: mandal || '',
        village: trimmedVillage,
        location: computedLocation,
        role,
        isAdmin: isAdmin
      };

      const success = await saveUserProfile(updatedProfile);

      if (success) {
        const msg = lang === 'te'
          ? 'మీ ప్రొఫైల్ విజయవంతంగా సేవ్ చేయబడింది!'
          : 'Profile saved successfully!';
        setSuccessMessage(msg);
        showToast(msg, 'success');
        setTimeout(() => {
          setSuccessMessage('');
          setActiveTabName('seller');
        }, 1200);
      } else {
        setErrorMessage(
          lang === 'te'
            ? 'ప్రొఫైల్ సేవ్ విఫలమైంది. దయచేసి మళ్లీ ప్రయత్నించండి.'
            : 'Failed to save profile. Please try again.'
        );
      }
    } catch (err: any) {
      console.error('Save error:', err);
      setErrorMessage(err.message || 'Error saving profile');
    } finally {
      setSaving(false);
    }
  };

  const roleText = role === 'both'
    ? 'Seller & Buyer'
    : role === 'seller'
    ? 'Seller'
    : 'Buyer';

  const avatarInitial = displayName ? displayName.trim().charAt(0).toUpperCase() : 'V';
  const showAdminFeatures = isAdmin && !previewAsUser;

  // Auth state restoration loading spinner (prevents login screen flash on refresh)
  if (authLoading) {
    return (
      <div className="min-h-screen bg-stone-50 pb-28 pt-20 px-4 flex flex-col items-center justify-center">
        <div className="w-8 h-8 border-3 border-[#F26A1B] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // If user is not logged in, show "Join SanthaKart" screen (Matching user's attachment)
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-stone-50 pb-28 pt-8 px-4 flex flex-col items-center justify-start">
        <div className="max-w-md w-full space-y-4">
          
          {/* Top Brand Glow Icon */}
          <div className="flex justify-center -mb-2">
            <div className="w-16 h-16 rounded-full bg-gradient-to-b from-orange-400 to-orange-500 text-white flex items-center justify-center shadow-lg shadow-orange-500/30">
              <Store className="w-8 h-8 text-white stroke-[2.2]" />
            </div>
          </div>

          {/* Heading & Subtitle */}
          <div className="text-center space-y-1">
            <h1 className="text-2xl font-black text-stone-900 tracking-tight">
              Join SanthaKart
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 font-medium max-w-xs mx-auto">
              Trusted rural & agricultural marketplace for Andhra Pradesh
            </p>
          </div>

          {/* Two Side-by-Side Cards (For Sellers & For Buyers) */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            {/* For Sellers */}
            <div className="bg-amber-50/60 border border-amber-200/90 rounded-2xl p-3.5 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-black text-stone-900">
                <Store className="w-4 h-4 text-orange-600 shrink-0" />
                <span>For Sellers</span>
              </div>
              <p className="text-[11px] text-stone-600 font-medium leading-snug">
                Post crops, livestock, rentals 100% free
              </p>
            </div>

            {/* For Buyers */}
            <div className="bg-emerald-50/60 border border-emerald-200/90 rounded-2xl p-3.5 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-black text-stone-900">
                <ShoppingBag className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>For Buyers</span>
              </div>
              <p className="text-[11px] text-stone-600 font-medium leading-snug">
                Direct calls & WhatsApp with genuine farmers
              </p>
            </div>
          </div>

          {/* Launch Offer: All Features FREE! */}
          <div className="bg-amber-50/50 border border-amber-200/80 rounded-2xl p-3.5 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-black text-stone-900">
              <Sparkles className="w-4 h-4 text-orange-500 shrink-0" />
              <span>Launch Offer: All Features FREE!</span>
            </div>
            <p className="text-[11px] text-stone-600 font-medium leading-snug">
              Creating an account and posting listings is 100% free during our launch period!
            </p>
          </div>

          {/* Primary Action: Sign in with Google */}
          <div className="pt-2 space-y-3">
            <button
              onClick={() => loginWithGoogle()}
              className="w-full py-3.5 px-4 bg-[#f05a22] hover:bg-[#e04a14] active:scale-98 text-white rounded-2xl font-extrabold text-sm shadow-md shadow-orange-500/25 flex items-center justify-center gap-2.5 transition-all cursor-pointer"
            >
              <svg className="w-4 h-4 fill-white shrink-0" viewBox="0 0 24 24">
                <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z"/>
              </svg>
              <span>Sign in with Google</span>
            </button>

            {/* Secondary Action: Instant Quick Login / Domain Help */}
            <button
              onClick={() => loginWithGoogle()}
              className="w-full py-3 px-4 bg-white hover:bg-stone-50 active:scale-98 text-stone-800 border border-stone-200 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-2xs transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-orange-500" />
              <span>Instant Quick Login / Domain Help</span>
            </button>
          </div>

          {/* Version Footer */}
          <div className="pt-6 text-center text-xs text-stone-400 font-semibold">
            Version 2.0.0
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 pb-28 pt-3 px-3 sm:px-4">
      <div className="max-w-xl mx-auto space-y-4">

        {/* Admin Preview Mode Indicator Bar */}
        {isAdmin && previewAsUser && (
          <div className="p-3 bg-amber-500 text-white rounded-2xl flex items-center justify-between text-xs font-bold shadow-sm">
            <span>👀 Previewing Profile as Regular User</span>
            <button
              onClick={() => setPreviewAsUser(false)}
              className="bg-white text-amber-900 px-3 py-1 rounded-xl shadow-xs hover:bg-amber-50 cursor-pointer"
            >
              Exit to Admin Mode
            </button>
          </div>
        )}

        {/* 1. TOP USER CARD (Matching image_91219608.png) */}
        <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs p-4 sm:p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              {/* Purple Circle Avatar with letter 'V' */}
              <div className="w-14 h-14 rounded-2xl bg-[#a855f7] text-white flex items-center justify-center font-bold text-2xl shadow-sm shrink-0">
                {avatarInitial}
              </div>

              <div>
                <h1 className="text-base sm:text-lg font-black text-stone-900 leading-tight">
                  {displayName || currentUser?.displayName || (lang === 'te' ? 'రైతు మిత్రుడు' : 'Farmer Member')}
                </h1>
                {Boolean(email || currentUser?.email) && (
                  <p className="text-xs text-stone-500 font-medium mt-0.5">
                    {email || currentUser?.email}
                  </p>
                )}
                <p className="text-xs font-medium flex items-center gap-1 mt-1 text-stone-600">
                  <Phone className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  <span className={phone ? 'text-stone-700' : 'text-stone-400 italic'}>
                    {phone || 'Add your phone number'}
                  </span>
                </p>
                <p className="text-xs font-medium flex items-center gap-1 mt-1 text-stone-600">
                  <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                  <span className={cardLocation ? 'text-stone-700 font-semibold' : 'text-stone-400 italic'}>
                    {cardLocation || 'Add your location'}
                  </span>
                </p>
              </div>
            </div>

            {/* Admin Badge (shown only for Admin) */}
            {showAdminFeatures ? (
              <button
                onClick={() => setActiveTabName(activeTabName === 'admin' ? 'seller' : 'admin')}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-300 text-amber-800 text-xs font-bold shadow-2xs hover:bg-amber-100 transition-colors cursor-pointer"
                title="Click to open Full Admin Console"
              >
                <Shield className="w-3.5 h-3.5 text-amber-600" />
                <span>Admin (Full Access)</span>
              </button>
            ) : null}
          </div>

          {/* Account Role label & Pill Selector */}
          <div className="mt-4 pt-3 border-t border-stone-100">
            <div className="flex items-center justify-between text-xs font-bold mb-2">
              <span className="text-stone-500 tracking-wider uppercase text-[11px]">ACCOUNT ROLE:</span>
              <span className="text-orange-600 flex items-center gap-1">
                🌾 {roleText}
              </span>
            </div>

            <div className="bg-stone-100/90 p-1 rounded-2xl flex items-center gap-1">
              <button
                type="button"
                onClick={() => handleSelectRole('seller')}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  role === 'seller'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                <span>🧑‍🌾</span>
                <span>Seller</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectRole('buyer')}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  role === 'buyer'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                <span>🛒</span>
                <span>Buyer</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectRole('both')}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  role === 'both'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                <span>👑</span>
                <span>Both</span>
              </button>
            </div>
          </div>

          {/* Sub-Tabs: [Seller Hub] [Buyer Hub] [Admin Console (if admin)] [Edit Profile] */}
          <div className="flex items-center gap-3 sm:gap-5 mt-4 pt-3 border-t border-stone-100 text-xs sm:text-sm overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveTabName('seller')}
              className={`pb-2 font-black flex items-center gap-1.5 cursor-pointer whitespace-nowrap transition-all border-b-2 ${
                activeTabName === 'seller'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              <span>🧑‍🌾</span>
              <span>⚡ Seller Hub ({activeAdsCount})</span>
            </button>

            <button
              onClick={() => setActiveTabName('buyer')}
              className={`pb-2 font-black flex items-center gap-1.5 cursor-pointer whitespace-nowrap transition-all border-b-2 ${
                activeTabName === 'buyer'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              <span>🛒</span>
              <span>⚡ Buyer Hub</span>
            </button>

            {showAdminFeatures && (
              <button
                onClick={() => setActiveTabName('admin')}
                className={`pb-2 font-black flex items-center gap-1.5 cursor-pointer whitespace-nowrap transition-all border-b-2 ${
                  activeTabName === 'admin'
                    ? 'border-emerald-600 text-emerald-700'
                    : 'border-transparent text-stone-500 hover:text-emerald-700'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Admin Console ({listings.length})</span>
              </button>
            )}

            <button
              onClick={() => setActiveTabName('edit')}
              className={`pb-2 font-black flex items-center gap-1.5 cursor-pointer whitespace-nowrap transition-all border-b-2 ${
                activeTabName === 'edit'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Profile</span>
            </button>
          </div>
        </div>

        {/* 2. ADMIN CONSOLE: FULL ACCESS PLATFORM MANAGEMENT (Admin Only) */}
        {showAdminFeatures && activeTabName === 'admin' && (
          <div className="space-y-4">
            {/* Admin Header Box */}
            <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 rounded-3xl p-5 text-white shadow-md">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/30 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-amber-300" />
                  </div>
                  <div>
                    <h2 className="font-black text-base tracking-tight leading-tight">Admin Full Access Center</h2>
                    <p className="text-xs text-emerald-200">Logged in as System Admin ({email})</p>
                  </div>
                </div>

                <button
                  onClick={() => setPreviewAsUser(true)}
                  className="bg-white/15 hover:bg-white/25 border border-white/20 text-white font-bold text-xs px-3 py-1.5 rounded-full flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View As User</span>
                </button>
              </div>

              {/* Platform Metrics */}
              <div className="grid grid-cols-4 gap-2 pt-2 border-t border-emerald-700/60 text-center">
                <div className="bg-white/10 rounded-xl py-2 px-1">
                  <div className="text-xl font-black">{listings.length}</div>
                  <div className="text-[10px] text-emerald-200">Total Ads</div>
                </div>
                <div className="bg-white/10 rounded-xl py-2 px-1">
                  <div className="text-xl font-black">{listings.filter(l => l.featured).length}</div>
                  <div className="text-[10px] text-amber-300 font-bold">Featured</div>
                </div>
                <div className="bg-white/10 rounded-xl py-2 px-1">
                  <div className="text-xl font-black">{new Set(listings.map(l => l.district)).size}</div>
                  <div className="text-[10px] text-emerald-200">Districts</div>
                </div>
                <div className="bg-white/10 rounded-xl py-2 px-1">
                  <div className="text-xl font-black">{new Set(listings.map(l => l.sellerId)).size}</div>
                  <div className="text-[10px] text-emerald-200">Sellers</div>
                </div>
              </div>
            </div>

            {/* Admin Listing Management Card */}
            <div className="bg-white rounded-3xl border border-stone-200 p-4 sm:p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-stone-900 text-sm flex items-center gap-1.5">
                    <Sliders className="w-4 h-4 text-emerald-700" />
                    <span>Manage All Platform Listings ({adminFilteredListings.length})</span>
                  </h3>
                  <p className="text-[11px] text-stone-500">Edit, feature, or delete any listing across Andhra Pradesh</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setNewSellerName(displayName || 'Admin');
                      setNewSellerPhone(phone || '');
                      setShowQuickAddModal(true);
                    }}
                    className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-2xs cursor-pointer transition-colors"
                    title="Quickly add a listing from Admin Console"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Quick Add</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('sell')}
                    className="px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-2xs cursor-pointer transition-colors"
                    title="Open Full Post Ad Form"
                  >
                    <span>Full Form</span>
                  </button>
                </div>
              </div>

              {/* Search & Filter bar */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                <div className="sm:col-span-2 relative">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={adminSearch}
                    onChange={(e) => setAdminSearch(e.target.value)}
                    placeholder="Search by title, seller, or district..."
                    className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium focus:outline-hidden focus:border-emerald-600"
                  />
                </div>

                <select
                  value={adminCategoryFilter}
                  onChange={(e) => setAdminCategoryFilter(e.target.value)}
                  className="p-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium focus:outline-hidden focus:border-emerald-600"
                >
                  <option value="all">All Categories</option>
                  <option value="paddy_rice">Paddy & Rice</option>
                  <option value="vegetables_fruits">Vegetables & Fruits</option>
                  <option value="aqua">Aqua</option>
                  <option value="livestock">Livestock</option>
                  <option value="other">Other / Machinery</option>
                </select>
              </div>

              {/* Admin Listings List */}
              <div className="divide-y divide-stone-100 max-h-[500px] overflow-y-auto pr-1">
                {adminFilteredListings.length > 0 ? (
                  adminFilteredListings.map((item) => (
                    <div key={item.id} className="py-3 flex items-center justify-between gap-3 hover:bg-stone-50 px-2 rounded-xl transition-colors">
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={item.images?.[0] || '/assets/bpt_5204_rice.jpg'}
                          alt={item.title}
                          className="w-12 h-12 rounded-xl object-cover shrink-0 border border-stone-200"
                        />
                        <div className="min-w-0">
                          <h4 className="font-bold text-xs text-stone-900 truncate">
                            {item.title}
                          </h4>
                          <p className="text-[11px] text-stone-500 truncate">
                            ₹{item.price.toLocaleString('en-IN')} • {item.sellerName || 'Farmer'} • 📍 {item.mandal || item.district}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            {item.featured && (
                              <span className="bg-amber-100 text-amber-800 text-[10px] font-black px-2 py-0.5 rounded-full border border-amber-300">
                                ⭐ Featured
                              </span>
                            )}
                            <span className="text-[10px] text-stone-400">
                              Views: {item.views || 0}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Admin Controls for this listing */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        {/* Toggle Featured */}
                        <button
                          onClick={() => toggleFeatureListing(item.id)}
                          className={`p-2 rounded-xl border text-xs font-bold cursor-pointer transition-colors ${
                            item.featured
                              ? 'bg-amber-500 text-white border-amber-500'
                              : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-amber-50 hover:text-amber-700'
                          }`}
                          title={item.featured ? 'Remove from Featured' : 'Feature this Ad'}
                        >
                          <Star className={`w-3.5 h-3.5 ${item.featured ? 'fill-white' : ''}`} />
                        </button>

                        {/* View Listing */}
                        <button
                          onClick={() => {
                            setSelectedListing(item);
                            setActiveTab('detail');
                          }}
                          className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-200 cursor-pointer"
                          title="View Listing Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete Listing */}
                        <button
                          onClick={() => setListingToDelete(item)}
                          className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 cursor-pointer"
                          title="Delete Listing"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center text-xs text-stone-400">
                    No listings match the filter.
                  </div>
                )}
              </div>
            </div>

            {/* Quick System Tools for Admin */}
            <div className="bg-white rounded-3xl border border-stone-200 p-4 shadow-xs">
              <h4 className="font-extrabold text-stone-900 text-xs mb-2">Admin System Tools</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  onClick={() => {
                    localStorage.removeItem('santhalo_listings_cache');
                    showToast('Cache cleared. Refreshing latest data...', 'info');
                    setTimeout(() => window.location.reload(), 800);
                  }}
                  className="p-2.5 bg-stone-50 hover:bg-stone-100 rounded-xl border border-stone-200 font-bold text-stone-700 text-left flex items-center gap-2 cursor-pointer"
                >
                  <Sliders className="w-4 h-4 text-emerald-600" />
                  <span>Reload Fresh Data</span>
                </button>
                <button
                  onClick={() => showToast('All users verified for launch period!', 'success')}
                  className="p-2.5 bg-stone-50 hover:bg-stone-100 rounded-xl border border-stone-200 font-bold text-stone-700 text-left flex items-center gap-2 cursor-pointer"
                >
                  <UserCheck className="w-4 h-4 text-emerald-600" />
                  <span>Verify All Sellers</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 3. TAB: SELLER HUB (User & Admin Personal Listings) */}
        {activeTabName === 'seller' && (
          <div className="space-y-4">
            {/* Orange Seller Dashboard Card */}
            <div className="bg-gradient-to-r from-orange-500 via-orange-500 to-orange-600 rounded-3xl p-5 text-white shadow-md shadow-orange-500/20">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Flame className="w-5 h-5 text-amber-200 fill-amber-200" />
                  <div>
                    <h2 className="font-black text-base tracking-tight leading-tight">Seller Dashboard</h2>
                    <p className="text-xs text-orange-100 font-medium">Your posted listings and buyer inquiries</p>
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab('sell')}
                  className="bg-white hover:bg-orange-50 text-orange-600 font-black text-xs px-3.5 py-1.5 rounded-full flex items-center gap-1 shadow-xs transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Post Ad</span>
                </button>
              </div>

              {/* 3 Metric Tiles */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                <div className="bg-white/15 backdrop-blur-xs rounded-2xl py-3 px-2 text-center border border-white/10">
                  <div className="text-2xl font-black">{activeAdsCount}</div>
                  <div className="text-[11px] text-white/90 font-semibold mt-0.5">Active Ads</div>
                </div>

                <div className="bg-white/15 backdrop-blur-xs rounded-2xl py-3 px-2 text-center border border-white/10">
                  <div className="text-2xl font-black">{totalViewsCount}</div>
                  <div className="text-[11px] text-white/90 font-semibold mt-0.5">Total Views</div>
                </div>

                <div className="bg-white/15 backdrop-blur-xs rounded-2xl py-3 px-2 text-center border border-white/10">
                  <div className="text-2xl font-black">{totalInquiriesCount}</div>
                  <div className="text-[11px] text-white/90 font-semibold mt-0.5">Inquiries</div>
                </div>
              </div>
            </div>

            {/* My Listings Section */}
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-base font-extrabold text-stone-900">
                  My Listings ({activeAdsCount})
                </h3>
                <button
                  onClick={() => setActiveTab('sell')}
                  className="text-xs font-bold text-orange-600 hover:text-orange-700 cursor-pointer"
                >
                  + Add New
                </button>
              </div>

              {myListings.length > 0 ? (
                <div className="grid grid-cols-2 gap-3">
                  {myListings.map((listing) => (
                    <div key={listing.id} className="relative group">
                      <ListingCard
                        listing={listing}
                        onClick={() => {
                          setSelectedListing(listing);
                          setActiveTab('detail');
                        }}
                      />
                      {/* Delete button on user's own listing */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setListingToDelete(listing);
                        }}
                        className="absolute top-2 right-2 p-1.5 bg-red-600/90 hover:bg-red-700 text-white rounded-lg shadow-md transition-all cursor-pointer z-10"
                        title="Delete listing"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-3xl border border-stone-200/80 p-8 text-center shadow-xs">
                  <div className="w-14 h-14 rounded-full bg-orange-100/70 text-orange-600 flex items-center justify-center mx-auto mb-3 shadow-inner">
                    <Store className="w-7 h-7 text-orange-600" />
                  </div>
                  <h4 className="font-extrabold text-stone-900 text-sm">No listings posted yet</h4>
                  <p className="text-xs text-stone-500 mt-1.5 max-w-xs mx-auto leading-relaxed">
                    Post paddy, chilli, cattle, tractor rental, or land lease ads for free.
                  </p>
                  <button
                    onClick={() => setActiveTab('sell')}
                    className="mt-4 px-6 py-2.5 bg-[#ea580c] hover:bg-orange-600 active:scale-98 text-white rounded-full text-xs font-black transition-all cursor-pointer shadow-md shadow-orange-600/20 inline-flex items-center gap-2"
                  >
                    <span>🎯</span>
                    <span>Post an Ad Now (100% Free)</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 4. TAB: BUYER HUB */}
        {activeTabName === 'buyer' && (
          <div className="space-y-4">
            <div className="bg-white rounded-3xl border border-stone-200/80 p-6 text-center shadow-xs">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3">
                <Store className="w-7 h-7" />
              </div>
              <h3 className="font-extrabold text-stone-900 text-sm">Buyer Hub</h3>
              <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto">
                Explore local mandal crops, fresh harvest, and connect directly with verified farmers.
              </p>
              <button
                onClick={() => setActiveTab('home')}
                className="mt-4 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full text-xs font-black cursor-pointer shadow-xs"
              >
                Browse Marketplace
              </button>
            </div>
          </div>
        )}

        {/* 5. TAB: EDIT PROFILE */}
        {activeTabName === 'edit' && (
          <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs p-5 sm:p-6">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-stone-100">
              <h2 className="text-base font-extrabold text-stone-900 flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-orange-600" />
                <span>Edit Profile Details</span>
              </h2>
              <button
                onClick={() => setActiveTabName('seller')}
                className="text-xs text-stone-500 hover:text-stone-800 font-bold cursor-pointer"
              >
                Back to Dashboard
              </button>
            </div>

            {errorMessage && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-2 text-xs text-red-700">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}
            {successMessage && (
              <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2 text-xs text-emerald-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-stone-800 block mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="vasu kannaluri"
                    className="w-full pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-medium text-stone-900 focus:outline-hidden focus:border-orange-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-800 block mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="vasu.kannaluri@gmail.com"
                    className="w-full pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-medium text-stone-900 focus:outline-hidden focus:border-orange-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-800 block mb-1">
                  Contact Phone Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Add your phone number"
                    maxLength={10}
                    className="w-full pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-medium text-stone-900 focus:outline-hidden focus:border-orange-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-800 block mb-1">
                  District
                </label>
                <select
                  value={district}
                  onChange={(e) => {
                    const nextD = e.target.value;
                    setDistrict(nextD);
                    setMandal('');
                    setVillage('');
                  }}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-medium text-stone-900 focus:outline-hidden focus:border-orange-500"
                >
                  <option value="">-- Add your location --</option>
                  {AP_DISTRICTS.map((d) => (
                    <option key={d.name} value={d.name}>
                      {d.name} {d.te ? `(${d.te})` : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-stone-800 block mb-1">
                  Mandal
                </label>
                <select
                  value={mandal}
                  onChange={(e) => {
                    setMandal(e.target.value);
                    setVillage('');
                  }}
                  disabled={!district}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-medium text-stone-900 focus:outline-hidden focus:border-orange-500 disabled:opacity-50"
                >
                  <option value="">{district ? '-- Select Mandal --' : '-- Add your location --'}</option>
                  {mandals.map((m) => (
                    <option key={m.name} value={m.name}>
                      {m.name} {m.te ? `(${m.te})` : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-stone-800 block mb-1">
                  Village / Area
                </label>
                {villages.length > 0 ? (
                  <select
                    value={village}
                    onChange={(e) => setVillage(e.target.value)}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-medium text-stone-900 focus:outline-hidden focus:border-orange-500 mb-2"
                  >
                    <option value="">-- Select Village --</option>
                    {villages.map((v) => (
                      <option key={v.name} value={v.name}>
                        {v.name} {v.te ? `(${v.te})` : ''}
                      </option>
                    ))}
                  </select>
                ) : null}
                <input
                  type="text"
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  placeholder="Add your location"
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-medium text-stone-900 focus:outline-hidden focus:border-orange-500"
                />
              </div>

              <div>
                <label className="font-bold text-stone-800 block mb-1">
                  Account Role
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['seller', 'buyer', 'both'] as const).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      className={`py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        role === r
                          ? 'bg-orange-500 text-white border-orange-500 shadow-xs'
                          : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      {r === 'both' ? '👑 Both' : r === 'seller' ? '🧑‍🌾 Seller' : '🛒 Buyer'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full py-3 bg-[#ea580c] hover:bg-orange-600 active:scale-98 text-white rounded-xl font-black text-sm shadow-md shadow-orange-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? 'Saving Profile...' : 'Save Profile'}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* 6. SANTHAKART PREMIUM FEATURES BANNER */}
        <div className="bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50 rounded-3xl border border-orange-200/70 p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 font-extrabold text-stone-900 text-sm">
              <Sparkles className="w-4 h-4 text-orange-600" />
              <span>SanthaKart Premium Features</span>
            </div>
            <span className="bg-gradient-to-r from-orange-600 to-red-500 text-white font-black text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider shadow-2xs">
              FREE UNTIL 2027-04-16
            </span>
          </div>

          <p className="text-xs text-stone-600 mt-1.5">
            Currently 100% FREE for all users during our Launch Period!
          </p>

          <button
            onClick={() => showToast('Premium features unlocked for your account until 2027-04-16!', 'info')}
            className="text-xs font-bold text-orange-600 hover:text-orange-700 mt-2 inline-flex items-center gap-1 cursor-pointer"
          >
            <span>View Premium Features</span>
            <span>→</span>
          </button>
        </div>

        {/* 7. SETTINGS CARD (Matching user reference image) */}
        <div className="bg-white rounded-3xl border border-stone-200/80 divide-y divide-stone-100 shadow-xs overflow-hidden">
          {/* Change Language */}
          <button
            onClick={() => setLang(lang === 'te' ? 'en' : 'te')}
            className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-stone-50 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <Globe className="w-4 h-4 text-stone-500" />
              <span className="text-xs font-bold text-stone-800">
                {lang === 'te' ? 'భాషను ఇంగ్లీష్‌కి మార్చండి' : 'Change Language to Telugu'}
              </span>
            </div>
            <span className="text-xs font-bold text-orange-600">
              {lang === 'te' ? 'English' : 'తెలుగు'}
            </span>
          </button>

          {/* What is Admin Role? (Powers & Policies) */}
          <button
            onClick={() => {
              if (isAdmin) {
                setActiveTabName('admin');
              } else {
                showToast('Admin role manages verified platform listings and community moderation.', 'info');
              }
            }}
            className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-stone-50 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <Shield className="w-4 h-4 text-orange-500" />
              <span className="text-xs font-bold text-stone-800">What is Admin Role? (Powers & Policies)</span>
            </div>
            <span className="text-xs font-bold text-orange-600 flex items-center gap-0.5">
              <span>Manage</span>
              <span>→</span>
            </span>
          </button>

          {/* Get App */}
          <button
            onClick={() => setActiveTab('download')}
            className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-stone-50 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <Download className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-bold text-stone-800">Get the Santhalo App (Install / APK)</span>
            </div>
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-0.5">
              <span>Free</span>
              <span>→</span>
            </span>
          </button>

          {/* Privacy Policy (Google Play) */}
          <button
            onClick={() => showToast('Opening Google Play Privacy Policy...', 'info')}
            className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-stone-50 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-bold text-stone-800">Privacy Policy (Google Play)</span>
            </div>
            <span className="text-xs font-bold text-stone-400">→</span>
          </button>

          {/* Terms of Service & Privacy Policy */}
          <button
            onClick={() => showToast('Opening Terms of Service & Privacy Policy...', 'info')}
            className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-stone-50 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <FileText className="w-4 h-4 text-stone-500" />
              <span className="text-xs font-bold text-stone-800">Terms of Service & Privacy Policy</span>
            </div>
            <span className="text-xs font-bold text-stone-400">→</span>
          </button>

          {/* Sign Out */}
          <button
            onClick={logout}
            className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-stone-50 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <LogOut className="w-4 h-4 text-stone-500" />
              <span className="text-xs font-bold text-stone-800">Sign Out</span>
            </div>
            <span className="text-xs font-bold text-stone-400">→</span>
          </button>
        </div>

        {/* Delete My Account */}
        <div className="text-center pt-2">
          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                localStorage.removeItem('santhalo_user_profile');
                localStorage.removeItem('santhalo_auth_user');
                logout();
                showToast('Account deleted successfully.', 'info');
              }
            }}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-700 cursor-pointer py-2 px-3 rounded-xl hover:bg-red-50 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5 text-red-600" />
            <span>Delete My Account</span>
          </button>
        </div>

        {/* Version Footer */}
        <div className="text-center text-xs text-stone-400 font-semibold pt-1">
          Version 2.0.0
        </div>

      </div>

      {/* IN-APP DELETE LISTING CONFIRMATION MODAL (Safe for iframes & mobile) */}
      {listingToDelete && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                <Trash2 className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div>
                <h3 className="font-extrabold text-stone-900 text-base leading-tight">
                  Delete Listing?
                </h3>
                <p className="text-xs text-stone-500 font-medium">
                  This action permanently removes the ad.
                </p>
              </div>
            </div>

            <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200/80 flex items-center gap-3">
              <img
                src={listingToDelete.images?.[0] || '/assets/bpt_5204_rice.jpg'}
                alt={listingToDelete.title}
                className="w-12 h-12 rounded-xl object-cover border border-stone-200 shrink-0"
              />
              <div className="min-w-0">
                <div className="font-bold text-xs text-stone-900 truncate">
                  {listingToDelete.title}
                </div>
                <div className="text-[11px] text-stone-500 truncate">
                  ₹{listingToDelete.price.toLocaleString('en-IN')} • {listingToDelete.mandal || listingToDelete.district}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                disabled={deleting}
                onClick={() => setListingToDelete(null)}
                className="flex-1 py-2.5 px-4 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={async () => {
                  setDeleting(true);
                  try {
                    await deleteListing(listingToDelete.id);
                  } finally {
                    setDeleting(false);
                    setListingToDelete(null);
                  }
                }}
                className="flex-1 py-2.5 px-4 bg-red-600 hover:bg-red-700 active:scale-98 text-white rounded-xl text-xs font-black shadow-md shadow-red-600/20 transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
              >
                {deleting ? 'Deleting...' : 'Delete Ad'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QUICK ADD LISTING MODAL (FOR ADMINS) */}
      {showQuickAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-stone-200 overflow-hidden text-stone-900">
            <div className="p-4 border-b border-stone-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <Plus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-stone-900">Admin Quick Add Listing</h3>
                  <p className="text-[11px] text-stone-500">Publish a new verified listing instantly</p>
                </div>
              </div>
              <button
                onClick={() => setShowQuickAddModal(false)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!newTitle.trim() || !newPrice.trim()) {
                  showToast('Please enter Title and Price', 'error');
                  return;
                }
                setCreatingListing(true);
                try {
                  const categoryImageMap: Record<string, string> = {
                    paddy_rice: '/assets/bpt_5204_rice.jpg',
                    vegetables_fruits: '/assets/tender_coconuts.png',
                    aqua: '/assets/categories/aqua_fisheries.png',
                    livestock: '/assets/nellore_jodipi_2.jpg',
                    other: '/assets/mahindra_575_di.jpg'
                  };
                  const res = await createListing({
                    title: newTitle.trim(),
                    category: newCategory,
                    price: Number(newPrice) || 0,
                    priceUnit: newPriceUnit,
                    quantity: `${newQuantity} ${newQuantityUnit}`,
                    district: newDistrict,
                    mandal: newMandal,
                    village: 'Kavali Town',
                    sellerName: newSellerName.trim() || displayName || 'Admin Seller',
                    sellerPhone: newSellerPhone.trim() || phone || '',
                    images: [categoryImageMap[newCategory] || '/assets/bpt_5204_rice.jpg']
                  });
                  if (res && res.success) {
                    setShowQuickAddModal(false);
                    setNewTitle('');
                    setNewPrice('');
                  }
                } finally {
                  setCreatingListing(false);
                }
              }}
              className="p-4 space-y-3 text-xs max-h-[75vh] overflow-y-auto"
            >
              <div>
                <label className="font-bold text-stone-800 block mb-1">Category *</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-medium focus:outline-hidden focus:border-emerald-600"
                >
                  <option value="paddy_rice">Paddy & Rice (వరి & బియ్యం)</option>
                  <option value="vegetables_fruits">Vegetables & Fruits (కూరగాయలు & పండ్లు)</option>
                  <option value="aqua">Aqua (ఆక్వా & రొయ్యలు)</option>
                  <option value="livestock">Livestock (పశువులు & జీవాలు)</option>
                  <option value="other">Other / Machinery (ట్రాక్టర్లు & యంత్రాలు)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-stone-800 block mb-1">Listing Title *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Nellore High Grade Paddy 150 Bags"
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-medium focus:outline-hidden focus:border-emerald-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-stone-800 block mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    placeholder="2500"
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-medium focus:outline-hidden focus:border-emerald-600"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-800 block mb-1">Unit</label>
                  <select
                    value={newPriceUnit}
                    onChange={(e) => setNewPriceUnit(e.target.value)}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-medium focus:outline-hidden focus:border-emerald-600"
                  >
                    <option value="quintal">per quintal</option>
                    <option value="kg">per kg</option>
                    <option value="bag">per bag</option>
                    <option value="piece">per piece</option>
                    <option value="pair">per pair</option>
                    <option value="acre">per acre</option>
                    <option value="hour">per hour</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-stone-800 block mb-1">District</label>
                  <input
                    type="text"
                    value={newDistrict}
                    onChange={(e) => setNewDistrict(e.target.value)}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-medium"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-800 block mb-1">Mandal</label>
                  <input
                    type="text"
                    value={newMandal}
                    onChange={(e) => setNewMandal(e.target.value)}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-stone-800 block mb-1">Seller Name</label>
                  <input
                    type="text"
                    value={newSellerName}
                    onChange={(e) => setNewSellerName(e.target.value)}
                    placeholder="Seller Name"
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-medium"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-800 block mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={newSellerPhone}
                    onChange={(e) => setNewSellerPhone(e.target.value)}
                    placeholder="Add your phone number"
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-medium"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowQuickAddModal(false)}
                  className="flex-1 py-2.5 border border-stone-200 rounded-xl font-bold text-stone-600 hover:bg-stone-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingListing}
                  className="flex-1 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold shadow-md shadow-emerald-700/20 cursor-pointer transition-all disabled:opacity-50"
                >
                  {creatingListing ? 'Publishing...' : 'Publish Listing'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
