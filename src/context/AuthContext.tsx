import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import { normalizeNigerianPhoneE164, normalizeUsername } from '../utils/security';

type AuthContextValue = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  configured: boolean;
  signIn: (identifier: string, password: string) => Promise<void>;
  signUp: (input: {
    email: string;
    username: string;
    password: string;
    fullName: string;
    phone: string;
    referralCode?: string;
  }) => Promise<{ needsEmailConfirmation: boolean }>;
  resendVerificationEmail: (email: string) => Promise<void>;
  startPhoneVerification: (phone: string) => Promise<void>;
  resendPhoneVerification: (phone: string) => Promise<void>;
  verifyPhoneOtp: (phone: string, token: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const isEmailIdentifier = (value: string) => value.includes('@');

const isPhoneIdentifier = (value: string) => {
  const digits = value.replace(/\D/g, '');
  return /^0[789][01]\d{8}$/.test(digits) || /^234[789][01]\d{8}$/.test(digits);
};

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    let mounted = true;

    supabase.auth.getSession().then(({ data, error }) => {
      if (!mounted) return;
      if (error) console.error('Unable to restore auth session:', error.message);
      setSession(data.session ?? null);
      setLoading(false);
    });

    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (mounted) setSession(nextSession);
    });

    return () => {
      mounted = false;
      data.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    user: session?.user ?? null,
    session,
    loading,
    configured: isSupabaseConfigured,

    signIn: async (identifier, password) => {
      if (!supabase) throw new Error('Authentication is not configured yet.');

      const raw = identifier.trim();
      if (!raw) throw new Error('Enter your email, username or phone number.');

      if (isEmailIdentifier(raw)) {
        const { error } = await supabase.auth.signInWithPassword({
          email: raw.toLowerCase(),
          password,
        });
        if (error) throw new Error('Invalid login credentials or the account has not completed verification.');
        return;
      }

      if (isPhoneIdentifier(raw)) {
        const { error } = await supabase.auth.signInWithPassword({
          phone: normalizeNigerianPhoneE164(raw),
          password,
        });
        if (error) throw new Error('Invalid login credentials or the account has not completed verification.');
        return;
      }

      const { data, error } = await supabase.functions.invoke('login-with-identifier', {
        body: { identifier: normalizeUsername(raw), password },
      });

      if (error || !data?.session) {
        throw new Error('Invalid login credentials or the account has not completed verification.');
      }

      const { error: sessionError } = await supabase.auth.setSession({
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
      });

      if (sessionError) throw new Error('Unable to establish the secure session. Please try again.');
    },

    signUp: async ({ email, username, password, fullName, phone, referralCode }) => {
      if (!supabase) throw new Error('Authentication is not configured yet.');

      const normalizedPhone = normalizeNigerianPhoneE164(phone);
      const normalizedUsername = normalizeUsername(username);

      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          data: {
            full_name: fullName.trim(),
            username: normalizedUsername,
            phone: normalizedPhone,
            referred_by_code: referralCode?.trim().toUpperCase() || null,
          },
          emailRedirectTo: window.location.origin,
        },
      });

      if (error) {
        const message = error.message.toLowerCase();
        if (message.includes('username') || message.includes('phone')) {
          throw new Error('That username or phone number is already in use. Please choose another.');
        }
        throw new Error(error.message);
      }

      return { needsEmailConfirmation: !data.session };
    },

    resendVerificationEmail: async (email) => {
      if (!supabase) throw new Error('Authentication is not configured yet.');

      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email.trim().toLowerCase(),
        options: { emailRedirectTo: window.location.origin },
      });

      if (error) throw new Error(error.message);
    },

    startPhoneVerification: async (phone) => {
      if (!supabase) throw new Error('Authentication is not configured yet.');

      const { error } = await supabase.auth.updateUser({
        phone: normalizeNigerianPhoneE164(phone),
      });

      if (error) throw new Error(error.message);
    },

    resendPhoneVerification: async (phone) => {
      if (!supabase) throw new Error('Authentication is not configured yet.');

      const { error } = await supabase.auth.resend({
        type: 'phone_change',
        phone: normalizeNigerianPhoneE164(phone),
      });

      if (error) throw new Error(error.message);
    },

    verifyPhoneOtp: async (phone, token) => {
      if (!supabase) throw new Error('Authentication is not configured yet.');

      const { data, error } = await supabase.auth.verifyOtp({
        phone: normalizeNigerianPhoneE164(phone),
        token: token.trim(),
        type: 'phone_change',
      });

      if (error || !data.user) throw new Error(error?.message || 'The verification code is invalid or expired.');
    },

    signOut: async () => {
      if (!supabase) return;
      const { error } = await supabase.auth.signOut();
      if (error) throw new Error(error.message);
    },
  }), [loading, session]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
};
