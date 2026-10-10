/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  KeyRound,
  ShieldCheck,
  X,
  Lock,
  ArrowRight,
  AlertCircle,
  Eye,
  EyeOff,
} from 'lucide-react';

interface TransactionPinModalProps {
  isOpen: boolean;
  serviceTitle: string;
  amount: number;
  recipient: string;
  onClose: () => void;
  onPinVerified: (pin: string) => void;
}

export const TransactionPinModal: React.FC<TransactionPinModalProps> = ({
  isOpen,
  serviceTitle,
  amount,
  recipient,
  onClose,
  onPinVerified,
}) => {
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length !== 4) {
      setError('Please enter your 4-digit Transaction PIN.');
      return;
    }
    setError('');
    onPinVerified(pin);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-sm rounded-3xl border border-slate-800 bg-slate-900 p-6 sm:p-7 space-y-5 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          aria-label="Close PIN modal"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="text-center space-y-1">
          <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-3">
            <KeyRound className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold text-white">Authorize Purchase (Demo)</h3>
          <p className="text-xs text-slate-400">
            Enter 4-digit Transaction PIN to simulate authorization
          </p>
        </div>

        {/* Purchase Summary */}
        <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-1.5">
          <div className="flex justify-between text-slate-400">
            <span>Service:</span>
            <span className="text-white font-semibold">{serviceTitle}</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Recipient:</span>
            <span className="text-white font-mono">{recipient || 'Self'}</span>
          </div>
          <div className="flex justify-between pt-1 border-t border-slate-800 text-slate-300">
            <span>Amount:</span>
            <span className="text-emerald-400 font-mono font-bold text-sm">
              ₦{amount.toLocaleString()}
            </span>
          </div>
        </div>

        {error && (
          <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-1.5">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-300">
                4-Digit Security PIN
              </label>
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
              >
                {showPin ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                <span>{showPin ? 'Hide' : 'Show'}</span>
              </button>
            </div>
            <input
              type={showPin ? 'text' : 'password'}
              maxLength={4}
              required
              autoFocus
              placeholder="••••"
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
              className="w-full rounded-2xl border border-slate-800 bg-slate-950 p-3 text-center text-2xl tracking-[0.6em] font-mono text-white focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={pin.length !== 4}
              className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-400 hover:bg-emerald-300 disabled:opacity-50 text-slate-950 font-bold text-xs transition-colors cursor-pointer shadow-md"
            >
              Authorize
            </button>
          </div>
        </form>

        <div className="text-[10px] text-slate-500 text-center flex items-center justify-center gap-1">
          <ShieldCheck className="h-3 w-3 text-amber-400" />
          <span>Transaction PIN security will be enforced server-side when live transactions are enabled.</span>
        </div>
      </div>
    </div>
  );
};
