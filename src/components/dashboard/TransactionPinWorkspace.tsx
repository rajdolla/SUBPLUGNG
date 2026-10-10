/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  KeyRound,
  ShieldCheck,
  CheckCircle2,
  Lock,
  AlertCircle,
  Eye,
  EyeOff,
  RotateCcw,
} from 'lucide-react';

interface TransactionPinWorkspaceProps {
  pinSet?: boolean;
  onPinSaved?: () => void;
}

export const TransactionPinWorkspace: React.FC<TransactionPinWorkspaceProps> = ({
  pinSet = false,
  onPinSaved,
}) => {
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [isPinConfigured, setIsPinConfigured] = useState(pinSet);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [showPin, setShowPin] = useState(false);

  const handleSetPin = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (newPin.length !== 4 || !/^\d{4}$/.test(newPin)) {
      setMessage({ text: 'Transaction PIN must be exactly 4 digits.', type: 'error' });
      return;
    }

    if (newPin !== confirmPin) {
      setMessage({ text: 'New PIN and confirmation PIN do not match.', type: 'error' });
      return;
    }

    // Frontend state update (temporary UI state only)
    setIsPinConfigured(true);
    setNewPin('');
    setConfirmPin('');
    setCurrentPin('');
    setMessage({
      text: 'PIN saved for this session (demo mode). Transaction PIN security will be enforced server-side when live transactions are enabled.',
      type: 'success',
    });

    if (onPinSaved) onPinSaved();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* 1. Header Banner */}
      <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/30 p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-bold tracking-wide">
            <KeyRound className="h-3.5 w-3.5" />
            <span>PAYMENT AUTHORIZATION DEMO</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Transaction PIN
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Your 4-digit security PIN will authorize purchase checkouts and wallet withdrawals. Transaction PIN security will be enforced server-side when live transactions are enabled.
          </p>
        </div>

        <div className="flex items-center gap-2 p-3 rounded-2xl bg-slate-900 border border-slate-800 text-xs shrink-0">
          <ShieldCheck className="h-5 w-5 text-emerald-400" />
          <div>
            <div className="text-[10px] text-slate-500 font-mono">FRONTEND STATE</div>
            <div className="font-bold text-white">
              {isPinConfigured ? 'Session PIN Configured' : 'Not Set (Frontend Only)'}
            </div>
          </div>
        </div>
      </div>

      {/* Demo Notice Banner */}
      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-start gap-3">
        <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="font-bold">Frontend Demonstration:</span>
          <p className="text-slate-300 leading-relaxed">
            Transaction PIN security will be enforced server-side when live transactions are enabled. No PIN is transmitted or stored outside temporary browser session state.
          </p>
        </div>
      </div>

      {/* 2. Distinction Notice */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider font-mono">
          <ShieldCheck className="h-4 w-4" />
          <span>Security Protocol Architecture</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="font-bold text-white block">Required For Sensitive Purchases:</span>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Airtime recharge, Data purchases, Data PINs, Electricity token payments, Cable TV, and Bulk SMS broadcasts prompt for this 4-digit PIN before dispatch.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="font-bold text-amber-400 block">Airtime-to-Cash Special Exception:</span>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Airtime to Cash <strong>does not use</strong> a Transaction PIN. Instead, it strictly requires verified KYC documentation to ensure anti-fraud AML compliance.
            </p>
          </div>
        </div>
      </div>

      {/* 3. PIN Setup / Change Form */}
      <div className="max-w-xl rounded-3xl border border-slate-800 bg-slate-900/80 p-6 sm:p-8 space-y-6">
        <div>
          <h2 className="text-base font-bold text-white">
            {isPinConfigured ? 'Change Transaction PIN' : 'Set 4-Digit Transaction PIN'}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Choose a secret 4-digit numeric code that is difficult for others to guess.
          </p>
        </div>

        {message && (
          <div
            className={`p-3.5 rounded-xl border text-xs flex items-center gap-2 ${
              message.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
            }`}
          >
            {message.type === 'success' ? (
              <CheckCircle2 className="h-4 w-4 shrink-0" />
            ) : (
              <AlertCircle className="h-4 w-4 shrink-0" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        <form onSubmit={handleSetPin} className="space-y-4">
          {isPinConfigured && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Current 4-Digit PIN
              </label>
              <input
                type={showPin ? 'text' : 'password'}
                maxLength={4}
                required
                placeholder="••••"
                value={currentPin}
                onChange={(e) => setCurrentPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-center text-lg tracking-[0.5em] font-mono text-white placeholder-slate-700 focus:outline-none focus:border-emerald-500"
              />
            </div>
          )}

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-300">
                {isPinConfigured ? 'New 4-Digit PIN' : 'Enter 4-Digit PIN'}
              </label>
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
              >
                {showPin ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                <span>{showPin ? 'Hide' : 'Show'}</span>
              </button>
            </div>
            <input
              type={showPin ? 'text' : 'password'}
              maxLength={4}
              required
              placeholder="••••"
              value={newPin}
              onChange={(e) => setNewPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-center text-lg tracking-[0.5em] font-mono text-white placeholder-slate-700 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Confirm 4-Digit PIN
            </label>
            <input
              type={showPin ? 'text' : 'password'}
              maxLength={4}
              required
              placeholder="••••"
              value={confirmPin}
              onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-center text-lg tracking-[0.5em] font-mono text-white placeholder-slate-700 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={newPin.length !== 4 || confirmPin.length !== 4}
              className="w-full py-3 px-4 rounded-xl bg-emerald-400 hover:bg-emerald-300 disabled:opacity-50 text-slate-950 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
            >
              <span>{isPinConfigured ? 'Update Transaction PIN' : 'Set Transaction PIN'}</span>
            </button>
          </div>
        </form>

        <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-[11px] text-slate-500 space-y-1">
          <div className="font-semibold text-slate-400">Security Guidance:</div>
          <div>• Never share your 4-digit PIN with anyone. SUBPLUG staff will never ask for your PIN.</div>
          <div>• Avoid using obvious patterns such as "1234" or your birth year.</div>
        </div>
      </div>
    </div>
  );
};
