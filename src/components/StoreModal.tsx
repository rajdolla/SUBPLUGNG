import React, { useState } from 'react';
import { X, ShoppingBag, CheckCircle2, ShieldCheck, Truck, Plus, Minus, ArrowRight, AlertCircle } from 'lucide-react';
import { StoreProduct } from '../types';
import { STORE_PRODUCTS } from '../data/mockData';
import { cleanRawInput, isValidNigerianPhone, clampInteger } from '../utils/security';

interface StoreModalProps {
  isOpen: boolean;
  selectedProduct?: StoreProduct;
  onClose: () => void;
}

export const StoreModal: React.FC<StoreModalProps> = ({
  isOpen,
  selectedProduct,
  onClose,
}) => {
  const defaultProduct = selectedProduct || STORE_PRODUCTS[0];
  const [activeProduct, setActiveProduct] = useState<StoreProduct>(defaultProduct);
  const [quantity, setQuantity] = useState(1);
  const [deliveryState, setDeliveryState] = useState('Lagos');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isOrdered, setIsOrdered] = useState(false);

  React.useEffect(() => {
    if (selectedProduct) {
      setActiveProduct(selectedProduct);
    }
  }, [selectedProduct]);

  if (!isOpen) return null;

  const total = activeProduct.price * quantity;

  const handleOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const cleanAddr = cleanRawInput(deliveryAddress, 150).trim();
    if (cleanAddr.length < 5) {
      setErrorMessage('Please provide a complete street delivery address and landmark.');
      return;
    }

    if (!isValidNigerianPhone(contactPhone)) {
      setErrorMessage('Please enter a valid 11-digit Nigerian phone number for delivery dispatch.');
      return;
    }

    setIsOrdered(true);
  };

  const resetAndClose = () => {
    setIsOrdered(false);
    setErrorMessage('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        
        <button
          onClick={resetAndClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/60 hover:bg-slate-800 transition-colors z-10 cursor-pointer"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        {isOrdered ? (
          <div className="py-6 text-center space-y-4 animate-in zoom-in-95 duration-200">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <CheckCircle2 className="h-8 w-8" />
            </div>

            <h3 className="text-2xl font-bold text-white">
              Order Received Successfully!
            </h3>

            <p className="text-sm text-slate-300">
              Your order for <strong className="text-white">{quantity}x {activeProduct.title}</strong> has been logged.
            </p>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-left space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Order Total:</span>
                <span className="text-emerald-400 font-mono font-bold text-sm">₦{total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Destination:</span>
                <span className="text-white">{deliveryState}, Nigeria</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Dispatch Estimate:</span>
                <span className="text-white">24 - 48 Hours via GIG Logistics / DHL</span>
              </div>
            </div>

            <p className="text-xs text-slate-400">
              Our fulfillment agent will call <span className="text-white font-mono">{contactPhone || 'your line'}</span> to confirm delivery.
            </p>

            <button
              onClick={resetAndClose}
              className="w-full py-3 px-4 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-sm rounded-xl transition-colors cursor-pointer"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">
              <ShoppingBag className="h-4 w-4" />
              <span>Subplug Retail Mart</span>
            </div>

            <h3 className="text-2xl font-bold text-white tracking-tight mb-4">
              Device Order & Checkout
            </h3>

            {/* Product Switcher if multiple */}
            <div className="grid grid-cols-3 gap-2 mb-6">
              {STORE_PRODUCTS.map((prod) => (
                <button
                  key={prod.id}
                  type="button"
                  onClick={() => setActiveProduct(prod)}
                  className={`p-2 rounded-xl text-left text-xs border transition-all cursor-pointer ${
                    activeProduct.id === prod.id
                      ? 'border-emerald-500 bg-emerald-500/10 text-white font-bold'
                      : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="truncate font-semibold">{prod.title}</div>
                  <div className="text-emerald-400 font-mono mt-0.5">₦{prod.price.toLocaleString()}</div>
                </button>
              ))}
            </div>

            {/* Active Product Details */}
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 mb-6 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-base font-bold text-white">{activeProduct.title}</h4>
                  <div className="text-xs text-slate-400 mt-1">{activeProduct.description}</div>
                </div>
                <div className="text-right shrink-0 ml-4">
                  <div className="text-lg font-bold text-white font-mono tabular-nums">
                    ₦{activeProduct.price.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-slate-500 line-through font-mono">
                    ₦{activeProduct.originalPrice.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Quantity Selector with Clamping */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                <span className="text-xs font-medium text-slate-300">Quantity (Max 25)</span>
                <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 rounded-lg p-1">
                  <button
                    type="button"
                    onClick={() => setQuantity(clampInteger(quantity - 1, 1, 25))}
                    className="p-1 hover:text-white text-slate-400 rounded transition-colors cursor-pointer"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="text-sm font-bold text-white font-mono px-2">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(clampInteger(quantity + 1, 1, 25))}
                    className="p-1 hover:text-white text-slate-400 rounded transition-colors cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Validation Error Alert */}
            {errorMessage && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-start gap-2">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Order Form */}
            <form onSubmit={handleOrder} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Delivery State
                </label>
                <select
                  value={deliveryState}
                  onChange={(e) => setDeliveryState(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
                >
                  <option value="Lagos">Lagos (Same day / 24h)</option>
                  <option value="Abuja FCT">Abuja FCT (24-48h)</option>
                  <option value="Rivers">Rivers / Port Harcourt (24-48h)</option>
                  <option value="Oyo">Oyo / Ibadan (24h)</option>
                  <option value="Kano">Kano (48h)</option>
                  <option value="Enugu">Enugu (48h)</option>
                  <option value="Other States">Other Nigerian State (24-72h)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Street Address & Landmark
                </label>
                <input
                  type="text"
                  required
                  maxLength={150}
                  placeholder="e.g. 24 Allen Avenue, Ikeja"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(cleanRawInput(e.target.value, 150))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Contact Phone Number
                </label>
                <input
                  type="tel"
                  required
                  maxLength={15}
                  placeholder="0801 234 5678"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value.replace(/[^0-9+]/g, '').slice(0, 14))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white font-mono placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              {/* Order total & CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 px-4 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-sm rounded-xl transition-all shadow-md shadow-emerald-500/15 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Confirm Order (₦{total.toLocaleString()})</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </form>

            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-center gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <Truck className="h-3.5 w-3.5 text-emerald-400" /> Nationwide Delivery
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" /> 1-Year Device Warranty
              </span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
