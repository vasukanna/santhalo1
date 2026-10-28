import React from 'react';
import { useApp } from '../context/AppContext';
import { ArrowLeft, ShieldCheck, Lock, FileText, CheckCircle2 } from 'lucide-react';

export const SafetyPolicyScreen: React.FC = () => {
  const { lang, setActiveTab } = useApp();

  return (
    <div className="pb-28 pt-2">
      <div className="max-w-2xl mx-auto px-3 sm:px-4 space-y-4">
        {/* Header */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('profile')}
            className="p-2 rounded-xl text-stone-600 hover:bg-stone-100"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg font-extrabold text-stone-900">
              {lang === 'te' ? 'భద్రతా నిబంధనలు & గోప్యతా విధానం' : 'Safety, Terms & Privacy Policy'}
            </h1>
            <p className="text-xs text-stone-500">
              SanthaKart (Mana Santha) Policies
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs space-y-4 text-xs text-stone-700 leading-relaxed">
          <section className="space-y-1.5">
            <h2 className="text-sm font-extrabold text-stone-900 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>{lang === 'te' ? '1. రైతు భద్రత మరియు వ్యాపార సూత్రాలు' : '1. Rural Trader Safety Guidelines'}</span>
            </h2>
            <p>
              {lang === 'te'
                ? 'సంతకార్ట్ (మన సంత) కేవలం కొనుగోలుదారులు మరియు అమ్మకందారులను నేరుగా అనుసంధానించే వేదిక. ఏదైనా పశువు, పంట లేదా యంత్రం కొనుగోలు చేసే ముందు స్వయంగా పరీక్షించండి. ఆన్‌లైన్ ద్వారా తెలియని వ్యక్తులకు అడ్వాన్స్ లేదా OTPలు పంపవద్దు.'
                : 'SanthaKart connects rural sellers and buyers directly. We advise all users to inspect goods and livestock in person before transaction. Never send upfront payments or OTPs.'}
            </p>
          </section>

          <section className="space-y-1.5">
            <h2 className="text-sm font-extrabold text-stone-900 flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-orange-600" />
              <span>{lang === 'te' ? '2. గోప్యతా విధానం (Privacy Policy)' : '2. Privacy Policy'}</span>
            </h2>
            <p>
              {lang === 'te'
                ? 'మేము మీ పేరు మరియు ఫోన్ నంబర్‌ను కేవలం కొనుగోలుదారులు మీతో నేరుగా మాట్లాడటానికి మాత్రమే ఉపయోగిస్తాము. మీ డేటా సురక్షితంగా ఉంటుంది మరియు ఏ మూడవ పక్షానికి విక్రయించబడదు.'
                : 'Your profile and phone number are used strictly to enable buyer contact on your listings. We adhere to industry standards and do not sell user data.'}
            </p>
          </section>

          <section className="space-y-1.5">
            <h2 className="text-sm font-extrabold text-stone-900 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-amber-600" />
              <span>{lang === 'te' ? '3. ఖాతా తొలగింపు హక్కు (Delete Account)' : '3. Account Deletion Rights'}</span>
            </h2>
            <p>
              {lang === 'te'
                ? 'గూగుల్ ప్లే స్టోర్ నిబంధనల ప్రకారం, ఏ వినియోగదారుడైనా ప్రొఫైల్ పేజీ నుండి తమ ఖాతాను, ప్రకటనలను మరియు చాట్ రికార్డులను ఎప్పుడైనా శాశ్వతంగా తొలగించుకోవచ్చు.'
                : 'In accordance with Google Play Store guidelines, users can permanently delete their account and associated listings directly from the Profile screen at any time.'}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
