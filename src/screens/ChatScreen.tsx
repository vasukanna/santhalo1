import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { db } from '../firebase';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { ChatThread } from '../types';
import { MessageCircle, ArrowLeft, Clock, AlertCircle } from 'lucide-react';

export const ChatScreen: React.FC = () => {
  const { lang, t, currentUser, loginWithGoogle, openChatThread, setActiveTab } = useApp();
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    try {
      const chatsRef = collection(db, 'chats');
      const q = query(
        chatsRef,
        where('participants', 'array-contains', currentUser.uid)
      );

      const unsubscribe = onSnapshot(
        q,
        (snap) => {
          const list: ChatThread[] = [];
          snap.forEach((d) => {
            list.push({ id: d.id, ...(d.data() as Omit<ChatThread, 'id'>) });
          });
          // Sort by lastMessageAt desc
          list.sort((a, b) => new Date(b.lastMessageAt || 0).getTime() - new Date(a.lastMessageAt || 0).getTime());
          setThreads(list);
          setLoading(false);
        },
        (error) => {
          console.warn("Chats fetch error (using empty):", error);
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (e) {
      setLoading(false);
    }
  }, [currentUser]);

  if (!currentUser) {
    return (
      <div className="pb-24 pt-8 px-4 max-w-md mx-auto text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-orange-100 text-orange-600 mx-auto flex items-center justify-center">
          <MessageCircle className="w-8 h-8" />
        </div>
        <h2 className="text-lg font-extrabold text-stone-900">
          {t.inboxTitle}
        </h2>
        <p className="text-xs text-stone-500">
          {lang === 'te'
            ? 'అమ్మకందారులతో లేదా కొనుగోలుదారులతో చాట్ చేయడానికి దయచేసి లాగిన్ అవ్వండి.'
            : 'Sign in to access your direct buyer and seller messages.'}
        </p>
        <button
          onClick={() => loginWithGoogle()}
          className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm px-6 py-3 rounded-2xl shadow-md active:scale-95 transition-all cursor-pointer"
        >
          {t.googleSignIn}
        </button>
      </div>
    );
  }

  return (
    <div className="pb-24 pt-2">
      <div className="max-w-2xl mx-auto px-3 sm:px-4 space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between pb-2">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-extrabold text-stone-900">
              {t.inboxTitle}
            </h1>
            <span className="text-xs bg-orange-100 text-orange-800 font-bold px-2 py-0.5 rounded-full">
              {threads.length}
            </span>
          </div>
        </div>

        {/* Chats List */}
        {loading ? (
          <div className="p-8 text-center text-xs text-stone-500 animate-pulse">
            {t.loadingText}
          </div>
        ) : threads.length > 0 ? (
          <div className="space-y-2">
            {threads.map((thread) => {
              // Get the other participant's name
              const otherId = thread.participants?.find(id => id !== currentUser.uid) || '';
              const otherName = thread.participantNames?.[otherId] || (lang === 'te' ? 'రైతు మిత్రుడు' : 'Market User');

              return (
                <div
                  key={thread.id}
                  onClick={() => openChatThread(thread.id)}
                  className="bg-white rounded-2xl p-3.5 border border-stone-200/90 shadow-xs hover:border-orange-300 transition-all active:scale-[0.99] cursor-pointer flex items-center gap-3"
                >
                  {/* Thumbnail of Listing or User */}
                  <div className="w-14 h-14 rounded-2xl bg-stone-100 overflow-hidden shrink-0 border border-stone-200">
                    <img
                      src={thread.listingImage || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=200&q=80'}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between gap-1 mb-0.5">
                      <h3 className="font-extrabold text-stone-900 text-sm truncate">
                        {otherName}
                      </h3>
                      <span className="text-[10px] text-stone-400 shrink-0">
                        {thread.lastMessageAt ? new Date(thread.lastMessageAt).toLocaleDateString() : ''}
                      </span>
                    </div>

                    <div className="text-xs font-semibold text-orange-700 truncate mb-0.5">
                      {thread.listingTitle || 'Listing Inquiry'}
                    </div>

                    <p className="text-xs text-stone-500 truncate">
                      {thread.lastMessage || (lang === 'te' ? 'సందేశాలు చూడండి' : 'Tap to open chat')}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="bg-white rounded-3xl p-8 text-center border border-stone-200 max-w-md mx-auto my-6 shadow-xs">
            <div className="w-14 h-14 rounded-full bg-orange-100 text-orange-600 mx-auto flex items-center justify-center mb-3">
              <MessageCircle className="w-7 h-7" />
            </div>
            <h3 className="font-extrabold text-stone-900 text-base mb-1">
              {t.noChatsYet}
            </h3>
            <p className="text-xs text-stone-500 mb-5 leading-relaxed">
              {t.noChatsSub}
            </p>
            <button
              onClick={() => setActiveTab('home')}
              className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md cursor-pointer"
            >
              {lang === 'te' ? 'మార్కెట్ సరుకు చూడండి' : 'Browse Marketplace'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
