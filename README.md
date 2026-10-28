# SanthaLO - Andhra Pradesh Rural & Agricultural Marketplace

SanthaLO is a modern, high-performance marketplace application connecting farmers, buyers, sellers, and agricultural service providers across all districts and mandals of Andhra Pradesh — eliminating middlemen and commission fees.

## Key Features

- **Bilingual Interface**: Seamless instant toggle between Telugu (తెలుగు) and English (EN).
- **Comprehensive Agricultural Categories**:
  - Paddy & Grains (వరి & ధాన్యాలు - BPT 5204 Sona Masoori, etc.)
  - Commercial Crops (వాణిజ్య పంటలు - Chilli, Cotton, Tobacco, Groundnut)
  - Vegetables & Fruits (కూరగాయలు & పండ్లు)
  - Livestock & Fodder (పశువులు & మేత - Nellore Jodipi, Murrah Buffaloes, Ongole Cows, Country Chicken)
  - Farm Equipment & Machinery (ట్రాక్టర్లు & యంత్రాలు - Mahindra 575 DI, Harvesters, Tillers for sale or rent)
  - Agricultural Land & Leases (వ్యవసాయ భూములు)
  - Seeds, Fertilizers & Nursery (విత్తనాలు, ఎరువులు & మొక్కలు)
  - Aqua & Fisheries (ఆక్వా & రొయ్యల చెరువులు)
- **Direct Buyer-Seller Connection**: Direct calling, WhatsApp messaging, and in-app chat with real farmers and verified local sellers.
- **Location-Based Browsing**: Filter listings specifically across 26 Andhra Pradesh districts, revenue mandals, and villages.
- **Authentication & Roles**:
  - Google Authentication with account picker.
  - Farmer Profiles with customizable roles (Seller, Buyer, or Both).
  - Admin Console with administrative controls and moderation.
  - Verified Admin Accounts: `vasu.kannaluri@gmail.com` and `naren.papanaboina@gmail.com`.
- **Admin Management**: Full control to approve, feature, edit, quickly add, or delete listings with persistent cloud synchronization.
- **Fast & Responsive**: Mobile-first PWA design optimized for low-bandwidth rural connections.

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Backend & Storage**: Firebase Firestore & Firebase Authentication
- **Security**: Granular Firestore Security Rules with role-based access control (RBAC)

## Getting Started

### 1. Prerequisites
- Node.js (v18 or higher recommended)
- npm or bun

### 2. Installation
```bash
git clone https://github.com/vasukanna/Santhalo.git
cd Santhalo
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory (optional if using defaults):
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 4. Running the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Building for Production
```bash
npm run build
```

## Firestore Security Rules
Deploy `firestore.rules` located in the root repository to your Firebase project:
- Public read access for active marketplace listings.
- Authenticated write access for personal ads and user profiles.
- Elevated administrative permissions for designated administrators (`vasu.kannaluri@gmail.com` and `naren.papanaboina@gmail.com`).

---

**SanthaLO** — *Everyone Connected. Every Need Met.*
