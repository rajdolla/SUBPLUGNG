/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Tag, ArrowRight, Sparkles, Percent } from 'lucide-react';
import { useCms } from '../context/CmsContext';

interface PromotionsBannerSectionProps {
  onOpenAuth: (tab: 'login' | 'register') => void;
  onNavigateVendor?: () => void;
}

export const PromotionsBannerSection: React.FC<PromotionsBannerSectionProps> = ({
  onOpenAuth,
  onNavigateVendor,
}) => {
  const { cms } = useCms();
  const promotions = cms.promotions;

  if (!promotions.isVisible) return null;

  const activeBanners = (promotions.banners || [])
    .filter((b) => b.isActive)
    .sort((a, b) => a.order - b.order);

  if (activeBanners.length === 0) return null;

  return (
    <section id="promotions" className="py-14 bg-slate-950 border-t border-slate-900 relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-mono font-bold tracking-wider uppercase">
            <Sparkles className="h-3.5 w-3.5" />
            <span>{promotions.badgeText || 'SPECIAL OFFERS & DEALS'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {promotions.title || 'Active Promotions & Bonuses'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed [text-wrap:balance]">
            {promotions.subtitle || 'Take advantage of limited-time seasonal cashback deals, promo codes, and special vendor incentives.'}
          </p>
        </div>

        {/* Promo Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {activeBanners.map((promo) => (
            <div
              key={promo.id}
              className="relative rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900/90 via-slate-900/70 to-slate-950 p-6 sm:p-7 flex flex-col justify-between space-y-5 hover:border-amber-500/40 transition-all duration-300 group shadow-lg"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px] font-mono font-bold tracking-wide">
                    <Tag className="h-3 w-3" />
                    <span>{promo.badge}</span>
                  </span>
                  {promo.discountPercentage && (
                    <span className="inline-flex items-center gap-1 text-xs font-mono font-bold text-emerald-400">
                      <Percent className="h-3.5 w-3.5" />
                      <span>{promo.discountPercentage}% REWARD</span>
                    </span>
                  )}
                </div>

                <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-amber-300 transition-colors">
                  {promo.title}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {promo.description}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
                {promo.code ? (
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-400 uppercase font-mono">Use Promo Code:</span>
                    <span className="px-2 py-1 rounded-md bg-slate-950 border border-amber-500/30 text-amber-300 font-mono font-bold text-xs">
                      {promo.code}
                    </span>
                  </div>
                ) : (
                  <span className="text-[11px] text-emerald-400 font-medium">Automatic at checkout</span>
                )}

                <button
                  onClick={() => {
                    if (promo.ctaDestination === 'vendor' && onNavigateVendor) {
                      onNavigateVendor();
                    } else {
                      onOpenAuth(promo.ctaDestination === 'login' ? 'login' : 'register');
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition-all flex items-center gap-1.5 shadow-md shadow-amber-500/20 active:scale-95 cursor-pointer ml-auto"
                >
                  <span>{promo.ctaLabel || 'Claim Offer'}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
