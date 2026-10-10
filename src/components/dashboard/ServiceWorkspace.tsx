/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Smartphone,
  Wifi,
  Zap,
  Cable,
  CreditCard,
  GraduationCap,
  ReceiptText,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Info,
} from 'lucide-react';
import { NetworkProvider } from '../../types';
import { DATA_PLANS } from '../../data/mockData';
import { TransactionPinModal } from './TransactionPinModal';

type ServiceSectionType =
  | 'airtime'
  | 'data'
  | 'electricity'
  | 'cable'
  | 'data-pins'
  | 'exam-pins'
  | 'recharge';

interface ServiceWorkspaceProps {
  section: ServiceSectionType;
}

export const ServiceWorkspace: React.FC<ServiceWorkspaceProps> = ({ section }) => {
  const [network, setNetwork] = useState<NetworkProvider>('MTN');
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState('1000');
  const [selectedPlanId, setSelectedPlanId] = useState('mtn-1gb');
  const [meterNumber, setMeterNumber] = useState('');
  const [disco, setDisco] = useState('IKEDC (Ikeja Electric)');
  const [smartcard, setSmartcard] = useState('');
  const [cableProvider, setCableProvider] = useState('DStv');
  const [quantity, setQuantity] = useState(1);
  const [pinModalOpen, setPinModalOpen] = useState(false);
  const [statusNotice, setStatusNotice] = useState<string | null>(null);

  const configs = {
    airtime: {
      title: 'Buy Airtime',
      desc: 'Top up any Nigerian network instantly with up to 3% discount.',
      icon: Smartphone,
    },
    data: {
      title: 'Buy Data Bundles',
      desc: 'Instant SME, Corporate Gifting & Direct data bundles with 30-day validity.',
      icon: Wifi,
    },
    electricity: {
      title: 'Electricity Token Bills',
      desc: 'Pay prepaid or postpaid electricity meter bills with instant token generation.',
      icon: Zap,
    },
    cable: {
      title: 'Cable TV Subscription',
      desc: 'Renew DStv, GOtv, and StarTimes decoder bouquets with 1-click renewal.',
      icon: Cable,
    },
    'data-pins': {
      title: 'Purchase Data PINs',
      desc: 'Generate printable encrypted data PINs for physical resale and kiosk vending.',
      icon: CreditCard,
    },
    'exam-pins': {
      title: 'Exam Result Checker PINs',
      desc: 'Purchase official WAEC, NECO, and NABTEB result-checking scratch cards.',
      icon: GraduationCap,
    },
    recharge: {
      title: 'Recharge Card Printing',
      desc: 'Print branded physical recharge vouchers with your business name stamped.',
      icon: ReceiptText,
    },
  };

  const currentConfig = configs[section] || configs.airtime;
  const Icon = currentConfig.icon;

  const filteredPlans = DATA_PLANS.filter((p) => p.network === network);
  const currentPlan = DATA_PLANS.find((p) => p.id === selectedPlanId) || filteredPlans[0];

  const handleStartPurchase = (e: React.FormEvent) => {
    e.preventDefault();
    setStatusNotice(null);
    setPinModalOpen(true);
  };

  const handlePinVerified = () => {
    setPinModalOpen(false);
    setStatusNotice('Demo only — live transaction processing is not connected yet.');
  };

  const calculatedAmount =
    section === 'data'
      ? currentPlan?.userPrice || 260
      : section === 'exam-pins'
      ? 3500 * quantity
      : parseFloat(amount) || 1000;

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* 1. Header Banner */}
      <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/30 p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-bold tracking-wide">
            <Icon className="h-3.5 w-3.5" />
            <span>DISPATCH SWITCH (DEMO)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {currentConfig.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {currentConfig.desc}
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs space-y-1 shrink-0">
          <div className="flex items-center gap-1.5 font-bold text-amber-400 font-mono">
            <ShieldCheck className="h-4 w-4" />
            <span>Demo Mode</span>
          </div>
          <div className="text-[11px] text-slate-400">
            PIN check simulated in frontend
          </div>
        </div>
      </div>

      {statusNotice && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-start gap-3">
          <Info className="h-4 w-4 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="font-bold">Demo Notice</div>
            <p className="text-slate-300">{statusNotice}</p>
          </div>
        </div>
      )}

      {/* 2. Order Details Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 rounded-3xl border border-slate-800 bg-slate-900/80 p-6 sm:p-7 space-y-5">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
            Transaction Parameters
          </h2>

          <form onSubmit={handleStartPurchase} className="space-y-4">
            {/* Network Provider Selector (For telecom services) */}
            {['airtime', 'data', 'data-pins', 'recharge'].includes(section) && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Select Network
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(['MTN', 'Airtel', 'Glo', '9mobile'] as NetworkProvider[]).map((net) => (
                    <button
                      key={net}
                      type="button"
                      onClick={() => setNetwork(net)}
                      className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        network === net
                          ? 'border-emerald-400 bg-emerald-500/10 text-white'
                          : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                      }`}
                    >
                      {net}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Data Plan Selector */}
            {section === 'data' && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Data Plan
                </label>
                <select
                  value={selectedPlanId}
                  onChange={(e) => setSelectedPlanId(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  {filteredPlans.map((plan) => (
                    <option key={plan.id} value={plan.id}>
                      {plan.name} — ₦{plan.userPrice.toLocaleString()} ({plan.validity})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Recipient Phone */}
            {['airtime', 'data', 'data-pins'].includes(section) && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Recipient Nigerian Phone Number
                </label>
                <input
                  type="tel"
                  required
                  placeholder="0801 234 5678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-white font-mono placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                />
              </div>
            )}

            {/* Airtime Amount */}
            {section === 'airtime' && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Airtime Recharge Amount (₦)
                </label>
                <input
                  type="number"
                  min="50"
                  max="50000"
                  required
                  placeholder="1000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-white font-mono placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                />
              </div>
            )}

            {/* Electricity Fields */}
            {section === 'electricity' && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Distribution Company (DisCo)
                  </label>
                  <select
                    value={disco}
                    onChange={(e) => setDisco(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="IKEDC">IKEDC (Ikeja Electric)</option>
                    <option value="EKEDC">EKEDC (Eko Electric)</option>
                    <option value="AEDC">AEDC (Abuja Electric)</option>
                    <option value="IBEDC">IBEDC (Ibadan Electric)</option>
                    <option value="PHED">PHED (Port Harcourt Electric)</option>
                    <option value="KEDCO">KEDCO (Kano Electric)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Meter Number (Prepaid / Postpaid)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter 11 or 13-digit meter number"
                    value={meterNumber}
                    onChange={(e) => setMeterNumber(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-white font-mono placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Token Amount (₦)
                  </label>
                  <input
                    type="number"
                    min="1000"
                    required
                    placeholder="2000"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-white font-mono placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </>
            )}

            {/* Cable Fields */}
            {section === 'cable' && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Cable TV Provider
                  </label>
                  <select
                    value={cableProvider}
                    onChange={(e) => setCableProvider(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="DStv">DStv</option>
                    <option value="GOtv">GOtv</option>
                    <option value="StarTimes">StarTimes</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Smartcard / IUC Number
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="10-digit smartcard number"
                    value={smartcard}
                    onChange={(e) => setSmartcard(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-white font-mono placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </>
            )}

            {/* Exam Pins */}
            {section === 'exam-pins' && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Quantity of Examination PINs
                </label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-white font-mono placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                />
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-emerald-500/10"
            >
              <span>Authorize Purchase with PIN (₦{calculatedAmount.toLocaleString()})</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </div>

        {/* Right Column: Order Summary Card */}
        <div className="lg:col-span-5 rounded-3xl border border-slate-800 bg-slate-900/80 p-6 flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Purchase Summary
            </h3>

            <div className="space-y-2.5 rounded-2xl bg-slate-950 p-4 border border-slate-800 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Service:</span>
                <span className="text-white font-semibold">{currentConfig.title}</span>
              </div>

              {['airtime', 'data', 'data-pins'].includes(section) && (
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Network:</span>
                  <span className="text-emerald-400 font-bold">{network}</span>
                </div>
              )}

              {section === 'data' && (
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Selected Plan:</span>
                  <span className="text-white font-mono">{currentPlan?.name}</span>
                </div>
              )}

              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Delivery SLA:</span>
                <span className="text-emerald-400 font-mono font-bold">1–3 Seconds</span>
              </div>

              <div className="flex justify-between py-1 pt-2 text-sm">
                <span className="text-slate-300 font-bold">Total Amount:</span>
                <span className="text-emerald-400 font-mono font-bold">
                  ₦{calculatedAmount.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 space-y-1">
              <div className="font-semibold text-slate-300">Security Requirement:</div>
              <div>• Sensitive transactions require 4-digit PIN verification.</div>
              <div>• Airtime-to-Cash is exempt from PIN and gated by KYC instead.</div>
            </div>
          </div>

          <div className="text-[10px] text-slate-500 italic text-center">
            *Live transaction dispatches are safely protected until the backend gateway is connected.
          </div>
        </div>
      </div>

      {/* Transaction PIN Verification Modal */}
      <TransactionPinModal
        isOpen={pinModalOpen}
        serviceTitle={currentConfig.title}
        amount={calculatedAmount}
        recipient={phone || meterNumber || smartcard || 'Self'}
        onClose={() => setPinModalOpen(false)}
        onPinVerified={handlePinVerified}
      />
    </div>
  );
};
