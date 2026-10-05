import React, { useState } from 'react';
import { X, Lock, Mail, Phone, User, ArrowRight, ShieldCheck, CheckCircle2, AlertCircle, RefreshCw, ArrowLeft } from 'lucide-react';
import { SubplugLogo } from './SubplugLogo';
import { useAuth } from '../context/AuthContext';
import { cleanRawInput, isValidEmail, isValidNigerianPhone, sanitizeReferralCode } from '../utils/security';

interface AuthModalProps {
  isOpen: boolean;
  initialTab?: 'login' | 'register';
  onClose: () => void;
  onAuthenticated?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, initialTab = 'register', onClose, onAuthenticated }) => {
  const { signIn, signUp, resendVerificationEmail, configured } = useAuth();
  const [tab, setTab] = useState<'login' | 'register'>(initialTab);
  const [verificationPending, setVerificationPending] = useState(false);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);

  React.useEffect(() => {
    setTab(initialTab);
    setVerificationPending(false);
    setErrorMessage('');
    setSuccessMessage('');
  }, [initialTab, isOpen]);

  if (!isOpen) return null;

  const maskedEmail = email.replace(/^(.{2}).*(@.*)$/, '$1••••$2');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!configured) {
      setErrorMessage('Secure authentication is not configured yet. Please add the Supabase environment variables before using the dashboard.');
      return;
    }

    const trimmedEmail = email.trim().toLowerCase();
    if (!isValidEmail(trimmedEmail)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (tab === 'register') {
      const cleanName = cleanRawInput(fullName, 60).trim();
      if (cleanName.length < 3) {
        setErrorMessage('Please enter your full name.');
        return;
      }
      if (!isValidNigerianPhone(phone)) {
        setErrorMessage('Please enter a valid Nigerian phone number.');
        return;
      }
    }

    if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (tab === 'login') {
        await signIn(trimmedEmail, password);
        onAuthenticated?.();
      } else {
        const result = await signUp({
          email: trimmedEmail,
          password,
          fullName: cleanRawInput(fullName, 60).trim(),
          phone,
          referralCode: sanitizeReferralCode(referralCode),
        });

        if (result.needsEmailConfirmation) {
          setVerificationPending(true);
          setSuccessMessage('');
          setErrorMessage('');
        } else {
          onAuthenticated?.();
        }
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Authentication failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    setErrorMessage('');
    setSuccessMessage('');
    setIsResending(true);

    try {
      await resendVerificationEmail(email);
      setSuccessMessage('Verification email sent. Please check your inbox and spam folder.');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to resend the verification email right now.');
    } finally {
      setIsResending(false);
    }
  };

  const handleChangeEmail = () => {
    setVerificationPending(false);
    setErrorMessage('');
    setSuccessMessage('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/60" aria-label="Close"><X className="h-5 w-5" /></button>

        {verificationPending ? (
          <div className="text-center py-4">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-cyan-400/10 border border-cyan-400/20">
              <Mail className="h-8 w-8 text-cyan-300" />
            </div>
            <h3 className="text-2xl font-bold text-white">Check your email</h3>
            <p className="text-sm text-slate-400 mt-2 leading-6">
              We sent a verification link to
              <br />
              <span className="font-semibold text-white">{maskedEmail}</span>
            </p>

            <div className="mt-5 rounded-2xl bg-slate-950/80 border border-slate-800 p-4 text-left">
              <div className="flex gap-3">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400 mt-0.5" />
                <p className="text-sm text-slate-300 leading-6">
                  Click the link in the email to verify your SUBPLUG account. If you don't see it, check your spam or promotions folder.
                </p>
              </div>
            </div>

            {errorMessage && (
              <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex gap-2 text-left">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex gap-2 text-left">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            <button
              type="button"
              onClick={handleResend}
              disabled={isResending}
              className="mt-5 w-full py-3 bg-emerald-400 hover:bg-emerald-300 disabled:opacity-60 text-slate-950 font-bold text-sm rounded-xl flex items-center justify-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isResending ? 'animate-spin' : ''}`} />
              {isResending ? 'Sending verification email…' : 'Resend verification email'}
            </button>

            <button
              type="button"
              onClick={handleChangeEmail}
              className="mt-4 inline-flex items-center gap-2 text-sm text-cyan-300 hover:text-cyan-200"
            >
              <ArrowLeft className="h-4 w-4" />
              Use a different email
            </button>

            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-center gap-1.5 text-xs text-slate-500">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>Your password is managed securely by Supabase</span>
            </div>
          </div>
        ) : (
          <>
            <div className="text-center mb-6">
              <div className="flex justify-center mb-3"><SubplugLogo variant="icon" size="lg" /></div>
              <h3 className="text-2xl font-bold text-white">{tab === 'login' ? 'Login to SUBPLUG' : 'Create your SUBPLUG account'}</h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">{tab === 'login' ? 'Access your secure customer dashboard.' : 'Create an account before accessing wallet and VTU services.'}</p>
            </div>

            <div className="grid grid-cols-2 p-1 bg-slate-950 rounded-xl mb-4 border border-slate-800">
              {(['login', 'register'] as const).map((item) => (
                <button key={item} type="button" onClick={() => { setTab(item); setErrorMessage(''); setSuccessMessage(''); }} className={`py-2 text-xs font-bold rounded-lg ${tab === item ? (item === 'login' ? 'bg-slate-800 text-white' : 'bg-emerald-500 text-slate-950') : 'text-slate-400'}`}>
                  {item === 'login' ? 'Login' : 'Register'}
                </button>
              ))}
            </div>

            {errorMessage && <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex gap-2"><AlertCircle className="h-4 w-4 shrink-0" /><span>{errorMessage}</span></div>}
            {successMessage && <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex gap-2"><CheckCircle2 className="h-4 w-4 shrink-0" /><span>{successMessage}</span></div>}

            <form onSubmit={handleSubmit} className="space-y-4">
              {tab === 'register' && <div><label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label><div className="relative"><User className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" /><input required maxLength={60} value={fullName} onChange={(e) => setFullName(cleanRawInput(e.target.value, 60))} placeholder="Your full name" className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white" /></div></div>}
              {tab === 'register' && <div><label className="block text-xs font-semibold text-slate-300 mb-1">Nigerian Phone Number</label><div className="relative"><Phone className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" /><input type="tel" required maxLength={14} value={phone} onChange={(e) => setPhone(e.target.value.replace(/[^0-9+]/g, '').slice(0, 14))} placeholder="08012345678" className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white font-mono" /></div></div>}
              <div><label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label><div className="relative"><Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" /><input type="email" required maxLength={100} value={email} onChange={(e) => setEmail(cleanRawInput(e.target.value, 100))} placeholder="name@example.com" className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white" /></div></div>
              <div><label className="block text-xs font-semibold text-slate-300 mb-1">Password</label><div className="relative"><Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" /><input type="password" required minLength={8} maxLength={72} value={password} onChange={(e) => setPassword(e.target.value.slice(0, 72))} placeholder="At least 8 characters" className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white" /></div></div>
              {tab === 'register' && <div><label className="block text-xs font-semibold text-slate-300 mb-1">Referral Code <span className="text-slate-500 font-normal">(Optional)</span></label><input maxLength={10} value={referralCode} onChange={(e) => setReferralCode(sanitizeReferralCode(e.target.value))} placeholder="SUB992" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white uppercase font-mono" /></div>}
              <button type="submit" disabled={isSubmitting} className="w-full py-3 bg-emerald-400 hover:bg-emerald-300 disabled:opacity-60 text-slate-950 font-bold text-sm rounded-xl flex items-center justify-center gap-2">
                {isSubmitting ? <><span className="h-4 w-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />Authenticating…</span> : <>{tab === 'login' ? 'Login securely' : 'Create secure account'}<ArrowRight className="h-4 w-4" /></>}
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-center gap-1.5 text-xs text-slate-500"><ShieldCheck className="h-4 w-4 text-emerald-400" /><span>Auth provider manages password hashing and sessions</span></div>
          </>
        )}
      </div>
    </div>
  );
};
