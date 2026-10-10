/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  MessageSquare,
  Upload,
  FileText,
  AlertCircle,
  CheckCircle2,
  Trash2,
  ArrowRight,
  Clock,
  Sparkles,
  Info,
  Check,
  RotateCcw,
  ShieldCheck,
  Send,
} from 'lucide-react';
import {
  parseBulkPhoneNumbers,
  calculateSmsSegments,
  estimateSmsCost,
} from '../../utils/security';

export const BulkSmsWorkspace: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'paste' | 'upload'>('paste');
  const [rawNumbers, setRawNumbers] = useState('');
  const [senderId, setSenderId] = useState('SUBPLUG');
  const [campaignName, setCampaignName] = useState('');
  const [message, setMessage] = useState('');
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [confirmNotice, setConfirmNotice] = useState<string | null>(null);

  // Parse phone numbers in real time
  const phoneStats = useMemo(() => {
    return parseBulkPhoneNumbers(rawNumbers);
  }, [rawNumbers]);

  const segments = useMemo(() => {
    return calculateSmsSegments(message);
  }, [message]);

  const estimatedCost = useMemo(() => {
    return estimateSmsCost(phoneStats.valid.length, segments);
  }, [phoneStats.valid.length, segments]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === 'string') {
        setRawNumbers((prev) => (prev ? `${prev}\n${content}` : content));
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleRemoveDuplicates = () => {
    // Keep only unique valid numbers in rawNumbers
    setRawNumbers(phoneStats.valid.join('\n'));
  };

  const handleClearAll = () => {
    setRawNumbers('');
    setMessage('');
    setCampaignName('');
    setSenderId('SUBPLUG');
    setConfirmNotice(null);
  };

  const handleConfirmCampaign = () => {
    setIsReviewOpen(false);
    setConfirmNotice(
      'Demo only — live SMS sending is not connected yet. No SMS campaign was dispatched and no charges have been made.'
    );
  };

  const canReview = phoneStats.valid.length > 0 && message.trim().length > 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* 1. Header Banner */}
      <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/30 p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-bold tracking-wide">
            <MessageSquare className="h-3.5 w-3.5" />
            <span>ENTERPRISE BULK MESSAGING</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Reach your customers at scale.
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Create targeted SMS campaigns and reach your audience quickly with customizable Sender IDs and instant delivery tracking.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-right shrink-0">
          <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
            Standard Rate (Est.)
          </div>
          <div className="text-2xl font-extrabold text-emerald-400 font-mono">
            ₦3.50 <span className="text-xs text-slate-400 font-normal">/ SMS</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            160 chars per GSM segment
          </div>
        </div>
      </div>

      {/* Confirmation / Info Banner */}
      {confirmNotice && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-start gap-3 animate-in fade-in">
          <Info className="h-4 w-4 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="font-bold">Campaign Preview Mode (Demo State)</div>
            <p className="text-slate-300">{confirmNotice}</p>
          </div>
        </div>
      )}

      {/* 2. Composer Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Recipients Input */}
        <div className="lg:col-span-5 rounded-3xl border border-slate-800 bg-slate-900/80 p-6 flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                  1. Recipients
                </h2>
                <p className="text-[11px] text-slate-400">Nigerian mobile numbers</p>
              </div>

              {/* Input Mode Toggle */}
              <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                <button
                  type="button"
                  onClick={() => setActiveTab('paste')}
                  className={`px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                    activeTab === 'paste'
                      ? 'bg-slate-800 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Paste
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('upload')}
                  className={`px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                    activeTab === 'upload'
                      ? 'bg-slate-800 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  CSV
                </button>
              </div>
            </div>

            {activeTab === 'paste' ? (
              <div className="space-y-2">
                <textarea
                  rows={7}
                  placeholder="Paste numbers separated by commas, spaces, or lines:&#10;08012345678&#10;08123456789&#10;+2349012345678"
                  value={rawNumbers}
                  onChange={(e) => setRawNumbers(e.target.value)}
                  className="w-full rounded-2xl border border-slate-800 bg-slate-950 p-3.5 text-xs font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500/80 transition-colors resize-none"
                />
              </div>
            ) : (
              <div className="rounded-2xl border-2 border-dashed border-slate-800 bg-slate-950/60 p-6 text-center space-y-3">
                <div className="h-10 w-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-emerald-400">
                  <Upload className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-white">Upload CSV or TXT File</p>
                  <p className="text-[11px] text-slate-500">
                    File should contain Nigerian numbers in one column
                  </p>
                </div>
                <label className="inline-flex px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white transition-colors cursor-pointer">
                  <span>Browse Device</span>
                  <input
                    type="file"
                    accept=".csv,.txt"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            )}

            {/* Parsing Statistics */}
            <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-slate-950 border border-slate-800 text-center text-xs">
              <div>
                <span className="text-[10px] text-slate-500 block">Valid</span>
                <span className="font-mono font-bold text-emerald-400">
                  {phoneStats.valid.length}
                </span>
              </div>
              <div className="border-x border-slate-800">
                <span className="text-[10px] text-slate-500 block">Invalid</span>
                <span className={`font-mono font-bold ${phoneStats.invalid.length > 0 ? 'text-rose-400' : 'text-slate-400'}`}>
                  {phoneStats.invalid.length}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">Duplicates</span>
                <span className={`font-mono font-bold ${phoneStats.duplicates.length > 0 ? 'text-amber-400' : 'text-slate-400'}`}>
                  {phoneStats.duplicates.length}
                </span>
              </div>
            </div>
          </div>

          {phoneStats.duplicates.length > 0 && (
            <button
              type="button"
              onClick={handleRemoveDuplicates}
              className="w-full py-2 px-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/20 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Remove {phoneStats.duplicates.length} Duplicates</span>
            </button>
          )}
        </div>

        {/* Right Column: Sender ID, Message & Estimation */}
        <div className="lg:col-span-7 rounded-3xl border border-slate-800 bg-slate-900/80 p-6 flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              2. Message Details
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Campaign Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Campaign Name <span className="text-slate-500 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  maxLength={40}
                  placeholder="e.g. Easter Promo Discount"
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/80"
                />
              </div>

              {/* Sender ID */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-300">
                    Sender ID
                  </label>
                  <span className="text-[10px] text-slate-500 font-mono">Max 11 chars</span>
                </div>
                <input
                  type="text"
                  maxLength={11}
                  required
                  placeholder="SUBPLUG"
                  value={senderId}
                  onChange={(e) => setSenderId(e.target.value.slice(0, 11))}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-xs text-white font-mono uppercase placeholder-slate-600 focus:outline-none focus:border-emerald-500/80"
                />
              </div>
            </div>

            {/* Message Body */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-300">
                  Message Body
                </label>
                <span className="text-[10px] text-slate-400 font-mono">
                  {message.length} / 160 characters
                </span>
              </div>
              <textarea
                rows={5}
                required
                placeholder="Type your broadcast message here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full rounded-2xl border border-slate-800 bg-slate-950 p-3.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/80 resize-none transition-colors"
              />
            </div>

            {/* Live Metrics Strip */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-[10px] text-slate-500 block">Characters</span>
                <span className="font-mono font-bold text-white">{message.length}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">Segments</span>
                <span className="font-mono font-bold text-cyan-400">{segments} page{segments > 1 ? 's' : ''}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">Recipients</span>
                <span className="font-mono font-bold text-emerald-400">{phoneStats.valid.length}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">Estimated Cost</span>
                <span className="font-mono font-bold text-amber-400">
                  ₦{estimatedCost.toFixed(2)}
                </span>
              </div>
            </div>
            <p className="text-[10px] text-slate-500 italic">
              *The cost above is an estimate based on standard GSM network routing.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleClearAll}
              className="py-2.5 px-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Clear</span>
            </button>

            <button
              type="button"
              disabled={!canReview}
              onClick={() => setIsReviewOpen(true)}
              className="py-2.5 px-6 rounded-xl bg-emerald-400 hover:bg-emerald-300 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-bold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer shadow-md shadow-emerald-500/10"
            >
              <span>Review Campaign</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. Review Campaign Modal */}
      {isReviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-3xl border border-slate-800 bg-slate-900 p-6 sm:p-8 space-y-6 shadow-2xl">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-bold mb-2">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>CAMPAIGN VERIFICATION</span>
              </div>
              <h3 className="text-xl font-bold text-white">Review Broadcast Campaign</h3>
              <p className="text-xs text-slate-400 mt-1">
                Please inspect your broadcast dispatch parameters before confirming.
              </p>
            </div>

            <div className="space-y-3 rounded-2xl bg-slate-950 p-4 border border-slate-800 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-800/80">
                <span className="text-slate-400">Campaign Name:</span>
                <span className="text-white font-semibold">{campaignName || 'Untitled Broadcast'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/80">
                <span className="text-slate-400">Sender ID:</span>
                <span className="text-emerald-400 font-mono font-bold uppercase">{senderId || 'SUBPLUG'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/80">
                <span className="text-slate-400">Total Valid Recipients:</span>
                <span className="text-white font-mono font-bold">{phoneStats.valid.length} numbers</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/80">
                <span className="text-slate-400">SMS Segments (per number):</span>
                <span className="text-white font-mono font-bold">{segments} page{segments > 1 ? 's' : ''}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Total Cost (Frontend Estimate):</span>
                <span className="text-amber-400 font-mono font-bold text-sm">₦{estimatedCost.toFixed(2)}</span>
              </div>
            </div>

            {/* Message Preview snippet */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">
                Message Preview
              </div>
              <p className="text-xs text-slate-300 font-mono leading-relaxed line-clamp-3">
                {message}
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsReviewOpen(false)}
                className="flex-1 py-3 px-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                Back to Edit
              </button>
              <button
                type="button"
                onClick={handleConfirmCampaign}
                className="flex-1 py-3 px-4 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
              >
                <Send className="h-3.5 w-3.5" />
                <span>Test Preview (Demo Only)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Campaign History (Clean Empty State) */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">SMS Campaign History</h3>
            <p className="text-xs text-slate-500">Log of completed and queued message dispatches</p>
          </div>
          <span className="text-xs text-slate-500 font-mono">0 campaigns</span>
        </div>

        <div className="py-12 px-4 rounded-2xl border border-dashed border-slate-800 bg-slate-950/40 text-center space-y-3">
          <div className="h-12 w-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-500">
            <Clock className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-white">No campaigns yet</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Your SMS campaigns will appear here once submitted and queued by the delivery gateway.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
