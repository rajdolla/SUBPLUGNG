import React, { useState } from 'react';
import { X, Search, Download, ArrowRight, Zap } from 'lucide-react';
import { DATA_PLANS } from '../data/mockData';
import { NetworkProvider } from '../types';

interface PriceListModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPlan: (plan: any) => void;
}

export const PriceListModal: React.FC<PriceListModalProps> = ({ isOpen, onClose, onSelectPlan }) => {
  const [filterNetwork, setFilterNetwork] = useState<string>('ALL');
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const filtered = DATA_PLANS.filter((plan) => {
    const matchesNet = filterNetwork === 'ALL' || plan.network === filterNetwork;
    const matchesSearch =
      plan.name.toLowerCase().includes(search.toLowerCase()) ||
      plan.network.toLowerCase().includes(search.toLowerCase()) ||
      plan.type.toLowerCase().includes(search.toLowerCase());
    return matchesNet && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
              <Zap className="h-4 w-4" />
              <span>Full Telecom Tariff Schedule</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-0.5">
              Complete Data & VTU Price List
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/60 hover:bg-slate-800 transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="py-4 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {['ALL', 'MTN', 'Airtel', 'Glo', '9mobile'].map((net) => (
              <button
                key={net}
                type="button"
                onClick={() => setFilterNetwork(net)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  filterNetwork === net
                    ? 'bg-emerald-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white bg-slate-950 border border-slate-800'
                }`}
              >
                {net}
              </button>
            ))}
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
            <input
              type="text"
              placeholder="Search plan or size..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 w-full sm:w-56"
            />
          </div>
        </div>

        {/* Table Container */}
        <div className="overflow-y-auto flex-1 border border-slate-800 rounded-xl">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800 sticky top-0">
                <th className="py-3 px-4">Network & Plan</th>
                <th className="py-3 px-4">Validity</th>
                <th className="py-3 px-4">Customer Rate</th>
                <th className="py-3 px-4 text-emerald-400">Vendor Wholesale</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              {filtered.map((plan) => (
                <tr key={plan.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="py-3 px-4 font-semibold text-white">
                    <span>{plan.network} {plan.name}</span>
                    <span className="block text-[11px] font-normal text-slate-500">{plan.type}</span>
                  </td>
                  <td className="py-3 px-4 text-slate-400">{plan.validity}</td>
                  <td className="py-3 px-4 font-mono tabular-nums font-semibold">
                    ₦{plan.userPrice.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 font-mono tabular-nums font-bold text-emerald-400">
                    ₦{plan.vendorPrice.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => {
                        onClose();
                        onSelectPlan(plan);
                      }}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-emerald-400 hover:text-slate-950 text-white rounded-lg text-xs font-semibold transition-all inline-flex items-center gap-1 cursor-pointer"
                    >
                      <span>Select</span>
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Note */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <span>* Wholesale rates apply automatically once Vendor license is activated.</span>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Save / Print Schedule</span>
          </button>
        </div>

      </div>
    </div>
  );
};
