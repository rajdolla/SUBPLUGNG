import React, { useEffect, useRef, useState } from 'react';
import { AlertCircle, CheckCircle2, Phone, RefreshCw, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

interface PhoneVerificationModalProps {
  isOpen: boolean;
  onClose?: () => void;
}

export const PhoneVerificationModal: React.FC<PhoneVerificationModalProps> = ({ isOpen, onClose }) => {
  const { user, startPhoneVerification, resendPhoneVerification, verifyPhoneOtp, signOut } = useAuth();
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [loadingPhone, setLoadingPhone] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [cooldown, setCooldown] = useState(0);
  const startedFor = useRef<string | null>(null);

  useEffect(() => {
    if (!isOpen || !user || !supabase) return;

    let mounted = true;
    setLoadingPhone(true);
    setErrorMessage('');

    supabase
      .from('profiles')
      .select('phone')
      .eq('id', user.id)
      .maybeSingle()
      .then(({ data, error }) => {
        if (!mounted) return;

        if (error) {
          setErrorMessage('We could not load your registered phone number. Please try again.');
          setLoadingPhone(false);
          return;
        }

        const nextPhone = data?.phone || '';
        setPhone(nextPhone);
        setLoadingPhone(false);
      });

    return () => {
      mounted = false;
    };
  }, [isOpen, user?.id]);

  useEffect(() => {
    if (!isOpen || !phone || startedFor.current === phone) return;

    startedFor.current = phone;
    setIsSending(true);
    setErrorMessage('');
    startPhoneVerification(phone)
      .then(() => {
        setSuccessMessage('A 6-digit verification code was sent to your phone.');
        setCooldown(60);
      })
      .catch((error) => {
        setErrorMessage(error instanceof Error ? error.message : 'Unable to send the phone verification code.');
      })
      .finally(() => setIsSending(false));
  }, [isOpen, phone, startPhoneVerification]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = window.setInterval(() => setCooldown((value) => Math.max(0, value - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [cooldown]);

  if (!isOpen) return null;

  const handleVerify = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!/^\d{6}$/.test(otp)) {
      setErrorMessage('Enter the 6-digit code sent to your phone.');
      return;
    }

    setIsVerifying(true);
    try {
      await verifyPhoneOtp(phone, otp);
      setSuccessMessage('Phone number verified successfully.');
      window.setTimeout(() => onClose?.(), 700);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'The verification code is invalid or expired.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (!phone || cooldown > 0 || isSending) return;

    setErrorMessage('');
    setSuccessMessage('');
    setIsSending(true);

    try {
      await resendPhoneVerification(phone);
      setSuccessMessage('A new verification code has been sent.');
      setCooldown(60);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to resend the verification code right now.');
    } finally {
      setIsSending(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } finally {
      onClose?.();
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-cyan-400/10 border border-cyan-400/20">
          <Phone className="h-8 w-8 text-cyan-300" />
        </div>

        <div className="text-center">
          <h3 className="text-2xl font-bold text-white">Verify your phone</h3>
          <p className="text-sm text-slate-400 mt-2 leading-6">
            We need to verify the Nigerian phone number on your SUBPLUG account before you can access your dashboard.
          </p>
        </div>

        <div className="mt-5 rounded-2xl bg-slate-950/80 border border-slate-800 p-4">
          <div className="flex items-center gap-3">
            <Phone className="h-5 w-5 text-cyan-300 shrink-0" />
            <div>
              <p className="text-xs text-slate-500">Registered phone</p>
              <p className="text-sm font-semibold text-white font-mono">{loadingPhone ? 'Loading…' : phone || 'Not available'}</p>
            </div>
          </div>
        </div>

        {errorMessage && (
          <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleVerify} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">SMS verification code</label>
            <input
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              value={otp}
              onChange={(event) => setOtp(event.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="123456"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-center text-xl tracking-[0.45em] text-white font-mono"
            />
          </div>

          <button
            type="submit"
            disabled={isVerifying || loadingPhone || !phone}
            className="w-full py-3 bg-emerald-400 hover:bg-emerald-300 disabled:opacity-60 text-slate-950 font-bold text-sm rounded-xl flex items-center justify-center gap-2"
          >
            {isVerifying ? 'Verifying…' : 'Verify phone number'}
          </button>
        </form>

        <button
          type="button"
          onClick={handleResend}
          disabled={isSending || cooldown > 0 || !phone}
          className="mt-4 w-full py-2.5 border border-slate-700 text-slate-200 hover:bg-slate-800 disabled:opacity-50 rounded-xl text-sm font-semibold flex items-center justify-center gap-2"
        >
          <RefreshCw className={isSending ? 'h-4 w-4 animate-spin' : 'h-4 w-4'} />
          {cooldown > 0 ? 'Resend code in ' + cooldown + 's' : 'Resend SMS code'}
        </button>

        <button
          type="button"
          onClick={handleSignOut}
          className="mt-4 w-full text-sm text-slate-400 hover:text-white"
        >
          Sign out and verify later
        </button>

        <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-center gap-1.5 text-xs text-slate-500">
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          <span>Phone verification uses Supabase Auth and a one-time SMS code.</span>
        </div>
      </div>
    </div>
  );
};
