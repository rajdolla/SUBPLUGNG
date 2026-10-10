/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo, useState } from 'react';
import {
  Activity,
  ArrowUpRight,
  Bell,
  CheckCircle2,
  Code2,
  Copy,
  ExternalLink,
  FileText,
  KeyRound,
  Lock,
  MessageCircle,
  Package,
  ReceiptText,
  ShieldCheck,
  ShoppingBag,
  TrendingUp,
  UserRound,
  Users,
  Wallet,
  Clock,
  X,
  Check,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { DashboardSection, KycStatus, KycLevel } from '../types';
import { DashboardSidebar } from '../components/dashboard/DashboardSidebar';
import { DashboardTopBar } from '../components/dashboard/DashboardTopBar';
import { DashboardMobileNav } from '../components/dashboard/DashboardMobileNav';
import { OverviewWorkspace } from '../components/dashboard/OverviewWorkspace';
import { WalletWorkspace } from '../components/dashboard/WalletWorkspace';
import { BonusWalletWorkspace } from '../components/dashboard/BonusWalletWorkspace';
import { CashbackWorkspace } from '../components/dashboard/CashbackWorkspace';
import { ReferralWorkspace } from '../components/dashboard/ReferralWorkspace';
import { BulkSmsWorkspace } from '../components/dashboard/BulkSmsWorkspace';
import { KycWorkspace } from '../components/dashboard/KycWorkspace';
import { TransactionPinWorkspace } from '../components/dashboard/TransactionPinWorkspace';
import { AirtimeCashWorkspace } from '../components/dashboard/AirtimeCashWorkspace';
import { ServiceWorkspace } from '../components/dashboard/ServiceWorkspace';
import { FundWalletModal } from '../components/dashboard/FundWalletModal';
import { AdminPartnersWorkspace } from '../components/dashboard/AdminPartnersWorkspace';
import { RewardsWorkspace } from '../components/dashboard/RewardsWorkspace';
import { ResolutionWorkspace } from '../components/dashboard/ResolutionWorkspace';
import { AdminCmsWorkspace } from '../components/dashboard/AdminCmsWorkspace';
import { AdminRewardsWorkspace } from '../components/dashboard/AdminRewardsWorkspace';
import { AdminResolutionWorkspace } from '../components/dashboard/AdminResolutionWorkspace';
import { STORE_PRODUCTS } from '../data/mockData';

type DashboardPageProps = {
  onExit: () => void;
};

export const DashboardPage: React.FC<DashboardPageProps> = ({ onExit }) => {
  const { user, loading, configured, signOut } = useAuth();
  const [section, setSection] = useState<DashboardSection>('overview');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showFundModal, setShowFundModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);

  // Frontend KYC and PIN state architecture (prepared for backend integration)
  const [kycStatus, setKycStatus] = useState<KycStatus>('not_started');
  const [kycLevel, setKycLevel] = useState<KycLevel>(0);
  const [pinSet, setPinSet] = useState(false);

  const displayName = useMemo(() => {
    const name = user?.user_metadata?.full_name;
    if (typeof name === 'string' && name.trim()) {
      return name.trim();
    }
    return user?.email?.split('@')[0] || 'Partner';
  }, [user]);

  const referralCode = useMemo(() => {
    const code = user?.user_metadata?.referral_code;
    if (typeof code === 'string' && code.trim()) {
      return code.trim().toUpperCase();
    }
    return 'SUB' + (user?.id ? user.id.slice(0, 5).toUpperCase() : '782');
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    onExit();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <div className="mx-auto h-10 w-10 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin" />
          <p className="text-xs text-slate-400 font-mono">Verifying secure customer session…</p>
        </div>
      </div>
    );
  }

  if (!configured) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
        <div className="max-w-md w-full rounded-3xl border border-amber-400/20 bg-slate-900 p-8 shadow-2xl space-y-4">
          <div className="h-12 w-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300 flex items-center justify-center">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold">Authentication setup required</h1>
          <p className="text-xs text-slate-400 leading-relaxed">
            The dashboard is protected until SUBPLUG is connected to the authentication environment.
            Please configure your Supabase variables in <code className="text-emerald-300">.env.example</code>.
          </p>
          <button
            onClick={onExit}
            className="w-full rounded-xl bg-emerald-400 hover:bg-emerald-300 px-5 py-3 font-bold text-slate-950 text-xs transition-colors cursor-pointer"
          >
            Return to Landing Page
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
        <div className="max-w-md w-full rounded-3xl border border-slate-800 bg-slate-900 p-8 text-center shadow-2xl space-y-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-400/10 text-emerald-300">
            <Lock className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-bold">Dashboard access is protected</h1>
          <p className="text-xs text-slate-400 leading-relaxed">
            Please sign in to access your wallet, transactions, reseller tools, Bulk SMS, and account settings.
          </p>
          <button
            onClick={onExit}
            className="w-full rounded-xl bg-emerald-400 hover:bg-emerald-300 px-5 py-3 font-bold text-slate-950 text-xs transition-colors cursor-pointer"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  const isService = [
    'airtime',
    'data',
    'electricity',
    'cable',
    'data-pins',
    'exam-pins',
    'recharge',
  ].includes(section);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased selection:bg-emerald-500 selection:text-slate-950">
      <div className="flex flex-1 min-h-screen">
        {/* Desktop Sidebar & Mobile Slide Drawer */}
        <DashboardSidebar
          currentSection={section}
          onNavigate={(sec) => {
            setSection(sec);
            setMobileOpen(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onExitToHome={onExit}
          onSignOut={handleSignOut}
          onOpenHelp={() => setShowHelpModal(true)}
          mobileOpen={mobileOpen}
          onCloseMobile={() => setMobileOpen(false)}
        />

        {/* Main Content Viewport */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Bar */}
          <DashboardTopBar
            displayName={displayName}
            userEmail={user.email}
            onOpenMobileMenu={() => setMobileOpen(true)}
            onNavigate={(sec) => {
              setSection(sec);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onFundWallet={() => setShowFundModal(true)}
            onSignOut={handleSignOut}
            onExitToHome={onExit}
          />

          {/* Active Workspace Viewport */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full pb-24 lg:pb-8">
            {/* 1. Overview Workspace */}
            {section === 'overview' && (
              <OverviewWorkspace
                displayName={displayName}
                onNavigate={(sec) => {
                  setSection(sec);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onFundWallet={() => setShowFundModal(true)}
              />
            )}

            {/* 2. Main Wallet Workspace */}
            {section === 'wallet' && (
              <WalletWorkspace
                onNavigate={setSection}
                onOpenFundModal={() => setShowFundModal(true)}
                kycStatus={kycStatus}
              />
            )}

            {/* 3. Bonus Wallet Workspace */}
            {section === 'bonus-wallet' && (
              <BonusWalletWorkspace onNavigate={setSection} />
            )}

            {/* 4. Cashback Workspace */}
            {section === 'cashback' && (
              <CashbackWorkspace onNavigate={setSection} />
            )}

            {/* 5. Referral Centre Workspace */}
            {section === 'referral' && (
              <ReferralWorkspace
                userReferralCode={referralCode}
                onNavigate={setSection}
              />
            )}

            {/* 6. Bulk SMS Workspace */}
            {section === 'bulk-sms' && <BulkSmsWorkspace />}

            {/* 7. KYC & Verification Workspace */}
            {section === 'kyc' && (
              <KycWorkspace
                currentKycStatus={kycStatus}
                currentKycLevel={kycLevel}
                onUpdateKycStatus={(newStatus, newLevel) => {
                  setKycStatus(newStatus);
                  setKycLevel(newLevel);
                }}
              />
            )}

            {/* 8. Transaction PIN Workspace */}
            {section === 'transaction-pin' && (
              <TransactionPinWorkspace
                pinSet={pinSet}
                onPinSaved={() => setPinSet(true)}
              />
            )}

            {/* 9. Airtime to Cash Workspace (KYC Gated & NO PIN required!) */}
            {section === 'airtime-cash' && (
              <AirtimeCashWorkspace
                kycStatus={kycStatus}
                onNavigate={setSection}
              />
            )}

            {/* 10. Telecom & Utility Services with PIN authorization */}
            {isService && (
              <ServiceWorkspace section={section as any} />
            )}

            {/* 11. Transactions History */}
            {section === 'transactions' && (
              <div className="space-y-6 animate-in fade-in">
                <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 sm:p-7 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-white">Transaction History</h2>
                      <p className="text-xs text-slate-400">
                        Authenticated ledger of all purchases, top-ups, and refunds
                      </p>
                    </div>
                    <FileText className="h-5 w-5 text-slate-500" />
                  </div>

                  {/* Clean empty state (Requirement 38 & 41: no fake financial records) */}
                  <div className="py-16 px-4 rounded-2xl border border-dashed border-slate-800 bg-slate-950/40 text-center space-y-3">
                    <div className="h-12 w-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-500">
                      <Clock className="h-6 w-6" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-white">No transactions yet</h4>
                      <p className="text-xs text-slate-400 max-w-sm mx-auto">
                        Your transactions will appear here after you complete your first service purchase or wallet top-up.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 12. Reseller Centre */}
            {section === 'reseller' && (
              <div className="space-y-6 animate-in fade-in">
                <div className="rounded-3xl border border-amber-500/30 bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/30 p-6 sm:p-8 space-y-4">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-mono font-bold tracking-wide">
                    <TrendingUp className="h-3.5 w-3.5" />
                    <span>WHOLESALE PARTNERSHIP</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                    Reseller Centre
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                    Unlock primary wholesale telecom rates (MTN from ₦240/GB, Airtel from ₦248/GB), dedicated sub-second switches, and developer API credentials.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                      <span className="text-[10px] text-slate-500 font-mono uppercase block">Your Account Tier</span>
                      <span className="text-base font-bold text-white">Standard Customer</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                      <span className="text-[10px] text-slate-500 font-mono uppercase block">Reseller License</span>
                      <span className="text-base font-bold text-amber-400">₦1,500 (One-Time)</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                      <span className="text-[10px] text-slate-500 font-mono uppercase block">API Partner Tier</span>
                      <span className="text-base font-bold text-white">₦3,500 (One-Time)</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-3">
                    <h3 className="text-base font-bold text-white">Wholesale Reseller Tier</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Designed for university campus agents, cyber café operators, and kiosk owners selling directly to retail customers.
                    </p>
                    <button
                      onClick={onExit}
                      className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
                    >
                      Upgrade on Vendor Portal (₦1,500)
                    </button>
                  </div>

                  <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-3">
                    <h3 className="text-base font-bold text-white">Developer API Access</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Integrate SUBPLUG directly into your custom mobile application, website, or fintech payment gateway.
                    </p>
                    <button
                      onClick={() => setSection('api')}
                      className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors border border-slate-700 cursor-pointer"
                    >
                      Explore Developer API
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 13. Developer API Workspace */}
            {section === 'api' && (
              <div className="space-y-6 animate-in fade-in">
                <div className="rounded-3xl border border-cyan-500/30 bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/30 p-6 sm:p-8 space-y-3">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono font-bold tracking-wide">
                    <Code2 className="h-3.5 w-3.5" />
                    <span>RESTFUL API GATEWAY</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                    Developer API & Webhooks
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                    A dedicated protected workspace for API onboarding, documentation, and credential management. Secrets are generated server-side.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-3">
                    <h3 className="font-bold text-white">API Credentials</h3>
                    <p className="text-xs text-slate-400">
                      Live secrets are generated and rotated server-side. Production API keys are protected behind two-factor authorization.
                    </p>
                    <button
                      disabled
                      className="mt-3 px-4 py-2.5 rounded-xl bg-slate-800 text-slate-500 font-bold text-xs cursor-not-allowed"
                    >
                      Generate Sandbox Key (Backend Disabled)
                    </button>
                  </div>

                  <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-3">
                    <h3 className="font-bold text-white">Interactive Documentation</h3>
                    <p className="text-xs text-slate-400">
                      Inspect endpoints, request payloads, response codes, and webhook callbacks.
                    </p>
                    <button
                      onClick={onExit}
                      className="mt-3 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <span>View Vendor Documentation</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 14. Hardware Store Workspace */}
            {section === 'store' && (
              <div className="space-y-6 animate-in fade-in">
                <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-6 sm:p-8 space-y-3">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-bold tracking-wide">
                    <ShoppingBag className="h-3.5 w-3.5" />
                    <span>CERTIFIED HARDWARE MART</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                    SUBPLUG Store
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                    Order certified Android POS terminals, high-gain 4G desktop routers, portable pocket MiFi units, and thermal printing supplies with 1-year warranty.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {STORE_PRODUCTS.map((product) => (
                    <div
                      key={product.id}
                      className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 flex flex-col justify-between space-y-4"
                    >
                      <div className="space-y-2">
                        <div className="h-10 w-10 rounded-xl bg-slate-800 text-emerald-400 flex items-center justify-center">
                          <Package className="h-5 w-5" />
                        </div>
                        <span className="text-[10px] font-mono uppercase text-slate-500">{product.category}</span>
                        <h3 className="text-sm font-bold text-white">{product.title}</h3>
                        <p className="text-xs text-slate-400 line-clamp-2">{product.description}</p>
                        <div className="text-base font-extrabold text-emerald-400 font-mono pt-1">
                          ₦{product.price.toLocaleString()}
                        </div>
                      </div>

                      <button
                        onClick={onExit}
                        className="w-full py-2.5 px-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <span>Order in Store</span>
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 15. User Profile Workspace */}
            {section === 'profile' && (
              <div className="space-y-6 max-w-3xl animate-in fade-in">
                <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 sm:p-8 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-400 text-slate-950 font-black text-2xl flex items-center justify-center shadow-lg">
                      {displayName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">{displayName}</h2>
                      <p className="text-xs text-slate-400">{user.email}</p>
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400 mt-1">
                        <ShieldCheck className="h-3.5 w-3.5" />
                        <span>Authenticated Member</span>
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                      <span className="text-slate-500 text-[10px] uppercase font-mono">Full Name</span>
                      <div className="text-white font-semibold">{displayName}</div>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                      <span className="text-slate-500 text-[10px] uppercase font-mono">Email Address</span>
                      <div className="text-white font-mono">{user.email}</div>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                      <span className="text-slate-500 text-[10px] uppercase font-mono">Referral Code</span>
                      <div className="text-emerald-400 font-mono font-bold">{referralCode}</div>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                      <span className="text-slate-500 text-[10px] uppercase font-mono">Account Tier</span>
                      <div className="text-white font-semibold">Standard Customer</div>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                      <span className="text-slate-500 text-[10px] uppercase font-mono">KYC Level</span>
                      <div className="text-white font-semibold">
                        Level {kycLevel} ({kycStatus === 'verified' ? 'Verified' : 'Unverified'})
                      </div>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                      <span className="text-slate-500 text-[10px] uppercase font-mono">Transaction PIN</span>
                      <div className="text-white font-semibold">
                        {pinSet ? 'Set (Frontend Session)' : 'Not Set (Demo)'}
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 flex flex-wrap gap-3">
                    <button
                      onClick={() => setSection('kyc')}
                      className="px-4 py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
                    >
                      Manage KYC
                    </button>
                    <button
                      onClick={() => setSection('transaction-pin')}
                      className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 transition-colors cursor-pointer"
                    >
                      Manage Security PIN
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 16. Notifications Workspace */}
            {section === 'notifications' && (
              <div className="space-y-6 max-w-3xl animate-in fade-in">
                <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 sm:p-7 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-white">Notifications</h2>
                      <p className="text-xs text-slate-400">Account security, order dispatches, and bonus alerts</p>
                    </div>
                    <Bell className="h-5 w-5 text-slate-500" />
                  </div>

                  <div className="py-12 px-4 rounded-2xl border border-dashed border-slate-800 bg-slate-950/40 text-center space-y-3">
                    <div className="h-12 w-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-500">
                      <Bell className="h-6 w-6" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-white">No notifications</h4>
                      <p className="text-xs text-slate-400 max-w-sm mx-auto">
                        You're all caught up! Account updates and transaction receipts will appear here.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 17. Security Workspace */}
            {section === 'security' && (
              <div className="space-y-6 max-w-3xl animate-in fade-in">
                <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 sm:p-8 space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-white">Account Security</h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Manage authentication factors and purchase authorization settings.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-4">
                      <div className="space-y-1">
                        <h4 className="text-xs font-bold text-white">4-Digit Transaction PIN</h4>
                        <p className="text-[11px] text-slate-400">
                          Transaction PIN security will be enforced server-side when live transactions are enabled.
                        </p>
                      </div>
                      <button
                        onClick={() => setSection('transaction-pin')}
                        className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 transition-colors cursor-pointer shrink-0"
                      >
                        {pinSet ? 'Change PIN' : 'Configure PIN'}
                      </button>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-4">
                      <div className="space-y-1">
                        <h4 className="text-xs font-bold text-white">KYC Verification Status</h4>
                        <p className="text-[11px] text-slate-400">
                          Required for Airtime to Cash conversion and automated funding.
                        </p>
                      </div>
                      <button
                        onClick={() => setSection('kyc')}
                        className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 transition-colors cursor-pointer shrink-0"
                      >
                        View Verification
                      </button>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-4">
                      <div className="space-y-1">
                        <h4 className="text-xs font-bold text-white">Session Security</h4>
                        <p className="text-[11px] text-slate-400">
                          Active authenticated session: {user.email}
                        </p>
                      </div>
                      <span className="text-[11px] text-emerald-400 font-mono font-bold">
                        Encrypted
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 18. Admin Landing Page Content: Our Partners CMS */}
            {section === 'admin-partners' && (
              <AdminPartnersWorkspace />
            )}

            {/* 19. Dedicated Rewards Suite */}
            {section === 'rewards' && (
              <RewardsWorkspace
                initialTab="promos"
                onNavigateToWallet={() => setSection('wallet')}
                onNavigateToBonusWallet={() => setSection('bonus-wallet')}
              />
            )}

            {/* 19b. SUBPLUG Points Loyalty System */}
            {section === 'points' && (
              <RewardsWorkspace
                initialTab="points"
                onNavigateToWallet={() => setSection('wallet')}
                onNavigateToBonusWallet={() => setSection('bonus-wallet')}
              />
            )}

            {/* 20. Direct Voucher Redemption Funding */}
            {section === 'vouchers' && (
              <RewardsWorkspace
                initialTab="vouchers"
                onNavigateToWallet={() => setSection('wallet')}
                onNavigateToBonusWallet={() => setSection('bonus-wallet')}
              />
            )}

            {/* 21. Customer Dispute & Switch Resolution Center */}
            {section === 'resolution' && (
              <ResolutionWorkspace />
            )}

            {/* 22. Full Admin Landing Page CMS Suite */}
            {section === 'admin-cms' && (
              <AdminCmsWorkspace />
            )}

            {/* 23. Admin Rewards & Vouchers Suite */}
            {section === 'admin-rewards' && (
              <AdminRewardsWorkspace />
            )}

            {/* 24. Admin Dispute & Switch Resolution Desk */}
            {section === 'admin-resolution' && (
              <AdminResolutionWorkspace />
            )}

            {/* 25. Admin System Controls */}
            {section === 'admin-system' && (
              <AdminCmsWorkspace />
            )}
          </main>
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <DashboardMobileNav
        currentSection={section}
        onNavigate={(sec) => {
          setSection(sec);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenMoreDrawer={() => setMobileOpen(true)}
      />

      {/* Fund Wallet Modal */}
      <FundWalletModal
        isOpen={showFundModal}
        kycStatus={kycStatus}
        onClose={() => setShowFundModal(false)}
        onNavigateToKyc={() => {
          setSection('kyc');
          setShowFundModal(false);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Quick Help Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-3xl border border-slate-800 bg-slate-900 p-6 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setShowHelpModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="text-center space-y-2">
              <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                <MessageCircle className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white">SUBPLUG Support Desk</h3>
              <p className="text-xs text-slate-400">
                Need assistance with a recharge, wallet top-up, or partner inquiry?
              </p>
            </div>
            <div className="space-y-2">
              <a
                href="https://wa.me/2348101234567?text=Hello%20Subplug,%20I%20need%20support%20with%20my%20dashboard%20account"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-slate-950 font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Chat on WhatsApp Live</span>
              </a>
              <button
                onClick={() => setShowHelpModal(false)}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
