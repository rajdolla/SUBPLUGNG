import React from 'react';
import { ShoppingBag, ArrowRight, Truck, ShieldCheck, Check } from 'lucide-react';

interface StoreTeaserProps {
  onGoToStore: () => void;
}

export const StoreTeaser: React.FC<StoreTeaserProps> = ({ onGoToStore }) => {
  return (
    <section id="store-teaser" className="py-14 sm:py-16 bg-slate-900/40 border-y border-slate-800/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="relative rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 p-8 sm:p-12 overflow-hidden shadow-xl flex flex-col lg:flex-row items-center justify-between gap-8">
          
          <div className="space-y-4 max-w-xl text-center lg:text-left">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
              <ShoppingBag className="h-4 w-4" />
              <span>Subplug Retail Mart</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
              Looking for POS Terminals & 4G MiFi Routers?
            </h2>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Equip your kiosk or office with Android POS terminals, high-speed pocket WiFi, and thermal receipt printers with nationwide delivery and 1-year warranty.
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs text-slate-400 pt-1">
              <span className="flex items-center gap-1.5">
                <Truck className="h-4 w-4 text-emerald-400" />
                Fast 24-48h Delivery
              </span>
              <span>·</span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                1-Year Warranty
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
            <button
              onClick={onGoToStore}
              className="min-h-[48px] px-8 py-3.5 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-sm rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer group"
            >
              <span>Explore Dedicated Store</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};
