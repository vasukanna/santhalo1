import React from 'react';
import { useApp } from '../context/AppContext';
import { ArrowLeft, Download, Smartphone, Apple, CheckCircle2, ShieldCheck, AlertCircle } from 'lucide-react';

export const DownloadScreen: React.FC = () => {
  const { lang, setActiveTab } = useApp();

  return (
    <div className="pb-28 pt-2 max-w-xl mx-auto px-3 sm:px-4 space-y-4">
      {/* Top Header */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setActiveTab('home')}
          className="p-2 rounded-xl text-stone-600 hover:bg-stone-100 cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-lg font-black text-stone-900">
            {lang === 'te' ? 'సంతలో యాప్‌ను పొందండి' : 'Get the Santhalo App'}
          </h1>
          <p className="text-xs text-stone-500 font-medium">
            Santhalo.com • Fast, Offline-Ready & Free
          </p>
        </div>
      </div>

      {/* Main Download Card */}
      <div className="bg-white rounded-3xl p-5 border border-stone-200/90 shadow-xs space-y-5">
        <div className="text-center space-y-2 py-2">
          <div className="w-20 h-20 rounded-2xl bg-white border border-stone-200 p-2 mx-auto flex items-center justify-center shadow-md">
            <img
              src="/logo.png"
              alt="Santhalo Logo"
              className="w-full h-full object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/icon-192.png';
              }}
            />
          </div>
          <h2 className="text-xl font-black text-stone-900">
            {lang === 'te' ? 'మన సంత మీ చేతిలో' : 'Get the Santhalo App'}
          </h2>
          <p className="text-xs text-stone-600 max-w-sm mx-auto leading-relaxed">
            {lang === 'te'
              ? 'ఆంధ్రప్రదేశ్ రైతులు, వ్యాపారులు మరియు కొనుగోలుదారుల కోసం ప్రత్యేకం. వేగంగా లోడ్ అవుతుంది, ఆఫ్‌లైన్‌లో కూడా పనిచేస్తుంది.'
              : 'Direct agricultural trading for Andhra Pradesh farmers, traders, and buyers. Lightning-fast and works offline.'}
          </p>
        </div>

        {/* Direct APK Download Button */}
        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 text-center space-y-2">
          <a
            href="/santhalo.apk"
            download
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-sm py-3 px-4 rounded-xl shadow-md active:scale-95 transition-all flex items-center justify-center gap-2 min-h-[48px]"
          >
            <Download className="w-5 h-5" />
            <span>{lang === 'te' ? 'ఆండ్రాయిడ్ యాప్ డౌన్‌లోడ్ (APK)' : 'Download Android APK'}</span>
          </a>
          <p className="text-[11px] text-orange-900 font-semibold">
            {lang === 'te'
              ? 'ఒకవేళ మీ ఫోన్ అడిగితే "Allow install from this source" ఎంచుకోండి.'
              : 'If your phone asks, allow install from this source.'}
          </p>
        </div>

        {/* Step-by-Step Instructions: Android */}
        <div className="space-y-3 pt-2 border-t border-stone-100">
          <div className="flex items-center gap-2 text-stone-900 font-black text-sm">
            <Smartphone className="w-4 h-4 text-emerald-600" />
            <span>{lang === 'te' ? 'ఆండ్రాయిడ్ (Google Chrome) ఇన్‌స్టాలేషన్:' : 'Step-by-Step: Android (Chrome)'}</span>
          </div>

          <div className="space-y-2 text-xs text-stone-700">
            <div className="flex items-start gap-2 bg-stone-50 p-2.5 rounded-xl border border-stone-100">
              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0 text-[11px]">1</span>
              <span>{lang === 'te' ? 'క్రోమ్ బ్రౌజర్‌లో santhalo.com ఓపెన్ చేయండి.' : 'Open santhalo.com in Google Chrome.'}</span>
            </div>
            <div className="flex items-start gap-2 bg-stone-50 p-2.5 rounded-xl border border-stone-100">
              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0 text-[11px]">2</span>
              <span>{lang === 'te' ? 'కుడివైపు పైభాగంలో ఉన్న మూడు చుక్కలు (⋮) నొక్కండి.' : 'Tap the three dots (⋮) menu at the top-right.'}</span>
            </div>
            <div className="flex items-start gap-2 bg-stone-50 p-2.5 rounded-xl border border-stone-100">
              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0 text-[11px]">3</span>
              <span>{lang === 'te' ? "'Install app' లేదా 'Add to Home screen' ఎంచుకోండి." : "Tap 'Install app' or 'Add to Home screen'."}</span>
            </div>
          </div>
        </div>

        {/* Step-by-Step Instructions: iPhone / iOS */}
        <div className="space-y-3 pt-2 border-t border-stone-100">
          <div className="flex items-center gap-2 text-stone-900 font-black text-sm">
            <Apple className="w-4 h-4 text-stone-800" />
            <span>{lang === 'te' ? 'ఐఫోన్ (Apple Safari) ఇన్‌స్టాలేషన్:' : 'Step-by-Step: iPhone (Safari)'}</span>
          </div>

          <div className="space-y-2 text-xs text-stone-700">
            <div className="flex items-start gap-2 bg-stone-50 p-2.5 rounded-xl border border-stone-100">
              <span className="w-5 h-5 rounded-full bg-stone-200 text-stone-800 font-bold flex items-center justify-center shrink-0 text-[11px]">1</span>
              <span>{lang === 'te' ? 'సఫారి (Safari) బ్రౌజర్‌లో santhalo.com ఓపెన్ చేయండి.' : 'Open santhalo.com in Apple Safari browser.'}</span>
            </div>
            <div className="flex items-start gap-2 bg-stone-50 p-2.5 rounded-xl border border-stone-100">
              <span className="w-5 h-5 rounded-full bg-stone-200 text-stone-800 font-bold flex items-center justify-center shrink-0 text-[11px]">2</span>
              <span>{lang === 'te' ? 'దిగువన ఉన్న షేర్ బటన్ (Share icon) నొక్కండి.' : 'Tap the Share icon at the bottom of the screen.'}</span>
            </div>
            <div className="flex items-start gap-2 bg-stone-50 p-2.5 rounded-xl border border-stone-100">
              <span className="w-5 h-5 rounded-full bg-stone-200 text-stone-800 font-bold flex items-center justify-center shrink-0 text-[11px]">3</span>
              <span>{lang === 'te' ? "'Add to Home Screen' ఎంచుకుని 'Add' నొక్కండి." : "Scroll down and select 'Add to Home Screen', then tap 'Add'."}</span>
            </div>
          </div>
        </div>

        {/* Safety Note */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 flex items-start gap-2 text-amber-950 text-xs">
          <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            {lang === 'te'
              ? 'సంతలో వెబ్ యాప్ సురక్షితమైనది మరియు ఎటువంటి అనవసర అనుమతులు తీసుకోదు. గూగుల్ ప్లే స్టోర్ ప్రమాణాలకు అనుగుణంగా రూపొందించబడింది.'
              : 'Santhalo PWA is fully secure and verified. Complies with all Google Play user safety and data privacy standards.'}
          </p>
        </div>
      </div>
    </div>
  );
};
