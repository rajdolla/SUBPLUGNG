import React from 'react';
import { ShieldCheck, Zap, Headphones, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { NetworkProvider } from '../types';

interface HeroSectionProps {
  onOpenAuth: (tab: 'login' | 'register') => void;
  onExplorePricing: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenAuth, onExplorePricing }) => {
  return (
    <section id="home" className="relative overflow-hidden pt-8 pb-16 lg:pt-16 lg:pb-24">
      {/* Background radial gradient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-10 right-10 w-[350px] h-[350px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Copy & Primary CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Tagline text - No pill enclosure per design constitution */}
            <div className="flex items-center justify-center lg:justify-start gap-2 text-xs font-semibold text-emerald-400 tracking-wide">
              <Sparkles className="h-4 w-4" />
              <span>Automated Nigerian Telecom & Utility Gateway</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-slate-400">Over ₦420M Processed</span>
            </div>

            {/* Headline with balanced text wrap */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1] max-w-2xl mx-auto lg:mx-0 [text-wrap:balance]">
              Instant Data, Airtime & Bill Payments at{' '}
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                Unbeatable Prices.
              </span>
            </h1>

            {/* Sub-headline */}
            <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Join thousands of Nigerians enjoying seamless VTU services. Buy cheap data, pay electricity & cable bills, and become a vendor today with zero downtime.
            </p>

            {/* Primary CTAs: Large Create Free Account & Login */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-4 max-w-md mx-auto lg:mx-0">
              <button
                onClick={() => onOpenAuth('register')}
                className="min-h-[52px] px-8 py-3.5 text-base font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl shadow-lg shadow-emerald-500/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>Create Free Account</span>
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={() => onOpenAuth('login')}
                className="min-h-[52px] px-8 py-3.5 text-base font-semibold text-slate-200 border border-slate-700 hover:border-slate-500 bg-slate-900/60 hover:bg-slate-900 rounded-xl transition-all flex items-center justify-center cursor-pointer"
              >
                Login to Dashboard
              </button>
            </div>

            {/* Trust Badges: 100% Secure, Instant Delivery, 24/7 Support */}
            <div className="pt-4 border-t border-slate-800/80 grid grid-cols-3 gap-3 sm:gap-6 text-slate-300 max-w-xl mx-auto lg:mx-0">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2 text-center sm:text-left">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-bold text-white">100% Secure</div>
                  <div className="text-[11px] text-slate-400">NDIC & SSL Encrypted</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2 text-center sm:text-left">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400 shrink-0">
                  <Zap className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-bold text-white">Instant Delivery</div>
                  <div className="text-[11px] text-slate-400">Sub-second auto-dispatch</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2 text-center sm:text-left">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400 shrink-0">
                  <Headphones className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-bold text-white">24/7 Support</div>
                  <div className="text-[11px] text-slate-400">Lagos-based live desk</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: 3D Smartphone Visual Mockup */}
          <div className="lg:col-span-5 relative flex flex-col items-center">
            <div className="relative w-full max-w-md mx-auto group">
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-tr from-emerald-500/20 to-blue-500/20 blur-xl opacity-75 group-hover:opacity-100 transition-opacity" />
              
              <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 shadow-2xl">
                <img
                  src="/src/assets/images/hero_phone_mockup_1790292281667.jpg"
                  alt="Subplug 3D Mobile App Data Interface"
                  referrerPolicy="no-referrer"
                  className="w-full h-auto object-cover max-h-[420px]"
                />

                {/* Clean Feature Callout Card at bottom of visual */}
                <div className="p-4 sm:p-5 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-300">Automated Direct Switch</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                      99.98% Live
                    </span>
                  </div>

                  <div className="grid grid-cols-4 gap-2 text-center text-xs">
                    <div className="py-2 bg-slate-900 border border-slate-800 rounded-lg">
                      <div className="font-bold text-yellow-400">MTN</div>
                      <div className="text-[10px] text-slate-400">from ₦240</div>
                    </div>
                    <div className="py-2 bg-slate-900 border border-slate-800 rounded-lg">
                      <div className="font-bold text-red-400">Airtel</div>
                      <div className="text-[10px] text-slate-400">from ₦248</div>
                    </div>
                    <div className="py-2 bg-slate-900 border border-slate-800 rounded-lg">
                      <div className="font-bold text-emerald-400">Glo</div>
                      <div className="text-[10px] text-slate-400">from ₦235</div>
                    </div>
                    <div className="py-2 bg-slate-900 border border-slate-800 rounded-lg">
                      <div className="font-bold text-lime-400">9mobile</div>
                      <div className="text-[10px] text-slate-400">from ₦220</div>
                    </div>
                  </div>

                  <button
                    onClick={onExplorePricing}
                    className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-semibold text-xs sm:text-sm rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-slate-700"
                  >
                    <span>View All Network Rates</span>
                    <ArrowRight className="h-4 w-4 text-emerald-400" />
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
