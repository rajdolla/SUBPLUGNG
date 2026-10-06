import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  AtSign,
  Check,
  CheckCircle2,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Phone,
  RefreshCw,
  ShieldCheck,
  User,
  X,
} from 'lucide-react';
import { SubplugLogo } from './SubplugLogo';
import { useAuth } from '../context/AuthContext';
import {
  cleanRawInput,
  isReservedUsername,
  isValidEmail,
  isValidNigerianPhone,
  isValidUsername,
  normalizeUsername,
  sanitizeReferralCode,
} from '../utils/security';

interface AuthModalProps {
  isOpen: boolean;
  initialTab?: 'login' | 'register';
  onClose: () => void;
  onAuthenticated?: () => void;
}

const inputClass =
  'w-full bg-slate-950/80 border border-slate-800 focus:border-emerald-400/70 focus:ring-2 focus:ring-emerald-400/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-slate-600 outline-none transition';

const getPasswordStrength = (value: string) => {
  let score = 0;
  if (value.length >= 8) score++;
  if (/[a-z]/.test(value) && /[A-Z]/.test(value)) score++;
  if (/\d/.test(value)) score++;
  if (/[^A-Za-z0-9]/.test(value)) score++;

  if (!value) return { label: 'Enter a password', score: 0 };
  if (score <= 1) return { label: 'Weak password', score };
  if (score === 2) return { label: 'Fair password', score };
  if (score === 3) return { label: 'Good password', score };
  return { label: 'Strong password', score };
};

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialTab = 'register',
  onClose,
  onAuthenticated,
}) => {
  const { signIn, signUp, resendVerificationEmail, configured } = useAuth();

  const [tab, setTab] = useState<'login' | 'register'>(initialTab);
  const [registerStep, setRegisterStep] = useState<1 | 2>(1);
  const [verificationPending, setVerificationPending] = useState(false);

  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [referralCode, setReferralCode] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const passwordStrength = useMemo(() => getPasswordStrength(password), [password]);
  const maskedEmail = email.replace(/^(.{2}).*(@.*)$/, '$1••••$2');

  useEffect(() => {
    setTab(initialTab);
    setRegisterStep(1);
    setVerificationPending(false);
    setErrorMessage('');
    setSuccessMessage('');
    setShowPassword(false);
    setShowConfirmPassword(false);
  }, [initialTab, isOpen]);

  if (!isOpen) return null;

  const switchTab = (nextTab: 'login' | 'register') => {
    setTab(nextTab);
    setRegisterStep(1);
    setErrorMessage('');
    setSuccessMessage('');
  };

  const validateStepOne = () => {
    const cleanName = cleanRawInput(fullName, 60).trim();
    const normalizedUsername = normalizeUsername(username);

    if (cleanName.length < 3) {
      setErrorMessage('Please enter your full name.');
      return false;
    }

    if (!isValidUsername(normalizedUsername)) {
      setErrorMessage('Username must be 4–20 characters using letters, numbers or underscores.');
      return false;
    }

    if (isReservedUsername(normalizedUsername)) {
      setErrorMessage('That username is reserved. Please choose another.');
      return false;
    }

    if (!isValidNigerianPhone(phone)) {
      setErrorMessage('Enter a valid Nigerian phone number, e.g. 08012345678.');
      return false;
    }

    if (!isValidEmail(email.trim().toLowerCase())) {
      setErrorMessage('Please enter a valid email address.');
      return false;
    }

    return true;
  };

  const validateStepTwo = () => {
    if (password.length < 8) {
      setErrorMessage('Your password must be at least 8 characters.');
      return false;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return false;
    }

    if (!agreedToTerms) {
      setErrorMessage('Please accept the Terms of Service and Privacy Policy to continue.');
      return false;
    }

    return true;
  };

  const handleNextStep = () => {
    setErrorMessage('');
    setSuccessMessage('');

    if (validateStepOne()) {
      setRegisterStep(2);
    }
  };

  const handleBackStep = () => {
    setErrorMessage('');
    setSuccessMessage('');
    setRegisterStep(1);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!configured) {
      setErrorMessage('Secure authentication is not configured yet. Please try again after setup is complete.');
      return;
    }

    if (tab === 'login') {
      if (!loginIdentifier.trim()) {
        setErrorMessage('Enter your email, username or phone number.');
        return;
      }
      if (password.length < 8) {
        setErrorMessage('Your password must be at least 8 characters.');
        return;
      }
    } else if (!validateStepTwo()) {
      return;
    }

    setIsSubmitting(true);

    try {
      if (tab === 'login') {
        await signIn(loginIdentifier, password);
        onAuthenticated?.();
        return;
      }

      const result = await signUp({
        email: email.trim().toLowerCase(),
        username: normalizeUsername(username),
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
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'We could not create your account. Please try again.',
      );
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
      setSuccessMessage('Verification email sent. Check your inbox and spam folder.');
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Unable to resend the verification email right now.',
      );
    } finally {
      setIsResending(false);
    }
  };

  const handleChangeEmail = () => {
    setVerificationPending(false);
    setRegisterStep(1);
    setErrorMessage('');
    setSuccessMessage('');
  };

  const renderPasswordField = (
    label: string,
    value: string,
    onChange: (value: string) => void,
    visible: boolean,
    setVisible: (value: boolean) => void,
    autoComplete: string,
  ) => (
    <div>
      <label className="block text-xs font-semibold text-slate-300 mb-1.5">{label}</label>
      <div className="relative">
        <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
        <input
          required
          type={visible ? 'text' : 'password'}
          minLength={8}
          maxLength={72}
          autoComplete={autoComplete}
          value={value}
          onChange={(event) => onChange(event.target.value.slice(0, 72))}
          placeholder="At least 8 characters"
          className={`${inputClass} pr-11`}
        />
        <button
          type="button"
          onClick={() => setVisible(!visible)}
          className="absolute right-2.5 top-2.5 p-1.5 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-slate-800 transition"
          aria-label={visible ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}
        >
          {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg my-auto bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/70 to-transparent" />

        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/70 hover:bg-slate-700 transition"
          aria-label="Close authentication dialog"
        >
          <X className="h-5 w-5" />
        </button>

        {verificationPending ? (
          <div className="p-6 sm:p-9 text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-cyan-400/10 border border-cyan-400/20">
              <Mail className="h-8 w-8 text-cyan-300" />
            </div>

            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-400">Almost there</p>
            <h3 className="text-2xl font-bold text-white mt-1">Check your email</h3>
            <p className="text-sm text-slate-400 mt-2 leading-6">
              We sent a verification link to
              <br />
              <span className="font-semibold text-white">{maskedEmail}</span>
            </p>

            <div className="mt-6 rounded-2xl bg-slate-950/80 border border-slate-800 p-4 text-left">
              <div className="flex gap-3">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-white">Verify your email first</p>
                  <p className="text-sm text-slate-400 leading-6 mt-1">
                    Click the link in the email to activate your account. Next, we’ll verify your phone with a one-time SMS code.
                  </p>
                </div>
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
              className="mt-5 w-full py-3 bg-emerald-400 hover:bg-emerald-300 disabled:opacity-60 text-slate-950 font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition"
            >
              <RefreshCw className={isResending ? 'h-4 w-4 animate-spin' : 'h-4 w-4'} />
              {isResending ? 'Sending verification email…' : 'Resend verification email'}
            </button>

            <button
              type="button"
              onClick={handleChangeEmail}
              className="mt-4 inline-flex items-center gap-2 text-sm text-cyan-300 hover:text-cyan-200 transition"
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
            <div className="px-6 pt-7 pb-5 sm:px-9 sm:pt-8">
              <div className="flex items-center gap-3">
                <SubplugLogo variant="icon" size="lg" />
                <div className="min-w-0">
                  <h3 className="text-xl sm:text-2xl font-bold text-white">
                    {tab === 'login' ? 'Welcome back' : 'Create your SUBPLUG account'}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                    {tab === 'login'
                      ? 'Sign in using your email, username or phone.'
                      : 'Quick setup. Secure verification. No hidden steps.'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 p-1 bg-slate-950 rounded-xl mt-6 border border-slate-800">
                <button
                  type="button"
                  onClick={() => switchTab('login')}
                  className={`py-2.5 text-xs font-bold rounded-lg transition ${
                    tab === 'login' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => switchTab('register')}
                  className={`py-2.5 text-xs font-bold rounded-lg transition ${
                    tab === 'register' ? 'bg-emerald-400 text-slate-950 shadow-sm' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  Create account
                </button>
              </div>

              {tab === 'register' && (
                <div className="mt-6">
                  <div className="flex items-center justify-between text-[11px] font-semibold">
                    <span className={registerStep === 1 ? 'text-emerald-400' : 'text-slate-500'}>
                      1. Your details
                    </span>
                    <span className={registerStep === 2 ? 'text-emerald-400' : 'text-slate-500'}>
                      2. Secure account
                    </span>
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <div className="h-1.5 rounded-full bg-emerald-400" />
                    <div className={`h-1.5 rounded-full ${registerStep === 2 ? 'bg-emerald-400' : 'bg-slate-800'}`} />
                  </div>
                </div>
              )}
            </div>

            <div className="px-6 pb-7 sm:px-9 sm:pb-8">
              {errorMessage && (
                <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {successMessage && (
                <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex gap-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span>{successMessage}</span>
                </div>
              )}

              <form onSubmit={registerStep === 1 && tab === 'register' ? (event) => { event.preventDefault(); handleNextStep(); } : handleSubmit} className="space-y-4">
                {tab === 'login' ? (
                  <>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email, username or phone</label>
                      <div className="relative">
                        <AtSign className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
                        <input
                          required
                          maxLength={100}
                          autoComplete="username"
                          value={loginIdentifier}
                          onChange={(event) => setLoginIdentifier(cleanRawInput(event.target.value, 100))}
                          placeholder="you@example.com"
                          className={inputClass}
                        />
                      </div>
                      <p className="mt-1.5 text-[11px] text-slate-500">You can also use your SUBPLUG username or Nigerian phone number.</p>
                    </div>

                    {renderPasswordField(
                      'Password',
                      password,
                      setPassword,
                      showPassword,
                      setShowPassword,
                      'current-password',
                    )}

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">Keep your login details private.</span>
                      <span className="text-slate-600">Secure sign-in</span>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 bg-emerald-400 hover:bg-emerald-300 disabled:opacity-60 text-slate-950 font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="h-4 w-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                          Signing you in…
                        </>
                      ) : (
                        <>
                          Login securely
                          <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </button>
                  </>
                ) : registerStep === 1 ? (
                  <>
                    <div className="rounded-2xl bg-slate-950/50 border border-slate-800/80 p-4 mb-1">
                      <p className="text-sm font-semibold text-white">Let’s get your basic details</p>
                      <p className="text-xs text-slate-500 mt-1">These details help us identify and protect your account.</p>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">Full name</label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
                        <input
                          required
                          maxLength={60}
                          autoComplete="name"
                          value={fullName}
                          onChange={(event) => setFullName(cleanRawInput(event.target.value, 60))}
                          placeholder="e.g. John Doe"
                          className={inputClass}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">Username</label>
                      <div className="relative">
                        <AtSign className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
                        <input
                          required
                          minLength={4}
                          maxLength={20}
                          autoComplete="username"
                          value={username}
                          onChange={(event) =>
                            setUsername(event.target.value.replace(/[^a-zA-Z0-9_]/g, '').slice(0, 20).toLowerCase())
                          }
                          placeholder="e.g. johndoe_01"
                          className={inputClass}
                        />
                      </div>
                      <p className="mt-1.5 text-[11px] text-slate-500">4–20 characters · letters, numbers and underscore.</p>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">Nigerian phone number</label>
                      <div className="relative">
                        <Phone className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
                        <input
                          required
                          type="tel"
                          maxLength={14}
                          autoComplete="tel"
                          value={phone}
                          onChange={(event) => setPhone(event.target.value.replace(/[^0-9+]/g, '').slice(0, 14))}
                          placeholder="08012345678"
                          className={`${inputClass} font-mono`}
                        />
                      </div>
                      <p className="mt-1.5 text-[11px] text-slate-500">We’ll send a one-time SMS code after your email is verified.</p>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email address</label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
                        <input
                          required
                          type="email"
                          maxLength={100}
                          autoComplete="email"
                          value={email}
                          onChange={(event) => setEmail(cleanRawInput(event.target.value, 100))}
                          placeholder="you@example.com"
                          className={inputClass}
                        />
                      </div>
                      <p className="mt-1.5 text-[11px] text-slate-500">Use an email you can access. We’ll send your verification link here.</p>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3.5 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition"
                    >
                      Continue
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </>
                ) : (
                  <>
                    <div className="rounded-2xl bg-slate-950/50 border border-slate-800/80 p-4 mb-1">
                      <p className="text-sm font-semibold text-white">Protect your account</p>
                      <p className="text-xs text-slate-500 mt-1">Choose a strong password and confirm your account preferences.</p>
                    </div>

                    {renderPasswordField(
                      'Password',
                      password,
                      setPassword,
                      showPassword,
                      setShowPassword,
                      'new-password',
                    )}

                    {password && (
                      <div className="-mt-2">
                        <div className="flex items-center justify-between text-[11px] mb-1.5">
                          <span className={passwordStrength.score >= 3 ? 'text-emerald-400' : 'text-slate-500'}>
                            {passwordStrength.label}
                          </span>
                          <span className="text-slate-600">Use letters, numbers & symbols</span>
                        </div>
                        <div className="grid grid-cols-4 gap-1">
                          {[0, 1, 2, 3].map((index) => (
                            <div
                              key={index}
                              className={`h-1 rounded-full ${index < passwordStrength.score ? 'bg-emerald-400' : 'bg-slate-800'}`}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {renderPasswordField(
                      'Confirm password',
                      confirmPassword,
                      setConfirmPassword,
                      showConfirmPassword,
                      setShowConfirmPassword,
                      'new-password',
                    )}

                    {confirmPassword && password === confirmPassword && (
                      <div className="flex items-center gap-2 text-xs text-emerald-400 -mt-2">
                        <Check className="h-4 w-4" />
                        Passwords match
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Referral code <span className="text-slate-500 font-normal">(optional)</span>
                      </label>
                      <input
                        maxLength={10}
                        value={referralCode}
                        onChange={(event) => setReferralCode(sanitizeReferralCode(event.target.value))}
                        placeholder="Enter code if someone referred you"
                        className="w-full bg-slate-950/80 border border-slate-800 focus:border-emerald-400/70 focus:ring-2 focus:ring-emerald-400/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 uppercase font-mono outline-none transition"
                      />
                    </div>

                    <label className="flex items-start gap-3 rounded-2xl border border-slate-800 bg-slate-950/50 p-3.5 cursor-pointer hover:border-slate-700 transition">
                      <input
                        type="checkbox"
                        checked={agreedToTerms}
                        onChange={(event) => setAgreedToTerms(event.target.checked)}
                        className="mt-0.5 h-4 w-4 accent-emerald-400"
                      />
                      <span className="text-xs text-slate-400 leading-5">
                        I agree to SUBPLUG’s <span className="text-cyan-300">Terms of Service</span> and <span className="text-cyan-300">Privacy Policy</span>.
                      </span>
                    </label>

                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={handleBackStep}
                        className="w-12 shrink-0 py-3.5 border border-slate-700 hover:bg-slate-800 text-slate-200 rounded-xl flex items-center justify-center transition"
                        aria-label="Back to your details"
                      >
                        <ArrowLeft className="h-4 w-4" />
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 py-3.5 bg-emerald-400 hover:bg-emerald-300 disabled:opacity-60 text-slate-950 font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition"
                      >
                        {isSubmitting ? (
                          <>
                            <span className="h-4 w-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                            Creating account…
                          </>
                        ) : (
                          <>
                            Create secure account
                            <ArrowRight className="h-4 w-4" />
                          </>
                        )}
                      </button>
                    </div>
                  </>
                )}
              </form>

              <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-center gap-1.5 text-xs text-slate-500 text-center">
                <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Passwords are securely managed by Supabase.</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
