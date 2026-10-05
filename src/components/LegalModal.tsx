import React from 'react';
import { X, ShieldCheck } from 'lucide-react';

interface LegalModalProps {
  isOpen: boolean;
  type: 'terms' | 'privacy';
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ isOpen, type, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden max-h-[85vh] overflow-y-auto">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/60 hover:bg-slate-800 transition-colors"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">
          <ShieldCheck className="h-4 w-4" />
          <span>Compliance & Trust</span>
        </div>

        <h3 className="text-2xl font-bold text-white tracking-tight mb-4">
          {type === 'terms' ? 'Terms of Service' : 'Privacy & Data Protection Policy'}
        </h3>

        <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800 pt-4">
          {type === 'terms' ? (
            <>
              <p>
                <strong>1. Acceptance of Terms:</strong> By accessing and using the SUBPLUG platform, web applications, or reseller APIs, you agree to comply with and be bound by the terms and conditions outlined herein.
              </p>
              <p>
                <strong>2. Service Delivery & Automation:</strong> SUBPLUG acts as an authorized gateway communicating directly with licensed Nigerian telecommunication operators (MTN Nigeria, Airtel, Globacom, 9mobile) and utility distribution companies. All transactions are automated; in the unlikely event of an upstream telecom node failure, our system guarantees instant refund reversal to your wallet.
              </p>
              <p>
                <strong>3. Wallet Security & NDIC Virtual Accounts:</strong> Each customer is issued dedicated virtual accounts through our CBN-licensed banking partners. You are solely responsible for keeping your PIN, password, and API secrets confidential.
              </p>
              <p>
                <strong>4. Fair Use & Reseller Conduct:</strong> Resellers and API developers agree not to use the automated platform for fraudulent or unauthorized phishing campaigns.
              </p>
            </>
          ) : (
            <>
              <p>
                <strong>1. Information Collection:</strong> We collect minimal identifiable data required to execute telecom recharges and comply with Nigerian KYC standards, including phone numbers, email addresses, and transaction references.
              </p>
              <p>
                <strong>2. Payment Data Security:</strong> Debit card information is securely processed via PCI-DSS Level 1 certified gateways (e.g. Paystack/Interswitch). SUBPLUG does not store card numbers or CVV codes on our servers.
              </p>
              <p>
                <strong>3. NDPR Compliance:</strong> In accordance with the Nigeria Data Protection Regulation (NDPR), your private transaction data is encrypted with 256-bit SSL protocols and will never be sold or rented to third-party advertisers.
              </p>
            </>
          )}
        </div>

        <div className="mt-6 pt-4 border-t border-slate-800 text-right">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs rounded-xl transition-colors cursor-pointer"
          >
            I Understand
          </button>
        </div>

      </div>
    </div>
  );
};
