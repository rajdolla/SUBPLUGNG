/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Gift,
  Tag,
  Share2,
  Ticket,
  Percent,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  RotateCcw,
  ShieldCheck,
  Calendar,
  Sparkles,
  Lock,
  KeyRound,
  UserCheck,
} from 'lucide-react';
import { useCms } from '../../context/CmsContext';
import {
  PromoRewardItem,
  CouponItem,
  CashbackRule,
  VoucherItem,
} from '../../types/cms';
import { AdminPointsWorkspace } from './AdminPointsWorkspace';

export const AdminRewardsWorkspace: React.FC = () => {
  const {
    promos,
    addPromo,
    togglePromoActive,
    deletePromo,
    coupons,
    addCoupon,
    toggleCouponActive,
    deleteCoupon,
    cashbackRules,
    referralRules,
    vouchers,
    voucherBatchAudits,
    activeAdminRole,
    setActiveAdminRole,
    hasPermission,
    generateVouchers,
    toggleVoucherStatus,
    rewardLedger,
    pointsCatalogue,
  } = useCms();

  const [activeTab, setActiveTab] = useState<
    'vouchers' | 'points' | 'promotions' | 'coupons' | 'cashback' | 'referrals' | 'ledger'
  >('vouchers');

  const [statusNotice, setStatusNotice] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Voucher generator form state
  const [vGenCount, setVGenCount] = useState<number>(5);
  const [vGenValue, setVGenValue] = useState<number>(2000);
  const [vGenPrefix, setVGenPrefix] = useState<string>('SP');
  const [vGenExpiry, setVGenExpiry] = useState<string>('2026-12-31');

  // Coupon creator form state
  const [couponModalOpen, setCouponModalOpen] = useState(false);
  const [cpCode, setCpCode] = useState('');
  const [cpTitle, setCpTitle] = useState('');
  const [cpValue, setCpValue] = useState(100);
  const [cpType, setCpType] = useState<'fixed' | 'percentage'>('fixed');
  const [cpMinPurchase, setCpMinPurchase] = useState(1000);
  const [cpLimit, setCpLimit] = useState(500);
  const [cpExpiry, setCpExpiry] = useState('2026-12-31');

  const notify = (text: string, type: 'success' | 'error' = 'success') => {
    setStatusNotice({ text, type });
    setTimeout(() => setStatusNotice(null), 6000);
  };

  const handleGenerateVouchers = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasPermission('voucher.create')) {
      notify('Permission Denied: voucher.create permission required.', 'error');
      return;
    }

    const res = generateVouchers({
      count: Number(vGenCount) || 1,
      value: Number(vGenValue) || 1000,
      prefix: vGenPrefix.trim().toUpperCase() || 'SP',
      expiryDate: vGenExpiry,
    });

    if (res.success) {
      notify(res.message, 'success');
    } else {
      notify(res.message, 'error');
    }
  };

  const handleToggleVoucher = (id: string, newStatus: VoucherItem['status']) => {
    const res = toggleVoucherStatus(id, newStatus);
    if (res.success) {
      notify(res.message, 'success');
    } else {
      notify(res.message, 'error');
    }
  };

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cpCode.trim() || !cpTitle.trim()) return;

    addCoupon({
      code: cpCode.trim().toUpperCase(),
      title: cpTitle.trim(),
      discountType: cpType,
      value: Number(cpValue) || 50,
      minPurchase: Number(cpMinPurchase) || 500,
      maxDiscount: cpType === 'fixed' ? Number(cpValue) : 500,
      expiryDate: cpExpiry,
      usageCount: 0,
      usageLimit: Number(cpLimit) || 100,
      isActive: true,
    });

    notify(`Coupon ${cpCode.trim().toUpperCase()} created successfully.`);
    setCouponModalOpen(false);
    setCpCode('');
    setCpTitle('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* 1. Header Banner */}
      <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/30 p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-mono font-bold tracking-wide">
            <Gift className="h-3.5 w-3.5" />
            <span>ADMIN REWARDS & VOUCHER MANAGEMENT</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Rewards Administration
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Configure cashback rates, coupon codes, referral rules, batch-generate prepaid funding vouchers, and monitor the rewards ledger.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-1 text-slate-400">
          <div className="text-white font-bold flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>Separation of Wallets Rule</span>
          </div>
          <p className="text-[11px] leading-relaxed">
            Voucher funding directly increases <strong>Main Wallet</strong>.
            Cashback and referrals fund <strong>Bonus Wallet</strong>.
          </p>
        </div>
      </div>

      {statusNotice && (
        <div
          className={`p-3.5 rounded-xl border text-xs flex items-center gap-2 animate-in fade-in ${
            statusNotice.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
          }`}
        >
          {statusNotice.type === 'success' ? (
            <CheckCircle2 className="h-4 w-4 shrink-0" />
          ) : (
            <AlertCircle className="h-4 w-4 shrink-0" />
          )}
          <span>{statusNotice.text}</span>
        </div>
      )}

      {/* Role & Authorization Simulator Bar (Auditing & Security Verification) */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div
            className={`p-2 rounded-xl ${
              hasPermission('voucher.create')
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
            }`}
          >
            {hasPermission('voucher.create') ? <UserCheck className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
          </div>
          <div>
            <div className="font-bold text-white flex items-center gap-2 flex-wrap">
              <span>Admin Role:</span>
              <span className="font-mono text-cyan-400 uppercase">
                {activeAdminRole.replace('_', ' ')}
              </span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                  hasPermission('voucher.create')
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                }`}
              >
                voucher.create: {hasPermission('voucher.create') ? 'AUTHORIZED' : 'RESTRICTED'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              {hasPermission('voucher.create')
                ? 'Authorized for voucher generation within permitted limits.'
                : 'Read-only audit access. Voucher generation, issue, and status modifications are disabled.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[11px] text-slate-500 font-mono">Verify Role:</span>
          <button
            type="button"
            onClick={() => setActiveAdminRole('voucher_manager')}
            className={`px-2.5 py-1.5 rounded-lg border text-[11px] font-semibold cursor-pointer transition-colors ${
              activeAdminRole === 'voucher_manager'
                ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Voucher Manager
          </button>
          <button
            type="button"
            onClick={() => setActiveAdminRole('standard_admin')}
            className={`px-2.5 py-1.5 rounded-lg border text-[11px] font-semibold cursor-pointer transition-colors ${
              activeAdminRole === 'standard_admin'
                ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Standard Admin (Read-Only)
          </button>
          <button
            type="button"
            onClick={() => setActiveAdminRole('super_admin')}
            className={`px-2.5 py-1.5 rounded-lg border text-[11px] font-semibold cursor-pointer transition-colors ${
              activeAdminRole === 'super_admin'
                ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Super Admin
          </button>
        </div>
      </div>

      {/* 2. Admin Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800/80 pb-3 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('vouchers')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'vouchers'
              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent'
          }`}
        >
          <Ticket className="h-4 w-4" />
          <span>Voucher Generation ({vouchers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('points')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'points'
              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent'
          }`}
        >
          <Sparkles className="h-4 w-4" />
          <span>SUBPLUG Points ({pointsCatalogue.length} Catalogue)</span>
          <span className="px-1.5 py-0.5 rounded text-[9px] bg-amber-500/20 text-amber-300 font-mono">
            Spec
          </span>
        </button>

        <button
          onClick={() => setActiveTab('promotions')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'promotions'
              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent'
          }`}
        >
          <Tag className="h-4 w-4" />
          <span>Promotions ({promos.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('coupons')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'coupons'
              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent'
          }`}
        >
          <Gift className="h-4 w-4" />
          <span>Discount Coupons ({coupons.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('cashback')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'cashback'
              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent'
          }`}
        >
          <Percent className="h-4 w-4" />
          <span>Cashback Rules ({cashbackRules.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('referrals')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'referrals'
              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent'
          }`}
        >
          <Share2 className="h-4 w-4" />
          <span>Referral Rules ({referralRules.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('ledger')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'ledger'
              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent'
          }`}
        >
          <FileSpreadsheet className="h-4 w-4" />
          <span>Reward Ledger</span>
        </button>
      </div>

      {/* 3. TAB A: VOUCHER GENERATION & REDEMPTIONS */}
      {activeTab === 'vouchers' && (
        <div className="space-y-6 animate-in fade-in">
          
          {/* Permission Gate Check: voucher.create */}
          {!hasPermission('voucher.create') ? (
            <div className="rounded-3xl border border-rose-500/30 bg-rose-500/5 p-6 sm:p-8 space-y-4 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
                  <Lock className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <span>Voucher Generation Restricted</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-rose-500/20 text-rose-300 font-bold uppercase">
                      voucher.create Required
                    </span>
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed mt-0.5">
                    Not every admin may generate vouchers. Your active role (<strong>{activeAdminRole.replace('_', ' ')}</strong>) has read-only audit access.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs text-slate-400 space-y-2">
                <div className="font-semibold text-slate-200 flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-amber-400" />
                  <span>Security & Ledger Segregation Policy</span>
                </div>
                <p className="leading-relaxed">
                  General admins without explicit <code>voucher.create</code> authorization must not create, issue, or modify voucher codes. Only authorized Voucher Managers or Super Admins with database-enforced permissions can mint funding batches.
                </p>
                <div className="text-[11px] font-mono text-emerald-400/90 pt-1">
                  Tip: Use the role switcher above to simulate & verify authorized Voucher Manager behavior.
                </div>
              </div>
            </div>
          ) : (
            /* Authorized Generation Form */
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 sm:p-8 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <Ticket className="h-5 w-5 text-amber-400" />
                    <span>Batch Generate Prepaid Funding Vouchers</span>
                  </h2>
                  <p className="text-xs text-slate-400">
                    Authorized Voucher Manager Mode. Batches directly credit user Main Wallets upon redemption.
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  voucher.create: Authorized
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between gap-4 flex-wrap">
                <span className="text-slate-300 font-medium">Permitted Batch Limits:</span>
                <span className="text-amber-400 font-mono">Max {activeAdminRole === 'super_admin' ? '50' : '20'} Vouchers</span>
                <span className="text-slate-500">·</span>
                <span className="text-emerald-400 font-mono">Max Face Value ₦{activeAdminRole === 'super_admin' ? '50,000' : '10,000'}</span>
                <span className="text-slate-500">·</span>
                <span className="text-cyan-400 font-mono">Audited Actor: {activeAdminRole}</span>
              </div>

              <form onSubmit={handleGenerateVouchers} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Batch Count (Vouchers)</label>
                  <select
                    value={vGenCount}
                    onChange={(e) => setVGenCount(Number(e.target.value))}
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none"
                  >
                    <option value={1}>1 Voucher</option>
                    <option value={5}>5 Vouchers</option>
                    <option value={10}>10 Vouchers</option>
                    <option value={20}>20 Vouchers</option>
                    {activeAdminRole === 'super_admin' && <option value={50}>50 Vouchers (Super Admin)</option>}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Face Value (₦)</label>
                  <select
                    value={vGenValue}
                    onChange={(e) => setVGenValue(Number(e.target.value))}
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none"
                  >
                    <option value={500}>₦500</option>
                    <option value={1000}>₦1,000</option>
                    <option value={2000}>₦2,000</option>
                    <option value={5000}>₦5,000</option>
                    <option value={10000}>₦10,000</option>
                    {activeAdminRole === 'super_admin' && <option value={20000}>₦20,000 (Super Admin)</option>}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Voucher Prefix</label>
                  <input
                    type="text"
                    value={vGenPrefix}
                    onChange={(e) => setVGenPrefix(e.target.value.toUpperCase())}
                    placeholder="SP"
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono uppercase focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Expiry Date</label>
                  <input
                    type="date"
                    value={vGenExpiry}
                    onChange={(e) => setVGenExpiry(e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none font-mono"
                  />
                </div>

                <div className="sm:col-span-2 lg:col-span-4 pt-2">
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20 active:scale-[0.99]"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Generate Authorized Voucher Batch</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Vouchers Table */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Configured Vouchers ({vouchers.length})</h3>
              <span className="text-xs text-slate-400 font-mono">Target: Main Wallet Funding Only</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-mono uppercase text-[10px]">
                    <th className="py-2.5 px-3">Voucher Code</th>
                    <th className="py-2.5 px-3">Value</th>
                    <th className="py-2.5 px-3">Target Wallet</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Expiry</th>
                    <th className="py-2.5 px-3">Redeemer</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {vouchers.map((v) => (
                    <tr key={v.id} className="hover:bg-slate-950/40 transition-colors">
                      <td className="py-2.5 px-3 font-mono font-bold text-white">{v.code}</td>
                      <td className="py-2.5 px-3 font-mono font-bold text-emerald-400">
                        ₦{v.value.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-[10px] text-emerald-400">
                        Main Wallet
                      </td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                            v.status === 'unused'
                              ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                              : v.status === 'redeemed'
                              ? 'bg-slate-800 text-slate-400'
                              : 'bg-rose-500/10 text-rose-400'
                          }`}
                        >
                          {v.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-mono text-slate-400">{v.expiryDate}</td>
                      <td className="py-2.5 px-3 text-slate-400">
                        {v.redeemerEmail || '—'}
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        {!hasPermission('voucher.cancel') ? (
                          <span className="text-[10px] text-slate-500 font-mono">View Only</span>
                        ) : v.status === 'unused' ? (
                          <button
                            onClick={() => handleToggleVoucher(v.id, 'cancelled')}
                            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-rose-950 text-slate-300 hover:text-rose-300 text-[10px] font-semibold cursor-pointer"
                          >
                            Cancel
                          </button>
                        ) : v.status === 'cancelled' ? (
                          <button
                            onClick={() => handleToggleVoucher(v.id, 'unused')}
                            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-semibold cursor-pointer"
                          >
                            Restore
                          </button>
                        ) : (
                          <span className="text-[10px] text-slate-500 font-mono">Processed</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Dedicated Voucher Batch Audit Log */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  <span>Voucher Batch Generation Audit Log ({voucherBatchAudits.length} Records)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Immutable record of who generated voucher batches, units, and timestamps.
                </p>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                Audited
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-mono uppercase text-[10px]">
                    <th className="py-2.5 px-3">Batch ID</th>
                    <th className="py-2.5 px-3">Actor Email</th>
                    <th className="py-2.5 px-3">Role</th>
                    <th className="py-2.5 px-3">Units</th>
                    <th className="py-2.5 px-3">Face Value</th>
                    <th className="py-2.5 px-3">Total Value</th>
                    <th className="py-2.5 px-3">Permission Verified</th>
                    <th className="py-2.5 px-3">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {voucherBatchAudits.map((audit) => (
                    <tr key={audit.id} className="hover:bg-slate-950/40 transition-colors">
                      <td className="py-2.5 px-3 font-mono font-bold text-white">{audit.batchId}</td>
                      <td className="py-2.5 px-3 font-mono text-slate-300">{audit.actorEmail}</td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-slate-800 text-slate-400">
                          {audit.role}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-mono">{audit.voucherCount}</td>
                      <td className="py-2.5 px-3 font-mono text-slate-300">₦{audit.unitValue.toLocaleString()}</td>
                      <td className="py-2.5 px-3 font-mono font-bold text-amber-400">
                        ₦{audit.totalBatchValue.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {audit.permissionVerified}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-mono text-slate-400">{audit.createdAt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* TAB: SUBPLUG POINTS ENGINE */}
      {activeTab === 'points' && (
        <div className="animate-in fade-in">
          <AdminPointsWorkspace />
        </div>
      )}

      {/* 3. TAB B: PROMOTIONS */}
      {activeTab === 'promotions' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white">Cashback & Incentive Promotions</h2>
              <span className="text-xs text-slate-400">{promos.length} configured</span>
            </div>

            <div className="space-y-3">
              {promos.map((promo) => (
                <div key={promo.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-xs">{promo.name}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-amber-500/10 text-amber-400">
                        {promo.type}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">{promo.terms}</p>
                    <div className="text-[11px] text-emerald-400 font-mono">
                      Reward: {promo.rewardValue}{promo.rewardType === 'percentage' ? '%' : ' NGN'} (Min ₦{promo.minTransaction.toLocaleString()})
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => togglePromoActive(promo.id)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                        promo.isActive
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-slate-800 text-slate-500'
                      }`}
                    >
                      {promo.isActive ? 'Active' : 'Paused'}
                    </button>
                    <button
                      onClick={() => deletePromo(promo.id)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-300 cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. TAB C: COUPONS */}
      {activeTab === 'coupons' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white">Discount Coupon Codes</h2>
              <button
                onClick={() => setCouponModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>Create Coupon</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {coupons.map((c) => (
                <div key={c.id} className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-sm text-cyan-300 bg-cyan-950/40 px-2.5 py-1 rounded-md border border-cyan-800/40">
                      {c.code}
                    </span>
                    <button
                      onClick={() => toggleCouponActive(c.id)}
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase cursor-pointer ${
                        c.isActive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-500'
                      }`}
                    >
                      {c.isActive ? 'Enabled' : 'Disabled'}
                    </button>
                  </div>
                  <div className="text-xs font-bold text-white">{c.title}</div>
                  <div className="text-[11px] text-slate-400">
                    Min Purchase: ₦{c.minPurchase.toLocaleString()} · Valid till {c.expiryDate}
                  </div>
                  <div className="text-[10px] font-mono text-slate-500 flex justify-between">
                    <span>{c.usageCount} of {c.usageLimit} redemptions</span>
                    <button
                      onClick={() => deleteCoupon(c.id)}
                      className="text-rose-400 hover:underline cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. TAB D: CASHBACK RULES */}
      {activeTab === 'cashback' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 space-y-4">
            <h2 className="text-base font-bold text-white">Automated Cashback Rules</h2>
            <div className="space-y-3">
              {cashbackRules.map((r) => (
                <div key={r.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="font-bold text-white text-xs">{r.serviceCategory} {r.network ? `(${r.network})` : ''}</span>
                    <div className="text-[11px] text-slate-400 font-mono">
                      Rate: {r.percentage}% · Max Cap: ₦{r.capAmount} · Min Purchase: ₦{r.minPurchaseAmount}
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded">
                    CREDITS BONUS WALLET
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. TAB E: REFERRAL RULES */}
      {activeTab === 'referrals' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 space-y-4">
            <h2 className="text-base font-bold text-white">Referral Reward Commission Rules</h2>
            <div className="space-y-3">
              {referralRules.map((rr) => (
                <div key={rr.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="font-bold text-white text-xs">{rr.name}</span>
                    <p className="text-[11px] text-slate-400">{rr.qualificationCriteria}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-mono font-bold text-amber-400">
                      {rr.bonusAmount ? `₦${rr.bonusAmount}` : `${rr.commissionPercentage}% Commission`}
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">Target: Bonus Wallet</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. TAB F: REWARD LEDGER */}
      {activeTab === 'ledger' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 space-y-4">
            <h2 className="text-base font-bold text-white">Reward & Voucher Mutation Ledger (Audit Trace)</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-mono uppercase text-[10px]">
                    <th className="py-2.5 px-3">Timestamp</th>
                    <th className="py-2.5 px-3">Type</th>
                    <th className="py-2.5 px-3">Reference</th>
                    <th className="py-2.5 px-3">Target Wallet</th>
                    <th className="py-2.5 px-3">Amount</th>
                    <th className="py-2.5 px-3">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {rewardLedger.map((l) => (
                    <tr key={l.id} className="hover:bg-slate-950/40 transition-colors">
                      <td className="py-2.5 px-3 font-mono text-slate-400">
                        {new Date(l.timestamp).toLocaleTimeString()}
                      </td>
                      <td className="py-2.5 px-3 font-mono uppercase text-[10px] text-slate-300">{l.type.replace(/_/g, ' ')}</td>
                      <td className="py-2.5 px-3 font-mono text-slate-400">{l.reference}</td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                            l.walletTarget === 'main'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          }`}
                        >
                          {l.walletTarget === 'main' ? 'Main Wallet' : 'Bonus Wallet'}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-mono font-bold text-emerald-400">
                        ₦{l.amount.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3 text-slate-300">{l.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: CREATE COUPON */}
      {couponModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900 p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white">Create New Discount Coupon</h3>
            <form onSubmit={handleCreateCoupon} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Coupon Code</label>
                <input
                  type="text"
                  required
                  value={cpCode}
                  onChange={(e) => setCpCode(e.target.value.toUpperCase())}
                  placeholder="e.g. FLASH50"
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono uppercase focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Coupon Description Title</label>
                <input
                  type="text"
                  required
                  value={cpTitle}
                  onChange={(e) => setCpTitle(e.target.value)}
                  placeholder="e.g. ₦100 Off First Data Top-up"
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Discount Type</label>
                  <select
                    value={cpType}
                    onChange={(e) => setCpType(e.target.value as 'fixed' | 'percentage')}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none"
                  >
                    <option value="fixed">Fixed Amount (₦)</option>
                    <option value="percentage">Percentage (%)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Value</label>
                  <input
                    type="number"
                    value={cpValue}
                    onChange={(e) => setCpValue(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none font-mono"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Min Purchase (₦)</label>
                  <input
                    type="number"
                    value={cpMinPurchase}
                    onChange={(e) => setCpMinPurchase(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Usage Limit</label>
                  <input
                    type="number"
                    value={cpLimit}
                    onChange={(e) => setCpLimit(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none font-mono"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Expiry Date</label>
                <input
                  type="date"
                  value={cpExpiry}
                  onChange={(e) => setCpExpiry(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setCouponModalOpen(false)}
                  className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold"
                >
                  Save Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
