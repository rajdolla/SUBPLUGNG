/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Sparkles,
  Gift,
  Coins,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Settings,
  Lock,
  Layers,
  ArrowRight,
  Wifi,
  PhoneCall,
  Wallet,
  RotateCcw,
  Sliders,
  Calendar,
} from 'lucide-react';
import { useCms } from '../../context/CmsContext';
import { PointsRedemptionItem, PointsTaskItem } from '../../types/cms';

export const AdminPointsWorkspace: React.FC = () => {
  const {
    pointsConfig,
    updatePointsConfig,
    pointsTasks,
    addPointsTask,
    togglePointsTask,
    deletePointsTask,
    pointsCatalogue,
    addPointsRedemptionItem,
    togglePointsCatalogueItem,
    deletePointsCatalogueItem,
    resetPointsToDefaults,
  } = useCms();

  const [notice, setNotice] = useState<string | null>(null);

  // Modal / Form state for new catalogue item
  const [showAddRewardModal, setShowAddRewardModal] = useState(false);
  const [newRewardTitle, setNewRewardTitle] = useState('');
  const [newRewardType, setNewRewardType] = useState<'wallet_cash' | 'airtime' | 'data'>('wallet_cash');
  const [newRewardPoints, setNewRewardPoints] = useState(500);
  const [newRewardCash, setNewRewardCash] = useState(250);
  const [newRewardAirtime, setNewRewardAirtime] = useState(500);
  const [newRewardNetwork, setNewRewardNetwork] = useState('MTN');
  const [newRewardDataPlan, setNewRewardDataPlan] = useState('1GB SME Data');
  const [newRewardLimit, setNewRewardLimit] = useState(2);
  const [newRewardTerms, setNewRewardTerms] = useState('Automated redemption subject to account verification.');

  // Modal / Form state for new task
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskPoints, setNewTaskPoints] = useState(50);
  const [newTaskType, setNewTaskType] = useState<PointsTaskItem['taskType']>('transaction_volume');
  const [newTaskMinSpend, setNewTaskMinSpend] = useState(5000);
  const [newTaskCategory, setNewTaskCategory] = useState('Telecom');
  const [newTaskMaxClaims, setNewTaskMaxClaims] = useState(1);

  // Config editing state
  const [editRate, setEditRate] = useState(pointsConfig.pointsToCashRate);
  const [editThreshold, setEditThreshold] = useState(pointsConfig.minimumRedemptionThreshold);
  const [editExpiry, setEditExpiry] = useState(pointsConfig.pointsExpiryDays);
  const [editMaxMonth, setEditMaxMonth] = useState(pointsConfig.maxPointsPerMonthPerUser);

  const showNotification = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(null), 5000);
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    updatePointsConfig({
      pointsToCashRate: Number(editRate) || 0.5,
      minimumRedemptionThreshold: Number(editThreshold) || 500,
      pointsExpiryDays: Number(editExpiry) || 365,
      maxPointsPerMonthPerUser: Number(editMaxMonth) || 5000,
    });
    showNotification('Points system configuration updated in session state.');
  };

  const handleCreateCatalogueItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRewardTitle.trim()) return;

    addPointsRedemptionItem({
      title: newRewardTitle.trim(),
      rewardType: newRewardType,
      pointsRequired: Number(newRewardPoints) || 500,
      cashCreditAmount: newRewardType === 'wallet_cash' ? Number(newRewardCash) : undefined,
      airtimeAmount: newRewardType === 'airtime' ? Number(newRewardAirtime) : undefined,
      network: newRewardType !== 'wallet_cash' ? newRewardNetwork : undefined,
      dataPlanName: newRewardType === 'data' ? newRewardDataPlan.trim() : undefined,
      perUserMonthlyLimit: Number(newRewardLimit) || 1,
      isActive: false, // Inactive by default per safety rules
      terms: newRewardTerms.trim(),
    });

    setShowAddRewardModal(false);
    setNewRewardTitle('');
    showNotification(`Redemption reward "${newRewardTitle.trim()}" added to catalogue.`);
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    addPointsTask({
      title: newTaskTitle.trim(),
      description: newTaskDesc.trim(),
      pointsReward: Number(newTaskPoints) || 50,
      taskType: newTaskType,
      minAmount: newTaskType === 'transaction_volume' ? Number(newTaskMinSpend) : undefined,
      maxClaimsPerUser: Number(newTaskMaxClaims) || 1,
      category: newTaskCategory.trim() || 'General',
      isActive: true,
    });

    setShowAddTaskModal(false);
    setNewTaskTitle('');
    setNewTaskDesc('');
    showNotification(`Earning task "${newTaskTitle.trim()}" added to task definitions.`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* 1. Architecture Notice Banner */}
      <div className="rounded-3xl border border-amber-500/30 bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/30 p-6 sm:p-8 space-y-4 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-mono font-bold tracking-wide">
              <Sparkles className="h-3.5 w-3.5" />
              <span>SUBPLUG POINTS LOYALTY ARCHITECTURE</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Points Engine Administration
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Configure future earning task matrices, minimum redemption thresholds, points-to-cash ratios, and redemption rewards for Wallet Cash, Airtime, and Data.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={resetPointsToDefaults}
              className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset Defaults</span>
            </button>
          </div>
        </div>

        {/* Security Rule Warning */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 text-xs text-slate-400 flex items-start gap-3">
          <Lock className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold text-slate-200">Pre-Activation & Separation of Ledgers Governance</span>
            <p>
              In accordance with SUBPLUG financial guidelines, <strong>earning and redemption engines remain disabled by default</strong>. Client-side state does not possess financial authority over balances. Real redemption will execute atomically server-side via Supabase stored procedures and provider switches.
            </p>
          </div>
        </div>
      </div>

      {notice && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{notice}</span>
        </div>
      )}

      {/* 2. Independent Master Engine Controls (Disabled by Default) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Earning Status Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Coins className="h-4 w-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white">Points Earning Engine</h3>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-slate-800 text-slate-400 border border-slate-700">
              Inactive (Default)
            </span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Controls whether user telecom purchases, bill payments, and referral milestones trigger automated point awards.
          </p>
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-[11px] text-slate-500 flex items-center gap-2">
            <Lock className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <span>Master trigger requires backend points task webhook daemon.</span>
          </div>
        </div>

        {/* Redemption Status Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Gift className="h-4 w-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">Points Redemption Engine</h3>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-slate-800 text-slate-400 border border-slate-700">
              Inactive (Default)
            </span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Controls whether users can submit redemption requests for Main Wallet Cash, Airtime, or Data Bundles.
          </p>
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-[11px] text-slate-500 flex items-center gap-2">
            <Lock className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <span>Redemption requires atomic stored procedure (<code>redeem_points_atomic</code>).</span>
          </div>
        </div>
      </div>

      {/* 3. Global System Rules & Conversion Rate Parameters */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 sm:p-8 space-y-5">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Sliders className="h-4 w-4 text-cyan-400" />
              <span>Conversion Rates & System Thresholds</span>
            </h2>
            <p className="text-xs text-slate-400">
              Set standard mathematical thresholds and redemption rules governing all loyalty tiers.
            </p>
          </div>
        </div>

        <form onSubmit={handleSaveConfig} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Points-to-Cash Rate (₦ / Point)</label>
            <input
              type="number"
              step="0.05"
              min="0.05"
              value={editRate}
              onChange={(e) => setEditRate(parseFloat(e.target.value) || 0)}
              className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:border-cyan-500 focus:outline-none"
            />
            <span className="text-[10px] text-slate-500 mt-1 block">e.g. 0.50 means 500 PTS = ₦250</span>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Minimum Redemption Threshold (PTS)</label>
            <input
              type="number"
              step="50"
              min="100"
              value={editThreshold}
              onChange={(e) => setEditThreshold(parseInt(e.target.value) || 0)}
              className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:border-cyan-500 focus:outline-none"
            />
            <span className="text-[10px] text-slate-500 mt-1 block">Minimum balance required to unlock rewards</span>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Monthly User Cap (Max PTS / Mo)</label>
            <input
              type="number"
              step="500"
              min="1000"
              value={editMaxMonth}
              onChange={(e) => setEditMaxMonth(parseInt(e.target.value) || 0)}
              className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:border-cyan-500 focus:outline-none"
            />
            <span className="text-[10px] text-slate-500 mt-1 block">Anti-fraud accumulation threshold</span>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Points Validity Window (Days)</label>
            <input
              type="number"
              step="30"
              min="90"
              value={editExpiry}
              onChange={(e) => setEditExpiry(parseInt(e.target.value) || 0)}
              className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:border-cyan-500 focus:outline-none"
            />
            <span className="text-[10px] text-slate-500 mt-1 block">Unredeemed points expiry schedule</span>
          </div>

          <div className="sm:col-span-2 lg:col-span-4 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer shadow-lg shadow-cyan-500/20"
            >
              Update System Rules
            </button>
          </div>
        </form>
      </div>

      {/* 4. Administrator-Configurable Redemption Catalogue */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 sm:p-8 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Gift className="h-4 w-4 text-emerald-400" />
              <span>Redemption Catalogue ({pointsCatalogue.length} Offers)</span>
            </h2>
            <p className="text-xs text-slate-400">
              Rewards qualifying users can claim for Wallet Cash, Direct Airtime, or Telecom Data.
            </p>
          </div>

          <button
            onClick={() => setShowAddRewardModal(true)}
            className="px-4 py-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shrink-0 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Reward Specification</span>
          </button>
        </div>

        {/* Catalogue Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono uppercase text-[10px]">
                <th className="py-2.5 px-3">Reward Item</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">Points Required</th>
                <th className="py-2.5 px-3">Reward Value / Spec</th>
                <th className="py-2.5 px-3">Monthly Limit</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {pointsCatalogue.map((item) => (
                <tr key={item.id} className="hover:bg-slate-950/40 transition-colors">
                  <td className="py-3 px-3">
                    <div className="font-bold text-white">{item.title}</div>
                    <div className="text-[10px] text-slate-500 max-w-xs truncate">{item.terms}</div>
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-slate-800 text-slate-300">
                      {item.rewardType.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-amber-400">
                    {item.pointsRequired.toLocaleString()} PTS
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-200">
                    {item.rewardType === 'wallet_cash' && `₦${item.cashCreditAmount?.toLocaleString()} → Main Wallet`}
                    {item.rewardType === 'airtime' && `₦${item.airtimeAmount?.toLocaleString()} (${item.network})`}
                    {item.rewardType === 'data' && `${item.dataPlanName} (${item.network})`}
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-400">
                    {item.perUserMonthlyLimit ? `${item.perUserMonthlyLimit}x / user` : 'Unlimited'}
                  </td>
                  <td className="py-3 px-3">
                    <button
                      type="button"
                      onClick={() => togglePointsCatalogueItem(item.id)}
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase cursor-pointer ${
                        item.isActive
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {item.isActive ? 'Active (Live)' : 'Draft / Inactive'}
                    </button>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      type="button"
                      onClick={() => deletePointsCatalogueItem(item.id)}
                      className="p-1 rounded text-slate-500 hover:text-rose-400 cursor-pointer transition-colors"
                      title="Remove reward"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Task Definitions & Points Awards */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 sm:p-8 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Coins className="h-4 w-4 text-amber-400" />
              <span>Earning Task Definitions ({pointsTasks.length} Configured)</span>
            </h2>
            <p className="text-xs text-slate-400">
              Activities and milestones that will award loyalty points once the backend engine is activated.
            </p>
          </div>

          <button
            onClick={() => setShowAddTaskModal(true)}
            className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shrink-0 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Task Rule</span>
          </button>
        </div>

        {/* Tasks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pointsTasks.map((task) => (
            <div
              key={task.id}
              className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5 space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    +{task.pointsReward} PTS
                  </span>
                  <span className="text-[10px] font-mono text-slate-500 uppercase">{task.category}</span>
                </div>
                <h4 className="text-sm font-bold text-white">{task.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{task.description}</p>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                <span>
                  {task.minAmount ? `Min Spend: ₦${task.minAmount.toLocaleString()}` : 'Milestone Task'}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => togglePointsTask(task.id)}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold cursor-pointer ${
                      task.isActive
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {task.isActive ? 'Active' : 'Disabled'}
                  </button>
                  <button
                    type="button"
                    onClick={() => deletePointsTask(task.id)}
                    className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. Isolated Points Ledger Specification & Verification Architecture */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Layers className="h-4 w-4 text-cyan-400" />
          <span>Backend Points Ledger Architecture & Security Constraints</span>
        </h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          The planned Supabase integration establishes an isolated double-entry ledger specifically for points (<code>public.points_ledger</code>). Redemptions for <strong>Wallet Cash</strong> will credit the <strong>Main Wallet</strong> via atomic transactional stored procedure (<code>public.redeem_points_atomic</code>), ensuring points are never treated as cash prior to server-side validation.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-2">
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-slate-500 text-[10px] font-mono uppercase block">Points Ledger Table</span>
            <div className="text-white font-mono font-bold">public.points_ledger</div>
            <p className="text-[11px] text-slate-400">Immutable credit/debit audit trail with idempotency keys.</p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-slate-500 text-[10px] font-mono uppercase block">Points Account Table</span>
            <div className="text-white font-mono font-bold">public.points_accounts</div>
            <p className="text-[11px] text-slate-400">Strictly isolated from main_wallets and bonus_wallets.</p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-slate-500 text-[10px] font-mono uppercase block">Atomic Function</span>
            <div className="text-white font-mono font-bold">redeem_points_atomic()</div>
            <p className="text-[11px] text-slate-400">Double-spend protection & ledger lock enforcement.</p>
          </div>
        </div>
      </div>

      {/* MODAL: ADD REWARD SPECIFICATION */}
      {showAddRewardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl border border-slate-800 bg-slate-900 p-6 sm:p-8 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Gift className="h-5 w-5 text-emerald-400" />
                <span>Add Redemption Specification</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowAddRewardModal(false)}
                className="text-slate-500 hover:text-white text-xs font-semibold"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleCreateCatalogueItem} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Reward Title</label>
                <input
                  type="text"
                  required
                  value={newRewardTitle}
                  onChange={(e) => setNewRewardTitle(e.target.value)}
                  placeholder="e.g. ₦1,000 Main Wallet Cash or MTN 2GB Data"
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Reward Type</label>
                  <select
                    value={newRewardType}
                    onChange={(e) => setNewRewardType(e.target.value as any)}
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none"
                  >
                    <option value="wallet_cash">Wallet Cash (Main Wallet)</option>
                    <option value="airtime">Direct Airtime</option>
                    <option value="data">Data Bundle</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Points Required</label>
                  <input
                    type="number"
                    step="50"
                    min="100"
                    required
                    value={newRewardPoints}
                    onChange={(e) => setNewRewardPoints(parseInt(e.target.value) || 0)}
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none"
                  />
                </div>
              </div>

              {newRewardType === 'wallet_cash' && (
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Cash Value Credited to Main Wallet (₦)</label>
                  <input
                    type="number"
                    step="50"
                    min="50"
                    required
                    value={newRewardCash}
                    onChange={(e) => setNewRewardCash(parseInt(e.target.value) || 0)}
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none"
                  />
                </div>
              )}

              {newRewardType === 'airtime' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Airtime Amount (₦)</label>
                    <input
                      type="number"
                      step="100"
                      min="100"
                      required
                      value={newRewardAirtime}
                      onChange={(e) => setNewRewardAirtime(parseInt(e.target.value) || 0)}
                      className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Network</label>
                    <select
                      value={newRewardNetwork}
                      onChange={(e) => setNewRewardNetwork(e.target.value)}
                      className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none"
                    >
                      <option value="MTN">MTN</option>
                      <option value="Airtel">Airtel</option>
                      <option value="Glo">Glo</option>
                      <option value="T2mobile">T2mobile</option>
                    </select>
                  </div>
                </div>
              )}

              {newRewardType === 'data' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Data Plan Specification</label>
                    <input
                      type="text"
                      required
                      value={newRewardDataPlan}
                      onChange={(e) => setNewRewardDataPlan(e.target.value)}
                      placeholder="e.g. 1.5GB Monthly SME"
                      className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Network</label>
                    <select
                      value={newRewardNetwork}
                      onChange={(e) => setNewRewardNetwork(e.target.value)}
                      className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none"
                    >
                      <option value="MTN">MTN</option>
                      <option value="Airtel">Airtel</option>
                      <option value="Glo">Glo</option>
                      <option value="T2mobile">T2mobile</option>
                    </select>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Per-User Monthly Limit</label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={newRewardLimit}
                    onChange={(e) => setNewRewardLimit(parseInt(e.target.value) || 1)}
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Terms / Note</label>
                  <input
                    type="text"
                    value={newRewardTerms}
                    onChange={(e) => setNewRewardTerms(e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddRewardModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold cursor-pointer"
                >
                  Save Reward
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD TASK DEFINITION */}
      {showAddTaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl border border-slate-800 bg-slate-900 p-6 sm:p-8 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Coins className="h-5 w-5 text-amber-400" />
                <span>Add Earning Task Rule</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowAddTaskModal(false)}
                className="text-slate-500 hover:text-white text-xs font-semibold"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Task Title</label>
                <input
                  type="text"
                  required
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="e.g. Monthly Electricity Top-Up"
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Description & Criteria</label>
                <textarea
                  rows={2}
                  required
                  value={newTaskDesc}
                  onChange={(e) => setNewTaskDesc(e.target.value)}
                  placeholder="Explain requirements to qualify for this point award..."
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Points Awarded (PTS)</label>
                  <input
                    type="number"
                    step="5"
                    min="5"
                    required
                    value={newTaskPoints}
                    onChange={(e) => setNewTaskPoints(parseInt(e.target.value) || 0)}
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Task Type</label>
                  <select
                    value={newTaskType}
                    onChange={(e) => setNewTaskType(e.target.value as any)}
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none"
                  >
                    <option value="transaction_volume">Transaction Volume Spend</option>
                    <option value="utility_bill">Utility Bill Payment</option>
                    <option value="profile_completion">Profile KYC Completion</option>
                    <option value="referral_milestone">Referral Milestone</option>
                    <option value="daily_streak">Daily Check-in Streak</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Min Spend (₦, if applicable)</label>
                  <input
                    type="number"
                    step="500"
                    min="0"
                    value={newTaskMinSpend}
                    onChange={(e) => setNewTaskMinSpend(parseInt(e.target.value) || 0)}
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Max Claims Per User</label>
                  <input
                    type="number"
                    min="1"
                    value={newTaskMaxClaims}
                    onChange={(e) => setNewTaskMaxClaims(parseInt(e.target.value) || 1)}
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddTaskModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold cursor-pointer"
                >
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
