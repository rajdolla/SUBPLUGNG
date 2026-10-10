/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Percent,
  Sparkles,
  Smartphone,
  Wifi,
  CreditCard,
  CheckCircle2,
  Clock,
  ArrowRight,
  Info,
} from 'lucide-react';
import { DashboardSection } from '../../types';

interface CashbackWorkspaceProps {
  onNavigate: (section: DashboardSection) => void;
}

export const CashbackWorkspace: React.FC<CashbackWorkspaceProps> = ({ onNavigate }) => {
  const eligibleServices = [
    {
      name: 'Mobile Data Bundles',
      serviceId: 'data' as DashboardSection,
      icon: Wifi,
      ratePreview: 'Up to 3-5%',
      desc: 'Automatic percentage rebate credited directly to your Bonus Wallet on eligible SME & Corporate Gifting plans.',
      active: true,
    },
    {
      name: 'Airtime Virtual Top-Up',
      serviceId: 'airtime' as DashboardSection,
      icon: Smartphone,
      ratePreview: 'Up to 2-3%',
      desc: 'Cashback bonuses applied on qualifying airtime recharges across MTN, Airtel, Glo, and 9mobile.',
      active: true,
    },
    {
      name: 'Encrypted Data PINs',
      serviceId: 'data-pins' as DashboardSection,
      icon: CreditCard,
      ratePreview: 'Promotional',
      desc: 'Earn instant rewards when generating bulk encrypted data vouchers for kiosk distribution.',
      active: true,
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* 1. Header Banner */}
      <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/30 p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-bold tracking-wide">
            <Percent className="h-3.5 w-3.5" />
            <span>PURCHASE CASHBACK REWARDS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Purchase Cashback
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Get rewarded every time you recharge. Eligible personal orders automatically yield percentage cashback credits into your Bonus Wallet.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-right shrink-0">
          <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
            Total Cashback Earned
          </div>
          <div className="text-3xl font-extrabold text-emerald-400 font-mono tabular-nums">
            ₦0.00
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            Backend-calculated ledger
          </div>
        </div>
      </div>

      {/* 2. Key Distinction Box */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider font-mono">
          <Info className="h-4 w-4" />
          <span>Understanding Cashback vs Referral Bonus</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <div className="font-bold text-white flex items-center gap-2">
              <Percent className="h-3.5 w-3.5 text-emerald-400" />
              <span>Purchase Cashback</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Earned on <em>your own personal purchases</em> (e.g. buying ₦5,000 Data with a 5% promotional rate yields ₦250 rebate back to your Bonus Wallet).
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <div className="font-bold text-white flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              <span>Referral Bonus</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Earned when <em>someone you referred</em> registers with your invite code and completes eligible transactions on SUBPLUG.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Eligible Services for Cashback */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white tracking-tight">
            Eligible Cashback Categories
          </h2>
          <span className="text-xs text-slate-400">Configured promotional tranches</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {eligibleServices.map((svc) => {
            const Icon = svc.icon;
            return (
              <div
                key={svc.name}
                className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="h-10 w-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-emerald-400">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      {svc.ratePreview}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-white">{svc.name}</h3>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      {svc.desc}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => onNavigate(svc.serviceId)}
                  className="w-full py-2 px-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Recharge & Check Cashback</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Cashback Activity History (Clean Empty State) */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Cashback Log</h3>
            <p className="text-xs text-slate-500">Record of promotional purchase rebates</p>
          </div>
          <span className="text-xs text-slate-500 font-mono">0 credits</span>
        </div>

        <div className="py-12 px-4 rounded-2xl border border-dashed border-slate-800 bg-slate-950/40 text-center space-y-3">
          <div className="h-12 w-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-500">
            <Clock className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-white">No cashback earned yet</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Eligible purchases will automatically calculate and record your cashback here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
