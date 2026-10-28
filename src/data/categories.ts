import { Category } from '../types';

export const DEFAULT_CATEGORIES: Category[] = [
  {
    id: 'paddy_rice',
    name: 'Paddy & Rice',
    nameEn: 'Paddy & Rice',
    nameTe: 'వరి & బియ్యం',
    te: 'వరి & బియ్యం',
    icon: 'Sprout',
    imageUrl: '/assets/categories/paddy_rice_clean.png',
    bgColor: '#E9F6E7',
    borderColor: '#C7E8D0',
    subcategories: [
      { id: 'paddy_grain', name: 'Raw Paddy (వరి ధాన్యం)', nameEn: 'Raw Paddy', nameTe: 'వరి ధాన్యం', te: 'వరి ధాన్యం' },
      { id: 'bpt_rice', name: 'BPT / Sona Masoori Rice (సోనా మసూరి బియ్యం)', nameEn: 'Sona Masoori Rice', nameTe: 'సోనా మసూరి బియ్యం', te: 'సోనా మసూరి బియ్యం' },
      { id: 'basmati_rice', name: 'Basmati & Premium Varieties (బాస్మతి రకాలు)', nameEn: 'Basmati Rice', nameTe: 'బాస్మతి రకాలు', te: 'బాస్మతి రకాలు' },
      { id: 'broken_rice', name: 'Broken Rice / Kanki (నూకలు)', nameEn: 'Broken Rice', nameTe: 'నూకలు', te: 'నూకలు' },
      { id: 'paddy_straw', name: 'Paddy Straw / Gaddi (వరి గడ్డి)', nameEn: 'Paddy Straw', nameTe: 'వరి గడ్డి', te: 'వరి గడ్డి' },
      { id: 'paddy_seeds', name: 'Certified Paddy Seeds (విత్తనాలు)', nameEn: 'Paddy Seeds', nameTe: 'విత్తనాలు', te: 'విత్తనాలు' }
    ]
  },
  {
    id: 'vegetables_fruits',
    name: 'Vegetables & Fruits',
    nameEn: 'Vegetables & Fruits',
    nameTe: 'కూరగాయలు & పండ్లు',
    te: 'కూరగాయలు & పండ్లు',
    icon: 'Apple',
    imageUrl: '/assets/categories/veg_fruits_clean.png',
    bgColor: '#FEF7DA',
    borderColor: '#FBE8A6',
    subcategories: [
      { id: 'tomatoes', name: 'Tomatoes & Chilies (టమోటా & మిర్చి)', nameEn: 'Tomatoes & Chilies', nameTe: 'టమోటా & మిర్చి', te: 'టమోటా & మిర్చి' },
      { id: 'onions_potatoes', name: 'Onions & Potatoes (ఉల్లి & బంగాళాదుంప)', nameEn: 'Onions & Potatoes', nameTe: 'ఉల్లి & బంగాళాదుంప', te: 'ఉల్లి & బంగాళాదుంప' },
      { id: 'leafy_veggies', name: 'Fresh Greens & Leafy Veggies (ఆకుకూరలు)', nameEn: 'Leafy Veggies', nameTe: 'ఆకుకూరలు', te: 'ఆకుకూరలు' },
      { id: 'mangoes', name: 'Mangoes - Banganapalli / Totapuri (మామిడి)', nameEn: 'Mangoes', nameTe: 'మామిడి', te: 'మామిడి' },
      { id: 'coconuts', name: 'Tender & Dry Coconuts (కొబ్బరి బొండాలు)', nameEn: 'Coconuts', nameTe: 'కొబ్బరి బొండాలు', te: 'కొబ్బరి బొండాలు' },
      { id: 'bananas_citrus', name: 'Bananas, Papaya & Citrus (అరటి, బత్తాయి)', nameEn: 'Bananas & Citrus', nameTe: 'అరటి, బత్తాయి', te: 'అరటి, బత్తాయి' }
    ]
  },
  {
    id: 'aqua',
    name: 'Aqua',
    nameEn: 'Aqua & Fisheries',
    nameTe: 'ఆక్వా',
    te: 'ఆక్వా',
    icon: 'Fish',
    imageUrl: '/assets/categories/aqua_clean.png',
    bgColor: '#E3F5FA',
    borderColor: '#BFE7F5',
    subcategories: [
      { id: 'vannamei_prawns', name: 'Vannamei Shrimp / Prawns (రొయ్యలు)', nameEn: 'Vannamei Shrimp', nameTe: 'రొయ్యలు', te: 'రొయ్యలు' },
      { id: 'freshwater_fish', name: 'Freshwater Rohu & Katla (చేపలు)', nameEn: 'Freshwater Fish', nameTe: 'చేపలు', te: 'చేపలు' },
      { id: 'fish_seed', name: 'Fish & Prawn Seed / Hatchery (చేప పిల్లలు)', nameEn: 'Fish Seed', nameTe: 'చేప పిల్లలు', te: 'చేప పిల్లలు' },
      { id: 'aqua_feed', name: 'Aqua Feed & Supplements (ఆక్వా ఫీడ్)', nameEn: 'Aqua Feed', nameTe: 'ఆక్వా ఫీడ్', te: 'ఆక్వా ఫీడ్' },
      { id: 'aerators_aqua_equip', name: 'Aerators & Pond Equipment (ఎరేటర్లు)', nameEn: 'Aerators & Equip', nameTe: 'ఎరేటర్లు', te: 'ఎరేటర్లు' }
    ]
  },
  {
    id: 'livestock',
    name: 'Livestock',
    nameEn: 'Livestock & Dairy',
    nameTe: 'పశువులు',
    te: 'పశువులు',
    icon: 'Beef',
    imageUrl: '/assets/categories/livestock_clean.png',
    bgColor: '#FDF2E1',
    borderColor: '#F9DFBF',
    subcategories: [
      { id: 'murrah_buffaloes', name: 'Murrah & Graded Buffaloes (గేదెలు)', nameEn: 'Murrah Buffaloes', nameTe: 'గేదెలు', te: 'గేదెలు' },
      { id: 'desi_cows', name: 'Desi & HF Dairy Cows (పాడి ఆవులు)', nameEn: 'Desi Cows', nameTe: 'పాడి ఆవులు', te: 'పాడి ఆవులు' },
      { id: 'nellore_sheep', name: 'Nellore Jodipi Sheep (నెల్లూరు జోడిపి గొర్రెలు)', nameEn: 'Nellore Jodipi Sheep', nameTe: 'నెల్లూరు జోడిపి గొర్రెలు', te: 'నెల్లూరు జోడిపి గొర్రెలు' },
      { id: 'goats', name: 'Boer, Osmanabadi & Local Goats (మేకలు)', nameEn: 'Goats', nameTe: 'మేకలు', te: 'మేకలు' },
      { id: 'country_poultry', name: 'Natukodi & Country Poultry (నాటుకోళ్లు)', nameEn: 'Country Poultry', nameTe: 'నాటుకోళ్లు', te: 'నాటుకోళ్లు' },
      { id: 'silage_fodder', name: 'Green Fodder & Silage (పచ్చి మేత & సైలేజ్)', nameEn: 'Green Fodder', nameTe: 'పచ్చి మేత & సైలేజ్', te: 'పచ్చి మేత & సైలేజ్' }
    ]
  },
  {
    id: 'other',
    name: 'Other',
    nameEn: 'Other & Machinery',
    nameTe: 'ఇతరాలు',
    te: 'ఇతరాలు',
    icon: 'Wrench',
    imageUrl: '/assets/categories/other_clean.png',
    bgColor: '#E8F6E7',
    borderColor: '#C6E8D0',
    subcategories: [
      { id: 'tractors_harvesters', name: 'Tractors & Harvester Rentals (ట్రాక్టర్లు)', nameEn: 'Tractor Rentals', nameTe: 'ట్రాక్టర్లు', te: 'ట్రాక్టర్లు' },
      { id: 'rotavator_cultivator', name: 'Rotavators & Implements (రోటవేటర్లు)', nameEn: 'Rotavators', nameTe: 'రోటవేటర్లు', te: 'రోటవేటర్లు' },
      { id: 'drip_irrigation', name: 'Drip & Sprinkler Systems (బిందు సేద్యం)', nameEn: 'Drip Irrigation', nameTe: 'బిందు సేద్యం', te: 'బిందు సేద్యం' },
      { id: 'organic_fertilizers', name: 'Organic Fertilizers & Vermicompost (ఎరువులు)', nameEn: 'Fertilizers', nameTe: 'ఎరువులు', te: 'ఎరువులు' },
      { id: 'seeds_nursery', name: 'Plant Nursery & Hybrid Seeds (నర్సరీ మొక్కలు)', nameEn: 'Nursery Seeds', nameTe: 'నర్సరీ మొక్కలు', te: 'నర్సరీ మొక్కలు' },
      { id: 'farm_land', name: 'Farmland Buy / Lease (వ్యవసాయ భూములు)', nameEn: 'Farmland', nameTe: 'వ్యవసాయ భూములు', te: 'వ్యవసాయ భూములు' }
    ]
  }
];

export function normalizeCategoryId(catId?: string): string {
  if (!catId) return 'paddy_rice';
  const c = catId.toLowerCase().trim();

  if (c.includes('paddy') || c.includes('rice') || c.includes('grain')) {
    return 'paddy_rice';
  }
  if (c.includes('veg') || c.includes('fruit') || c.includes('produce') || c.includes('horticulture')) {
    return 'vegetables_fruits';
  }
  if (c.includes('aqua') || c.includes('fish') || c.includes('prawn') || c.includes('shrimp')) {
    return 'aqua';
  }
  if (c.includes('live') || c.includes('cattle') || c.includes('sheep') || c.includes('goat') || c.includes('cow') || c.includes('buffalo') || c.includes('poultry')) {
    return 'livestock';
  }
  return 'other';
}

export function getCategoryById(id: string): Category {
  const norm = normalizeCategoryId(id);
  return DEFAULT_CATEGORIES.find(c => c.id === norm) || DEFAULT_CATEGORIES[0];
}
