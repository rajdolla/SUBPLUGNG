import React, { useState } from 'react';
import { 
  CheckCircle2, 
  ArrowRight, 
  TrendingUp, 
  Terminal, 
  Wallet, 
  ShieldCheck, 
  Coins 
} from 'lucide-react';

interface VendorSectionProps {
  onOpenVendorModal: () => void;
  onGoToVendorPage?: () => void;
}

export const VendorSection: React.FC<VendorSectionProps> = ({ onOpenVendorModal, onGoToVendorPage }) => {
  const [dailyGbSold, setDailyGbSold] = useState(50);
  const profitPerGb = 40; // average wholesale resale margin ₦40
  const monthlyProfit = dailyGbSold * profitPerGb * 30;

  return (
    <section id="vendor" className="py-16 sm:py-24 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Headline, Value Proposition & Interactive Calculator */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
              <TrendingUp className="h-4 w-4" />
              <span>Reseller & Agent Partnership</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight [text-wrap:balance]">
              Start Your Own VTU Business Today.
            </h2>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
              Get access to our developer API, buy at wholesale prices, and make huge profits. Perfect for resellers, agents, campus ambassadors, and fintech entrepreneurs looking for guaranteed recurring cash flow.
            </p>

            {/* Transparent Upgrade Fee Badge */}
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between text-xs sm:text-sm">
              <div className="flex items-center gap-2">
                <span className="font-bold text-amber-400">One-Time Upgrade Fee:</span>
                <span className="font-mono text-white font-extrabold">₦1,500</span>
                <span className="text-slate-400 text-xs hidden sm:inline">(Reseller) · ₦3,500 (API Partner)</span>
              </div>
              <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                Lifetime Validity
              </span>
            </div>

            {/* Value checklist */}
            <div className="space-y-3 pt-1">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
                <span className="text-sm text-slate-300">
                  <strong className="text-white">Tier-1 Wholesale Pricing:</strong> Buy data from ₦240/GB and resell at ₦280–₦350 (recover your ₦1,500 fee on your first 35GB).
                </span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
                <span className="text-sm text-slate-300">
                  <strong className="text-white">Full Developer API:</strong> Plug SUBPLUG directly into your custom mobile app or website with instant webhooks.
                </span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
                <span className="text-sm text-slate-300">
                  <strong className="text-white">Dedicated Virtual Bank Accounts:</strong> Instant automated wallet funding with zero manual approval delays.
                </span>
              </div>
            </div>

            {/* Interactive Reseller Profit Simulator */}
            <div className="mt-6 p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Coins className="h-4 w-4 text-amber-400" />
                  <span className="text-xs font-bold text-slate-200">Interactive Profit Calculator</span>
                </div>
                <span className="text-xs font-semibold text-slate-400">
                  {dailyGbSold} GB / day
                </span>
              </div>

              <div>
                <input
                  type="range"
                  min="10"
                  max="250"
                  step="5"
                  value={dailyGbSold}
                  onChange={(e) => setDailyGbSold(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
                />
                <div className="flex justify-between text-[11px] text-slate-500 mt-1 font-mono">
                  <span>10 GB/day</span>
                  <span>100 GB/day</span>
                  <span>250 GB/day</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-slate-400">Estimated Monthly Profit</div>
                  <div className="text-2xl font-black text-amber-400 font-mono tabular-nums">
                    ₦{monthlyProfit.toLocaleString()}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[11px] text-slate-400">Annual Run-rate</div>
                  <div className="text-sm font-bold text-slate-200 font-mono tabular-nums">
                    ₦{(monthlyProfit * 12).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            {/* Distinct Standout CTA Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                onClick={onGoToVendorPage || onOpenVendorModal}
                className="min-h-[52px] px-8 py-3.5 text-base font-extrabold text-slate-950 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-300 hover:from-amber-300 hover:to-orange-300 rounded-xl shadow-lg shadow-amber-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Explore Full Vendor Portal</span>
                <ArrowRight className="h-5 w-5" />
              </button>
              <button
                onClick={onOpenVendorModal}
                className="min-h-[52px] px-5 py-3.5 text-sm font-semibold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 rounded-xl border border-slate-700 transition-colors flex items-center justify-center cursor-pointer"
              >
                Quick Upgrade (from ₦1,500)
              </button>
            </div>
          </div>

          {/* Right Column: Dashboard Visual Mockup with Floating Stats */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 shadow-2xl group">
              <img
                src="/src/assets/images/vendor_dashboard_mockup_1790292295025.jpg"
                alt="Subplug Vendor Reseller Dashboard Interface"
                referrerPolicy="no-referrer"
                className="w-full h-auto object-cover max-h-[460px] transition-transform duration-300 group-hover:scale-[1.02]"
              />

              {/* Subdued Glass Overlay at bottom showing realistic stats */}
              <div className="p-4 sm:p-5 bg-slate-950/85 backdrop-blur-md border-t border-slate-800/80">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-[11px] text-slate-400">Vendor Margin</div>
                    <div className="text-base sm:text-lg font-bold text-white font-mono">15% - 25%</div>
                  </div>
                  <div className="border-x border-slate-800">
                    <div className="text-[11px] text-slate-400">API Latency</div>
                    <div className="text-base sm:text-lg font-bold text-emerald-400 font-mono">350ms</div>
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-400">Active Agents</div>
                    <div className="text-base sm:text-lg font-bold text-white font-mono">4,800+</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
