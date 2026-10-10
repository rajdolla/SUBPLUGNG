import React from 'react';
import { Mail, Phone, MapPin, ShieldCheck } from 'lucide-react';
import { SubplugLogo } from './SubplugLogo';
import { useCms } from '../context/CmsContext';

interface FooterProps {
  onOpenLegal: (type: 'terms' | 'privacy') => void;
  onOpenAuth: (tab: 'login' | 'register') => void;
  onOpenVendor: () => void;
  onNavigate?: (page: 'home' | 'store' | 'blog' | 'vendor', hash?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenLegal, onOpenAuth, onOpenVendor, onNavigate }) => {
  const { cms } = useCms();
  const footer = cms.footer;

  const handleNav = (page: 'home' | 'store' | 'blog' | 'vendor', hash?: string) => {
    if (onNavigate) {
      onNavigate(page, hash);
    }
  };

  if (footer && !footer.isVisible) return null;

  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 text-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand Info & Mission with Official Subplug Logo Icon */}
          <div className="lg:col-span-2 space-y-4">
            <button
              onClick={() => handleNav('home')}
              className="inline-flex items-center group py-0.5 focus:outline-none cursor-pointer"
              aria-label="SUBPLUG Home"
            >
              <SubplugLogo size="md" />
            </button>
            
            <p className="text-xs sm:text-sm text-slate-400 max-w-sm leading-relaxed">
              {footer?.companyDescription || 'Nigeria’s fastest automated VTU platform for cheap SME data bundles, airtime top-up, prepaid electricity tokens, cable TV decoders, and wholesale reseller APIs.'}
            </p>

            {/* Social Media Icons - Clearly Visible with Branded Accents */}
            <div className="pt-3">
              <div className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Join Our Channels & Community</span>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                {/* WhatsApp */}
                <a
                  href="https://wa.me/2348101234567"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#25D366]/20 border-2 border-[#25D366]/60 text-[#25D366] hover:bg-[#25D366] hover:text-slate-950 hover:border-[#25D366] shadow-lg shadow-[#25D366]/20 transition-all duration-200 group/icon"
                  aria-label="Chat with Subplug on WhatsApp"
                  title="WhatsApp: +234 810 123 4567"
                >
                  <svg className="h-5 w-5 fill-currentColor transition-transform group-hover/icon:scale-110" viewBox="0 0 24 24">
                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.698c.974.531 1.774.813 2.796.813h.005c3.181 0 5.767-2.586 5.768-5.766 0-3.18-2.587-5.766-5.773-5.766zm3.364 8.163c-.144.405-.837.774-1.17.822-.312.043-.727.069-2.313-.589-2.029-.841-3.328-2.91-3.428-3.045-.1-.136-.826-1.1-1.026-1.371-.2-.271-.4-.606-.4-.939 0-.333.176-.499.239-.567.063-.068.138-.085.184-.085.046 0 .092.001.131.003.043.003.1.009.155.122.062.128.213.518.231.556.019.038.031.083.007.132-.025.048-.038.077-.075.122-.038.044-.08.099-.115.132-.04.038-.082.079-.036.158.046.079.206.338.441.547.302.269.557.352.637.391.079.04.126.034.173-.02.046-.053.2-.232.253-.312.053-.08.106-.067.177-.04.072.026.457.215.535.254.079.04.131.06.15.093.019.033.019.192-.125.597z"/>
                  </svg>
                </a>

                {/* Telegram */}
                <a
                  href="https://t.me/subplug_ng"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0088cc]/20 border-2 border-[#0088cc]/60 text-[#0088cc] hover:bg-[#0088cc] hover:text-white hover:border-[#0088cc] shadow-lg shadow-[#0088cc]/20 transition-all duration-200 group/icon"
                  aria-label="Join Subplug Telegram Channel"
                  title="Telegram Channel"
                >
                  <svg className="h-5 w-5 fill-currentColor transition-transform group-hover/icon:scale-110" viewBox="0 0 24 24">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                  </svg>
                </a>

                {/* Twitter / X */}
                <a
                  href="https://twitter.com/subplug_ng"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-800 border-2 border-slate-600 text-white hover:bg-white hover:text-slate-950 hover:border-white shadow-lg shadow-white/10 transition-all duration-200 group/icon"
                  aria-label="Follow Subplug on X"
                  title="Twitter / X: @subplug_ng"
                >
                  <svg className="h-4 w-4 fill-currentColor transition-transform group-hover/icon:scale-110" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>

                {/* Instagram */}
                <a
                  href="https://instagram.com/subplug_ng"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E1306C]/20 border-2 border-[#E1306C]/60 text-[#E1306C] hover:bg-gradient-to-tr hover:from-[#F56040] hover:via-[#E1306C] hover:to-[#C13584] hover:text-white hover:border-[#E1306C] shadow-lg shadow-[#E1306C]/20 transition-all duration-200 group/icon"
                  aria-label="Follow Subplug on Instagram"
                  title="Instagram: @subplug_ng"
                >
                  <svg className="h-5 w-5 fill-currentColor transition-transform group-hover/icon:scale-110" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>

                {/* Facebook */}
                <a
                  href="https://facebook.com/subplug_ng"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#1877F2]/20 border-2 border-[#1877F2]/60 text-[#1877F2] hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2] shadow-lg shadow-[#1877F2]/20 transition-all duration-200 group/icon"
                  aria-label="Follow Subplug on Facebook"
                  title="Facebook: Subplug NG"
                >
                  <svg className="h-5 w-5 fill-currentColor transition-transform group-hover/icon:scale-110" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Platform</h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li><button onClick={() => handleNav('home')} className="hover:text-emerald-400 transition-colors cursor-pointer text-left">Home</button></li>
              <li><button onClick={() => handleNav('home', 'about')} className="hover:text-emerald-400 transition-colors cursor-pointer text-left">About Us</button></li>
              <li><button onClick={() => handleNav('home', 'services')} className="hover:text-emerald-400 transition-colors cursor-pointer text-left">Services</button></li>
              <li><button onClick={() => handleNav('home', 'pricing')} className="hover:text-emerald-400 transition-colors cursor-pointer text-left">Pricing Rates</button></li>
              <li><button onClick={() => handleNav('store')} className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors cursor-pointer text-left">Hardware Store (New)</button></li>
            </ul>
          </div>

          {/* Resources & Vendor */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Vendors & Devs</h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <button onClick={() => handleNav('vendor')} className="text-amber-400 hover:text-amber-300 font-semibold transition-colors text-left cursor-pointer">
                  Become a Vendor (₦1,500)
                </button>
              </li>
              <li><button onClick={() => handleNav('home', 'app-download')} className="hover:text-emerald-400 transition-colors cursor-pointer text-left">Download Android App</button></li>
              <li><button onClick={() => handleNav('blog')} className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors cursor-pointer text-left">Blog & Market Tips</button></li>
              <li><button onClick={() => handleNav('home', 'faq')} className="hover:text-emerald-400 transition-colors cursor-pointer text-left">Frequently Asked Questions</button></li>
              <li>
                <button onClick={() => onOpenAuth('register')} className="text-emerald-400 hover:text-emerald-300 font-semibold cursor-pointer">
                  Create Agent Account
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Contact & Office</h4>
            <div className="space-y-2.5 text-xs text-slate-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{footer?.officeAddress || '14 Admiralty Way, Lekki Phase 1, Lagos State, Nigeria'}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>{footer?.supportPhone || '+234 810 123 4567'}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>{footer?.supportEmail || 'support@subplug.ng'}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom copyright and legal notices */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            <span>{footer?.copyrightText || '© 2026 SUBPLUG Technologies Nigeria Ltd. All rights reserved.'}</span>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => onOpenLegal('terms')}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              Terms of Service
            </button>
            <button
              onClick={() => onOpenLegal('privacy')}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
