import React from 'react';
import { ShieldCheck, Clock, Award, Building2, CheckCircle2 } from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Text & Credibility */}
          <div className="lg:col-span-6 space-y-6">
            <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              Built for Nigerian Consumers & Merchants
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight [text-wrap:balance]">
              Why Choose Subplug?
            </h2>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
              In an industry where delays, failed transactions, and unresponsive customer service are all too common, SUBPLUG was engineered from the ground up for speed, transparency, and rock-solid reliability.
            </p>

            <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
              We connect directly with Nigeria’s tier-1 telecom servers and power distribution switches. Whether you are purchasing 1GB of data in the middle of the night, generating a prepaid meter token, or running a 10,000-user reseller API, our automated infrastructure ensures you never experience downtime.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-sm text-slate-300">
                  <strong className="text-white">Zero Delayed Credits:</strong> Automated switch webhooks verify every transaction instantly.
                </span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-sm text-slate-300">
                  <strong className="text-white">Direct Virtual Bank Accounts:</strong> Instant funding via Moniepoint, Wema, and Sterling Bank.
                </span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-sm text-slate-300">
                  <strong className="text-white">Real Human Support:</strong> Reach our Lagos-based support team 24/7 via WhatsApp and phone.
                </span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-sm text-slate-300">
                  <strong className="text-white">Refund Guarantee:</strong> Automatic instant wallet reversal for any rare telecom system bounce.
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Quantitative Proof Metrics Cards */}
          <div className="lg:col-span-6 grid grid-cols-2 gap-4 sm:gap-6">
            <div className="p-6 bg-slate-900 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 mb-2">
                <Clock className="h-5 w-5" />
              </div>
              <div className="text-3xl font-extrabold text-white font-mono tabular-nums">
                3.2s
              </div>
              <div className="text-xs sm:text-sm font-semibold text-slate-300">Average Dispatch Speed</div>
              <div className="text-xs text-slate-500">Sub-second auto-routing on all telco network bands.</div>
            </div>

            <div className="p-6 bg-slate-900 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 mb-2">
                <Award className="h-5 w-5" />
              </div>
              <div className="text-3xl font-extrabold text-white font-mono tabular-nums">
                99.98%
              </div>
              <div className="text-xs sm:text-sm font-semibold text-slate-300">Automated Uptime SLA</div>
              <div className="text-xs text-slate-500">Redundant server clusters hosted across multiple data centers.</div>
            </div>

            <div className="p-6 bg-slate-900 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 mb-2">
                <Building2 className="h-5 w-5" />
              </div>
              <div className="text-3xl font-extrabold text-white font-mono tabular-nums">
                48,000+
              </div>
              <div className="text-xs sm:text-sm font-semibold text-slate-300">Registered Users</div>
              <div className="text-xs text-slate-500">Individual subscribers, students, and professional vendors nationwide.</div>
            </div>

            <div className="p-6 bg-slate-900 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 mb-2">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div className="text-3xl font-extrabold text-white font-mono tabular-nums">
                ₦420M+
              </div>
              <div className="text-xs sm:text-sm font-semibold text-slate-300">Monthly Volume</div>
              <div className="text-xs text-slate-500">Secure transactions processed across all 36 Nigerian states.</div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
