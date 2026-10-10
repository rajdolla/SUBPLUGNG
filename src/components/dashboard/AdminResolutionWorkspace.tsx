/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  LifeBuoy,
  CheckCircle2,
  Clock,
  AlertTriangle,
  RotateCcw,
  ShieldCheck,
  Send,
  Search,
} from 'lucide-react';
import { useCms } from '../../context/CmsContext';
import { ResolutionTicket } from '../../types/cms';

export const AdminResolutionWorkspace: React.FC = () => {
  const { resolutionTickets, updateTicketStatus } = useCms();
  const [selectedTicket, setSelectedTicket] = useState<ResolutionTicket | null>(
    resolutionTickets[0] || null
  );
  const [actionOutcomeNote, setActionOutcomeNote] = useState('');
  const [newStatus, setNewStatus] = useState<ResolutionTicket['status']>('assessing');
  const [statusNotice, setStatusNotice] = useState<string | null>(null);

  const handleApplyUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket) return;

    updateTicketStatus(selectedTicket.id, newStatus, actionOutcomeNote);
    setStatusNotice(`Ticket ${selectedTicket.ticketNumber} status updated to ${newStatus}.`);
    setActionOutcomeNote('');
    setTimeout(() => setStatusNotice(null), 5000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* 1. Header Banner */}
      <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-rose-950/30 p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-mono font-bold tracking-wide">
            <LifeBuoy className="h-3.5 w-3.5" />
            <span>OPERATIONS RESOLUTION DESK</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Dispute & Switch Requery Desk
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Audit customer dispute tickets, review carrier switch logs, re-dispatch pending delivery tokens, and assess manual refund claims.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-1 text-slate-400">
          <div className="text-white font-bold flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>Carrier Settlement Protocol</span>
          </div>
          <p className="text-[11px] leading-relaxed">
            All refunds require carrier clearing proof. No automatic customer refunds permitted without operator sign-off.
          </p>
        </div>
      </div>

      {statusNotice && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{statusNotice}</span>
        </div>
      )}

      {/* 2. Split Workspace: Ticket Queue & Ticket Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Ticket Queue (5 cols) */}
        <div className="lg:col-span-5 rounded-3xl border border-slate-800 bg-slate-900/80 p-5 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Incoming Dispute Tickets ({resolutionTickets.length})
            </h2>
            <span className="text-[10px] text-slate-500 font-mono">Real-Time Queue</span>
          </div>

          <div className="space-y-2">
            {resolutionTickets.map((t) => (
              <div
                key={t.id}
                onClick={() => {
                  setSelectedTicket(t);
                  setNewStatus(t.status);
                  setActionOutcomeNote(t.resolutionOutcome || '');
                }}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                  selectedTicket?.id === t.id
                    ? 'bg-rose-500/10 border-rose-500/50 shadow-md'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-mono font-bold text-xs text-white">{t.ticketNumber}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                      t.status === 'resolved'
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : t.status === 'assessing'
                        ? 'bg-cyan-500/10 text-cyan-400'
                        : 'bg-amber-500/10 text-amber-400'
                    }`}
                  >
                    {t.status}
                  </span>
                </div>
                <div className="text-xs font-semibold text-slate-300 truncate">
                  {t.recipientDetails}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5 font-mono">
                  Ref: {t.transactionReference} · ₦{t.transactionAmount.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Ticket Assessment Panel (7 cols) */}
        <div className="lg:col-span-7 rounded-3xl border border-slate-800 bg-slate-900/80 p-6 sm:p-8 space-y-5">
          {selectedTicket ? (
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <h3 className="text-base font-bold text-white">Ticket Audit: {selectedTicket.ticketNumber}</h3>
                  <p className="text-xs text-slate-400 font-mono">Reference: {selectedTicket.transactionReference}</p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase bg-slate-800 text-slate-300">
                  {selectedTicket.serviceCategory}
                </span>
              </div>

              {/* Transaction Metadata */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-[10px] uppercase font-mono text-slate-500">Recipient Details</span>
                  <div className="text-white font-semibold">{selectedTicket.recipientDetails}</div>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-[10px] uppercase font-mono text-slate-500">Debited Amount</span>
                  <div className="text-emerald-400 font-mono font-bold">₦{selectedTicket.transactionAmount.toLocaleString()}</div>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-[10px] uppercase font-mono text-slate-500">Issue Category</span>
                  <div className="text-white font-semibold capitalize">{selectedTicket.issueType.replace(/_/g, ' ')}</div>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-[10px] uppercase font-mono text-slate-500">Date Logged</span>
                  <div className="text-slate-300 font-mono">{new Date(selectedTicket.createdAt).toLocaleString()}</div>
                </div>
              </div>

              {/* Customer Statement */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1 text-xs">
                <span className="text-[10px] uppercase font-mono text-slate-500">Customer Description:</span>
                <p className="text-slate-300 italic">"{selectedTicket.customerNote}"</p>
              </div>

              {/* Resolution Form */}
              <form onSubmit={handleApplyUpdate} className="space-y-4 pt-3 border-t border-slate-800 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Set Resolution State</label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value as ResolutionTicket['status'])}
                      className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none"
                    >
                      <option value="submitted">Submitted (Queued)</option>
                      <option value="assessing">Assessing Carrier Logs</option>
                      <option value="requerying">Switch Requery Sent</option>
                      <option value="escalated">Escalated to Telco Lead</option>
                      <option value="resolved">Resolved (Completed)</option>
                      <option value="closed">Closed (No Fault Found)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Carrier Action Outcome</label>
                    <input
                      type="text"
                      value={actionOutcomeNote}
                      onChange={(e) => setActionOutcomeNote(e.target.value)}
                      placeholder="e.g. Switch confirmed bundle delivered. SMS resent."
                      className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Update Resolution Record</span>
                </button>
              </form>
            </div>
          ) : (
            <div className="py-12 text-center text-xs text-slate-500">
              Select a ticket from the queue to assess.
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
