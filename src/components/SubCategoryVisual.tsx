import React from 'react';

interface SubCategoryVisualProps {
  id: string;
  name?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const SubCategoryVisual: React.FC<SubCategoryVisualProps> = ({
  id,
  name,
  className = '',
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20'
  }[size];

  const combinedClass = `${sizeClasses} ${className} object-contain rounded-xl shrink-0`;

  // Render SVG illustrations with 1:1 aspect ratio and pastel backgrounds
  switch (id) {
    // ==========================================
    // 1. OILSEEDS
    // ==========================================
    case 'groundnut':
      return (
        <svg viewBox="0 0 64 64" fill="none" className={combinedClass} xmlns="http://www.w3.org/2000/svg" aria-label={name || "Groundnut / Peanut"}>
          <rect width="64" height="64" rx="14" fill="#FEFCE8" />
          {/* Peanut pod */}
          <path d="M22 18C17 21 15 28 17 33C18 36 21 38 22 41C24 47 28 50 34 49C40 48 43 43 42 37C41 34 38 32 37 29C35 23 38 18 31 16C27 15 24 16 22 18Z" fill="#D97706" stroke="#92400E" strokeWidth="1.5" />
          {/* Peanut texture / ridges */}
          <path d="M23 23C26 25 30 24 33 22" stroke="#B45309" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M22 33C26 35 32 34 36 32" stroke="#B45309" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M25 43C28 45 33 44 37 42" stroke="#B45309" strokeWidth="1.5" strokeLinecap="round" />
          {/* Cracked peanut kernel 1 */}
          <ellipse cx="44" cy="42" rx="7" ry="5" fill="#DC2626" transform="rotate(-20 44 42)" stroke="#991B1B" strokeWidth="1" />
          <ellipse cx="43" cy="41" rx="4" ry="2" fill="#F87171" transform="rotate(-20 43 41)" />
          {/* Cracked peanut kernel 2 */}
          <ellipse cx="48" cy="27" rx="6" ry="4.5" fill="#EA580C" transform="rotate(30 48 27)" stroke="#C2410C" strokeWidth="1" />
        </svg>
      );

    case 'sunflower':
      return (
        <svg viewBox="0 0 64 64" fill="none" className={combinedClass} xmlns="http://www.w3.org/2000/svg" aria-label={name || "Sunflower"}>
          <rect width="64" height="64" rx="14" fill="#FEFCE8" />
          {/* Sunflower petals */}
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
            <ellipse key={deg} cx="32" cy="32" rx="4.5" ry="16" fill="#FACC15" stroke="#EAB308" strokeWidth="1" transform={`rotate(${deg} 32 32)`} />
          ))}
          {/* Inner petal layer */}
          {[15, 45, 75, 105, 135, 165, 195, 225, 255, 285, 315, 345].map((deg) => (
            <ellipse key={deg} cx="32" cy="32" rx="3" ry="12" fill="#F59E0B" transform={`rotate(${deg} 32 32)`} />
          ))}
          {/* Seed center disc */}
          <circle cx="32" cy="32" r="10" fill="#78350F" />
          <circle cx="32" cy="32" r="8" fill="#451A03" />
          <circle cx="32" cy="32" r="5" fill="#292524" />
          {/* Seeds texture */}
          <circle cx="30" cy="30" r="1" fill="#D97706" />
          <circle cx="34" cy="30" r="1" fill="#D97706" />
          <circle cx="32" cy="34" r="1" fill="#D97706" />
        </svg>
      );

    case 'sesame':
      return (
        <svg viewBox="0 0 64 64" fill="none" className={combinedClass} xmlns="http://www.w3.org/2000/svg" aria-label={name || "Sesame / Til"}>
          <rect width="64" height="64" rx="14" fill="#F5F5F4" />
          {/* Sesame plant capsule pod */}
          <path d="M24 16C24 16 32 12 36 20C40 28 38 44 38 44C38 44 30 46 26 38C22 30 24 16 24 16Z" fill="#84CC16" stroke="#4D7C0F" strokeWidth="1.5" />
          <path d="M30 15V44" stroke="#4D7C0F" strokeWidth="1" strokeDasharray="2 2" />
          {/* Small black and white sesame seeds */}
          <ellipse cx="44" cy="24" rx="3" ry="5" fill="#292524" transform="rotate(25 44 24)" />
          <ellipse cx="49" cy="34" rx="2.8" ry="4.5" fill="#292524" transform="rotate(-15 49 34)" />
          <ellipse cx="42" cy="44" rx="2.5" ry="4.2" fill="#E7E5E4" stroke="#78716C" strokeWidth="1" transform="rotate(40 42 44)" />
          <ellipse cx="48" cy="48" rx="2.8" ry="4.5" fill="#292524" transform="rotate(10 48 48)" />
          <ellipse cx="36" cy="50" rx="2.5" ry="4.2" fill="#E7E5E4" stroke="#78716C" strokeWidth="1" transform="rotate(-30 36 50)" />
        </svg>
      );

    case 'mustard':
      return (
        <svg viewBox="0 0 64 64" fill="none" className={combinedClass} xmlns="http://www.w3.org/2000/svg" aria-label={name || "Mustard"}>
          <rect width="64" height="64" rx="14" fill="#FEFCE8" />
          {/* Bowl */}
          <ellipse cx="32" cy="44" rx="18" ry="7" fill="#78350F" />
          <path d="M14 44C14 54 22 56 32 56C42 56 50 54 50 44H14Z" fill="#92400E" />
          {/* Mustard seeds in bowl */}
          <ellipse cx="32" cy="43" rx="16" ry="6" fill="#451A03" />
          <circle cx="24" cy="42" r="1.5" fill="#FACC15" />
          <circle cx="30" cy="41" r="1.5" fill="#FACC15" />
          <circle cx="36" cy="43" r="1.5" fill="#FACC15" />
          <circle cx="40" cy="42" r="1.5" fill="#FACC15" />
          <circle cx="32" cy="45" r="1.5" fill="#FACC15" />
          {/* Yellow mustard flower spray */}
          <path d="M32 38V14" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" />
          <circle cx="32" cy="12" r="4" fill="#FDE047" stroke="#EAB308" strokeWidth="1" />
          <circle cx="26" cy="18" r="3.5" fill="#FDE047" stroke="#EAB308" strokeWidth="1" />
          <circle cx="38" cy="18" r="3.5" fill="#FDE047" stroke="#EAB308" strokeWidth="1" />
          <circle cx="32" cy="24" r="3" fill="#FDE047" stroke="#EAB308" strokeWidth="1" />
        </svg>
      );

    case 'castor':
      return (
        <svg viewBox="0 0 64 64" fill="none" className={combinedClass} xmlns="http://www.w3.org/2000/svg" aria-label={name || "Castor Seeds"}>
          <rect width="64" height="64" rx="14" fill="#F0FDF4" />
          {/* Spiky capsule */}
          <circle cx="26" cy="30" r="12" fill="#15803D" />
          {/* Spikes */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
            <path key={deg} d="M26 16L24 12L28 12Z" fill="#166534" transform={`rotate(${deg} 26 30)`} />
          ))}
          {/* Castor seed (mottled bean) */}
          <ellipse cx="44" cy="36" rx="9" ry="12" fill="#78350F" stroke="#451A03" strokeWidth="1.5" transform="rotate(-15 44 36)" />
          {/* Mottled patches on seed */}
          <ellipse cx="42" cy="32" rx="3" ry="4" fill="#D97706" transform="rotate(-15 42 32)" />
          <ellipse cx="46" cy="40" rx="3.5" ry="3" fill="#D97706" transform="rotate(-15 46 40)" />
          <ellipse cx="41" cy="42" rx="2" ry="3" fill="#FEF3C7" transform="rotate(-15 41 42)" />
        </svg>
      );

    case 'soyabean':
      return (
        <svg viewBox="0 0 64 64" fill="none" className={combinedClass} xmlns="http://www.w3.org/2000/svg" aria-label={name || "Soyabean"}>
          <rect width="64" height="64" rx="14" fill="#FEFCE8" />
          {/* Soybean green pod with 3 bumps */}
          <path d="M12 28C14 20 22 20 26 23C30 26 34 26 38 23C42 20 48 22 52 30C48 38 42 36 38 33C34 30 30 30 26 33C22 36 14 36 12 28Z" fill="#84CC16" stroke="#4D7C0F" strokeWidth="1.5" />
          {/* Golden round soybeans */}
          <ellipse cx="26" cy="44" rx="7" ry="6" fill="#FACC15" stroke="#CA8A04" strokeWidth="1.5" />
          <path d="M26 41C26 43 27 45 28 45" stroke="#713F12" strokeWidth="1" strokeLinecap="round" />
          <ellipse cx="40" cy="42" rx="6.5" ry="5.5" fill="#FACC15" stroke="#CA8A04" strokeWidth="1.5" />
          <path d="M40 39C40 41 41 43 42 43" stroke="#713F12" strokeWidth="1" strokeLinecap="round" />
        </svg>
      );

    case 'safflower':
    case 'other_oilseeds':
      return (
        <svg viewBox="0 0 64 64" fill="none" className={combinedClass} xmlns="http://www.w3.org/2000/svg" aria-label={name || "Oilseeds"}>
          <rect width="64" height="64" rx="14" fill="#FEFCE8" />
          <circle cx="32" cy="32" r="18" fill="#FDE047" stroke="#EAB308" strokeWidth="1.5" />
          <path d="M32 18C32 18 24 28 24 34C24 38.4 27.6 42 32 42C36.4 42 40 38.4 40 34C40 28 32 18 32 18Z" fill="#EA580C" />
          <circle cx="28" cy="34" r="2" fill="#FEF08A" />
        </svg>
      );

    // ==========================================
    // 2. FRUITS & VEGETABLES
    // ==========================================
    case 'mangoes':
      return (
        <svg viewBox="0 0 64 64" fill="none" className={combinedClass} xmlns="http://www.w3.org/2000/svg" aria-label={name || "Mangoes (Banganapalli)"}>
          <rect width="64" height="64" rx="14" fill="#FFFBEB" />
          {/* Andhra Banganapalli Mango */}
          <path d="M38 18C44 24 48 34 44 42C40 50 30 52 24 48C18 44 18 34 22 24C26 14 34 14 38 18Z" fill="#F59E0B" stroke="#D97706" strokeWidth="1.5" />
          {/* Golden highlight */}
          <path d="M36 22C40 26 42 34 38 40" stroke="#FDE047" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
          {/* Mango beak / curve tip */}
          <path d="M24 48C23 50 21 50 20 48" stroke="#D97706" strokeWidth="2" strokeLinecap="round" />
          {/* Green stem & leaf */}
          <path d="M36 18C36 12 34 10 32 8" stroke="#78350F" strokeWidth="2" strokeLinecap="round" />
          <path d="M36 16C42 12 48 14 50 16C48 20 42 20 36 16Z" fill="#16A34A" stroke="#15803D" strokeWidth="1" />
        </svg>
      );

    case 'bananas':
      return (
        <svg viewBox="0 0 64 64" fill="none" className={combinedClass} xmlns="http://www.w3.org/2000/svg" aria-label={name || "Bananas"}>
          <rect width="64" height="64" rx="14" fill="#FEFCE8" />
          {/* Banana 1 */}
          <path d="M16 44C22 47 38 48 48 30C50 26 50 22 50 22C50 22 46 25 42 27C34 32 24 32 16 26C14 32 14 38 16 44Z" fill="#FACC15" stroke="#CA8A04" strokeWidth="1.5" />
          {/* Banana 2 */}
          <path d="M18 36C24 40 40 39 46 22C48 18 48 16 48 16C48 16 44 19 38 21C30 25 22 25 15 20C14 26 15 31 18 36Z" fill="#EAB308" stroke="#A16207" strokeWidth="1.5" />
          {/* Stems */}
          <path d="M48 22L52 18" stroke="#4D7C0F" strokeWidth="3" strokeLinecap="round" />
          <path d="M48 16L50 12" stroke="#4D7C0F" strokeWidth="2.5" strokeLinecap="round" />
          {/* Tips */}
          <circle cx="15" cy="38" r="1.5" fill="#713F12" />
        </svg>
      );

    case 'coconuts':
      return (
        <svg viewBox="0 0 64 64" fill="none" className={combinedClass} xmlns="http://www.w3.org/2000/svg" aria-label={name || "Coconuts"}>
          <rect width="64" height="64" rx="14" fill="#F0FDF4" />
          {/* Green tender coconut */}
          <ellipse cx="26" cy="34" rx="14" ry="17" fill="#65A30D" stroke="#4D7C0F" strokeWidth="1.5" />
          {/* Crown */}
          <path d="M22 17L26 13L30 17H22Z" fill="#365314" />
          <ellipse cx="26" cy="32" rx="4" ry="7" fill="#84CC16" opacity="0.6" />
          {/* Brown husked coconut */}
          <circle cx="43" cy="38" r="13" fill="#78350F" stroke="#451A03" strokeWidth="1.5" />
          {/* Coconut 3 eyes */}
          <circle cx="41" cy="32" r="1.5" fill="#292524" />
          <circle cx="45" cy="32" r="1.5" fill="#292524" />
          <circle cx="43" cy="35" r="1.5" fill="#292524" />
          {/* Fibre texture */}
          <path d="M37 40C39 44 47 44 49 40" stroke="#92400E" strokeWidth="1" strokeLinecap="round" />
        </svg>
      );

    case 'tomatoes':
      return (
        <svg viewBox="0 0 64 64" fill="none" className={combinedClass} xmlns="http://www.w3.org/2000/svg" aria-label={name || "Tomatoes"}>
          <rect width="64" height="64" rx="14" fill="#FEF2F2" />
          {/* Main ripe red tomato */}
          <circle cx="32" cy="36" r="18" fill="#DC2626" stroke="#B91C1C" strokeWidth="1.5" />
          {/* Gloss highlight */}
          <ellipse cx="26" cy="30" rx="5" ry="3" fill="#F87171" opacity="0.7" transform="rotate(-30 26 30)" />
          {/* Green sepals / star calyx */}
          <path d="M32 18V12" stroke="#15803D" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M32 18L26 21M32 18L38 21M32 18L28 15M32 18L36 15" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );

    case 'onions':
      return (
        <svg viewBox="0 0 64 64" fill="none" className={combinedClass} xmlns="http://www.w3.org/2000/svg" aria-label={name || "Onions"}>
          <rect width="64" height="64" rx="14" fill="#FAF5FF" />
          {/* Red/purple bulb */}
          <path d="M32 16C24 22 18 30 18 38C18 47 24 52 32 52C40 52 46 47 46 38C46 30 40 22 32 16Z" fill="#C026D3" stroke="#86198F" strokeWidth="1.5" />
          {/* Onion layers/lines */}
          <path d="M32 16C28 24 24 34 24 44" stroke="#E879F9" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
          <path d="M32 16C36 24 40 34 40 44" stroke="#E879F9" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
          {/* Green shoot tips */}
          <path d="M32 16L32 8" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" />
          <path d="M32 16L29 9" stroke="#15803D" strokeWidth="1.5" strokeLinecap="round" />
          {/* Root hairs */}
          <path d="M30 52L29 56M32 52L32 57M34 52L35 56" stroke="#D4D4D8" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );

    case 'chillies':
      return (
        <svg viewBox="0 0 64 64" fill="none" className={combinedClass} xmlns="http://www.w3.org/2000/svg" aria-label={name || "Chillies"}>
          <rect width="64" height="64" rx="14" fill="#FEF2F2" />
          {/* Red Guntur Chilli */}
          <path d="M22 18C28 18 42 26 40 42C39 50 30 52 28 50C26 46 32 40 30 32C28 26 22 22 22 18Z" fill="#DC2626" stroke="#991B1B" strokeWidth="1.5" />
          <path d="M22 18C20 16 18 12 16 12" stroke="#15803D" strokeWidth="2.5" strokeLinecap="round" />
          {/* Green Chilli */}
          <path d="M38 18C34 22 26 30 28 42C29 46 34 46 36 44C38 40 34 32 36 26C38 22 42 20 42 18Z" fill="#16A34A" stroke="#15803D" strokeWidth="1.5" opacity="0.9" />
          <path d="M42 18C44 16 46 14 48 14" stroke="#166534" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    case 'leafy_greens':
      return (
        <svg viewBox="0 0 64 64" fill="none" className={combinedClass} xmlns="http://www.w3.org/2000/svg" aria-label={name || "Leafy Greens (Gongura)"}>
          <rect width="64" height="64" rx="14" fill="#F0FDF4" />
          {/* Leaf 1 (Left) */}
          <path d="M24 48C16 38 16 22 26 18C32 26 30 38 24 48Z" fill="#16A34A" stroke="#15803D" strokeWidth="1.5" />
          {/* Leaf 2 (Right) */}
          <path d="M28 48C38 40 44 26 36 18C28 24 26 38 28 48Z" fill="#22C55E" stroke="#16A34A" strokeWidth="1.5" />
          {/* Center Leaf (Gongura red veins) */}
          <path d="M32 48V20" stroke="#DC2626" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M32 32L26 28M32 38L27 35M32 32L38 28M32 38L37 35" stroke="#DC2626" strokeWidth="1" strokeLinecap="round" />
          <circle cx="28" cy="52" r="3" fill="#84CC16" />
        </svg>
      );

    case 'citrus':
      return (
        <svg viewBox="0 0 64 64" fill="none" className={combinedClass} xmlns="http://www.w3.org/2000/svg" aria-label={name || "Citrus & Lime"}>
          <rect width="64" height="64" rx="14" fill="#FEFCE8" />
          {/* Yellow Lemon / Sweet Lime */}
          <ellipse cx="28" cy="34" rx="14" ry="12" fill="#FACC15" stroke="#CA8A04" strokeWidth="1.5" />
          <circle cx="42" cy="38" r="10" fill="#84CC16" stroke="#4D7C0F" strokeWidth="1.5" />
          <path d="M28 22V16" stroke="#15803D" strokeWidth="2" strokeLinecap="round" />
          <path d="M28 18C34 16 36 18 36 20C32 22 30 20 28 18Z" fill="#16A34A" />
        </svg>
      );

    case 'papaya':
    case 'other_produce':
      return (
        <svg viewBox="0 0 64 64" fill="none" className={combinedClass} xmlns="http://www.w3.org/2000/svg" aria-label={name || "Produce"}>
          <rect width="64" height="64" rx="14" fill="#FFF7ED" />
          <ellipse cx="32" cy="34" rx="14" ry="18" fill="#F97316" stroke="#EA580C" strokeWidth="1.5" />
          <ellipse cx="32" cy="34" rx="7" ry="11" fill="#FEF08A" />
          <circle cx="30" cy="32" r="1.5" fill="#292524" />
          <circle cx="34" cy="34" r="1.5" fill="#292524" />
          <circle cx="32" cy="37" r="1.5" fill="#292524" />
        </svg>
      );

    // ==========================================
    // 3. AQUA & FISHERIES
    // ==========================================
    case 'freshwater_fish':
      return (
        <svg viewBox="0 0 64 64" fill="none" className={combinedClass} xmlns="http://www.w3.org/2000/svg" aria-label={name || "Freshwater Fish (Rohu/Catla)"}>
          <rect width="64" height="64" rx="14" fill="#F0F9FF" />
          {/* Fish Tail */}
          <path d="M46 32L54 22V42L46 32Z" fill="#0284C7" stroke="#0369A1" strokeWidth="1.5" />
          {/* Fish Body */}
          <ellipse cx="28" cy="32" rx="18" ry="11" fill="#38BDF8" stroke="#0284C7" strokeWidth="1.5" />
          {/* Silver belly */}
          <path d="M12 32C12 40 26 43 42 35C38 32 30 31 12 32Z" fill="#E0F2FE" />
          {/* Dorsal fin */}
          <path d="M26 21C30 15 36 17 38 21" stroke="#0284C7" strokeWidth="2.5" strokeLinecap="round" />
          {/* Eye */}
          <circle cx="18" cy="30" r="2.5" fill="#082F49" />
          <circle cx="17.5" cy="29.5" r="1" fill="#FFFFFF" />
          {/* Gill line */}
          <path d="M24 26C26 30 26 34 24 37" stroke="#0284C7" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );

    case 'shrimp_prawn':
      return (
        <svg viewBox="0 0 64 64" fill="none" className={combinedClass} xmlns="http://www.w3.org/2000/svg" aria-label={name || "Shrimp & Prawns (Vannamei)"}>
          <rect width="64" height="64" rx="14" fill="#FFF7ED" />
          {/* Vannamei Prawn curved body */}
          <path d="M20 28C22 18 36 16 44 24C50 30 50 42 42 48C36 52 30 50 26 44" stroke="#F97316" strokeWidth="6" strokeLinecap="round" />
          {/* Prawn segment stripes */}
          <path d="M30 19L29 23M37 21L36 26M43 27L40 31M45 35L41 37M42 43L38 43" stroke="#EA580C" strokeWidth="2" strokeLinecap="round" />
          {/* Tail fan */}
          <path d="M26 44L20 48M26 44L18 43M26 44L22 40" stroke="#EA580C" strokeWidth="3" strokeLinecap="round" />
          {/* Eye */}
          <circle cx="18" cy="28" r="2" fill="#431407" />
          {/* Long antennae */}
          <path d="M18 26C12 24 10 16 8 12M18 28C10 32 8 38 6 42" stroke="#F97316" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      );

    case 'aquaculture_ponds':
      return (
        <svg viewBox="0 0 64 64" fill="none" className={combinedClass} xmlns="http://www.w3.org/2000/svg" aria-label={name || "Aqua Ponds & Pumping"}>
          <rect width="64" height="64" rx="14" fill="#ECFCCB" />
          {/* Ponds dyke perspective */}
          <polygon points="12,18 52,18 58,46 6,46" fill="#0284C7" stroke="#0369A1" strokeWidth="1.5" />
          {/* Water waves */}
          <path d="M16 26C20 28 24 28 28 26C32 24 36 24 40 26C44 28 48 28 50 26" stroke="#BAE6FD" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M14 36C18 38 24 38 28 36C32 34 38 34 42 36C46 38 50 38 54 36" stroke="#BAE6FD" strokeWidth="1.5" strokeLinecap="round" />
          {/* Pond bank border */}
          <line x1="6" y1="46" x2="58" y2="46" stroke="#65A30D" strokeWidth="4" />
        </svg>
      );

    case 'fish_seed':
      return (
        <svg viewBox="0 0 64 64" fill="none" className={combinedClass} xmlns="http://www.w3.org/2000/svg" aria-label={name || "Fish Seed & Fry"}>
          <rect width="64" height="64" rx="14" fill="#F0F9FF" />
          {/* Small fish fry 1 */}
          <ellipse cx="24" cy="24" rx="8" ry="4" fill="#0284C7" />
          <path d="M31 24L36 20V28L31 24Z" fill="#0284C7" />
          <circle cx="19" cy="23" r="1" fill="#FFFFFF" />
          {/* Small fish fry 2 */}
          <ellipse cx="38" cy="36" rx="9" ry="4.5" fill="#0EA5E9" />
          <path d="M46 36L51 32V40L46 36Z" fill="#0EA5E9" />
          <circle cx="33" cy="35" r="1.2" fill="#FFFFFF" />
          {/* Small fish fry 3 */}
          <ellipse cx="22" cy="44" rx="7" ry="3.5" fill="#38BDF8" />
          <path d="M28 44L33 41V47L28 44Z" fill="#38BDF8" />
          {/* Water bubbles */}
          <circle cx="44" cy="18" r="2.5" fill="#BAE6FD" opacity="0.8" />
          <circle cx="28" cy="34" r="1.5" fill="#BAE6FD" opacity="0.8" />
        </svg>
      );

    case 'aqua_feed':
      return (
        <svg viewBox="0 0 64 64" fill="none" className={combinedClass} xmlns="http://www.w3.org/2000/svg" aria-label={name || "Aqua Feed & Pellets"}>
          <rect width="64" height="64" rx="14" fill="#FEFCE8" />
          {/* Feed bag */}
          <path d="M20 20L24 16H40L44 20L48 52H16L20 20Z" fill="#B45309" stroke="#78350F" strokeWidth="1.5" />
          <rect x="22" y="28" width="20" height="14" rx="2" fill="#FEF3C7" />
          {/* Fish emblem on bag */}
          <ellipse cx="32" cy="35" rx="5" ry="3" fill="#0284C7" />
          {/* Floating feed pellets */}
          <circle cx="48" cy="38" r="2.5" fill="#92400E" />
          <circle cx="52" cy="44" r="2" fill="#92400E" />
          <circle cx="48" cy="48" r="2.5" fill="#92400E" />
        </svg>
      );

    case 'aerators_nets':
    case 'fishing_equipment':
      return (
        <svg viewBox="0 0 64 64" fill="none" className={combinedClass} xmlns="http://www.w3.org/2000/svg" aria-label={name || "Aqua Aerator & Net"}>
          <rect width="64" height="64" rx="14" fill="#F0F9FF" />
          {/* Paddle-wheel aerator */}
          <circle cx="32" cy="32" r="8" fill="#0284C7" stroke="#0369A1" strokeWidth="1.5" />
          {/* Paddle blades */}
          {[0, 60, 120, 180, 240, 300].map((deg) => (
            <rect key={deg} x="30" y="14" width="4" height="10" rx="1" fill="#F59E0B" transform={`rotate(${deg} 32 32)`} />
          ))}
          {/* Water splash droplets */}
          <circle cx="16" cy="22" r="2" fill="#38BDF8" />
          <circle cx="48" cy="22" r="2" fill="#38BDF8" />
          <circle cx="20" cy="44" r="2" fill="#38BDF8" />
          <circle cx="44" cy="44" r="2" fill="#38BDF8" />
          <path d="M12 48H52" stroke="#0284C7" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );

    // ==========================================
    // 4. MACHINERY & RENTALS
    // ==========================================
    case 'tractors_tillers':
      return (
        <svg viewBox="0 0 64 64" fill="none" className={combinedClass} xmlns="http://www.w3.org/2000/svg" aria-label={name || "Tractor & Power Tiller"}>
          <rect width="64" height="64" rx="14" fill="#ECFCCB" />
          {/* Tractor Hood */}
          <rect x="22" y="24" width="24" height="14" rx="3" fill="#15803D" stroke="#166534" strokeWidth="1.5" />
          <rect x="34" y="18" width="12" height="8" rx="1.5" fill="#14532D" />
          {/* Exhaust pipe */}
          <line x1="26" y1="24" x2="26" y2="14" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
          {/* Big Rear Tire */}
          <circle cx="42" cy="42" r="11" fill="#1E293B" />
          <circle cx="42" cy="42" r="7" fill="#FACC15" />
          <circle cx="42" cy="42" r="3" fill="#0F172A" />
          {/* Small Front Tire */}
          <circle cx="18" cy="45" r="7" fill="#1E293B" />
          <circle cx="18" cy="45" r="4" fill="#FACC15" />
        </svg>
      );

    case 'harvesters_threshers':
    case 'harvesters_combine':
      return (
        <svg viewBox="0 0 64 64" fill="none" className={combinedClass} xmlns="http://www.w3.org/2000/svg" aria-label={name || "Combine Harvester"}>
          <rect width="64" height="64" rx="14" fill="#FEFCE8" />
          {/* Combine Body */}
          <rect x="22" y="20" width="28" height="18" rx="2" fill="#EAB308" stroke="#CA8A04" strokeWidth="1.5" />
          {/* Cabin */}
          <rect x="34" y="14" width="14" height="8" rx="1" fill="#38BDF8" opacity="0.8" stroke="#0284C7" strokeWidth="1" />
          {/* Rotating reel header cutter */}
          <circle cx="14" cy="38" r="8" fill="#F59E0B" stroke="#B45309" strokeWidth="1.5" />
          <line x1="14" y1="30" x2="14" y2="46" stroke="#78350F" strokeWidth="1.5" />
          <line x1="6" y1="38" x2="22" y2="38" stroke="#78350F" strokeWidth="1.5" />
          {/* Track / Crawler base */}
          <rect x="24" y="40" width="26" height="8" rx="4" fill="#1E293B" />
        </svg>
      );

    case 'rotavators_cultivators':
      return (
        <svg viewBox="0 0 64 64" fill="none" className={combinedClass} xmlns="http://www.w3.org/2000/svg" aria-label={name || "Rotavators & Cultivators"}>
          <rect width="64" height="64" rx="14" fill="#F5F5F4" />
          {/* Heavy frame */}
          <rect x="14" y="22" width="36" height="6" rx="2" fill="#DC2626" />
          <path d="M26 22L32 14L38 22" stroke="#DC2626" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          {/* Curved tilling blades */}
          <path d="M18 28C18 36 20 44 26 46" stroke="#1E293B" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M28 28C28 36 30 44 36 46" stroke="#1E293B" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M38 28C38 36 40 44 46 46" stroke="#1E293B" strokeWidth="3.5" strokeLinecap="round" />
        </svg>
      );

    case 'spraying_equipment':
      return (
        <svg viewBox="0 0 64 64" fill="none" className={combinedClass} xmlns="http://www.w3.org/2000/svg" aria-label={name || "Sprayer Equipment"}>
          <rect width="64" height="64" rx="14" fill="#F0FDF4" />
          {/* Blue tank */}
          <rect x="18" y="22" width="20" height="28" rx="4" fill="#0284C7" stroke="#0369A1" strokeWidth="1.5" />
          {/* Tank lid */}
          <rect x="22" y="18" width="12" height="5" rx="1.5" fill="#FACC15" />
          {/* Pressure pump lance & hose */}
          <path d="M38 42C44 42 46 36 48 24" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
          <line x1="48" y1="24" x2="48" y2="12" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
          {/* Spray mist droplets */}
          <circle cx="52" cy="10" r="1.5" fill="#38BDF8" />
          <circle cx="56" cy="12" r="1.5" fill="#38BDF8" />
          <circle cx="54" cy="8" r="1.5" fill="#38BDF8" />
        </svg>
      );

    case 'threshers':
      return (
        <svg viewBox="0 0 64 64" fill="none" className={combinedClass} xmlns="http://www.w3.org/2000/svg" aria-label={name || "Threshers"}>
          <rect width="64" height="64" rx="14" fill="#FFF7ED" />
          <rect x="18" y="22" width="28" height="22" rx="2" fill="#EA580C" stroke="#C2410C" strokeWidth="1.5" />
          <polygon points="26,14 38,14 42,22 22,22" fill="#F97316" />
          <circle cx="32" cy="33" r="6" fill="#1E293B" />
          <line x1="22" y1="44" x2="20" y2="52" stroke="#1E293B" strokeWidth="2.5" />
          <line x1="42" y1="44" x2="44" y2="52" stroke="#1E293B" strokeWidth="2.5" />
        </svg>
      );

    case 'machinery_rental':
      return (
        <svg viewBox="0 0 64 64" fill="none" className={combinedClass} xmlns="http://www.w3.org/2000/svg" aria-label={name || "Machinery Rentals"}>
          <rect width="64" height="64" rx="14" fill="#FEFCE8" />
          {/* Tractor contour */}
          <path d="M16 38H40V28H28L24 34H16V38Z" fill="#15803D" />
          <circle cx="22" cy="42" r="6" fill="#1E293B" />
          <circle cx="38" cy="40" r="8" fill="#1E293B" />
          {/* Clock badge for hourly rental */}
          <circle cx="44" cy="20" r="9" fill="#F59E0B" stroke="#B45309" strokeWidth="1.5" />
          <polyline points="44,15 44,20 48,22" stroke="#78350F" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    // ==========================================
    // 5. IRRIGATION & WATER SOLUTIONS
    // ==========================================
    case 'submersible_motors':
      return (
        <svg viewBox="0 0 64 64" fill="none" className={combinedClass} xmlns="http://www.w3.org/2000/svg" aria-label={name || "Submersible Motor & Pump"}>
          <rect width="64" height="64" rx="14" fill="#F0F9FF" />
          {/* Stainless steel deepwell borehole cylindrical pump */}
          <rect x="26" y="16" width="12" height="36" rx="2" fill="#0284C7" stroke="#0369A1" strokeWidth="1.5" />
          {/* Suction inlet mesh grill */}
          <rect x="26" y="32" width="12" height="6" fill="#1E293B" />
          <line x1="26" y1="34" x2="38" y2="34" stroke="#64748B" strokeWidth="1" />
          <line x1="26" y1="36" x2="38" y2="36" stroke="#64748B" strokeWidth="1" />
          {/* Top delivery discharge bend */}
          <path d="M32 16V10H42" stroke="#0284C7" strokeWidth="3.5" strokeLinecap="round" />
          {/* Water jet */}
          <path d="M42 10C48 10 52 14 54 20" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="3 3" />
        </svg>
      );

    case 'drip_sprinklers':
    case 'drip_irrigation':
      return (
        <svg viewBox="0 0 64 64" fill="none" className={combinedClass} xmlns="http://www.w3.org/2000/svg" aria-label={name || "Drip Irrigation"}>
          <rect width="64" height="64" rx="14" fill="#F0FDF4" />
          {/* Black drip lateral pipe coil */}
          <circle cx="32" cy="32" r="18" stroke="#1E293B" strokeWidth="4" />
          <circle cx="32" cy="32" r="11" stroke="#334155" strokeWidth="3" />
          {/* Drip emitters releasing drops */}
          <rect x="30" y="11" width="4" height="6" fill="#16A34A" />
          <path d="M32 20C32 20 29 23 29 25C29 26.6 30.3 28 32 28C33.7 28 35 26.6 35 25C35 23 32 20 32 20Z" fill="#0EA5E9" />
          <path d="M43 32C43 32 46 35 46 37C46 38.6 44.7 40 43 40C41.3 40 40 38.6 40 37C40 35 43 32 43 32Z" fill="#0EA5E9" />
        </svg>
      );

    case 'sprinkler_systems':
      return (
        <svg viewBox="0 0 64 64" fill="none" className={combinedClass} xmlns="http://www.w3.org/2000/svg" aria-label={name || "Sprinkler System & Rain Gun"}>
          <rect width="64" height="64" rx="14" fill="#F0F9FF" />
          {/* Riser pipe */}
          <line x1="32" y1="52" x2="32" y2="30" stroke="#1E293B" strokeWidth="4" strokeLinecap="round" />
          {/* Sprinkler head / impact arm */}
          <rect x="28" y="24" width="8" height="6" fill="#F59E0B" stroke="#B45309" strokeWidth="1" />
          <line x1="22" y1="22" x2="42" y2="22" stroke="#DC2626" strokeWidth="3" strokeLinecap="round" />
          {/* 360 spray arc */}
          <path d="M16 16C24 10 40 10 48 16" stroke="#0284C7" strokeWidth="2" strokeLinecap="round" strokeDasharray="3 3" />
          <circle cx="14" cy="18" r="1.5" fill="#38BDF8" />
          <circle cx="50" cy="18" r="1.5" fill="#38BDF8" />
          <circle cx="32" cy="8" r="2" fill="#38BDF8" />
        </svg>
      );

    case 'pvc_pipes':
      return (
        <svg viewBox="0 0 64 64" fill="none" className={combinedClass} xmlns="http://www.w3.org/2000/svg" aria-label={name || "PVC & HDPE Pipes"}>
          <rect width="64" height="64" rx="14" fill="#F0F9FF" />
          {/* Pipe 1 (Top Blue) */}
          <rect x="12" y="16" width="36" height="8" rx="2" fill="#0284C7" />
          <ellipse cx="48" cy="20" rx="3" ry="4" fill="#38BDF8" stroke="#0284C7" strokeWidth="1" />
          {/* Pipe 2 (Middle Grey/White) */}
          <rect x="16" y="28" width="34" height="8" rx="2" fill="#64748B" />
          <ellipse cx="50" cy="32" rx="3" ry="4" fill="#94A3B8" stroke="#64748B" strokeWidth="1" />
          {/* Pipe 3 (Bottom Blue) */}
          <rect x="14" y="40" width="36" height="8" rx="2" fill="#0284C7" />
          <ellipse cx="50" cy="44" rx="3" ry="4" fill="#38BDF8" stroke="#0284C7" strokeWidth="1" />
        </svg>
      );

    case 'water_tanks':
      return (
        <svg viewBox="0 0 64 64" fill="none" className={combinedClass} xmlns="http://www.w3.org/2000/svg" aria-label={name || "Water Tanks"}>
          <rect width="64" height="64" rx="14" fill="#F0F9FF" />
          {/* Cylindrical layered storage tank */}
          <rect x="18" y="20" width="28" height="32" rx="4" fill="#0284C7" stroke="#0369A1" strokeWidth="1.5" />
          <ellipse cx="32" cy="20" rx="14" ry="4" fill="#38BDF8" stroke="#0369A1" strokeWidth="1" />
          {/* Ribs / Bands */}
          <line x1="18" y1="30" x2="46" y2="30" stroke="#0369A1" strokeWidth="1.5" />
          <line x1="18" y1="40" x2="46" y2="40" stroke="#0369A1" strokeWidth="1.5" />
          {/* Top Lid */}
          <rect x="28" y="14" width="8" height="4" rx="1" fill="#1E293B" />
        </svg>
      );

    case 'solar_pumps':
      return (
        <svg viewBox="0 0 64 64" fill="none" className={combinedClass} xmlns="http://www.w3.org/2000/svg" aria-label={name || "Solar Pump Sets"}>
          <rect width="64" height="64" rx="14" fill="#FEFCE8" />
          {/* Solar Panel grid */}
          <polygon points="16,30 40,22 48,34 24,42" fill="#1E3A8A" stroke="#1D4ED8" strokeWidth="1.5" />
          {/* Stand */}
          <line x1="32" y1="34" x2="32" y2="52" stroke="#64748B" strokeWidth="3" />
          {/* Sun rays */}
          <circle cx="48" cy="14" r="5" fill="#F59E0B" />
          {/* Water stream out */}
          <path d="M34 50C42 50 46 44 50 44" stroke="#0EA5E9" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );

    case 'borewell_drilling':
      return (
        <svg viewBox="0 0 64 64" fill="none" className={combinedClass} xmlns="http://www.w3.org/2000/svg" aria-label={name || "Borewell Drilling"}>
          <rect width="64" height="64" rx="14" fill="#F5F5F4" />
          {/* Derrick mast */}
          <polygon points="32,10 24,44 40,44" stroke="#DC2626" strokeWidth="2.5" fill="none" />
          <line x1="28" y1="26" x2="36" y2="26" stroke="#DC2626" strokeWidth="2" />
          <line x1="26" y1="36" x2="38" y2="36" stroke="#DC2626" strokeWidth="2" />
          {/* Ground */}
          <line x1="10" y1="48" x2="54" y2="48" stroke="#78350F" strokeWidth="4" />
          {/* Drill stem */}
          <line x1="32" y1="12" x2="32" y2="56" stroke="#1E293B" strokeWidth="3" />
        </svg>
      );

    // ==========================================
    // OTHER CEREALS & GRAINS / LIVESTOCK
    // ==========================================
    case 'paddy_rice':
      return (
        <svg viewBox="0 0 64 64" fill="none" className={combinedClass} xmlns="http://www.w3.org/2000/svg" aria-label={name || "Paddy & Rice"}>
          <rect width="64" height="64" rx="14" fill="#FEFCE8" />
          <path d="M22 46C24 38 28 26 40 18" stroke="#D97706" strokeWidth="2.5" strokeLinecap="round" />
          {[20, 26, 32, 38].map((y, idx) => (
            <ellipse key={idx} cx={34 - idx * 2} cy={y} rx="4" ry="2" fill="#F59E0B" transform="rotate(-30)" />
          ))}
          <ellipse cx="44" cy="44" rx="8" ry="5" fill="#FEF3C7" stroke="#D97706" strokeWidth="1" />
        </svg>
      );

    case 'cows_buffaloes':
      return (
        <svg viewBox="0 0 64 64" fill="none" className={combinedClass} xmlns="http://www.w3.org/2000/svg" aria-label={name || "Cows & Buffaloes"}>
          <rect width="64" height="64" rx="14" fill="#FFF7ED" />
          <ellipse cx="32" cy="34" rx="14" ry="12" fill="#FFFFFF" stroke="#D97706" strokeWidth="1.5" />
          <path d="M22 22C18 16 20 12 24 14" stroke="#78350F" strokeWidth="3" strokeLinecap="round" />
          <path d="M42 22C46 16 44 12 40 14" stroke="#78350F" strokeWidth="3" strokeLinecap="round" />
          <circle cx="27" cy="30" r="2" fill="#1C1917" />
          <circle cx="37" cy="30" r="2" fill="#1C1917" />
          <ellipse cx="32" cy="40" rx="7" ry="4" fill="#FBCFE8" />
        </svg>
      );

    default:
      return (
        <svg viewBox="0 0 64 64" fill="none" className={combinedClass} xmlns="http://www.w3.org/2000/svg" aria-label={name || "Subcategory"}>
          <rect width="64" height="64" rx="14" fill="#F0FDF4" />
          <circle cx="32" cy="32" r="14" fill="#22C55E" opacity="0.2" />
          <path d="M32 20C32 20 24 28 24 34C24 38.4 27.6 42 32 42C36.4 42 40 38.4 40 34C40 28 32 20 32 20Z" fill="#15803D" />
        </svg>
      );
  }
};
