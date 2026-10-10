/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  LayoutDashboard,
  Grid,
  Wallet,
  Activity,
  Menu,
} from 'lucide-react';
import { DashboardSection } from '../../types';

interface DashboardMobileNavProps {
  currentSection: DashboardSection;
  onNavigate: (section: DashboardSection) => void;
  onOpenMoreDrawer: () => void;
}

export const DashboardMobileNav: React.FC<DashboardMobileNavProps> = ({
  currentSection,
  onNavigate,
  onOpenMoreDrawer,
}) => {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 lg:hidden border-t border-slate-800 bg-slate-950/95 backdrop-blur-md pb-safe"
      aria-label="Mobile Bottom Navigation"
    >
      <div className="grid grid-cols-5 items-center h-16 px-1 max-w-md mx-auto">
        {/* 1. Home / Overview */}
        <button
          onClick={() => onNavigate('overview')}
          className={`flex flex-col items-center justify-center h-12 rounded-xl transition-all cursor-pointer ${
            currentSection === 'overview'
              ? 'text-emerald-400 font-bold'
              : 'text-slate-400 hover:text-white'
          }`}
          aria-label="Overview"
        >
          <LayoutDashboard className="h-5 w-5" />
          <span className="text-[10px] font-medium mt-1">Home</span>
        </button>

        {/* 2. Services Grid */}
        <button
          onClick={() => onNavigate('data')}
          className={`flex flex-col items-center justify-center h-12 rounded-xl transition-all cursor-pointer ${
            [
              'data',
              'airtime',
              'electricity',
              'cable',
              'bulk-sms',
              'airtime-cash',
              'data-pins',
              'exam-pins',
              'recharge',
            ].includes(currentSection)
              ? 'text-emerald-400 font-bold'
              : 'text-slate-400 hover:text-white'
          }`}
          aria-label="Services"
        >
          <Grid className="h-5 w-5" />
          <span className="text-[10px] font-medium mt-1">Services</span>
        </button>

        {/* 3. Wallet */}
        <button
          onClick={() => onNavigate('wallet')}
          className={`flex flex-col items-center justify-center h-12 rounded-xl transition-all cursor-pointer ${
            currentSection === 'wallet' || currentSection === 'bonus-wallet'
              ? 'text-emerald-400 font-bold'
              : 'text-slate-400 hover:text-white'
          }`}
          aria-label="Wallet"
        >
          <Wallet className="h-5 w-5" />
          <span className="text-[10px] font-medium mt-1">Wallet</span>
        </button>

        {/* 4. Transactions */}
        <button
          onClick={() => onNavigate('transactions')}
          className={`flex flex-col items-center justify-center h-12 rounded-xl transition-all cursor-pointer ${
            currentSection === 'transactions'
              ? 'text-emerald-400 font-bold'
              : 'text-slate-400 hover:text-white'
          }`}
          aria-label="Transactions"
        >
          <Activity className="h-5 w-5" />
          <span className="text-[10px] font-medium mt-1">History</span>
        </button>

        {/* 5. More (Opens Full Drawer) */}
        <button
          onClick={onOpenMoreDrawer}
          className="flex flex-col items-center justify-center h-12 rounded-xl text-slate-400 hover:text-emerald-400 transition-all cursor-pointer"
          aria-label="Open More Menu"
        >
          <Menu className="h-5 w-5" />
          <span className="text-[10px] font-medium mt-1">More</span>
        </button>
      </div>
    </nav>
  );
};
