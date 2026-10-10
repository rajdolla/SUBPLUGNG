/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Wallet,
  Plus,
  ShieldCheck,
  Lock,
  ArrowRight,
  CreditCard,
  Building2,
  Clock,
  Gift,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { DashboardSection, KycStatus } from '../../types';

interface WalletWorkspaceProps {
  onNavigate: (section: DashboardSection) => void;
  onOpenFundModal: () => void;
  kycStatus?: KycStatus;
}

export const WalletWorkspace: React.FC<WalletWorkspaceProps> = ({
  onNavigate,
  onOpenFundModal,
  kycStatus = 'not_started',
}) => {
  const isKycVerified = kycStatus === 'verified';

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* 1. Header Banner */}
      <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/30 p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-bold tracking-wide">
            <Wallet className="h-3.5 w-3.5" />
            <span>MAIN LEDGER WALLET</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Main Wallet & Limits
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Your primary cash balance for purchasing airtime, data bundles, electricity tokens, and digital vouchers.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenFundModal}
            className="px-5 py-3 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Fund Wallet</span>
          </button>
          <button
            onClick={() => onNavigate('bonus-wallet')}
            className="px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-600 text-slate-200 font-semibold text-xs sm:text-sm transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Gift className="h-4 w-4 text-amber-400" />
            <span>Bonus Wallet</span>
          </button>
        </div>
      </div>

      {/* 2. Main Balance & Limit Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {/* Available Balance */}
        <div className="md:col-span-2 rounded-3xl border border-slate-800 bg-slate-900/80 p-6 flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                Available Cash Balance
              </span>
              <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                Primary Cash
              </span>
            </div>

            <div className="text-4xl sm:text-5xl font-extrabold text-white font-mono tracking-tight tabular-nums">
              ₦0.00
            </div>
            <p className="text-xs text-slate-400">
              Real user funds stored securely. Balance increases instantaneously via dedicated bank transfer.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400">Ledger Status: Connected to Secure Gateway</span>
            <button
              onClick={onOpenFundModal}
              className="text-emerald-400 hover:text-emerald-300 font-bold transition-colors cursor-pointer"
            >
              Add money now →
            </button>
          </div>
        </div>

        {/* Daily Transaction Limit Card */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                Daily Limit
              </span>
              <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">
                Level 0 Tier
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Daily Limit:</span>
                <span className="font-mono font-bold text-white">₦50,000.00</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Used Today:</span>
                <span className="font-mono text-slate-300">₦0.00</span>
              </div>
              <div className="flex justify-between text-xs pt-1 border-t border-slate-800">
                <span className="text-slate-400">Remaining:</span>
                <span className="font-mono font-bold text-emerald-400">₦50,000.00</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate('kyc')}
            className="w-full py-2 px-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition-colors flex items-center justify-center gap-1 cursor-pointer"
          >
            <span>Upgrade Limit with KYC</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* 3. Automated Funding Status Section */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>Automated Funding Channel</span>
              <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20 flex items-center gap-1">
                <Lock className="h-3 w-3" /> Locked (Demo State)
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Automated wallet funding will be available after secure backend integration.
            </p>
          </div>

          <button
            onClick={onOpenFundModal}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shrink-0 border border-slate-700"
          >
            <Lock className="h-4 w-4 text-amber-400" />
            <span>Funding Gateway Info</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-slate-300 font-semibold">
              <Building2 className="h-4 w-4 text-emerald-400" />
              <span>Dedicated Bank Transfer</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Permanent Nigerian virtual account generated exclusively for your username. Transfer from any bank app.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-slate-300 font-semibold">
              <CreditCard className="h-4 w-4 text-cyan-400" />
              <span>Debit Card / USSD</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Instant settlement via Mastercard, Visa, and Verve with bank-grade 3D Secure verification.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-slate-300 font-semibold">
              <ShieldCheck className="h-4 w-4 text-amber-400" />
              <span>Protected Settlement</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              All deposits are protected by licensed commercial banks and subject to KYC verification limits.
            </p>
          </div>
        </div>
      </div>

      {/* 4. Wallet History (Clean Empty State) */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Wallet History</h3>
            <p className="text-xs text-slate-500">Deposit, top-up, and settlement ledger</p>
          </div>
          <button
            onClick={() => onNavigate('transactions')}
            className="text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            All transactions →
          </button>
        </div>

        <div className="py-12 px-4 rounded-2xl border border-dashed border-slate-800 bg-slate-950/40 text-center space-y-3">
          <div className="h-12 w-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-500">
            <Clock className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-white">No wallet activity yet</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Your funding receipts, manual transfers, and debit debits will be recorded in this ledger after your first transaction.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
