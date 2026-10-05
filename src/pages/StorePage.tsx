import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Search, 
  ArrowLeft, 
  Check, 
  ShieldCheck, 
  Truck, 
  Tag, 
  ArrowRight,
  Filter,
  CheckCircle2,
  HelpCircle,
  Package
} from 'lucide-react';
import { STORE_PRODUCTS } from '../data/mockData';
import { StoreProduct } from '../types';
import { cleanRawInput } from '../utils/security';

interface StorePageProps {
  onBackToHome: () => void;
  onOpenStoreModal: (product?: StoreProduct) => void;
  onOpenAuth: (tab: 'login' | 'register') => void;
}

export const StorePage: React.FC<StorePageProps> = ({
  onBackToHome,
  onOpenStoreModal,
  onOpenAuth,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'POS Terminals', 'Pocket MiFi', 'Thermal Printers', 'Supplies'];

  const filteredProducts = STORE_PRODUCTS.filter((prod) => {
    const matchesCategory = selectedCategory === 'All' || prod.category === selectedCategory;
    const matchesSearch =
      prod.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        
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
            <span className="text-emerald-400 font-semibold">Official Hardware Mart</span>
            <span>·</span>
            <span>Nationwide 36-State Delivery</span>
          </div>
        </div>

        {/* Store Page Hero */}
        <div className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 p-8 sm:p-12 overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
              <ShoppingBag className="h-4 w-4" />
              <span>Certified Agency Banking Hardware & MiFi</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight [text-wrap:balance]">
              Your One Stop Hardware Mart.
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
              Equip your VTU kiosk, campus store, or agency banking outlet with certified Android POS terminals, high-speed 4G LTE portable routers, and bluetooth receipt printers.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-medium text-slate-300">
              <span className="flex items-center gap-1.5">
                <Truck className="h-4 w-4 text-emerald-400" />
                24-48h GIG/DHL Logistics
              </span>
              <span>·</span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                1-Year Full Hardware Warranty
              </span>
              <span>·</span>
              <span className="flex items-center gap-1.5">
                <Package className="h-4 w-4 text-emerald-400" />
                Pre-configured with Subplug Firmware
              </span>
            </div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pb-2 border-b border-slate-800">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/10'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[260px]">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
            <input
              type="text"
              maxLength={40}
              placeholder="Search POS, routers, paper..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(cleanRawInput(e.target.value, 40))}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>
        </div>

        {/* Product Catalog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="flex flex-col justify-between bg-slate-900 rounded-2xl border border-slate-800 hover:border-slate-700 p-6 transition-all duration-200 group hover:shadow-xl hover:shadow-emerald-500/5"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                  <span className="font-semibold text-emerald-400">{product.category}</span>
                  <span className="text-slate-400 font-medium">In Stock</span>
                </div>

                <h3 className="text-lg font-bold text-white tracking-tight group-hover:text-emerald-300 transition-colors">
                  {product.title}
                </h3>

                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-2xl font-extrabold text-white font-mono tabular-nums">
                    ₦{product.price.toLocaleString()}
                  </span>
                  <span className="text-xs text-slate-500 line-through font-mono tabular-nums">
                    ₦{product.originalPrice.toLocaleString()}
                  </span>
                </div>

                <p className="mt-3 text-xs sm:text-sm text-slate-400 leading-relaxed">
                  {product.description}
                </p>

                <div className="mt-5 pt-4 border-t border-slate-800/80 space-y-2">
                  {product.features.map((feat, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                      <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800">
                <button
                  onClick={() => onOpenStoreModal(product)}
                  className="w-full py-3 px-4 text-xs sm:text-sm font-bold rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 transition-all shadow-md shadow-emerald-500/10 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Order Device</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Wholesale Reseller Hardware Banner */}
        <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-xl font-bold text-white">Need Bulk Terminal Orders for Your Organization?</h3>
            <p className="text-sm text-slate-400">
              We offer wholesale carton discounts for agency networks, cooperatives, and commercial vendors ordering 5+ units.
            </p>
          </div>
          <button
            onClick={() => onOpenAuth('register')}
            className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm rounded-xl border border-slate-700 transition-colors shrink-0 cursor-pointer"
          >
            Apply for Bulk Discount
          </button>
        </div>

        {/* Hardware FAQ Accordion */}
        <div className="space-y-4 pt-4">
          <h2 className="text-xl font-bold text-white">Hardware & Logistics Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 bg-slate-900 rounded-2xl border border-slate-800 space-y-1.5">
              <h4 className="text-sm font-bold text-white">How long does delivery take?</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Lagos deliveries arrive same-day or within 24 hours. Deliveries to Abuja, Port Harcourt, Kano, and other Nigerian states take 24 to 48 hours via GIG Logistics or DHL.
              </p>
            </div>
            <div className="p-5 bg-slate-900 rounded-2xl border border-slate-800 space-y-1.5">
              <h4 className="text-sm font-bold text-white">What does the 1-year warranty cover?</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                All POS terminals and MiFi routers are covered against hardware defects, battery faults, and printer head failures with free replacement or repair at our Lagos service center.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
