/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Wallet,
  Gift,
  ArrowRight,
  Plus,
  TrendingUp,
  Smartphone,
  Wifi,
  Zap,
  Cable,
  MessageSquare,
  ArrowLeftRight,
  CreditCard,
  GraduationCap,
  ReceiptText,
  Users,
  Code2,
  ChevronRight,
  Clock,
  Sparkles,
  Share2,
} from 'lucide-react';
import { DashboardSection } from '../../types';

interface OverviewWorkspaceProps {
  displayName: string;
  onNavigate: (section: DashboardSection) => void;
  onFundWallet: () => void;
}

export const OverviewWorkspace: React.FC<OverviewWorkspaceProps> = ({
  displayName,
  onNavigate,
  onFundWallet,
}) => {
  // Time-aware authentic Nigerian greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const quickActions: { id: DashboardSection; label: string; icon: React.ElementType }[] = [
    { id: 'airtime', label: 'Buy Airtime', icon: Smartphone },
    { id: 'data', label: 'Buy Data', icon: Wifi },
    { id: 'electricity', label: 'Pay Electricity', icon: Zap },
    { id: 'cable', label: 'Pay Cable TV', icon: Cable },
    { id: 'bulk-sms', label: 'Send Bulk SMS', icon: MessageSquare },
    { id: 'wallet', label: 'Fund Wallet', icon: Plus },
    { id: 'reseller', label: 'Become Reseller', icon: Users },
    { id: 'bonus-wallet', label: 'Bonus Wallet', icon: Gift },
    { id: 'referral', label: 'Referral Centre', icon: Share2 },
  ];

  const serviceGrid = [
    {
      id: 'airtime' as DashboardSection,
      name: 'Airtime',
      desc: 'Top up any Nigerian network instantly.',
      icon: Smartphone,
      tone: 'emerald',
    },
    {
      id: 'data' as DashboardSection,
      name: 'Data',
      desc: 'Buy affordable data bundles.',
      icon: Wifi,
      tone: 'cyan',
      badge: 'Hot',
    },
    {
      id: 'electricity' as DashboardSection,
      name: 'Electricity',
      desc: 'Pay your electricity bill quickly.',
      icon: Zap,
      tone: 'amber',
    },
    {
      id: 'cable' as DashboardSection,
      name: 'Cable TV',
      desc: 'Renew your TV subscription.',
      icon: Cable,
      tone: 'violet',
    },
    {
      id: 'bulk-sms' as DashboardSection,
      name: 'Bulk SMS',
      desc: 'Reach thousands of customers with one campaign.',
      icon: MessageSquare,
      tone: 'emerald',
      badge: 'Scale',
    },
    {
      id: 'airtime-cash' as DashboardSection,
      name: 'Airtime to Cash',
      desc: 'Convert eligible airtime to cash.',
      icon: ArrowLeftRight,
      tone: 'rose',
      badge: 'KYC Req',
    },
    {
      id: 'data-pins' as DashboardSection,
      name: 'Data Pins',
      desc: 'Purchase data PINs for your needs or business.',
      icon: CreditCard,
      tone: 'cyan',
    },
    {
      id: 'exam-pins' as DashboardSection,
      name: 'Exam Pins',
      desc: 'Purchase examination result-checking pins.',
      icon: GraduationCap,
      tone: 'blue',
    },
    {
      id: 'recharge' as DashboardSection,
      name: 'Recharge Cards',
      desc: 'Print recharge vouchers for your business.',
      icon: ReceiptText,
      tone: 'amber',
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* 1. Greeting & Welcome Banner */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/30 p-6 sm:p-8">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />
        
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-bold tracking-wide">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>SUBPLUG FINTECH HUB</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
              {getGreeting()}, {displayName}
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Manage your airtime, data, bills and digital services from one place.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onFundWallet}
              className="px-5 py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-emerald-500/10 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <Plus className="h-4 w-4" />
              <span>Fund Wallet</span>
            </button>
            <button
              onClick={() => onNavigate('transactions')}
              className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-600 text-white font-semibold text-xs sm:text-sm transition-all cursor-pointer"
            >
              Transactions
            </button>
          </div>
        </div>
      </section>

      {/* 2. Dual Wallet Summary: Main Cash Wallet & Bonus Wallet */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Main Wallet Card */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 flex flex-col justify-between relative overflow-hidden shadow-sm">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Wallet className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                    Main Wallet
                  </div>
                  <div className="text-[11px] text-slate-500">Real User Available Funds</div>
                </div>
              </div>
              <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                Primary
              </span>
            </div>

            <div className="pt-2">
              <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono tracking-tight tabular-nums">
                ₦0.00
              </div>
              <div className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                <span>Daily Limit: ₦50,000</span>
                <span>·</span>
                <span className="text-slate-500">Automated Funding: Locked 🔒</span>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800/80 mt-6 flex items-center gap-3">
            <button
              onClick={onFundWallet}
              className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Fund Wallet</span>
            </button>
            <button
              onClick={() => onNavigate('wallet')}
              className="flex-1 py-2.5 px-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
            >
              <span>View Wallet</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Bonus Wallet Card */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 flex flex-col justify-between relative overflow-hidden shadow-sm">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                  <Gift className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                    Bonus Wallet
                  </div>
                  <div className="text-[11px] text-slate-500">Referrals & Purchase Cashback</div>
                </div>
              </div>
              <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                Rewards
              </span>
            </div>

            <div className="pt-2">
              <div className="text-3xl sm:text-4xl font-extrabold text-amber-400 font-mono tracking-tight tabular-nums">
                ₦0.00
              </div>
              <div className="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-slate-800/60 text-[11px]">
                <div>
                  <span className="text-slate-500 block text-[10px]">Referral Bonus</span>
                  <span className="font-mono text-slate-300 font-bold">₦0.00</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Cashback</span>
                  <span className="font-mono text-slate-300 font-bold">₦0.00</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Total Earned</span>
                  <span className="font-mono text-white font-bold">₦0.00</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800/80 mt-6 flex items-center gap-3">
            <button
              onClick={() => onNavigate('bonus-wallet')}
              className="flex-1 py-2.5 px-3 rounded-xl bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 border border-amber-400/20 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>View Bonus Wallet</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => onNavigate('referral')}
              className="flex-1 py-2.5 px-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
            >
              <Share2 className="h-3.5 w-3.5 text-slate-400" />
              <span>Referral Centre</span>
            </button>
          </div>
        </div>
      </section>

      {/* 3. Quick Actions Grid */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 font-mono">
            Quick Actions
          </h2>
          <span className="text-xs text-slate-500">1-click service access</span>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-9 gap-2.5">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.label}
                onClick={() => onNavigate(action.id)}
                className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 hover:bg-slate-800/80 active:scale-95 transition-all text-center group cursor-pointer"
              >
                <div className="h-9 w-9 rounded-xl bg-slate-950 border border-slate-800 group-hover:border-emerald-500/30 flex items-center justify-center text-slate-300 group-hover:text-emerald-300 transition-colors">
                  <Icon className="h-4 w-4" />
                </div>
                <span className="text-[11px] font-semibold text-slate-300 group-hover:text-white mt-2 leading-tight">
                  {action.label}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 4. Complete Service Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Telecom & Payment Services
            </h2>
            <p className="text-xs text-slate-400">All automated VTU and digital utilities</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {serviceGrid.map((svc) => {
            const Icon = svc.icon;
            return (
              <button
                key={svc.id}
                onClick={() => onNavigate(svc.id)}
                className="flex items-start gap-4 p-5 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 hover:bg-slate-900 transition-all text-left group cursor-pointer"
              >
                <div className="h-11 w-11 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-emerald-400 shrink-0 group-hover:scale-105 transition-transform">
                  <Icon className="h-5 w-5" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                      {svc.name}
                    </span>
                    {svc.badge && (
                      <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-bold">
                        {svc.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {svc.desc}
                  </p>
                </div>

                <ChevronRight className="h-4 w-4 text-slate-600 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all self-center shrink-0" />
              </button>
            );
          })}
        </div>
      </section>

      {/* 5. Business Promotion Cards & Referral Banner */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Card 1: Become a Reseller */}
        <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 to-amber-950/20 p-6 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400 font-mono">
              <TrendingUp className="h-4 w-4" />
              <span>Reseller Franchise</span>
            </div>
            <h3 className="text-lg font-bold text-white">Become a Reseller</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Buy at better rates and grow your digital services business with wholesale discounts.
            </p>
          </div>
          <button
            onClick={() => onNavigate('reseller')}
            className="w-full py-2.5 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Become a Reseller</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Card 2: Bulk SMS */}
        <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 to-emerald-950/20 p-6 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400 font-mono">
              <MessageSquare className="h-4 w-4" />
              <span>Enterprise Delivery</span>
            </div>
            <h3 className="text-lg font-bold text-white">Bulk SMS Marketing</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Reach your customers, promote your business and send important updates at scale.
            </p>
          </div>
          <button
            onClick={() => onNavigate('bulk-sms')}
            className="w-full py-2.5 px-4 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Send Bulk SMS</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Card 3: Developer API */}
        <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 to-cyan-950/20 p-6 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-400 font-mono">
              <Code2 className="h-4 w-4" />
              <span>Sub-Second Switch</span>
            </div>
            <h3 className="text-lg font-bold text-white">Developer API</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Build your own VTU platform using the SUBPLUG automated API and webhooks.
            </p>
          </div>
          <button
            onClick={() => onNavigate('api')}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors border border-slate-700 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Explore API</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </section>

      {/* 6. Referral Promotional Banner */}
      <section className="rounded-3xl border border-emerald-500/30 bg-gradient-to-r from-slate-900 via-emerald-950/40 to-slate-900 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-lg shadow-emerald-500/5">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider font-mono">
            <Sparkles className="h-4 w-4" />
            <span>Earn with SUBPLUG</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-white">
            Invite friends and earn recurring bonuses
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Share your unique referral link with fellow merchants, friends, and family. Earn rewards directly into your Bonus Wallet when they purchase eligible services.
          </p>
        </div>

        <button
          onClick={() => onNavigate('referral')}
          className="shrink-0 px-6 py-3 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Share2 className="h-4 w-4" />
          <span>Share My Referral Link</span>
        </button>
      </section>

      {/* 7. Recent Transactions (Clean empty state until backend integration) */}
      <section className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Recent Transactions</h3>
            <p className="text-xs text-slate-500">Live authenticated transaction records</p>
          </div>
          <button
            onClick={() => onNavigate('transactions')}
            className="text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            View all transactions →
          </button>
        </div>

        {/* Clean, authentic empty state */}
        <div className="py-12 px-4 rounded-2xl border border-dashed border-slate-800 bg-slate-950/40 text-center space-y-3">
          <div className="h-12 w-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-500">
            <Clock className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-white">No transactions yet</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Your transactions will appear here after you complete your first service purchase or wallet funding.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
