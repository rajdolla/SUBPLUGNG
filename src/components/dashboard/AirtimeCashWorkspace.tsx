/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  ArrowLeftRight,
  ShieldCheck,
  Lock,
  CheckCircle2,
  AlertCircle,
  Building2,
  ArrowRight,
  Info,
} from 'lucide-react';
import { DashboardSection, KycStatus, NetworkProvider } from '../../types';

interface AirtimeCashWorkspaceProps {
  kycStatus: KycStatus;
  onNavigate: (section: DashboardSection) => void;
}

export const AirtimeCashWorkspace: React.FC<AirtimeCashWorkspaceProps> = ({
  kycStatus,
  onNavigate,
}) => {
  const [network, setNetwork] = useState<NetworkProvider>('MTN');
  const [airtimeAmount, setAirtimeAmount] = useState('5000');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [bankName, setBankName] = useState('Access Bank');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');

  const isVerified = kycStatus === 'verified';

  // Calculate estimated cash return rate (80% for MTN/Airtel, 75% for Glo/9mobile)
  const rate = network === 'MTN' || network === 'Airtel' ? 0.82 : 0.75;
  const numAmount = parseFloat(airtimeAmount) || 0;
  const cashReturn = numAmount * rate;

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* 1. Header Banner */}
      <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-rose-950/20 p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-mono font-bold tracking-wide">
            <ArrowLeftRight className="h-3.5 w-3.5" />
            <span>LIQUIDITY CONVERSION CHANNEL</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Airtime to Cash
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Convert excess prepaid phone balance into cash deposited directly into your Nigerian bank account.
          </p>
        </div>

        {/* Security Rule Badge */}
        <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs space-y-1 shrink-0">
          <div className="flex items-center gap-1.5 font-bold text-slate-200">
            <ShieldCheck className="h-4 w-4 text-rose-400" />
            <span>Security Requirement</span>
          </div>
          <div className="text-[11px] text-slate-400">
            Requires KYC Verification (No PIN needed)
          </div>
        </div>
      </div>

      {/* 2. KYC Verification Gate Check */}
      {!isVerified ? (
        <div className="rounded-3xl border border-amber-500/30 bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/30 p-8 text-center space-y-5 max-w-2xl mx-auto shadow-xl">
          <div className="h-14 w-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto">
            <Lock className="h-7 w-7" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 font-mono">
              Access Restricted
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">
              KYC Verification Required
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-lg mx-auto">
              To protect users and comply with transaction requirements, you must complete KYC verification before using Airtime-to-Cash.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 max-w-md mx-auto text-left flex items-start gap-2.5">
            <Info className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
            <span>
              <strong>Note:</strong> Airtime to Cash transactions do not require a Transaction PIN once KYC verification is completed.
            </span>
          </div>

          <div className="pt-2">
            <button
              onClick={() => onNavigate('kyc')}
              className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs sm:text-sm shadow-md transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              <ShieldCheck className="h-4 w-4" />
              <span>Complete KYC</span>
            </button>
          </div>
        </div>
      ) : (
        /* Verified Conversion Workspace (NO Transaction PIN requested anywhere!) */
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 sm:p-8 space-y-6">
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>
              <strong>KYC Verified:</strong> You are eligible to use Airtime-to-Cash. Payouts are made directly to your verified bank account.
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Form Side */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Select Mobile Network
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(['MTN', 'Airtel', 'Glo', '9mobile'] as NetworkProvider[]).map((net) => (
                    <button
                      key={net}
                      type="button"
                      onClick={() => setNetwork(net)}
                      className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        network === net
                          ? 'border-rose-400 bg-rose-500/10 text-white'
                          : 'border-slate-800 bg-slate-950 text-slate-400'
                      }`}
                    >
                      {net}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Sender Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="0801 234 5678"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-white font-mono placeholder-slate-600 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Airtime Amount (₦)
                </label>
                <input
                  type="number"
                  placeholder="5000"
                  value={airtimeAmount}
                  onChange={(e) => setAirtimeAmount(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-white font-mono placeholder-slate-600 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Destination Bank
                </label>
                <input
                  type="text"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Bank Account Number
                </label>
                <input
                  type="text"
                  maxLength={10}
                  placeholder="0123456789"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-white font-mono placeholder-slate-600 focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

            {/* Payout Calculation Side */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 flex flex-col justify-between space-y-4">
              <div className="space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                  Settlement Breakdown
                </span>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Airtime Sent:</span>
                    <span className="font-mono text-white font-bold">₦{numAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Conversion Rate:</span>
                    <span className="font-mono text-rose-400 font-bold">{(rate * 100).toFixed(0)}%</span>
                  </div>
                  <div className="flex justify-between py-1 pt-2">
                    <span className="text-slate-300 font-bold">Bank Payout:</span>
                    <span className="font-mono text-emerald-400 font-bold text-lg">
                      ₦{cashReturn.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-400 space-y-1">
                  <div className="font-semibold text-slate-300">How conversion works:</div>
                  <div>1. You transfer airtime via USSD to SUBPLUG corporate server sim.</div>
                  <div>2. Payout arrives in your bank account within 3–5 minutes.</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-[10px] text-slate-500 italic">
                  *Demo only — live airtime liquidation and bank payout processing are not connected yet.
                </div>
                <button
                  disabled
                  className="w-full py-3 px-4 rounded-xl bg-slate-800 text-slate-500 font-bold text-xs cursor-not-allowed"
                >
                  Initiate Conversion (Demo Only — Payout Disabled)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
