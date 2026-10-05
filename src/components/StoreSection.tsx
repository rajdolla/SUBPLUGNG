import React from 'react';
import { ShoppingBag, ArrowRight, Check, ShieldCheck, Tag } from 'lucide-react';
import { STORE_PRODUCTS } from '../data/mockData';
import { StoreProduct } from '../types';

interface StoreSectionProps {
  onOpenStoreModal: (product?: StoreProduct) => void;
}

export const StoreSection: React.FC<StoreSectionProps> = ({ onOpenStoreModal }) => {
  return (
    <section id="store" className="py-16 sm:py-20 bg-slate-900/40 border-y border-slate-800/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">
              Hardware & POS Terminals
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Your One Stop Shopping Mart.
            </h2>
            <p className="mt-2 text-base text-slate-400 max-w-2xl">
              Equip your VTU kiosk and retail outlet with certified payment terminals, high-speed 4G routers, and heavy-duty thermal receipt printers.
            </p>
          </div>

          <button
            onClick={() => onOpenStoreModal()}
            className="self-start md:self-auto min-h-[48px] px-6 py-2.5 text-sm font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl transition-all shadow-sm flex items-center gap-2 cursor-pointer"
          >
            <ShoppingBag className="h-4 w-4" />
            <span>Shop Now</span>
          </button>
        </div>

        {/* Featured Store Visual Banner */}
        <div className="relative rounded-2xl overflow-hidden border border-slate-800 mb-12 group">
          <img
            src="/src/assets/images/store_shopping_mockup_1790292305560.jpg"
            alt="Subplug Fintech Hardware & Retail Devices"
            referrerPolicy="no-referrer"
            className="w-full h-48 sm:h-72 object-cover object-center filter brightness-90 group-hover:scale-[1.01] transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent flex items-end p-6 sm:p-8">
            <div className="max-w-xl">
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wide">
                Direct Distributor Pricing
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
                Official Agency Banking Hardware & MiFi Routers
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 line-clamp-2">
                All devices come with a 1-year warranty, nationwide delivery to all 36 states, and direct firmware synchronization with the Subplug network.
              </p>
            </div>
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {STORE_PRODUCTS.map((product) => (
            <div
              key={product.id}
              className="flex flex-col justify-between p-6 bg-slate-900 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all duration-200"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                  <span className="font-medium">{product.category}</span>
                  <span className="text-emerald-400 font-semibold">In Stock</span>
                </div>

                <h4 className="text-lg font-bold text-white tracking-tight">
                  {product.title}
                </h4>

                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-2xl font-extrabold text-white font-mono tabular-nums">
                    ₦{product.price.toLocaleString()}
                  </span>
                  <span className="text-xs text-slate-500 line-through font-mono tabular-nums">
                    ₦{product.originalPrice.toLocaleString()}
                  </span>
                </div>

                <p className="mt-3 text-xs text-slate-400 leading-relaxed">
                  {product.description}
                </p>

                <div className="mt-4 pt-4 border-t border-slate-800/80 space-y-2">
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
                  className="w-full py-2.5 px-4 text-xs sm:text-sm font-semibold rounded-xl bg-slate-800 hover:bg-emerald-400 hover:text-slate-950 text-white transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Order Device</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
