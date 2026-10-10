import React, { useState } from 'react';
import { X, CheckCircle2, TrendingUp, Key, ArrowRight, ShieldCheck, Copy, Check, CreditCard, Wallet, AlertCircle } from 'lucide-react';
import { cleanRawInput, isValidNigerianPhone } from '../utils/security';

interface VendorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VendorModal: React.FC<VendorModalProps> = ({ isOpen, onClose }) => {
  const [selectedTier, setSelectedTier] = useState<'reseller' | 'api'>('reseller');
  const [businessName, setBusinessName] = useState('');
  const [phone, setPhone] = useState('');
  const [state, setState] = useState('Lagos');
  const [paymentSource, setPaymentSource] = useState<'wallet' | 'bank_transfer'>('wallet');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);

  if (!isOpen) return null;

  const tierPrices = {
    reseller: 1500,
    api: 3500,
  };

  const currentFee = tierPrices[selectedTier];
  const mockApiKey = 'sk_live_subplug_' + Math.random().toString(36).substring(2, 14) + '_ng';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const cleanBiz = cleanRawInput(businessName, 80).trim();
    if (cleanBiz.length < 3) {
      setErrorMessage('Please enter a valid business or agency brand name (minimum 3 characters).');
      return;
    }

    if (!isValidNigerianPhone(phone)) {
      setErrorMessage('Please enter a valid 11-digit Nigerian WhatsApp number (e.g. 08012345678).');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1200);
  };

  const handleCopy = () => {
    navigator.clipboard?.writeText(mockApiKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2500);
  };

  const resetAndClose = () => {
    setIsSuccess(false);
    setErrorMessage('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden max-h-[92vh] overflow-y-auto">
        
        <button
          onClick={resetAndClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/60 hover:bg-slate-800 transition-colors cursor-pointer z-10"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        {isSuccess ? (
          <div className="py-4 text-center space-y-4 animate-in zoom-in-95 duration-200">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
              <CheckCircle2 className="h-8 w-8" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                Intake Confirmed (Demo Simulation)
              </span>
              <h3 className="text-2xl font-black text-white">
                Vendor Upgrade Requested
              </h3>
              <p className="text-xs sm:text-sm text-slate-300">
                Demo simulation for <strong className="text-white">{cleanRawInput(businessName, 50) || 'Partner'}</strong>. Your application for <span className="text-amber-400 font-bold">{selectedTier === 'reseller' ? 'Reseller Agent Tier' : 'API Developer Partner Tier'}</span> is recorded. Live payment processing will activate once backend integration is complete.
              </p>
            </div>

            {/* License Receipt Card */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-left space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>License Fee Paid:</span>
                <span className="text-amber-400 font-mono font-bold text-sm">₦{currentFee.toLocaleString()} (One-Time)</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Account Status:</span>
                <span className="text-emerald-400 font-bold">Lifetime Wholesale Active</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Monthly Recurring Fees:</span>
                <span className="text-white font-bold">₦0 (Never expires)</span>
              </div>
            </div>

            {/* Generated API Key Card */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-left space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5 font-semibold text-amber-400">
                  <Key className="h-3.5 w-3.5" />
                  Your Reseller API Secret Key
                </span>
                <span className="text-[11px] font-mono text-emerald-400">Status: Active</span>
              </div>

              <div className="flex items-center justify-between bg-slate-900 p-2.5 rounded-xl border border-slate-800 font-mono text-xs text-slate-200 overflow-x-auto">
                <span className="truncate pr-2">{mockApiKey}</span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg flex items-center gap-1 shrink-0 text-[11px] transition-colors cursor-pointer"
                >
                  {copiedKey ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copiedKey ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <div className="text-[11px] text-slate-400">
                Endpoint: <code className="text-emerald-400 font-mono">https://api.subplug.ng/v1/topup</code>
              </div>
            </div>

            <button
              onClick={resetAndClose}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-300 hover:to-orange-300 text-slate-950 font-bold text-sm rounded-xl transition-all shadow-md shadow-amber-500/20 cursor-pointer"
            >
              Access Wholesale Portal
            </button>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
                <TrendingUp className="h-4 w-4" />
                <span>Vendor Upgrade Terminal</span>
              </div>
              <h3 className="text-2xl font-bold text-white tracking-tight">
                Upgrade to Authorized Vendor
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Pay a one-time license fee to unlock guaranteed lowest wholesale rates and developer tools.
              </p>
            </div>

            {/* Validation Error Alert */}
            {errorMessage && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-start gap-2">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Upgrade Tier Selection with Transparent Fees */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Select Vendor License Tier
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedTier('reseller')}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      selectedTier === 'reseller'
                        ? 'border-amber-400 bg-amber-500/10 shadow-md shadow-amber-500/10'
                        : 'border-slate-800 bg-slate-950 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-white">Reseller Tier</span>
                      <span className="text-xs font-mono font-extrabold text-amber-400">₦1,500</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-tight">
                      For retail agents & POS kiosks selling airtime, data & bills.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedTier('api')}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      selectedTier === 'api'
                        ? 'border-amber-400 bg-amber-500/10 shadow-md shadow-amber-500/10'
                        : 'border-slate-800 bg-slate-950 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-white">API Partner Tier</span>
                      <span className="text-xs font-mono font-extrabold text-amber-400">₦3,500</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-tight">
                      For developers, fintech apps & portal owners with webhooks.
                    </p>
                  </button>
                </div>
              </div>

              {/* Business Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Business / Agency Name
                </label>
                <input
                  type="text"
                  required
                  maxLength={80}
                  placeholder="e.g. Apex VTU & Tech Solutions"
                  value={businessName}
                  onChange={(e) => setBusinessName(cleanRawInput(e.target.value, 80))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>

              {/* WhatsApp Number */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  WhatsApp Contact Number
                </label>
                <input
                  type="tel"
                  required
                  maxLength={15}
                  placeholder="0801 234 5678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/[^0-9+]/g, '').slice(0, 14))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white font-mono placeholder-slate-600 focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>

              {/* State */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Operating State
                </label>
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
                >
                  <option value="Lagos">Lagos State</option>
                  <option value="Abuja FCT">Abuja FCT</option>
                  <option value="Rivers">Rivers / Port Harcourt</option>
                  <option value="Oyo">Oyo / Ibadan</option>
                  <option value="Kano">Kano</option>
                  <option value="Enugu">Enugu</option>
                  <option value="Delta">Delta</option>
                  <option value="Other">Other State</option>
                </select>
              </div>

              {/* Payment Method for Upgrade Fee */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Fee Payment Source
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setPaymentSource('wallet')}
                    className={`p-2.5 rounded-xl border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      paymentSource === 'wallet'
                        ? 'border-amber-400 bg-amber-500/10 text-white font-bold'
                        : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Wallet className="h-3.5 w-3.5 text-amber-400" />
                    <span>Wallet Balance</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentSource('bank_transfer')}
                    className={`p-2.5 rounded-xl border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      paymentSource === 'bank_transfer'
                        ? 'border-amber-400 bg-amber-500/10 text-white font-bold'
                        : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                    }`}
                  >
                    <CreditCard className="h-3.5 w-3.5 text-amber-400" />
                    <span>Debit Card / Gateway</span>
                  </button>
                </div>
              </div>

              {/* Submit Payment Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-4 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-300 hover:from-amber-300 hover:to-orange-300 text-slate-950 font-extrabold text-sm rounded-xl transition-all shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                      <span>Validating License Upgrade (₦{currentFee.toLocaleString()})...</span>
                    </span>
                  ) : (
                    <>
                      <span>Pay ₦{currentFee.toLocaleString()} & Activate License</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="mt-4 pt-3 border-t border-slate-800 text-center text-xs text-slate-500 flex items-center justify-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-amber-400" />
              <span>One-Time Fee · Zero Monthly Renewals · Lifetime Wholesale Pricing</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
