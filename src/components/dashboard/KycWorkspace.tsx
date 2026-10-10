/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  Lock,
  AlertCircle,
  FileCheck,
  Building,
  User,
  ArrowRight,
  Info,
  Clock,
} from 'lucide-react';
import { KycStatus, KycLevel } from '../../types';

interface KycWorkspaceProps {
  currentKycStatus: KycStatus;
  currentKycLevel: KycLevel;
  onUpdateKycStatus: (status: KycStatus, level: KycLevel) => void;
}

export const KycWorkspace: React.FC<KycWorkspaceProps> = ({
  currentKycStatus,
  currentKycLevel,
  onUpdateKycStatus,
}) => {
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [bvnOrNin, setBvnOrNin] = useState('');
  const [dob, setDob] = useState('');
  const [residentialAddress, setResidentialAddress] = useState('');
  const [idType, setIdType] = useState<'NIN' | 'BVN'>('NIN');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitVerification = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSubmitModal(false);
      onUpdateKycStatus('pending', 0);
    }, 1200);
  };

  const getStatusBadge = () => {
    switch (currentKycStatus) {
      case 'verified':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-bold">
            <CheckCircle2 className="h-3.5 w-3.5" /> Verified
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-mono font-bold">
            <Clock className="h-3.5 w-3.5" /> Pending Review
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-mono font-bold">
            <AlertCircle className="h-3.5 w-3.5" /> Rejected
          </span>
        );
      case 'needs_more_info':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono font-bold">
            <Info className="h-3.5 w-3.5" /> Needs Information
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-400 text-xs font-mono font-bold">
            <Lock className="h-3.5 w-3.5" /> Unverified (Level 0)
          </span>
        );
    }
  };

  const isVerified = currentKycStatus === 'verified';

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* 1. Header Banner */}
      <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/30 p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-bold tracking-wide">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>IDENTITY & COMPLIANCE VERIFICATION</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            KYC & Verification
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Verify your legal identity to unlock automated bank virtual accounts, higher daily transaction thresholds, and Airtime-to-Cash liquidation.
          </p>
        </div>

        <div className="flex flex-col items-end gap-2 shrink-0">
          {getStatusBadge()}
          <span className="text-[11px] text-slate-500 font-mono">
            Current Tier: Level {currentKycLevel}
          </span>
        </div>
      </div>

      {/* Verification Status Notice */}
      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-start gap-3">
        <Info className="h-4 w-4 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-bold">Identity Verification Notice (Demo State)</div>
          <p className="text-slate-300 leading-relaxed">
            Live BVN/NIN verification is currently unavailable until the production KYC provider is connected. Any submission in this frontend interface is for demonstration purposes only and will not grant real verification.
          </p>
        </div>
      </div>

      {currentKycStatus === 'pending' && (
        <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs flex items-start gap-3">
          <Clock className="h-4 w-4 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="font-bold">Simulated Submission Recorded</div>
            <p className="text-slate-300">
              Demo intake captured. Official verification will occur once the production identity provider is connected. No actual KYC pass has been granted.
            </p>
          </div>
        </div>
      )}

      {/* 2. Verification Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        {/* Verification Status Card */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
            Current Status
          </div>
          <div>{getStatusBadge()}</div>
          <p className="text-xs text-slate-400">
            {isVerified
              ? 'Account fully compliant with CBN tier-1 regulations.'
              : 'Complete identity submission to upgrade your limits.'}
          </p>
        </div>

        {/* Daily Transaction Limit Card */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
            Transaction Limit
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
            {currentKycLevel === 2
              ? '₦5,000,000'
              : currentKycLevel === 1
              ? '₦200,000'
              : '₦50,000'}
            <span className="text-xs text-slate-400 font-normal"> / day</span>
          </div>
          <p className="text-xs text-slate-400">
            Limit applies across all wallet payments and card transactions.
          </p>
        </div>

        {/* Automated Virtual Funding Card */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
            Automated Funding
          </div>
          <div className="flex items-center gap-2">
            {isVerified ? (
              <span className="text-sm font-bold text-emerald-400 font-mono flex items-center gap-1">
                <CheckCircle2 className="h-4 w-4" /> Enabled & Active
              </span>
            ) : (
              <span className="text-sm font-bold text-amber-400 font-mono flex items-center gap-1">
                <Lock className="h-4 w-4" /> Locked (KYC Required)
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400">
            Requires minimum Level 1 identity match to generate virtual bank accounts.
          </p>
        </div>
      </div>

      {/* 3. KYC Level Progression Architecture */}
      <div className="space-y-4">
        <div>
          <h2 className="text-base font-bold text-white tracking-tight">
            Compliance Tiers & Limits
          </h2>
          <p className="text-xs text-slate-400">
            Progress through verification levels to unlock higher daily transaction ceilings
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Level 0 */}
          <div className={`rounded-2xl border p-5 flex flex-col justify-between space-y-4 ${
            currentKycLevel === 0 ? 'border-emerald-500/40 bg-slate-900' : 'border-slate-800 bg-slate-900/60'
          }`}>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                  Level 0: Starter
                </span>
                {currentKycLevel === 0 && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                    Current
                  </span>
                )}
              </div>
              <h3 className="text-base font-bold text-white">Unverified Account</h3>
              <ul className="space-y-2 text-xs text-slate-400">
                <li className="flex items-center gap-2">✓ Standard Airtime & Data purchase</li>
                <li className="flex items-center gap-2">✓ Daily limit: ₦50,000</li>
                <li className="flex items-center gap-2 text-rose-400">✗ Automated virtual accounts locked</li>
                <li className="flex items-center gap-2 text-rose-400">✗ Airtime to Cash locked</li>
              </ul>
            </div>

            <div className="pt-2 text-[11px] text-slate-500">
              Basic email & phone registered.
            </div>
          </div>

          {/* Level 1 */}
          <div className={`rounded-2xl border p-5 flex flex-col justify-between space-y-4 ${
            currentKycLevel === 1 ? 'border-emerald-500/40 bg-slate-900' : 'border-slate-800 bg-slate-900/60'
          }`}>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 font-mono">
                  Level 1: Basic
                </span>
                {currentKycLevel === 1 ? (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold">
                    Current
                  </span>
                ) : (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400">
                    Recommended
                  </span>
                )}
              </div>
              <h3 className="text-base font-bold text-white">Verified Individual</h3>
              <ul className="space-y-2 text-xs text-slate-400">
                <li className="flex items-center gap-2 text-emerald-400">✓ Automated virtual account unlocked</li>
                <li className="flex items-center gap-2 text-emerald-400">✓ Airtime to Cash unlocked</li>
                <li className="flex items-center gap-2 text-white">✓ Daily limit: ₦200,000</li>
                <li className="flex items-center gap-2 text-white">✓ NIN or BVN verified</li>
              </ul>
            </div>

            {currentKycStatus !== 'verified' && currentKycStatus !== 'pending' && (
              <button
                type="button"
                onClick={() => setShowSubmitModal(true)}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
              >
                Complete Level 1 KYC
              </button>
            )}
          </div>

          {/* Level 2 */}
          <div className={`rounded-2xl border p-5 flex flex-col justify-between space-y-4 ${
            currentKycLevel === 2 ? 'border-emerald-500/40 bg-slate-900' : 'border-slate-800 bg-slate-900/60'
          }`}>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-mono">
                  Level 2: Business
                </span>
                {currentKycLevel === 2 && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 font-bold">
                    Current
                  </span>
                )}
              </div>
              <h3 className="text-base font-bold text-white">Registered Enterprise</h3>
              <ul className="space-y-2 text-xs text-slate-400">
                <li className="flex items-center gap-2 text-emerald-400">✓ CAC business documentation</li>
                <li className="flex items-center gap-2 text-white">✓ Daily limit: ₦5,000,000</li>
                <li className="flex items-center gap-2 text-white">✓ Priority high-volume switch queue</li>
                <li className="flex items-center gap-2 text-white">✓ Dedicated account manager</li>
              </ul>
            </div>

            <button
              type="button"
              disabled
              className="w-full py-2.5 px-4 rounded-xl bg-slate-800 text-slate-500 font-bold text-xs cursor-not-allowed"
            >
              Enterprise Tier
            </button>
          </div>
        </div>
      </div>

      {/* 4. Verification Submission Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-3xl border border-slate-800 bg-slate-900 p-6 sm:p-8 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-bold mb-2">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>LEVEL 1 SUBMISSION</span>
              </div>
              <h3 className="text-xl font-bold text-white">Identity Intake (Demo Simulation)</h3>
              <p className="text-xs text-slate-400 mt-1">
                Live BVN/NIN verification will be connected through the production KYC provider. This form simulates the verification intake flow.
              </p>
            </div>

            <form onSubmit={handleSubmitVerification} className="space-y-4">
              {/* ID Type Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Verification Document Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setIdType('NIN')}
                    className={`py-2.5 px-4 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      idType === 'NIN'
                        ? 'border-emerald-400 bg-emerald-500/10 text-white'
                        : 'border-slate-800 bg-slate-950 text-slate-400'
                    }`}
                  >
                    National ID (NIN)
                  </button>
                  <button
                    type="button"
                    onClick={() => setIdType('BVN')}
                    className={`py-2.5 px-4 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      idType === 'BVN'
                        ? 'border-emerald-400 bg-emerald-500/10 text-white'
                        : 'border-slate-800 bg-slate-950 text-slate-400'
                    }`}
                  >
                    Bank Verification (BVN)
                  </button>
                </div>
              </div>

              {/* Number Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  11-digit {idType} Number
                </label>
                <input
                  type="text"
                  required
                  maxLength={11}
                  placeholder={`Enter 11-digit ${idType}`}
                  value={bvnOrNin}
                  onChange={(e) => setBvnOrNin(e.target.value.replace(/\D/g, '').slice(0, 11))}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-white font-mono placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Date of Birth */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Date of Birth (must match official registry)
                </label>
                <input
                  type="date"
                  required
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Residential Address */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Residential Address
                </label>
                <input
                  type="text"
                  required
                  placeholder="Street address, City, State"
                  value={residentialAddress}
                  onChange={(e) => setResidentialAddress(e.target.value.slice(0, 100))}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  SUBPLUG performs automated hash lookups. Your raw BVN is never stored on our database.
                </span>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSubmitModal(false)}
                  className="flex-1 py-3 px-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={bvnOrNin.length !== 11 || isSubmitting}
                  className="flex-1 py-3 px-4 rounded-xl bg-emerald-400 hover:bg-emerald-300 disabled:opacity-50 text-slate-950 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="h-3.5 w-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                      <span>Simulating...</span>
                    </span>
                  ) : (
                    <span>Submit Demo Intake (Simulated)</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
