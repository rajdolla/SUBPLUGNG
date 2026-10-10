import React, { useState } from 'react';
import { DataPlan } from '../types';
import { DATA_PLANS } from '../data/mockData';
import { Check, ArrowRight, Zap, TrendingDown, Users } from 'lucide-react';
import { useCms } from '../context/CmsContext';

interface PricingSectionProps {
  onSelectPlan: (plan: DataPlan) => void;
  onOpenPriceList: () => void;
  onOpenAuth: (tab: 'login' | 'register') => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({
  onSelectPlan,
  onOpenPriceList,
  onOpenAuth,
}) => {
  const { cms } = useCms();
  const pricingData = cms.pricing;

  if (!pricingData.isVisible) return null;

  const [selectedNetwork, setSelectedNetwork] = useState<string>('MTN');
  const [isVendorPricing, setIsVendorPricing] = useState(false);

  // Map T2mobile to 9mobile mock plans if needed
  const filteredPlans = DATA_PLANS.filter((p) => {
    if (selectedNetwork === 'T2mobile') return p.network === '9mobile';
    return p.network === selectedNetwork;
  });

  const networks = ['MTN', 'Airtel', 'Glo', 'T2mobile'];

  return (
    <section id="pricing" className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">
              {pricingData.badgeText || 'Transparent Wholesale Pricing'}
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              {pricingData.title || 'Best Data Rates in Nigeria'}
            </h2>
            <p className="mt-2 text-base text-slate-400 max-w-xl">
              {pricingData.subtitle || 'Compare end-user rates against wholesale vendor pricing. Never overpay for mobile data again.'}
            </p>
          </div>

          {/* User vs Vendor Wholesale Toggle */}
          <div className="flex items-center gap-3 bg-slate-900 p-1.5 rounded-xl border border-slate-800 self-start md:self-auto">
            <button
              onClick={() => setIsVendorPricing(false)}
              className={`px-3 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                !isVendorPricing
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Standard Customer
            </button>
            <button
              onClick={() => setIsVendorPricing(true)}
              className={`px-3 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                isVendorPricing
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'text-emerald-400 hover:text-emerald-300'
              }`}
            >
              <Users className="h-3.5 w-3.5" />
              Vendor Wholesale (from ₦1,500 upgrade)
            </button>
          </div>
        </div>

        {/* Network Selection Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-8 border-b border-slate-800/80 scrollbar-none">
          {networks.map((net) => {
            const isActive = selectedNetwork === net;
            return (
              <button
                key={net}
                onClick={() => setSelectedNetwork(net)}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent'
                }`}
              >
                <span>{net} Data</span>
              </button>
            );
          })}
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredPlans.map((plan) => {
            const price = isVendorPricing ? plan.vendorPrice : plan.userPrice;
            const savings = plan.userPrice - plan.vendorPrice;

            return (
              <div
                key={plan.id}
                className={`relative flex flex-col justify-between p-6 rounded-2xl border transition-all duration-200 ${
                  plan.popular
                    ? 'bg-slate-900/90 border-emerald-500/40 shadow-lg shadow-emerald-500/5'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-semibold text-slate-400">
                      {selectedNetwork === 'T2mobile' ? 'T2mobile' : plan.network} {plan.type}
                    </span>
                    {plan.popular && (
                      <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                        <Zap className="h-3 w-3 fill-emerald-400" />
                        Most Popular
                      </span>
                    )}
                  </div>

                  <h3 className="text-2xl font-bold text-white tracking-tight">
                    {plan.name}
                  </h3>

                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-white font-mono tabular-nums">
                      ₦{price.toLocaleString()}
                    </span>
                    <span className="text-xs text-slate-400">/ {plan.validity}</span>
                  </div>

                  {isVendorPricing ? (
                    <div className="mt-2 text-xs font-semibold text-emerald-400 flex items-center gap-1">
                      <TrendingDown className="h-3.5 w-3.5" />
                      Save ₦{savings} per gigabyte as a Vendor
                    </div>
                  ) : (
                    <div className="mt-2 text-xs text-slate-400">
                      Standard auto-recharge rate
                    </div>
                  )}

                  <ul className="mt-6 space-y-2.5 text-xs text-slate-300">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                      <span>Instant 1-second auto-dispatch</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                      <span>Rolls over on recurring active plan</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                      <span>Works seamlessly across 3G / 4G / 5G</span>
                    </li>
                  </ul>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800">
                  <button
                    onClick={() => onSelectPlan(plan)}
                    className="w-full py-2.5 px-4 text-sm font-semibold rounded-xl bg-slate-800 hover:bg-emerald-400 hover:text-slate-950 text-white transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Get Started</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pricing Action Banner */}
        <div className="mt-12 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/40 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-lg font-bold text-white">
              Need to see our complete rates across all networks?
            </h4>
            <p className="text-sm text-slate-400">
              Download or view full tariff schedules for MTN, Airtel, Glo, T2mobile, and utility APIs.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={onOpenPriceList}
              className="px-5 py-2.5 text-sm font-semibold text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors border border-slate-700 cursor-pointer"
            >
              {pricingData.priceListCtaLabel || 'View Full Price List'}
            </button>
            <button
              onClick={() => onOpenAuth('register')}
              className="px-5 py-2.5 text-sm font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl shadow-sm transition-colors cursor-pointer"
            >
              Register for Vendor Rates
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
