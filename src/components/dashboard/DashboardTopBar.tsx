/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Menu,
  Bell,
  Search,
  Wallet,
  User,
  ChevronDown,
  ShieldCheck,
  Plus,
  LogOut,
  ExternalLink,
} from 'lucide-react';
import { DashboardSection } from '../../types';

interface DashboardTopBarProps {
  displayName: string;
  userEmail?: string;
  onOpenMobileMenu: () => void;
  onNavigate: (section: DashboardSection) => void;
  onFundWallet: () => void;
  onSignOut: () => void;
  onExitToHome: () => void;
}

export const DashboardTopBar: React.FC<DashboardTopBarProps> = ({
  displayName,
  userEmail,
  onOpenMobileMenu,
  onNavigate,
  onFundWallet,
  onSignOut,
  onExitToHome,
}) => {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const query = searchQuery.toLowerCase().trim();
    if (query.includes('data')) onNavigate('data');
    else if (query.includes('airtime')) onNavigate('airtime');
    else if (query.includes('sms')) onNavigate('bulk-sms');
    else if (query.includes('electric') || query.includes('meter')) onNavigate('electricity');
    else if (query.includes('cable') || query.includes('dstv') || query.includes('gotv')) onNavigate('cable');
    else if (query.includes('wallet') || query.includes('fund')) onNavigate('wallet');
    else if (query.includes('voucher')) onNavigate('vouchers');
    else if (query.includes('reward') || query.includes('promo') || query.includes('cashback')) onNavigate('rewards');
    else if (query.includes('dispute') || query.includes('resolut') || query.includes('ticket')) onNavigate('resolution');
    else if (query.includes('refer') || query.includes('bonus')) onNavigate('referral');
    else if (query.includes('cms') || query.includes('partner')) onNavigate('admin-cms');
    else if (query.includes('kyc') || query.includes('verify')) onNavigate('kyc');
    else if (query.includes('pin')) onNavigate('transaction-pin');
    else onNavigate('overview');
    setSearchQuery('');
  };

  const initialLetter = (displayName || 'U').charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b border-slate-800/80 bg-slate-950/90 px-4 sm:px-6 lg:px-8 backdrop-blur-md">
      {/* Left: Mobile Menu & Search */}
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800/80 transition-colors cursor-pointer"
          aria-label="Open sidebar navigation"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Global Quick Search Form */}
        <form onSubmit={handleSearchSubmit} className="relative w-full max-w-xs hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search services (Data, Airtime, SMS)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900/90 border border-slate-800/90 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/80 focus:ring-1 focus:ring-emerald-500/20 transition-all font-sans"
          />
        </form>
      </div>

      {/* Right: Wallet Balance, Notifications & User Avatar */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Wallet Balance Pill */}
        <div className="flex items-center gap-2 bg-slate-900/80 border border-slate-800 px-3 py-1.5 rounded-xl text-xs">
          <div className="flex items-center gap-1.5 text-slate-400">
            <Wallet className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
            <span className="hidden md:inline font-mono text-[11px] uppercase tracking-wider text-slate-400">
              Balance:
            </span>
          </div>
          <span className="font-mono font-bold text-white text-xs tabular-nums">
            ₦0.00
          </span>
          <button
            onClick={onFundWallet}
            className="ml-1 px-2 py-0.5 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-slate-950 text-[10px] font-extrabold uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-0.5"
            title="Fund your wallet"
          >
            <Plus className="h-3 w-3" />
            <span className="hidden sm:inline">Fund</span>
          </button>
        </div>

        {/* Notification Bell */}
        <button
          onClick={() => onNavigate('notifications')}
          className="relative p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800 transition-colors cursor-pointer"
          aria-label="View notifications"
          title="Notifications"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
          </span>
        </button>

        {/* User Profile Dropdown Menu */}
        <div className="relative">
          <button
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center gap-2 p-1.5 sm:px-2 sm:py-1 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer"
            aria-label="User account menu"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-400 text-slate-950 font-bold text-xs shadow-sm">
              {initialLetter}
            </div>
            <span className="hidden md:block text-xs font-semibold text-slate-200 max-w-[100px] truncate">
              {displayName}
            </span>
            <ChevronDown className="h-3 w-3 text-slate-500 hidden md:block" />
          </button>

          {/* Profile Dropdown */}
          {profileDropdownOpen && (
            <div
              className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-800 bg-slate-950 p-2 shadow-2xl text-xs space-y-1 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
              onMouseLeave={() => setProfileDropdownOpen(false)}
            >
              <div className="px-3 py-2 border-b border-slate-800/80">
                <div className="font-bold text-white truncate">{displayName}</div>
                {userEmail && <div className="text-[11px] text-slate-400 truncate">{userEmail}</div>}
                <div className="mt-1 flex items-center gap-1 text-[10px] font-mono text-emerald-400">
                  <ShieldCheck className="h-3 w-3" />
                  <span>Authenticated Customer</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setProfileDropdownOpen(false);
                  onNavigate('profile');
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-slate-300 hover:bg-slate-900 hover:text-white transition-colors cursor-pointer text-left"
              >
                <User className="h-3.5 w-3.5 text-slate-400" />
                <span>My Profile</span>
              </button>

              <button
                onClick={() => {
                  setProfileDropdownOpen(false);
                  onNavigate('kyc');
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-slate-300 hover:bg-slate-900 hover:text-white transition-colors cursor-pointer text-left"
              >
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                <span>KYC & Verification</span>
              </button>

              <button
                onClick={() => {
                  setProfileDropdownOpen(false);
                  onExitToHome();
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-slate-300 hover:bg-slate-900 hover:text-white transition-colors cursor-pointer text-left"
              >
                <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
                <span>Return to Landing Page</span>
              </button>

              <div className="pt-1 border-t border-slate-800/80">
                <button
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    onSignOut();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-rose-300 hover:bg-rose-500/10 hover:text-rose-200 transition-colors cursor-pointer text-left font-semibold"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
