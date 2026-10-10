import React, { useEffect, useState } from 'react';
import { Home, Zap, Tag, ShoppingBag, Sparkles } from 'lucide-react';

interface MobileBottomNavProps {
  currentPage: 'home' | 'store' | 'blog' | 'vendor';
  onNavigate: (page: 'home' | 'store' | 'blog' | 'vendor', hash?: string) => void;
  onOpenAuth: (tab: 'login' | 'register') => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentPage,
  onNavigate,
  onOpenAuth,
}) => {
  // Track current hash fragment for active section highlighting on the Home page
  const [currentHash, setCurrentHash] = useState<string>(() => {
    if (typeof window === 'undefined') return '';
    return window.location.hash.toLowerCase().replace('#', '');
  });

  useEffect(() => {
    const syncHash = () => {
      setCurrentHash(window.location.hash.toLowerCase().replace('#', ''));
    };
    window.addEventListener('popstate', syncHash);
    window.addEventListener('hashchange', syncHash);
    return () => {
      window.removeEventListener('popstate', syncHash);
      window.removeEventListener('hashchange', syncHash);
    };
  }, []);

  // Strict check: Never render on /dashboard (dashboard uses DashboardMobileNav)
  if (typeof window !== 'undefined' && (window.location.pathname === '/dashboard' || window.location.pathname.startsWith('/dashboard/'))) {
    return null;
  }

  const isHomeActive = currentPage === 'home' && (!currentHash || currentHash === 'home');
  const isServicesActive = currentPage === 'home' && currentHash === 'services';
  const isPricingActive = currentPage === 'home' && currentHash === 'pricing';
  const isStoreActive = currentPage === 'store';

  const handleGoHome = () => {
    setCurrentHash('');
    onNavigate('home');
  };

  const handleGoServices = () => {
    setCurrentHash('services');
    onNavigate('home', 'services');
  };

  const handleGoPricing = () => {
    setCurrentHash('pricing');
    onNavigate('home', 'pricing');
  };

  const handleGoStore = () => {
    setCurrentHash('');
    onNavigate('store');
  };

  return (
    <nav
      aria-label="Mobile Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-slate-950/92 backdrop-blur-xl border-t border-slate-800/80 shadow-[0_-4px_20px_rgba(0,0,0,0.55)] select-none"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      {/* Subtle top ambient glow line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/30 to-transparent pointer-events-none" />

      <div className="grid grid-cols-5 items-center h-[56px] max-w-md mx-auto px-1">
        {/* 1. Home */}
        <button
          type="button"
          onClick={handleGoHome}
          className={`flex flex-col items-center justify-center h-full py-1 min-h-[44px] transition-all cursor-pointer group active:scale-95 ${
            isHomeActive ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
          aria-label="Home"
        >
          <Home className={`h-4.5 w-4.5 transition-transform ${isHomeActive ? 'scale-110' : 'group-hover:scale-105'}`} />
          <span className="text-[10px] font-medium mt-1 leading-none">Home</span>
          {isHomeActive && <span className="h-1 w-1 rounded-full bg-emerald-400 mt-1" />}
        </button>

        {/* 2. Services */}
        <button
          type="button"
          onClick={handleGoServices}
          className={`flex flex-col items-center justify-center h-full py-1 min-h-[44px] transition-all cursor-pointer group active:scale-95 ${
            isServicesActive ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
          aria-label="Services"
        >
          <Zap className={`h-4.5 w-4.5 transition-transform ${isServicesActive ? 'scale-110' : 'group-hover:scale-105'}`} />
          <span className="text-[10px] font-medium mt-1 leading-none">Services</span>
          {isServicesActive && <span className="h-1 w-1 rounded-full bg-emerald-400 mt-1" />}
        </button>

        {/* 3. Pricing */}
        <button
          type="button"
          onClick={handleGoPricing}
          className={`flex flex-col items-center justify-center h-full py-1 min-h-[44px] transition-all cursor-pointer group active:scale-95 ${
            isPricingActive ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
          aria-label="Pricing"
        >
          <Tag className={`h-4.5 w-4.5 transition-transform ${isPricingActive ? 'scale-110' : 'group-hover:scale-105'}`} />
          <span className="text-[10px] font-medium mt-1 leading-none">Pricing</span>
          {isPricingActive && <span className="h-1 w-1 rounded-full bg-emerald-400 mt-1" />}
        </button>

        {/* 4. Hardware Store */}
        <button
          type="button"
          onClick={handleGoStore}
          className={`flex flex-col items-center justify-center h-full py-1 min-h-[44px] transition-all cursor-pointer group active:scale-95 ${
            isStoreActive ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
          aria-label="Store"
        >
          <ShoppingBag className={`h-4.5 w-4.5 transition-transform ${isStoreActive ? 'scale-110' : 'group-hover:scale-105'}`} />
          <span className="text-[10px] font-medium mt-1 leading-none">Store</span>
          {isStoreActive && <span className="h-1 w-1 rounded-full bg-emerald-400 mt-1" />}
        </button>

        {/* 5. Get Started (Prominent Action CTA) */}
        <div className="flex items-center justify-center h-full px-1">
          <button
            type="button"
            onClick={() => onOpenAuth('register')}
            className="w-full flex flex-col items-center justify-center py-1.5 px-1 rounded-xl bg-gradient-to-r from-emerald-400 to-emerald-500 hover:from-emerald-300 hover:to-emerald-400 text-slate-950 font-black shadow-md shadow-emerald-500/20 active:scale-95 transition-all cursor-pointer min-h-[42px]"
            aria-label="Get Started"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span className="text-[9px] font-extrabold tracking-tight leading-none mt-0.5 whitespace-nowrap">
              <span className="hidden min-[360px]:inline">Get </span>Started
            </span>
          </button>
        </div>
      </div>
    </nav>
  );
};
