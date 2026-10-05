import React from 'react';
import { Home, TrendingUp, ShoppingBag, BookOpen, LogIn } from 'lucide-react';

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
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-slate-950/95 backdrop-blur-md border-t border-slate-800/90 pb-safe">
      <div className="grid grid-cols-5 items-center h-16 px-1 max-w-md mx-auto">
        {/* Home */}
        <button
          onClick={() => onNavigate('home')}
          className={`flex flex-col items-center justify-center h-12 rounded-lg active:scale-95 transition-all cursor-pointer ${
            currentPage === 'home' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-white'
          }`}
          aria-label="Home"
        >
          <Home className="h-5 w-5" />
          <span className="text-[10px] font-medium mt-1">Home</span>
        </button>

        {/* Vendor */}
        <button
          onClick={() => onNavigate('vendor')}
          className={`flex flex-col items-center justify-center h-12 rounded-lg active:scale-95 transition-all cursor-pointer ${
            currentPage === 'vendor' ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-white'
          }`}
          aria-label="Vendor Portal"
        >
          <TrendingUp className="h-5 w-5" />
          <span className="text-[10px] font-medium mt-1">Vendor</span>
        </button>

        {/* Store */}
        <button
          onClick={() => onNavigate('store')}
          className={`flex flex-col items-center justify-center h-12 rounded-lg active:scale-95 transition-all cursor-pointer ${
            currentPage === 'store' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-white'
          }`}
          aria-label="Hardware Store"
        >
          <ShoppingBag className="h-5 w-5" />
          <span className="text-[10px] font-medium mt-1">Store</span>
        </button>

        {/* Blog */}
        <button
          onClick={() => onNavigate('blog')}
          className={`flex flex-col items-center justify-center h-12 rounded-lg active:scale-95 transition-all cursor-pointer ${
            currentPage === 'blog' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-white'
          }`}
          aria-label="Blog Insights"
        >
          <BookOpen className="h-5 w-5" />
          <span className="text-[10px] font-medium mt-1">Blog</span>
        </button>

        {/* Account / Login */}
        <button
          onClick={() => onOpenAuth('login')}
          className="flex flex-col items-center justify-center h-12 rounded-lg text-slate-300 hover:text-emerald-400 active:scale-95 transition-all cursor-pointer"
          aria-label="Account Login"
        >
          <LogIn className="h-5 w-5" />
          <span className="text-[10px] font-medium mt-1">Login</span>
        </button>
      </div>
    </div>
  );
};
