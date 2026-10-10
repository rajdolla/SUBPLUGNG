/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Gift,
  Tag,
  Share2,
  Ticket,
  Copy,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Percent,
  Clock,
  Sparkles,
  ArrowRight,
  Wallet,
  Coins,
  Lock,
  Layers,
  Wifi,
  PhoneCall,
  Sliders,
  Check,
} from 'lucide-react';
import { useCms } from '../../context/CmsContext';
import { ReferralWorkspace } from './ReferralWorkspace';

interface RewardsWorkspaceProps {
  initialTab?: 'promos' | 'referrals' | 'vouchers' | 'points';
  onNavigateToWallet?: () => void;
  onNavigateToBonusWallet?: () => void;
}

export const RewardsWorkspace: React.FC<RewardsWorkspaceProps> = ({
  initialTab = 'promos',
  onNavigateToWallet,
  onNavigateToBonusWallet,
}) => {
  const {
    promos,
    coupons,
    vouchers,
    redeemVoucherDemo,
    pointsConfig,
    pointsTasks,
    pointsCatalogue,
  } = useCms();
  const [activeTab, setActiveTab] = useState<'promos' | 'referrals' | 'vouchers' | 'points'>(initialTab);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // Voucher redemption state
  const [voucherCodeInput, setVoucherCodeInput] = useState('');
  const [redeemNotice, setRedeemNotice] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Quick preset voucher codes from available unused vouchers for UX ease (Select-First UX)
  const availableDemoVouchers = vouchers.filter((v) => v.status === 'unused');

  const handleRedeemVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!voucherCodeInput.trim()) {
      setRedeemNotice({ type: 'error', text: 'Please enter or select a valid voucher code.' });
      return;
    }

    setIsSubmitting(true);
    setRedeemNotice(null);

    setTimeout(() => {
      setIsSubmitting(false);
      const res = redeemVoucherDemo(voucherCodeInput.trim());
      if (res.success) {
        setRedeemNotice({
          type: 'success',
          text: `${res.message} (Demo State: Main Wallet funding recorded in session ledger).`,
        });
        setVoucherCodeInput('');
      } else {
        setRedeemNotice({ type: 'error', text: res.message });
      }
    }, 600);
  };

  const handleSelectPresetVoucher = (code: string) => {
    setVoucherCodeInput(code);
    setRedeemNotice(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* 1. Header Banner */}
      <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/30 p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-bold tracking-wide">
            <Gift className="h-3.5 w-3.5" />
            <span>SUBPLUG REWARDS & LOYALTY SUITE</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Rewards Centre
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Maximize your savings with promotional discounts, active referral commissions, and instant prepaid funding vouchers.
          </p>
        </div>

        {/* Wallet Balances Quick Access */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={onNavigateToWallet}
            className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors"
          >
            <Wallet className="h-4 w-4 text-emerald-400" />
            <span>Main Wallet</span>
          </button>
          <button
            onClick={onNavigateToBonusWallet}
            className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors"
          >
            <Gift className="h-4 w-4 text-amber-400" />
            <span>Bonus Wallet</span>
          </button>
        </div>
      </div>

      {/* 2. Top Tabs: Promos | Referrals | Vouchers */}
      <div className="flex items-center gap-2 border-b border-slate-800/80 pb-3 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('promos')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'promos'
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent'
          }`}
        >
          <Tag className="h-4 w-4" />
          <span>Promotions & Deals</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-slate-800 text-slate-300">
            {promos.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('referrals')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'referrals'
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent'
          }`}
        >
          <Share2 className="h-4 w-4" />
          <span>Referral Centre</span>
        </button>

        <button
          onClick={() => setActiveTab('vouchers')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'vouchers'
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent'
          }`}
        >
          <Ticket className="h-4 w-4" />
          <span>Redeem Vouchers</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-300">
            Funding
          </span>
        </button>

        <button
          onClick={() => setActiveTab('points')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'points'
              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent'
          }`}
        >
          <Sparkles className="h-4 w-4" />
          <span>SUBPLUG Points</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-amber-500/20 text-amber-300 font-mono">
            Coming Soon
          </span>
        </button>
      </div>

      {/* 3. TAB CONTENT */}

      {/* TAB A: PROMOTIONS & DEALS */}
      {activeTab === 'promos' && (
        <div className="space-y-6 animate-in fade-in">
          
          {/* Active Promotions Grid */}
          <div className="space-y-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-emerald-400" />
              <span>Live Promotions & Cashback Perks</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {promos.map((promo) => (
                <div
                  key={promo.id}
                  className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 flex flex-col justify-between space-y-4 hover:border-slate-700 transition-colors shadow-md"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold uppercase">
                        {promo.type}
                      </span>
                      <span className="text-[11px] font-mono font-bold text-slate-300">
                        {promo.rewardType === 'percentage'
                          ? `${promo.rewardValue}% Reward`
                          : `₦${promo.rewardValue} Reward`}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-white">{promo.name}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">{promo.terms}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Min: ₦{promo.minTransaction.toLocaleString()}</span>
                    <span className="text-emerald-400 font-semibold">Active</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Discount Coupons */}
          <div className="space-y-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Tag className="h-4 w-4 text-cyan-400" />
              <span>Applicable Discount Coupons</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {coupons.map((coupon) => (
                <div
                  key={coupon.id}
                  className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/60 p-5 flex items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-white">{coupon.title}</div>
                    <p className="text-[11px] text-slate-400">
                      Min Purchase: ₦{coupon.minPurchase.toLocaleString()} · Valid till {coupon.expiryDate}
                    </p>
                    <div className="text-[10px] text-emerald-400 font-mono">
                      {coupon.usageCount} of {coupon.usageLimit} redemptions used
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className="px-3 py-1.5 rounded-lg bg-slate-950 border border-cyan-500/30 text-cyan-300 font-mono font-bold text-xs select-all">
                      {coupon.code}
                    </span>
                    <span className="text-[10px] text-slate-500">Click to copy</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Rewards Policy Callout */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 text-xs text-slate-400 flex items-start gap-3">
            <AlertCircle className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold text-slate-200">Automated Reward Crediting Architecture</span>
              <p>
                All cashbacks and promotional incentives are credited automatically to your <strong>Bonus Wallet</strong> upon transaction completion. Bonus Wallet funds can be withdrawn or converted to service balances per system rules.
              </p>
            </div>
          </div>

        </div>
      )}

      {/* TAB B: REFERRALS */}
      {activeTab === 'referrals' && (
        <div className="animate-in fade-in">
          <ReferralWorkspace />
        </div>
      )}

      {/* TAB C: VOUCHERS (FUNDING MECHANISM) */}
      {activeTab === 'vouchers' && (
        <div className="space-y-6 animate-in fade-in">
          
          {/* CRITICAL BUSINESS RULE NOTICE */}
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5 text-xs text-emerald-300 flex items-start gap-3.5">
            <ShieldCheck className="h-5 w-5 shrink-0 mt-0.5 text-emerald-400" />
            <div className="space-y-1.5 leading-relaxed">
              <div className="font-bold text-sm text-white flex items-center gap-2">
                <span>Voucher Funding System Architecture</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-400 text-slate-950 font-black">
                  MAIN WALLET
                </span>
              </div>
              <p className="text-slate-300">
                <strong>Important Business Rule:</strong> Voucher redemption is a direct <strong>funding mechanism</strong>. Successful voucher codes credit your <strong>Main Wallet</strong> directly (not Bonus Wallet), allowing you to immediately purchase any VTU telecom bundle or utility service.
              </p>
              <p className="text-[11px] text-emerald-400 font-mono">
                Security Guarantee: Each voucher is single-use only with atomic validation and server-side immutable audit ledger tracking.
              </p>
            </div>
          </div>

          {/* Voucher Redemption Card */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 sm:p-8 space-y-6 max-w-2xl">
            <div className="space-y-2">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Ticket className="h-5 w-5 text-emerald-400" />
                <span>Redeem Prepaid Funding Voucher</span>
              </h2>
              <p className="text-xs text-slate-400">
                Enter your 16-character alphanumeric voucher code to fund your Main Wallet instantly.
              </p>
            </div>

            <form onSubmit={handleRedeemVoucher} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wide mb-2">
                  Voucher Code
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={voucherCodeInput}
                    onChange={(e) => setVoucherCodeInput(e.target.value.toUpperCase())}
                    placeholder="e.g. SP-FUND-5000-XYZ"
                    className="w-full px-4 py-3.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-emerald-500 text-white font-mono text-sm tracking-wider uppercase placeholder:text-slate-600 focus:outline-none transition-colors"
                  />
                  {voucherCodeInput && (
                    <button
                      type="button"
                      onClick={() => setVoucherCodeInput('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white text-xs font-semibold cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {/* Select-First UX: Quick Presets from Available Vouchers in Session */}
              {availableDemoVouchers.length > 0 && (
                <div className="space-y-1.5">
                  <div className="text-[11px] text-slate-400 font-medium">
                    Select Available Demo Voucher (Select-First Principle):
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {availableDemoVouchers.map((v) => (
                      <button
                        type="button"
                        key={v.id}
                        onClick={() => handleSelectPresetVoucher(v.code)}
                        className={`px-2.5 py-1.5 rounded-lg border text-xs font-mono transition-all cursor-pointer ${
                          voucherCodeInput === v.code
                            ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold'
                            : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        {v.code} (₦{v.value.toLocaleString()})
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {redeemNotice && (
                <div
                  className={`p-3.5 rounded-xl border text-xs flex items-center gap-2 animate-in fade-in ${
                    redeemNotice.type === 'success'
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                      : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                  }`}
                >
                  {redeemNotice.type === 'success' ? (
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                  ) : (
                    <AlertCircle className="h-4 w-4 shrink-0" />
                  )}
                  <span>{redeemNotice.text}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-[0.98] cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Verifying Voucher Security...</span>
                ) : (
                  <>
                    <span>Redeem Voucher & Fund Main Wallet</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            <div className="text-[11px] text-slate-500 text-center font-mono">
              Demo only — live voucher redemption requires server-side atomic validation and wallet crediting.
            </div>
          </div>

          {/* Vouchers History / State Table */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
            <h3 className="text-sm font-bold text-white">Voucher System Ledger (Session State)</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-mono uppercase text-[10px]">
                    <th className="py-2.5 px-3">Voucher Code</th>
                    <th className="py-2.5 px-3">Value</th>
                    <th className="py-2.5 px-3">Target Wallet</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Expiry Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {vouchers.map((v) => (
                    <tr key={v.id} className="hover:bg-slate-950/40 transition-colors">
                      <td className="py-2.5 px-3 font-mono font-bold text-white">{v.code}</td>
                      <td className="py-2.5 px-3 font-mono font-bold text-emerald-400">
                        ₦{v.value.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                          Main Wallet
                        </span>
                      </td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                            v.status === 'unused'
                              ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                              : v.status === 'redeemed'
                              ? 'bg-slate-800 text-slate-400'
                              : 'bg-rose-500/10 text-rose-400'
                          }`}
                        >
                          {v.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-mono text-slate-400">{v.expiryDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* TAB D: SUBPLUG POINTS (FUTURE LOYALTY & REDEMPTION SYSTEM) */}
      {activeTab === 'points' && (
        <div className="space-y-6 animate-in fade-in">
          
          {/* 1. Header Banner & Status Badge */}
          <div className="rounded-3xl border border-amber-500/30 bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/30 p-6 sm:p-8 space-y-5 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-xl">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-mono font-bold tracking-wide">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>FUTURE LOYALTY SYSTEM · COMING SOON</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  SUBPLUG Points
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Earn points from eligible tasks and transactions across the platform. In the future, you will be able to convert qualifying points into Main Wallet cash, airtime, or high-speed data bundles.
                </p>
              </div>

              {/* Verified Honest Status Display (No fake balances / No fake cash equivalent) */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5 shrink-0 min-w-[200px]">
                <div className="text-[10px] font-mono uppercase text-slate-500 flex items-center justify-between">
                  <span>Points Balance</span>
                  <span className="text-amber-400 font-bold">Coming Soon</span>
                </div>
                <div className="text-2xl font-black text-white font-mono flex items-baseline gap-1.5">
                  <span>0</span>
                  <span className="text-xs text-slate-400 font-normal">PTS</span>
                </div>
                <div className="text-[10px] text-slate-500 flex items-center gap-1">
                  <Clock className="h-3 w-3 text-slate-400" />
                  <span>Feature Inactive · Earning Not Started</span>
                </div>
              </div>
            </div>

            {/* Anti-Slop / Transparent Audit Callout */}
            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs text-slate-400 flex items-start gap-2.5">
              <AlertCircle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-bold text-slate-200">System Integrity & Audit Standard</span>
                <p className="text-[11px] leading-relaxed">
                  In accordance with SUBPLUG security and audit rules, no fabricated points balances, completed tasks, or synthetic cash-equivalent values are displayed while this feature is inactive. Earning and redemption are disabled until backend activation.
                </p>
              </div>
            </div>
          </div>

          {/* 2. The Three Future Redemption Pillars */}
          <div className="space-y-3">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Gift className="h-4 w-4 text-emerald-400" />
                <span>What You Can Redeem Points For</span>
              </h3>
              <p className="text-xs text-slate-400">
                Qualifying points will be redeemable through three distinct reward channels:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Pillar 1: Wallet Cash */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 space-y-3 hover:border-emerald-500/30 transition-colors">
                <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
                  <Wallet className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white">Wallet Cash</h4>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                      Main Wallet
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Convert qualifying points into an approved cash amount credited directly to your <strong>Main Wallet</strong>.
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-500 space-y-1">
                  <div className="text-emerald-400 font-semibold flex items-center gap-1">
                    <Check className="h-3 w-3" />
                    <span>Usable for any platform purchase</span>
                  </div>
                  <p>Credited only after backend validates and completes the redemption.</p>
                </div>
              </div>

              {/* Pillar 2: Airtime */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 space-y-3 hover:border-cyan-500/30 transition-colors">
                <div className="h-10 w-10 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center">
                  <PhoneCall className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white">Direct Airtime</h4>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-bold">
                      VTU Switch
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Redeem qualifying points for eligible airtime top-ups sent directly to your phone number on supported networks.
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-500 space-y-1">
                  <div className="text-cyan-400 font-semibold flex items-center gap-1">
                    <Check className="h-3 w-3" />
                    <span>MTN, Airtel, Glo & T2mobile</span>
                  </div>
                  <p>Dispatched through approved backend telecom provider switches.</p>
                </div>
              </div>

              {/* Pillar 3: Data */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 space-y-3 hover:border-amber-500/30 transition-colors">
                <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center">
                  <Wifi className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white">Data Bundles</h4>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold">
                      SME / Corporate
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Redeem points for eligible high-speed internet data bundles (1GB, 1.5GB, 2GB) without spending wallet funds.
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-500 space-y-1">
                  <div className="text-amber-400 font-semibold flex items-center gap-1">
                    <Check className="h-3 w-3" />
                    <span>Instant automated delivery</span>
                  </div>
                  <p>Dispatched using approved backend telecom provider workflows.</p>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Core Architectural Rules & Separation of Wallets */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>Core Rules: Separation of Points & Wallets</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                <div className="text-white font-bold flex items-center gap-1.5">
                  <Layers className="h-4 w-4 text-amber-400" />
                  <span>Isolated Points Ledger</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  SUBPLUG Points have a separate points ledger and balance from the <strong>Main Wallet</strong> and <strong>Bonus Wallet</strong>. Points are never treated as cash before a valid redemption.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                <div className="text-white font-bold flex items-center gap-1.5">
                  <Sliders className="h-4 w-4 text-cyan-400" />
                  <span>Minimum Thresholds</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Users must accumulate a configurable minimum point threshold (e.g., 500 PTS) before redemption is unlocked. Rates and limits are administrator-governed.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                <div className="text-white font-bold flex items-center gap-1.5">
                  <Lock className="h-4 w-4 text-emerald-400" />
                  <span>Server-Side Authority</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Browser code cannot modify points or wallet balances. All redemptions execute through atomic server-side stored procedures with double-spend protection.
                </p>
              </div>
            </div>
          </div>

          {/* 4. Configurable Redemption Catalogue Preview */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Coins className="h-4 w-4 text-amber-400" />
                  <span>Configurable Redemption Catalogue (Preview Specifications)</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Preview of upcoming reward items. Values, conversion rates, and networks are administrator-configurable rather than active fixed offers.
                </p>
              </div>
              <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-slate-800 text-slate-400 border border-slate-700 w-fit">
                Catalogue Inactive · Claims Disabled
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pointsCatalogue.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 flex flex-col justify-between space-y-4 opacity-90 hover:border-slate-700 transition-colors"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-slate-800 text-slate-300 font-bold">
                        {item.rewardType.replace('_', ' ')}
                      </span>
                      <span className="text-xs font-mono font-bold text-amber-400">
                        {item.pointsRequired.toLocaleString()} PTS
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-white">{item.title}</h4>
                    <p className="text-[11px] text-slate-400 leading-relaxed">{item.terms}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 space-y-2">
                    <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                      <span>Threshold: {item.pointsRequired} PTS</span>
                      <span>Limit: {item.perUserMonthlyLimit ? `${item.perUserMonthlyLimit}/mo` : 'Unlimited'}</span>
                    </div>

                    <button
                      type="button"
                      disabled
                      className="w-full py-2.5 px-3 rounded-xl bg-slate-800/70 border border-slate-700/60 text-slate-500 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-not-allowed"
                    >
                      <Lock className="h-3.5 w-3.5" />
                      <span>Redemption Inactive (Coming Soon)</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 5. Future Earning Tasks Matrix Preview */}
          <div className="space-y-3">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-cyan-400" />
                <span>How Points Will Be Earned (Upcoming Task Matrix)</span>
              </h3>
              <p className="text-xs text-slate-400">
                Tasks will automatically accumulate points in your isolated points account once the backend daemon is activated.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {pointsTasks.map((task) => (
                <div
                  key={task.id}
                  className="rounded-2xl border border-dashed border-slate-800 bg-slate-950/40 p-4 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{task.title}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      +{task.pointsReward} PTS
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{task.description}</p>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono pt-1">
                    <span>Category: {task.category}</span>
                    <span>Status: Inactive Spec</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
