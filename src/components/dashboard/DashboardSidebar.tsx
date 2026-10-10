/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  LayoutDashboard,
  Wallet,
  Activity,
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
  ShoppingBag,
  Gift,
  Share2,
  Percent,
  UserRound,
  ShieldCheck,
  KeyRound,
  Bell,
  Lock,
  HelpCircle,
  LogOut,
  X,
  ExternalLink,
  Globe,
  Ticket,
  LifeBuoy,
  Sparkles,
} from 'lucide-react';
import { SubplugLogo } from '../SubplugLogo';
import { SocialIcon } from '../SocialIcons';
import { SUBPLUG_SOCIAL_LINKS } from '../../data/socialLinks';
import { DashboardSection } from '../../types';

interface DashboardSidebarProps {
  currentSection: DashboardSection;
  onNavigate: (section: DashboardSection) => void;
  onExitToHome: () => void;
  onSignOut: () => void;
  onOpenHelp: () => void;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

interface NavItem {
  id: DashboardSection;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeTone?: 'cyan' | 'emerald' | 'amber';
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

export const SIDEBAR_NAV_GROUPS: NavGroup[] = [
  {
    title: 'Main',
    items: [
      { id: 'overview', label: 'Overview', icon: LayoutDashboard },
      { id: 'wallet', label: 'Wallet', icon: Wallet },
      { id: 'transactions', label: 'Transactions', icon: Activity },
    ],
  },
  {
    title: 'Services',
    items: [
      { id: 'airtime', label: 'Airtime', icon: Smartphone },
      { id: 'data', label: 'Data', icon: Wifi, badge: 'Cheapest', badgeTone: 'cyan' },
      { id: 'electricity', label: 'Electricity', icon: Zap },
      { id: 'cable', label: 'Cable TV', icon: Cable },
      { id: 'bulk-sms', label: 'Bulk SMS', icon: MessageSquare, badge: 'New', badgeTone: 'emerald' },
      { id: 'airtime-cash', label: 'Airtime to Cash', icon: ArrowLeftRight },
      { id: 'data-pins', label: 'Data Pins', icon: CreditCard },
      { id: 'exam-pins', label: 'Exam Pins', icon: GraduationCap },
      { id: 'recharge', label: 'Recharge Cards', icon: ReceiptText },
    ],
  },
  {
    title: 'Business',
    items: [
      { id: 'reseller', label: 'Become Reseller', icon: Users, badge: 'Earn', badgeTone: 'amber' },
      { id: 'api', label: 'Developer API', icon: Code2 },
      { id: 'store', label: 'Store', icon: ShoppingBag },
    ],
  },
  {
    title: 'Rewards',
    items: [
      { id: 'rewards', label: 'Rewards Suite', icon: Gift, badge: 'New', badgeTone: 'emerald' },
      { id: 'points', label: 'SUBPLUG Points', icon: Sparkles, badge: 'Soon', badgeTone: 'amber' },
      { id: 'vouchers', label: 'Redeem Voucher', icon: Ticket, badge: 'Fund', badgeTone: 'cyan' },
      { id: 'bonus-wallet', label: 'Bonus Wallet', icon: Gift },
      { id: 'referral', label: 'Referral Centre', icon: Share2 },
      { id: 'cashback', label: 'Cashback', icon: Percent },
    ],
  },
  {
    title: 'Support',
    items: [
      { id: 'resolution', label: 'Resolution Center', icon: LifeBuoy, badge: 'Desk', badgeTone: 'cyan' },
    ],
  },
  {
    title: 'Account',
    items: [
      { id: 'profile', label: 'Profile', icon: UserRound },
      { id: 'kyc', label: 'KYC & Verification', icon: ShieldCheck },
      { id: 'transaction-pin', label: 'Transaction PIN', icon: KeyRound },
      { id: 'notifications', label: 'Notifications', icon: Bell },
      { id: 'security', label: 'Security', icon: Lock },
    ],
  },
  {
    title: 'Admin Management',
    items: [
      { id: 'admin-cms', label: 'Landing Page CMS', icon: Globe, badge: 'CMS', badgeTone: 'cyan' },
      { id: 'admin-partners', label: 'Our Partners CMS', icon: Globe },
      { id: 'admin-rewards', label: 'Admin Rewards & Vouchers', icon: Gift, badge: 'Admin', badgeTone: 'amber' },
      { id: 'admin-resolution', label: 'Admin Dispute Desk', icon: LifeBuoy },
    ],
  },
];

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  currentSection,
  onNavigate,
  onExitToHome,
  onSignOut,
  onOpenHelp,
  mobileOpen = false,
  onCloseMobile,
}) => {
  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm lg:hidden animate-in fade-in duration-200"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 flex flex-col border-r border-slate-800/80 bg-slate-950 text-slate-200 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Brand Header */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-800/80 px-5">
          <button
            onClick={onExitToHome}
            className="flex items-center gap-2 group focus:outline-none cursor-pointer"
            title="Return to SUBPLUG Public Home"
          >
            <SubplugLogo size="sm" showGlow={false} />
            <div className="flex flex-col text-left">
              <span className="text-[10px] font-mono tracking-widest uppercase text-emerald-400 font-bold">
                Fintech Portal
              </span>
            </div>
          </button>

          {/* Close button for mobile drawer */}
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 transition-colors cursor-pointer"
            aria-label="Close navigation"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Item Scrollable Area */}
        <nav
          className="flex-1 overflow-y-auto px-3 py-4 space-y-6 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent"
          aria-label="Dashboard navigation"
        >
          {SIDEBAR_NAV_GROUPS.map((group) => (
            <div key={group.title} className="space-y-1">
              <div className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">
                {group.title}
              </div>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentSection === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onNavigate(item.id);
                        if (onCloseMobile) onCloseMobile();
                      }}
                      className={`group relative flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold transition-all duration-150 cursor-pointer ${
                        isActive
                          ? 'bg-emerald-400/10 text-emerald-300 font-bold border border-emerald-400/25 shadow-sm shadow-emerald-500/10'
                          : 'text-slate-400 hover:bg-slate-900/80 hover:text-white border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <Icon
                          className={`h-4 w-4 shrink-0 transition-colors ${
                            isActive
                              ? 'text-emerald-300'
                              : 'text-slate-500 group-hover:text-slate-300'
                          }`}
                        />
                        <span className="truncate">{item.label}</span>
                      </div>

                      {item.badge && (
                        <span
                          className={`text-[9px] font-mono px-1.5 py-0.5 rounded-md font-bold uppercase ${
                            item.badgeTone === 'cyan'
                              ? 'bg-cyan-400/10 text-cyan-300 border border-cyan-400/20'
                              : item.badgeTone === 'amber'
                              ? 'bg-amber-400/10 text-amber-300 border border-amber-400/20'
                              : 'bg-emerald-400/10 text-emerald-300 border border-emerald-400/20'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}

                      {/* Active indicator dot */}
                      {isActive && (
                        <span className="absolute left-1 top-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Sidebar Footer Area */}
        <div className="shrink-0 border-t border-slate-800/80 p-3 bg-slate-950/90 space-y-3">
          {/* Follow SUBPLUG Section */}
          <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-2.5 space-y-2">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1 font-mono flex items-center justify-between">
              <span>Follow SUBPLUG</span>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </div>

            <div className="grid grid-cols-4 gap-1.5">
              {SUBPLUG_SOCIAL_LINKS.map((social) => (
                <a
                  key={social.id}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center h-8 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 hover:bg-slate-800/80 transition-all cursor-pointer group"
                  aria-label={`Follow SUBPLUG on ${social.name}`}
                  title={`${social.name}: ${social.handle}`}
                >
                  <SocialIcon
                    name={social.id}
                    className="h-3.5 w-3.5 transition-transform group-hover:scale-110"
                  />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Help & Logout */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={onOpenHelp}
              className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl border border-slate-800 bg-slate-900/60 text-slate-300 hover:text-white hover:bg-slate-900 text-xs font-semibold transition-colors cursor-pointer"
            >
              <HelpCircle className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
              <span>Help</span>
            </button>

            <button
              onClick={onSignOut}
              className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl border border-rose-500/20 bg-rose-500/5 text-rose-300 hover:bg-rose-500/10 hover:text-rose-200 text-xs font-semibold transition-colors cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5 shrink-0" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
