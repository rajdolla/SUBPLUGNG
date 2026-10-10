/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Gift, Share2, Percent, Ticket, ArrowRight, Sparkles } from 'lucide-react';
import { useCms } from '../context/CmsContext';

interface RewardsPromotionSectionProps {
  onOpenAuth: (tab: 'login' | 'register') => void;
}

export const RewardsPromotionSection: React.FC<RewardsPromotionSectionProps> = ({ onOpenAuth }) => {
  const { cms } = useCms();
  const rewards = cms.rewardsPromotion;

  if (!rewards.isVisible) return null;

  const iconMap = {
    cashback: Percent,
    referrals: Share2,
    coupons: Ticket,
    vouchers: Gift,
  };

  return (
    <section id="rewards" className="py-16 sm:py-20 bg-slate-950 border-t border-slate-900 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10 relative">
        
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-bold tracking-wider uppercase">
            <Sparkles className="h-3.5 w-3.5" />
            <span>{rewards.badgeText || 'COMMUNITY & LOYALTY PERKS'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
            {rewards.title || 'Earn More with SUBPLUG Rewards'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed [text-wrap:balance]">
            {rewards.subtitle || 'From automated cashback on daily recharges to lucrative referral earnings and instant voucher top-ups, we reward every transaction.'}
          </p>
        </div>

        {/* 4 Key Pillars: Cashback, Referrals, Coupons, Vouchers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {rewards.features.map((feature, idx) => {
            const Icon = iconMap[feature.type] || Gift;
            return (
              <div
                key={idx}
                className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900/90 to-slate-950 p-6 flex flex-col justify-between space-y-4 hover:border-emerald-500/40 hover:-translate-y-1 transition-all duration-300 shadow-lg group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="h-11 w-11 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-bold border border-slate-700">
                      {feature.badge}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                <div className="pt-2 text-[11px] font-medium text-emerald-400 flex items-center gap-1">
                  <span>{feature.type === 'vouchers' ? 'Funds Main Wallet' : 'Credits Bonus Wallet'}</span>
                  <span className="text-slate-600">·</span>
                  <span className="text-slate-400">Automated</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Bar */}
        <div className="rounded-3xl border border-slate-800 bg-gradient-to-r from-emerald-950/40 via-slate-900 to-cyan-950/40 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <h4 className="text-base font-bold text-white">Ready to unlock cashback and referral bonuses?</h4>
            <p className="text-xs text-slate-400 mt-1">Open your free account in 30 seconds and receive instant access to rewards.</p>
          </div>
          <button
            onClick={() => onOpenAuth('register')}
            className="px-6 py-3 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95 cursor-pointer shrink-0"
          >
            <span>{rewards.ctaLabel || 'Start Earning Rewards'}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

      </div>
    </section>
  );
};
