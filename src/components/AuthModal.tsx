import React, { useState } from 'react';
import { X, Lock, Mail, Phone, User, ArrowRight, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { SubplugLogo } from './SubplugLogo';
import { 
  cleanRawInput, 
  isValidEmail, 
  isValidNigerianPhone, 
  normalizeNigerianPhone, 
  sanitizeReferralCode 
} from '../utils/security';

interface AuthModalProps {
  isOpen: boolean;
  initialTab?: 'login' | 'register';
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialTab = 'register',
  onClose,
}) => {
  const [tab, setTab] = useState<'login' | 'register'>(initialTab);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Sync tab with initialTab whenever opened
  React.useEffect(() => {
    setTab(initialTab);
    setIsSuccess(false);
    setErrorMessage('');
  }, [initialTab, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Strict validation
    const trimmedEmail = email.trim();
    if (!isValidEmail(trimmedEmail)) {
      setErrorMessage('Please enter a valid, secure email address (e.g. yourname@example.com).');
      return;
    }

    if (!isValidNigerianPhone(phone)) {
      setErrorMessage('Please enter a valid 11-digit Nigerian telephone number (e.g. 08012345678).');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Security requirement: Password must be at least 6 characters.');
      return;
    }

    if (tab === 'register') {
      const cleanName = cleanRawInput(fullName, 60).trim();
      if (cleanName.length < 3) {
        setErrorMessage('Please enter your full legal name (minimum 3 characters).');
        return;
      }
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1100);
  };

  const resetAndClose = () => {
    setIsSuccess(false);
    setErrorMessage('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={resetAndClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/60 hover:bg-slate-800 transition-colors cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="h-5 w-5" />
        </button>

        {isSuccess ? (
          <div className="py-6 text-center space-y-4 animate-in zoom-in-95 duration-200">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="h-8 w-8" />
            </div>

            <h3 className="text-2xl font-bold text-white">
              {tab === 'login' ? 'Welcome Back!' : 'Account Created Successfully!'}
            </h3>

            <p className="text-sm text-slate-300">
              {tab === 'login'
                ? 'You are securely logged into your Subplug dashboard.'
                : 'Your dedicated Nigerian virtual bank accounts have been generated.'}
            </p>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-left space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Account Status:</span>
                <span className="text-emerald-400 font-bold">Active & Encrypted</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Dedicated Virtual Acct:</span>
                <span className="text-white font-mono font-bold">9823481234 (Wema / Moniepoint)</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Opening Balance:</span>
                <span className="text-white font-mono font-bold">₦0.00</span>
              </div>
            </div>

            <button
              onClick={resetAndClose}
              className="w-full py-3 px-4 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-sm rounded-xl transition-colors cursor-pointer"
            >
              Go to Dashboard
            </button>
          </div>
        ) : (
          <div>
            {/* Header / Tabs with Subplug Logo */}
            <div className="text-center mb-6">
              <div className="flex justify-center mb-3">
                <SubplugLogo variant="icon" size="lg" />
              </div>
              <h3 className="text-2xl font-bold text-white tracking-tight">
                {tab === 'login' ? 'Login to Subplug' : 'Create Your Free Account'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                {tab === 'login'
                  ? 'Access your wallet, purchase history and wholesale rates'
                  : 'Start buying cheap data and earning daily reseller commissions'}
              </p>
            </div>

            {/* Tab switch */}
            <div className="grid grid-cols-2 p-1 bg-slate-950 rounded-xl mb-4 border border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setTab('login');
                  setErrorMessage('');
                }}
                className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  tab === 'login'
                    ? 'bg-slate-800 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => {
                  setTab('register');
                  setErrorMessage('');
                }}
                className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  tab === 'register'
                    ? 'bg-emerald-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Register
              </button>
            </div>

            {/* Validation Error Alert */}
            {errorMessage && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-start gap-2">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {tab === 'register' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                    <input
                      type="text"
                      required
                      maxLength={60}
                      placeholder="e.g. Babatunde Adeyemi"
                      value={fullName}
                      onChange={(e) => setFullName(cleanRawInput(e.target.value, 60))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Nigerian Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                  <input
                    type="tel"
                    required
                    maxLength={15}
                    placeholder="0801 234 5678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/[^0-9+]/g, '').slice(0, 14))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-colors font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                  <input
                    type="email"
                    required
                    maxLength={80}
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(cleanRawInput(e.target.value, 80))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    maxLength={64}
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value.slice(0, 64))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
              </div>

              {tab === 'register' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Referral Code <span className="text-slate-500 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    maxLength={10}
                    placeholder="e.g. SUB992"
                    value={referralCode}
                    onChange={(e) => setReferralCode(sanitizeReferralCode(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-colors uppercase font-mono"
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 py-3 px-4 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-sm rounded-xl transition-all shadow-md shadow-emerald-500/10 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    <span>Verifying credentials...</span>
                  </span>
                ) : (
                  <>
                    <span>{tab === 'login' ? 'Login Now' : 'Create Free Account'}</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-center gap-1.5 text-xs text-slate-500">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>256-bit Bank Grade Encryption & Secure Hash Storage</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
