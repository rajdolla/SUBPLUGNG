import React, { useState } from 'react';
import { Menu, X, ArrowRight, ShieldCheck, ChevronRight, Sparkles } from 'lucide-react';
import { SubplugLogo } from './SubplugLogo';
import { useCms } from '../context/CmsContext';

interface NavbarProps {
  currentPage: 'home' | 'store' | 'blog' | 'vendor';
  onNavigate: (page: 'home' | 'store' | 'blog' | 'vendor', hash?: string) => void;
  onOpenAuth: (tab: 'login' | 'register') => void;
  onOpenVendorModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  onOpenAuth,
  onOpenVendorModal: _onOpenVendorModal,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { cms } = useCms();
  const { siteSettings, navigation } = cms;

  const navLinks = [
    { label: 'Home', action: () => onNavigate('home'), isActive: currentPage === 'home' },
    { label: 'Services', action: () => onNavigate('home', 'services') },
    { label: 'Partners', action: () => onNavigate('home', 'partners') },
    { label: 'Pricing', action: () => onNavigate('home', 'pricing') },
    { label: 'Rewards', action: () => onNavigate('home', 'rewards') },
    { label: 'Vendor & API', action: () => onNavigate('vendor'), isActive: currentPage === 'vendor' },
    { label: 'Store', action: () => onNavigate('store'), isActive: currentPage === 'store' },
    { label: 'Blog', action: () => onNavigate('blog'), isActive: currentPage === 'blog' },
    { label: 'FAQ', action: () => onNavigate('home', 'faq') },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md">
      {/* Top Announcement Bar from CMS */}
      {siteSettings.isAnnouncementActive && siteSettings.announcementBarText && (
        <div className="bg-gradient-to-r from-emerald-600 via-cyan-600 to-emerald-600 text-white text-[11px] font-medium py-1 px-4 text-center flex items-center justify-center gap-2 shadow-inner">
          <Sparkles className="h-3 w-3 shrink-0 animate-pulse" />
          <span className="truncate">{siteSettings.announcementBarText}</span>
        </div>
      )}

      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Brand Wordmark with Official Subplug Logo Icon */}
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center group py-1 focus:outline-none cursor-pointer"
          aria-label="SUBPLUG Home"
        >
          <SubplugLogo size="md" />
        </button>

        {/* Zone 2: Navigation Links (Desktop) */}
        <nav className="hidden lg:flex items-center gap-5 xl:gap-7 text-sm font-medium">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={link.action}
              className={`transition-colors whitespace-nowrap cursor-pointer ${
                link.isActive
                  ? 'text-emerald-400 font-bold'
                  : 'text-slate-300 hover:text-emerald-400'
              }`}
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Zone 3: Actions (Desktop) */}
        <div className="hidden lg:flex items-center gap-3">
          <button
            onClick={() => onOpenAuth('login')}
            className="px-4 py-2 text-sm font-medium text-slate-200 border border-slate-700/80 hover:border-slate-500 rounded-lg hover:bg-slate-900 transition-colors whitespace-nowrap min-h-[40px] cursor-pointer"
          >
            {navigation.secondaryCtaLabel || 'Login'}
          </button>
          <button
            onClick={() => onOpenAuth('register')}
            className="px-4 py-2 text-sm font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg shadow-sm shadow-emerald-500/20 active:scale-[0.98] transition-all whitespace-nowrap min-h-[40px] flex items-center gap-1.5 cursor-pointer"
          >
            {navigation.primaryCtaLabel || 'Register'}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        {/* Mobile Hamburger Trigger */}
        <div className="flex lg:hidden items-center gap-2">
          <button
            onClick={() => onOpenAuth('login')}
            className="px-3 py-1.5 text-xs font-semibold text-slate-200 border border-slate-700 rounded-lg hover:bg-slate-900 cursor-pointer"
          >
            {navigation.secondaryCtaLabel || 'Login'}
          </button>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-300 hover:text-white hover:bg-slate-900 rounded-lg focus:outline-none min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Slide-out Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-800 bg-slate-950/98 px-4 pt-3 pb-6 space-y-3 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="grid grid-cols-2 gap-2 text-sm font-medium text-slate-300 pb-2 border-b border-slate-800">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => {
                  setMobileMenuOpen(false);
                  link.action();
                }}
                className={`flex items-center justify-between p-2.5 rounded-lg text-left transition-colors cursor-pointer ${
                  link.isActive
                    ? 'bg-slate-900 text-emerald-400 font-bold'
                    : 'hover:bg-slate-900 hover:text-emerald-400'
                }`}
              >
                <span>{link.label}</span>
                <ChevronRight className="h-4 w-4 text-slate-600" />
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAuth('login');
              }}
              className="w-full py-3 text-sm font-semibold text-slate-200 border border-slate-700 rounded-xl hover:bg-slate-900 transition-colors min-h-[48px] cursor-pointer"
            >
              {navigation.secondaryCtaLabel || 'Login'}
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAuth('register');
              }}
              className="w-full py-3 text-sm font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl transition-colors min-h-[48px] shadow-sm shadow-emerald-500/20 cursor-pointer"
            >
              {navigation.primaryCtaLabel || 'Create Account'}
            </button>
          </div>

          <div className="pt-2 text-center text-xs text-slate-500 flex items-center justify-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>Regulated & NDIC-backed Switch Settlement</span>
          </div>
        </div>
      )}
    </header>
  );
};
