/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Gift,
  Share2,
  Percent,
  Sparkles,
  Clock,
  ArrowRight,
  ShieldCheck,
  Info,
} from 'lucide-react';
import { DashboardSection } from '../../types';

interface BonusWalletWorkspaceProps {
  onNavigate: (section: DashboardSection) => void;
}

export const BonusWalletWorkspace: React.FC<BonusWalletWorkspaceProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* 1. Header Banner */}
      <div className="rounded-3xl border border-amber-500/30 bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/30 p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-mono font-bold tracking-wide">
            <Gift className="h-3.5 w-3.5" />
            <span>REWARDS & INCENTIVE LEDGER</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Bonus Wallet
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            A dedicated wallet strictly for your referral commission payouts, eligible purchase cashback, and promo rewards. Never commingled with your main cash balance.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('referral')}
            className="px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            <Share2 className="h-4 w-4" />
            <span>Referral Centre</span>
          </button>
          <button
            onClick={() => onNavigate('cashback')}
            className="px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-600 text-slate-200 font-semibold text-xs sm:text-sm transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Percent className="h-4 w-4 text-emerald-400" />
            <span>Cashback Rules</span>
          </button>
        </div>
      </div>

      {/* 2. Bonus Ledger Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Bonus Balance */}
        <div className="rounded-3xl border border-amber-500/30 bg-slate-900/90 p-6 space-y-2 relative overflow-hidden">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
            Bonus Balance
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold text-amber-400 font-mono tabular-nums">
            ₦0.00
          </div>
          <div className="text-[11px] text-slate-500">
            Available to redeem for telecom services
          </div>
        </div>

        {/* Referral Bonus */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
            Referral Bonus
          </div>
          <div className="text-3xl font-extrabold text-white font-mono tabular-nums">
            ₦0.00
          </div>
          <div className="text-[11px] text-slate-500">
            Earned from friend purchases
          </div>
        </div>

        {/* Cashback Earned */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
            Cashback Earned
          </div>
          <div className="text-3xl font-extrabold text-white font-mono tabular-nums">
            ₦0.00
          </div>
          <div className="text-[11px] text-slate-500">
            Earned from your eligible transactions
          </div>
        </div>

        {/* Total Lifetime Earned */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
            Total Earned
          </div>
          <div className="text-3xl font-extrabold text-emerald-400 font-mono tabular-nums">
            ₦0.00
          </div>
          <div className="text-[11px] text-slate-500">
            Cumulative platform reward yield
          </div>
        </div>
      </div>

      {/* 3. Wallet Architecture Clarity Notice */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6 sm:p-7 space-y-4">
        <div className="flex items-start gap-3">
          <div className="h-8 w-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
            <Info className="h-4 w-4" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-white">How SUBPLUG Manages Wallets</h3>
            <p className="text-xs text-slate-400 leading-relaxed max-w-3xl">
              To safeguard financial transparency, SUBPLUG keeps user cash and bonus rewards completely separated.
              Your <strong className="text-white">Main Wallet</strong> holds deposited cash from bank transfers. Your <strong className="text-amber-400">Bonus Wallet</strong> accumulates referral earnings, cashback promotions, and seasonal bonuses.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 text-xs">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
            <div className="font-bold text-white flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span>Main Cash Wallet</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Funded via verified bank transfers or debit cards. Used for all daily dispatches with zero expiration.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
            <div className="font-bold text-amber-400 flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-amber-400" />
              <span>Bonus Reward Wallet</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Credited automatically by the backend ledger when friends purchase services or during special cashback promotions.
            </p>
          </div>
        </div>
      </div>

      {/* 4. Bonus Activity History (Clean Empty State) */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Bonus History</h3>
            <p className="text-xs text-slate-500">Log of referral rewards, cashback credits, and promotional boosts</p>
          </div>
          <span className="text-xs text-slate-500 font-mono">0 records</span>
        </div>

        <div className="py-12 px-4 rounded-2xl border border-dashed border-slate-800 bg-slate-950/40 text-center space-y-3">
          <div className="h-12 w-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-500">
            <Clock className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-white">No bonus activity yet</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Your referral rewards and purchase cashback will appear here once eligible transactions are recorded.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
