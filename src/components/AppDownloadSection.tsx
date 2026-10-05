import React, { useState } from 'react';
import { Smartphone, QrCode, Download, Fingerprint, Bell, Shield, Check } from 'lucide-react';

export const AppDownloadSection: React.FC = () => {
  const [downloadStarted, setDownloadStarted] = useState(false);

  const handleDownload = () => {
    setDownloadStarted(true);
    setTimeout(() => setDownloadStarted(false), 4000);
  };

  return (
    <section id="app-download" className="py-16 sm:py-20 relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 p-8 sm:p-12 lg:p-16 overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Column: Text & Play Store Badges */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
                <Smartphone className="h-4 w-4" />
                <span>Mobile Experience</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight [text-wrap:balance]">
                Manage Your Transactions On the Go.
              </h2>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-xl">
                Download our Android app for faster, smoother, and more secure transactions. Recharge data in 3 seconds even with poor network connectivity.
              </p>

              {/* Perks grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="flex items-center gap-2.5 text-sm text-slate-300">
                  <Fingerprint className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Biometric Login & PIN</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm text-slate-300">
                  <Bell className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Instant Receipt Notifications</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm text-slate-300">
                  <Shield className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>2-Factor Security Protection</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm text-slate-300">
                  <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Offline USSD Fallback Mode</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex flex-wrap items-center gap-4">
                {/* Official styled Google Play Badge */}
                <button
                  onClick={handleDownload}
                  className="min-h-[50px] px-6 py-3 bg-black hover:bg-slate-900 border border-slate-700 rounded-xl flex items-center gap-3 transition-colors text-left cursor-pointer group"
                >
                  <svg className="h-7 w-7 fill-white shrink-0" viewBox="0 0 24 24">
                    <path d="M3.609 1.814L13.793 12 3.61 22.186a1.97 1.97 0 0 1-.61-1.428V3.242c0-.54.22-1.03.609-1.428zm11.597 11.6L6.84 21.78l10.87-6.28-2.504-2.086zm0-2.828l2.504-2.086L6.84 2.22l8.366 8.366zm1.414 1.414l3.18-1.838a1.643 1.643 0 0 0 0-2.846l-3.18-1.838-1.828 1.523 1.828 1.523z"/>
                  </svg>
                  <div>
                    <div className="text-[10px] uppercase text-slate-400 tracking-wider">Get it on</div>
                    <div className="text-sm font-bold text-white leading-tight">Google Play</div>
                  </div>
                </button>

                {/* Direct APK Download Button */}
                <button
                  onClick={handleDownload}
                  className="min-h-[50px] px-5 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white rounded-xl flex items-center gap-2 text-sm font-semibold transition-colors cursor-pointer"
                >
                  <Download className="h-4 w-4 text-emerald-400" />
                  <span>Download APK (12.4 MB)</span>
                </button>
              </div>

              {downloadStarted && (
                <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5 animate-in fade-in">
                  <Check className="h-4 w-4" />
                  <span>Downloading Subplug Mobile App v3.4.1 for Android...</span>
                </div>
              )}
            </div>

            {/* Right Column: Clean QR Code Card for Instant Scan */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center">
              <div className="p-6 bg-slate-950 rounded-2xl border border-slate-800 text-center max-w-xs w-full shadow-xl">
                <div className="mx-auto w-44 h-44 bg-white p-3 rounded-xl flex items-center justify-center shadow-inner">
                  {/* High fidelity SVG QR representation */}
                  <svg className="w-full h-full text-slate-950" viewBox="0 0 100 100" fill="currentColor">
                    {/* Corner 1 */}
                    <rect x="5" y="5" width="26" height="26" rx="3" fill="none" stroke="currentColor" strokeWidth="4"/>
                    <rect x="12" y="12" width="12" height="12" rx="1"/>
                    {/* Corner 2 */}
                    <rect x="69" y="5" width="26" height="26" rx="3" fill="none" stroke="currentColor" strokeWidth="4"/>
                    <rect x="76" y="12" width="12" height="12" rx="1"/>
                    {/* Corner 3 */}
                    <rect x="5" y="69" width="26" height="26" rx="3" fill="none" stroke="currentColor" strokeWidth="4"/>
                    <rect x="12" y="76" width="12" height="12" rx="1"/>
                    {/* Center decorative data points */}
                    <rect x="36" y="10" width="8" height="8" />
                    <rect x="50" y="14" width="6" height="14" />
                    <rect x="38" y="24" width="6" height="6" />
                    <rect x="10" y="38" width="6" height="8" />
                    <rect x="22" y="44" width="8" height="6" />
                    <rect x="36" y="36" width="28" height="28" rx="4" fill="#10b981" />
                    <circle cx="50" cy="50" r="6" fill="#020617" />
                    <rect x="70" y="38" width="10" height="6" />
                    <rect x="84" y="46" width="8" height="12" />
                    <rect x="38" y="70" width="8" height="8" />
                    <rect x="52" y="78" width="12" height="6" />
                    <rect x="72" y="72" width="8" height="18" />
                    <rect x="84" y="82" width="8" height="8" />
                  </svg>
                </div>

                <div className="mt-4">
                  <div className="text-xs font-bold text-white flex items-center justify-center gap-1.5">
                    <QrCode className="h-4 w-4 text-emerald-400" />
                    <span>Scan with Your Camera</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Instant redirect to Google Play APK installation
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
