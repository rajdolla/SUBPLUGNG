/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Share2,
  Copy,
  Check,
  Users,
  Gift,
  Sparkles,
  Clock,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { SocialIcon } from '../SocialIcons';
import { DashboardSection } from '../../types';

interface ReferralWorkspaceProps {
  userReferralCode?: string;
  onNavigate?: (section: DashboardSection) => void;
}

export const ReferralWorkspace: React.FC<ReferralWorkspaceProps> = ({
  userReferralCode = 'SUBPLUG',
  onNavigate,
}) => {
  const [copied, setCopied] = useState(false);

  // Derive genuine referral share link
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://subplug.ng';
  const referralLink = `${origin}/?ref=${encodeURIComponent(userReferralCode)}`;

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const shareText = `Join SUBPLUG for the fastest, cheapest data, airtime, and electricity top-ups in Nigeria! Register with my link: ${referralLink}`;

  const handleNativeShare = () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator.share({
        title: 'Join SUBPLUG Telecom Platform',
        text: 'Save big on Nigerian SME data, airtime, and utility bill top-ups.',
        url: referralLink,
      }).catch(() => {});
    } else {
      handleCopyLink();
    }
  };

  const socialShareChannels = [
    {
      id: 'whatsapp' as const,
      name: 'WhatsApp',
      url: `https://wa.me/?text=${encodeURIComponent(shareText)}`,
      color: 'hover:bg-[#25D366]/20 hover:text-[#25D366] hover:border-[#25D366]/50',
    },
    {
      id: 'telegram' as const,
      name: 'Telegram',
      url: `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(shareText)}`,
      color: 'hover:bg-[#0088CC]/20 hover:text-[#0088CC] hover:border-[#0088CC]/50',
    },
    {
      id: 'x' as const,
      name: 'X (Twitter)',
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`,
      color: 'hover:bg-slate-800 hover:text-white hover:border-slate-600',
    },
    {
      id: 'facebook' as const,
      name: 'Facebook',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`,
      color: 'hover:bg-[#1877F2]/20 hover:text-[#1877F2] hover:border-[#1877F2]/50',
    },
    {
      id: 'email' as const,
      name: 'Email',
      url: `mailto:?subject=${encodeURIComponent('Join me on SUBPLUG')}&body=${encodeURIComponent(shareText)}`,
      color: 'hover:bg-slate-800 hover:text-white hover:border-slate-600',
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* 1. Header Banner */}
      <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/30 p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-mono font-bold tracking-wide">
            <Share2 className="h-3.5 w-3.5" />
            <span>COMMUNITY PARTNERSHIP PROGRAMME</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Referral Centre
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Invite your colleagues, family, and campus community. When your referrals complete eligible transactions, commissions credit directly into your Bonus Wallet.
          </p>
        </div>

        <button
          onClick={handleCopyLink}
          className="px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer shrink-0"
        >
          {copied ? <Check className="h-4 w-4 text-emerald-950" /> : <Copy className="h-4 w-4" />}
          <span>{copied ? 'Referral Link Copied!' : 'Copy Referral Link'}</span>
        </button>
      </div>

      {/* 2. Referral Statistics (Safe zero/empty state) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="rounded-3xl border border-amber-500/30 bg-slate-900/90 p-6 space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
            Referral Bonus Balance
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold text-amber-400 font-mono tabular-nums">
            ₦0.00
          </div>
          <div className="text-[11px] text-slate-500">
            Available in Bonus Wallet
          </div>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
            Total Referral Earnings
          </div>
          <div className="text-3xl font-extrabold text-white font-mono tabular-nums">
            ₦0.00
          </div>
          <div className="text-[11px] text-slate-500">
            Cumulative referral rewards
          </div>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
            Total Referrals
          </div>
          <div className="text-3xl font-extrabold text-white font-mono tabular-nums">
            0
          </div>
          <div className="text-[11px] text-slate-500">
            Registered with your link
          </div>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
            Active Referrals
          </div>
          <div className="text-3xl font-extrabold text-emerald-400 font-mono tabular-nums">
            0
          </div>
          <div className="text-[11px] text-slate-500">
            Transacting members
          </div>
        </div>
      </div>

      {/* 3. User Referral Link Card */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 sm:p-7 space-y-4">
        <div>
          <h2 className="text-base font-bold text-white">Your Unique Referral Link</h2>
          <p className="text-xs text-slate-400 mt-1">
            Share this link to automatically attribute new customer registrations to your account.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="flex-1 rounded-xl bg-slate-950 border border-slate-800 px-4 py-3 text-xs sm:text-sm font-mono text-emerald-400 select-all truncate">
            {referralLink}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleCopyLink}
              className="flex-1 sm:flex-initial px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>

            {typeof navigator !== 'undefined' && 'share' in navigator && (
              <button
                onClick={handleNativeShare}
                className="px-4 py-3 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Share2 className="h-4 w-4" />
                <span>Share</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 4. Social Sharing Section */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 sm:p-7 space-y-4">
        <div>
          <h2 className="text-base font-bold text-white">Share SUBPLUG</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Invite your friends and grow your rewards across your favorite social channels.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {socialShareChannels.map((channel) => (
            <a
              key={channel.id}
              href={channel.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center justify-center gap-2.5 p-3 rounded-2xl bg-slate-950 border border-slate-800 text-slate-300 font-semibold text-xs transition-all cursor-pointer group ${channel.color}`}
            >
              <SocialIcon name={channel.id} className="h-4 w-4 shrink-0 transition-transform group-hover:scale-110" />
              <span>{channel.name}</span>
            </a>
          ))}
        </div>
      </div>

      {/* 5. Promotional Campaign Banner */}
      <div className="rounded-3xl border border-amber-500/30 bg-gradient-to-r from-slate-900 via-amber-950/30 to-slate-900 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider font-mono">
            <Sparkles className="h-4 w-4" />
            <span>Earn with SUBPLUG</span>
          </div>
          <h3 className="text-xl font-bold text-white">
            Invite friends and earn bonuses on every recharge
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Whenever a referred customer tops up eligible data bundles or bills, your account automatically accumulates referral bonuses.
          </p>
        </div>

        <button
          onClick={handleCopyLink}
          className="shrink-0 px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Share2 className="h-4 w-4" />
          <span>Share My Referral Link</span>
        </button>
      </div>

      {/* 6. Referral Bonus History (Clean Empty State) */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Referral History</h3>
            <p className="text-xs text-slate-500">Record of referral registrations and commission payouts</p>
          </div>
          <span className="text-xs text-slate-500 font-mono">0 activities</span>
        </div>

        <div className="py-12 px-4 rounded-2xl border border-dashed border-slate-800 bg-slate-950/40 text-center space-y-3">
          <div className="h-12 w-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-500">
            <Clock className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-white">No bonus activity yet</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Your referral rewards and cashback will appear here as your invited network transacts.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
