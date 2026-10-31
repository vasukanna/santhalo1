import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { Listing, UserProfile, AppUser, ChatThread } from '../types';
import { db, auth, handleFirestoreError } from '../firebase';
import {
  collection,
  getDocs,
  doc,
  setDoc,
  getDoc,
  query,
  orderBy,
  limit,
  updateDoc,
  increment,
  deleteDoc
} from 'firebase/firestore';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';

interface Toast {
  message: string;
  type?: 'success' | 'error' | 'info';
}

export const ADMIN_EMAILS: string[] = [
  'naren.papanaboina@gmail.com',
  'vasu.kannaluri@gmail.com'
];

export const isEmailAdmin = (email?: string | null): boolean => {
  if (!email) return false;
  const clean = email.toLowerCase().trim();
  return ADMIN_EMAILS.includes(clean);
};

interface AppContextType {
  lang: 'te' | 'en';
  setLang: (lang: 'te' | 'en') => void;
  t: any;
  currentUser: AppUser | null;
  userProfile: UserProfile | null;
  authLoading: boolean;
  updateProfile: (data: Partial<UserProfile>) => Promise<boolean>;
  saveUserProfile: (data: Partial<UserProfile>) => Promise<boolean>;
  loginWithGoogle: (presetEmail?: string, customDisplayName?: string) => Promise<void>;
  triggerGooglePopupOAuth: () => Promise<void>;
  showGoogleAccountPicker: boolean;
  openGoogleAccountPicker: () => void;
  closeGoogleAccountPicker: () => void;
  logout: () => Promise<void>;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  listings: Listing[];
  listingsLoading: boolean;
  refreshListings: () => Promise<void>;
  createListing: (data: Partial<Listing>) => Promise<{ success: boolean; id?: string; error?: string }>;
  selectedListing: Listing | null;
  setSelectedListing: (listing: Listing | null) => void;
  selectedDistrict: string;
  setSelectedDistrict: (district: string) => void;
  selectedMandal: string;
  setSelectedMandal: (mandal: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortOption: string;
  setSortOption: (sort: string) => void;
  onlyVerified: boolean;
  setOnlyVerified: (v: boolean) => void;
  blockedUserIds: string[];
  blockUser: (userId: string, reason?: string) => void;
  isUserBlocked: (userId: string) => boolean;
  isAdmin: boolean;
  deleteListing: (id: string) => Promise<boolean>;
  toggleFeatureListing: (id: string) => Promise<boolean>;
  updateListingStatus: (id: string, status: 'active' | 'sold' | 'expired') => Promise<boolean>;
  savedIds: string[];
  toggleSaveListing: (id: string) => void;
  incrementContactCount: (id: string, type?: string) => Promise<void>;
  openChatThread: (arg1?: any, arg2?: any) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  toast: Toast | null;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const SEED_LISTINGS: Listing[] = [
  {
    id: 'seed-paddy-1',
    title: 'BPT 5204 Sona Masoori Paddy (సోనా మసూరి వరి ధాన్యం)',
    category: 'paddy_rice',
    subcategory: 'paddy_grain',
    price: 2450,
    priceUnit: 'quintal',
    negotiable: true,
    quantity: '250',
    quantityUnit: 'quintals',
    description: 'Clean harvested high-grade BPT 5204 paddy ready for direct mill purchase. Moisture level checked at 13%. Direct farmer sale.',
    district: 'Nellore (SPSR Nellore)',
    mandal: 'Sangam',
    village: 'Chennavarappadu',
    images: ['/assets/bpt_5204_rice.jpg'],
    sellerId: 'seller-ramana',
    sellerName: 'Venkata Ramana Rao',
    sellerPhone: '9848012345',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    status: 'active',
    featured: false,
    views: 142,
    contactsCount: 18
  },
  {
    id: 'seed-livestock-1',
    title: 'Pure Breed Nellore Jodipi Sheep Pair (జాతి నెల్లూరు జోడిపి)',
    category: 'livestock',
    subcategory: 'nellore_sheep',
    price: 32000,
    priceUnit: 'pair',
    negotiable: true,
    quantity: '2',
    quantityUnit: 'heads',
    description: 'Healthy vaccinated Nellore Jodipi breed rams. Ideal for breeding and high meat yield. Excellent body conformation.',
    district: 'Nellore (SPSR Nellore)',
    mandal: 'Buchireddipalem',
    village: 'Vavveru',
    images: ['/assets/nellore_jodipi_2.jpg'],
    sellerId: 'seller-subbaiah',
    sellerName: 'K. Subbaiah',
    sellerPhone: '9440187654',
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    status: 'active',
    featured: true,
    views: 310,
    contactsCount: 42
  },
  {
    id: 'seed-aqua-1',
    title: 'Fresh Vannamei Shrimp (40 Count) (వనామి రొయ్యలు)',
    category: 'aqua',
    subcategory: 'vannamei_prawns',
    price: 380,
    priceUnit: 'kg',
    negotiable: false,
    quantity: '1200',
    quantityUnit: 'kg',
    description: 'Fresh harvest tonight from biosecure brackishwater ponds. Disease-free certified, 40-count premium export grade.',
    district: 'Nellore (SPSR Nellore)',
    mandal: 'Indukurpet',
    village: 'Mypadu',
    images: ['/assets/categories/aqua_fisheries.png'],
    sellerId: 'seller-prasad',
    sellerName: 'M. Prasad Reddy',
    sellerPhone: '9989054321',
    createdAt: new Date(Date.now() - 3600000 * 20).toISOString(),
    status: 'active',
    featured: true,
    views: 220,
    contactsCount: 29
  },
  {
    id: 'seed-veg-1',
    title: 'Organic Sweet Tender Coconuts (తీపి కొబ్బరి బొండాలు)',
    category: 'vegetables_fruits',
    subcategory: 'coconuts',
    price: 35,
    priceUnit: 'piece',
    negotiable: true,
    quantity: '3000',
    quantityUnit: 'nuts',
    description: 'Large water-filled fresh tender coconuts cut directly from coastal organic grove. Wholesale bulk orders only.',
    district: 'Nellore (SPSR Nellore)',
    mandal: 'Kovur',
    village: 'Gangavaram',
    images: ['/assets/tender_coconuts.png'],
    sellerId: 'seller-krishna',
    sellerName: 'Ch. Krishna Mohan',
    sellerPhone: '9701234890',
    createdAt: new Date(Date.now() - 3600000 * 28).toISOString(),
    status: 'active',
    featured: false,
    views: 180,
    contactsCount: 15
  },
  {
    id: 'seed-other-1',
    title: 'Mahindra 575 DI Tractor with Rotavator for Rental (ట్రాక్టర్ అద్దె)',
    category: 'other',
    subcategory: 'tractors_harvesters',
    price: 1100,
    priceUnit: 'hour',
    negotiable: true,
    quantity: '1',
    quantityUnit: 'unit',
    description: 'Available for plowing, puddling, and rotavator operations across Nellore surrounding mandals with experienced driver.',
    district: 'Nellore (SPSR Nellore)',
    mandal: 'Sangam',
    village: 'Marripadu',
    images: ['/assets/mahindra_575_di.jpg'],
    sellerId: 'seller-suresh',
    sellerName: 'P. Suresh',
    sellerPhone: '9618223344',
    createdAt: new Date(Date.now() - 3600000 * 36).toISOString(),
    status: 'active',
    featured: false,
    views: 95,
    contactsCount: 11
  }
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<'te' | 'en'>(() => {
    return (localStorage.getItem('santhalo_lang') as 'te' | 'en') || 'te';
  });

  const [activeTab, setActiveTab] = useState<string>('home');
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [currentUser, setCurrentUser] = useState<AppUser | null>(() => {
    try {
      const saved = localStorage.getItem('santhalo_auth_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const DEFAULT_USER_PROFILE: UserProfile = {
    id: '',
    displayName: '',
    name: '',
    email: '',
    phone: '',
    district: '',
    mandal: '',
    village: '',
    role: 'both',
    isAdmin: false,
    createdAt: 1713225600000
  };

  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('santhalo_user_profile');
      if (saved) {
        const parsed = JSON.parse(saved);
        const emailToCheck = (parsed.email || '').toLowerCase().trim();
        const isAdminAccount = isEmailAdmin(emailToCheck);

        // Clear sample phone numbers from saved data, but preserve real user entered phone
        let cleanPhone = parsed.phone || '';
        if (cleanPhone === '9848012345' || cleanPhone === '9848098765') {
          cleanPhone = '';
        }

        // Preserve user entered location, phone, and optional location string
        let cleanDistrict = parsed.district || '';
        let cleanMandal = parsed.mandal || '';
        let cleanVillage = parsed.village || '';
        let cleanLocation = parsed.location || [cleanVillage, cleanMandal, cleanDistrict].filter(Boolean).join(', ');

        const sanitized: UserProfile = {
          ...DEFAULT_USER_PROFILE,
          ...parsed,
          email: parsed.email || '',
          phone: cleanPhone,
          district: cleanDistrict,
          mandal: cleanMandal,
          village: cleanVillage,
          location: cleanLocation,
          isAdmin: isAdminAccount
        };

        // Persist cleaned profile back to storage
        if (
          parsed.isAdmin !== isAdminAccount ||
          parsed.phone !== cleanPhone ||
          parsed.district !== cleanDistrict ||
          parsed.mandal !== cleanMandal ||
          parsed.village !== cleanVillage
        ) {
          localStorage.setItem('santhalo_user_profile', JSON.stringify(sanitized));
        }
        return sanitized;
      }
      return null;
    } catch {
      return null;
    }
  });

  const [listings, setListings] = useState<Listing[]>(() => {
    try {
      const deletedRaw = localStorage.getItem('santhalo_deleted_listings');
      const deletedList: string[] = deletedRaw ? JSON.parse(deletedRaw) : [];
      const deletedSet = new Set(deletedList);

      const cached = localStorage.getItem('santhalo_listings_cache');
      const baseList = cached ? JSON.parse(cached) : SEED_LISTINGS;
      return baseList
        .filter((l: Listing) => !deletedSet.has(l.id))
        .map((l: Listing) => {
          if (l.id === 'seed-paddy-1' || (l.title && l.title.includes('BPT 5204'))) {
            return {
              ...l,
              featured: false,
              images: ['/assets/bpt_5204_rice.jpg']
            };
          }
          if (l.id === 'seed-other-1' || (l.title && l.title.includes('Mahindra 575'))) {
            return {
              ...l,
              featured: false,
              images: ['/assets/mahindra_575_di.jpg']
            };
          }
          return l;
        });
    } catch {
      return SEED_LISTINGS;
    }
  });

  const [listingsLoading, setListingsLoading] = useState<boolean>(false);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);

  // Filters
  const [selectedDistrict, setSelectedDistrict] = useState<string>('Nellore (SPSR Nellore)');
  const [selectedMandal, setSelectedMandal] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortOption, setSortOption] = useState<string>('newest');
  const [onlyVerified, setOnlyVerified] = useState<boolean>(false);

  // Blocked users
  const [blockedUserIds, setBlockedUserIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('santhalo_blocked_users');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Saved / Bookmarked listings
  const [savedIds, setSavedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('santhalo_saved_listings');
      return saved ? JSON.parse(saved) : ['seed-paddy-1'];
    } catch {
      return ['seed-paddy-1'];
    }
  });

  // Toast
  const [toast, setToast] = useState<Toast | null>(null);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  }, []);

  // Sync lang to storage
  useEffect(() => {
    localStorage.setItem('santhalo_lang', lang);
  }, [lang]);

  // Sync savedIds to storage
  useEffect(() => {
    localStorage.setItem('santhalo_saved_listings', JSON.stringify(savedIds));
  }, [savedIds]);

  // Listen to Auth State with browserLocalPersistence and session restoration
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const appUser: AppUser = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          phoneNumber: user.phoneNumber
        };
        setCurrentUser(appUser);
        localStorage.setItem('santhalo_auth_user', JSON.stringify(appUser));

        const userEmail = (user.email || '').toLowerCase().trim();
        const isAdminAccount = isEmailAdmin(userEmail);

        try {
          const userDocRef = doc(db, 'users', user.uid);
          const snap = await getDoc(userDocRef);
          if (snap.exists()) {
            const data = snap.data() as UserProfile;
            let cleanPhone = data.phone || '';
            if (cleanPhone === '9848012345' || cleanPhone === '9848098765') cleanPhone = '';

            let cleanDistrict = data.district || '';
            let cleanMandal = data.mandal || '';
            let cleanVillage = data.village || '';
            let cleanLocation = data.location || [cleanVillage, cleanMandal, cleanDistrict].filter(Boolean).join(', ');

            const corrected: UserProfile = {
              ...data,
              phone: cleanPhone,
              district: cleanDistrict,
              mandal: cleanMandal,
              village: cleanVillage,
              location: cleanLocation,
              email: user.email || data.email,
              isAdmin: isAdminAccount
            };
            if (data.isAdmin && !isAdminAccount) {
              try {
                await setDoc(userDocRef, { isAdmin: false }, { merge: true });
              } catch {
                // safe fallback
              }
            }
            setUserProfile(corrected);
            localStorage.setItem('santhalo_user_profile', JSON.stringify(corrected));
          } else {
            // New user profile starts with empty phone and empty location
            const initialProfile: UserProfile = {
              id: user.uid,
              displayName: user.displayName || 'రైతు మిత్రుడు',
              name: user.displayName || 'రైతు మిత్రుడు',
              phone: user.phoneNumber || '',
              email: user.email || '',
              district: '',
              mandal: '',
              village: '',
              avatarUrl: user.photoURL || undefined,
              role: 'both',
              isAdmin: isAdminAccount,
              createdAt: Date.now()
            };
            await setDoc(userDocRef, initialProfile);
            setUserProfile(initialProfile);
            localStorage.setItem('santhalo_user_profile', JSON.stringify(initialProfile));
          }
        } catch (err) {
          handleFirestoreError(err, 'read');
        }
      } else {
        // If Firebase Auth has no active user in memory, restore from persistent storage if logged in
        const savedAuth = localStorage.getItem('santhalo_auth_user');
        if (savedAuth) {
          try {
            const parsed = JSON.parse(savedAuth);
            if (parsed && parsed.email) {
              setCurrentUser(parsed);
              const email = (parsed.email || '').toLowerCase().trim();
              const isAdminAccount = isEmailAdmin(email);
              const savedProfile = localStorage.getItem('santhalo_user_profile');
              if (savedProfile) {
                const parsedProfile = JSON.parse(savedProfile);
                let cleanPhone = parsedProfile.phone || '';
                if (cleanPhone === '9848012345' || cleanPhone === '9848098765') cleanPhone = '';

                let cleanDistrict = parsedProfile.district || '';
                let cleanMandal = parsedProfile.mandal || '';
                let cleanVillage = parsedProfile.village || '';
                let cleanLocation = parsedProfile.location || [cleanVillage, cleanMandal, cleanDistrict].filter(Boolean).join(', ');

                setUserProfile({
                  ...parsedProfile,
                  phone: cleanPhone,
                  district: cleanDistrict,
                  mandal: cleanMandal,
                  village: cleanVillage,
                  location: cleanLocation,
                  isAdmin: isAdminAccount
                });
              }
            } else {
              setCurrentUser(null);
            }
          } catch {
            setCurrentUser(null);
          }
        } else {
          setCurrentUser(null);
        }
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Fetch listings from Firestore with persistent fallback
  const refreshListings = useCallback(async () => {
    setListingsLoading(true);
    try {
      const deletedRaw = localStorage.getItem('santhalo_deleted_listings');
      const currentDeleted: string[] = deletedRaw ? JSON.parse(deletedRaw) : [];
      const deletedSet = new Set(currentDeleted);

      const q = query(collection(db, 'listings'), orderBy('createdAt', 'desc'), limit(100));
      const snap = await getDocs(q);
      if (!snap.empty) {
        const fetchedListings: Listing[] = [];
        snap.forEach((docSnap) => {
          if (!deletedSet.has(docSnap.id)) {
            fetchedListings.push({ id: docSnap.id, ...docSnap.data() } as Listing);
          }
        });

        const existingIds = new Set(fetchedListings.map(l => l.id));
        const merged = [
          ...fetchedListings,
          ...SEED_LISTINGS.filter(s => !existingIds.has(s.id) && !deletedSet.has(s.id))
        ];
        setListings(merged);
        localStorage.setItem('santhalo_listings_cache', JSON.stringify(merged));
      }
    } catch (err) {
      handleFirestoreError(err, 'read');
    } finally {
      setListingsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshListings();
  }, [refreshListings]);

  // Save / Update User Profile
  const saveUserProfile = async (data: Partial<UserProfile>): Promise<boolean> => {
    try {
      const targetId = currentUser?.uid || userProfile?.id || 'user_guest';
      const nameVal = data.displayName || data.name || userProfile?.displayName || userProfile?.name || 'రైతు మిత్రుడు';
      const emailVal = (data.email !== undefined ? data.email : (currentUser?.email || userProfile?.email || '')).toLowerCase().trim();
      const isAdminAccount = isEmailAdmin(emailVal);
      const districtVal = data.district !== undefined ? data.district : (userProfile?.district || '');
      const mandalVal = data.mandal !== undefined ? data.mandal : (userProfile?.mandal || '');
      const villageVal = data.village !== undefined ? data.village : (userProfile?.village || '');
      const locationVal = data.location !== undefined
        ? data.location
        : ([villageVal, mandalVal, districtVal].filter(Boolean).join(', ') || userProfile?.location || '');

      const updated: UserProfile = {
        id: targetId,
        displayName: nameVal,
        name: nameVal,
        phone: data.phone !== undefined ? data.phone : (userProfile?.phone || ''),
        email: emailVal,
        district: districtVal,
        mandal: mandalVal,
        village: villageVal,
        location: locationVal,
        role: data.role || userProfile?.role || 'both',
        isAdmin: isAdminAccount,
        avatarUrl: data.avatarUrl || userProfile?.avatarUrl,
        updatedAt: Date.now()
      };

      setUserProfile(updated);
      localStorage.setItem('santhalo_user_profile', JSON.stringify(updated));

      // Non-blocking firestore sync with timeout race
      try {
        const syncPromise = setDoc(doc(db, 'users', targetId), updated, { merge: true });
        const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 1500));
        await Promise.race([syncPromise, timeoutPromise]);
      } catch (fErr) {
        handleFirestoreError(fErr, 'write');
      }

      showToast(lang === 'te' ? 'ప్రొఫైల్ విజయవంతంగా సేవ్ చేయబడింది!' : 'Profile saved successfully!', 'success');
      return true;
    } catch (err) {
      console.error('Error saving profile:', err);
      showToast(lang === 'te' ? 'ప్రొఫైల్ సేవ్ విఫలమైంది.' : 'Failed to save profile.', 'error');
      return false;
    }
  };

  const updateProfile = saveUserProfile;

  // Create Listing
  const createListing = async (data: Partial<Listing>): Promise<{ success: boolean; id?: string; error?: string }> => {
    try {
      const newId = `listing_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const newListing: Listing = {
        id: newId,
        title: data.title || '',
        category: data.category || 'paddy_rice',
        subcategory: data.subcategory || 'paddy_grain',
        price: Number(data.price) || 0,
        priceUnit: data.priceUnit || 'quintal',
        negotiable: data.negotiable ?? true,
        quantity: data.quantity || '1',
        quantityUnit: data.quantityUnit || 'units',
        description: data.description || '',
        district: data.district || userProfile?.district || 'Nellore (SPSR Nellore)',
        mandal: data.mandal || userProfile?.mandal || 'Sangam',
        village: data.village || userProfile?.village || '',
        images: data.images && data.images.length > 0 ? data.images : ['/assets/santha_banner_full.png'],
        video: data.video || data.videoUrl,
        videoUrl: data.videoUrl || data.video,
        sellerId: data.sellerId || currentUser?.uid || userProfile?.id || 'farmer_user',
        sellerName: data.sellerName || currentUser?.displayName || userProfile?.displayName || userProfile?.name || 'రైతు మిత్రుడు',
        sellerPhone: data.sellerPhone || userProfile?.phone || '',
        sellerLocation: data.sellerLocation || (
          [data.village || userProfile?.village, data.mandal || userProfile?.mandal, data.district || userProfile?.district].filter(Boolean).join(', ')
        ),
        createdAt: new Date().toISOString(),
        status: 'active',
        featured: false,
        views: 0,
        contactsCount: 0
      };

      setListings(prev => {
        const next = [newListing, ...prev];
        localStorage.setItem('santhalo_listings_cache', JSON.stringify(next));
        return next;
      });

      // Non-blocking firestore sync
      try {
        const syncPromise = setDoc(doc(db, 'listings', newId), newListing);
        const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 1500));
        await Promise.race([syncPromise, timeoutPromise]);
      } catch (fErr) {
        handleFirestoreError(fErr, 'create');
      }

      showToast(lang === 'te' ? 'మీ ప్రకటన విజయవంతంగా పోస్ట్ చేయబడింది!' : 'Ad posted successfully!', 'success');
      return { success: true, id: newId };
    } catch (err: any) {
      console.error('Failed to create listing:', err);
      showToast(lang === 'te' ? 'ప్రకటన పోస్టింగ్ విఫలమైంది.' : 'Failed to post ad.', 'error');
      return { success: false, error: err.message };
    }
  };

  // Google Account Chooser Modal state
  const [showGoogleAccountPicker, setShowGoogleAccountPicker] = useState<boolean>(false);

  const openGoogleAccountPicker = useCallback(() => {
    setShowGoogleAccountPicker(true);
  }, []);

  const closeGoogleAccountPicker = useCallback(() => {
    setShowGoogleAccountPicker(false);
  }, []);

  // Direct Browser Google OAuth Popup attempt
  const triggerGooglePopupOAuth = async () => {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account', auth_type: 'rerequest' });
      const result = await signInWithPopup(auth, provider);
      if (result && result.user) {
        const u = result.user;
        const appUser: AppUser = {
          uid: u.uid,
          email: u.email,
          displayName: u.displayName || 'Farmer Member',
          photoURL: u.photoURL,
          phoneNumber: u.phoneNumber
        };
        setCurrentUser(appUser);
        localStorage.setItem('santhalo_auth_user', JSON.stringify(appUser));

        let existingProfile: Partial<UserProfile> | null = null;
        try {
          const snap = await getDoc(doc(db, 'users', u.uid));
          if (snap.exists()) {
            existingProfile = snap.data() as UserProfile;
          }
        } catch {
          // offline
        }
        if (!existingProfile) {
          try {
            const saved = localStorage.getItem('santhalo_user_profile');
            if (saved) {
              const parsed = JSON.parse(saved);
              if (parsed && (parsed.id === u.uid || (parsed.email && u.email && parsed.email.toLowerCase() === u.email.toLowerCase()))) {
                existingProfile = parsed;
              }
            }
          } catch {
            // safe fallback
          }
        }

        const existingPhone = existingProfile?.phone || u.phoneNumber || (userProfile?.phone && userProfile.phone !== '9848012345' && userProfile.phone !== '9848098765' ? userProfile.phone : '') || '';
        const existingDistrict = existingProfile?.district || userProfile?.district || '';
        const existingMandal = existingProfile?.mandal || userProfile?.mandal || '';
        const existingVillage = existingProfile?.village || userProfile?.village || '';
        const existingLocation = existingProfile?.location || [existingVillage, existingMandal, existingDistrict].filter(Boolean).join(', ');
        const userIsAdmin = isEmailAdmin(u.email);

        const updatedProfile: UserProfile = {
          id: u.uid,
          displayName: u.displayName || 'Farmer Member',
          name: u.displayName || 'Farmer Member',
          phone: existingPhone,
          email: u.email || '',
          district: existingDistrict,
          mandal: existingMandal,
          village: existingVillage,
          location: existingLocation,
          avatarUrl: u.photoURL || undefined,
          role: existingProfile?.role || 'both',
          isAdmin: userIsAdmin,
          updatedAt: Date.now()
        };
        setUserProfile(updatedProfile);
        localStorage.setItem('santhalo_user_profile', JSON.stringify(updatedProfile));
        try {
          await setDoc(doc(db, 'users', u.uid), updatedProfile, { merge: true });
        } catch {
          // offline
        }
        setShowGoogleAccountPicker(false);
        showToast(
          lang === 'te'
            ? `గూగుల్ ఖాతాతో లాగిన్ అయ్యారు (${u.displayName || u.email})!`
            : `Signed in as ${u.displayName || u.email}!`,
          'success'
        );
      }
    } catch (err: any) {
      console.warn('Google popup OAuth notice:', err?.code || err?.message);
      showToast(
        lang === 'te'
          ? 'గూగుల్ పాపప్ పరిమితి ఉంది. దయచేసి ఖాతా జాబితా నుండి ఎంచుకోండి.'
          : 'Google popup restricted or domain not authorized. Please select your account below.',
        'info'
      );
      setShowGoogleAccountPicker(true);
    }
  };

  // Google Login - Prompts for account selection or logs into selected account
  const loginWithGoogle = async (presetEmail?: string, customDisplayName?: string) => {
    // If no specific email is selected, open the Google Account Chooser modal!
    if (!presetEmail) {
      setShowGoogleAccountPicker(true);
      return;
    }

    const email = presetEmail.trim();
    const isAdminAccount = isEmailAdmin(email);
    let name = customDisplayName || email.split('@')[0];
    let uid = `google_${email.replace(/[^a-zA-Z0-9]/g, '_')}`;
    let photo = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80';

    if (email.toLowerCase() === 'vasu.kannaluri@gmail.com') {
      name = 'Vasu Kannaluri';
      uid = 'user_vasu_1';
      photo = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80';
    } else if (email.toLowerCase() === 'naren.papanaboina@gmail.com') {
      name = 'Naren Papanaboina';
      uid = 'user_naren_admin';
      photo = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80';
    }


    let existingProfile: Partial<UserProfile> | null = null;
    try {
      const snap = await getDoc(doc(db, 'users', uid));
      if (snap.exists()) {
        existingProfile = snap.data() as UserProfile;
      }
    } catch {
      // offline
    }
    if (!existingProfile) {
      try {
        const saved = localStorage.getItem('santhalo_user_profile');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && (parsed.id === uid || (parsed.email && parsed.email.toLowerCase() === email.toLowerCase()))) {
            existingProfile = parsed;
          }
        }
      } catch {
        // safe fallback
      }
    }

    const cleanPhone = existingProfile?.phone || (userProfile?.email?.toLowerCase() === email.toLowerCase() && userProfile?.phone !== '9848012345' && userProfile?.phone !== '9848098765' ? userProfile?.phone : '') || '';
    const cleanDistrict = existingProfile?.district || (userProfile?.email?.toLowerCase() === email.toLowerCase() ? userProfile?.district : '') || '';
    const cleanMandal = existingProfile?.mandal || (userProfile?.email?.toLowerCase() === email.toLowerCase() ? userProfile?.mandal : '') || '';
    const cleanVillage = existingProfile?.village || (userProfile?.email?.toLowerCase() === email.toLowerCase() ? userProfile?.village : '') || '';
    const cleanLocation = existingProfile?.location || [cleanVillage, cleanMandal, cleanDistrict].filter(Boolean).join(', ');

    const appUser: AppUser = {
      uid,
      email,
      displayName: name,
      photoURL: photo,
      phoneNumber: cleanPhone || null
    };

    setCurrentUser(appUser);
    localStorage.setItem('santhalo_auth_user', JSON.stringify(appUser));

    const updatedProfile: UserProfile = {
      id: uid,
      displayName: name,
      name,
      email,
      phone: cleanPhone,
      district: cleanDistrict,
      mandal: cleanMandal,
      village: cleanVillage,
      location: cleanLocation,
      role: existingProfile?.role || 'both',
      isAdmin: isAdminAccount,
      avatarUrl: photo,
      updatedAt: Date.now()
    };

    setUserProfile(updatedProfile);
    localStorage.setItem('santhalo_user_profile', JSON.stringify(updatedProfile));

    try {
      const syncPromise = setDoc(doc(db, 'users', uid), updatedProfile, { merge: true });
      const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 1500));
      await Promise.race([syncPromise, timeoutPromise]);
    } catch {
      // offline fallback
    }

    setShowGoogleAccountPicker(false);
    showToast(
      lang === 'te'
        ? `గూగుల్ ఖాతాతో లాగిన్ అయ్యారు (${name})!`
        : `Signed in with Google (${name}${isAdminAccount && email.toLowerCase() === 'naren.papanaboina@gmail.com' ? ' - Admin' : ''})!`,
      'success'
    );
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error('Sign out error:', err);
    } finally {
      setCurrentUser(null);
      setUserProfile(null);
      localStorage.removeItem('santhalo_auth_user');
      localStorage.removeItem('santhalo_user_profile');
      showToast(lang === 'te' ? 'లాగ్ అవుట్ అయ్యారు.' : 'Signed out.', 'info');
    }
  };

  // Toggle Save
  const toggleSaveListing = (id: string) => {
    setSavedIds(prev => {
      const exists = prev.includes(id);
      const next = exists ? prev.filter(i => i !== id) : [...prev, id];
      showToast(
        exists
          ? (lang === 'te' ? 'సేవ్ నుండి తీసివేయబడింది' : 'Removed from saved')
          : (lang === 'te' ? 'సేవ్ చేయబడింది!' : 'Saved to favorites!'),
        'info'
      );
      return next;
    });
  };

  // Increment Contact Count
  const incrementContactCount = async (id: string, type?: string) => {
    try {
      setListings(prev =>
        prev.map(item =>
          item.id === id ? { ...item, contactsCount: (item.contactsCount || 0) + 1 } : item
        )
      );
      const ref = doc(db, 'listings', id);
      await updateDoc(ref, { contactsCount: increment(1) });
    } catch {
      // ignore
    }
  };

  // Block User
  const blockUser = (userId: string, reason?: string) => {
    setBlockedUserIds(prev => {
      const next = [...prev, userId];
      localStorage.setItem('santhalo_blocked_users', JSON.stringify(next));
      return next;
    });
    showToast(lang === 'te' ? 'వినియోగదారుడు బ్లాక్ చేయబడ్డాడు' : 'User blocked', 'info');
  };

  const isUserBlocked = useCallback((userId: string) => {
    return blockedUserIds.includes(userId);
  }, [blockedUserIds]);

  // Open Chat
  const openChatThread = (arg1?: any, arg2?: any) => {
    setActiveTab('chat');
  };

  // Rich Translation Object & Function
  const t = useMemo(() => {
    const fn = (key: string, fallback?: string): string => {
      const translations: Record<string, Record<'te' | 'en', string>> = {
        'app_name': { te: 'సంతLO', en: 'SanthaLO' },
        'search_placeholder': { te: 'వరి, పండ్లు, ఆక్వా, పశువులు శోధించండి...', en: 'Search paddy, fruits, aqua, livestock...' },
        'all_categories': { te: 'అన్ని కేటగిరీలు', en: 'All Categories' },
        'post_ad': { te: 'ప్రకటన ఇవ్వండి', en: 'Post Free Ad' },
        'saved': { te: 'సేవ్ చేసినవి', en: 'Saved' },
        'profile': { te: 'ప్రొఫైల్', en: 'Profile' }
      };

      if (translations[key] && translations[key][lang]) {
        return translations[key][lang];
      }
      return fallback || key;
    };

    const props: Record<string, string> = {
      inboxTitle: lang === 'te' ? 'ఇన్‌బాక్స్' : 'Inbox',
      googleSignIn: lang === 'te' ? 'గూగుల్ లాగిన్' : 'Sign in with Google',
      loadingText: lang === 'te' ? 'లోడ్ అవుతోంది...' : 'Loading...',
      noChatsYet: lang === 'te' ? 'ఇంకా సంభాషణలు లేవు' : 'No chats yet',
      noChatsSub: lang === 'te' ? 'కొనుగోలుదారులతో మాట్లాడండి' : 'Start chatting with sellers or buyers',
      featuredBadge: lang === 'te' ? 'ఫీచర్డ్' : 'Featured',
      videoTour: lang === 'te' ? 'వీడియో టూర్' : 'Video Tour',
      negotiable: lang === 'te' ? 'చర్చించదగినది' : 'Negotiable',
      fixedPrice: lang === 'te' ? 'స్థిర ధర' : 'Fixed Price',
      specifications: lang === 'te' ? 'వివరాలు' : 'Specifications',
      overview: lang === 'te' ? 'సారాంశం' : 'Overview',
      sellerDetails: lang === 'te' ? 'విక్రేత వివరాలు' : 'Seller Details',
      verifiedSeller: lang === 'te' ? 'ధృవీకరించబడిన విక్రేత' : 'Verified Seller',
      safetyTips: lang === 'te' ? 'భద్రతా సూచనలు' : 'Safety Tips',
      safetyTip1: lang === 'te' ? 'వస్తువును చూసిన తర్వాతే చెల్లించండి' : 'Inspect goods before paying',
      safetyTip2: lang === 'te' ? 'ముందస్తు చెల్లింపులు చేయవద్దు' : 'Never make advance payments to strangers',
      reportAd: lang === 'te' ? 'ప్రకటనను నివేదించండి' : 'Report this ad',
      callSeller: lang === 'te' ? 'కాల్ చేయండి' : 'Call Seller',
      whatsappSeller: lang === 'te' ? 'వాట్సాప్' : 'WhatsApp',
      chatSeller: lang === 'te' ? 'చాట్' : 'Chat'
    };

    return Object.assign(fn, props);
  }, [lang]);


  // Admin Check - Grants full admin powers STRICTLY to naren.papanaboina@gmail.com and vasu.kannaluri@gmail.com
  const isAdmin = useMemo(() => {
    const verifiedEmail = (currentUser?.email || userProfile?.email || '').toLowerCase().trim();
    return isEmailAdmin(verifiedEmail);
  }, [currentUser, userProfile]);

  // Reset any cached accounts in localStorage so only the two authorized emails keep admin
  useEffect(() => {
    try {
      const saved = localStorage.getItem('santhalo_user_profile');
      if (saved) {
        const parsed = JSON.parse(saved);
        const email = (parsed.email || '').toLowerCase().trim();
        const shouldBeAdmin = isEmailAdmin(email);
        if (parsed.isAdmin && !shouldBeAdmin) {
          parsed.isAdmin = false;
          localStorage.setItem('santhalo_user_profile', JSON.stringify(parsed));
          if (userProfile && userProfile.isAdmin && !isEmailAdmin(userProfile.email)) {
            setUserProfile(prev => prev ? { ...prev, isAdmin: false } : null);
          }
        }
      }
    } catch {
      // safe fallback
    }
  }, [userProfile]);

  // Hide admin options from normal users and redirect them to the home page if they open an admin URL directly
  useEffect(() => {
    const checkAdminAccess = () => {
      const params = new URLSearchParams(window.location.search);
      const hash = window.location.hash.toLowerCase();
      const pathname = window.location.pathname.toLowerCase();

      const requestedAdmin =
        params.get('tab') === 'admin' ||
        params.get('screen') === 'admin' ||
        hash.includes('admin') ||
        pathname.includes('/admin') ||
        activeTab === 'admin';

      if (requestedAdmin && !isAdmin) {
        setActiveTab('home');
        if (
          params.get('tab') === 'admin' ||
          params.get('screen') === 'admin' ||
          hash.includes('admin') ||
          pathname.includes('/admin')
        ) {
          window.history.replaceState(null, '', '/');
        }
      }
    };

    checkAdminAccess();
    window.addEventListener('popstate', checkAdminAccess);
    window.addEventListener('hashchange', checkAdminAccess);
    return () => {
      window.removeEventListener('popstate', checkAdminAccess);
      window.removeEventListener('hashchange', checkAdminAccess);
    };
  }, [isAdmin, activeTab]);

  // Admin / Seller Delete Listing
  const deleteListing = async (id: string): Promise<boolean> => {
    try {
      setListings(prev => {
        const next = prev.filter(l => l.id !== id);
        localStorage.setItem('santhalo_listings_cache', JSON.stringify(next));
        return next;
      });

      // Persist to deleted list so it never reappears on refresh
      try {
        const deletedRaw = localStorage.getItem('santhalo_deleted_listings');
        const currentDeleted: string[] = deletedRaw ? JSON.parse(deletedRaw) : [];
        if (!currentDeleted.includes(id)) {
          const nextDeleted = [...currentDeleted, id];
          localStorage.setItem('santhalo_deleted_listings', JSON.stringify(nextDeleted));
        }
      } catch {
        // safe fallback
      }

      // Non-blocking firestore delete
      try {
        const delPromise = deleteDoc(doc(db, 'listings', id));
        const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 2000));
        await Promise.race([delPromise, timeoutPromise]);
      } catch (fErr) {
        handleFirestoreError(fErr, 'delete');
      }
      showToast(lang === 'te' ? 'ప్రకటన విజయవంతంగా తొలగించబడింది.' : 'Listing removed successfully.', 'info');
      return true;
    } catch (err) {
      console.error('Delete error:', err);
      showToast(lang === 'te' ? 'ప్రకటన తొలగింపు విఫలమైంది.' : 'Failed to delete listing.', 'error');
      return false;
    }
  };

  // Admin Toggle Feature
  const toggleFeatureListing = async (id: string): Promise<boolean> => {
    try {
      let nextVal = false;
      setListings(prev => {
        const next = prev.map(l => {
          if (l.id === id) {
            nextVal = !l.featured;
            return { ...l, featured: nextVal };
          }
          return l;
        });
        localStorage.setItem('santhalo_listings_cache', JSON.stringify(next));
        return next;
      });
      try {
        await updateDoc(doc(db, 'listings', id), { featured: nextVal });
      } catch {
        // offline fallback
      }
      showToast(
        nextVal
          ? (lang === 'te' ? 'ఫీచర్డ్ ప్రకటనగా గుర్తించబడింది!' : 'Marked as Featured!')
          : (lang === 'te' ? 'ఫీచర్డ్ నుండి తీసివేయబడింది.' : 'Removed from Featured.'),
        'success'
      );
      return true;
    } catch (err) {
      console.error('Toggle feature error:', err);
      return false;
    }
  };

  // Admin / Seller Update Status
  const updateListingStatus = async (id: string, status: 'active' | 'sold' | 'expired'): Promise<boolean> => {
    try {
      setListings(prev => {
        const next = prev.map(l => l.id === id ? { ...l, status } : l);
        localStorage.setItem('santhalo_listings_cache', JSON.stringify(next));
        return next;
      });
      try {
        await updateDoc(doc(db, 'listings', id), { status });
      } catch {
        // offline
      }
      showToast(lang === 'te' ? 'స్థితి నవీకరించబడింది.' : 'Status updated.', 'info');
      return true;
    } catch (err) {
      console.error('Update status error:', err);
      return false;
    }
  };

  return (
    <AppContext.Provider
      value={{
        lang,
        setLang,
        t,
        currentUser,
        userProfile,
        authLoading,
        updateProfile,
        saveUserProfile,
        loginWithGoogle,
        triggerGooglePopupOAuth,
        showGoogleAccountPicker,
        openGoogleAccountPicker,
        closeGoogleAccountPicker,
        logout,
        activeTab,
        setActiveTab,
        listings,
        listingsLoading,
        refreshListings,
        createListing,
        selectedListing,
        setSelectedListing,
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
        blockedUserIds,
        blockUser,
        isUserBlocked,
        isAdmin,
        deleteListing,
        toggleFeatureListing,
        updateListingStatus,
        savedIds,
        toggleSaveListing,
        incrementContactCount,
        openChatThread,
        showToast,
        toast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
