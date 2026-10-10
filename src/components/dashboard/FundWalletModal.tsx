/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  X,
  Wallet,
  CreditCard,
  Building2,
  Lock,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';
import { DashboardSection, KycStatus } from '../../types';

interface FundWalletModalProps {
  isOpen: boolean;
  kycStatus: KycStatus;
  onClose: () => void;
  onNavigateToKyc: () => void;
}

export const FundWalletModal: React.FC<FundWalletModalProps> = ({
  isOpen,
  kycStatus,
  onClose,
  onNavigateToKyc,
}) => {
  if (!isOpen) return null;

  const isVerified = kycStatus === 'verified';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900 p-6 sm:p-7 space-y-5 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          aria-label="Close funding modal"
        >
          <X className="h-4 w-4" />
        </button>

        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-bold mb-2">
            <Wallet className="h-3.5 w-3.5" />
            <span>WALLET FUNDING GATEWAY</span>
          </div>
          <h3 className="text-xl font-bold text-white">Fund Main Cash Wallet</h3>
          <p className="text-xs text-slate-400 mt-1">
            Choose your preferred payment method to credit your available cash balance.
          </p>
        </div>

        <div className="space-y-3">
          {/* Automated Dedicated Virtual Account - Clear Locked State */}
          <div className="p-4 rounded-2xl border border-slate-800 bg-slate-950/70 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-slate-800 text-slate-400 flex items-center justify-center">
                  <Building2 className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>Automated Virtual Bank Transfer</span>
                    <span className="text-[10px] text-amber-400 font-mono flex items-center gap-0.5">
                      <Lock className="h-3 w-3" /> Locked
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Automated wallet funding will be available after secure backend integration.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
              <p className="leading-relaxed">
                Automated wallet funding will be available after secure backend integration. No live bank account is assigned to this demonstration session.
              </p>
            </div>
          </div>

          {/* Card / Gateway Payment Option */}
          <div className="p-4 rounded-2xl border border-slate-800 bg-slate-950/70 space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-slate-800 text-slate-400 flex items-center justify-center">
                <CreditCard className="h-4 w-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>Debit Card / Gateway Checkout</span>
                  <span className="text-[10px] text-slate-500 font-mono">Inactive</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Card processing requires backend merchant payment gateway integration.
                </p>
              </div>
            </div>

            <button
              disabled
              className="w-full py-2 px-3 rounded-xl bg-slate-800 text-slate-500 font-bold text-xs cursor-not-allowed"
            >
              Payment Gateways Disconnected (Demo Mode)
            </button>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-[11px] text-slate-500 flex items-start gap-2">
          <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
          <span>
            Payment credentials and wallet mutations must be verified server-side. This browser UI never collects raw card numbers.
          </span>
        </div>
      </div>
    </div>
  );
};
