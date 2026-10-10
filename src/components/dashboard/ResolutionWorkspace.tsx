/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  LifeBuoy,
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldAlert,
  Search,
  RotateCcw,
  FileText,
  HelpCircle,
} from 'lucide-react';
import { useCms } from '../../context/CmsContext';
import { ResolutionIssueType, ResolutionTicket } from '../../types/cms';

interface MockEligibleTransaction {
  id: string;
  reference: string;
  serviceCategory: 'airtime' | 'data' | 'cable' | 'electricity';
  description: string;
  amount: number;
  recipient: string;
  date: string;
  currentStatus: 'successful' | 'pending' | 'failed';
}

const SAMPLE_ELIGIBLE_TRANSACTIONS: MockEligibleTransaction[] = [
  {
    id: 'tx-1',
    reference: 'TX-SUB-881920',
    serviceCategory: 'data',
    description: 'MTN 5GB Corporate Gifting',
    amount: 1300,
    recipient: '08031234567',
    date: '2026-10-05 09:30',
    currentStatus: 'pending',
  },
  {
    id: 'tx-2',
    reference: 'TX-SUB-772109',
    serviceCategory: 'electricity',
    description: 'IKEDC Prepaid Token',
    amount: 5000,
    recipient: 'Meter: 0142981023',
    date: '2026-10-03 11:15',
    currentStatus: 'successful',
  },
  {
    id: 'tx-3',
    reference: 'TX-SUB-664812',
    serviceCategory: 'airtime',
    description: 'Airtel VTU Recharge',
    amount: 1000,
    recipient: '09012345678',
    date: '2026-10-02 18:20',
    currentStatus: 'successful',
  },
  {
    id: 'tx-4',
    reference: 'TX-SUB-551934',
    serviceCategory: 'cable',
    description: 'DStv Compact Bouquet',
    amount: 12500,
    recipient: 'SmartCard: 2049182049',
    date: '2026-09-30 14:10',
    currentStatus: 'successful',
  },
];

const ISSUE_OPTIONS: Array<{ id: ResolutionIssueType; label: string; description: string }> = [
  { id: 'not_received', label: 'Service Not Received', description: 'Debit occurred but recipient reports no value delivered.' },
  { id: 'pending_overdue', label: 'Pending Overdue', description: 'Order has been pending carrier confirmation for over 5 minutes.' },
  { id: 'provider_switch_failure', label: 'Provider Switch Failure', description: 'Carrier network returned a temporary gateway failure.' },
  { id: 'duplicate_debit', label: 'Duplicate Debit', description: 'Multiple wallet deductions for the same recharge reference.' },
  { id: 'status_requery', label: 'Request Switch Requery', description: 'Trigger real-time USSD/API query with the telco switch.' },
  { id: 'retry_dispatch', label: 'Retry / Redo Dispatch', description: 'Re-queue transaction for automated sub-second re-attempt.' },
  { id: 'refund_assessment', label: 'Request Refund Assessment', description: 'Submit formal ticket to audit desk for manual wallet reversal.' },
  { id: 'escalation_other', label: 'Other / Escalation', description: 'General operator dispute or carrier mismatch query.' },
];

export const ResolutionWorkspace: React.FC = () => {
  const { resolutionTickets, createResolutionTicket } = useCms();

  // Transaction-first selection state
  const [selectedTxId, setSelectedTxId] = useState<string>(SAMPLE_ELIGIBLE_TRANSACTIONS[0].id);
  const [selectedIssue, setSelectedIssue] = useState<ResolutionIssueType>('pending_overdue');
  const [customerNote, setCustomerNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<ResolutionTicket | null>(null);

  const selectedTransaction = SAMPLE_ELIGIBLE_TRANSACTIONS.find((t) => t.id === selectedTxId);

  const handleSubmitResolution = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTransaction) return;

    setIsSubmitting(true);
    setSubmissionSuccess(null);

    setTimeout(() => {
      setIsSubmitting(false);
      const newTicket = createResolutionTicket({
        userId: 'user-current',
        userEmail: 'customer@subplug.ng',
        serviceCategory: selectedTransaction.serviceCategory,
        transactionReference: selectedTransaction.reference,
        transactionAmount: selectedTransaction.amount,
        recipientDetails: `${selectedTransaction.recipient} (${selectedTransaction.description})`,
        issueType: selectedIssue,
        customerNote: customerNote.trim() || 'Automated resolution ticket initiated via customer dashboard.',
      });

      setSubmissionSuccess(newTicket);
      setCustomerNote('');
    }, 600);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* 1. Header Banner */}
      <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/30 p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono font-bold tracking-wide">
            <LifeBuoy className="h-3.5 w-3.5" />
            <span>TRANSACTION RESOLUTION CENTER</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Resolution & Dispute Desk
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Resolve pending top-ups, initiate automated switch requeries, or request formal refund assessments for Airtime, Data, Electricity, and Cable TV orders.
          </p>
        </div>

        <div className="flex items-center gap-2 p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-400 shrink-0">
          <ShieldAlert className="h-4 w-4 text-cyan-400 shrink-0" />
          <span>Average Switch Resolution Time: <strong>&lt; 3 mins</strong></span>
        </div>
      </div>

      {/* 2. Transaction-First Dispute Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Form (7 Cols) */}
        <div className="lg:col-span-7 rounded-3xl border border-slate-800 bg-slate-900/80 p-6 sm:p-8 space-y-6">
          <div className="space-y-1">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <FileText className="h-4 w-4 text-cyan-400" />
              <span>Step 1: Select Eligible Transaction (Select-First)</span>
            </h2>
            <p className="text-xs text-slate-400">
              Disputes must be anchored to a specific validated transaction record.
            </p>
          </div>

          {/* Transaction Selector (Select-First UX) */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wide">
              Recent Eligible Transactions
            </label>
            <div className="grid grid-cols-1 gap-2.5">
              {SAMPLE_ELIGIBLE_TRANSACTIONS.map((tx) => (
                <div
                  key={tx.id}
                  onClick={() => {
                    setSelectedTxId(tx.id);
                    setSubmissionSuccess(null);
                  }}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    selectedTxId === tx.id
                      ? 'bg-cyan-500/10 border-cyan-500/50 shadow-md'
                      : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-white">{tx.reference}</span>
                      <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                        {tx.serviceCategory}
                      </span>
                    </div>
                    <div className="text-xs text-slate-300 truncate">
                      {tx.description} · <span className="text-slate-400">{tx.recipient}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono">{tx.date}</div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="font-mono font-bold text-sm text-emerald-400">
                      ₦{tx.amount.toLocaleString()}
                    </div>
                    <span
                      className={`text-[10px] font-mono font-semibold uppercase ${
                        tx.currentStatus === 'pending'
                          ? 'text-amber-400'
                          : tx.currentStatus === 'successful'
                          ? 'text-emerald-400'
                          : 'text-rose-400'
                      }`}
                    >
                      {tx.currentStatus}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Step 2: Issue Type (Select-First) */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wide">
              Step 2: Select Issue Category
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {ISSUE_OPTIONS.map((opt) => (
                <button
                  type="button"
                  key={opt.id}
                  onClick={() => setSelectedIssue(opt.id)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    selectedIssue === opt.id
                      ? 'bg-cyan-500/15 border-cyan-500 text-white shadow-sm'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <div className="text-xs font-bold text-white flex items-center justify-between">
                    <span>{opt.label}</span>
                    {selectedIssue === opt.id && <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400" />}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1 line-clamp-1">{opt.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Step 3: Optional Customer Note (Type only when necessary) */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wide">
              Step 3: Additional Details (Optional)
            </label>
            <textarea
              rows={2}
              value={customerNote}
              onChange={(e) => setCustomerNote(e.target.value)}
              placeholder="e.g. Recipient has restarted phone, still balance not updated."
              className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-500 text-xs text-white placeholder:text-slate-600 focus:outline-none transition-colors resize-none"
            />
          </div>

          {/* Refund Assessment Security Rule Warning */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2.5">
            <AlertCircle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-semibold text-slate-200">Zero-Trust Audit Notice</span>
              <p>
                Refunds are subject to formal assessment against carrier gateway audit logs. No client-side refunds are ever executed automatically without telco switch settlement confirmation.
              </p>
            </div>
          </div>

          {submissionSuccess && (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-start gap-2.5 animate-in fade-in">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-bold">Resolution Ticket Logged: {submissionSuccess.ticketNumber}</span>
                <p className="text-slate-300">
                  Transaction {submissionSuccess.transactionReference} queued for automated operator assessment. Check the ticket tracker below.
                </p>
              </div>
            </div>
          )}

          <button
            type="button"
            disabled={isSubmitting || !selectedTransaction}
            onClick={handleSubmitResolution}
            className="w-full py-3.5 px-4 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 active:scale-[0.98] cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>Submitting to Switch Board...</span>
            ) : (
              <>
                <span>Submit Resolution Request</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>

        {/* Right Tracker: Resolution Tickets (5 Cols) */}
        <div className="lg:col-span-5 rounded-3xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Clock className="h-4 w-4 text-cyan-400" />
              <span>Resolution Tickets ({resolutionTickets.length})</span>
            </h3>
            <span className="text-[10px] font-mono text-slate-500 uppercase">Live Queue</span>
          </div>

          <div className="space-y-3">
            {resolutionTickets.map((ticket) => (
              <div
                key={ticket.id}
                className="p-4 rounded-2xl border border-slate-800 bg-slate-950/70 space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-xs text-white">{ticket.ticketNumber}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                      ticket.status === 'resolved'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : ticket.status === 'assessing'
                        ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}
                  >
                    {ticket.status}
                  </span>
                </div>

                <div className="text-xs text-slate-300">
                  <div className="font-semibold">{ticket.recipientDetails}</div>
                  <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                    Ref: {ticket.transactionReference} · ₦{ticket.transactionAmount.toLocaleString()}
                  </div>
                </div>

                {ticket.resolutionOutcome && (
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
                    <span className="text-[10px] uppercase font-mono text-cyan-400 block mb-0.5">Switch Response:</span>
                    {ticket.resolutionOutcome}
                  </div>
                )}

                <div className="text-[10px] text-slate-500 font-mono flex items-center justify-between">
                  <span>Issue: {ticket.issueType.replace(/_/g, ' ')}</span>
                  <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
