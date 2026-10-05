import React, { useState } from 'react';
import { 
  TrendingUp, 
  ArrowLeft, 
  CheckCircle2, 
  ArrowRight, 
  Coins, 
  Terminal, 
  Key, 
  ShieldCheck, 
  Zap, 
  Users, 
  Code2, 
  Check, 
  Copy,
  ChevronRight,
  HelpCircle,
  Sparkles
} from 'lucide-react';

interface VendorPageProps {
  onBackToHome: () => void;
  onOpenVendorModal: (defaultTier?: 'reseller' | 'api') => void;
  onOpenAuth: (tab: 'login' | 'register') => void;
}

export const VendorPage: React.FC<VendorPageProps> = ({
  onBackToHome,
  onOpenVendorModal,
  onOpenAuth,
}) => {
  const [dailyGbSold, setDailyGbSold] = useState(65);
  const [activeCodeTab, setActiveCodeTab] = useState<'curl' | 'nodejs' | 'python' | 'php'>('curl');
  const [copiedCode, setCopiedCode] = useState(false);

  const profitPerGb = 40; // ₦40 margin per GB
  const monthlyProfit = dailyGbSold * profitPerGb * 30;
  const daysToRecoup = Math.max(1, Math.ceil(1500 / (dailyGbSold * profitPerGb)));

  const codeSnippets = {
    curl: `curl -X POST https://api.subplug.ng/v1/topup \\
  -H "Authorization: Bearer sk_live_your_api_key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "network": "MTN",
    "plan_code": "MTN-1GB-SME",
    "phone": "08031234567",
    "reference": "TXN_78291038"
  }'`,
    nodejs: `import axios from 'axios';

const response = await axios.post(
  'https://api.subplug.ng/v1/topup',
  {
    network: 'MTN',
    plan_code: 'MTN-1GB-SME',
    phone: '08031234567',
    reference: 'TXN_' + Date.now()
  },
  {
    headers: {
      Authorization: \`Bearer \${process.env.SUBPLUG_SECRET_KEY}\`,
      'Content-Type': 'application/json'
    }
  }
);

console.log('Status:', response.data.status); // "delivered"`,
    python: `import requests

url = "https://api.subplug.ng/v1/topup"
payload = {
    "network": "MTN",
    "plan_code": "MTN-1GB-SME",
    "phone": "08031234567",
    "reference": "TXN_123456"
}
headers = {
    "Authorization": "Bearer sk_live_your_api_key",
    "Content-Type": "application/json"
}

res = requests.post(url, json=payload, headers=headers)
print(res.json())`,
    php: `<?php
$curl = curl_init();

curl_setopt_array($curl, [
  CURLOPT_URL => "https://api.subplug.ng/v1/topup",
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_CUSTOMREQUEST => "POST",
  CURLOPT_POSTFIELDS => json_encode([
    "network" => "MTN",
    "plan_code" => "MTN-1GB-SME",
    "phone" => "08031234567",
    "reference" => "TXN_" . uniqid()
  ]),
  CURLOPT_HTTPHEADER => [
    "Authorization: Bearer sk_live_your_api_key",
    "Content-Type: application/json"
  ],
]);

$response = curl_exec($curl);
curl_close($curl);
echo $response;`
  };

  const handleCopyCode = () => {
    navigator.clipboard?.writeText(codeSnippets[activeCodeTab]);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Navigation Breadcrumb & Back button */}
        <div className="flex items-center justify-between">
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer group"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to Home</span>
          </button>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="text-amber-400 font-semibold">Reseller & Developer Partner Hub</span>
            <span>·</span>
            <span>4,800+ Active Vendors</span>
          </div>
        </div>

        {/* Hero Section */}
        <div className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/20 border border-slate-800 p-8 sm:p-14 overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
              <Sparkles className="h-4 w-4" />
              <span>Certified VTU Franchise & API Gateway</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight [text-wrap:balance]">
              Build a Profitable Telecom Franchise in Nigeria.
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
              Buy data, airtime, and utility tokens at guaranteed primary wholesale prices. Whether running a physical kiosk, campus resale community, or fintech application, Subplug gives you the infrastructure to scale.
            </p>

            {/* Quick Transparent Upgrade Fee Notice */}
            <div className="p-4 rounded-2xl bg-slate-950/90 border border-amber-500/30 max-w-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-0.5">
                <div className="text-white font-bold flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  <span>One-Time Lifetime Vendor Activation Fee</span>
                </div>
                <div className="text-slate-400">
                  Reseller Tier: <strong className="text-amber-400 font-mono">₦1,500</strong> · API Partner: <strong className="text-amber-400 font-mono">₦3,500</strong>
                </div>
              </div>
              <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20 whitespace-nowrap self-start sm:self-auto">
                Zero Monthly Renewal Fees
              </span>
            </div>

            {/* Action buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <button
                onClick={() => onOpenVendorModal('reseller')}
                className="min-h-[50px] px-8 py-3.5 bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-300 hover:to-orange-300 text-slate-950 font-extrabold text-sm rounded-xl transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer group"
              >
                <span>Upgrade to Reseller (₦1,500)</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={() => onOpenVendorModal('api')}
                className="min-h-[50px] px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white font-semibold text-sm rounded-xl border border-slate-700 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Terminal className="h-4 w-4 text-amber-400" />
                <span>API Developer Portal (₦3,500)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tier Cards Comparison */}
        <div className="space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Choose Your Vendor Tier</h2>
            <p className="text-sm text-slate-400">
              Clear, transparent pricing with lifetime validity. No monthly subscriptions, hidden maintenance fees, or sales targets.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            
            {/* Tier 1: Reseller Tier */}
            <div className="rounded-3xl bg-slate-900 border-2 border-amber-500/40 p-8 flex flex-col justify-between relative shadow-xl hover:border-amber-400 transition-all">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Most Popular for Agents</span>
                    <h3 className="text-2xl font-black text-white mt-1">Reseller Agent Tier</h3>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-black text-amber-400 font-mono">₦1,500</div>
                    <div className="text-[11px] text-slate-400">One-Time Lifetime Fee</div>
                  </div>
                </div>

                <p className="text-sm text-slate-300 leading-relaxed">
                  Engineered for university campus vendors, neighbourhood cyber cafes, kiosk owners, and freelance data agents reselling directly to customers.
                </p>

                <div className="space-y-3 pt-2 border-t border-slate-800">
                  <div className="flex items-start gap-2.5 text-xs text-slate-300">
                    <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Tier-1 Wholesale Data Rates (MTN from ₦240/GB, Glo from ₦235/GB)</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs text-slate-300">
                    <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Recharge Voucher & E-Pin Generator tool for physical printing</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs text-slate-300">
                    <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Dedicated Moniepoint & Wema Bank Virtual Accounts</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs text-slate-300">
                    <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Priority WhatsApp agent resolution line</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs text-slate-300">
                    <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Recoup your ₦1,500 fee within your first 35GB of sales</span>
                  </div>
                </div>
              </div>

              <div className="pt-8">
                <button
                  onClick={() => onOpenVendorModal('reseller')}
                  className="w-full py-3.5 px-4 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm rounded-xl transition-all shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Pay ₦1,500 & Activate Reseller Tier</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Tier 2: Developer API Tier */}
            <div className="rounded-3xl bg-slate-900 border border-slate-800 p-8 flex flex-col justify-between relative shadow-xl hover:border-slate-700 transition-all">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">For Developers & FinTechs</span>
                    <h3 className="text-2xl font-black text-white mt-1">API Partner Tier</h3>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-black text-white font-mono">₦3,500</div>
                    <div className="text-[11px] text-slate-400">One-Time Lifetime Fee</div>
                  </div>
                </div>

                <p className="text-sm text-slate-300 leading-relaxed">
                  Tailored for mobile app developers, web portal operators, and enterprise platforms automating telecom dispatches via REST API.
                </p>

                <div className="space-y-3 pt-2 border-t border-slate-800">
                  <div className="flex items-start gap-2.5 text-xs text-slate-300">
                    <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Everything included in Reseller Agent Tier</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs text-slate-300">
                    <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Live & Sandbox RESTful JSON API Credentials (Bearer Auth)</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs text-slate-300">
                    <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Automated Webhook Callbacks & Instant Reversal Engine</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs text-slate-300">
                    <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Sub-350ms switch execution latency with 99.98% uptime SLA</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs text-slate-300">
                    <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Server IP Whitelisting & Custom Domain Webhooks</span>
                  </div>
                </div>
              </div>

              <div className="pt-8">
                <button
                  onClick={() => onOpenVendorModal('api')}
                  className="w-full py-3.5 px-4 bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm rounded-xl transition-all border border-slate-700 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Pay ₦3,500 & Activate API Partner</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Interactive Profit Simulator */}
        <div className="rounded-3xl bg-slate-900 border border-slate-800 p-8 sm:p-12 space-y-8">
          <div className="max-w-xl space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
              <Coins className="h-4 w-4" />
              <span>Interactive ROI Calculator</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Calculate Your Monthly Resale Earnings
            </h2>
            <p className="text-sm text-slate-400">
              Drag the slider to see how quickly you earn back your ₦1,500 one-time fee and scale into sustainable recurring income.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center justify-between text-sm font-semibold">
                <span className="text-slate-300">Daily Sales Volume:</span>
                <span className="text-xl font-bold font-mono text-amber-400 bg-amber-500/10 px-3 py-1 rounded-xl border border-amber-500/20">
                  {dailyGbSold} GB / day
                </span>
              </div>

              <input
                type="range"
                min="15"
                max="300"
                step="5"
                value={dailyGbSold}
                onChange={(e) => setDailyGbSold(Number(e.target.value))}
                className="w-full h-3 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />

              <div className="flex justify-between text-xs font-mono text-slate-500">
                <span>15 GB/day</span>
                <span>150 GB/day</span>
                <span>300 GB/day</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
                <span>Time to break even on ₦1,500 fee:</span>
                <strong className="text-emerald-400 font-bold">{daysToRecoup} day{daysToRecoup > 1 ? 's' : ''}</strong>
              </div>
            </div>

            <div className="lg:col-span-5 bg-slate-950 p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-6">
              <div className="space-y-1">
                <div className="text-xs text-slate-400">Estimated Monthly Net Profit</div>
                <div className="text-3xl sm:text-4xl font-black text-amber-400 font-mono tabular-nums">
                  ₦{monthlyProfit.toLocaleString()}
                </div>
                <div className="text-[11px] text-slate-500">Based on standard ₦40/GB customer margin</div>
              </div>

              <div className="pt-4 border-t border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Projected Annual Profit:</span>
                  <span className="font-mono font-bold text-white">₦{(monthlyProfit * 12).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>License Fee Deducted:</span>
                  <span className="font-mono text-emerald-400 font-bold">-₦1,500 (once)</span>
                </div>
              </div>

              <button
                onClick={() => onOpenVendorModal('reseller')}
                className="w-full py-3 px-4 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md shadow-amber-500/10 cursor-pointer"
              >
                Start Reselling Today
              </button>
            </div>

          </div>
        </div>

        {/* Developer API Code Playground Preview */}
        <div className="rounded-3xl bg-slate-900 border border-slate-800 p-8 sm:p-12 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
                <Code2 className="h-4 w-4" />
                <span>Developer Sandbox & SDKs</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Integrate in 10 Minutes with Clean JSON
              </h2>
              <p className="text-sm text-slate-400">
                Robust, idempotent endpoints with sub-second execution and automated refund webhooks.
              </p>
            </div>

            <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono">
              {(['curl', 'nodejs', 'python', 'php'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveCodeTab(tab)}
                  className={`px-3 py-1.5 rounded-lg capitalize transition-all cursor-pointer ${
                    activeCodeTab === tab
                      ? 'bg-emerald-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="relative rounded-2xl bg-slate-950 border border-slate-800 p-5 font-mono text-xs text-slate-200 overflow-x-auto">
            <button
              onClick={handleCopyCode}
              className="absolute top-4 right-4 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copiedCode ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copiedCode ? 'Copied' : 'Copy Code'}</span>
            </button>
            <pre className="pr-16 text-emerald-300 leading-relaxed font-mono">
              {codeSnippets[activeCodeTab]}
            </pre>
          </div>
        </div>

        {/* Vendor FAQ */}
        <div className="space-y-6 pt-4">
          <div className="text-center max-w-lg mx-auto">
            <h2 className="text-2xl font-bold text-white">Vendor Questions & Answers</h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Everything you need to know about activation fees, payouts, and API keys.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl mx-auto">
            <div className="p-6 bg-slate-900 rounded-2xl border border-slate-800 space-y-2">
              <h4 className="text-sm font-bold text-white">Is the vendor fee really a one-time charge?</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Yes, 100%. Once you pay the ₦1,500 reseller fee (or ₦3,500 for API partner tier), your account is permanently locked at wholesale rates. There are never monthly subscriptions or renewal costs.
              </p>
            </div>

            <div className="p-6 bg-slate-900 rounded-2xl border border-slate-800 space-y-2">
              <h4 className="text-sm font-bold text-white">How do I fund my vendor balance?</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                You receive automated dedicated virtual accounts (Moniepoint, Wema, Sterling) tied directly to your agency wallet. Any transfer from any Nigerian bank reflects instantly 24/7.
              </p>
            </div>

            <div className="p-6 bg-slate-900 rounded-2xl border border-slate-800 space-y-2">
              <h4 className="text-sm font-bold text-white">What happens if a customer’s phone number fails?</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                If the upstream telco switch reports a dead line or invalid port, our system auto-reverses the transaction within 3 seconds, instantly restoring your wallet balance.
              </p>
            </div>

            <div className="p-6 bg-slate-900 rounded-2xl border border-slate-800 space-y-2">
              <h4 className="text-sm font-bold text-white">Can I print physical recharge cards with my brand?</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Yes! Our Recharge Card Printing engine generates encrypted e-pins that you can print with any 58mm Bluetooth printer or standard office paper, customized with your shop name.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
